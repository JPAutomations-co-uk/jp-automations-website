import { createClient } from "@/app/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const ALLOWED_FIELDS = [
  "name",
  "niche",
  "audience_description",
  "tone",
  "writing_style",
  "hook_style",
  "post_length_preference",
  "hashtag_preference",
  "banned_words",
  "cta_preference",
  "current_followers",
  "growth_goal",
  "growth_timeframe",
  "secondary_metric",
  "thread_structure_preference",
] as const

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("x_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }

  return NextResponse.json({ profile: data || null })
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  // Filter to allowed fields only
  const updates: Record<string, unknown> = { id: user.id }
  for (const field of ALLOWED_FIELDS) {
    if (field in body) {
      updates[field] = body[field]
    }
  }

  if (Object.keys(updates).length <= 1) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
  }

  const { error } = await supabase
    .from("x_profiles")
    .upsert(updates as never, { onConflict: "id" })

  if (error) {
    console.error("x_profile upsert error:", error)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
