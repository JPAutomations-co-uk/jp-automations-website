import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

/**
 * Instagram profile stored in `platform_profiles` (platform = 'instagram').
 *
 * Standard columns: tone, handle, primary_cta, goals, content_pillars, voice_sample, copy_examples
 * Instagram-specific extras: stored as JSON in `style_description`
 */

interface InstagramExtras {
  name?: string
  niche?: string
  audience_description?: string
  hook_style?: string
  caption_length?: string
  hashtag_strategy?: string
  content_format?: string
  visual_aesthetic?: string
  banned_words?: string[]
  current_followers?: number
  writing_style?: string
  proof_points?: string
  style_reference?: string
  speaking_style?: string
  growth_goal?: string
}

function parseExtras(raw: string | null): InstagramExtras {
  if (!raw) return {}
  try {
    return JSON.parse(raw) as InstagramExtras
  } catch {
    return {}
  }
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const admin = createAdminClient()

  const { data, error } = await admin
    .from("platform_profiles")
    .select("*")
    .eq("user_id", user.id)
    .eq("platform", "instagram")
    .single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ profile: null })
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const row = data as any
  const extras = parseExtras(row.style_description)

  return NextResponse.json({
    profile: {
      handle: row.handle,
      tone: row.tone,
      primary_cta: row.primary_cta,
      goals: row.goals,
      content_pillars: row.content_pillars,
      voice_sample: row.voice_sample,
      copy_examples: row.copy_examples,
      ...extras,
    },
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
  const admin = createAdminClient()

  // Build extras JSON for style_description
  const extras: InstagramExtras = {}
  if (body.name) extras.name = String(body.name).slice(0, 100)
  if (body.niche) extras.niche = String(body.niche).slice(0, 200)
  if (body.audience_description)
    extras.audience_description = String(body.audience_description).slice(0, 500)
  if (body.hook_style) extras.hook_style = String(body.hook_style)
  if (body.caption_length) extras.caption_length = String(body.caption_length)
  if (body.hashtag_strategy) extras.hashtag_strategy = String(body.hashtag_strategy)
  if (body.content_format) extras.content_format = String(body.content_format)
  if (body.visual_aesthetic) extras.visual_aesthetic = String(body.visual_aesthetic)
  if (body.writing_style) extras.writing_style = String(body.writing_style)
  if (body.current_followers !== undefined)
    extras.current_followers = Number(body.current_followers) || 0
  if (body.banned_words) {
    extras.banned_words = Array.isArray(body.banned_words)
      ? body.banned_words
      : String(body.banned_words)
          .split(",")
          .map((w: string) => w.trim())
          .filter(Boolean)
  }
  // New high-impact fields
  if (body.proof_points) extras.proof_points = String(body.proof_points).slice(0, 1000)
  if (body.style_reference)
    extras.style_reference = String(body.style_reference).slice(0, 2000)
  if (body.speaking_style) extras.speaking_style = String(body.speaking_style)
  if (body.growth_goal) extras.growth_goal = String(body.growth_goal).slice(0, 500)

  const tone = Array.isArray(body.tone)
    ? (body.tone as string[]).join(", ")
    : body.tone || null

  // Parse copy_examples — can come as array (already parsed) or string
  let copyExamples: string[] | null = null
  if (body.copy_examples) {
    if (Array.isArray(body.copy_examples)) {
      copyExamples = body.copy_examples.filter(Boolean).slice(0, 5)
    } else {
      copyExamples = String(body.copy_examples)
        .split("---")
        .map((s: string) => s.trim())
        .filter(Boolean)
        .slice(0, 5)
    }
    if (copyExamples && copyExamples.length === 0) copyExamples = null
  }

  const profileData = {
    user_id: user.id,
    platform: "instagram" as const,
    tone: tone || null,
    handle: body.handle ? String(body.handle).replace(/^@/, "").slice(0, 100) : null,
    primary_cta: body.cta_preference ? String(body.cta_preference) : null,
    goals: body.growth_goal ? String(body.growth_goal).slice(0, 500) : null,
    style_description: JSON.stringify(extras),
    content_pillars: body.content_pillars || null,
    voice_sample: body.voice_sample ? String(body.voice_sample).slice(0, 2000) : null,
    copy_examples: copyExamples,
  }

  const { error } = await admin
    .from("platform_profiles")
    .upsert(profileData as never, { onConflict: "user_id,platform" })

  if (error) {
    console.error("instagram profile upsert error:", error)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }

  // Also update base profiles with audience info & proof points if not already set
  const baseUpdates: Record<string, string> = {}
  if (extras.audience_description) baseUpdates.target_audience = extras.audience_description
  if (extras.proof_points) baseUpdates.proof_points = extras.proof_points

  if (Object.keys(baseUpdates).length > 0) {
    for (const [col, val] of Object.entries(baseUpdates)) {
      await admin
        .from("profiles")
        .update({ [col]: val } as never)
        .eq("id", user.id)
        .is(col, null)
    }
  }

  return NextResponse.json({ success: true })
}
