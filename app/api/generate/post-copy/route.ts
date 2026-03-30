import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

const TOKEN_COST = 5

const VALID_FORMATS = ["reel", "carousel", "image", "story"]
const VALID_TONES = ["casual", "educational", "inspirational", "provocative"]

const getAnthropic = () =>
  new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function sanitiseProfileField(
  value: string | null | undefined,
  maxLen = 200
): string {
  if (!value) return ""
  return String(value)
    .replace(/[\n\r]/g, " ")
    .slice(0, maxLen)
    .trim()
}

function safeJsonParse(text: string): unknown | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/, "")
    .replace(/\s*```\s*$/, "")
    .trim()

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null

  try {
    return JSON.parse(jsonMatch[0])
  } catch {
    return null
  }
}

const TONE_DESCRIPTIONS: Record<string, string> = {
  casual:
    "Casual & conversational — like texting a friend. Contractions, slang where appropriate, warm and approachable. Short sentences. Relatable everyday language.",
  educational:
    "Educational & authoritative — position the author as an expert. Data points, specific insights, 'here's what most people don't know' energy. Clear and structured.",
  inspirational:
    "Inspirational & aspirational — emotionally charged, paint a vision of what's possible. Story-driven, future-focused, motivational. Makes the reader feel something.",
  provocative:
    "Provocative & bold — challenge the status quo, state unpopular opinions confidently. Pattern-interrupt energy. Makes people stop scrolling and either agree passionately or want to debate.",
}

function buildSystemPrompt(): string {
  return `You are an expert Instagram copywriter. You write captions in multiple distinct tones for the same content, giving creators genuine options — not slight rewrites but fundamentally different approaches to the same topic.

Your expertise:
- **Tone mastery**: You can write the same idea as a casual chat, an expert breakdown, an inspirational story, or a bold hot take — each one feeling authentic and complete.
- **Hook writing**: Every caption opens with a scroll-stopping first line. No generic openers.
- **Instagram formatting**: Line breaks for readability, emojis used sparingly and strategically (not every line), clean visual flow.
- **CTA writing**: Natural calls-to-action that fit the tone — casual CTAs for casual captions, authority CTAs for educational ones.

You ALWAYS respond with valid JSON only. No markdown fences, no explanation outside the JSON object.`
}

function buildPrompt(
  content: string,
  postFormat: string,
  tones: string[],
  includeHashtags: boolean,
  profile: {
    business_name?: string | null
    industry?: string | null
    target_audience?: string | null
    brand_voice?: string | null
    tone?: string | null
    location?: string | null
    instagram_handle?: string | null
  },
  brandTerms?: string
): string {
  const toneInstructions = tones
    .map(
      (t, i) =>
        `${i + 1}. **${t.charAt(0).toUpperCase() + t.slice(1)}**: ${TONE_DESCRIPTIONS[t] || "Write naturally."}`
    )
    .join("\n")

  return `Write ${tones.length} caption variation${tones.length > 1 ? "s" : ""} for this Instagram ${postFormat} post:

═══ CONTENT ═══
${content}

═══ POST FORMAT ═══
${postFormat.charAt(0).toUpperCase() + postFormat.slice(1)} post

═══ TONE VARIATIONS REQUIRED ═══
${toneInstructions}

═══ BRAND CONTEXT ═══
Business: ${sanitiseProfileField(profile.business_name) || "Not specified"}
Industry: ${sanitiseProfileField(profile.industry) || "General"}
Target Audience: ${sanitiseProfileField(profile.target_audience, 500) || "General audience"}
Brand Voice: ${sanitiseProfileField(profile.brand_voice) || "Professional"}
Tone: ${sanitiseProfileField(profile.tone) || "Friendly"}
Location: ${sanitiseProfileField(profile.location) || "UK"}
Instagram: ${sanitiseProfileField(profile.instagram_handle) ? `@${sanitiseProfileField(profile.instagram_handle)}` : "Not specified"}
${brandTerms ? `\n═══ BRAND TERMS TO INCLUDE ═══\nNaturally weave in these terms where relevant: ${brandTerms}` : ""}

═══ RULES ═══
1. Each variation must be GENUINELY different — different hook, different angle, different structure. Not just rewording.
2. Every caption must open with a scroll-stopping first line.
3. Caption length: 100-250 words each.
4. Each must include a natural CTA that matches the tone.
${includeHashtags ? "5. Include 8-12 hashtags per caption mixing broad discovery tags (500K-2M posts) with niche-specific tags (10K-100K posts)." : "5. Do NOT include any hashtags."}

═══ RESPONSE FORMAT ═══
Respond with this exact JSON structure (no markdown, no code fences):
{
  "variations": [
    {
      "style": "${tones[0]}",
      "hook": "The scroll-stopping first line",
      "body": "The main caption body (use \\n for line breaks)",
      "cta": "The call-to-action line",
      "full_caption": "The complete caption ready to paste: hook + body + cta${includeHashtags ? " + two line breaks + hashtags joined by spaces" : ""}",
      ${includeHashtags ? '"hashtags": ["hashtag1", "hashtag2", "hashtag3"]' : '"hashtags": []'}
    }
  ]
}`
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
    const { content, postFormat, tones, includeHashtags, brandTerms } = body

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    const safeFormat = VALID_FORMATS.includes(postFormat)
      ? postFormat
      : "reel"

    const safeTones = Array.isArray(tones)
      ? tones.filter((t: string) => VALID_TONES.includes(t))
      : ["casual", "educational", "inspirational"]

    if (safeTones.length === 0) {
      return NextResponse.json(
        { error: "At least one valid tone is required" },
        { status: 400 }
      )
    }

    const safeContent = String(content).slice(0, 2000).trim()
    const safeBrandTerms = brandTerms
      ? String(brandTerms).slice(0, 300).trim()
      : undefined

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "business_name, industry, target_audience, brand_voice, tone, location, instagram_handle"
      )
      .eq("id", user.id)
      .single()

    const userPrompt = buildPrompt(
      safeContent,
      safeFormat,
      safeTones,
      includeHashtags === true,
      profile || {},
      safeBrandTerms
    )

    const maxTokens = Math.min(safeTones.length * 1500, 6000)

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: maxTokens,
      system: buildSystemPrompt(),
      messages: [{ role: "user", content: userPrompt }],
    })

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : ""

    const parsed = safeJsonParse(responseText)
    if (!parsed || typeof parsed !== "object") {
      console.error(
        "Failed to parse post copy response:",
        responseText.slice(0, 500)
      )
      return NextResponse.json(
        { error: "Failed to parse generated copy" },
        { status: 500 }
      )
    }

    const obj = parsed as Record<string, unknown>
    if (!Array.isArray(obj.variations)) {
      return NextResponse.json(
        { error: "AI returned an unexpected response format" },
        { status: 500 }
      )
    }

    const admin = createAdminClient()
    try {
      const { data: newBalance, error: debitError } = await admin.rpc(
        "debit_tokens",
        {
          p_user_id: user.id,
          p_amount: TOKEN_COST,
          p_type: "feature_use",
          p_description: `Generated ${safeTones.length} post copy variation${safeTones.length > 1 ? "s" : ""}`,
        }
      )

      if (debitError) throw debitError

      return NextResponse.json({
        variations: obj.variations,
        balance: newBalance,
        deducted: TOKEN_COST,
      })
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err)
      if (errMessage.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Insufficient tokens", balance_needed: TOKEN_COST },
          { status: 402 }
        )
      }
      throw err
    }
  } catch (error) {
    console.error("Post copy generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate post copy" },
      { status: 500 }
    )
  }
}
