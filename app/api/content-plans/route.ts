import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const month = searchParams.get("month")

    let query = supabase
      .from("content_plans")
      .select("id, month, quality_mode, quality_report, research_summary, brief_snapshot, generation_version, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)

    if (id) {
      query = query.eq("id", id)
    } else if (month) {
      query = query.eq("month", month)
    }

    const { data, error } = await query

    if (error) throw error

    const plan = data?.[0] || null
    return NextResponse.json({ plan })
  } catch (error) {
    console.error("Content plans fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch content plan" }, { status: 500 })
  }
}
