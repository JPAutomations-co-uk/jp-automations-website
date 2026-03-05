import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"

const STATUS_VALUES = ["draft", "scheduled", "published", "failed"] as const
const ALLOWED_UPDATE_FIELDS = new Set([
  "date",
  "day_of_week",
  "format",
  "funnel_stage",
  "pillar",
  "topic",
  "caption_hook",
  "caption_body",
  "hashtags",
  "posting_time",
  "status",
  "instagram_media_id",
  "instagram_permalink",
  "published_at",
  "meta",
  "quality_score",
  "evidence_refs",
  "primary_kpi",
  "plan_id",
])

function parseMonthRange(month: string): { startDate: string; endDate: string } | null {
  if (!/^\d{4}-\d{2}$/.test(month)) return null
  const [year, monthNum] = month.split("-").map(Number)
  if (monthNum < 1 || monthNum > 12) return null

  const start = new Date(Date.UTC(year, monthNum - 1, 1))
  const end = new Date(Date.UTC(year, monthNum, 0))
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get("planId")
    const month = searchParams.get("month")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from("posts")
      .select("*, generated_assets(*)")
      .eq("user_id", user.id)
      .order("date", { ascending: true })

    if (planId) {
      query = query.eq("plan_id", planId)
    }

    if (month) {
      const range = parseMonthRange(month)
      if (!range) {
        return NextResponse.json(
          { error: "month must be in YYYY-MM format" },
          { status: 400 }
        )
      }
      query = query.gte("date", range.startDate).lte("date", range.endDate)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ posts: data })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    if (!body.date || !body.format) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (body.status && !STATUS_VALUES.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        ...body,
        user_id: user.id,
        status: body.status || "draft",
      } as never)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const { id, ...rawUpdates } = body

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const updates: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(rawUpdates)) {
      if (ALLOWED_UPDATE_FIELDS.has(key)) {
        updates[key] = value
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    if (
      updates.status !== undefined &&
      typeof updates.status === "string" &&
      !STATUS_VALUES.includes(updates.status as (typeof STATUS_VALUES)[number])
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("posts")
      .update(updates as never)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}
