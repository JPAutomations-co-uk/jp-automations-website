import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { isAdminUser } from "@/app/lib/security/server"

export async function GET() {
  try {
    // Auth check — admin only
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isAdminUser(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const now = new Date()
    const weekStart = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime() / 1000)
    const prevWeekStart = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14).getTime() / 1000)
    const monthStart = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const adminSupabase = createAdminClient()

    const [
      chargesThisWeek,
      chargesLastWeek,
      chargesThisMonth,
      subscriptions,
      usersResult,
    ] = await Promise.all([
      stripe.charges.list({ created: { gte: weekStart }, limit: 100 }),
      stripe.charges.list({ created: { gte: prevWeekStart, lt: weekStart }, limit: 100 }),
      stripe.charges.list({ created: { gte: monthStart }, limit: 100 }),
      stripe.subscriptions.list({ status: "active", limit: 100 }),
      adminSupabase.auth.admin.listUsers(),
    ])

    // Revenue (successful charges only, in GBP pence → pounds)
    const revenueThisWeek = chargesThisWeek.data
      .filter((c) => c.paid && !c.refunded)
      .reduce((sum, c) => sum + c.amount, 0) / 100

    const revenueLastWeek = chargesLastWeek.data
      .filter((c) => c.paid && !c.refunded)
      .reduce((sum, c) => sum + c.amount, 0) / 100

    const revenueThisMonth = chargesThisMonth.data
      .filter((c) => c.paid && !c.refunded)
      .reduce((sum, c) => sum + c.amount, 0) / 100

    // MRR from active subscriptions
    const mrr = subscriptions.data.reduce((sum, sub) => {
      const item = sub.items.data[0]
      const price = item?.price
      if (!price?.unit_amount) return sum
      if (price.recurring?.interval === "month") return sum + price.unit_amount / 100
      if (price.recurring?.interval === "year") return sum + price.unit_amount / 100 / 12
      return sum
    }, 0)

    // New paying customers this week
    const newCustomersThisWeek = chargesThisWeek.data
      .filter((c) => c.paid && !c.refunded)
      .map((c) => c.customer)
      .filter((v, i, a) => a.indexOf(v) === i).length

    // Supabase signups
    const allUsers = usersResult.data?.users ?? []
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const newSignupsThisWeek = allUsers.filter(
      (u) => new Date(u.created_at) > weekAgo
    ).length
    const totalUsers = allUsers.length

    return NextResponse.json({
      revenue: {
        thisWeek: revenueThisWeek,
        lastWeek: revenueLastWeek,
        thisMonth: revenueThisMonth,
        mrr,
        newCustomersThisWeek,
      },
      users: {
        total: totalUsers,
        newThisWeek: newSignupsThisWeek,
      },
    })
  } catch (err) {
    console.error("Analytics API error:", err)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
