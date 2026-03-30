import { createAdminClient } from "@/app/lib/supabase/admin"

// ─── Types ───────────────────────────────────────────────────────────────────

export type Platform = "linkedin" | "instagram" | "x" | "youtube"

export interface FullProfile {
  business_name: string | null
  business_description: string | null
  website_url: string | null
  location: string | null
  industry: string | null
  use_case: string | null
  target_audience: string | null
  offers: string | null
  usp: string | null
  primary_cta: string | null
  proof_points: string | null
  goals: string | null
  desired_outcomes: string | null
  content_pillars: string[] | null
  tone: string | null
  voice_sample: string | null
  brand_voice: string | null
  instagram_handle: string | null
  x_handle: string | null
  linkedin_handle: string | null
}

export interface PlatformProfile {
  tone: string | null
  voice_sample: string | null
  copy_examples: string[] | null
  example_image_urls: string[] | null
  style_description: string | null
  goals: string | null
  primary_cta: string | null
  content_pillars: string[] | null
  posting_frequency: number | null
  handle: string | null
}

export interface ProfileContext {
  profile: FullProfile
  platformProfile: PlatformProfile | null
  contextBlock: string
  extras: PlatformExtras
}

/** Platform-specific extras stored as JSON in style_description */
interface PlatformExtras {
  name?: string
  niche?: string
  audience_description?: string
  hook_style?: string
  caption_length?: string
  hashtag_strategy?: string
  content_format?: string
  visual_aesthetic?: string
  banned_words?: string[]
  voice_traits?: string[]
  current_followers?: number
  writing_style?: string
  proof_points?: string
  style_reference?: string
  speaking_style?: string
  growth_goal?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function field(value: string | null | undefined, fallback = "Not provided"): string {
  const trimmed = String(value ?? "").trim()
  return trimmed || fallback
}

function listField(values: string[] | null | undefined): string {
  if (!values || values.length === 0) return "Not provided"
  return values.filter(Boolean).join(", ")
}

function parseExtras(raw: string | null): PlatformExtras {
  if (!raw) return {}
  try {
    return JSON.parse(raw) as PlatformExtras
  } catch {
    return {}
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

/**
 * Fetches the user's base profile + platform-specific profile and builds
 * a formatted context block for injection into AI prompts.
 */
export async function getProfileContext(
  userId: string,
  platform: Platform
): Promise<ProfileContext> {
  const admin = createAdminClient()

  // Fetch base profile
  const { data: profileData } = await admin
    .from("profiles")
    .select(
      "business_name, business_description, website_url, location, industry, use_case, " +
      "target_audience, offers, usp, primary_cta, proof_points, " +
      "goals, desired_outcomes, content_pillars, " +
      "tone, voice_sample, brand_voice, " +
      "instagram_handle, x_handle, linkedin_handle"
    )
    .eq("id", userId)
    .single()

  const profile: FullProfile = (profileData as unknown as FullProfile) || {
    business_name: null, business_description: null, website_url: null,
    location: null, industry: null, use_case: null, target_audience: null,
    offers: null, usp: null, primary_cta: null, proof_points: null,
    goals: null, desired_outcomes: null, content_pillars: null,
    tone: null, voice_sample: null, brand_voice: null,
    instagram_handle: null, x_handle: null, linkedin_handle: null,
  }

  // Fetch platform-specific profile
  let platformProfile: PlatformProfile | null = null
  try {
    const { data: ppData } = await admin
      .from("platform_profiles")
      .select(
        "tone, voice_sample, copy_examples, example_image_urls, style_description, " +
        "goals, primary_cta, content_pillars, posting_frequency, handle"
      )
      .eq("user_id", userId)
      .eq("platform", platform)
      .single()

    platformProfile = ppData as PlatformProfile | null
  } catch {
    // Table may not exist yet — graceful fallback
  }

  // Parse platform-specific extras from style_description JSON
  const extras = parseExtras(platformProfile?.style_description ?? null)

  // Build context block — platform profile overrides base profile where set
  const tone = field(platformProfile?.tone || profile.tone, "Professional but approachable")
  const cta = field(platformProfile?.primary_cta || profile.primary_cta)
  const goals = field(platformProfile?.goals || profile.goals)
  const pillars = listField(platformProfile?.content_pillars?.length ? platformProfile.content_pillars : profile.content_pillars)
  const voiceSample = field(platformProfile?.voice_sample || profile.voice_sample)
  const copyExamples = platformProfile?.copy_examples?.filter(Boolean) || []

  // Proof points: extras override > base profile
  const proofPoints = field(extras.proof_points || profile.proof_points)

  const platformLabel = platform.charAt(0).toUpperCase() + platform.slice(1)

  const useCaseLabel = profile.use_case === "creator" ? "Influencer / Creator"
    : profile.use_case === "career" ? "Career Growth"
    : "Business Owner"

  let contextBlock = `═══ IDENTITY ═══
Type: ${useCaseLabel}
Name: ${field(extras.name || profile.business_name)}
Industry: ${field(extras.niche || profile.industry)}
Location: ${field(profile.location)}
Website: ${field(profile.website_url)}
Description: ${field(profile.business_description)}

═══ WHAT THEY SELL ═══
Offers: ${field(profile.offers)}
USP (what makes them different): ${field(profile.usp)}
Proof points / results: ${proofPoints}

═══ TARGET AUDIENCE ═══
${field(extras.audience_description || profile.target_audience, "Business professionals")}

═══ GOALS & STRATEGY ═══
Primary goal: ${goals}
Desired outcomes: ${field(profile.desired_outcomes)}
Content pillars: ${pillars}

═══ PLATFORM: ${platformLabel.toUpperCase()} — VOICE & STYLE ═══
Tone: ${tone}
Default CTA: ${cta}
Writing style: ${field(extras.writing_style)}
Hook style: ${field(extras.hook_style)}
Caption length preference: ${field(extras.caption_length)}
Hashtag strategy: ${field(extras.hashtag_strategy)}
Content format preference: ${field(extras.content_format)}
Visual aesthetic: ${field(extras.visual_aesthetic)}`

  // Voice traits
  if (extras.voice_traits && extras.voice_traits.length > 0) {
    contextBlock += `\nVoice characteristics: ${extras.voice_traits.join(", ")}`
  }

  // Banned words
  if (extras.banned_words && extras.banned_words.length > 0) {
    contextBlock += `\nBanned words/phrases: ${extras.banned_words.join(", ")}`
  }

  // Account growth context
  if (extras.current_followers || extras.growth_goal) {
    contextBlock += `\n\n═══ ACCOUNT GROWTH ═══`
    if (extras.current_followers) contextBlock += `\nCurrent followers: ${extras.current_followers.toLocaleString()}`
    if (extras.growth_goal) contextBlock += `\nGrowth goal: ${extras.growth_goal}`
  }

  // Speaking style (for reels)
  if (extras.speaking_style) {
    const speakingLabels: Record<string, string> = {
      fast_energetic: "Fast & energetic — high energy, punchy delivery, rapid cuts",
      calm_measured: "Calm & measured — steady pace, confident, authoritative",
      story_driven: "Story-driven — conversational, narrative, builds tension",
      data_driven: "Data-driven — structured, precise, evidence-based",
    }
    contextBlock += `\n\n═══ SPEAKING STYLE (for reels/video) ═══\n${speakingLabels[extras.speaking_style] || extras.speaking_style}`
  }

  // Copy examples — critical for voice matching
  if (copyExamples.length > 0) {
    contextBlock += `\n\n═══ COPY EXAMPLES — MATCH THIS STYLE ═══`
    copyExamples.forEach((ex, i) => {
      contextBlock += `\n\nExample ${i + 1}:\n${String(ex).slice(0, 1500)}`
    })
  }

  // Voice sample
  if (voiceSample !== "Not provided") {
    contextBlock += `\n\n═══ VOICE SAMPLE — WRITE LIKE THIS ═══\n${voiceSample}`
  }

  // Style reference (caption from someone they admire)
  if (extras.style_reference) {
    contextBlock += `\n\n═══ STYLE REFERENCE — MATCH THIS ENERGY ═══\n${extras.style_reference.slice(0, 2000)}`
  }

  return { profile, platformProfile, contextBlock, extras }
}
