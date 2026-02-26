import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"

const TOKEN_COST = 5

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function safeJsonParse(text: string): unknown | null {
  const cleaned = text.replace(/^```(?:json)?\s*/m, "").replace(/\s*```\s*$/m, "").trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) return null
  try { return JSON.parse(match[0]) } catch { return null }
}

function cleanText(value: unknown, maxLen: number): string {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, maxLen)
}

type ProfileContext = {
  business_name?: string | null
  industry?: string | null
  target_audience?: string | null
  location?: string | null
}

async function fetchProfileContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<ProfileContext> {
  const { data } = await supabase
    .from("profiles")
    .select("business_name, industry, target_audience, location")
    .eq("id", userId)
    .single()
  return (data || {}) as ProfileContext
}

function buildPrompt(params: {
  niche: string
  goal: string
  targetAudience: string
  location: string
}): string {
  const { niche, goal, targetAudience, location } = params

  return `Generate a strategic X (Twitter) account interaction plan for someone in the "${niche}" niche, with the goal of "${goal}".

TARGET AUDIENCE THEY SERVE: ${targetAudience}
LOCATION: ${location || "UK / Global"}

Generate three tiers of accounts:

TIER 1 — REPLY TARGETS (Large accounts 100K+ followers):
These are accounts whose audience is exactly the target audience. The strategy is to reply to their posts with genuine, value-adding comments to get visibility in front of their followers.
- Include 5–8 accounts
- Name REAL, specific @handles you know from training data where possible
- If uncertain about a specific handle, describe the archetype clearly and note it as an archetype
- For each: handle or archetype, why their audience is the target, content type they post, suggested reply angle (what kind of replies add value), ideal reply frequency

TIER 2 — PEER ACCOUNTS (5K–100K followers):
Similar-sized creators and businesses. Genuine engagement builds relationships and cross-referrals.
- Include 5–8 accounts
- Mix of named handles and archetypes
- For each: handle or archetype, why they're a good peer, how to engage, collaboration potential

TIER 3 — EMERGING VOICES (<5K followers):
Up-and-coming accounts in the niche. Follow early to build mutual relationships before they grow.
- Include 4–6 accounts
- Focus on archetypes and search terms here
- For each: archetype description, why to follow, Twitter search query to find them

Also generate:
- A WEEKLY INTERACTION ROUTINE: A specific daily/weekly routine (Mon–Sun) with concrete actions
- SEARCH TERMS: 5–10 Twitter search queries to find more accounts in this niche
- HASHTAGS TO MONITOR: 5–8 hashtags where the target audience and niche influencers are active

IMPORTANT RULES:
1. Be specific and tactical — not generic advice
2. For named accounts, include a confidence note ("high confidence" / "verify before following")
3. The reply angle must explain WHAT kind of reply adds value (not just "add value")
4. Location context: if ${location} is specific, prioritise accounts from that region where possible
5. Every account must directly relate to either: reaching the target audience OR building authority in the niche

Respond with valid JSON only:
{
  "tier1_reply_targets": [
    {
      "handle": "@realhandle or 'Archetype: [description]'",
      "is_named": true,
      "confidence": "high | medium | verify",
      "follower_range": "500K+",
      "why_relevant": "...",
      "content_type": "what they post about",
      "reply_angle": "specific type of reply that adds value and positions you",
      "reply_frequency": "3–4 times per week"
    }
  ],
  "tier2_peer_accounts": [
    {
      "handle": "@realhandle or 'Archetype: [description]'",
      "is_named": true,
      "confidence": "high | medium | verify",
      "follower_range": "10K–50K",
      "why_relevant": "...",
      "engagement_strategy": "how to engage",
      "collaboration_potential": "what you could do together"
    }
  ],
  "tier3_emerging": [
    {
      "archetype": "description of the type of account",
      "search_query": "exact Twitter search query to find them",
      "why_follow_early": "...",
      "follow_count_target": 5
    }
  ],
  "weekly_routine": {
    "monday": "...",
    "tuesday": "...",
    "wednesday": "...",
    "thursday": "...",
    "friday": "...",
    "weekend": "..."
  },
  "search_terms": ["query 1", "query 2", "..."],
  "hashtags_to_monitor": ["#tag1", "#tag2", "..."],
  "strategy_summary": "2–3 sentences summarising the overall engagement strategy and why it will work for this niche and goal"
}`
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const actorId = resolveRequestActorId({ userId: user.id, forwardedFor: request.headers.get("x-forwarded-for"), fallback: "x-accounts" })
    const rate = checkRateLimit(`generate-x-accounts:${actorId}`, { max: 10, windowMs: 60_000 })
    if (!rate.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded." }, {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      })
    }

    const body = (await request.json()) as Record<string, unknown>
    const niche = cleanText(body.niche, 200)
    const goal = cleanText(body.goal, 100)
    const targetAudience = cleanText(body.targetAudience, 500)

    if (!niche || !goal) {
      return NextResponse.json({ error: "niche and goal are required" }, { status: 400 })
    }

    const profile = await fetchProfileContext(supabase, user.id)
    const location = cleanText(body.location || profile.location, 100)

    // Check balance
    const { data: balanceRow } = await admin
      .from("token_balances")
      .select("balance")
      .eq("user_id", user.id)
      .single()
    const balance = (balanceRow as { balance?: number } | null)?.balance ?? 0
    if (balance < TOKEN_COST) {
      return NextResponse.json({ error: "Insufficient tokens", balance_needed: TOKEN_COST, current_balance: balance }, { status: 402 })
    }

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 6000,
      system: `You are an elite X (Twitter) growth strategist with deep knowledge of creators, thought leaders, and business accounts across all major niches. You recommend specific real accounts where you're confident about their existence and following, and use clear archetype descriptions where you're not. Output valid JSON only.`,
      messages: [{
        role: "user",
        content: buildPrompt({ niche, goal, targetAudience: targetAudience || profile.target_audience || "General business audience", location }),
      }],
    })

    const responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
    const parsed = safeJsonParse(responseText)
    if (!parsed) return NextResponse.json({ error: "Generation failed" }, { status: 500 })

    // Debit tokens
    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: TOKEN_COST,
      p_type: "feature_use",
      p_description: `Generated X account strategy for "${niche}" niche`,
    } as never)

    if (debitError) {
      const msg = String(debitError.message || debitError)
      if (msg.includes("Insufficient")) return NextResponse.json({ error: "Insufficient tokens", balance_needed: TOKEN_COST }, { status: 402 })
      throw debitError
    }

    return NextResponse.json({
      ...(parsed as object),
      niche,
      goal,
      balance: newBalance,
      deducted: TOKEN_COST,
    })
  } catch (error) {
    console.error("X accounts generation error:", error)
    return NextResponse.json({ error: "Failed to generate account strategy" }, { status: 500 })
  }
}
