import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { google } from "googleapis"
import { createAdminClient } from "@/app/lib/supabase/admin"

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!)

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!
const SHEET_ID = process.env.MASTER_INTAKE_SHEET_ID

async function getSheetClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
  return google.sheets({ version: "v4", auth })
}

async function findRowByStripeId(
  sheets: ReturnType<typeof google.sheets>,
  customerId: string
): Promise<number | null> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID!,
    range: "Sheet1!A:A",
  })

  const rows = response.data.values || []
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === customerId) return i + 1
  }
  return null
}

async function updateSubscriptionStatus(
  customerId: string,
  status: string
) {
  if (!SHEET_ID) return
  try {
    const sheets = await getSheetClient()
    const rowIndex = await findRowByStripeId(sheets, customerId)
    if (!rowIndex) return

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Sheet1!C${rowIndex}`,
      valueInputOption: "RAW",
      requestBody: { values: [[status]] },
    })
  } catch (err) {
    console.error("Google Sheets update error:", err)
  }
}

async function createIncompleteRow(
  customerId: string,
  email: string,
  tier: string,
  billingCycle: string
) {
  if (!SHEET_ID) return
  try {
    const sheets = await getSheetClient()
    const existing = await findRowByStripeId(sheets, customerId)
    if (existing) return

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:A",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            customerId, email, "incomplete", tier, billingCycle,
            "", "", "[]", "[]",
          ],
        ],
      },
    })
  } catch (err) {
    console.error("Google Sheets append error:", err)
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const admin = createAdminClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string
        const email = session.customer_details?.email || ""
        const userId = session.metadata?.supabase_user_id
        const type = session.metadata?.type

        // Credit tokens for token pack purchases
        if (type === "token_pack" && userId) {
          const tokens = parseInt(session.metadata?.tokens || "0")
          if (tokens > 0) {
            await admin.rpc("credit_tokens", {
              p_user_id: userId,
              p_amount: tokens,
              p_type: "purchase",
              p_description: `Purchased ${tokens} token pack`,
              p_stripe_session_id: session.id,
            } as never)
            console.log(`Credited ${tokens} tokens to user ${userId}`)
          }
        }

        // Update profile for subscription purchases
        if (type === "subscription" && userId) {
          const tier = session.metadata?.tier || "pro"
          await admin
            .from("profiles")
            .update({
              subscription_tier: tier,
              subscription_status: "active",
              stripe_customer_id: customerId,
            } as never)
            .eq("id", userId)
          console.log(`Activated ${tier} subscription for user ${userId}`)
        }

        // Keep Google Sheets writes during migration
        const tier = session.metadata?.tier || "starter"
        const billingCycle = session.metadata?.billingCycle || "monthly"
        await createIncompleteRow(customerId, email, tier, billingCycle)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const status = subscription.status === "active" ? "active" : subscription.status

        // Update Supabase profile
        const { data: profileRaw } = await admin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()
        const profile = (profileRaw || null) as { id?: string } | null

        if (profile?.id) {
          await admin
            .from("profiles")
            .update({ subscription_status: status } as never)
            .eq("id", profile.id)
        }

        // Keep Google Sheets updates during migration
        await updateSubscriptionStatus(customerId, status)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profileRaw } = await admin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()
        const profile = (profileRaw || null) as { id?: string } | null

        if (profile?.id) {
          await admin
            .from("profiles")
            .update({
              subscription_status: "canceled",
              subscription_tier: "free",
            } as never)
            .eq("id", profile.id)
        }

        await updateSubscriptionStatus(customerId, "canceled")
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: profileRaw } = await admin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()
        const profile = (profileRaw || null) as { id?: string } | null

        if (profile?.id) {
          await admin
            .from("profiles")
            .update({ subscription_status: "past_due" } as never)
            .eq("id", profile.id)
        }

        await updateSubscriptionStatus(customerId, "past_due")
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
