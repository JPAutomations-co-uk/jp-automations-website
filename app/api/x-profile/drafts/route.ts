import { createClient } from "@/app/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "20", 10)
  const type = searchParams.get("type") // "post" or "thread" or null for all

  let query = supabase
    .from("content_drafts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (type) {
    query = query.eq("type", type)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: "Failed to fetch drafts" }, { status: 500 })
  }

  return NextResponse.json({ drafts: data || [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  if (!body.type || !["post", "thread"].includes(body.type)) {
    return NextResponse.json({ error: "type must be 'post' or 'thread'" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("content_drafts")
    .insert({
      user_id: user.id,
      type: body.type,
      topic: body.topic || null,
      angle: body.angle || null,
      format: body.format || null,
      output_json: body.output_json || null,
      selected_variation: body.selected_variation || null,
      session_inputs: body.session_inputs || null,
    })
    .select()
    .single()

  if (error) {
    console.error("Content draft insert error:", error)
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 })
  }

  return NextResponse.json({ draft: data })
}
