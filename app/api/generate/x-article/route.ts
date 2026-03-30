import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import {
  buildArticleSystemPrompt,
  getUserFeedbackContext,
  type XProfileContext,
} from "@/app/lib/x-master-prompt"

export const maxDuration = 120

// ─── Constants ────────────────────────────────────────────────────────────────

const TOKEN_COST = 5

const ARTICLE_TYPES = ["Tutorial", "Deep Dive", "Case Study", "Opinion", "Framework"] as const
const ARTICLE_LENGTHS = ["brief", "standard", "longform"] as const

type ArticleType = (typeof ARTICLE_TYPES)[number]
type ArticleLength = (typeof ARTICLE_LENGTHS)[number]

const LENGTH_TARGETS: Record<ArticleLength, { words: string; sections: number }> = {
  brief: { words: "400–600", sections: 3 },
  standard: { words: "800–1,200", sections: 5 },
  longform: { words: "1,500–2,500", sections: 7 },
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

function cleanText(value: unknown, maxLen: number): string {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, maxLen)
}

async function fetchXProfileContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<XProfileContext> {
  const { data, error } = await supabase
    .from("x_profiles")
    .select("name, niche, audience_description, tone, writing_style, hook_style, post_length_preference, hashtag_preference, banned_words, cta_preference, current_followers, growth_goal, secondary_metric")
    .eq("id", userId)
    .single()
  if (error) return {}
  return (data || {}) as XProfileContext
}

// ─── POST handler ────────────────────────────────────────────────────────────

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
      fallback: "x-article",
    })
    const rate = checkRateLimit(`generate-x-article:${actorId}`, {
      max: 10,
      windowMs: 60_000,
    })
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please retry shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      )
    }

    const body = (await request.json()) as Record<string, unknown>

    const topic = cleanText(body.topic, 500)
    if (!topic) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 })
    }

    const articleType = ARTICLE_TYPES.includes(body.articleType as ArticleType)
      ? (body.articleType as ArticleType)
      : "Deep Dive"
    const length = ARTICLE_LENGTHS.includes(body.length as ArticleLength)
      ? (body.length as ArticleLength)
      : "standard"

    // Optional planner context
    const contentBrief = cleanText(body.contentBrief, 1000)
    const goal = cleanText(body.goal, 100)
    const funnelStage = cleanText(body.funnelStage, 10)

    // Balance check
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

    const [xProfile, feedbackConstraints] = await Promise.all([
      fetchXProfileContext(supabase, user.id),
      getUserFeedbackContext(user.id),
    ])

    const tone = xProfile.tone || "Direct"
    const target = LENGTH_TARGETS[length]

    const plannerContext = contentBrief
      ? `\n\nCONTENT BRIEF (from planner — follow this direction):\n${contentBrief}${funnelStage ? `\nFunnel stage: ${funnelStage}` : ""}${goal ? `\nGoal: ${goal}` : ""}`
      : ""

    const userPrompt = `Write a ${articleType} X Article on this topic: "${topic}"${plannerContext}

Target word count: ${target.words} words
Number of H2 sections: ${target.sections}
Article type format: ${articleType}
Niche: ${xProfile.niche || "Business/Marketing"}
Target audience: ${xProfile.audience_description || "Business owners and professionals"}

Respond with valid JSON only:
{
  "title": "The article title — compelling, SEO-friendly, under 80 chars",
  "body": "Full article in markdown. Start with a 2-3 sentence hook intro (no heading). Then ${target.sections} ## sections. End with a ## Conclusion section containing a single clear CTA. Use **bold** for key terms. Use - for bullet lists. Aim for ${target.words} words.",
  "companionTweet": "The hook tweet for sharing this article — under 280 chars, creates a curiosity gap, ends with [link]",
  "wordCount": 950,
  "readTime": 4
}`

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 6000,
      temperature: 0.7,
      system: buildArticleSystemPrompt(tone, xProfile, feedbackConstraints, goal),
      messages: [{ role: "user", content: userPrompt }],
    })

    const responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
    const parsed = safeJsonParse(responseText)
    if (!parsed) {
      return NextResponse.json({ error: "Generation failed — invalid response" }, { status: 500 })
    }

    // Debit tokens after successful generation
    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: TOKEN_COST,
      p_type: "feature_use",
      p_description: `Generated X Article (${articleType}): "${topic.slice(0, 60)}"`,
    } as never)

    if (debitError) {
      const msg = String(debitError.message || debitError)
      if (msg.includes("Insufficient")) {
        return NextResponse.json({ error: "Insufficient tokens", balance_needed: TOKEN_COST }, { status: 402 })
      }
      throw debitError
    }

    return NextResponse.json({
      articleType,
      length,
      ...(parsed as object),
      balance: newBalance,
      deducted: TOKEN_COST,
    })
  } catch (error) {
    console.error("X article generation error:", error)
    return NextResponse.json({ error: "Failed to generate X article" }, { status: 500 })
  }
}
