import { createClient } from "@/app/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("voice_examples")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: "Failed to fetch voice examples" }, { status: 500 })
  }

  return NextResponse.json({ examples: data || [] })
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

  if (!body.post_text?.trim()) {
    return NextResponse.json({ error: "post_text is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("voice_examples")
    .insert({
      user_id: user.id,
      post_text: body.post_text.trim(),
      performance_label: body.performance_label || null,
      likes: body.likes || 0,
      reposts: body.reposts || 0,
      impressions: body.impressions || 0,
      source: body.source || "manual",
    })
    .select()
    .single()

  if (error) {
    console.error("Voice example insert error:", error)
    return NextResponse.json({ error: "Failed to save voice example" }, { status: 500 })
  }

  return NextResponse.json({ example: data })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }

  const { error } = await supabase
    .from("voice_examples")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Voice example delete error:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
