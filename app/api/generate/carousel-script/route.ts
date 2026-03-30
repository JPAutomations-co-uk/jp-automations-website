import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import { getProfileContext } from "@/app/lib/profile-context"
import {
  getUserFeedbackContext,
  buildCarouselSystemPrompt,
  INSTAGRAM_CAROUSEL_DENSITY_GUIDE,
} from "@/app/lib/instagram-master-prompt"

const TOKEN_COST = 5

const VALID_DENSITIES = Object.keys(INSTAGRAM_CAROUSEL_DENSITY_GUIDE)
const VALID_GOALS = ["saves", "engagement", "followers", "leads"]
const VALID_SLIDE_COUNTS = [5, 7, 8, 10]

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function safeJsonParse(text: string): unknown | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```\s*$/m, "")
    .trim()

  // Try to find a JSON object (carousel response is an object with slides array)
  const objMatch = cleaned.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0])
    } catch { /* fall through */ }
  }

  // Try array
  const arrMatch = cleaned.match(/\[[\s\S]*\]/)
  if (arrMatch) {
    try {
      return JSON.parse(arrMatch[0])
    } catch { /* fall through */ }
  }

  return null
}

function buildUserPrompt(params: {
  topic: string
  slideCount: number
  density: string
  goal: string
  angle?: string
  specifics?: string
}): string {
  const { topic, slideCount, density, goal, angle, specifics } = params
  const densityGuide = INSTAGRAM_CAROUSEL_DENSITY_GUIDE[density] || INSTAGRAM_CAROUSEL_DENSITY_GUIDE.standard

  const angleDirections: Record<string, string> = {
    educational: "Teach something valuable. Each slide = one clear lesson or framework piece.",
    bts: "Behind the scenes — show the real process, decisions, mistakes. Authenticity-first.",
    transformation: "Before → After structure. Show the change with specific, measurable shifts.",
    hot_take: "Contrarian angle. Challenge conventional wisdom. Each slide builds the argument.",
    listicle: "Numbered list format. Each slide = one tip/mistake/hack with a clear takeaway.",
    myth_busting: "Myth vs Reality format. Each content slide destroys one common misconception.",
  }

  return `Create a ${slideCount}-slide Instagram carousel script about: "${topic}"

Goal: ${goal}
Copy density: ${densityGuide.label}
${angle ? `\nAngle: ${angleDirections[angle] || angle}` : ""}
${specifics ? `\nInclude these specifics: ${specifics}` : ""}

═══ SLIDE FORMAT ═══

Slide 1 (COVER):
{
  "slide": 1,
  "type": "cover",
  "eyebrow": "Category or topic label (2-4 words, uppercase)",
  "heading": "The hook — scroll-stopping, curiosity-creating (max 10 words)",
  "subheading": "What they'll learn if they swipe (max 15 words)",
  "design_note": "Visual direction for this slide"
}

Slides 2 to ${slideCount - 1} (CONTENT):
{
  "slide": N,
  "type": "content",
  "eyebrow": "Point number or category (e.g. '01', 'STEP 1', 'MYTH #1')",
  "heading": "The key insight for this slide (max 8 words)",
  "body": "${density === "minimal" ? "Empty string — no body on minimal density" : density === "standard" ? "1 sentence expanding the heading (max 15 words)" : "2-3 sentences with examples or data"}",
  "design_note": "Visual direction for this slide"
}

Slide ${slideCount} (CTA):
{
  "slide": ${slideCount},
  "type": "cta",
  "heading": "Action prompt — what should they do? (max 8 words)",
  "subheading": "What happens when they take action (max 12 words)",
  "design_note": "Visual direction for this slide"
}

═══ RULES ═══
1. Cover must stop scrolling AND create enough curiosity to swipe.
2. Each content slide = ONE idea. Progressive revelation — build value with each swipe.
3. Save the strongest insight for slide ${slideCount - 1} (second to last).
4. CTA slide has heading + subheading ONLY. No eyebrow. No body.
5. CTA must match the goal: ${goal}.
6. Design notes should suggest visual style, colors, layout — not full design specs.

═══ RESPONSE FORMAT ═══
Return a JSON object:
{
  "slides": [array of slide objects as described above],
  "caption": "Instagram caption to accompany the carousel (hook + context + CTA + hashtags)",
  "caption_hook": "First line of caption before ...more truncation (max 125 chars)",
  "why_it_works": "1-2 sentences explaining algorithmic reasoning",
  "save_trigger": "What makes this carousel save-worthy"
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
      fallback: "carousel-script",
    })
    const rate = checkRateLimit(`generate-carousel-script:${actorId}`, {
      max: 10,
      windowMs: 60_000,
    })
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please retry shortly." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      )
    }

    const body = await request.json()
    const { topic, slideCount, density, goal, angle, specifics } = body

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const safeSlideCount = VALID_SLIDE_COUNTS.includes(slideCount) ? slideCount : 7
    const safeDensity = VALID_DENSITIES.includes(density) ? density : "standard"
    const safeGoal = VALID_GOALS.includes(goal) ? goal : "saves"
    const safeTopic = String(topic).slice(0, 1000).trim()

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

    // Build tone from profile context (extract first tone if comma-separated)
    const toneMatch = contextBlock.match(/Tone:\s*(.+)/)?.[1]?.split(",")[0]?.trim() || "Casual"

    const systemPrompt = buildCarouselSystemPrompt(
      safeGoal,
      toneMatch,
      contextBlock,
      safeDensity,
      feedbackConstraints
    )

    const userPrompt = buildUserPrompt({
      topic: safeTopic,
      slideCount: safeSlideCount,
      density: safeDensity,
      goal: safeGoal,
      angle: angle ? String(angle).slice(0, 100) : undefined,
      specifics: specifics ? String(specifics).slice(0, 500) : undefined,
    })

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
      console.error("Failed to parse carousel script response:", responseText.slice(0, 500))
      return NextResponse.json({ error: "Failed to parse generated script" }, { status: 500 })
    }

    // Debit tokens
    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: TOKEN_COST,
      p_type: "feature_use",
      p_description: `Generated ${safeSlideCount}-slide carousel script: "${safeTopic.slice(0, 60)}"`,
    } as never)

    if (debitError) {
      const msg = String(debitError.message || debitError)
      if (msg.includes("Insufficient")) {
        return NextResponse.json({ error: "Insufficient tokens", balance_needed: TOKEN_COST }, { status: 402 })
      }
      throw debitError
    }

    return NextResponse.json({
      ...(parsed as object),
      balance: newBalance,
      deducted: TOKEN_COST,
    })
  } catch (error) {
    console.error("Carousel script generation error:", error)
    return NextResponse.json({ error: "Failed to generate carousel script" }, { status: 500 })
  }
}
