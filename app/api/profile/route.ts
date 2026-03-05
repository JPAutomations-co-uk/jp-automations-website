import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

const EDITABLE_FIELDS = [
  "display_name",
  "business_name",
  "website_url",
  "instagram_handle",
  "industry",
  "location",
  "target_audience",
  "brand_voice",
  "tone",
  "visual_style",
  "primary_color",
  "secondary_color",
  "voice_sample",
  // Extended onboarding fields
  "x_handle",
  "linkedin_handle",
  "offers",
  "usp",
  "primary_cta",
  "proof_points",
  "onboarding_complete",
] as const

function isMissingColumnError(error: { message?: string } | null, column: string): boolean {
  return String(error?.message || "").includes(column)
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: fullData, error: fullError } = await supabase
    .from("profiles")
    .select(
      "display_name, business_name, website_url, instagram_handle, industry, location, target_audience, brand_voice, tone, visual_style, primary_color, secondary_color, voice_sample, x_handle, linkedin_handle, offers, usp, primary_cta, proof_points, onboarding_complete, subscription_tier, subscription_status"
    )
    .eq("id", user.id)
    .single()

  if (!fullError) {
    return NextResponse.json({ profile: fullData, email: user.email })
  }

  if (!isMissingColumnError(fullError, "voice_sample")) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("profiles")
    .select(
      "display_name, business_name, website_url, instagram_handle, industry, location, target_audience, brand_voice, tone, visual_style, primary_color, secondary_color, x_handle, linkedin_handle, offers, usp, primary_cta, proof_points, onboarding_complete, subscription_tier, subscription_status"
    )
    .eq("id", user.id)
    .single()

  if (fallbackError) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  return NextResponse.json({
    profile: {
      ...((fallbackData || {}) as Record<string, unknown>),
      voice_sample: null,
      x_handle: null,
      linkedin_handle: null,
      offers: null,
      usp: null,
      primary_cta: null,
      proof_points: null,
      onboarding_complete: true, // Assume complete for existing users missing new columns
    },
    email: user.email,
  })
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

  // Only allow known fields
  const updates: Record<string, unknown> = {}
  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      updates[field] = body[field]
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from("profiles")
    .update(updates as never)
    .eq("id", user.id)

  if (isMissingColumnError(error, "voice_sample") && "voice_sample" in updates) {
    const fallbackUpdates = { ...updates }
    delete fallbackUpdates.voice_sample

    const { error: retryError } = await admin
      .from("profiles")
      .update(fallbackUpdates as never)
      .eq("id", user.id)

    if (!retryError) {
      return NextResponse.json({ success: true, warning: "voice_sample column missing in DB; value not saved" })
    }

    console.error("Profile update retry error:", retryError)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }

  if (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
