import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("profiles")
    .select("tone_profile")
    .eq("id", user.id)
    .single()

  if (error) {
    return NextResponse.json({ profile: null })
  }

  // tone_profile is a jsonb column added to profiles table
  const row = data as Record<string, unknown> | null
  return NextResponse.json({ profile: row?.tone_profile || null })
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { profile, demoPost } = body

  if (!profile || !demoPost) {
    return NextResponse.json({ error: "Profile and demoPost required" }, { status: 400 })
  }

  const toneProfile = {
    ...profile,
    demoPost,
    status: "confirmed",
    updatedAt: new Date().toISOString(),
  }

  // tone_profile is a jsonb column we add to profiles — bypass generated types
  const admin = createAdminClient()
  const updatePayload = {
    tone_profile: toneProfile,
    tone: profile.summary,
    voice_sample: profile.systemPrompt,
  }

  // @ts-expect-error — tone_profile column not yet in generated Supabase types
  const { error } = await admin.from("profiles").update(updatePayload).eq("id", user.id)

  if (error) {
    console.error("Failed to save tone profile:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }

  return NextResponse.json({ success: true, profile: toneProfile })
}
