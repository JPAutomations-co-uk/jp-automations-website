import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import { getProfileContext } from "@/app/lib/profile-context"
import {
  getUserFeedbackContext,
  buildReelSystemPrompt,
  INSTAGRAM_REEL_DURATION_GUIDE,
} from "@/app/lib/instagram-master-prompt"

const TOKEN_COST = 8

const VALID_HOOK_STYLES = ["bold_claim", "question", "statistic", "controversial", "story"]
const VALID_DURATIONS = Object.keys(INSTAGRAM_REEL_DURATION_GUIDE)
const VALID_GOALS = ["saves", "engagement", "followers", "leads"]

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function safeJsonParse(text: string): unknown | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```\s*$/m, "")
    .trim()

  // Try object first (new format includes metadata)
  const objMatch = cleaned.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try {
      const parsed = JSON.parse(objMatch[0])
      if (parsed.slides && Array.isArray(parsed.slides)) return parsed
    } catch { /* fall through */ }
  }

  // Try array (legacy format)
  const arrMatch = cleaned.match(/\[[\s\S]*\]/)
  if (arrMatch) {
    try {
      const slides = JSON.parse(arrMatch[0])
      if (Array.isArray(slides)) return { slides }
    } catch { /* fall through */ }
  }

  return null
}

function buildUserPrompt(params: {
  topic: string
  duration: string
  hookStyle: string
  goal: string
  audience?: string
  takeaway?: string
}): string {
  const { topic, duration, hookStyle, goal, audience, takeaway } = params
  const durationGuide = INSTAGRAM_REEL_DURATION_GUIDE[duration] || INSTAGRAM_REEL_DURATION_GUIDE.medium
  const slideCount = durationGuide.slideCount

  const hookDirections: Record<string, string> = {
    bold_claim: "Open with a bold, confident statement that challenges conventional wisdom or makes a surprising claim. The viewer must think 'wait, really?' and keep watching.",
    question: "Open with a provocative question that creates an information gap — the viewer NEEDS to know the answer. Target a specific pain point.",
    statistic: "Open with a surprising statistic or data point. Make it specific (not 'most businesses' but '73% of service businesses').",
    controversial: "Open with a slightly polarising opinion or hot take that compels people to keep watching. Split the audience.",
    story: "Open mid-story — 'Last week, a client came to me with [problem]...' The viewer is dropped into action. No setup.",
  }

  return `Create a ${slideCount}-slide Instagram reel script for: "${topic}"

Duration: ${durationGuide.label} (${durationGuide.seconds} seconds)
Total voiceover: ${durationGuide.wordRange} words — COUNT THEM. Do not exceed.
Goal: ${goal}
${audience ? `\nTarget audience override: ${audience}` : ""}
${takeaway ? `\nKey takeaway: The viewer should walk away knowing: ${takeaway}` : ""}

═══ HOOK STYLE ═══
${hookDirections[hookStyle] || hookDirections.bold_claim}

═══ PACING ═══
${durationGuide.pacing}

═══ SLIDE STRUCTURE ═══
- Slide 1 (hook): Highest visual drama. Scroll-stopping composition. On-screen text = the strongest hook line (max 8 words). This slide determines if they watch.
- Slides 2 to ${slideCount - 2} (content): Each slide illustrates ONE specific point. On-screen text = numbered point or key takeaway. Vary visual compositions.
- Slide ${slideCount - 1} (proof/summary): Consolidation — result shot, summary, or social proof. The "aha" moment.
- Slide ${slideCount} (cta): Warm, accessible. Clear call-to-action matching goal: ${goal}.

═══ RESPONSE FORMAT ═══
Return a JSON object:
{
  "slides": [
    {
      "slide": 1,
      "type": "hook",
      "on_screen_text": "Short punchy text (max 8 words)",
      "voiceover": "What the narrator says (conversational, natural)",
      "voiceover_duration": "estimated seconds for this voiceover",
      "visual_summary": "One sentence — what the viewer sees",
      "scene_description": "Detailed: location, objects, lighting, camera angle",
      "retention_note": "Why this keeps people watching"
    }
  ],
  "total_duration": "estimated total seconds",
  "total_words": number of total voiceover words,
  "speaking_pace": "words per minute",
  "caption": "Instagram caption to post with the reel (hook + context + CTA + hashtags)",
  "caption_hook": "First line before ...more truncation (max 125 chars)",
  "why_it_works": "Algorithmic reasoning"
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
      fallback: "reel-script",
    })
    const rate = checkRateLimit(`generate-reel-script:${actorId}`, {
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
    const { topic, duration, hookStyle, goal, audience, takeaway } = body

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const safeDuration = VALID_DURATIONS.includes(duration) ? duration : "medium"
    const safeHookStyle = VALID_HOOK_STYLES.includes(hookStyle) ? hookStyle : "bold_claim"
    const safeGoal = VALID_GOALS.includes(goal) ? goal : "engagement"
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

    // Extract tone from profile context
    const toneMatch = contextBlock.match(/Tone:\s*(.+)/)?.[1]?.split(",")[0]?.trim() || "Casual"

    const systemPrompt = buildReelSystemPrompt(
      safeGoal,
      toneMatch,
      contextBlock,
      safeDuration,
      feedbackConstraints
    )

    const userPrompt = buildUserPrompt({
      topic: safeTopic,
      duration: safeDuration,
      hookStyle: safeHookStyle,
      goal: safeGoal,
      audience: audience ? String(audience).slice(0, 500).trim() : undefined,
      takeaway: takeaway ? String(takeaway).slice(0, 300).trim() : undefined,
    })

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    })

    const responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
    const parsed = safeJsonParse(responseText) as { slides?: unknown[] } | null

    if (!parsed || !parsed.slides || !Array.isArray(parsed.slides)) {
      console.error("Failed to parse reel script response:", responseText.slice(0, 500))
      return NextResponse.json({ error: "Failed to parse generated script" }, { status: 500 })
    }

    // Debit tokens
    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: TOKEN_COST,
      p_type: "feature_use",
      p_description: `Generated ${safeDuration} reel script: "${safeTopic.slice(0, 60)}"`,
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
    console.error("Reel script generation error:", error)
    return NextResponse.json({ error: "Failed to generate reel script" }, { status: 500 })
  }
}
