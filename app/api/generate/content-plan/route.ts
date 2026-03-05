import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"

const FEATURE_KEY = "content_plan"
const QUALITY_COSTS = {
  fast: 25,
  pro: 60,
} as const

const PLANNER_V2_FLAG = process.env.PLANNER_QUALITY_V2 !== "0"
const MAX_PRO_ATTEMPTS = 3
const MAX_FAST_ATTEMPTS = 1

const VALID_FUNNEL_STAGES = ["TOFU", "MOFU", "BOFU"] as const
const VALID_FORMATS = [
  "Talking Head Reel",
  "Voiceover/B-Roll Reel",
  "Carousel",
  "Single Image",
  "Story",
] as const
const VALID_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const
const VALID_AUDIENCE_SIZES = ["0-1K", "1K-10K", "10K-50K", "50K+"] as const
const VALID_QUALITY_MODES = ["fast", "pro"] as const

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const

const KPI_BY_STAGE: Record<FunnelStage, string> = {
  TOFU: "reach_rate",
  MOFU: "save_rate",
  BOFU: "profile_action_rate",
}

type QualityMode = "fast" | "pro"
type FunnelStage = (typeof VALID_FUNNEL_STAGES)[number]
type AudienceSize = (typeof VALID_AUDIENCE_SIZES)[number]

type StageMix = {
  tofu: number
  mofu: number
  bofu: number
}

interface PlannerBrief {
  coreOffer: string
  primaryCTA: string
  differentiator: string
  proofPoints: string[]
  forbiddenTopics: string[]
  complianceConstraints: string
  topObjections?: string[]
  seasonalContext?: string
  priorityProducts?: string[]
  competitorAnglesToAvoid?: string[]
}

interface EvidenceRef {
  source_type: "account" | "benchmark" | "trend"
  reference_id: string
  pattern: string
  observed_lift: number
}

interface ResearchCandidate {
  source_type: "account" | "benchmark" | "trend"
  reference_id: string
  pattern: string
  format?: string | null
  pillar?: string | null
  funnel_stage?: FunnelStage | null
  reach_rate: number
  share_rate: number
  save_rate: number
  comment_rate: number
  profile_action_rate: number
  intent_comment_rate: number
  non_follower_ratio: number
  observed_lift: number
  collected_at?: string | null
}

interface SlotBlueprint {
  id: string
  date: string
  dayOfWeek: string
  funnel_stage: FunnelStage
  pillar: string
  format: string
  primary_kpi: string
  evidence_refs: EvidenceRef[]
}

interface GeneratedPost {
  id: string
  date: string
  dayOfWeek: string
  title: string
  description: string
  format: string
  funnel_stage: FunnelStage
  pillar: string
  caption_hook: string
  posting_time: string
  hashtags: string[]
  why_it_works: string
  engagement_tip: string
  goal_alignment: string
  primary_kpi: string
  evidence_refs: EvidenceRef[]
}

interface GeneratedPlan {
  month: string
  monthTheme: string
  monthThemeDescription: string
  postsPerWeek: number
  frequencyRationale: string
  funnelBreakdown: StageMix
  pillarDistribution: Record<string, number>
  posts: GeneratedPost[]
}

interface QualityScores {
  strategic_fit: number
  voice_match: number
  hook_strength: number
  funnel_fit: number
  novelty: number
  actionability: number
}

interface QualityResult {
  overall: number
  dimensions: QualityScores
  pass: boolean
  gaps: string[]
}

interface ResearchSummary {
  sourceCounts: {
    account: number
    benchmark: number
    trends: number
  }
  hasAccountSignals: boolean
  topPatternsByStage: Record<FunnelStage, string[]>
}

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function normaliseGoal(goal: string): string {
  const g = String(goal || "").trim().toLowerCase()
  if (g.includes("awareness")) return "Brand Awareness"
  if (g.includes("community")) return "Community Building"
  if (g.includes("sales") || g.includes("conversion")) return "Sales & Conversions"
  if (g.includes("authority") || g.includes("education")) return "Education & Authority"
  return "Lead Generation"
}

function getGoalBaseMix(goal: string): StageMix {
  switch (normaliseGoal(goal)) {
    case "Brand Awareness":
      return { tofu: 70, mofu: 20, bofu: 10 }
    case "Community Building":
      return { tofu: 55, mofu: 35, bofu: 10 }
    case "Sales & Conversions":
      return { tofu: 30, mofu: 30, bofu: 40 }
    case "Education & Authority":
      return { tofu: 40, mofu: 45, bofu: 15 }
    default:
      return { tofu: 45, mofu: 35, bofu: 20 }
  }
}

function getAudienceAdjustment(audienceSize: AudienceSize): StageMix {
  switch (audienceSize) {
    case "0-1K":
      return { tofu: 10, mofu: -5, bofu: -5 }
    case "10K-50K":
      return { tofu: -5, mofu: 3, bofu: 2 }
    case "50K+":
      return { tofu: -10, mofu: 5, bofu: 5 }
    default:
      return { tofu: 0, mofu: 0, bofu: 0 }
  }
}

function buildGoalTactics(goal: string, audienceSize: AudienceSize, desiredOutcomes: string): string {
  const normalised = normaliseGoal(goal)
  const outcomeClause = desiredOutcomes ? `\nSpecific desired outcome: ${desiredOutcomes}` : ""
  const audienceClause =
    audienceSize === "0-1K"
      ? "\nAccount stage: Early (0–1K) — weight posts toward reach and shares over conversion. Build trust before selling."
      : audienceSize === "50K+"
        ? "\nAccount stage: Large (50K+) — warm audience exists. Weight MOFU/BOFU to convert followers into buyers/leads."
        : ""

  const tacticsMap: Record<string, string> = {
    "Lead Generation": `GOAL: LEAD GENERATION
Every post must move a viewer closer to making a direct enquiry, DM, or form submission.
- TOFU: Surface the problem they didn't know they had. Hook on pain or curiosity. Soft CTA: "Comment [word] or DM us to find out."
- MOFU: Position as the obvious expert solution. Show proof, before/afters, and client outcomes. CTA: book a call, get a free audit.
- BOFU: Demolish every buying objection — price, trust, timing. Hard CTA: "DM [word] now" or "Link in bio to apply today."
Every post's description must state exactly how this post creates enquiry intent in the viewer.`,

    "Brand Awareness": `GOAL: BRAND AWARENESS
Every post must reach new audiences and earn shares, saves, and follows from people who don't yet know the brand.
- TOFU: Maximum shareability. Strong opinions, relatable pain points, counterintuitive takes. Hook = pattern interrupt. Zero sales messaging.
- MOFU: Value-first education that earns saves and builds authority. Shareable frameworks, tools, and insights.
- BOFU: Soft social proof — stories, transformations, and testimonials that make people follow without feeling sold to.
Every post's description must state exactly how this post gets discovered or shared by people outside the current audience.`,

    "Sales & Conversions": `GOAL: SALES & CONVERSIONS
Every post must shorten the buying decision and push warm followers to purchase or book.
- TOFU: Create desire before revealing the product. Lead with the transformation result. Make them want the outcome first.
- MOFU: Product/service specifics framed as benefits. Handle price anchoring. Compare favourably to alternatives.
- BOFU: Direct product CTA with social proof and urgency. Stack testimonials. Link to buy/book. Create FOMO.
Every post's description must state exactly how this post removes friction or adds motivation for a ready-to-buy follower.`,

    "Community Building": `GOAL: COMMUNITY BUILDING
Every post must generate replies, shares, and genuine human connection.
- TOFU: Opinion-led and conversational. Take a strong side. Pose a question. Spark healthy debate. Hook = relatable or provocative.
- MOFU: Behind-the-scenes, personal stories, failures and wins. Community follows humans first, brands second.
- BOFU: Invite direct participation — challenges, polls, user-generated content prompts, community member spotlights.
Every post's description must state exactly how this post creates real conversation and deepens audience belonging.`,

    "Education & Authority": `GOAL: EDUCATION & AUTHORITY
Every post must build expert reputation and make the creator the undisputed go-to in their niche.
- TOFU: Debunk myths or challenge mainstream advice. Hook on "everyone's wrong about X." Make them rethink what they knew.
- MOFU: Deep tactical value — frameworks, step-by-steps, tools. Save-worthy and shareable with industry peers.
- BOFU: Client results, case studies, credentials, and track record. Soft CTA to work together or follow for more.
Every post's description must state exactly how this post makes the viewer more likely to trust and hire the creator.`,
  }

  return (tacticsMap[normalised] || tacticsMap["Lead Generation"]) + outcomeClause + audienceClause
}

const STAGE_FORMAT_PREFERENCES: Record<FunnelStage, readonly string[]> = {
  TOFU: ["Talking Head Reel", "Voiceover/B-Roll Reel", "Single Image"],
  MOFU: ["Carousel", "Talking Head Reel", "Voiceover/B-Roll Reel"],
  BOFU: ["Story", "Talking Head Reel", "Carousel"],
}

function pickFormatForStage(stage: FunnelStage, enabledFormats: string[], index: number): string {
  const preferred = STAGE_FORMAT_PREFERENCES[stage].filter((f) => enabledFormats.includes(f))
  const pool = preferred.length > 0 ? preferred : enabledFormats
  return pool[index % pool.length]
}

function normaliseMix(goal: string, audienceSize: AudienceSize): StageMix {
  const base = getGoalBaseMix(goal)
  const adj = getAudienceAdjustment(audienceSize)

  let tofu = base.tofu + adj.tofu
  let mofu = base.mofu + adj.mofu
  let bofu = base.bofu + adj.bofu

  tofu = Math.max(10, tofu)
  mofu = Math.max(10, mofu)
  bofu = Math.max(10, bofu)

  const sum = tofu + mofu + bofu
  return {
    tofu: round2((tofu / sum) * 100),
    mofu: round2((mofu / sum) * 100),
    bofu: round2((bofu / sum) * 100),
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
  const order = (Object.keys(raw) as FunnelStage[]).sort((a, b) => {
    const fracA = raw[a] - Math.floor(raw[a])
    const fracB = raw[b] - Math.floor(raw[b])
    return fracB - fracA
  })

  let idx = 0
  while (remaining > 0) {
    counts[order[idx % order.length]] += 1
    idx += 1
    remaining -= 1
  }

  return counts
}

function buildStageSequence(total: number, counts: Record<FunnelStage, number>): FunnelStage[] {
  const sequence: FunnelStage[] = []
  const buckets: Record<FunnelStage, number> = { ...counts }

  while (sequence.length < total) {
    const stage = (Object.keys(buckets) as FunnelStage[])
      .sort((a, b) => buckets[b] - buckets[a])[0]
    if (buckets[stage] <= 0) break

    if (sequence.length > 0 && sequence[sequence.length - 1] === stage) {
      const alt = (Object.keys(buckets) as FunnelStage[]).find(
        (s) => s !== stage && buckets[s] > 0
      )
      if (alt) {
        sequence.push(alt)
        buckets[alt] -= 1
        continue
      }
    }

    sequence.push(stage)
    buckets[stage] -= 1
  }

  while (sequence.length < total) {
    sequence.push("TOFU")
  }

  return sequence
}

function getDaysInMonth(month: string): number {
  const [yearNum, monthNum] = month.split("-").map(Number)
  return new Date(yearNum, monthNum, 0).getDate()
}

function buildDateSlots(month: string, total: number): { date: string; dayOfWeek: string }[] {
  const [yearNum, monthNum] = month.split("-").map(Number)
  const daysInMonth = getDaysInMonth(month)
  const slots: { date: string; dayOfWeek: string }[] = []

  for (let i = 0; i < total; i += 1) {
    const day = Math.floor((i * daysInMonth) / total) + 1
    const date = new Date(Date.UTC(yearNum, monthNum - 1, day))
    slots.push({
      date: `${month}-${String(day).padStart(2, "0")}`,
      dayOfWeek: DAY_NAMES[date.getUTCDay()],
    })
  }

  return slots
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

function parseQualityMode(value: unknown): QualityMode {
  return VALID_QUALITY_MODES.includes(value as QualityMode) ? (value as QualityMode) : "pro"
}

function parseAudienceSize(value: unknown): AudienceSize {
  if (VALID_AUDIENCE_SIZES.includes(value as AudienceSize)) return value as AudienceSize
  return "1K-10K"
}

function stageScoreForCandidate(candidate: ResearchCandidate, stage: FunnelStage): number {
  if (stage === "TOFU") {
    return (
      candidate.reach_rate * 0.35 +
      candidate.share_rate * 0.3 +
      candidate.non_follower_ratio * 0.2 +
      candidate.save_rate * 0.15
    )
  }
  if (stage === "MOFU") {
    return (
      candidate.save_rate * 0.35 +
      candidate.comment_rate * 0.25 +
      candidate.profile_action_rate * 0.2 +
      candidate.share_rate * 0.2
    )
  }
  return (
    candidate.profile_action_rate * 0.4 +
    candidate.intent_comment_rate * 0.25 +
    candidate.save_rate * 0.2 +
    candidate.share_rate * 0.15
  )
}

function parsePostingTime(value: unknown): string {
  const raw = String(value ?? "").trim()
  if (/^\d{2}:\d{2}$/.test(raw)) return raw
  return "09:00"
}

async function fetchProfileContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<ProfileContext> {
  const withVoiceSample = await supabase
    .from("profiles")
    .select("business_name, industry, target_audience, tone, location, voice_sample, offers, usp, primary_cta, proof_points")
    .eq("id", userId)
    .single()

  if (!withVoiceSample.error) {
    return (withVoiceSample.data || {}) as ProfileContext
  }

  if (!String(withVoiceSample.error.message || "").includes("voice_sample")) {
    throw withVoiceSample.error
  }

  const fallback = await supabase
    .from("profiles")
    .select("business_name, industry, target_audience, tone, location, offers, usp, primary_cta, proof_points")
    .eq("id", userId)
    .single()

  if (fallback.error) throw fallback.error
  const base = (fallback.data || {}) as Record<string, unknown>
  return { ...base, voice_sample: null } as ProfileContext
}

async function persistPlanWithPosts(params: {
  admin: ReturnType<typeof createAdminClient>
  userId: string
  planPayload: Record<string, unknown>
  postsToPersist: Array<Record<string, unknown>>
}): Promise<{ planId: string | null; error: string | null }> {
  const { admin, userId, planPayload, postsToPersist } = params

  const { data: rpcPlanId, error: rpcError } = await admin.rpc("create_content_plan_with_posts", {
    p_user_id: userId,
    p_plan_json: planPayload,
    p_posts_json: postsToPersist,
  } as never)

  if (!rpcError && rpcPlanId) {
    return { planId: String(rpcPlanId), error: null }
  }

  const rpcErrorText = String(rpcError?.message || "")
  const missingFunction =
    rpcErrorText.includes("Could not find the function") ||
    rpcErrorText.includes("create_content_plan_with_posts")

  if (!missingFunction) {
    return { planId: null, error: rpcErrorText || "RPC persistence failed" }
  }

  // Backward-compatible fallback when RPC is not deployed in the target DB.
  const { data: planRowRaw, error: planInsertError } = await admin
    .from("content_plans")
    .insert({
      ...planPayload,
      user_id: userId,
    } as never)
    .select("id")
    .single()

  const planRow = (planRowRaw || null) as { id?: string } | null
  const planId = planRow?.id
  if (planInsertError || !planId) {
    return { planId: null, error: String(planInsertError?.message || "Fallback plan insert failed") }
  }

  if (postsToPersist.length > 0) {
    const rows = postsToPersist.map((post) => ({
      ...post,
      user_id: userId,
      plan_id: planId,
    }))

    const { error: postsInsertError } = await admin
      .from("posts")
      .insert(rows as never)

    if (postsInsertError) {
      await admin.from("posts").delete().eq("plan_id", planId)
      await admin.from("content_plans").delete().eq("id", planId)
      return { planId: null, error: String(postsInsertError.message || "Fallback posts insert failed") }
    }
  }

  return { planId, error: null }
}

function parseHashtags(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => cleanText(item, 40).replace(/^#/, ""))
    .filter(Boolean)
    .slice(0, 12)
}

function scoreHookStrength(hook: string): number {
  const text = hook.trim()
  if (!text) return 20
  let score = 60
  if (text.length >= 25 && text.length <= 140) score += 15
  if (/\d/.test(text)) score += 8
  if (/[?!]/.test(text)) score += 6
  if (/\b(why|how|stop|avoid|mistake|secret|truth|nobody|exact)\b/i.test(text)) score += 8
  if (/\b(hello|today i want|here are|tips for)\b/i.test(text)) score -= 12
  return clamp(score, 0, 100)
}

function buildVoiceStopwords(forbiddenTopics: string[]): string[] {
  return forbiddenTopics
    .map((topic) => topic.toLowerCase())
    .filter(Boolean)
}

function evaluateQuality(params: {
  plan: GeneratedPlan
  slots: SlotBlueprint[]
  forbiddenTopics: string[]
  recentHooks: Set<string>
  qualityMode: QualityMode
}): QualityResult {
  const { plan, slots, forbiddenTopics, recentHooks, qualityMode } = params

  const stageTargets = slots.reduce(
    (acc, slot) => {
      acc[slot.funnel_stage] += 1
      return acc
    },
    { TOFU: 0, MOFU: 0, BOFU: 0 }
  )
  const stageActual = plan.posts.reduce(
    (acc, post) => {
      acc[post.funnel_stage] += 1
      return acc
    },
    { TOFU: 0, MOFU: 0, BOFU: 0 }
  )

  const total = Math.max(1, slots.length)
  const funnelDelta =
    Math.abs(stageTargets.TOFU - stageActual.TOFU) +
    Math.abs(stageTargets.MOFU - stageActual.MOFU) +
    Math.abs(stageTargets.BOFU - stageActual.BOFU)
  const funnelFit = clamp(100 - (funnelDelta / total) * 100, 0, 100)

  const hookScores = plan.posts.map((p) => scoreHookStrength(p.caption_hook))
  const hookStrength = hookScores.length
    ? hookScores.reduce((sum, n) => sum + n, 0) / hookScores.length
    : 0

  let noveltyPenalty = 0
  const seen = new Set<string>()
  for (const post of plan.posts) {
    const hook = post.caption_hook.toLowerCase().trim()
    if (seen.has(hook)) noveltyPenalty += 12
    seen.add(hook)
    if (recentHooks.has(hook)) noveltyPenalty += 8
  }
  const novelty = clamp(100 - noveltyPenalty, 0, 100)

  let voicePenalty = 0
  const voiceStopwords = buildVoiceStopwords(forbiddenTopics)
  for (const post of plan.posts) {
    const block = `${post.title} ${post.description} ${post.caption_hook}`.toLowerCase()
    for (const forbidden of voiceStopwords) {
      if (forbidden && block.includes(forbidden)) voicePenalty += 18
    }
  }
  const voiceMatch = clamp(100 - voicePenalty, 0, 100)

  const actionableHits = plan.posts.filter(
    (post) => post.engagement_tip.length >= 30 && /\b(post|ask|test|pin|reply|dm|track|comment|save|send|share|click|book|apply|message|link)\b/i.test(post.engagement_tip)
  ).length
  const actionability = clamp((actionableHits / total) * 100, 0, 100)

  // Goal alignment: check each post has a meaningful goal_alignment and descriptions are substantive
  const goalAlignedPosts = plan.posts.filter(
    (post) => post.goal_alignment && post.goal_alignment.length > 25
  ).length
  const substantiveDescriptions = plan.posts.filter(
    (post) => post.description && post.description.length > 80
  ).length
  const goalAlignmentScore = clamp(((goalAlignedPosts + substantiveDescriptions) / (total * 2)) * 100, 0, 100)

  const strategySignals = [
    plan.monthTheme.length > 6,
    plan.monthThemeDescription.length > 30,
    plan.frequencyRationale.length > 30,
    goalAlignmentScore > 70,
  ].filter(Boolean).length
  const strategicFit = clamp((strategySignals / 4) * 100, 0, 100)

  const dimensions: QualityScores = {
    strategic_fit: round2(strategicFit),
    voice_match: round2(voiceMatch),
    hook_strength: round2(hookStrength),
    funnel_fit: round2(funnelFit),
    novelty: round2(novelty),
    actionability: round2(actionability),
  }

  const overall = round2(
    (dimensions.strategic_fit +
      dimensions.voice_match +
      dimensions.hook_strength +
      dimensions.funnel_fit +
      dimensions.novelty +
      dimensions.actionability) /
      6
  )

  const requiredOverall = qualityMode === "pro" ? 88 : 75
  const requiredEach = qualityMode === "pro" ? 80 : 0
  const failing = qualityMode === "pro"
    ? Object.entries(dimensions)
      .filter(([, value]) => value < requiredEach)
      .map(([key]) => key)
    : []

  const pass = overall >= requiredOverall && (qualityMode === "pro" ? failing.length === 0 : true)
  const gaps = pass
    ? []
    : [
        ...(overall < requiredOverall ? [`overall score below ${requiredOverall}`] : []),
        ...failing.map((d) => `${d} below ${requiredEach}`),
      ]

  return { overall, dimensions, pass, gaps }
}

function buildSystemPrompt(goal: string, desiredOutcomes: string): string {
  const normalisedGoal = normaliseGoal(goal)
  const outcomeContext = desiredOutcomes ? ` Specifically: ${desiredOutcomes}.` : ""
  return `You are an elite Instagram strategist. Your sole mission: help this business achieve "${normalisedGoal}" through content.${outcomeContext}

Before writing each post, ask yourself: "How does THIS specific post move a real person closer to ${normalisedGoal}?"

Output valid JSON only. No markdown fences. No commentary.
Keep date, dayOfWeek, funnel_stage, pillar, format, primary_kpi, evidence_refs exactly as provided in slot blueprints.

For each post, generate:
- title: Specific and compelling. Not generic.
- description: A detailed content brief (100+ words). What to say, how to say it, what angle to take, and explicitly HOW it advances the goal.
- caption_hook: The scroll-stopping first line. Creates immediate curiosity, pain recognition, or a bold claim. Never start with "I" or the business name.
- why_it_works: Cite the evidence_refs patterns and explain the psychological mechanism for this funnel stage and goal.
- engagement_tip: A tactical instruction that directly improves the primary_kpi. Be specific — not "engage with comments" but "reply to every comment within 60 min to boost algorithmic reach by 30–50%."
- goal_alignment: One precise sentence — the specific mindset shift or action this post creates that brings the viewer closer to ${normalisedGoal}.
- posting_time: HH:MM (24h) optimised for the audience and format.
- hashtags: 6–10 values, no # prefix, mix of niche and broad.`
}

function buildGenerationPrompt(params: {
  month: string
  postsPerWeek: number
  goal: string
  audienceSize: AudienceSize
  industry: string
  businessDescription: string
  targetAudience: string
  desiredOutcomes: string
  qualityMode: QualityMode
  brief: PlannerBrief
  voiceContext: {
    tone: string
    voiceSample: string
    businessName: string
    location: string
    offers: string
    usp: string
    primaryCta: string
    proofPoints: string
  }
  slots: SlotBlueprint[]
  repairDirectives: string[]
}): string {
  const {
    month,
    postsPerWeek,
    goal,
    audienceSize,
    industry,
    businessDescription,
    targetAudience,
    desiredOutcomes,
    qualityMode,
    brief,
    voiceContext,
    slots,
    repairDirectives,
  } = params

  const repairSection = repairDirectives.length
    ? `\nREPAIR DIRECTIVES:\n${repairDirectives.map((d, i) => `${i + 1}. ${d}`).join("\n")}`
    : ""

  const goalTactics = buildGoalTactics(goal, audienceSize, desiredOutcomes)

  return `Create a ${qualityMode.toUpperCase()} quality Instagram content plan for ${month}.

BUSINESS CONTEXT:
- Industry: ${industry}
- Business: ${businessDescription || "Not provided"}
- Audience: ${targetAudience}
- Audience Size: ${audienceSize}
- Primary Goal: ${goal}
- Desired Outcomes: ${desiredOutcomes || "Not provided"}

GOAL STRATEGY — READ THIS CAREFULLY. EVERY POST MUST SERVE THIS:
${goalTactics}

ADVANCED BRIEF:
- Core Offer: ${brief.coreOffer}
- Primary CTA: ${brief.primaryCTA}
- Differentiator: ${brief.differentiator}
- Proof Points: ${brief.proofPoints.join(" | ")}
- Forbidden Topics: ${brief.forbiddenTopics.join(" | ")}
- Compliance Constraints: ${brief.complianceConstraints}
- Top Objections: ${(brief.topObjections || []).join(" | ") || "Not provided"}
- Seasonal Context: ${brief.seasonalContext || "Not provided"}
- Priority Products: ${(brief.priorityProducts || []).join(" | ") || "Not provided"}
- Competitor Angles To Avoid: ${(brief.competitorAnglesToAvoid || []).join(" | ") || "Not provided"}

VOICE LOCK:
- Tone: ${voiceContext.tone || "Friendly"}
- Business Name: ${voiceContext.businessName || "Business"}
- Location: ${voiceContext.location || "UK"}
- Offers: ${voiceContext.offers || "Not provided"}
- USP: ${voiceContext.usp || "Not provided"}
- Primary CTA: ${voiceContext.primaryCta || "Not provided"}
- Proof Points: ${voiceContext.proofPoints || "Not provided"}
- Voice Sample: ${voiceContext.voiceSample || "No voice sample provided — write in a direct, expert tone"}

SLOT BLUEPRINTS (MUST KEEP THESE FIELDS EXACT):
${JSON.stringify(slots, null, 2)}

RULES:
1. Keep date, dayOfWeek, funnel_stage, pillar, format, primary_kpi, and evidence_refs exactly as slot values.
2. caption_hook must be scroll-stopping and specific. Never start with "I" or the business name. No generic openers.
3. why_it_works must explicitly cite evidence_refs patterns and explain the psychological mechanism for this stage.
4. engagement_tip must be a specific tactical instruction tied to primary_kpi — not vague advice.
5. Use 6–10 hashtags, no leading # symbol, mix niche + broad terms.
6. Respect forbidden topics and compliance constraints in every post.
7. Use diverse angles across all slots — no repeated hooks or same opening words.
8. posting_time must be HH:MM (24h), optimised for the format and audience behaviour.
9. description must be 100+ words — a detailed content brief explaining what to say, how to say it, and HOW it advances the goal.
10. goal_alignment must state in one sentence the specific action or mindset shift this post creates toward the goal.

${repairSection}

RESPONSE FORMAT (valid JSON only):
{
  "month": "${month}",
  "monthTheme": "...",
  "monthThemeDescription": "...",
  "postsPerWeek": ${postsPerWeek},
  "frequencyRationale": "...",
  "posts": [
    {
      "id": "slot-1",
      "date": "YYYY-MM-DD",
      "dayOfWeek": "Monday",
      "title": "...",
      "description": "...",
      "format": "Talking Head Reel",
      "funnel_stage": "TOFU",
      "pillar": "...",
      "caption_hook": "...",
      "posting_time": "09:00",
      "hashtags": ["..."],
      "why_it_works": "...",
      "engagement_tip": "...",
      "goal_alignment": "...",
      "primary_kpi": "reach_rate",
      "evidence_refs": []
    }
  ]
}`
}

function formatDateOffset(daysAgo: number): string {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - daysAgo)
  return date.toISOString().slice(0, 10)
}

function toRate(value: number, denominator: number): number {
  if (!denominator || denominator <= 0) return 0
  return clamp(value / denominator, 0, 1)
}

async function fetchAccountEvidence(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<ResearchCandidate[]> {
  const since = formatDateOffset(180)

  const { data: postsRaw } = await supabase
    .from("posts")
    .select("id, format, funnel_stage, pillar, caption_hook, date, instagram_media_id")
    .eq("user_id", userId)
    .eq("status", "published")
    .gte("date", since)

  const posts = (postsRaw || []) as Array<{
    id: string
    format: string | null
    funnel_stage: string | null
    pillar: string | null
    caption_hook: string | null
    date: string
  }>

  if (!posts || posts.length === 0) return []

  const { data: insightRowsRaw } = await supabase
    .from("instagram_media_insights_daily")
    .select("post_id, impressions, reach, comments, saves, shares, profile_visits, follows")
    .eq("user_id", userId)
    .gte("metric_date", since)

  const insightRows = (insightRowsRaw || []) as Array<{
    post_id: string | null
    impressions: number | null
    reach: number | null
    comments: number | null
    saves: number | null
    shares: number | null
    profile_visits: number | null
    follows: number | null
  }>

  const insightMap = new Map<string, {
    impressions: number
    reach: number
    comments: number
    saves: number
    shares: number
    profile_visits: number
    follows: number
  }>()

  for (const row of insightRows || []) {
    const key = row.post_id || ""
    if (!key) continue
    const existing = insightMap.get(key) || {
      impressions: 0,
      reach: 0,
      comments: 0,
      saves: 0,
      shares: 0,
      profile_visits: 0,
      follows: 0,
    }
    existing.impressions += row.impressions || 0
    existing.reach += row.reach || 0
    existing.comments += row.comments || 0
    existing.saves += row.saves || 0
    existing.shares += row.shares || 0
    existing.profile_visits += row.profile_visits || 0
    existing.follows += row.follows || 0
    insightMap.set(key, existing)
  }

  return posts.map((post) => {
    const metrics = insightMap.get(post.id) || {
      impressions: 0,
      reach: 0,
      comments: 0,
      saves: 0,
      shares: 0,
      profile_visits: 0,
      follows: 0,
    }
    const reach = Math.max(metrics.reach, 1)
    const impressions = Math.max(metrics.impressions, metrics.reach, 1)

    return {
      source_type: "account",
      reference_id: post.id,
      pattern: cleanText(post.caption_hook || `${post.format || "post"} ${post.pillar || ""}`.trim(), 140),
      format: post.format,
      pillar: post.pillar,
      funnel_stage: VALID_FUNNEL_STAGES.includes(post.funnel_stage as FunnelStage)
        ? (post.funnel_stage as FunnelStage)
        : null,
      reach_rate: toRate(metrics.reach, impressions),
      share_rate: toRate(metrics.shares, reach),
      save_rate: toRate(metrics.saves, reach),
      comment_rate: toRate(metrics.comments, reach),
      profile_action_rate: toRate(metrics.profile_visits + metrics.follows, reach),
      intent_comment_rate: toRate(metrics.comments, reach),
      non_follower_ratio: 0.35,
      observed_lift: round2(toRate(metrics.shares + metrics.saves + metrics.profile_visits, reach)),
      collected_at: post.date,
    }
  })
}

async function fetchBenchmarkEvidence(
  supabase: Awaited<ReturnType<typeof createClient>>,
  industry: string
): Promise<{ benchmark: ResearchCandidate[]; trends: ResearchCandidate[] }> {
  const since30 = formatDateOffset(30)
  const today = new Date().toISOString().slice(0, 10)

  const { data: benchmarkRowsRaw } = await supabase
    .from("benchmark_content_patterns")
    .select("*")
    .ilike("industry", industry)
    .or(`expires_at.is.null,expires_at.gte.${today}`)
    .limit(200)

  const benchmarkRows = (benchmarkRowsRaw || []) as Record<string, unknown>[]

  const toCandidate = (row: Record<string, unknown>, sourceType: "benchmark" | "trend"): ResearchCandidate => ({
    source_type: sourceType,
    reference_id: String(row.id || crypto.randomUUID()),
    pattern: cleanText(row.hook_pattern || row.cta_pattern || row.posting_window || "Benchmark pattern", 180),
    format: cleanText(row.format, 50) || null,
    pillar: cleanText(row.pillar, 120) || null,
    funnel_stage: VALID_FUNNEL_STAGES.includes(row.funnel_stage as FunnelStage)
      ? (row.funnel_stage as FunnelStage)
      : null,
    reach_rate: Number(row.reach_rate || 0),
    share_rate: Number(row.share_rate || 0),
    save_rate: Number(row.save_rate || 0),
    comment_rate: Number(row.comment_rate || 0),
    profile_action_rate: Number(row.profile_action_rate || 0),
    intent_comment_rate: Number(row.intent_comment_rate || 0),
    non_follower_ratio: Number(row.non_follower_ratio || 0),
    observed_lift: Number(row.observed_lift || 0),
    collected_at: row.collected_at ? String(row.collected_at) : null,
  })

  const benchmark = benchmarkRows.map((row) => toCandidate(row, "benchmark"))
  const trends = benchmark
    .filter((row) => {
      if (!row.collected_at) return false
      return row.collected_at.slice(0, 10) >= since30
    })
    .map((row) => ({ ...row, source_type: "trend" as const }))

  return { benchmark, trends }
}

function pickEvidenceForStage(params: {
  stage: FunnelStage
  index: number
  account: ResearchCandidate[]
  benchmark: ResearchCandidate[]
  trends: ResearchCandidate[]
}): EvidenceRef[] {
  const { stage, index, account, benchmark, trends } = params
  const rankByStage = (rows: ResearchCandidate[]) =>
    rows
      .filter((row) => !row.funnel_stage || row.funnel_stage === stage)
      .sort((a, b) => stageScoreForCandidate(b, stage) - stageScoreForCandidate(a, stage))
      .filter((row, rowIndex, arr) => {
        const key = `${(row.pattern || "").toLowerCase().trim()}|${(row.pillar || "").toLowerCase().trim()}`
        if (!key || key === "|") return true
        return arr.findIndex((candidate) => {
          const candidateKey = `${(candidate.pattern || "").toLowerCase().trim()}|${(candidate.pillar || "").toLowerCase().trim()}`
          return candidateKey === key
        }) === rowIndex
      })

  const accountRanked = rankByStage(account)
  const benchmarkRanked = rankByStage(benchmark)
  const trendRanked = rankByStage(trends)

  const refs: EvidenceRef[] = []
  const pushRef = (ref: EvidenceRef) => {
    const refKey = `${ref.source_type}:${ref.reference_id}`
    const patternKey = `${ref.source_type}:${ref.pattern.toLowerCase().trim()}`
    const exists = refs.some((existing) => {
      const existingRefKey = `${existing.source_type}:${existing.reference_id}`
      const existingPatternKey = `${existing.source_type}:${existing.pattern.toLowerCase().trim()}`
      return existingRefKey === refKey || existingPatternKey === patternKey
    })
    if (!exists) refs.push(ref)
  }
  const addFromCandidate = (candidate: ResearchCandidate | undefined, forcedSourceType?: EvidenceRef["source_type"]) => {
    if (!candidate) return
    pushRef({
      source_type: forcedSourceType || candidate.source_type,
      reference_id: candidate.reference_id,
      pattern: candidate.pattern,
      observed_lift: round2(candidate.observed_lift),
    })
  }

  const benchCandidate = benchmarkRanked[index % Math.max(benchmarkRanked.length, 1)]
  addFromCandidate(benchCandidate, "benchmark")

  const accountCandidate = accountRanked[index % Math.max(accountRanked.length, 1)]
  addFromCandidate(accountCandidate, "account")

  const trendCandidate = trendRanked[index % Math.max(trendRanked.length, 1)]
  addFromCandidate(trendCandidate, "trend")

  if (benchmark.length > 0 && !refs.some((ref) => ref.source_type === "benchmark")) {
    addFromCandidate(benchmark[index % Math.max(benchmark.length, 1)], "benchmark")
  }

  if (refs.length < 2) {
    const pool: Array<{ source: EvidenceRef["source_type"]; rows: ResearchCandidate[] }> = [
      { source: "account", rows: accountRanked },
      { source: "trend", rows: trendRanked },
      { source: "benchmark", rows: benchmarkRanked },
    ]

    for (const sourcePool of pool) {
      for (let i = 0; i < sourcePool.rows.length && refs.length < 2; i += 1) {
        addFromCandidate(sourcePool.rows[(index + i) % sourcePool.rows.length], sourcePool.source)
      }
      if (refs.length >= 2) break
    }
  }

  while (refs.length < 2) {
    const fallbackIndex = refs.length + 1
    const fallbackSource: EvidenceRef["source_type"] = refs.some((ref) => ref.source_type === "benchmark") ? "trend" : "benchmark"
    pushRef({
      source_type: fallbackSource,
      reference_id: `fallback-${fallbackSource}-${stage.toLowerCase()}-${index + 1}-${fallbackIndex}`,
      pattern: fallbackSource === "benchmark"
        ? `${stage} slot uses benchmarked ${stage === "TOFU" ? "discovery hooks" : stage === "MOFU" ? "education patterns" : "conversion offers"}`
        : "Recent short-form direct-response pattern",
      observed_lift: fallbackSource === "benchmark" ? 0.3 : 0.2,
    })
  }

  if (benchmark.length > 0 && !refs.some((ref) => ref.source_type === "benchmark")) {
    refs.unshift({
      source_type: "benchmark",
      reference_id: `fallback-benchmark-${stage.toLowerCase()}-${index + 1}`,
      pattern: `${stage} benchmark anchor pattern`,
      observed_lift: 0.25,
    })
  }

  return refs.slice(0, 3)
}

function buildResearchSummary(params: {
  account: ResearchCandidate[]
  benchmark: ResearchCandidate[]
  trends: ResearchCandidate[]
}): ResearchSummary {
  const { account, benchmark, trends } = params

  const topByStage = (stage: FunnelStage): string[] => {
    return benchmark
      .filter((row) => !row.funnel_stage || row.funnel_stage === stage)
      .sort((a, b) => stageScoreForCandidate(b, stage) - stageScoreForCandidate(a, stage))
      .slice(0, 3)
      .map((row) => row.pattern)
  }

  return {
    sourceCounts: {
      account: account.length,
      benchmark: benchmark.length,
      trends: trends.length,
    },
    hasAccountSignals: account.length > 0,
    topPatternsByStage: {
      TOFU: topByStage("TOFU"),
      MOFU: topByStage("MOFU"),
      BOFU: topByStage("BOFU"),
    },
  }
}

function computeMonthSummary(posts: GeneratedPost[]): {
  funnelBreakdown: StageMix
  pillarDistribution: Record<string, number>
} {
  const total = Math.max(posts.length, 1)
  const counts = posts.reduce(
    (acc, post) => {
      acc[post.funnel_stage] += 1
      return acc
    },
    { TOFU: 0, MOFU: 0, BOFU: 0 }
  )

  const pillarDistribution: Record<string, number> = {}
  for (const post of posts) {
    pillarDistribution[post.pillar] = (pillarDistribution[post.pillar] || 0) + 1
  }

  return {
    funnelBreakdown: {
      tofu: round2((counts.TOFU / total) * 100),
      mofu: round2((counts.MOFU / total) * 100),
      bofu: round2((counts.BOFU / total) * 100),
    },
    pillarDistribution,
  }
}

function normaliseGeneratedPlan(params: {
  raw: unknown
  slots: SlotBlueprint[]
  month: string
  postsPerWeek: number
  enabledFormats: string[]
  allowedPillars: string[]
}): GeneratedPlan {
  const { raw, slots, month, postsPerWeek, enabledFormats, allowedPillars } = params
  const obj = (raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {})
  const rawPosts = Array.isArray(obj.posts) ? obj.posts : []

  const posts: GeneratedPost[] = slots.map((slot, i) => {
    const source = rawPosts[i] && typeof rawPosts[i] === "object"
      ? (rawPosts[i] as Record<string, unknown>)
      : {}

    const format = cleanText(source.format, 80)
    const pillar = cleanText(source.pillar, 120)
    const postFormat = enabledFormats.includes(format) ? format : slot.format
    const postPillar = allowedPillars.includes(pillar) ? pillar : slot.pillar

    return {
      id: `post-${i + 1}`,
      date: slot.date,
      dayOfWeek: slot.dayOfWeek,
      title: cleanText(source.title, 140) || `${slot.funnel_stage} ${postPillar}`,
      description: cleanText(source.description, 500) || "Publish a practical, value-first post aligned to this slot.",
      format: postFormat,
      funnel_stage: slot.funnel_stage,
      pillar: postPillar,
      caption_hook: cleanText(source.caption_hook, 220) || `Stop guessing: ${postPillar} that actually drives ${slot.primary_kpi}.`,
      posting_time: parsePostingTime(source.posting_time),
      hashtags: parseHashtags(source.hashtags),
      why_it_works: cleanText(source.why_it_works, 500) || `This angle matches ${slot.funnel_stage} intent and mirrors evidence-backed patterns for ${slot.primary_kpi}.`,
      engagement_tip: cleanText(source.engagement_tip, 400) || `Include a direct CTA tied to ${slot.primary_kpi} and reply to early comments in the first hour.`,
      goal_alignment: cleanText(source.goal_alignment, 300) || `This post builds ${slot.funnel_stage} intent, moving viewers closer to the stated goal.`,
      primary_kpi: slot.primary_kpi,
      evidence_refs: slot.evidence_refs,
    }
  })

  for (const post of posts) {
    if (post.hashtags.length < 6) {
      while (post.hashtags.length < 6) {
        post.hashtags.push(`growth${post.hashtags.length + 1}`)
      }
    }
    if (post.hashtags.length > 10) {
      post.hashtags = post.hashtags.slice(0, 10)
    }
  }

  const summary = computeMonthSummary(posts)

  return {
    month,
    monthTheme: cleanText(obj.monthTheme, 120) || "Audience-first growth system",
    monthThemeDescription:
      cleanText(obj.monthThemeDescription, 500) ||
      "This month blends awareness, nurture, and conversion content so each week compounds reach while creating stronger buyer intent.",
    postsPerWeek,
    frequencyRationale:
      cleanText(obj.frequencyRationale, 400) ||
      "This cadence balances consistency with quality, giving enough repetitions to train audience expectations and improve conversion intent.",
    funnelBreakdown: summary.funnelBreakdown,
    pillarDistribution: summary.pillarDistribution,
    posts,
  }
}

function buildBriefFromBody(body: Record<string, unknown>): PlannerBrief | null {
  const briefRaw = (body.brief && typeof body.brief === "object") ? (body.brief as Record<string, unknown>) : null
  if (!briefRaw) return null

  const brief: PlannerBrief = {
    coreOffer: cleanText(briefRaw.coreOffer, 200),
    primaryCTA: cleanText(briefRaw.primaryCTA, 200),
    differentiator: cleanText(briefRaw.differentiator, 300),
    proofPoints: cleanList(briefRaw.proofPoints, 6, 200),
    forbiddenTopics: cleanList(briefRaw.forbiddenTopics, 12, 100),
    complianceConstraints: cleanText(briefRaw.complianceConstraints, 400),
    topObjections: cleanList(briefRaw.topObjections, 8, 200),
    seasonalContext: cleanText(briefRaw.seasonalContext, 300),
    priorityProducts: cleanList(briefRaw.priorityProducts, 8, 120),
    competitorAnglesToAvoid: cleanList(briefRaw.competitorAnglesToAvoid, 8, 150),
  }

  if (
    !brief.coreOffer ||
    !brief.primaryCTA ||
    !brief.differentiator ||
    !brief.complianceConstraints ||
    brief.proofPoints.length === 0 ||
    brief.forbiddenTopics.length === 0
  ) {
    return null
  }

  return brief
}

async function generateCandidate(params: {
  month: string
  postsPerWeek: number
  goal: string
  audienceSize: AudienceSize
  industry: string
  businessDescription: string
  targetAudience: string
  desiredOutcomes: string
  qualityMode: QualityMode
  brief: PlannerBrief
  voiceContext: {
    tone: string
    voiceSample: string
    businessName: string
    location: string
    offers: string
    usp: string
    primaryCta: string
    proofPoints: string
  }
  slots: SlotBlueprint[]
  repairDirectives: string[]
  enabledFormats: string[]
  allowedPillars: string[]
}): Promise<GeneratedPlan | null> {
  const message = await getAnthropic().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    system: buildSystemPrompt(params.goal, params.desiredOutcomes),
    messages: [
      {
        role: "user",
        content: buildGenerationPrompt(params),
      },
    ],
  })

  const responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
  const parsed = safeJsonParse(responseText)
  if (!parsed) return null

  return normaliseGeneratedPlan({
    raw: parsed,
    slots: params.slots,
    month: params.month,
    postsPerWeek: params.postsPerWeek,
    enabledFormats: params.enabledFormats,
    allowedPillars: params.allowedPillars,
  })
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now()
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
      fallback: "content-plan",
    })
    const rate = checkRateLimit(`generate-content-plan:${actorId}`, {
      max: 6,
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

    const postsPerWeek = Number(body.postsPerWeek)
    const month = cleanText(body.month, 7)
    const industry = cleanText(body.industry, 100)
    const businessDescription = cleanText(body.businessDescription, 500)
    const targetAudience = cleanText(body.targetAudience, 500)
    const goals = cleanText(body.goals, 100)
    const desiredOutcomes = cleanText(body.desiredOutcomes, 500)
    const audienceSize = parseAudienceSize(body.audienceSize)

    const contentPillars = cleanList(body.contentPillars, 8, 100)
    const enabledFormats = cleanList(body.enabledFormats, 8, 100).filter((f) =>
      VALID_FORMATS.includes(f as (typeof VALID_FORMATS)[number])
    )

    if (![3, 5, 7].includes(postsPerWeek)) {
      return NextResponse.json({ error: "postsPerWeek must be 3, 5, or 7" }, { status: 400 })
    }
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "month must be YYYY-MM" }, { status: 400 })
    }
    if (!industry || !targetAudience || !goals) {
      return NextResponse.json({ error: "industry, targetAudience, and goals are required" }, { status: 400 })
    }

    const brief = buildBriefFromBody(body)
    if (!brief) {
      return NextResponse.json(
        {
          error:
            "brief is required with coreOffer, primaryCTA, differentiator, proofPoints[], forbiddenTopics[], complianceConstraints",
        },
        { status: 400 }
      )
    }

    const qualityModeRequested = parseQualityMode(body.qualityMode)
    const qualityMode: QualityMode = PLANNER_V2_FLAG ? qualityModeRequested : "fast"
    const tokenCost = QUALITY_COSTS[qualityMode]

    const timezone = cleanText(body.timezone, 80) || "UTC"
    const idempotencyKey = cleanText(body.idempotencyKey, 120) || null

    if (idempotencyKey) {
      const { error: idempotencyError } = await admin
        .from("planner_generation_logs")
        .insert({
          user_id: user.id,
          month,
          idempotency_key: idempotencyKey,
          quality_mode: qualityMode,
          attempt_count: 0,
          failure_reason: "in_progress",
        } as never)

      if (idempotencyError && String(idempotencyError.message || "").toLowerCase().includes("duplicate")) {
        return NextResponse.json(
          { error: "A generation with this idempotencyKey has already been submitted." },
          { status: 409 }
        )
      }
    }

    const daysInMonth = getDaysInMonth(month)
    const [yearNum, monthNum] = month.split("-").map(Number)
    const firstDayOfWeek = (new Date(yearNum, monthNum - 1, 1).getDay() + 6) % 7
    const calendarWeeks = Math.ceil((daysInMonth + firstDayOfWeek) / 7)
    const exactPosts = postsPerWeek * calendarWeeks

    const funnelMix = normaliseMix(goals, audienceSize)
    const stageCounts = allocateStageCounts(exactPosts, funnelMix)
    const stageSequence = buildStageSequence(exactPosts, stageCounts)
    const dateSlots = buildDateSlots(month, exactPosts)

    const safePillars = contentPillars.length > 0 ? contentPillars : ["Tips & education", "Client results", "Behind the scenes"]
    const safeFormats = enabledFormats.length > 0 ? enabledFormats : [...VALID_FORMATS]

    const profile = await fetchProfileContext(supabase, user.id)

    const accountEvidence = await fetchAccountEvidence(supabase, user.id)
    const { benchmark: benchmarkEvidence, trends: trendEvidence } = await fetchBenchmarkEvidence(supabase, industry)

    const slots: SlotBlueprint[] = stageSequence.map((stage, i) => ({
      id: `slot-${i + 1}`,
      date: dateSlots[i].date,
      dayOfWeek: dateSlots[i].dayOfWeek,
      funnel_stage: stage,
      pillar: safePillars[i % safePillars.length],
      format: pickFormatForStage(stage, safeFormats, i),
      primary_kpi: KPI_BY_STAGE[stage],
      evidence_refs: pickEvidenceForStage({
        stage,
        index: i,
        account: accountEvidence,
        benchmark: benchmarkEvidence,
        trends: trendEvidence,
      }),
    }))

    const researchSummary = buildResearchSummary({
      account: accountEvidence,
      benchmark: benchmarkEvidence,
      trends: trendEvidence,
    })

    const maxAttempts = qualityMode === "pro" ? MAX_PRO_ATTEMPTS : MAX_FAST_ATTEMPTS
    const recentHooks = new Set(
      accountEvidence
        .map((item) => item.pattern.toLowerCase().trim())
        .filter(Boolean)
    )

    let bestPlan: GeneratedPlan | null = null
    let bestQuality: QualityResult | null = null
    const attempts: Array<{ attempt: number; overall: number; pass: boolean; gaps: string[] }> = []

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const repairDirectives = bestQuality?.gaps || []

      const plan = await generateCandidate({
        month,
        postsPerWeek,
        goal: goals,
        audienceSize,
        industry,
        businessDescription,
        targetAudience,
        desiredOutcomes,
        qualityMode,
        brief,
        voiceContext: {
          tone: cleanText(profile?.tone, 120),
          voiceSample: cleanText(profile?.voice_sample, 2500),
          businessName: cleanText(profile?.business_name, 120),
          location: cleanText(profile?.location, 120),
          offers: cleanText(profile?.offers, 500),
          usp: cleanText(profile?.usp, 300),
          primaryCta: cleanText(profile?.primary_cta, 150),
          proofPoints: cleanText(profile?.proof_points, 400),
        },
        slots,
        repairDirectives,
        enabledFormats: safeFormats,
        allowedPillars: safePillars,
      })

      if (!plan) {
        attempts.push({ attempt, overall: 0, pass: false, gaps: ["model returned invalid JSON"] })
        continue
      }

      const quality = evaluateQuality({
        plan,
        slots,
        forbiddenTopics: brief.forbiddenTopics,
        recentHooks,
        qualityMode,
      })

      attempts.push({ attempt, overall: quality.overall, pass: quality.pass, gaps: quality.gaps })

      if (!bestQuality || quality.overall > bestQuality.overall) {
        bestQuality = quality
        bestPlan = plan
      }

      if (quality.pass) break
    }

    if (!bestPlan || !bestQuality) {
      return NextResponse.json({ error: "Failed to generate a valid content plan" }, { status: 500 })
    }

    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: tokenCost,
      p_type: "feature_use",
      p_description: `Generated ${qualityMode.toUpperCase()} content plan for ${month}`,
    } as never)

    if (debitError) {
      const message = String(debitError.message || debitError)
      if (message.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Insufficient tokens", balance_needed: tokenCost },
          { status: 402 }
        )
      }
      throw debitError
    }

    const qualityReport = {
      mode: qualityMode,
      threshold: {
        overall: qualityMode === "pro" ? 88 : 75,
        each_dimension: qualityMode === "pro" ? 80 : null,
      },
      attempts,
      selectedAttempt: attempts.sort((a, b) => b.overall - a.overall)[0]?.attempt || 1,
      overallScore: bestQuality.overall,
      dimensionScores: bestQuality.dimensions,
      autoRetried: attempts.length > 1,
      usedAccountSignals: accountEvidence.length > 0,
      qualityWarning: !bestQuality.pass,
      qualityGaps: bestQuality.gaps,
    }

    const postsToPersist = bestPlan.posts.map((post) => ({
      date: post.date,
      day_of_week: post.dayOfWeek,
      format: post.format,
      funnel_stage: post.funnel_stage,
      pillar: post.pillar,
      topic: post.title,
      caption_hook: post.caption_hook,
      caption_body: post.description,
      hashtags: post.hashtags,
      posting_time: post.posting_time,
      status: "draft",
      meta: {
        description: post.description,
        why_it_works: post.why_it_works,
        engagement_tip: post.engagement_tip,
        goal_alignment: post.goal_alignment,
      },
      quality_score: bestQuality.overall,
      evidence_refs: post.evidence_refs,
      primary_kpi: post.primary_kpi,
    }))

    const planPayload = {
      month,
      industry,
      target_audience: targetAudience,
      goals,
      quality_mode: qualityMode,
      quality_report: qualityReport,
      research_summary: researchSummary,
      brief_snapshot: {
        ...brief,
        audienceSize,
        timezone,
        idempotencyKey,
      },
      generation_version: "planner_v2",
    }

    const { planId, error: persistError } = await persistPlanWithPosts({
      admin,
      userId: user.id,
      planPayload,
      postsToPersist,
    })

    if (persistError || !planId) {
      await admin.rpc("credit_tokens", {
        p_user_id: user.id,
        p_amount: tokenCost,
        p_type: "refund",
        p_description: `Auto-refund for failed content plan persistence (${month})`,
      } as never)

      console.error("Failed to persist generated content plan", persistError)
      return NextResponse.json(
        { error: "Failed to save generated plan. Tokens were refunded." },
        { status: 500 }
      )
    }

    const logPayload = {
      user_id: user.id,
      month,
      idempotency_key: idempotencyKey,
      quality_mode: qualityMode,
      attempt_count: attempts.length,
      overall_score: bestQuality.overall,
      dimension_scores: bestQuality.dimensions,
      latency_ms: Date.now() - startedAt,
      used_account_signals: accountEvidence.length > 0,
      failure_reason: bestQuality.pass ? null : bestQuality.gaps.join("; "),
    }

    if (idempotencyKey) {
      await admin
        .from("planner_generation_logs")
        .update(logPayload as never)
        .eq("user_id", user.id)
        .eq("idempotency_key", idempotencyKey)
    } else {
      await admin.from("planner_generation_logs").insert(logPayload as never)
    }

    return NextResponse.json({
      plan: bestPlan,
      planId,
      balance: newBalance,
      deducted: tokenCost,
      feature: FEATURE_KEY,
      qualityReport,
      researchSummary,
    })
  } catch (error) {
    console.error("Content plan generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate content plan" },
      { status: 500 }
    )
  }
}

function buildRegeneratePrompt(params: {
  post: {
    date: string
    dayOfWeek: string
    funnel_stage: string
    pillar: string
    format: string
    primary_kpi?: string
    evidence_refs?: EvidenceRef[]
  }
  monthTheme: string
  qualityMode: QualityMode
  profile: {
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
  }
}): string {
  const { post, monthTheme, qualityMode, profile } = params

  const stage = (post.funnel_stage as FunnelStage) || "TOFU"
  const primaryKpi = post.primary_kpi || KPI_BY_STAGE[stage]
  const goalTactics = buildGoalTactics("Lead Generation", "1K-10K", "")

  return `Generate one replacement Instagram post.

GOAL STRATEGY:
${goalTactics}

LOCKED FIELDS (must stay exactly the same):
- date: ${post.date}
- dayOfWeek: ${post.dayOfWeek}
- funnel_stage: ${post.funnel_stage}
- pillar: ${post.pillar}
- format: ${post.format}
- primary_kpi: ${primaryKpi}
- evidence_refs: ${JSON.stringify(post.evidence_refs || [], null, 2)}

BUSINESS CONTEXT:
- Business: ${profile.business_name || "Business"}
- Industry: ${profile.industry || "General"}
- Audience: ${profile.target_audience || "General"}
- Tone: ${profile.tone || "Friendly"}
- Location: ${profile.location || "UK"}
- Offers: ${profile.offers || "Not provided"}
- USP: ${profile.usp || "Not provided"}
- Primary CTA: ${profile.primary_cta || "Not provided"}
- Proof Points: ${profile.proof_points || "Not provided"}
- Voice Sample: ${profile.voice_sample || "Not provided"}
- Month Theme: ${monthTheme}
- Quality Mode: ${qualityMode}

RULES:
1. Take a completely new angle — different hook, angle, and content direction from any previous version.
2. caption_hook must be scroll-stopping. Never start with "I" or the business name. No generic openers.
3. description must be 100+ words — a detailed content brief explaining what to say and how it serves the goal.
4. why_it_works must explicitly cite evidence_refs patterns and the psychological mechanism for ${post.funnel_stage}.
5. engagement_tip must be a specific tactical action tied directly to ${primaryKpi}.
6. goal_alignment: one sentence on the specific mindset shift or action this post creates toward the goal.
7. posting_time must be HH:MM.
8. hashtags: 6–10 values without # prefix.

Respond with valid JSON only:
{
  "id": "${post.date}",
  "date": "${post.date}",
  "dayOfWeek": "${post.dayOfWeek}",
  "title": "...",
  "description": "...",
  "format": "${post.format}",
  "funnel_stage": "${post.funnel_stage}",
  "pillar": "${post.pillar}",
  "caption_hook": "...",
  "posting_time": "09:00",
  "hashtags": ["..."],
  "why_it_works": "...",
  "engagement_tip": "...",
  "goal_alignment": "...",
  "primary_kpi": "${primaryKpi}",
  "evidence_refs": ${JSON.stringify(post.evidence_refs || [])}
}`
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { postToRegenerate, monthTheme, qualityMode: qualityModeRaw } = await request.json()

    if (!postToRegenerate || !postToRegenerate.date) {
      return NextResponse.json(
        { error: "postToRegenerate with date is required" },
        { status: 400 }
      )
    }

    if (
      postToRegenerate.funnel_stage &&
      !VALID_FUNNEL_STAGES.includes(postToRegenerate.funnel_stage)
    ) {
      return NextResponse.json(
        { error: "Invalid funnel_stage" },
        { status: 400 }
      )
    }

    if (postToRegenerate.format && !VALID_FORMATS.includes(postToRegenerate.format)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 })
    }

    if (postToRegenerate.dayOfWeek && !VALID_DAYS.includes(postToRegenerate.dayOfWeek)) {
      return NextResponse.json(
        { error: "Invalid dayOfWeek" },
        { status: 400 }
      )
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(postToRegenerate.date)) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      )
    }

    const qualityMode = parseQualityMode(qualityModeRaw)

    const profile = await fetchProfileContext(supabase, user.id)

    const attempts = qualityMode === "pro" ? 2 : 1
    let bestPost: GeneratedPost | null = null
    let bestScore = 0

    for (let i = 0; i < attempts; i += 1) {
      const message = await getAnthropic().messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: buildSystemPrompt("Lead Generation", ""),
        messages: [
          {
            role: "user",
            content: buildRegeneratePrompt({
              post: {
                ...postToRegenerate,
                primary_kpi: cleanText(postToRegenerate.primary_kpi, 80),
                evidence_refs: Array.isArray(postToRegenerate.evidence_refs)
                  ? postToRegenerate.evidence_refs
                  : [],
              },
              monthTheme: cleanText(monthTheme, 200),
              qualityMode,
              profile: profile || {},
            }),
          },
        ],
      })

      const responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
      const parsed = safeJsonParse(responseText)
      if (!parsed || typeof parsed !== "object") continue

      const obj = parsed as Record<string, unknown>
      const post: GeneratedPost = {
        id: cleanText(obj.id, 50) || postToRegenerate.id,
        date: postToRegenerate.date,
        dayOfWeek: postToRegenerate.dayOfWeek,
        title: cleanText(obj.title, 140) || "Optimized post",
        description: cleanText(obj.description, 800) || "",
        format: postToRegenerate.format,
        funnel_stage: postToRegenerate.funnel_stage,
        pillar: postToRegenerate.pillar,
        caption_hook: cleanText(obj.caption_hook, 220),
        posting_time: parsePostingTime(obj.posting_time),
        hashtags: parseHashtags(obj.hashtags),
        why_it_works: cleanText(obj.why_it_works, 500),
        engagement_tip: cleanText(obj.engagement_tip, 400),
        goal_alignment: cleanText(obj.goal_alignment, 300) || `This post advances the goal by building ${postToRegenerate.funnel_stage} intent.`,
        primary_kpi: cleanText(obj.primary_kpi, 80) || postToRegenerate.primary_kpi || KPI_BY_STAGE[postToRegenerate.funnel_stage as FunnelStage],
        evidence_refs: Array.isArray(obj.evidence_refs)
          ? (obj.evidence_refs as EvidenceRef[])
          : (Array.isArray(postToRegenerate.evidence_refs) ? postToRegenerate.evidence_refs : []),
      }

      const score = round2((scoreHookStrength(post.caption_hook) + clamp(post.engagement_tip.length / 3, 0, 100)) / 2)
      if (score > bestScore) {
        bestScore = score
        bestPost = post
      }
    }

    if (!bestPost) {
      return NextResponse.json(
        { error: "Failed to regenerate post" },
        { status: 500 }
      )
    }

    return NextResponse.json({ post: bestPost, qualityScore: bestScore })
  } catch (error) {
    console.error("Post regeneration error:", error)
    return NextResponse.json(
      { error: "Failed to regenerate post" },
      { status: 500 }
    )
  }
}
