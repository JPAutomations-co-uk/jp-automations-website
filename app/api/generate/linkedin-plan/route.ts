import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

const TOKEN_COST = 25

const VALID_FORMATS = ["Text Post", "Image Post", "Carousel", "Long-form Post", "Poll"] as const
const VALID_FUNNEL_STAGES = ["TOFU", "MOFU", "BOFU"] as const
const VALID_AUDIENCE_SIZES = ["0-1K", "1K-10K", "10K-50K", "50K+"] as const

type FunnelStage = (typeof VALID_FUNNEL_STAGES)[number]
type AudienceSize = (typeof VALID_AUDIENCE_SIZES)[number]
type StageMix = { tofu: number; mofu: number; bofu: number }

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const

const KPI_BY_STAGE: Record<FunnelStage, string> = {
  TOFU: "impressions",
  MOFU: "comment_rate",
  BOFU: "profile_visit_rate",
}

const STAGE_FORMAT_PREFERENCES: Record<FunnelStage, readonly string[]> = {
  TOFU: ["Text Post", "Image Post", "Poll"],
  MOFU: ["Carousel", "Long-form Post", "Text Post"],
  BOFU: ["Text Post", "Image Post", "Carousel"],
}

function round2(v: number) {
  return Math.round(v * 100) / 100
}

function cleanText(value: unknown, maxLen: number): string {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, maxLen)
}

function cleanList(values: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(values)) return []
  return values
    .map((v) => cleanText(v, maxLen))
    .filter(Boolean)
    .slice(0, maxItems)
}

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

function normaliseGoal(goal: string): string {
  const g = String(goal || "").trim().toLowerCase()
  if (g.includes("awareness")) return "Brand Awareness"
  if (g.includes("thought") || g.includes("authority")) return "Thought Leadership"
  if (g.includes("sales") || g.includes("conversion")) return "Sales & Conversions"
  if (g.includes("community")) return "Community Building"
  return "Lead Generation"
}

function getGoalBaseMix(goal: string): StageMix {
  switch (normaliseGoal(goal)) {
    case "Brand Awareness":
      return { tofu: 70, mofu: 20, bofu: 10 }
    case "Thought Leadership":
      return { tofu: 40, mofu: 45, bofu: 15 }
    case "Sales & Conversions":
      return { tofu: 30, mofu: 30, bofu: 40 }
    case "Community Building":
      return { tofu: 55, mofu: 35, bofu: 10 }
    default:
      return { tofu: 45, mofu: 35, bofu: 20 }
  }
}

function normaliseMix(goal: string, audienceSize: AudienceSize): StageMix {
  const base = getGoalBaseMix(goal)
  const adj =
    audienceSize === "0-1K"
      ? { tofu: 10, mofu: -5, bofu: -5 }
      : audienceSize === "50K+"
        ? { tofu: -10, mofu: 5, bofu: 5 }
        : { tofu: 0, mofu: 0, bofu: 0 }

  const t = Math.max(10, base.tofu + adj.tofu)
  const m = Math.max(10, base.mofu + adj.mofu)
  const b = Math.max(10, base.bofu + adj.bofu)
  const sum = t + m + b

  return {
    tofu: round2((t / sum) * 100),
    mofu: round2((m / sum) * 100),
    bofu: round2((b / sum) * 100),
  }
}

function allocateStageCounts(total: number, mix: StageMix): Record<FunnelStage, number> {
  const raw = {
    TOFU: (total * mix.tofu) / 100,
    MOFU: (total * mix.mofu) / 100,
    BOFU: (total * mix.bofu) / 100,
  }
  const counts = {
    TOFU: Math.floor(raw.TOFU),
    MOFU: Math.floor(raw.MOFU),
    BOFU: Math.floor(raw.BOFU),
  }
  let remaining = total - (counts.TOFU + counts.MOFU + counts.BOFU)
  const order = (Object.keys(raw) as FunnelStage[]).sort(
    (a, b) => raw[b] - Math.floor(raw[b]) - (raw[a] - Math.floor(raw[a]))
  )
  let idx = 0
  while (remaining > 0) {
    counts[order[idx % order.length]] += 1
    idx++
    remaining--
  }
  return counts
}

function buildStageSequence(total: number, counts: Record<FunnelStage, number>): FunnelStage[] {
  const sequence: FunnelStage[] = []
  const buckets = { ...counts }

  while (sequence.length < total) {
    const stage = (Object.keys(buckets) as FunnelStage[]).sort((a, b) => buckets[b] - buckets[a])[0]
    if (buckets[stage] <= 0) break

    if (sequence.length > 0 && sequence[sequence.length - 1] === stage) {
      const alt = (Object.keys(buckets) as FunnelStage[]).find((s) => s !== stage && buckets[s] > 0)
      if (alt) {
        sequence.push(alt)
        buckets[alt]--
        continue
      }
    }
    sequence.push(stage)
    buckets[stage]--
  }
  while (sequence.length < total) sequence.push("TOFU")
  return sequence
}

function getDaysInMonth(month: string): number {
  const [y, m] = month.split("-").map(Number)
  return new Date(y, m, 0).getDate()
}

function buildDateSlots(month: string, total: number): { date: string; dayOfWeek: string }[] {
  const [y, m] = month.split("-").map(Number)
  const daysInMonth = getDaysInMonth(month)
  const slots: { date: string; dayOfWeek: string }[] = []

  for (let i = 0; i < total; i++) {
    const day = Math.floor((i * daysInMonth) / total) + 1
    const date = new Date(Date.UTC(y, m - 1, day))
    slots.push({
      date: `${month}-${String(day).padStart(2, "0")}`,
      dayOfWeek: DAY_NAMES[date.getUTCDay()],
    })
  }
  return slots
}

function pickFormat(stage: FunnelStage, enabledFormats: string[], index: number): string {
  const preferred = STAGE_FORMAT_PREFERENCES[stage].filter((f) => enabledFormats.includes(f))
  const pool = preferred.length > 0 ? preferred : enabledFormats
  return pool[index % pool.length]
}

function buildGoalTactics(goal: string, desiredOutcomes: string): string {
  const normalised = normaliseGoal(goal)
  const outcomeClause = desiredOutcomes ? `\nSpecific desired outcome: ${desiredOutcomes}` : ""

  const tacticsMap: Record<string, string> = {
    "Lead Generation": `GOAL: LEAD GENERATION
Every post must move a viewer closer to making a direct enquiry, booking, or DM.
- TOFU: Surface the problem they didn't know they had. Hook on pain or curiosity. Soft CTA: "DM me [word] to find out more."
- MOFU: Position as the obvious expert solution. Show proof and client outcomes. CTA: book a call, get a free audit.
- BOFU: Demolish every buying objection — price, trust, timing. Hard CTA: "DM [word] now" or "Link in bio to apply."
Every post's description must state exactly how this post creates enquiry intent in the viewer.`,

    "Brand Awareness": `GOAL: BRAND AWARENESS
Every post must reach new professionals and earn reshares, comments, and follows.
- TOFU: Maximum shareability. Strong opinions, relatable pain points, counterintuitive takes. Zero sales messaging.
- MOFU: Value-first education that earns saves and builds authority. Shareable frameworks and insights.
- BOFU: Soft social proof — stories and transformations that make people follow without feeling sold to.
Every post's description must state exactly how this post gets discovered or reshared by people outside the current network.`,

    "Sales & Conversions": `GOAL: SALES & CONVERSIONS
Every post must shorten the buying decision and push warm connections to purchase or book.
- TOFU: Create desire before revealing the product. Lead with the transformation result.
- MOFU: Service/product specifics framed as benefits. Handle price anchoring. Compare favourably to alternatives.
- BOFU: Direct CTA with social proof. Stack testimonials. Link to book/buy. Create FOMO.
Every post's description must state exactly how this post removes friction for a ready-to-buy prospect.`,

    "Thought Leadership": `GOAL: THOUGHT LEADERSHIP
Every post must build expert reputation and make the creator the undisputed authority in their niche.
- TOFU: Debunk myths or challenge mainstream advice. Hook on "everyone's wrong about X." Make them rethink what they knew.
- MOFU: Deep tactical value — frameworks, step-by-steps, case studies. Save-worthy and reshare-worthy.
- BOFU: Client results, credentials, and track record. Soft CTA to work together or follow for more.
Every post's description must state exactly how this post makes the viewer more likely to trust and hire the creator.`,

    "Community Building": `GOAL: COMMUNITY BUILDING
Every post must generate replies, reshares, and genuine human connection.
- TOFU: Opinion-led and conversational. Take a strong side. Pose a question. Spark healthy debate.
- MOFU: Behind-the-scenes, personal stories, failures and wins. Community follows humans first, brands second.
- BOFU: Invite direct participation — open questions, challenges, community spotlights.
Every post's description must state exactly how this post creates real conversation and deepens connection.`,
  }

  return (tacticsMap[normalised] || tacticsMap["Lead Generation"]) + outcomeClause
}

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = (await request.json()) as Record<string, unknown>

    const postsPerWeek = Number(body.postsPerWeek)
    const month = cleanText(body.month, 7)
    const industry = cleanText(body.industry, 100)
    const businessDescription = cleanText(body.businessDescription, 500)
    const targetAudience = cleanText(body.targetAudience, 500)
    const goals = cleanText(body.goals, 100)
    const desiredOutcomes = cleanText(body.desiredOutcomes, 500)
    const audienceSize = VALID_AUDIENCE_SIZES.includes(body.audienceSize as AudienceSize)
      ? (body.audienceSize as AudienceSize)
      : "1K-10K"
    const contentPillars = cleanList(body.contentPillars, 8, 100)
    const enabledFormats = cleanList(body.enabledFormats, 6, 60).filter((f) =>
      VALID_FORMATS.includes(f as (typeof VALID_FORMATS)[number])
    )

    if (![3, 5].includes(postsPerWeek)) {
      return NextResponse.json({ error: "postsPerWeek must be 3 or 5" }, { status: 400 })
    }
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "month must be YYYY-MM" }, { status: 400 })
    }
    if (!industry || !targetAudience || !goals) {
      return NextResponse.json({ error: "industry, targetAudience, and goals are required" }, { status: 400 })
    }

    // Pre-check balance against token_balances table (same as X route)
    const admin = createAdminClient()
    const { data: balanceRow } = await admin
      .from("token_balances")
      .select("balance")
      .eq("user_id", user.id)
      .single()
    const currentBalance = (balanceRow as { balance?: number } | null)?.balance ?? 0
    if (currentBalance < TOKEN_COST) {
      return NextResponse.json(
        { error: "Insufficient tokens", balance_needed: TOKEN_COST, current_balance: currentBalance },
        { status: 402 }
      )
    }

    type ProfileRow = {
      business_name?: string | null
      industry?: string | null
      target_audience?: string | null
      brand_voice?: string | null
      tone?: string | null
      location?: string | null
      voice_sample?: string | null
    }
    const { data: profileData } = await supabase
      .from("profiles")
      .select("business_name, industry, target_audience, brand_voice, tone, location, voice_sample")
      .eq("id", user.id)
      .single()
    const profile = profileData as ProfileRow | null

    // Build calendar slots
    const daysInMonth = getDaysInMonth(month)
    const [yearNum, monthNum] = month.split("-").map(Number)
    const firstDayOfWeek = (new Date(yearNum, monthNum - 1, 1).getDay() + 6) % 7
    const calendarWeeks = Math.ceil((daysInMonth + firstDayOfWeek) / 7)
    const exactPosts = postsPerWeek * calendarWeeks

    const funnelMix = normaliseMix(goals, audienceSize)
    const stageCounts = allocateStageCounts(exactPosts, funnelMix)
    const stageSequence = buildStageSequence(exactPosts, stageCounts)
    const dateSlots = buildDateSlots(month, exactPosts)

    const safePillars =
      contentPillars.length > 0
        ? contentPillars
        : ["Tips & education", "Client results", "Thought leadership"]
    const safeFormats = enabledFormats.length > 0 ? enabledFormats : [...VALID_FORMATS]

    const slots = stageSequence.map((stage, i) => ({
      id: `slot-${i + 1}`,
      date: dateSlots[i].date,
      dayOfWeek: dateSlots[i].dayOfWeek,
      funnel_stage: stage,
      pillar: safePillars[i % safePillars.length],
      format: pickFormat(stage, safeFormats, i),
      primary_kpi: KPI_BY_STAGE[stage],
    }))

    const goalTactics = buildGoalTactics(goals, desiredOutcomes)

    const systemPrompt = `You are an elite LinkedIn strategist. Your mission: help this business achieve their goal through LinkedIn content.

Before writing each post, ask: "How does THIS specific post move a real person closer to ${normaliseGoal(goals)}?"

Output valid JSON only. No markdown fences. No commentary.

For each post generate:
- title: Specific and compelling. Not generic.
- description: A focused content brief (60-80 words). What to say, what angle to take, and how it advances the goal.
- caption_hook: The first 2-3 lines that appear before "see more" (~210 chars). Never start with "I" or the business name. Creates immediate curiosity, pain recognition, or a bold claim.
- why_it_works: One sentence — the psychological mechanism for this funnel stage.
- engagement_tip: One specific tactical action tied to the primary_kpi.
- posting_time: HH:MM (24h). LinkedIn best times: 07:00-09:00 or 12:00-13:00, prioritise Tue-Thu.
- hashtags: 3-5 values, no # prefix, relevant to the niche.`

    const userPrompt = `Create a LinkedIn content plan for ${month}.

BUSINESS CONTEXT:
- Industry: ${industry}
- Business: ${businessDescription || "Not provided"}
- Audience: ${targetAudience}
- Audience Size: ${audienceSize}
- Primary Goal: ${goals}
- Desired Outcomes: ${desiredOutcomes || "Not provided"}

GOAL STRATEGY — READ THIS CAREFULLY. EVERY POST MUST SERVE THIS:
${goalTactics}

VOICE LOCK:
- Brand Voice: ${cleanText(profile?.brand_voice, 200) || "Professional"}
- Tone: ${cleanText(profile?.tone, 120) || "Authoritative but approachable"}
- Business Name: ${cleanText(profile?.business_name, 120) || "Business"}
- Location: ${cleanText(profile?.location, 120) || "UK"}
- Voice Sample: ${cleanText(profile?.voice_sample, 2500) || "Not provided — write in a direct, expert tone"}

SLOT BLUEPRINTS (keep these fields exactly as provided):
${JSON.stringify(slots, null, 2)}

RULES:
1. Keep date, dayOfWeek, funnel_stage, pillar, format, primary_kpi exactly as slot values.
2. caption_hook must be the first 2-3 lines before "see more" (~210 chars max). Never start with "I" or the business name.
3. description must be 60-80 words — focused content brief explaining what to say and the angle to take.
4. Use 3-5 hashtags per post, no leading # symbol.
5. All posts must use diverse angles — no repeated hooks or same opening words.
6. posting_time must be HH:MM optimised for LinkedIn (07:00-09:00 or 12:00-13:00 preferred).
7. why_it_works must explain the psychological mechanism for this funnel stage.
8. engagement_tip must be a specific tactical action tied to the primary_kpi.

RESPONSE FORMAT (valid JSON only):
{
  "month": "${month}",
  "monthTheme": "...",
  "monthThemeDescription": "...",
  "postsPerWeek": ${postsPerWeek},
  "frequencyRationale": "...",
  "funnelBreakdown": { "tofu": ${funnelMix.tofu}, "mofu": ${funnelMix.mofu}, "bofu": ${funnelMix.bofu} },
  "posts": [
    {
      "id": "slot-1",
      "date": "YYYY-MM-DD",
      "dayOfWeek": "Monday",
      "title": "...",
      "description": "...",
      "format": "Text Post",
      "funnel_stage": "TOFU",
      "pillar": "...",
      "caption_hook": "...",
      "posting_time": "08:00",
      "hashtags": ["...", "..."],
      "why_it_works": "...",
      "engagement_tip": "...",
      "primary_kpi": "impressions"
    }
  ]
}`

    let message
    try {
      message = await getAnthropic().messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 16000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      })
    } catch (claudeError) {
      console.error("Claude API error:", claudeError)
      return NextResponse.json({ error: "AI generation failed", detail: String(claudeError) }, { status: 502 })
    }

    const responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
    const parsed = safeJsonParse(responseText)

    if (!parsed || typeof parsed !== "object") {
      console.error("JSON parse failed. stop_reason:", message.stop_reason, "response length:", responseText.length)
      return NextResponse.json({ error: "Failed to parse content plan", stop_reason: message.stop_reason }, { status: 500 })
    }

    // Deduct tokens directly (debit_tokens RPC fails — balance_after NOT NULL constraint not met by the function)
    const newBalance = currentBalance - TOKEN_COST
    const { error: updateErr } = await admin
      .from("token_balances")
      .update({ balance: newBalance, updated_at: new Date().toISOString() } as never)
      .eq("user_id", user.id)

    if (updateErr) {
      console.error("token_balances update error:", updateErr)
      throw updateErr
    }

    // Record transaction — include balance_after to satisfy NOT NULL constraint
    await admin
      .from("token_transactions")
      .insert({
        user_id: user.id,
        amount: -TOKEN_COST,
        type: "feature_use",
        description: `Generated LinkedIn content plan for ${month}`,
        balance_after: newBalance,
      } as never)

    return NextResponse.json({
      plan: parsed,
      balance: newBalance,
      deducted: TOKEN_COST,
      funnelMix,
    })
  } catch (error) {
    console.error("LinkedIn plan generation error:", error)
    return NextResponse.json({ error: "Failed to generate content plan" }, { status: 500 })
  }
}
