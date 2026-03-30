import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from("content_feedback")
      .select("id, content_type, feedback_text, content_snapshot, created_at")
      .eq("user_id", user.id)
      .eq("positive", true)
      .order("created_at", { ascending: false })
      .limit(100) as { data: { id: string; content_type: string; feedback_text: string | null; content_snapshot: Record<string, unknown> | null; created_at: string }[] | null; error: unknown }

    if (error) {
      return NextResponse.json({ error: "Failed to load saved items" }, { status: 500 })
    }

    return NextResponse.json({ items: data ?? [] })
  } catch {
    return NextResponse.json({ error: "Failed to load saved items" }, { status: 500 })
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
    const { content_type, positive, feedback_text, content_snapshot } = body

    if (!content_type || typeof positive !== "boolean") {
      return NextResponse.json({ error: "content_type and positive are required" }, { status: 400 })
    }

    const admin = createAdminClient()
    const { error: insertError } = await admin
      .from("content_feedback")
      .insert({
        user_id: user.id,
        content_type,
        positive,
        feedback_text: feedback_text || null,
        content_snapshot: content_snapshot || null,
      } as never)

    if (insertError) {
      console.error("Feedback insert error:", insertError)
      return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
  }
}
