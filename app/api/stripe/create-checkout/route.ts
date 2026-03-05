import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!)

// Subscription price IDs (Pro & Business monthly plans)
const SUBSCRIPTION_PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_PRO_MONTHLY!,
  business: process.env.STRIPE_PRICE_BUSINESS_MONTHLY!,
}

// Token pack price IDs (one-time purchases)
const TOKEN_PRICE_IDS: Record<number, string> = {
  25: process.env.STRIPE_PRICE_TOKENS_25!,
  100: process.env.STRIPE_PRICE_TOKENS_100!,
  250: process.env.STRIPE_PRICE_TOKENS_250!,
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create Stripe customer for this user
    const admin = createAdminClient()
    const { data: profileRaw } = await admin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    const profile = (profileRaw || null) as { stripe_customer_id?: string | null } | null
    let stripeCustomerId = profile?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      stripeCustomerId = customer.id

      await admin
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId } as never)
        .eq("id", user.id)
    }

    const body = await request.json()
    const { tier, tokenPack } = body

    // Handle token pack purchases (one-time payment)
    if (tier === "tokens" && tokenPack) {
      const priceId = TOKEN_PRICE_IDS[tokenPack as number]
      if (!priceId) {
        return NextResponse.json(
          { error: "Invalid token pack" },
          { status: 400 }
        )
      }

      const session = await getStripe().checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: {
          type: "token_pack",
          tokens: String(tokenPack),
          supabase_user_id: user.id,
        },
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?purchased=tokens&amount=${tokenPack}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      })

      return NextResponse.json({ url: session.url })
    }

    // Handle subscription plans (Pro & Business)
    if (!tier) {
      return NextResponse.json(
        { error: "Missing tier" },
        { status: 400 }
      )
    }

    const priceId = SUBSCRIPTION_PRICE_IDS[tier]
    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid tier" },
        { status: 400 }
      )
    }

    const session = await getStripe().checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        type: "subscription",
        tier,
        supabase_user_id: user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?purchased=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
