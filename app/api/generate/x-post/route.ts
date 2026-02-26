import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"

const THREAD_TYPES = [
  "Educational",
  "How-To",
  "Story",
  "Case Study",
  "Hot Take",
  "Social Proof",
] as const

const GOALS = [
  "Brand Awareness",
  "Lead Generation",
  "Community Building",
  "Sales & Conversions",
  "Education & Authority",
] as const

type ThreadType = (typeof THREAD_TYPES)[number]
type Goal = (typeof GOALS)[number]
type Mode = "tweet" | "thread"

const TOKEN_COSTS: Record<Mode, number> = {
  tweet: 2,
  thread: 8,
}

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function safeJsonParse(text: string): unknown | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```\s*$/m, "")
    .trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
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

type ProfileContext = {
  business_name?: string | null
  industry?: string | null
  target_audience?: string | null
  brand_voice?: string | null
  tone?: string | null
  location?: string | null
  voice_sample?: string | null
}

async function fetchProfileContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<ProfileContext> {
  const { data, error } = await supabase
    .from("profiles")
    .select("business_name, industry, target_audience, brand_voice, tone, location, voice_sample")
    .eq("id", userId)
    .single()
  if (error) return {}
  return (data || {}) as ProfileContext
}

function buildTweetSystemPrompt(goal: Goal): string {
  return `You are an elite X (Twitter) strategist and copywriter. Your mission: write scroll-stopping tweets that serve the goal of "${goal}".

Every tweet must:
- Open with a hook that stops the scroll in the first 5 words
- Never start with "I" or the business name
- Stay under 280 characters (count carefully)
- End with either a soft CTA, open loop, or engagement trigger

Output valid JSON only. No markdown fences. No commentary.`
}

function buildTweetPrompt(params: {
  topic: string
  goal: Goal
  profile: ProfileContext
}): string {
  const { topic, goal, profile } = params

  const goalCTAMap: Record<Goal, string> = {
    "Brand Awareness": "Follow for more / Repost if this resonates",
    "Lead Generation": "DM me [word] / Link in bio / Comment below",
    "Community Building": "Drop your answer below / What do you think?",
    "Sales & Conversions": "DM me now / Link in bio to apply",
    "Education & Authority": "Save this / Follow for daily [niche] insights",
  }

  return `Write 3 distinct tweet variants for this topic.

BUSINESS CONTEXT:
- Business: ${profile.business_name || "Not provided"}
- Industry: ${profile.industry || "Not provided"}
- Audience: ${profile.target_audience || "Not provided"}
- Brand Voice: ${profile.brand_voice || "Professional"}
- Tone: ${profile.tone || "Direct"}
- Location: ${profile.location || "UK"}
- Voice Sample: ${profile.voice_sample || "Not provided — write in a direct, expert tone"}

TOPIC: ${topic}
GOAL: ${goal}
PREFERRED CTA STYLE: ${goalCTAMap[goal]}

RULES:
1. Each tweet must be under 280 characters — count carefully
2. Each tweet must take a completely different angle (hot take / story / list / question / insight)
3. Never start with "I" or the business name
4. Hook must be the first line — make it impossible to scroll past
5. Match the brand voice and tone provided

Respond with valid JSON only:
{
  "tweets": [
    {
      "text": "full tweet text under 280 chars",
      "hook": "the opening line",
      "angle": "hot take | story | list | question | insight",
      "cta": "the call-to-action used",
      "char_count": 142,
      "why_it_works": "one sentence explaining the mechanism"
    },
    { ... },
    { ... }
  ]
}`
}

function buildThreadSystemPrompt(goal: Goal): string {
  return `You are an elite X (Twitter) thread writer. Your mission: write high-performing threads that serve the goal of "${goal}".

Every thread must:
- Open with a hook tweet that cannot be scrolled past
- Deliver compounding value tweet by tweet
- End with a strong CTA tweet that matches the goal
- Use natural, conversational X writing style — not blog content
- Each tweet must be under 280 characters

Output valid JSON only. No markdown fences. No commentary.`
}

function buildThreadPrompt(params: {
  topic: string
  threadType: ThreadType
  goal: Goal
  profile: ProfileContext
}): string {
  const { topic, threadType, goal, profile } = params

  const threadStructures: Record<ThreadType, string> = {
    Educational: "Hook tweet → 6–10 value-packed insight tweets (numbered 1/ 2/ etc.) → Summary tweet → CTA tweet",
    "How-To": "Hook tweet (promise the outcome) → 5–8 step tweets (Step 1: ... Step 2: ...) → Common mistakes tweet → CTA tweet",
    Story: "Hook tweet (tension/result first) → Setup tweets (context) → Conflict tweets (the hard part) → Resolution tweets (the win) → Lesson tweet → CTA tweet",
    "Case Study": "Hook tweet (the result) → Context tweet (who, what) → Problem tweets → Solution/process tweets → Results tweet (specifics) → What you can steal → CTA tweet",
    "Hot Take": "Hook tweet (the bold claim) → Why most people are wrong → The evidence → The nuanced truth → What to do instead → CTA tweet",
    "Social Proof": "Hook tweet (the transformation) → Before state tweets → Journey tweets → After state tweets (specifics) → What made the difference → CTA tweet",
  }

  const goalCTAMap: Record<Goal, string> = {
    "Brand Awareness": "Follow me @handle for more threads like this. Repost the first tweet if this helped someone you know.",
    "Lead Generation": "Want help with [outcome]? DM me '[keyword]' and I'll send you [lead magnet]. Or: [link in bio]",
    "Community Building": "Which part resonated most? Drop it in the replies. Let's build on this together.",
    "Sales & Conversions": "Ready to [achieve outcome]? My [service/product] does exactly this. DM me 'ready' to get started.",
    "Education & Authority": "Follow me @handle — I post [niche] insights like this daily. Save this thread to revisit later.",
  }

  return `Write a ${threadType} thread on this topic.

BUSINESS CONTEXT:
- Business: ${profile.business_name || "Not provided"}
- Industry: ${profile.industry || "Not provided"}
- Audience: ${profile.target_audience || "Not provided"}
- Brand Voice: ${profile.brand_voice || "Professional"}
- Tone: ${profile.tone || "Direct"}
- Location: ${profile.location || "UK"}
- Voice Sample: ${profile.voice_sample || "Not provided — write in a direct, expert tone"}

TOPIC: ${topic}
THREAD TYPE: ${threadType}
GOAL: ${goal}
STRUCTURE: ${threadStructures[threadType]}
CTA STYLE: ${goalCTAMap[goal]}

RULES:
1. Each tweet must be under 280 characters — count carefully
2. Hook tweet (tweet 1) must stop the scroll immediately. Never start with "I" or the business name.
3. Number the thread body tweets (1/ 2/ etc.) for clarity
4. Avoid padding — every tweet must earn its place
5. The final CTA tweet must match the goal directly
6. Write in the brand voice and tone provided
7. Use natural X writing style — punchy, conversational, direct

Respond with valid JSON only:
{
  "thread": [
    {
      "tweet_number": 1,
      "text": "hook tweet text",
      "type": "hook",
      "char_count": 180
    },
    {
      "tweet_number": 2,
      "text": "1/ ...",
      "type": "body",
      "char_count": 210
    },
    ...
    {
      "tweet_number": 8,
      "text": "cta tweet text",
      "type": "cta",
      "char_count": 160
    }
  ],
  "hook": "the opening line of tweet 1",
  "thread_type": "${threadType}",
  "tweet_count": 8,
  "goal_alignment": "one sentence on how this thread serves ${goal}"
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
      fallback: "x-post",
    })
    const rate = checkRateLimit(`generate-x-post:${actorId}`, {
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
    const mode = String(body.mode || "tweet") as Mode
    if (!["tweet", "thread"].includes(mode)) {
      return NextResponse.json({ error: "mode must be 'tweet' or 'thread'" }, { status: 400 })
    }

    const topic = cleanText(body.topic, 500)
    if (!topic) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 })
    }

    const goal = GOALS.includes(body.goal as Goal) ? (body.goal as Goal) : "Lead Generation"
    const threadType = THREAD_TYPES.includes(body.threadType as ThreadType)
      ? (body.threadType as ThreadType)
      : "Educational"

    const tokenCost = TOKEN_COSTS[mode]

    // Check balance before generation
    const { data: balanceRow } = await admin
      .from("token_balances")
      .select("balance")
      .eq("user_id", user.id)
      .single()
    const balance = (balanceRow as { balance?: number } | null)?.balance ?? 0
    if (balance < tokenCost) {
      return NextResponse.json(
        { error: "Insufficient tokens", balance_needed: tokenCost, current_balance: balance },
        { status: 402 }
      )
    }

    const profile = await fetchProfileContext(supabase, user.id)

    let responseText = ""
    if (mode === "tweet") {
      const message = await getAnthropic().messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: buildTweetSystemPrompt(goal),
        messages: [{ role: "user", content: buildTweetPrompt({ topic, goal, profile }) }],
      })
      responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
    } else {
      const message = await getAnthropic().messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: buildThreadSystemPrompt(goal),
        messages: [{ role: "user", content: buildThreadPrompt({ topic, threadType, goal, profile }) }],
      })
      responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
    }

    const parsed = safeJsonParse(responseText)
    if (!parsed) {
      return NextResponse.json({ error: "Generation failed — invalid response" }, { status: 500 })
    }

    // Debit tokens after successful generation
    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: tokenCost,
      p_type: "feature_use",
      p_description: `Generated X ${mode === "tweet" ? "tweet variants" : `${threadType} thread`}: "${topic.slice(0, 60)}"`,
    } as never)

    if (debitError) {
      const msg = String(debitError.message || debitError)
      if (msg.includes("Insufficient")) {
        return NextResponse.json({ error: "Insufficient tokens", balance_needed: tokenCost }, { status: 402 })
      }
      throw debitError
    }

    return NextResponse.json({
      mode,
      ...(parsed as object),
      balance: newBalance,
      deducted: tokenCost,
    })
  } catch (error) {
    console.error("X post generation error:", error)
    return NextResponse.json({ error: "Failed to generate X post" }, { status: 500 })
  }
}
