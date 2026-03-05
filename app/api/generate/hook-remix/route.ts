import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"

const TOKEN_COST = 10
const MAX_HOOKS = 10
const MAX_TOPICS = 5

type CTAType = "soft" | "mid" | "hard"

interface RemixPost {
  hook: string
  topicUsed: string
  title: string
  body: string
  cta: string
  hashtags: string[]
  postingTip: string
}

function getAnthropic(): Anthropic {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

function cleanText(val: unknown, maxLen: number): string {
  if (typeof val !== "string") return ""
  return val.replace(/\s+/g, " ").trim().slice(0, maxLen)
}

function parseHashtags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((h) => String(h).replace(/^#/, "").trim())
    .filter(Boolean)
    .slice(0, 10)
}

function buildPrompt(params: {
  hooks: string[]
  topics: string[]
  format: string
  ctaType: CTAType
  industry: string
  businessDescription: string
  targetAudience: string
  coreOffer: string
  primaryCTA: string
}): string {
  const { hooks, topics, format, ctaType, industry, businessDescription, targetAudience, coreOffer, primaryCTA } = params

  const ctaGuide =
    ctaType === "soft"
      ? 'soft — "save this for later" or "follow for more" style'
      : ctaType === "mid"
        ? 'mid — "DM [keyword]" or "comment below" style'
        : 'hard — "book a call", "link in bio", or "apply now" style'

  const perspective =
    format === "Talking Head Reel" ? "1st person (you are on camera speaking directly)" : "2nd person (you are addressing the viewer)"

  const hookList = hooks.map((h, i) => `${i + 1}. ${h}`).join("\n")
  const topicList = topics.length > 0 ? topics.join(", ") : "automation for service businesses, AI tools for trades"

  return `For each hook below, write a complete Instagram post brief.

RULES:
1. hook_used = EXACTLY the hook as provided — do not change a single word.
2. topic_used = pick the most relevant topic from TOPICS for this hook.
3. title = 6-10 word post title (internal reference, not shown to audience).
4. body = 80-120 words. Deliver real value immediately after the hook, then transition naturally to the CTA. Perspective: ${perspective}.
5. cta = write the actual CTA line. Type: ${ctaGuide}.
6. hashtags = 6-8 values, no # prefix, mix niche + broad.
7. posting_tip = one tactical tip for format "${format}" (lighting, caption length, first 3 seconds, B-roll choice, etc.).

BUSINESS CONTEXT:
- Industry: ${industry}
- Business: ${businessDescription}
- Audience: ${targetAudience}
- Core Offer: ${coreOffer}
- Primary CTA: ${primaryCTA}

TOPICS (pick best match per hook):
${topicList}

HOOKS:
${hookList}

Respond with a valid JSON array only. No markdown fences. No commentary.
[
  {
    "hook_used": "...",
    "topic_used": "...",
    "title": "...",
    "body": "...",
    "cta": "...",
    "hashtags": ["..."],
    "posting_tip": "..."
  }
]`
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    // Try stripping markdown fences
    const stripped = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
    try {
      return JSON.parse(stripped)
    } catch {
      return null
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const admin = createAdminClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const actorId = resolveRequestActorId({
      userId: user.id,
      forwardedFor: request.headers.get("x-forwarded-for"),
      fallback: "hook-remix",
    })

    const rate = checkRateLimit(`hook-remix:${actorId}`, { max: 10, windowMs: 60_000 })
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

    const rawHooks = Array.isArray(body.hooks) ? body.hooks : []
    const hooks = rawHooks
      .map((h) => String(h).trim())
      .filter((h) => h.length > 5)
      .slice(0, MAX_HOOKS)

    if (hooks.length === 0) {
      return NextResponse.json({ error: "At least one hook is required" }, { status: 400 })
    }

    const topics = Array.isArray(body.topics)
      ? body.topics.map((t) => String(t).trim()).filter(Boolean).slice(0, MAX_TOPICS)
      : []

    const format = cleanText(body.format, 60) || "Talking Head Reel"
    const ctaType = (["soft", "mid", "hard"].includes(String(body.ctaType)) ? body.ctaType : "mid") as CTAType

    const ctx = (body.businessContext as Record<string, unknown>) ?? {}
    const industry = cleanText(ctx.industry, 100) || "AI Automation"
    const businessDescription = cleanText(ctx.businessDescription, 400)
    const targetAudience = cleanText(ctx.targetAudience, 400)
    const coreOffer = cleanText(ctx.coreOffer, 200)
    const primaryCTA = cleanText(ctx.primaryCTA, 150)

    const prompt = buildPrompt({ hooks, topics, format, ctaType, industry, businessDescription, targetAudience, coreOffer, primaryCTA })

    const message = await getAnthropic().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      system: "You are an expert Instagram content writer. You write original body copy and CTAs built around proven viral hooks. Output valid JSON only.",
      messages: [{ role: "user", content: prompt }],
    })

    const responseText = message.content[0]?.type === "text" ? message.content[0].text : "[]"
    const parsed = safeJsonParse(responseText)

    if (!Array.isArray(parsed)) {
      return NextResponse.json({ error: "Generation failed — invalid response from AI" }, { status: 500 })
    }

    // Deduct tokens
    const { error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: TOKEN_COST,
      p_type: "feature_use",
      p_description: `Hook remix: ${hooks.length} hook${hooks.length !== 1 ? "s" : ""}`,
    } as never)

    if (debitError) {
      const message = String(debitError.message || debitError)
      if (message.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Insufficient tokens", balance_needed: TOKEN_COST },
          { status: 402 }
        )
      }
      throw debitError
    }

    const posts: RemixPost[] = (parsed as Record<string, unknown>[]).map((item, i) => ({
      hook: cleanText(item.hook_used, 300) || hooks[i] || "",
      topicUsed: cleanText(item.topic_used, 150),
      title: cleanText(item.title, 120),
      body: cleanText(item.body, 600),
      cta: cleanText(item.cta, 200),
      hashtags: parseHashtags(item.hashtags),
      postingTip: cleanText(item.posting_tip, 300),
    }))

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Hook remix error:", error)
    return NextResponse.json({ error: "Failed to generate post briefs" }, { status: 500 })
  }
}
