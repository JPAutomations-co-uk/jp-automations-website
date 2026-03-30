import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import { getUserFeedbackContext } from "@/app/lib/x-master-prompt"

export const maxDuration = 120

// ─── Constants ────────────────────────────────────────────────────────────────

const QUALITY_COSTS = { fast: 25, pro: 60 } as const
const MAX_ATTEMPTS = { fast: 1, pro: 3 } as const

const VALID_FUNNEL_STAGES = ["TOFU", "MOFU", "BOFU"] as const
const VALID_FORMATS = ["Single Tweet", "Thread", "Poll", "Article"] as const
const VALID_QUALITY_MODES = ["fast", "pro"] as const
const VALID_GOALS = [
  "Brand Awareness",
  "Lead Generation",
  "Community Building",
  "Sales & Conversions",
  "Education & Authority",
] as const

const THREAD_TYPES_BY_STAGE: Record<FunnelStage, string[]> = {
  TOFU: ["Hot Take", "Story", "Educational"],
  MOFU: ["Educational", "How-To", "Case Study"],
  BOFU: ["Social Proof", "Case Study", "Story"],
}

const ARTICLE_TYPES_BY_STAGE: Record<FunnelStage, string[]> = {
  TOFU: [],
  MOFU: ["Deep Dive", "Tutorial", "Framework"],
  BOFU: ["Case Study", "Opinion"],
}

const POST_TYPES_BY_FORMAT_AND_STAGE: Record<string, Record<FunnelStage, string>> = {
  "Single Tweet": {
    TOFU: "Hot Take",
    MOFU: "Insight",
    BOFU: "CTA Tweet",
  },
  Thread: {
    TOFU: "Story Thread",
    MOFU: "Educational Thread",
    BOFU: "Social Proof Thread",
  },
  Poll: {
    TOFU: "Debate Poll",
    MOFU: "Opinion Poll",
    BOFU: "Pain Point Poll",
  },
  Article: {
    TOFU: "Authority Article",
    MOFU: "Authority Article",
    BOFU: "Case Study Article",
  },
}

const KPI_BY_STAGE: Record<FunnelStage, string> = {
  TOFU: "impressions_rate",
  MOFU: "bookmark_rate",
  BOFU: "profile_visit_rate",
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const

// ─── Types ────────────────────────────────────────────────────────────────────

type QualityMode = "fast" | "pro"
type FunnelStage = (typeof VALID_FUNNEL_STAGES)[number]
type Goal = (typeof VALID_GOALS)[number]

type StageMix = { tofu: number; mofu: number; bofu: number }

interface GeneratedPost {
  id: string
  date: string
  dayOfWeek: string
  format: "Single Tweet" | "Thread" | "Poll" | "Article"
  post_type: string
  thread_type?: string
  thread_tweet_count?: number
  article_type?: string
  article_length?: string
  funnel_stage: FunnelStage
  pillar: string
  hook: string
  content_brief: string
  posting_time: string
  why_it_works: string
  engagement_tip: string
  goal_alignment: string
  primary_kpi: string
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

interface QualityResult {
  overall: number
  pass: boolean
  gaps: string[]
}

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function cleanList(values: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(values)) return []
  return values.map((v) => cleanText(v, maxLen)).filter(Boolean).slice(0, maxItems)
}

function round2(v: number) { return Math.round(v * 100) / 100 }
function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)) }

function parseQualityMode(v: unknown): QualityMode {
  return VALID_QUALITY_MODES.includes(v as QualityMode) ? (v as QualityMode) : "pro"
}

function normaliseGoal(goal: string): Goal {
  const g = goal.toLowerCase()
  if (g.includes("awareness")) return "Brand Awareness"
  if (g.includes("community")) return "Community Building"
  if (g.includes("sales") || g.includes("conversion")) return "Sales & Conversions"
  if (g.includes("authority") || g.includes("education")) return "Education & Authority"
  return "Lead Generation"
}

// ─── Funnel mix logic (identical to Instagram planner) ───────────────────────

function getGoalBaseMix(goal: string): StageMix {
  switch (normaliseGoal(goal)) {
    case "Brand Awareness":      return { tofu: 70, mofu: 20, bofu: 10 }
    case "Community Building":   return { tofu: 55, mofu: 35, bofu: 10 }
    case "Sales & Conversions":  return { tofu: 30, mofu: 30, bofu: 40 }
    case "Education & Authority": return { tofu: 35, mofu: 50, bofu: 15 }
    default:                     return { tofu: 40, mofu: 35, bofu: 25 }
  }
}

function normaliseMix(goal: string): StageMix {
  const base = getGoalBaseMix(goal)
  const sum = base.tofu + base.mofu + base.bofu
  return {
    tofu: round2((base.tofu / sum) * 100),
    mofu: round2((base.mofu / sum) * 100),
    bofu: round2((base.bofu / sum) * 100),
  }
}

function allocateStageCounts(total: number, mix: StageMix): Record<FunnelStage, number> {
  const raw = { TOFU: (total * mix.tofu) / 100, MOFU: (total * mix.mofu) / 100, BOFU: (total * mix.bofu) / 100 }
  const counts = { TOFU: Math.floor(raw.TOFU), MOFU: Math.floor(raw.MOFU), BOFU: Math.floor(raw.BOFU) }
  let remaining = total - (counts.TOFU + counts.MOFU + counts.BOFU)
  const order = (Object.keys(raw) as FunnelStage[]).sort((a, b) => (raw[b] - Math.floor(raw[b])) - (raw[a] - Math.floor(raw[a])))
  let idx = 0
  while (remaining > 0) { counts[order[idx % order.length]] += 1; idx++; remaining-- }
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
      if (alt) { sequence.push(alt); buckets[alt]--; continue }
    }
    sequence.push(stage); buckets[stage]--
  }
  while (sequence.length < total) sequence.push("TOFU")
  return sequence
}

function getDaysInMonth(month: string) {
  const [y, m] = month.split("-").map(Number)
  return new Date(y, m, 0).getDate()
}

function buildDateSlots(month: string, total: number): { date: string; dayOfWeek: string }[] {
  const [y, m] = month.split("-").map(Number)
  const daysInMonth = getDaysInMonth(month)
  return Array.from({ length: total }, (_, i) => {
    const day = Math.floor((i * daysInMonth) / total) + 1
    const date = new Date(Date.UTC(y, m - 1, day))
    return {
      date: `${month}-${String(day).padStart(2, "0")}`,
      dayOfWeek: DAY_NAMES[date.getUTCDay()],
    }
  })
}

function buildWeekDateSlots(startDateStr: string, weeksCount: number, total: number): { date: string; dayOfWeek: string }[] {
  const [sy, sm, sd] = startDateStr.split("-").map(Number)
  const totalDays = weeksCount * 7
  return Array.from({ length: total }, (_, i) => {
    const dayOffset = Math.floor((i * totalDays) / total)
    const d = new Date(Date.UTC(sy, sm - 1, sd + dayOffset))
    const yyyy = d.getUTCFullYear()
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0")
    const dd = String(d.getUTCDate()).padStart(2, "0")
    return { date: `${yyyy}-${mm}-${dd}`, dayOfWeek: DAY_NAMES[d.getUTCDay()] }
  })
}

function pickFormatForStage(stage: FunnelStage, index: number): "Single Tweet" | "Thread" | "Poll" | "Article" {
  // Place an Article every ~6th slot, only in MOFU/BOFU (never TOFU)
  if (stage !== "TOFU" && index % 6 === 4) return "Article"

  const prefs: Record<FunnelStage, Array<"Single Tweet" | "Thread" | "Poll">> = {
    TOFU: ["Single Tweet", "Poll", "Thread"],
    MOFU: ["Thread", "Single Tweet", "Thread"],
    BOFU: ["Thread", "Single Tweet", "Thread"],
  }
  return prefs[stage][index % prefs[stage].length]
}

function parsePostingTime(v: unknown): string {
  const raw = String(v ?? "").trim()
  return /^\d{2}:\d{2}$/.test(raw) ? raw : "09:00"
}

function scoreHookStrength(hook: string): number {
  const text = hook.trim()
  if (!text) return 20
  let score = 55
  if (text.length >= 20 && text.length <= 280) score += 15
  if (/\d/.test(text)) score += 8
  if (/[?!]/.test(text)) score += 7
  if (/\b(why|how|stop|avoid|mistake|secret|truth|nobody|exact|unpopular|hot take|wrong|no one|fail)\b/i.test(text)) score += 12
  if (/^(I |Hey |Hello |So I |Just |Today )/i.test(text)) score -= 15
  return clamp(score, 0, 100)
}

function evaluateQuality(plan: GeneratedPlan, qualityMode: QualityMode): QualityResult {
  const total = Math.max(plan.posts.length, 1)
  const hookScores = plan.posts.map((p) => scoreHookStrength(p.hook))
  const hookStrength = hookScores.reduce((s, n) => s + n, 0) / hookScores.length

  const substantiveBriefs = plan.posts.filter((p) => p.content_brief.length > 80).length
  const substantiveTips = plan.posts.filter((p) => p.engagement_tip.length > 30).length
  const contentQuality = clamp(((substantiveBriefs + substantiveTips) / (total * 2)) * 100, 0, 100)

  const seen = new Set<string>()
  let noveltyPenalty = 0
  for (const p of plan.posts) {
    const k = p.hook.toLowerCase().trim().slice(0, 40)
    if (seen.has(k)) noveltyPenalty += 10
    seen.add(k)
  }
  const novelty = clamp(100 - noveltyPenalty, 0, 100)

  const strategyOk = [
    plan.monthTheme.length > 5,
    plan.monthThemeDescription.length > 30,
    plan.frequencyRationale.length > 20,
  ].filter(Boolean).length
  const strategy = clamp((strategyOk / 3) * 100, 0, 100)

  const overall = round2((hookStrength + contentQuality + novelty + strategy) / 4)
  const threshold = qualityMode === "pro" ? 80 : 65
  const pass = overall >= threshold

  const gaps: string[] = []
  if (!pass) gaps.push(`overall score ${overall} below ${threshold}`)
  if (hookStrength < 60) gaps.push("hooks too weak — use stronger pattern interrupts")
  if (contentQuality < 60) gaps.push("content briefs need more substance")
  if (novelty < 60) gaps.push("too many similar hooks — vary angles more")

  return { overall, pass, gaps }
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

// ─── Prompt builders ──────────────────────────────────────────────────────────

// Lightweight plan system prompt (Haiku-optimised — no massive writing formulas)
const GOAL_CTA_MAP: Record<string, string> = {
  "Brand Awareness": "Follow for more / Repost if this helped. NEVER sales CTAs.",
  "Lead Generation": "DM me [keyword] / Comment [word] & I'll send you [thing]",
  "Community Building": "What would you add? / Which surprised you most?",
  "Sales & Conversions": "DM me [keyword] to get started / Link in bio to apply",
  "Education & Authority": "Bookmark this / Follow for daily [niche] insights",
}

function buildPlanSystemPrompt(goal: string, feedbackConstraints: string = ""): string {
  return `You are an elite X (Twitter) content strategist. Create a content plan where EVERY post advances "${goal}".
Before writing each hook, ask: "Would I bookmark this if someone else wrote it?" If not, make it stronger.

HOOK FORMULAS (pick one per post):
1. EARNED SECRET: "I went from [X] to [Y] in [timeframe]. Here's exactly how:"
2. INVERSION: "You don't need [popular belief]. You need [counterintuitive alternative]."
3. HARD TRUTH: "Hard truth about [topic]: [uncomfortable reality nobody says aloud]"
4. CURIOSITY GAP: "Why do [surprising observation]? The answer isn't what you think."
5. WISH I KNEW: "[N] things I wish I knew about [topic] [X years] ago:"
6. BOLD DECLARATION: "[Common advice] is wrong. Here's what actually works:"
7. IDENTITY TARGET: "If you [specific condition], read this."
8. PATTERN INTERRUPT: "[Bold declarative statement] Here's why:"

AUTHORITY: Write as a practitioner sharing hard-won insights — specific numbers, earned angles, field notes voice. Never start with "I" or business name. Be specific: "3x" beats "much more".

CONTENT QUALITY:
- Genuinely valuable — not recycled advice. Fresh insights.
- Immediately actionable — systems, not observations.
- Easy to read — short sentences, simple language.
- Each content_brief must be 100+ words with concrete angle and approach.

Goal: ${goal}
CTA style: ${GOAL_CTA_MAP[goal] || GOAL_CTA_MAP["Lead Generation"]}

X PLATFORM RULES:
- Single Tweet hooks under 280 chars
- Threads: numbered tweets, hook tweet first, 5-12 tweets
- Never start hook with "I", business name, or generic openers
- Polls: 2-4 options that generate debate
${feedbackConstraints}
Output valid JSON only. No markdown fences. No commentary.`
}

function buildGoalTactics(goal: string): string {
  const tacticsMap: Record<Goal, string> = {
    "Brand Awareness": `TOFU: Viral single tweets — hot takes, strong opinions, relatable content. Maximum shareability. Hook = pattern interrupt.
MOFU: Educational threads that earn saves and follows. Shareable frameworks.
BOFU: Social proof tweets. Soft CTAs. Make people follow without feeling sold to.
Every post must state HOW it reaches people outside the current follower base.`,

    "Lead Generation": `TOFU: Reveal a problem they didn't know they had. Hook on pain or curiosity. Soft CTA: "DM me [word]"
MOFU: Position as the expert. Show proof and outcomes. CTA: reply, DM, or link in bio.
BOFU: Handle objections directly. Hard CTA: "DM me now" / "Link in bio to apply today."
Every post must state the specific action it creates in a buyer's mind.`,

    "Community Building": `TOFU: Opinion-led, conversational. Take a strong side. Spark debate. End with a question.
MOFU: Behind-the-scenes, personal stories, failures and wins. Community follows humans.
BOFU: Invite direct participation — polls, reply chains, spotlights.
Every post must state how it generates real replies and deepens belonging.`,

    "Sales & Conversions": `TOFU: Lead with the transformation result — make them want the outcome first.
MOFU: Product specifics framed as benefits. Price anchoring. Stack social proof.
BOFU: Direct CTA with urgency. Testimonials. DM invite. Create FOMO.
Every post must state how it removes friction for a warm follower ready to buy.`,

    "Education & Authority": `TOFU: Debunk myths. "Everyone in [industry] is wrong about X." Challenge mainstream advice.
MOFU: Deep tactical value — frameworks, step-by-steps. Save-worthy and shareable.
BOFU: Client results, case studies, credentials. Soft CTA to work together or follow.
Every post must state how it makes the viewer more likely to trust and hire the creator.`,
  }
  return tacticsMap[normaliseGoal(goal)] || tacticsMap["Lead Generation"]
}

interface SlotBlueprint {
  id: string
  date: string
  dayOfWeek: string
  funnel_stage: FunnelStage
  pillar: string
  format: "Single Tweet" | "Thread" | "Poll" | "Article"
  post_type: string
  thread_type?: string
  article_type?: string
  article_length?: string
  primary_kpi: string
}

function buildGenerationPrompt(params: {
  month: string
  postsPerWeek: number
  goal: string
  industry: string
  businessDescription: string
  targetAudience: string
  qualityMode: QualityMode
  voiceContext: { tone: string; voiceSample: string; businessName: string; location: string; offers: string; usp: string; primaryCta: string; proofPoints: string; xHandle: string }
  slots: SlotBlueprint[]
  repairDirectives: string[]
  topics: string[]
}): string {
  const { month, postsPerWeek, goal, industry, businessDescription, targetAudience, qualityMode, voiceContext, slots, repairDirectives } = params
  const goalTactics = buildGoalTactics(goal)
  const repairSection = repairDirectives.length
    ? `\nREPAIR DIRECTIVES (fix these in this attempt):\n${repairDirectives.map((d, i) => `${i + 1}. ${d}`).join("\n")}`
    : ""

  return `Create a ${qualityMode.toUpperCase()} quality X (Twitter) content plan for ${month}.

BUSINESS CONTEXT:
- Industry: ${industry}
- Business: ${businessDescription || "Not provided"}
- Audience: ${targetAudience}
- Primary Goal: ${goal}

GOAL STRATEGY — EVERY POST MUST SERVE THIS:
${goalTactics}

VOICE LOCK:
- Tone: ${voiceContext.tone || "Direct"}
- Business Name: ${voiceContext.businessName || "Business"}
- Location: ${voiceContext.location || "UK"}
- X Handle: ${voiceContext.xHandle || "Not provided"}
- Offers: ${voiceContext.offers || "Not provided"}
- USP: ${voiceContext.usp || "Not provided"}
- Primary CTA: ${voiceContext.primaryCta || "Not provided"}
- Proof Points: ${voiceContext.proofPoints || "Not provided"}
- Voice Sample: ${voiceContext.voiceSample || "Not provided — write in a direct, expert tone"}

SLOT BLUEPRINTS (keep date, dayOfWeek, funnel_stage, pillar, format, post_type, primary_kpi EXACTLY as given):
${JSON.stringify(slots, null, 2)}

RULES:
1. Keep date, dayOfWeek, funnel_stage, pillar, format, post_type, primary_kpi exactly as slot values.
2. hook: The scroll-stopping first line. Under 280 characters for Single Tweet. Never start with "I" or the business name.
3. content_brief: 100+ words. What to say, the angle, what NOT to say, and exactly HOW this post advances the goal.
4. For Thread format: set thread_tweet_count (5–12) and thread_type from slot.
5. For Article format: set article_type and article_length from slot. The hook becomes the companion tweet teaser. content_brief should describe the article angle, key sections, and conclusion CTA in 150+ words.
6. posting_time: HH:MM (24h) optimised for X algorithm — typically 7–9am or 6–9pm.
7. why_it_works: The psychological mechanism for this funnel stage + goal.
8. engagement_tip: A specific tactical instruction tied to primary_kpi. Not vague advice.
9. goal_alignment: One sentence — the specific mindset shift this creates toward ${goal}.
10. Vary hooks across all slots — no repeated angles or same opening words.
11. For Poll format: include 4 poll options in content_brief.
${params.topics.length > 0 ? `12. USER-REQUESTED TOPICS — The user wants these specific topics covered. Assign each to the most fitting slot (match funnel_stage and format). Make that slot's hook and content_brief directly about the specified topic:\n${params.topics.map((t, i) => `    ${i + 1}. "${t}"`).join("\n")}` : ""}
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
      "format": "Thread",
      "post_type": "Educational Thread",
      "thread_type": "Educational",
      "thread_tweet_count": 8,
      "article_type": "Deep Dive (only for Article format)",
      "article_length": "standard (only for Article format)",
      "funnel_stage": "MOFU",
      "pillar": "...",
      "hook": "the opening line / hook tweet",
      "content_brief": "100+ word content brief...",
      "posting_time": "08:00",
      "why_it_works": "...",
      "engagement_tip": "...",
      "goal_alignment": "...",
      "primary_kpi": "bookmark_rate"
    }
  ]
}`
}

function normaliseGeneratedPlan(params: {
  raw: unknown
  slots: SlotBlueprint[]
  month: string
  postsPerWeek: number
}): GeneratedPlan {
  const { raw, slots, month, postsPerWeek } = params
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>
  const rawPosts = Array.isArray(obj.posts) ? obj.posts : []

  const posts: GeneratedPost[] = slots.map((slot, i) => {
    const src = (rawPosts[i] && typeof rawPosts[i] === "object" ? rawPosts[i] : {}) as Record<string, unknown>
    const format = VALID_FORMATS.includes(src.format as typeof VALID_FORMATS[number])
      ? (src.format as GeneratedPost["format"])
      : slot.format
    const threadType = typeof src.thread_type === "string"
      ? src.thread_type
      : (THREAD_TYPES_BY_STAGE[slot.funnel_stage][0])
    const articleType = typeof src.article_type === "string"
      ? src.article_type
      : slot.article_type
    const articleLength = typeof src.article_length === "string"
      ? src.article_length
      : (slot.article_length || "standard")

    return {
      id: `post-${i + 1}`,
      date: slot.date,
      dayOfWeek: slot.dayOfWeek,
      format,
      post_type: cleanText(src.post_type, 80) || slot.post_type,
      thread_type: format === "Thread" ? threadType : undefined,
      thread_tweet_count: format === "Thread"
        ? Math.min(12, Math.max(5, Number(src.thread_tweet_count) || 7))
        : undefined,
      article_type: format === "Article" ? articleType : undefined,
      article_length: format === "Article" ? articleLength : undefined,
      funnel_stage: slot.funnel_stage,
      pillar: cleanText(src.pillar, 120) || slot.pillar,
      hook: cleanText(src.hook, 280) || `Stop ignoring this ${slot.pillar} mistake.`,
      content_brief: cleanText(src.content_brief, 800) || "Create a value-driven post aligned to this slot and funnel stage.",
      posting_time: parsePostingTime(src.posting_time),
      why_it_works: cleanText(src.why_it_works, 500) || `This format and angle match ${slot.funnel_stage} intent for ${slot.primary_kpi}.`,
      engagement_tip: cleanText(src.engagement_tip, 400) || `Reply to every comment within the first hour to boost reach on X.`,
      goal_alignment: cleanText(src.goal_alignment, 300) || `This post builds ${slot.funnel_stage} intent toward the stated goal.`,
      primary_kpi: slot.primary_kpi,
    }
  })

  const funnelCounts = posts.reduce((acc, p) => { acc[p.funnel_stage]++; return acc }, { TOFU: 0, MOFU: 0, BOFU: 0 })
  const total = Math.max(posts.length, 1)
  const pillarDistribution: Record<string, number> = {}
  for (const p of posts) pillarDistribution[p.pillar] = (pillarDistribution[p.pillar] || 0) + 1

  return {
    month,
    monthTheme: cleanText(obj.monthTheme, 120) || "Authority-first growth month",
    monthThemeDescription: cleanText(obj.monthThemeDescription, 500) || "Balanced content strategy spanning awareness, education, and conversion.",
    postsPerWeek,
    frequencyRationale: cleanText(obj.frequencyRationale, 400) || "Consistent daily posting builds algorithmic momentum on X.",
    funnelBreakdown: {
      tofu: round2((funnelCounts.TOFU / total) * 100),
      mofu: round2((funnelCounts.MOFU / total) * 100),
      bofu: round2((funnelCounts.BOFU / total) * 100),
    },
    pillarDistribution,
    posts,
  }
}

const BATCH_SIZE = 8 // posts per parallel batch — keeps Haiku reliable

type CandidateParams = {
  month: string; postsPerWeek: number; goal: string; industry: string
  businessDescription: string; targetAudience: string; qualityMode: QualityMode
  voiceContext: { tone: string; voiceSample: string; businessName: string; location: string; offers: string; usp: string; primaryCta: string; proofPoints: string; xHandle: string }
  slots: SlotBlueprint[]; repairDirectives: string[]; feedbackConstraints: string; topics: string[]
}

async function callHaiku(params: CandidateParams): Promise<Record<string, unknown> | null> {
  const scaledMaxTokens = Math.min(16000, Math.max(4000, params.slots.length * 600 + 1000))

  const message = await getAnthropic().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: scaledMaxTokens,
    system: buildPlanSystemPrompt(normaliseGoal(params.goal), params.feedbackConstraints),
    messages: [{ role: "user", content: buildGenerationPrompt(params) }],
  })
  console.log(`[x-plan] Batch ${params.slots.length} posts — stop=${message.stop_reason}, usage=${JSON.stringify(message.usage)}`)

  const text = message.content[0]?.type === "text" ? message.content[0].text : ""
  return safeJsonParse(text) as Record<string, unknown> | null
}

async function generateCandidate(params: CandidateParams): Promise<GeneratedPlan | null> {
  const totalSlots = params.slots.length
  const t0 = Date.now()

  // Small plans (≤ BATCH_SIZE): single call, get full metadata
  if (totalSlots <= BATCH_SIZE) {
    console.log(`[x-plan] Single batch: ${totalSlots} posts`)
    const parsed = await callHaiku(params)
    if (!parsed) return null
    console.log(`[x-plan] Done in ${Date.now() - t0}ms`)
    return normaliseGeneratedPlan({ raw: parsed, slots: params.slots, month: params.month, postsPerWeek: params.postsPerWeek })
  }

  // Large plans: split into parallel batches
  const batches: { slots: SlotBlueprint[]; topics: string[] }[] = []
  let topicIdx = 0
  for (let i = 0; i < totalSlots; i += BATCH_SIZE) {
    const batchSlots = params.slots.slice(i, i + BATCH_SIZE)
    const batchTopics: string[] = []
    for (const _slot of batchSlots) {
      if (topicIdx < params.topics.length) {
        batchTopics.push(params.topics[topicIdx])
        topicIdx++
      }
    }
    batches.push({ slots: batchSlots, topics: batchTopics })
  }

  console.log(`[x-plan] Parallel: ${totalSlots} posts in ${batches.length} batches`)

  const batchResults = await Promise.all(
    batches.map(batch =>
      callHaiku({ ...params, slots: batch.slots, topics: batch.topics })
    )
  )

  // Merge posts from all batches
  const allRawPosts: unknown[] = []
  let metadata: Record<string, unknown> = {}
  for (const [i, result] of batchResults.entries()) {
    if (!result) continue
    const posts = Array.isArray(result.posts) ? result.posts : []
    allRawPosts.push(...posts)
    // Use first batch's metadata for the plan
    if (i === 0) metadata = result
  }

  console.log(`[x-plan] All batches done in ${Date.now() - t0}ms — ${allRawPosts.length} raw posts`)

  return normaliseGeneratedPlan({
    raw: { ...metadata, posts: allRawPosts },
    slots: params.slots,
    month: params.month,
    postsPerWeek: params.postsPerWeek,
  })
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()

  try {
    const t0 = Date.now()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    console.log(`[x-plan] Auth: ${Date.now() - t0}ms`)

    const actorId = resolveRequestActorId({ userId: user.id, forwardedFor: request.headers.get("x-forwarded-for"), fallback: "x-plan" })
    const rate = checkRateLimit(`generate-x-plan:${actorId}`, { max: 6, windowMs: 60_000 })
    if (!rate.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded." }, {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      })
    }

    const body = (await request.json()) as Record<string, unknown>
    const postsPerWeek = Number(body.postsPerWeek)
    const rawWeeksCount = body.weeksCount ? Math.min(4, Math.max(1, Number(body.weeksCount))) : null
    const industry = cleanText(body.industry, 100)
    const businessDescription = cleanText(body.businessDescription, 500)
    const targetAudience = cleanText(body.targetAudience, 500)
    const goals = cleanText(body.goals, 100)
    const contentPillars = cleanList(body.contentPillars, 8, 100)
    const topics = cleanList(body.topics, 100, 200)
    const qualityMode = parseQualityMode(body.qualityMode)

    // Derive month: from body or from today (when using weeksCount)
    const todayUTC = new Date()
    const todayStr = `${todayUTC.getUTCFullYear()}-${String(todayUTC.getUTCMonth() + 1).padStart(2, "0")}-${String(todayUTC.getUTCDate()).padStart(2, "0")}`
    const derivedMonth = cleanText(body.month, 7) || todayStr.slice(0, 7)
    const month = /^\d{4}-\d{2}$/.test(derivedMonth) ? derivedMonth : todayStr.slice(0, 7)

    if (![3, 5, 7, 14].includes(postsPerWeek)) return NextResponse.json({ error: "postsPerWeek must be 3, 5, 7, or 14" }, { status: 400 })
    if (!goals) return NextResponse.json({ error: "goals is required" }, { status: 400 })
    const safeIndustry = industry || "Business services"
    const safeTargetAudience = targetAudience || "Business professionals and entrepreneurs"

    const tokenCost = QUALITY_COSTS[qualityMode]

    let exactPosts: number
    let dateSlots: { date: string; dayOfWeek: string }[]

    if (rawWeeksCount) {
      exactPosts = postsPerWeek * rawWeeksCount
      dateSlots = buildWeekDateSlots(todayStr, rawWeeksCount, exactPosts)
    } else {
      const daysInMonth = getDaysInMonth(month)
      const [y, m] = month.split("-").map(Number)
      const firstDayOfWeek = (new Date(y, m - 1, 1).getDay() + 6) % 7
      const calendarWeeks = Math.ceil((daysInMonth + firstDayOfWeek) / 7)
      exactPosts = postsPerWeek * calendarWeeks
      dateSlots = buildDateSlots(month, exactPosts)
    }

    // Clamp topics to the number of posts
    const safeTopics = topics.slice(0, exactPosts)

    const funnelMix = normaliseMix(goals)
    const stageCounts = allocateStageCounts(exactPosts, funnelMix)
    const stageSequence = buildStageSequence(exactPosts, stageCounts)

    const safePillars = contentPillars.length > 0 ? contentPillars : ["Tips & Insights", "Client Results", "Behind the Scenes"]

    const slots: SlotBlueprint[] = stageSequence.map((stage, i) => {
      const format = pickFormatForStage(stage, i)
      const postType = POST_TYPES_BY_FORMAT_AND_STAGE[format][stage]
      const threadType = format === "Thread" ? THREAD_TYPES_BY_STAGE[stage][i % THREAD_TYPES_BY_STAGE[stage].length] : undefined
      const articleTypes = ARTICLE_TYPES_BY_STAGE[stage]
      const articleType = format === "Article" && articleTypes.length > 0
        ? articleTypes[i % articleTypes.length]
        : undefined

      return {
        id: `slot-${i + 1}`,
        date: dateSlots[i].date,
        dayOfWeek: dateSlots[i].dayOfWeek,
        funnel_stage: stage,
        pillar: safePillars[i % safePillars.length],
        format,
        post_type: postType,
        thread_type: threadType,
        article_type: articleType,
        article_length: format === "Article" ? "standard" : undefined,
        primary_kpi: KPI_BY_STAGE[stage],
      }
    })

    console.log(`[x-plan] Setup: ${Date.now() - t0}ms, ${exactPosts} posts, ${qualityMode} mode`)
    const [profile, feedbackConstraints] = await Promise.all([
      fetchProfileContext(supabase, user.id),
      getUserFeedbackContext(user.id),
    ])
    console.log(`[x-plan] Profile+feedback fetched: ${Date.now() - t0}ms`)
    const voiceContext = {
      tone: cleanText(profile?.tone, 120),
      voiceSample: cleanText(profile?.voice_sample, 2500),
      businessName: cleanText(profile?.business_name, 120),
      location: cleanText(profile?.location, 120),
      offers: cleanText(profile?.offers, 500),
      usp: cleanText(profile?.usp, 300),
      primaryCta: cleanText(profile?.primary_cta, 150),
      proofPoints: cleanText(profile?.proof_points, 400),
      xHandle: cleanText(profile?.x_handle, 50),
    }

    const maxAttempts = MAX_ATTEMPTS[qualityMode]
    let bestPlan: GeneratedPlan | null = null
    let bestQuality: QualityResult | null = null
    const attempts: Array<{ attempt: number; overall: number; pass: boolean }> = []

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const repairDirectives = bestQuality?.gaps || []
      const plan = await generateCandidate({
        month, postsPerWeek, goal: goals, industry: safeIndustry, businessDescription, targetAudience: safeTargetAudience,
        qualityMode, voiceContext, slots, repairDirectives, feedbackConstraints, topics: safeTopics,
      })
      if (!plan) { attempts.push({ attempt, overall: 0, pass: false }); continue }

      const quality = evaluateQuality(plan, qualityMode)
      attempts.push({ attempt, overall: quality.overall, pass: quality.pass })

      if (!bestQuality || quality.overall > bestQuality.overall) {
        bestQuality = quality
        bestPlan = plan
      }
      if (quality.pass) break
    }

    console.log(`[x-plan] Generation done: ${Date.now() - t0}ms, best=${bestQuality?.overall ?? 0}`)
    if (!bestPlan || !bestQuality) return NextResponse.json({ error: "Failed to generate content plan" }, { status: 500 })

    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: tokenCost,
      p_type: "feature_use",
      p_description: `Generated X content plan (${qualityMode}) for ${month}`,
    } as never)

    if (debitError) {
      const msg = String(debitError.message || debitError)
      if (msg.includes("Insufficient")) return NextResponse.json({ error: "Insufficient tokens", balance_needed: tokenCost }, { status: 402 })
      throw debitError
    }

    // Persist plan
    const planPayload = {
      user_id: user.id,
      month,
      industry: safeIndustry,
      target_audience: safeTargetAudience,
      goals,
      quality_mode: qualityMode,
      platform: "x",
      quality_report: { mode: qualityMode, attempts, overallScore: bestQuality.overall },
      generation_version: "x_planner_v1",
    }

    const { data: planRow } = await admin.from("content_plans").insert(planPayload as never).select("id").single()
    const planId = (planRow as { id?: string } | null)?.id

    if (planId) {
      const postRows = bestPlan.posts.map((p) => ({
        user_id: user.id,
        plan_id: planId,
        date: p.date,
        day_of_week: p.dayOfWeek,
        format: p.format,
        funnel_stage: p.funnel_stage,
        pillar: p.pillar,
        topic: p.hook,
        caption_hook: p.hook,
        caption_body: p.content_brief,
        posting_time: p.posting_time,
        status: "draft",
        platform: "x",
        meta: {
          post_type: p.post_type,
          thread_type: p.thread_type,
          thread_tweet_count: p.thread_tweet_count,
          article_type: p.article_type,
          article_length: p.article_length,
          content_brief: p.content_brief,
          why_it_works: p.why_it_works,
          engagement_tip: p.engagement_tip,
          goal_alignment: p.goal_alignment,
        },
        quality_score: bestQuality.overall,
        primary_kpi: p.primary_kpi,
      }))
      await admin.from("posts").insert(postRows as never)
    }

    return NextResponse.json({
      plan: bestPlan,
      planId: planId || null,
      balance: newBalance,
      deducted: tokenCost,
      qualityReport: {
        mode: qualityMode,
        attempts,
        overallScore: bestQuality.overall,
        passed: bestQuality.pass,
      },
    })
  } catch (error) {
    console.error("X plan generation error:", error)
    return NextResponse.json({ error: "Failed to generate X content plan" }, { status: 500 })
  }
}
