import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

const VALID_PLATFORMS = ["linkedin", "instagram", "x", "youtube"] as const
type Platform = (typeof VALID_PLATFORMS)[number]

// GET — Fetch platform profile(s) for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const platform = request.nextUrl.searchParams.get("platform") as Platform | null

    const admin = createAdminClient()

    if (platform && VALID_PLATFORMS.includes(platform)) {
      const { data, error } = await admin
        .from("platform_profiles")
        .select("*")
        .eq("user_id", user.id)
        .eq("platform", platform)
        .single()

      if (error || !data) {
        return NextResponse.json({ platformProfile: null })
      }
      return NextResponse.json({ platformProfile: data })
    }

    // Return all platform profiles
    const { data, error } = await admin
      .from("platform_profiles")
      .select("*")
      .eq("user_id", user.id)
      .order("platform")

    if (error) {
      console.error("Platform profiles fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch platform profiles" }, { status: 500 })
    }

    return NextResponse.json({ platformProfiles: data || [] })
  } catch (error) {
    console.error("Platform profiles GET error:", error)
    return NextResponse.json({ error: "Failed to fetch platform profiles" }, { status: 500 })
  }
}

// POST — Create or update a platform profile (upsert)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { platform, ...fields } = body

    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json({ error: "Valid platform is required (linkedin, instagram, x, youtube)" }, { status: 400 })
    }

    // Sanitize fields
    const updates: Record<string, unknown> = {
      user_id: user.id,
      platform,
      updated_at: new Date().toISOString(),
    }

    const allowedFields = [
      "tone", "voice_sample", "copy_examples", "example_image_urls",
      "style_description", "goals", "primary_cta", "content_pillars",
      "posting_frequency", "handle",
    ]

    for (const field of allowedFields) {
      if (field in fields) {
        updates[field] = fields[field]
      }
    }

    const admin = createAdminClient()

    // Upsert: insert or update on conflict (user_id, platform)
    const { data, error } = await admin
      .from("platform_profiles")
      .upsert(updates as never, { onConflict: "user_id,platform" })
      .select("id")
      .single()

    if (error) {
      console.error("Platform profile upsert error:", error)
      return NextResponse.json({ error: "Failed to save platform profile" }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("Platform profiles POST error:", error)
    return NextResponse.json({ error: "Failed to save platform profile" }, { status: 500 })
  }
}
