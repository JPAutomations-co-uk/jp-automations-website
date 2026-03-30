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
  "goals",
  "desired_outcomes",
  "content_pillars",
  "business_description",
  "x_handle",
  "linkedin_handle",
  "offers",
  "usp",
  "primary_cta",
  "proof_points",
  "use_case",
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
      "display_name, business_name, business_description, website_url, instagram_handle, industry, location, target_audience, brand_voice, tone, visual_style, primary_color, secondary_color, voice_sample, x_handle, linkedin_handle, offers, usp, primary_cta, proof_points, use_case, goals, desired_outcomes, content_pillars, onboarding_complete, subscription_tier, subscription_status"
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
      "display_name, business_name, website_url, instagram_handle, industry, location, target_audience, brand_voice, tone, visual_style, primary_color, secondary_color, x_handle, linkedin_handle, offers, usp, primary_cta, proof_points, content_pillars, onboarding_complete, subscription_tier, subscription_status"
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

  // Strip columns that are known to be missing in some environments
  const safeUpdates = { ...updates }
  const knownOptionalColumns = ["voice_sample", "use_case"]

  const { error } = await admin
    .from("profiles")
    .upsert({ id: user.id, email: user.email, ...safeUpdates } as never, { onConflict: "id" })

  if (error) {
    // Strip any missing optional columns and retry once
    const stripped = knownOptionalColumns.filter((col) => isMissingColumnError(error, col) && col in safeUpdates)
    if (stripped.length > 0) {
      stripped.forEach((col) => delete safeUpdates[col])
      const { error: retryError } = await admin
        .from("profiles")
        .upsert({ id: user.id, email: user.email, ...safeUpdates } as never, { onConflict: "id" })

      if (!retryError) {
        return NextResponse.json({ success: true, warning: `Columns not in DB schema skipped: ${stripped.join(", ")}` })
      }

      console.error("Profile upsert retry error:", retryError)
      return NextResponse.json({ error: retryError.message || "Failed to update profile" }, { status: 500 })
    }

    console.error("Profile upsert error:", error)
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
