import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import { getProfileContext } from "@/app/lib/profile-context"
import {
  buildYouTubeSystemPrompt,
  getUserFeedbackContext,
  YOUTUBE_GOAL_CTA_MAP,
} from "@/app/lib/youtube-master-prompt"

const TOKEN_COST = 5

const VALID_GOALS = ["subscribers", "watch_time", "leads", "authority"]
const VALID_LENGTHS = ["short", "5-8", "10-15", "20+"]
const VALID_HOOKS = ["promise", "question", "story", "stat"]

const HOOK_DESCRIPTIONS: Record<string, string> = {
  promise: "Open with a bold promise: 'By the end of this video, you'll know exactly how to [specific outcome].'",
  question: "Open with a provocative question that targets their pain point: 'What if [common approach] is the reason you're not getting [result]?'",
  story: "Open mid-story: 'Last month, a client came to me with [problem]. What happened next changed everything.'",
  stat: "Open with a shocking statistic: '[Specific stat]. That means [implication for viewer].'",
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
  videoLength: string
  goal: string
  hookStyle: string
  keyPoints: string
}): string {
  const { topic, videoLength, goal, hookStyle, keyPoints } = params

  const lengthLabel = videoLength === "short" ? "YouTube Short (< 60s)"
    : videoLength === "5-8" ? "Short (5-8 min)"
    : videoLength === "10-15" ? "Medium (10-15 min)"
    : "Long (20+ min)"

  return `Write a complete YouTube video script with titles, description, and thumbnail concepts.

═══ CONTENT ═══
Topic: ${topic}
${keyPoints ? `Key points to cover:\n${keyPoints}` : ""}

═══ VIDEO SPECS ═══
Length: ${lengthLabel}
Goal: ${goal}
CTA style: ${YOUTUBE_GOAL_CTA_MAP[goal] || YOUTUBE_GOAL_CTA_MAP["subscribers"]}

═══ HOOK STYLE ═══
${HOOK_DESCRIPTIONS[hookStyle] || HOOK_DESCRIPTIONS["promise"]}

═══ RULES ═══
1. Title uses a formula from PROVEN YOUTUBE TITLE FORMULAS. Generate 1 main title + 3 variants.
2. Script follows the retention-optimised structure: Hook → Setup → Body → Climax → CTA → Outro.
3. Hook must deliver on the title promise within 10 seconds. No intros.
4. Include [B-roll: description] markers throughout for visual variety.
5. Pattern interrupt every 60-90 seconds in the script.
6. Each body section needs: section_title, script (the actual words), b_roll_note, retention_technique.
7. Description follows the YouTube description template with timestamps.
8. Generate 2-3 thumbnail concepts with text overlay, visual description, emotion, and layout.
9. Include 5-10 relevant tags.
10. Write like a human creator talking to camera — conversational, not scripted.
11. Estimated duration at the end.

═══ RESPONSE FORMAT ═══
Respond with valid JSON only:
{
  "title": "main title",
  "title_variants": ["alt 1", "alt 2", "alt 3"],
  "description": "full YouTube description with timestamps using \\n for line breaks",
  "script": {
    "hook": "first 30s word-for-word script with [B-roll] notes",
    "setup": "why this matters section (30-60s)",
    "body": [
      {
        "section_title": "Section Name",
        "script": "word-for-word script for this section",
        "b_roll_note": "visual suggestions for this section",
        "retention_technique": "pattern interrupt or technique used here"
      }
    ],
    "cta": "subscribe/action CTA script",
    "outro": "brief outro script"
  },
  "thumbnail_concepts": [
    {
      "text_overlay": "3-5 words max",
      "visual_description": "what the thumbnail shows",
      "emotion": "surprised / excited / confused / determined",
      "layout": "face left text right / centered / split screen"
    }
  ],
  "tags": ["tag1", "tag2", "tag3"],
  "why_it_works": "one sentence on why this script + title combo will perform well algorithmically",
  "estimated_duration": "X min"
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
      fallback: "yt-script",
    })
    const rate = checkRateLimit(`generate-yt-script:${actorId}`, {
      max: 10,
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

    const goal = VALID_GOALS.includes(body.goal as string) ? String(body.goal) : "subscribers"
    const videoLength = VALID_LENGTHS.includes(body.video_length as string) ? String(body.video_length) : "10-15"
    const hookStyle = VALID_HOOKS.includes(body.hook_style as string) ? String(body.hook_style) : "promise"
    const keyPoints = String(body.key_points || "").trim().slice(0, 1000)

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
      getProfileContext(user.id, "youtube"),
      getUserFeedbackContext(user.id),
    ])

    const systemPrompt = buildYouTubeSystemPrompt(goal, videoLength, contextBlock, feedbackConstraints)
    const userPrompt = buildUserPrompt({ topic, videoLength, goal, hookStyle, keyPoints })

    const maxTokens = videoLength === "short" ? 3000
      : videoLength === "5-8" ? 5000
      : videoLength === "10-15" ? 7000
      : 8000

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
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
    if (!obj.title || !obj.script) {
      return NextResponse.json({ error: "AI returned an unexpected response format" }, { status: 500 })
    }

    // Debit tokens
    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: TOKEN_COST,
      p_type: "feature_use",
      p_description: `Generated YouTube script: "${topic.slice(0, 60)}"`,
    } as never)

    if (debitError) {
      const msg = String(debitError.message || debitError)
      if (msg.includes("Insufficient")) {
        return NextResponse.json({ error: "Insufficient tokens", balance_needed: TOKEN_COST }, { status: 402 })
      }
      throw debitError
    }

    return NextResponse.json({
      ...obj,
      balance: newBalance,
      deducted: TOKEN_COST,
    })
  } catch (error) {
    console.error("YouTube script generation error:", error)
    return NextResponse.json({ error: "Failed to generate YouTube script" }, { status: 500 })
  }
}
