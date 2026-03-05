import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      customerId: session.customer,
      email: session.customer_details?.email || "",
      tier: session.metadata?.tier || "",
      billingCycle: session.metadata?.billingCycle || "",
    })
  } catch (error) {
    console.error("Session lookup error:", error)
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }
}
