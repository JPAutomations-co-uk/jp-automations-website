import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import { getProfileContext } from "@/app/lib/profile-context"
import {
  buildInstagramSystemPrompt,
  getUserFeedbackContext,
  INSTAGRAM_GOAL_CTA_MAP,
} from "@/app/lib/instagram-master-prompt"

const TOKEN_COST = 3

const VALID_GOALS = ["saves", "engagement", "followers", "leads"]
const VALID_FORMATS = ["auto", "carousel", "reel_script", "single"]
const VALID_ANGLES = ["educational", "bts", "transformation", "hot_take"]

const FORMAT_DESCRIPTIONS: Record<string, string> = {
  auto: "Choose the best Instagram format for this content and goal. Consider carousel for educational, reel script for viral, single image for personal stories.",
  carousel: "Write a carousel post: Hook caption + 5-8 slide breakdowns. Each slide = 1 key point (headline + 1-2 sentence explanation). Slide 1 = hook. Last slide = CTA. Caption provides context.",
  reel_script: "Write a Reel script: text overlay captions (max 8 words each) + voiceover script. Hook in first 1-3 seconds. 30-60 seconds total. Caption adds context + CTA.",
  single: "Write a single image caption: strong hook, story/value in the body, CTA at end. 300-1500 characters optimal.",
}

const ANGLE_DESCRIPTIONS: Record<string, string> = {
  educational: "Teach something actionable. Framework, steps, or insights the audience can apply immediately.",
  bts: "Behind the scenes. Show the real process, the mess, the work. Authenticity-first.",
  transformation: "Before/after. Show the journey, the change, the results. Concrete and measurable.",
  hot_take: "Bold, contrarian opinion. Challenge conventional wisdom. Invite debate.",
}

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function safeJsonParse(text: string): unknown | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```\s*$/m, "")
    .trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null
  try {
    return JSON.parse(jsonMatch[0])
  } catch {
    return null
  }
}

function buildUserPrompt(params: {
  topic: string
  format: string
  goal: string
  angle: string
  specifics: string
}): string {
  const { topic, format, goal, angle, specifics } = params

  return `Write 3 distinct Instagram caption variants for this topic.

═══ CONTENT ═══
Topic: ${topic}
${specifics ? `Include these specifics: ${specifics}` : ""}

═══ GOAL ═══
Primary goal: ${goal}
CTA style: ${INSTAGRAM_GOAL_CTA_MAP[goal] || INSTAGRAM_GOAL_CTA_MAP["engagement"]}

═══ FORMAT ═══
${FORMAT_DESCRIPTIONS[format] || FORMAT_DESCRIPTIONS["auto"]}

═══ ANGLE ═══
${ANGLE_DESCRIPTIONS[angle] || ANGLE_DESCRIPTIONS["educational"]}

═══ RULES FOR THE 3 VARIANTS ═══
1. Each caption MUST use a different hook formula from the PROVEN INSTAGRAM HOOK FORMULAS list
2. Each caption MUST take a completely different angle within the "${angle}" theme:
   - Variant 1: Lead with the most counterintuitive or surprising angle
   - Variant 2: Lead with a personal/relatable story angle
   - Variant 3: Lead with a practical, tactical, save-worthy angle
3. Never start with "I" or the business name
4. First line must work within ~125 characters (before "...more" truncation)
5. Format for mobile: short paragraphs, strategic line breaks
6. End each caption with a CTA optimised for the goal
7. 3-5 niche hashtags at the end, on their own line
8. Use specific numbers, percentages, and concrete examples
9. Write like a practitioner sharing field notes, not a marketer writing copy
${format === "carousel" ? "\n10. Include a 'carousel_slides' array with 5-8 slide breakdowns (headline + body per slide)" : ""}
${format === "reel_script" ? "\n10. Include a 'reel_script' object with 'text_overlays' array (max 8 words each) and 'voiceover' full script" : ""}

═══ RESPONSE FORMAT ═══
Respond with valid JSON only:
{
  "posts": [
    {
      "caption": "full caption with \\n\\n for paragraph breaks, hashtags at end",
      "hook": "first line before ...more truncation (max 125 chars)",
      "cta": "the call-to-action used",
      "hashtags": ["tag1", "tag2", "tag3"],
      "format_notes": "carousel slide breakdown / reel script notes / format-specific guidance",
      "why_it_works": "one sentence explaining the psychological mechanism and algorithm signal this triggers",
      "writing_score": 85,
      "writing_tips": ["specific improvement tip 1", "specific improvement tip 2"]
    }
  ]
}`
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const actorId = resolveRequestActorId({
      userId: user.id,
      forwardedFor: request.headers.get("x-forwarded-for"),
      fallback: "ig-post",
    })
    const rate = checkRateLimit(`generate-ig-post:${actorId}`, {
      max: 20,
      windowMs: 60_000,
    })
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please retry shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rate.retryAfterSeconds),
            "X-RateLimit-Remaining": String(rate.remaining),
          },
        }
      )
    }

    const body = (await request.json()) as Record<string, unknown>

    const topic = String(body.topic || "").trim().slice(0, 500)
    if (!topic) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 })
    }

    const goal = VALID_GOALS.includes(body.goal as string) ? String(body.goal) : "engagement"
    const format = VALID_FORMATS.includes(body.format as string) ? String(body.format) : "auto"
    const angle = VALID_ANGLES.includes(body.angle as string) ? String(body.angle) : "educational"
    const specifics = String(body.specifics || "").trim().slice(0, 1000)

    // Check balance
    const { data: balanceRow } = await admin
      .from("token_balances")
      .select("balance")
      .eq("user_id", user.id)
      .single()
    const balance = (balanceRow as { balance?: number } | null)?.balance ?? 0
    if (balance < TOKEN_COST) {
      return NextResponse.json(
        { error: "Insufficient tokens", balance_needed: TOKEN_COST, current_balance: balance },
        { status: 402 }
      )
    }

    // Fetch profile context + feedback in parallel
    const [{ contextBlock }, feedbackConstraints] = await Promise.all([
      getProfileContext(user.id, "instagram"),
      getUserFeedbackContext(user.id),
    ])

    const systemPrompt = buildInstagramSystemPrompt(goal, "Casual", contextBlock, feedbackConstraints)
    const userPrompt = buildUserPrompt({ topic, format, goal, angle, specifics })

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    })

    const responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
    const parsed = safeJsonParse(responseText)

    if (!parsed || typeof parsed !== "object") {
      return NextResponse.json({ error: "Generation failed — invalid response" }, { status: 500 })
    }

    const obj = parsed as Record<string, unknown>
    if (!Array.isArray(obj.posts)) {
      return NextResponse.json({ error: "AI returned an unexpected response format" }, { status: 500 })
    }

    // Debit tokens
    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: TOKEN_COST,
      p_type: "feature_use",
      p_description: `Generated Instagram post variants: "${topic.slice(0, 60)}"`,
    } as never)

    if (debitError) {
      const msg = String(debitError.message || debitError)
      if (msg.includes("Insufficient")) {
        return NextResponse.json({ error: "Insufficient tokens", balance_needed: TOKEN_COST }, { status: 402 })
      }
      throw debitError
    }

    return NextResponse.json({
      posts: obj.posts,
      balance: newBalance,
      deducted: TOKEN_COST,
    })
  } catch (error) {
    console.error("Instagram post generation error:", error)
    return NextResponse.json({ error: "Failed to generate Instagram post" }, { status: 500 })
  }
}
