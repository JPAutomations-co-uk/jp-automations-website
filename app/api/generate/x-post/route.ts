import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import {
  TONE_DESCRIPTIONS,
  GOAL_CTA_MAP,
  buildTweetSystemPrompt,
  buildThreadSystemPrompt,
  buildXProfileBlock,
  getUserFeedbackContext,
  type XProfileContext,
} from "@/app/lib/x-master-prompt"

export const maxDuration = 120

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

const TONES = [
  "Direct",
  "Casual",
  "Bold",
  "Witty",
  "Educational",
  "Inspirational",
  "Story",
  "Professional",
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

function cleanMultilineText(value: unknown, maxLen: number): string {
  return String(value ?? "")
    .trim()
    .slice(0, maxLen)
}

// ─── Profile contexts ────────────────────────────────────────────────────────

type ProfileContext = {
  business_name?: string | null
  industry?: string | null
  target_audience?: string | null
  tone?: string | null
  location?: string | null
  voice_sample?: string | null
  offers?: string | null
  usp?: string | null
  primary_cta?: string | null
  proof_points?: string | null
  x_handle?: string | null
}

async function fetchProfileContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<ProfileContext> {
  const { data, error } = await supabase
    .from("profiles")
    .select("business_name, industry, target_audience, tone, location, voice_sample, offers, usp, primary_cta, proof_points, x_handle")
    .eq("id", userId)
    .single()
  if (error) return {}
  return (data || {}) as ProfileContext
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

// ─── Tweet user prompt ───────────────────────────────────────────────────────

function buildTweetPrompt(params: {
  topic: string
  goal: Goal
  tone: string
  profile: ProfileContext
  xProfile: XProfileContext
}): string {
  const { topic, goal, tone, profile, xProfile } = params

  const goalCTAMap: Record<Goal, string> = {
    "Brand Awareness": "Follow for more / Repost the first tweet if this helped",
    "Lead Generation": "DM me [keyword] / Comment [word] and I'll send you [thing]",
    "Community Building": "What would you add? / Which surprised you most? / Drop your take below",
    "Sales & Conversions": "DM me [keyword] to get started / Link in bio to apply",
    "Education & Authority": "Bookmark this / Follow for daily [niche] insights",
  }

  const lengthGuidance = xProfile.post_length_preference === "short"
    ? "AIM FOR 71-100 CHARACTERS. Punchy one-liners."
    : xProfile.post_length_preference === "long"
      ? "AIM FOR 240-259 CHARACTERS. Substantive, multi-line format with line breaks."
      : "AIM FOR 140-220 CHARACTERS. Medium length with clear structure."

  return `Write 3 distinct tweet variants for this topic, PLUS 3 strategic reply templates.

BUSINESS CONTEXT:
- Business: ${profile.business_name || xProfile.name || "Not provided"}
- Industry: ${profile.industry || "Not provided"}
- Niche: ${xProfile.niche || profile.industry || "Not provided"}
- Audience: ${xProfile.audience_description || profile.target_audience || "Not provided"}
- Location: ${profile.location || "UK"}
- X Handle: ${profile.x_handle || "Not provided"}
- Offers: ${profile.offers || "Not provided"}
- USP: ${profile.usp || "Not provided"}
- Primary CTA: ${xProfile.cta_preference || profile.primary_cta || "Not provided"}
- Proof Points: ${profile.proof_points || "Not provided"}
- Voice Sample: ${profile.voice_sample || "Not provided — write in the specified tone"}
- Current Followers: ${xProfile.current_followers || "Not provided"}

TOPIC: ${topic}
GOAL: ${goal}
TONE: ${tone}
PREFERRED CTA STYLE: ${goalCTAMap[goal]}
LENGTH: ${lengthGuidance}

RULES FOR THE 3 TWEET VARIANTS:
1. Each tweet MUST use a different hook formula from the PROVEN HOOK FORMULAS list
2. Each tweet MUST take a completely different angle:
   - Variant 1: Hot take or contrarian angle — challenge conventional wisdom
   - Variant 2: Story or personal experience angle — make it human and specific
   - Variant 3: Educational or framework angle — teach something actionable
3. Never start with "I" or the business name
4. Format for mobile: short lines, strategic line breaks, one idea per line
5. End each tweet with a CTA optimised for REPLIES or BOOKMARKS (highest algorithm weight)
6. Use specific numbers, percentages, and concrete examples — never vague claims
7. Write like a practitioner sharing field notes, not a marketer writing copy

RULES FOR THE 3 STRATEGIC REPLIES:
1. Each reply is designed to be posted under a larger account's tweet in the same niche
2. Each reply uses a DIFFERENT reply type from the REPLY STRATEGY section:
   - Reply 1: "Agree + Expand" — validate their point, add a layer they missed
   - Reply 2: "Add the Missing Piece" — the insight their post left out
   - Reply 3: "Polite Disagreement" or "Personal Story Validation" — stand out in the replies
3. Add genuine value — a specific tactic, data point, contrarian take, or real example
4. Never be generic. Be the reply that gets pinned or goes viral on its own
5. Stay under 280 characters
6. Sound like an authority without being salesy — earned expertise, not self-promotion

Respond with valid JSON only:
{
  "tweets": [
    {
      "text": "full tweet text under 280 chars — use \\n for line breaks",
      "hook": "the opening line",
      "hook_formula": "which hook formula was used (e.g. 'Contrarian Stat', 'Bold Declaration')",
      "angle": "hot take | story | educational",
      "cta": "the call-to-action used",
      "char_count": 142,
      "why_it_works": "one sentence explaining the psychological mechanism and algorithm signal this triggers"
    }
  ],
  "replies": [
    {
      "text": "the reply text under 280 chars",
      "scenario": "specific type of tweet to reply to (e.g. 'Someone sharing a win about landing clients through content')",
      "strategy": "agree and expand | add missing piece | polite disagreement | personal story validation | summariser | extend conversation",
      "char_count": 120,
      "why_it_works": "one sentence on why this reply builds authority and triggers follow-backs"
    }
  ]
}`
}

// ─── Thread user prompt ──────────────────────────────────────────────────────

function buildThreadPrompt(params: {
  topic: string
  threadType: ThreadType
  goal: Goal
  tone: string
  profile: ProfileContext
  xProfile: XProfileContext
}): string {
  const { topic, threadType, goal, tone, profile, xProfile } = params

  const threadStructures: Record<ThreadType, string> = {
    Educational: `LISTICLE/FRAMEWORK THREAD:
Tweet 1 (HOOK): "[N] [things] that [outcome] — most people only know 2:"
Tweet 2 (FRAME): Quick context on why this matters
Tweets 3-9 (POINTS): Each point = headline (5 words max) + 2-3 sentence explanation + one-line example
Tweet 10 (SYNTHESIS): The meta-insight tying all points together
Tweet 11 (CTA): "Which surprised you most? Reply below." + follow ask`,

    "How-To": `PROBLEM-SOLUTION THREAD:
Tweet 1 (HOOK): "If you're struggling with [problem], it's not your fault. Here's why:"
Tweet 2 (PROBLEM): Diagnose the root cause, not the symptom
Tweet 3 (AGITATE): Show what happens if the problem isn't solved
Tweet 4 (REFRAME): Why most people try the wrong approach
Tweets 5-8 (SOLUTION): Step-by-step implementation (→ Step 1: ... → Step 2: ...)
Tweet 9 (RESULT): What changes when you do this consistently
Tweet 10 (CTA): Follow ask + reply question`,

    Story: `TRANSFORMATION THREAD:
Tweet 1 (HOOK): "[Before state] → [After state]. Here's everything:"
Tweet 2 (CONTEXT): Set the scene — who you were, what the problem was
Tweet 3 (MISTAKE): The first thing you got wrong + why it fails
Tweet 4 (TURNING): The insight or event that shifted everything
Tweets 5-7 (SYSTEM): The actual approach/framework (3-4 key points)
Tweet 8 (PROOF): Specific, quantifiable outcomes
Tweet 9 (LESSON): One punchy, quotable takeaway
Tweet 10 (CTA): Soft ask — follow/bookmark/reply`,

    "Case Study": `BEHIND-THE-SCENES THREAD:
Tweet 1 (HOOK): The result first — specific numbers
Tweet 2 (CONTEXT): Who the client was, what they came with
Tweets 3-4 (PROBLEM): What wasn't working and why
Tweets 5-7 (PROCESS): Exactly what you did, step by step — show the work
Tweet 8 (RESULTS): Before vs after with specific metrics
Tweet 9 (STEAL THIS): The one thing anyone can take from this
Tweet 10 (CTA): DM keyword or follow ask`,

    "Hot Take": `CONTRARIAN ARGUMENT THREAD:
Tweet 1 (HOOK): "Everyone says [common belief]. They're wrong. Here's the data:"
Tweet 2 (CLAIM): State your contrarian position in one clear sentence
Tweet 3 (WHY WRONG): Core flaw in mainstream thinking
Tweets 4-5 (EVIDENCE): Stats, case study, personal experiment, research
Tweet 6 (NUANCE): The part most people miss
Tweet 7 (FRAMEWORK): Your alternative approach (3 principles)
Tweet 8 (PROOF): What happened when you applied your approach
Tweet 9 (CTA): "Disagree? Tell me what I'm missing. I read every reply."`,

    "Social Proof": `TRANSFORMATION THREAD:
Tweet 1 (HOOK): The transformation — specific numbers, before/after
Tweet 2 (BEFORE): The starting state in vivid detail
Tweets 3-4 (JOURNEY): The process — what was tried, what failed
Tweets 5-6 (BREAKTHROUGH): What actually worked and why
Tweet 7 (AFTER): The current state with specific metrics
Tweet 8 (DIFFERENCE): The one thing that made the biggest difference
Tweet 9 (LESSON): Universal principle anyone can apply
Tweet 10 (CTA): Follow + bookmark ask`,
  }

  const goalCTAMap: Record<Goal, string> = {
    "Brand Awareness": "Follow me @handle for more threads like this. Repost the first tweet to help someone you know.",
    "Lead Generation": "Want help with [outcome]? DM me '[keyword]' and I'll send you [specific thing]. Or: link in bio.",
    "Community Building": "Which point resonated most? Drop it in the replies. I read every one.",
    "Sales & Conversions": "Ready to [achieve outcome]? DM me '[keyword]' to get started.",
    "Education & Authority": "Follow me @handle — I break down [niche] like this daily. Bookmark this thread to revisit.",
  }

  return `Write a ${threadType} thread on this topic, PLUS 3 strategic reply templates.

BUSINESS CONTEXT:
- Business: ${profile.business_name || xProfile.name || "Not provided"}
- Industry: ${profile.industry || "Not provided"}
- Niche: ${xProfile.niche || profile.industry || "Not provided"}
- Audience: ${xProfile.audience_description || profile.target_audience || "Not provided"}
- Location: ${profile.location || "UK"}
- X Handle: ${profile.x_handle || "Not provided"}
- Offers: ${profile.offers || "Not provided"}
- USP: ${profile.usp || "Not provided"}
- Primary CTA: ${xProfile.cta_preference || profile.primary_cta || "Not provided"}
- Proof Points: ${profile.proof_points || "Not provided"}
- Voice Sample: ${profile.voice_sample || "Not provided — write in the specified tone"}
- Current Followers: ${xProfile.current_followers || "Not provided"}

TOPIC: ${topic}
THREAD TYPE: ${threadType}
GOAL: ${goal}
TONE: ${tone}
CTA STYLE: ${goalCTAMap[goal]}

THREAD BLUEPRINT TO FOLLOW:
${threadStructures[threadType]}

RULES FOR THREAD:
1. Each tweet MUST be under 280 characters — count carefully (\\n = 1 char, emoji = 2 chars)
2. Hook tweet (tweet 1) uses a formula from PROVEN HOOK FORMULAS — pick the strongest for this topic
3. Never start the hook with "I" or the business name
4. Number body tweets (1/ 2/ etc.) for clarity and read-through
5. Every tweet must earn its place — ruthlessly cut padding and filler
6. Use mini-cliffhangers every 2-3 tweets to maintain momentum
7. Escalate value — don't front-load everything in the first 3 tweets
8. The final CTA tweet must match the goal AND ask them to RT tweet 1 (concentrates algorithm signals)
9. Every tweet must fully embody the "${tone}" tone
10. Format for mobile: short lines, strategic line breaks, one idea per line
11. Use specific numbers, examples, and concrete details — never vague claims
12. Write like a practitioner sharing field notes, not a guru lecturing

RULES FOR THE 3 STRATEGIC REPLIES:
1. Each reply is designed to be posted under a larger account's tweet related to this thread's topic
2. Each reply uses a DIFFERENT reply type:
   - Reply 1: "Agree + Expand" — validate their point, add your layer
   - Reply 2: "Add the Missing Piece" — the insight they left out
   - Reply 3: "Polite Disagreement" or "Personal Story" — stand out in replies
3. Add genuine value — a specific tactic, data point, or real example
4. Never be generic. Be the reply that gets pinned or goes viral on its own
5. Stay under 280 characters
6. Sound like an authority without being salesy

Respond with valid JSON only:
{
  "thread": [
    {
      "tweet_number": 1,
      "text": "hook tweet text — use \\n for line breaks",
      "type": "hook",
      "char_count": 180
    },
    {
      "tweet_number": 2,
      "text": "1/ body tweet text",
      "type": "body",
      "char_count": 210
    },
    {
      "tweet_number": 10,
      "text": "cta tweet text",
      "type": "cta",
      "char_count": 160
    }
  ],
  "hook": "the opening line of tweet 1",
  "hook_formula": "which hook formula was used (e.g. 'Juxtaposition', 'Specific Promise')",
  "thread_type": "${threadType}",
  "tweet_count": 10,
  "goal_alignment": "one sentence on how this thread serves ${goal}",
  "replies": [
    {
      "text": "reply text under 280 chars",
      "scenario": "specific type of tweet to reply to",
      "strategy": "agree and expand | add missing piece | polite disagreement | personal story validation | summariser | extend conversation",
      "char_count": 120,
      "why_it_works": "one sentence on why this reply builds authority and triggers follow-backs"
    }
  ]
}`
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
    const tone = TONES.includes(body.tone as (typeof TONES)[number])
      ? String(body.tone)
      : "Direct"
    const temperature = Math.min(1, Math.max(0, Number(body.temperature ?? 0.7)))
    const masterPrompt = cleanMultilineText(body.masterPrompt, 2000)

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

    // Fetch profile contexts + feedback in parallel
    const [profile, xProfile, feedbackConstraints] = await Promise.all([
      fetchProfileContext(supabase, user.id),
      fetchXProfileContext(supabase, user.id),
      getUserFeedbackContext(user.id),
    ])

    let responseText = ""
    if (mode === "tweet") {
      const message = await getAnthropic().messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 3000,
        temperature,
        system: buildTweetSystemPrompt(goal, tone, masterPrompt, xProfile, feedbackConstraints),
        messages: [{ role: "user", content: buildTweetPrompt({ topic, goal, tone, profile, xProfile }) }],
      })
      responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
    } else {
      const message = await getAnthropic().messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 5000,
        temperature,
        system: buildThreadSystemPrompt(goal, tone, masterPrompt, xProfile, feedbackConstraints),
        messages: [{ role: "user", content: buildThreadPrompt({ topic, threadType, goal, tone, profile, xProfile }) }],
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
