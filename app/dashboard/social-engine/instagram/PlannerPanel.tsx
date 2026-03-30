"use client"

import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"

// ─── Types ───────────────────────────────────────────────────────────────────

type PostingFrequency = 3 | 5 | 7
type FunnelStage = "TOFU" | "MOFU" | "BOFU"
type PostFormat = "Talking Head Reel" | "Voiceover/B-Roll Reel" | "Carousel" | "Single Image" | "Story"
type AudienceSize = "0-1K" | "1K-10K" | "10K-50K" | "50K+"
type QualityMode = "fast" | "pro"
type PlannerMode = "full" | "remix"
type CTAType = "soft" | "mid" | "hard"

interface PlannerBrief {
  coreOffer: string
  primaryCTA: string
  differentiator: string
  proofPoints: string[]
  forbiddenTopics: string[]
  complianceConstraints: string
  topObjections: string[]
  seasonalContext: string
  priorityProducts: string[]
  competitorAnglesToAvoid: string[]
}

interface PlannerFormData {
  industry: string
  businessDescription: string
  targetAudience: string
  audienceSize: AudienceSize | ""
  goals: string
  desiredOutcomes: string
  contentPillars: string[]
  enabledFormats: string[]
  postsPerWeek: PostingFrequency | null
  month: string
  qualityMode: QualityMode
  brief: PlannerBrief
}

interface PlannedPost {
  id: string
  date: string
  dayOfWeek: string
  title: string
  description: string
  format: PostFormat
  funnel_stage: FunnelStage
  pillar: string
  caption_hook: string
  posting_time: string
  hashtags: string[]
  why_it_works?: string
  engagement_tip?: string
  primary_kpi?: string
  evidence_refs?: Array<{
    source_type: "account" | "benchmark" | "trend"
    reference_id: string
    pattern: string
    observed_lift: number
  }>
}

interface ContentPlan {
  month: string
  monthTheme: string
  monthThemeDescription: string
  postsPerWeek: PostingFrequency
  frequencyRationale: string
  funnelBreakdown: { tofu: number; mofu: number; bofu: number }
  pillarDistribution: Record<string, number>
  posts: PlannedPost[]
}

interface CalendarCell {
  date: number | null
  dateStr: string | null
  post: PlannedPost | null
  isCurrentMonth: boolean
}

interface SearchReel {
  hook: string
  viewCount: number
  likesCount: number
  username: string
  url: string
  caption: string
}

interface RemixPost {
  hook: string
  topicUsed: string
  title: string
  body: string
  cta: string
  hashtags: string[]
  postingTip: string
}

interface RemixFormData {
  hashtagInput: string
  hashtags: string[]
  selectedHooks: string[]
  topics: string[]
  topicInput: string
  format: string
  ctaType: CTAType
}

// ─── Constants ───────────────────────────────────────────────────────────────

const INDUSTRIES = [
  "Architecture & Interior Design",
  "Real Estate",
  "Construction & Trades",
  "Health & Fitness",
  "Beauty & Wellness",
  "Food & Hospitality",
  "E-commerce & Retail",
  "Professional Services",
  "Education & Coaching",
  "Tech & SaaS",
  "Creative Agency",
  "Other",
]

const GOAL_OPTIONS = [
  "Brand Awareness",
  "Lead Generation",
  "Sales & Conversions",
  "Community Building",
  "Education & Authority",
]

const PILLAR_SUGGESTIONS = [
  "Behind the scenes",
  "Tips & education",
  "Client results",
  "Product showcase",
  "Industry trends",
  "Personal brand",
  "Testimonials",
  "How-to guides",
  "Inspiration",
  "News & updates",
]

const AUDIENCE_SIZE_OPTIONS: { value: AudienceSize; label: string; description: string }[] = [
  { value: "0-1K", label: "Just Starting", description: "Building from scratch (0-1K)" },
  { value: "1K-10K", label: "Growing", description: "Gaining traction (1K-10K)" },
  { value: "10K-50K", label: "Established", description: "Solid presence (10K-50K)" },
  { value: "50K+", label: "Large", description: "Scaled audience (50K+)" },
]

const FORMAT_OPTIONS: { value: string; label: string; description: string }[] = [
  { value: "Talking Head Reel", label: "Talking Head Reel", description: "You on camera speaking directly to your audience" },
  { value: "Voiceover/B-Roll Reel", label: "Voiceover/B-Roll Reel", description: "Voiceover or text with footage — no face needed" },
  { value: "Carousel", label: "Carousel", description: "Multi-slide educational or storytelling posts" },
  { value: "Single Image", label: "Single Image", description: "Photos, quotes, brand moments" },
  { value: "Story", label: "Story", description: "Polls, behind-the-scenes, quick CTAs" },
]

const FREQUENCY_OPTIONS: {
  value: PostingFrequency
  label: string
  posts: string
  strategy: string
  bestFor: string
}[] = [
    {
      value: 3,
      label: "3x per week",
      posts: "~12 posts/month",
      strategy:
        "Consistency without burnout. Every post is high-quality pillar content that earns saves and shares.",
      bestFor: "Solopreneurs & small teams with limited content time",
    },
    {
      value: 5,
      label: "5x per week",
      posts: "~20 posts/month",
      strategy:
        "The algorithm sweet spot. Enough volume to stay visible, with room to test different formats and angles.",
      bestFor: "Growing businesses ready to scale their presence",
    },
    {
      value: 7,
      label: "7x per week",
      posts: "~30 posts/month",
      strategy:
        "Maximum visibility. Daily presence builds authority fast and compounds reach through consistent touchpoints.",
      bestFor: "Brands in competitive niches pushing for rapid growth",
    },
  ]

const QUALITY_MODE_OPTIONS: {
  value: QualityMode
  label: string
  description: string
  tokenCost: number
}[] = [
    {
      value: "fast",
      label: "Fast",
      description: "One-pass generation with lighter quality checks.",
      tokenCost: 25,
    },
    {
      value: "pro",
      label: "Pro",
      description: "Multi-pass scoring and automatic retry for top-quality outputs.",
      tokenCost: 60,
    },
  ]

const FUNNEL_COLORS: Record<FunnelStage, { bg: string; border: string; text: string; dot: string }> = {
  TOFU: { bg: "bg-blue-400/15", border: "border-blue-400/30", text: "text-blue-400", dot: "bg-blue-400" },
  MOFU: { bg: "bg-amber-400/15", border: "border-amber-400/30", text: "text-amber-400", dot: "bg-amber-400" },
  BOFU: { bg: "bg-teal-400/15", border: "border-teal-400/30", text: "text-teal-400", dot: "bg-teal-400" },
}

const FUNNEL_LABELS: Record<FunnelStage, string> = {
  TOFU: "Awareness",
  MOFU: "Nurture",
  BOFU: "Convert",
}

const LOADING_MESSAGES = [
  "Researching top-performing content in your niche...",
  "Analysing proven engagement patterns...",
  "Mapping your content funnel strategy...",
  "Crafting scroll-stopping hooks...",
  "Optimising posting schedule for your audience...",
  "Building your research-backed calendar...",
]

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getNextMonths(count: number): { value: string; label: string }[] {
  const months = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    months.push({ value, label })
  }
  return months
}

function getCalendarCells(monthStr: string, posts: PlannedPost[]): CalendarCell[] {
  const [year, month] = monthStr.split("-").map(Number)
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const startDayOfWeek = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()

  const postsByDate = new Map<string, PlannedPost>()
  posts.forEach((p) => postsByDate.set(p.date, p))

  const cells: CalendarCell[] = []

  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push({ date: null, dateStr: null, post: null, isCurrentMonth: false })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    cells.push({
      date: d,
      dateStr,
      post: postsByDate.get(dateStr) || null,
      isCurrentMonth: true,
    })
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, dateStr: null, post: null, isCurrentMonth: false })
  }

  return cells
}

function getMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split("-").map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  })
}

function toMultiLineText(items: string[]): string {
  return items.join("\n")
}

function fromMultiLineText(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12)
}

// ─── Research Helpers ────────────────────────────────────────────────────────

const INDUSTRY_HASHTAGS: Record<string, string[]> = {
  "Architecture & Interior Design": ["interiordesign", "architecture"],
  "Real Estate": ["realestate", "property"],
  "Construction & Trades": ["construction", "trades"],
  "Health & Fitness": ["fitness", "health"],
  "Beauty & Wellness": ["beauty", "wellness"],
  "Food & Hospitality": ["foodie", "restaurant"],
  "E-commerce & Retail": ["ecommerce", "smallbusiness"],
  "Professional Services": ["business", "consulting"],
  "Education & Coaching": ["coaching", "onlinecoaching"],
  "Tech & SaaS": ["saas", "tech"],
  "Creative Agency": ["creative", "agency"],
  "Other": ["business", "entrepreneur"],
}

function deriveHashtags(industry: string, pillars: string[]): string[] {
  const tags = INDUSTRY_HASHTAGS[industry] || [industry.toLowerCase().replace(/[^a-z]/g, "")]
  if (pillars.length > 0) {
    tags.push(pillars[0].toLowerCase().replace(/[^a-z]/g, ""))
  }
  return tags.slice(0, 3)
}

function formatViewCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FormatIcon({ format, className = "w-3.5 h-3.5" }: { format: string; className?: string }) {
  if (format.includes("Reel"))
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    )
  if (format === "Carousel")
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
      </svg>
    )
  if (format === "Single Image")
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
      </svg>
    )
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function FunnelBadge({ stage, size = "sm" }: { stage: FunnelStage; size?: "sm" | "xs" }) {
  const colors = FUNNEL_COLORS[stage]
  const label = FUNNEL_LABELS[stage]
  if (size === "xs")
    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${colors.bg} ${colors.border} border ${colors.text}`}>
        <span className={`w-1 h-1 rounded-full ${colors.dot}`} />
        {stage}
      </span>
    )
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${colors.bg} ${colors.border} border ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {label}
    </span>
  )
}

function FormatBadge({ format }: { format: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.06] border border-white/[0.08] text-gray-400">
      <FormatIcon format={format} className="w-3 h-3" />
      {format}
    </span>
  )
}

// ─── Accordion ──────────────────────────────────────────────────────────────

function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/[0.04] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
      >
        {title}
        <svg className={`w-4 h-4 text-gray-600 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-5 space-y-5">{children}</div>}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PlannerPanel() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState<PlannerFormData>({
    industry: "",
    businessDescription: "",
    targetAudience: "",
    audienceSize: "",
    goals: "",
    desiredOutcomes: "",
    contentPillars: [],
    enabledFormats: FORMAT_OPTIONS.map((f) => f.value),
    postsPerWeek: 5,
    month: "",
    qualityMode: "pro",
    brief: {
      coreOffer: "",
      primaryCTA: "",
      differentiator: "",
      proofPoints: [],
      forbiddenTopics: ["Misleading claims"],
      complianceConstraints: "No guaranteed results or misleading claims.",
      topObjections: [],
      seasonalContext: "",
      priorityProducts: [],
      competitorAnglesToAvoid: [],
    },
  })
  const [showCustomize, setShowCustomize] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profileData, setProfileData] = useState<Record<string, any> | null>(null)
  const [pillarInput, setPillarInput] = useState("")

  // Generation state
  const [generating, setGenerating] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState("")

  // Research phase state
  type PlannerPhase = "configure" | "researching" | "review" | "generating" | "results"
  const [phase, setPhase] = useState<PlannerPhase>("configure")
  const [researchHooks, setResearchHooks] = useState<SearchReel[]>([])
  const [selectedResearchHooks, setSelectedResearchHooks] = useState<string[]>([])
  const [researchError, setResearchError] = useState("")

  // Results state
  const [plan, setPlan] = useState<ContentPlan | null>(null)
  const [selectedPost, setSelectedPost] = useState<PlannedPost | null>(null)
  const [regeneratingPostId, setRegeneratingPostId] = useState<string | null>(null)

  // Filters
  const [filterStage, setFilterStage] = useState<FunnelStage | "all">("all")
  const [filterFormat, setFilterFormat] = useState<PostFormat | "all">("all")
  const [filterPillar, setFilterPillar] = useState<string | "all">("all")
  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar")

  // Mobile menu
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  // Hook Remix state
  const [plannerMode, setPlannerMode] = useState<PlannerMode>("full")
  const [remixForm, setRemixForm] = useState<RemixFormData>({
    hashtagInput: "",
    hashtags: [],
    selectedHooks: [],
    topics: [],
    topicInput: "",
    format: "Talking Head Reel",
    ctaType: "mid",
  })
  const [searchResults, setSearchResults] = useState<SearchReel[]>([])
  const [remixResults, setRemixResults] = useState<RemixPost[]>([])
  const [remixSearching, setRemixSearching] = useState(false)
  const [remixGenerating, setRemixGenerating] = useState(false)
  const [remixError, setRemixError] = useState("")
  const [remixCopied, setRemixCopied] = useState<number | null>(null)

  // Refs for cleanup
  const mountedRef = useRef(true)
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current)
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
  }, [])

  const months = useMemo(() => getNextMonths(4), [])

  // Restore form state from localStorage on first mount (before profile load)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hub_planner_form")
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<PlannerFormData>
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          // Don't restore month across sessions — it may be stale
          month: prev.month,
        }))
      }
    } catch {
      // Silently fail
    }
  }, [])

  // Persist form state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("hub_planner_form", JSON.stringify(formData))
    } catch {
      // Silently fail
    }
  }, [formData])

  // Close dialog on Escape
  useEffect(() => {
    if (!selectedPost) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedPost(null) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selectedPost])

  // Pre-fill from profile for logged-in users
  useEffect(() => {
    if (!user || profileLoaded) return
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile")
        if (!res.ok) return
        const { profile } = await res.json()
        setProfileData(profile)

        // Parse proof_points — could be string or array
        let parsedProofPoints: string[] = []
        if (Array.isArray(profile.proof_points)) {
          parsedProofPoints = profile.proof_points.filter(Boolean)
        } else if (typeof profile.proof_points === "string" && profile.proof_points.trim()) {
          parsedProofPoints = profile.proof_points.split(/[.\n]/).map((s: string) => s.trim()).filter(Boolean)
        }

        setFormData((prev) => ({
          ...prev,
          industry: profile.industry || prev.industry,
          businessDescription: profile.offers || prev.businessDescription,
          targetAudience: profile.target_audience || prev.targetAudience,
          goals: profile.goals || prev.goals,
          desiredOutcomes: profile.desired_outcomes || prev.desiredOutcomes,
          contentPillars:
            Array.isArray(profile.content_pillars) && profile.content_pillars.length > 0
              ? profile.content_pillars
              : prev.contentPillars,
          brief: {
            ...prev.brief,
            coreOffer: profile.offers || prev.brief.coreOffer,
            primaryCTA: profile.primary_cta || prev.brief.primaryCTA,
            differentiator: profile.usp || prev.brief.differentiator,
            proofPoints: parsedProofPoints.length > 0 ? parsedProofPoints : prev.brief.proofPoints,
          },
        }))
        setProfileLoaded(true)
      } catch {
        // Silently fail — user can fill in manually
      }
    }
    loadProfile()
  }, [user, profileLoaded])

  // ─── Form Helpers ──────────────────────────────────────────────────────────

  const updateFormField = useCallback(
    <K extends keyof PlannerFormData>(field: K, value: PlannerFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const togglePillar = useCallback((pillar: string) => {
    setFormData((prev) => {
      const current = prev.contentPillars
      if (current.includes(pillar)) {
        return { ...prev, contentPillars: current.filter((p) => p !== pillar) }
      } else if (current.length < 5) {
        return { ...prev, contentPillars: [...current, pillar] }
      }
      return prev
    })
  }, [])

  const addCustomPillar = useCallback(() => {
    const trimmed = pillarInput.trim()
    if (!trimmed) return
    setFormData((prev) => {
      if (prev.contentPillars.includes(trimmed) || prev.contentPillars.length >= 5) return prev
      return { ...prev, contentPillars: [...prev.contentPillars, trimmed] }
    })
    setPillarInput("")
  }, [pillarInput])

  const toggleFormat = useCallback((format: string) => {
    setFormData((prev) => {
      const current = prev.enabledFormats
      if (current.includes(format)) {
        if (current.length <= 1) return prev // Keep at least 1
        return { ...prev, enabledFormats: current.filter((f) => f !== format) }
      }
      return { ...prev, enabledFormats: [...current, format] }
    })
  }, [])

  const updateBriefField = useCallback(
    <K extends keyof PlannerBrief>(field: K, value: PlannerBrief[K]) => {
      setFormData((prev) => ({
        ...prev,
        brief: {
          ...prev.brief,
          [field]: value,
        },
      }))
    },
    []
  )

  const canGenerate = useMemo((): boolean => {
    return (
      formData.month !== "" &&
      formData.postsPerWeek !== null &&
      formData.industry.trim().length > 0 &&
      formData.targetAudience.trim().length > 0 &&
      formData.goals.trim().length > 0 &&
      formData.contentPillars.length >= 2 &&
      formData.enabledFormats.length >= 1 &&
      formData.brief.coreOffer.trim().length > 0 &&
      formData.brief.primaryCTA.trim().length > 0 &&
      formData.brief.differentiator.trim().length > 0 &&
      formData.brief.complianceConstraints.trim().length > 0 &&
      formData.brief.proofPoints.length > 0 &&
      formData.brief.forbiddenTopics.length > 0
    )
  }, [formData])

  const missingFields = useMemo((): string[] => {
    const missing: string[] = []
    if (!formData.month) missing.push("Month")
    if (!formData.industry.trim()) missing.push("Industry")
    if (!formData.targetAudience.trim()) missing.push("Target audience")
    if (!formData.goals.trim()) missing.push("Goal")
    if (formData.contentPillars.length < 2) missing.push("Content pillars (min 2)")
    if (!formData.brief.coreOffer.trim()) missing.push("Core offer")
    if (!formData.brief.primaryCTA.trim()) missing.push("Primary CTA")
    if (!formData.brief.differentiator.trim()) missing.push("Differentiator")
    if (formData.brief.proofPoints.length === 0) missing.push("Proof points")
    return missing
  }, [formData])

  const profileFields = useMemo(() => {
    if (!profileData) return { filled: [] as { key: string; label: string }[], missing: [] as { key: string; label: string }[] }
    const checks = [
      { key: "industry", label: "Industry", value: profileData.industry },
      { key: "target_audience", label: "Target audience", value: profileData.target_audience },
      { key: "offers", label: "Core offer", value: profileData.offers },
      { key: "usp", label: "Differentiator", value: profileData.usp },
      { key: "primary_cta", label: "Primary CTA", value: profileData.primary_cta },
      { key: "proof_points", label: "Proof points", value: profileData.proof_points },
      { key: "tone", label: "Tone of voice", value: profileData.tone },
      { key: "business_name", label: "Business name", value: profileData.business_name },
      { key: "location", label: "Location", value: profileData.location },
    ]
    return {
      filled: checks.filter(c => c.value && String(c.value).trim().length > 0),
      missing: checks.filter(c => !c.value || String(c.value).trim().length === 0),
    }
  }, [profileData])

  const selectedQualityCost = useMemo(() => {
    return QUALITY_MODE_OPTIONS.find((mode) => mode.value === formData.qualityMode)?.tokenCost || 25
  }, [formData.qualityMode])

  // ─── Computed ──────────────────────────────────────────────────────────────

  const filteredPosts = useMemo(() => {
    if (!plan) return []
    return plan.posts.filter((p) => {
      if (filterStage !== "all" && p.funnel_stage !== filterStage) return false
      if (filterFormat !== "all" && p.format !== filterFormat) return false
      if (filterPillar !== "all" && p.pillar !== filterPillar) return false
      return true
    })
  }, [plan, filterStage, filterFormat, filterPillar])

  const calendarCells = useMemo(() => {
    if (!plan) return []
    return getCalendarCells(plan.month, filteredPosts)
  }, [plan, filteredPosts])

  const pillars = useMemo(() => {
    if (!plan) return []
    return Object.keys(plan.pillarDistribution)
  }, [plan])

  const uniqueFormats = useMemo(() => {
    if (!plan) return []
    return [...new Set(plan.posts.map((p) => p.format))]
  }, [plan])

  const sortedFilteredPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => a.date.localeCompare(b.date))
  }, [filteredPosts])

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleResearch = useCallback(async () => {
    if (!user) {
      router.push(`/login?redirect=/dashboard/social-engine/instagram`)
      return
    }

    if (!canGenerate) {
      setShowCustomize(true)
      setError(`Missing required fields: ${missingFields.join(", ")}. Expand Customize below to fill them in.`)
      return
    }

    setPhase("researching")
    setResearchError("")
    setError("")

    const hashtags = deriveHashtags(formData.industry, formData.contentPillars)

    try {
      const res = await fetch("/api/generate/hook-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hashtags }),
      })

      if (!res.ok) {
        // Research failed — let user proceed without hooks
        setPhase("review")
        setResearchHooks([])
        setSelectedResearchHooks([])
        setResearchError("Could not find hooks — you can still generate a plan without research.")
        return
      }

      const data = await res.json()
      const reels: SearchReel[] = data.reels || []
      setResearchHooks(reels)
      setSelectedResearchHooks(reels.map((r) => r.hook))
      refreshBalance()
      setPhase("review")
    } catch {
      setPhase("review")
      setResearchHooks([])
      setSelectedResearchHooks([])
      setResearchError("Research failed — you can still generate a plan.")
    }
  }, [user, canGenerate, formData.industry, formData.contentPillars, missingFields, router, refreshBalance])

  const toggleResearchHook = useCallback((hook: string) => {
    setSelectedResearchHooks((prev) =>
      prev.includes(hook) ? prev.filter((h) => h !== hook) : [...prev, hook]
    )
  }, [])

  const handleGenerate = useCallback(async (hooksOverride?: string[]) => {
    if (!formData.postsPerWeek || !formData.month) return

    if (!user) {
      router.push(`/login?redirect=/dashboard/social-engine/instagram`)
      return
    }

    if (!canGenerate) {
      setShowCustomize(true)
      setError(`Missing required fields: ${missingFields.join(", ")}. Expand Customize below to fill them in.`)
      return
    }

    if (tokenBalance < selectedQualityCost) {
      setError(`Insufficient tokens. You need ${selectedQualityCost} tokens but have ${tokenBalance}.`)
      return
    }

    setPhase("generating")
    setGenerating(true)
    setError("")
    setPlan(null)
    setSelectedPost(null)
    setLoadingStep(0)
    setElapsedSeconds(0)

    loadingIntervalRef.current = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 3000)

    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 240_000)

    try {
      const res = await fetch("/api/generate/content-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          postsPerWeek: formData.postsPerWeek,
          month: formData.month,
          industry: formData.industry,
          businessDescription: formData.businessDescription,
          targetAudience: formData.targetAudience,
          audienceSize: formData.audienceSize,
          goals: formData.goals,
          desiredOutcomes: formData.desiredOutcomes,
          contentPillars: formData.contentPillars,
          enabledFormats: formData.enabledFormats,
          qualityMode: formData.qualityMode,
          brief: formData.brief,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          idempotencyKey: crypto.randomUUID(),
          provenHooks: hooksOverride ?? selectedResearchHooks,
        }),
      })

      if (!mountedRef.current) return

      const data = await res.json()

      if (!mountedRef.current) return

      if (!res.ok) {
        setError(data.error || "Generation failed")
        return
      }

      // Redirect to calendar view
      const planId = data.planId ? `&planId=${encodeURIComponent(String(data.planId))}` : ""
      router.push(`/dashboard/social-engine/instagram/calendar?month=${formData.month}${planId}`)
      refreshBalance()
    } catch (err) {
      if (mountedRef.current) {
        const isTimeout = err instanceof DOMException && err.name === "AbortError"
        setError(
          isTimeout
            ? "Generation timed out after 4 minutes. Please try again."
            : "Something went wrong. Please try again."
        )
      }
    } finally {
      clearTimeout(timeoutId)
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
        loadingIntervalRef.current = null
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      if (mountedRef.current) setGenerating(false)
    }
  }, [formData, user, tokenBalance, refreshBalance, router, selectedQualityCost, canGenerate, missingFields, selectedResearchHooks])

  const handleRegeneratePost = useCallback(
    async (post: PlannedPost) => {
      if (!plan) return
      setRegeneratingPostId(post.id)

      try {
        const res = await fetch("/api/generate/content-plan", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postToRegenerate: post,
            monthTheme: plan.monthTheme,
            qualityMode: formData.qualityMode,
          }),
        })

        const data = await res.json()

        if (res.ok && data.post) {
          const newPost = { ...data.post, id: post.id }
          setPlan((prev) =>
            prev
              ? {
                ...prev,
                posts: prev.posts.map((p) => (p.id === post.id ? newPost : p)),
              }
              : prev
          )
          setSelectedPost((prev) => (prev?.id === post.id ? newPost : prev))
        } else {
          setError("Failed to regenerate post. Please try again.")
        }
      } catch {
        setError("Failed to regenerate post. Please try again.")
      } finally {
        setRegeneratingPostId(null)
      }
    },
    [plan, formData.qualityMode]
  )

  const handleExportCSV = useCallback(() => {
    if (!plan) return
    const headers = [
      "Date", "Day", "Title", "Format", "Funnel Stage", "Pillar",
      "Caption Hook", "Posting Time", "Hashtags", "Description",
      "Why It Works", "Engagement Tip",
    ]
    const rows = plan.posts.map((p) => [
      p.date, p.dayOfWeek, p.title, p.format, p.funnel_stage, p.pillar,
      p.caption_hook, p.posting_time, p.hashtags.join("; "), p.description,
      p.why_it_works || "", p.engagement_tip || "",
    ])
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `content-plan-${plan.month}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [plan])

  const handleCopyToClipboard = useCallback(async () => {
    if (!plan) return
    const text = plan.posts
      .map(
        (p) =>
          `${p.date} (${p.dayOfWeek}) — ${p.posting_time}\n` +
          `Title: ${p.title}\n` +
          `Format: ${p.format} | Stage: ${p.funnel_stage} | Pillar: ${p.pillar}\n` +
          `Hook: ${p.caption_hook}\n` +
          `${p.description}\n` +
          (p.why_it_works ? `Why it works: ${p.why_it_works}\n` : "") +
          (p.engagement_tip ? `Engagement tip: ${p.engagement_tip}\n` : "") +
          `Hashtags: ${p.hashtags.map((h) => `#${h}`).join(" ")}`
      )
      .join("\n\n---\n\n")

    const full = `Content Plan: ${getMonthLabel(plan.month)}\nTheme: ${plan.monthTheme}\n${plan.monthThemeDescription}\n\n${text}`

    try {
      await navigator.clipboard.writeText(full)
      setCopiedToClipboard(true)
      setTimeout(() => setCopiedToClipboard(false), 2000)
    } catch {
      setError("Failed to copy to clipboard. Try downloading as CSV instead.")
    }
  }, [plan])

  const handleReset = useCallback(() => {
    setPlan(null)
    setSelectedPost(null)
    setFilterStage("all")
    setFilterFormat("all")
    setFilterPillar("all")
    setError("")
    setPhase("configure")
    setResearchHooks([])
    setSelectedResearchHooks([])
    setResearchError("")
  }, [])

  // ─── Hook Remix Handlers ────────────────────────────────────────────────────

  const addRemixHashtag = useCallback(() => {
    const tag = remixForm.hashtagInput.replace(/^#/, "").trim().toLowerCase()
    if (!tag || remixForm.hashtags.includes(tag) || remixForm.hashtags.length >= 3) return
    setRemixForm((prev) => ({ ...prev, hashtags: [...prev.hashtags, tag], hashtagInput: "" }))
  }, [remixForm.hashtagInput, remixForm.hashtags])

  const removeRemixHashtag = useCallback((tag: string) => {
    setRemixForm((prev) => ({ ...prev, hashtags: prev.hashtags.filter((h) => h !== tag) }))
  }, [])

  const addRemixTopic = useCallback(() => {
    const topic = remixForm.topicInput.trim()
    if (!topic || remixForm.topics.includes(topic) || remixForm.topics.length >= 5) return
    setRemixForm((prev) => ({ ...prev, topics: [...prev.topics, topic], topicInput: "" }))
  }, [remixForm.topicInput, remixForm.topics])

  const removeRemixTopic = useCallback((topic: string) => {
    setRemixForm((prev) => ({ ...prev, topics: prev.topics.filter((t) => t !== topic) }))
  }, [])

  const toggleSelectedHook = useCallback((hook: string) => {
    setRemixForm((prev) => {
      if (prev.selectedHooks.includes(hook)) {
        return { ...prev, selectedHooks: prev.selectedHooks.filter((h) => h !== hook) }
      }
      if (prev.selectedHooks.length >= 10) return prev
      return { ...prev, selectedHooks: [...prev.selectedHooks, hook] }
    })
  }, [])

  const handleHookSearch = useCallback(async () => {
    if (remixForm.hashtags.length === 0) return
    if (!user) {
      router.push(`/login?redirect=/dashboard/social-engine/instagram`)
      return
    }
    if (tokenBalance < 3) {
      setRemixError("Insufficient tokens. You need 3 tokens to search.")
      return
    }
    setRemixSearching(true)
    setRemixError("")
    setSearchResults([])
    setRemixForm((prev) => ({ ...prev, selectedHooks: [] }))
    try {
      const res = await fetch("/api/generate/hook-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hashtags: remixForm.hashtags }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRemixError(data.error || "Search failed. Please try again.")
        return
      }
      setSearchResults(data.reels || [])
      refreshBalance()
    } catch {
      setRemixError("Something went wrong. Please try again.")
    } finally {
      setRemixSearching(false)
    }
  }, [remixForm.hashtags, user, tokenBalance, refreshBalance, router])

  const handleRemixGenerate = useCallback(async () => {
    if (remixForm.selectedHooks.length === 0) return
    if (!user) {
      router.push(`/login?redirect=/dashboard/social-engine/instagram`)
      return
    }
    if (tokenBalance < 10) {
      setRemixError("Insufficient tokens. You need 10 tokens to generate.")
      return
    }
    setRemixGenerating(true)
    setRemixError("")
    setRemixResults([])
    try {
      const res = await fetch("/api/generate/hook-remix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hooks: remixForm.selectedHooks,
          topics: remixForm.topics,
          format: remixForm.format,
          ctaType: remixForm.ctaType,
          businessContext: {
            industry: formData.industry,
            businessDescription: formData.businessDescription,
            targetAudience: formData.targetAudience,
            coreOffer: formData.brief.coreOffer,
            primaryCTA: formData.brief.primaryCTA,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRemixError(data.error || "Generation failed. Please try again.")
        return
      }
      setRemixResults(data.posts || [])
      refreshBalance()
    } catch {
      setRemixError("Something went wrong. Please try again.")
    } finally {
      setRemixGenerating(false)
    }
  }, [remixForm, formData, user, tokenBalance, refreshBalance, router])

  const handleCopyRemixPost = useCallback(async (post: RemixPost, index: number) => {
    const text = [
      `HOOK: ${post.hook}`,
      `TOPIC: ${post.topicUsed}`,
      `TITLE: ${post.title}`,
      ``,
      `BODY COPY:`,
      post.body,
      ``,
      `CTA: ${post.cta}`,
      ``,
      `POSTING TIP: ${post.postingTip}`,
      ``,
      `HASHTAGS: ${post.hashtags.map((h) => `#${h}`).join(" ")}`,
    ].join("\n")
    try {
      await navigator.clipboard.writeText(text)
      setRemixCopied(index)
      setTimeout(() => setRemixCopied(null), 2000)
    } catch {
      // Silently fail
    }
  }, [])

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
          {/* ──────────────────────────────────────────────────────────────── */}
          {/* PHASE: Configure Form                                           */}
          {/* ──────────────────────────────────────────────────────────────── */}
          {phase === "configure" && !plan && !generating && (
            <div className="max-w-3xl">

              {/* Mode Toggle */}
              <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-8 max-w-xs">
                <button
                  onClick={() => setPlannerMode("full")}
                  className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all ${plannerMode === "full" ? "bg-teal-400/10 text-teal-400 border border-teal-400/20" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Full Plan
                </button>
                <button
                  onClick={() => setPlannerMode("remix")}
                  className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all ${plannerMode === "remix" ? "bg-teal-400/10 text-teal-400 border border-teal-400/20" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Hook Remix
                </button>
              </div>

              {/* ── Full Plan Form ── */}
              {plannerMode === "full" && <>

              {/* Profile Detected Card */}
              {profileFields.filled.length > 0 && (
                <div className="rounded-2xl border border-teal-400/20 bg-teal-400/[0.04] p-5 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <p className="text-sm font-semibold text-teal-400">
                        Profile detected — {profileFields.filled.length} fields auto-filled
                      </p>
                    </div>
                    <a href="/dashboard/settings" className="text-xs text-gray-500 hover:text-teal-400 transition-colors">
                      Edit in Settings
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileFields.filled.map(f => (
                      <span key={f.key} className="px-2 py-0.5 text-xs rounded-md bg-teal-400/10 border border-teal-400/20 text-teal-400/80">
                        {f.label}
                      </span>
                    ))}
                  </div>
                  {profileFields.missing.length > 0 && (
                    <p className="text-xs text-gray-600 mt-2">
                      Missing: {profileFields.missing.map(f => f.label).join(", ")} —{" "}
                      <a href="/dashboard/settings" className="text-teal-400/60 hover:text-teal-400">add in settings</a>
                    </p>
                  )}
                </div>
              )}

              {/* Command Bar */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="p-5 md:p-6 space-y-5">

                  {/* Month Strip */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Month</p>
                    <div className="flex gap-2 flex-wrap">
                      {months.map(m => (
                        <button
                          key={m.value}
                          onClick={() => updateFormField("month", m.value)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                            formData.month === m.value
                              ? "border-teal-400/40 bg-teal-400/[0.08] text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.08)]"
                              : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:border-white/[0.12] hover:text-gray-300"
                          }`}
                        >
                          <span className="text-sm font-semibold">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frequency Strip */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Frequency</p>
                    <div className="flex gap-3 flex-wrap">
                      {FREQUENCY_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => updateFormField("postsPerWeek", opt.value)}
                          className={`flex items-center gap-2.5 px-5 py-3.5 rounded-xl border transition-all duration-200 ${
                            formData.postsPerWeek === opt.value
                              ? "border-teal-400/40 bg-teal-400/[0.08] text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.08)]"
                              : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:border-white/[0.12] hover:text-gray-300"
                          }`}
                        >
                          <span className="text-sm font-semibold">{opt.label}</span>
                          <span className={`text-xs font-mono ${formData.postsPerWeek === opt.value ? "text-teal-400/60" : "text-gray-600"}`}>
                            {opt.posts}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal Strip */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Goal</p>
                    <div className="flex flex-wrap gap-2">
                      {GOAL_OPTIONS.map(goal => (
                        <button
                          key={goal}
                          onClick={() => updateFormField("goals", goal)}
                          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                            formData.goals === goal
                              ? "border-teal-400/40 bg-teal-400/[0.08] text-teal-400"
                              : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:border-white/[0.12] hover:text-gray-300"
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="flex items-center justify-between px-5 md:px-6 py-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    {/* Quality Mode Toggle */}
                    <div className="flex items-center gap-1">
                      {QUALITY_MODE_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => updateFormField("qualityMode", opt.value)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                            formData.qualityMode === opt.value
                              ? "bg-white/[0.1] text-white"
                              : "text-gray-600 hover:text-gray-400"
                          }`}
                        >
                          {opt.label} <span className="text-gray-600 ml-0.5 font-mono">{opt.tokenCost}</span>
                        </button>
                      ))}
                    </div>
                    <div className="w-px h-4 bg-white/[0.08]" />
                    <button
                      onClick={() => setShowCustomize(!showCustomize)}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
                    >
                      Customize
                      <svg className={`w-3 h-3 transition-transform ${showCustomize ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={handleResearch}
                    disabled={phase !== "configure"}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-40"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    Research &amp; Generate <span className="text-black/50 font-mono text-xs">{selectedQualityCost + 3}</span>
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
              )}

              {/* Customize Panel */}
              {showCustomize && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 md:p-6 mt-4">
                  <AccordionSection title="Niche & Audience" defaultOpen={!formData.industry || !formData.targetAudience}>
                    <div>
                      <label htmlFor="industry-select" className="block text-sm text-gray-400 mb-2">Industry</label>
                      <select
                        id="industry-select"
                        value={formData.industry}
                        onChange={(e) => updateFormField("industry", e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all appearance-none"
                      >
                        <option value="">Select your industry</option>
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Business description <span className="text-gray-600">(optional)</span></label>
                      <textarea
                        placeholder="e.g. We're a boutique architecture firm specialising in sustainable residential design..."
                        value={formData.businessDescription}
                        onChange={(e) => updateFormField("businessDescription", e.target.value)}
                        rows={3}
                        maxLength={300}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Target audience</label>
                      <textarea
                        placeholder="e.g. Homeowners aged 30-50 looking for kitchen renovations in London"
                        value={formData.targetAudience}
                        onChange={(e) => updateFormField("targetAudience", e.target.value)}
                        rows={3}
                        maxLength={300}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Audience size</label>
                      <div className="grid grid-cols-2 gap-2">
                        {AUDIENCE_SIZE_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => updateFormField("audienceSize", opt.value)}
                            className={`text-left p-3 rounded-xl border transition-all ${formData.audienceSize === opt.value
                                ? "border-teal-400/50 bg-teal-400/10"
                                : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                              }`}
                          >
                            <p className={`text-sm font-semibold ${formData.audienceSize === opt.value ? "text-teal-400" : "text-white"}`}>{opt.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Desired outcomes <span className="text-gray-600">(optional)</span></label>
                      <textarea
                        placeholder="e.g. Get 50 new enquiries per month, build a recognisable brand in my city"
                        value={formData.desiredOutcomes}
                        onChange={(e) => updateFormField("desiredOutcomes", e.target.value)}
                        rows={2}
                        maxLength={300}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                      />
                    </div>
                  </AccordionSection>

                  <AccordionSection title="Content Mix" defaultOpen={formData.contentPillars.length < 2}>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Content pillars (pick 2-5)
                        <span className="text-gray-600 ml-2">{formData.contentPillars.length}/5</span>
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {PILLAR_SUGGESTIONS.map((pillar) => (
                          <button
                            key={pillar}
                            onClick={() => togglePillar(pillar)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${formData.contentPillars.includes(pillar)
                                ? "bg-teal-400 text-black"
                                : "bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:border-teal-400/50 hover:text-gray-300"
                              }`}
                          >
                            {pillar}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add custom pillar"
                          value={pillarInput}
                          onChange={(e) => setPillarInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addCustomPillar()}
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                        />
                        <button onClick={addCustomPillar} className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white transition-all text-sm">
                          Add
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Formats</label>
                      <div className="space-y-2">
                        {FORMAT_OPTIONS.map((fmt) => (
                          <button
                            key={fmt.value}
                            onClick={() => toggleFormat(fmt.value)}
                            role="checkbox"
                            aria-checked={formData.enabledFormats.includes(fmt.value)}
                            className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border transition-all ${formData.enabledFormats.includes(fmt.value)
                                ? "border-teal-400/40 bg-teal-400/[0.06]"
                                : "border-white/[0.06] bg-white/[0.01] opacity-50"
                              }`}
                          >
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${formData.enabledFormats.includes(fmt.value) ? "border-teal-400 bg-teal-400" : "border-gray-600"}`}>
                              {formData.enabledFormats.includes(fmt.value) && (
                                <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                              )}
                            </div>
                            <FormatIcon format={fmt.value} className="w-4 h-4 text-gray-400 shrink-0" />
                            <div>
                              <p className={`text-sm font-medium ${formData.enabledFormats.includes(fmt.value) ? "text-white" : "text-gray-500"}`}>{fmt.label}</p>
                              <p className="text-xs text-gray-600">{fmt.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </AccordionSection>

                  <AccordionSection title="Advanced Brief">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Core offer</label>
                      <input
                        type="text"
                        value={formData.brief.coreOffer}
                        onChange={(e) => updateBriefField("coreOffer", e.target.value)}
                        placeholder="What you sell or provide"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Primary CTA</label>
                      <input
                        type="text"
                        value={formData.brief.primaryCTA}
                        onChange={(e) => updateBriefField("primaryCTA", e.target.value)}
                        placeholder='e.g. DM "START" to get a free audit'
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Differentiator</label>
                      <textarea
                        value={formData.brief.differentiator}
                        onChange={(e) => updateBriefField("differentiator", e.target.value)}
                        placeholder="What makes you different from competitors"
                        rows={2}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Proof points (one per line)</label>
                        <textarea
                          value={toMultiLineText(formData.brief.proofPoints)}
                          onChange={(e) => updateBriefField("proofPoints", fromMultiLineText(e.target.value))}
                          rows={3}
                          placeholder="Client results, stats, testimonials"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Forbidden topics (one per line)</label>
                        <textarea
                          value={toMultiLineText(formData.brief.forbiddenTopics)}
                          onChange={(e) => updateBriefField("forbiddenTopics", fromMultiLineText(e.target.value))}
                          rows={3}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Compliance constraints</label>
                      <textarea
                        value={formData.brief.complianceConstraints}
                        onChange={(e) => updateBriefField("complianceConstraints", e.target.value)}
                        rows={2}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Top objections <span className="text-gray-600">(optional)</span></label>
                        <textarea
                          value={toMultiLineText(formData.brief.topObjections)}
                          onChange={(e) => updateBriefField("topObjections", fromMultiLineText(e.target.value))}
                          rows={2}
                          placeholder="One per line"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Priority products <span className="text-gray-600">(optional)</span></label>
                        <textarea
                          value={toMultiLineText(formData.brief.priorityProducts)}
                          onChange={(e) => updateBriefField("priorityProducts", fromMultiLineText(e.target.value))}
                          rows={2}
                          placeholder="One per line"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Seasonal context <span className="text-gray-600">(optional)</span></label>
                        <textarea
                          value={formData.brief.seasonalContext}
                          onChange={(e) => updateBriefField("seasonalContext", e.target.value)}
                          rows={2}
                          placeholder="Any seasonal relevance"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Competitor angles to avoid <span className="text-gray-600">(optional)</span></label>
                        <textarea
                          value={toMultiLineText(formData.brief.competitorAnglesToAvoid)}
                          onChange={(e) => updateBriefField("competitorAnglesToAvoid", fromMultiLineText(e.target.value))}
                          rows={2}
                          placeholder="One per line"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </AccordionSection>
                </div>
              )}
              </>}

              {/* ── Hook Remix Form ── */}
              {plannerMode === "remix" && (
                <div className="space-y-6">

                  {/* Step 1: Find top reels */}
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                    <h2 className="text-lg font-bold text-white mb-1">Find Top Reels</h2>
                    <p className="text-sm text-gray-500 mb-6">Enter hashtags to discover the highest-performing content in your niche. We&apos;ll pull the proven hooks for you to remix.</p>

                    <div className="mb-5">
                      <label className="block text-sm text-gray-400 mb-2">Hashtags <span className="text-gray-600">(up to 3)</span></label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={remixForm.hashtagInput}
                          onChange={(e) => setRemixForm((prev) => ({ ...prev, hashtagInput: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRemixHashtag() } }}
                          placeholder="aiautomation"
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                        />
                        <button
                          onClick={addRemixHashtag}
                          disabled={!remixForm.hashtagInput.trim() || remixForm.hashtags.length >= 3}
                          className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-gray-300 hover:border-teal-400/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          Add
                        </button>
                      </div>
                      {remixForm.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {remixForm.hashtags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 text-sm">
                              #{tag}
                              <button onClick={() => removeRemixHashtag(tag)} className="text-teal-400/60 hover:text-teal-400 transition-colors ml-0.5">×</button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleHookSearch}
                      disabled={remixForm.hashtags.length === 0 || remixSearching}
                      className="w-full py-4 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3"
                    >
                      {remixSearching ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Searching Instagram...
                        </>
                      ) : (
                        <>Find Top Reels <span className="text-black/60 text-sm">(3 tokens)</span></>
                      )}
                    </button>
                  </div>

                  {/* Search results */}
                  {searchResults.length > 0 && (
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h2 className="text-lg font-bold text-white">Top Performing Reels</h2>
                          <p className="text-sm text-gray-500 mt-0.5">Select the hooks you want to remix</p>
                        </div>
                        <span className="text-xs text-gray-500 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-lg">
                          {remixForm.selectedHooks.length} selected
                        </span>
                      </div>
                      <div className="space-y-3">
                        {searchResults.map((reel, i) => {
                          const selected = remixForm.selectedHooks.includes(reel.hook)
                          return (
                            <button
                              key={i}
                              onClick={() => toggleSelectedHook(reel.hook)}
                              className={`w-full text-left p-4 rounded-xl border transition-all ${selected ? "bg-teal-400/8 border-teal-400/30" : "bg-white/[0.02] border-white/[0.06] hover:border-white/20"}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${selected ? "bg-teal-400 border-teal-400" : "border-white/20"}`}>
                                  {selected && (
                                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium leading-snug ${selected ? "text-teal-300" : "text-gray-200"}`}>
                                    &ldquo;{reel.hook}&rdquo;
                                  </p>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-xs text-gray-500">@{reel.username}</span>
                                    {reel.viewCount > 0 && (
                                      <span className="text-xs text-gray-500">
                                        {reel.viewCount >= 1_000_000
                                          ? `${(reel.viewCount / 1_000_000).toFixed(1)}M views`
                                          : reel.viewCount >= 1_000
                                            ? `${(reel.viewCount / 1_000).toFixed(0)}K views`
                                            : `${reel.viewCount} views`}
                                      </span>
                                    )}
                                    {reel.likesCount > 0 && (
                                      <span className="text-xs text-gray-500">
                                        {reel.likesCount >= 1_000 ? `${(reel.likesCount / 1_000).toFixed(0)}K likes` : `${reel.likesCount} likes`}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Configure */}
                  {remixForm.selectedHooks.length > 0 && (
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                      <h2 className="text-lg font-bold text-white mb-1">Configure Your Remix</h2>
                      <p className="text-sm text-gray-500 mb-6">The AI will build original body copy and CTAs around the hooks you selected.</p>

                      <div className="space-y-6">
                        {/* Topics */}
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Topics <span className="text-gray-600">(optional — AI picks best per hook, up to 5)</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={remixForm.topicInput}
                              onChange={(e) => setRemixForm((prev) => ({ ...prev, topicInput: e.target.value }))}
                              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRemixTopic() } }}
                              placeholder="e.g. invoicing automation, lead handling"
                              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                            />
                            <button
                              onClick={addRemixTopic}
                              disabled={!remixForm.topicInput.trim() || remixForm.topics.length >= 5}
                              className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-gray-300 hover:border-teal-400/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                            >
                              Add
                            </button>
                          </div>
                          {remixForm.topics.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {remixForm.topics.map((t) => (
                                <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-gray-300 text-sm">
                                  {t}
                                  <button onClick={() => removeRemixTopic(t)} className="text-gray-500 hover:text-gray-300 transition-colors ml-0.5">×</button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Format */}
                        <div>
                          <label className="block text-sm text-gray-400 mb-3">Format</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {FORMAT_OPTIONS.map((f) => (
                              <button
                                key={f.value}
                                onClick={() => setRemixForm((prev) => ({ ...prev, format: f.value }))}
                                className={`p-3 rounded-xl border text-left transition-all ${remixForm.format === f.value ? "bg-teal-400/10 border-teal-400/30 text-teal-400" : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:border-white/20 hover:text-gray-300"}`}
                              >
                                <div className="flex items-center gap-2">
                                  <FormatIcon format={f.value} className="w-3.5 h-3.5" />
                                  <span className="text-xs font-medium">{f.label}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* CTA Type */}
                        <div>
                          <label className="block text-sm text-gray-400 mb-3">CTA Type</label>
                          <div className="grid grid-cols-3 gap-2">
                            {(["soft", "mid", "hard"] as CTAType[]).map((type) => (
                              <button
                                key={type}
                                onClick={() => setRemixForm((prev) => ({ ...prev, ctaType: type }))}
                                className={`py-3 px-2 rounded-xl border text-center transition-all ${remixForm.ctaType === type ? "bg-teal-400/10 border-teal-400/30 text-teal-400" : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:border-white/20 hover:text-gray-300"}`}
                              >
                                <p className="text-sm font-semibold capitalize">{type}</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  {type === "soft" ? "Save / Follow" : type === "mid" ? "DM / Comment" : "Book / Apply"}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleRemixGenerate}
                          disabled={remixGenerating}
                          className="w-full py-4 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3"
                        >
                          {remixGenerating ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Writing post briefs...
                            </>
                          ) : (
                            <>Generate {remixForm.selectedHooks.length} Post Brief{remixForm.selectedHooks.length !== 1 ? "s" : ""} <span className="text-black/60 text-sm">(10 tokens)</span></>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Remix error */}
                  {remixError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{remixError}</div>
                  )}

                  {/* Remix Results */}
                  {remixResults.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{remixResults.length} Post Brief{remixResults.length !== 1 ? "s" : ""}</h2>
                        <button
                          onClick={() => { setRemixResults([]); setSearchResults([]); setRemixForm((prev) => ({ ...prev, selectedHooks: [] })) }}
                          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          Start over
                        </button>
                      </div>
                      {remixResults.map((post, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                          {/* Hook */}
                          <div className="mb-5 pb-5 border-b border-white/[0.06]">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Hook (locked)</p>
                            <p className="text-teal-300 font-semibold leading-snug">&ldquo;{post.hook}&rdquo;</p>
                          </div>

                          <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-5">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Title</p>
                              <p className="text-white text-sm">{post.title}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Topic Used</p>
                              <p className="text-gray-300 text-sm">{post.topicUsed}</p>
                            </div>
                          </div>

                          <div className="mb-5">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Body Copy</p>
                            <p className="text-gray-300 text-sm leading-relaxed">{post.body}</p>
                          </div>

                          <div className="mb-5">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">CTA</p>
                            <p className="text-white text-sm font-medium">{post.cta}</p>
                          </div>

                          <div className="mb-5">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Posting Tip</p>
                            <p className="text-gray-400 text-sm">{post.postingTip}</p>
                          </div>

                          <div className="mb-5">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Hashtags</p>
                            <div className="flex flex-wrap gap-1.5">
                              {post.hashtags.map((h) => (
                                <span key={h} className="px-2 py-0.5 rounded-md text-xs bg-white/[0.04] border border-white/[0.08] text-gray-400">#{h}</span>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => handleCopyRemixPost(post, i)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${remixCopied === i ? "bg-teal-400/20 text-teal-400 border border-teal-400/30" : "bg-white/[0.06] text-gray-300 border border-white/[0.08] hover:border-teal-400/30 hover:text-teal-400"}`}
                          >
                            {remixCopied === i ? (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                Copied!
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                </svg>
                                Copy Brief
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* PHASE 1b: Researching (searching for hooks)                     */}
          {/* ──────────────────────────────────────────────────────────────── */}
          {phase === "researching" && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center px-8 py-16">
                <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-lg mb-2">Searching for proven hooks</p>
                <p className="text-gray-500 text-sm animate-pulse">Scanning top-performing content in your niche&hellip;</p>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* PHASE 1c: Review research results                               */}
          {/* ──────────────────────────────────────────────────────────────── */}
          {phase === "review" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-base">
                        {researchHooks.length > 0
                          ? `${researchHooks.length} proven hooks found`
                          : "No hooks found"}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {researchHooks.length > 0
                          ? "Select which hooks to weave into your content plan"
                          : researchError || "Try different content pillars, or generate without research"}
                      </p>
                    </div>
                    {researchHooks.length > 0 && (
                      <button
                        onClick={() => {
                          if (selectedResearchHooks.length === researchHooks.length) {
                            setSelectedResearchHooks([])
                          } else {
                            setSelectedResearchHooks(researchHooks.map((r) => r.hook))
                          }
                        }}
                        className="text-xs text-teal-400 hover:text-teal-300 transition-colors whitespace-nowrap"
                      >
                        {selectedResearchHooks.length === researchHooks.length ? "Deselect all" : "Select all"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Hook list */}
                {researchHooks.length > 0 && (
                  <div className="divide-y divide-white/[0.04] max-h-[420px] overflow-y-auto">
                    {researchHooks.map((reel, i) => {
                      const selected = selectedResearchHooks.includes(reel.hook)
                      return (
                        <button
                          key={i}
                          onClick={() => toggleResearchHook(reel.hook)}
                          className={`w-full text-left p-4 transition-colors ${
                            selected ? "bg-teal-400/[0.06]" : "hover:bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                                selected
                                  ? "bg-teal-400 border-teal-400"
                                  : "border-white/20 bg-transparent"
                              }`}
                            >
                              {selected && (
                                <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm leading-snug ${selected ? "text-white" : "text-gray-300"}`}>
                                &ldquo;{reel.hook}&rdquo;
                              </p>
                              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                                {reel.viewCount > 0 && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {formatViewCount(reel.viewCount)}
                                  </span>
                                )}
                                {reel.likesCount > 0 && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {formatViewCount(reel.likesCount)}
                                  </span>
                                )}
                                {reel.username && (
                                  <span className="text-gray-600">@{reel.username}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleGenerate([])}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Skip research
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setPhase("configure")
                      setResearchHooks([])
                      setSelectedResearchHooks([])
                    }}
                    className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleGenerate()}
                    className="px-6 py-2.5 rounded-xl bg-teal-400 text-black font-semibold text-sm hover:bg-teal-300 transition-colors flex items-center gap-2"
                  >
                    Generate Plan
                    <span className="text-black/60 text-xs tabular-nums">{selectedQualityCost}</span>
                  </button>
                </div>
              </div>

              {/* Selected count */}
              {researchHooks.length > 0 && (
                <p className="text-center text-xs text-gray-600">
                  {selectedResearchHooks.length} of {researchHooks.length} hooks selected
                </p>
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* PHASE 2: Loading                                                */}
          {/* ──────────────────────────────────────────────────────────────── */}
          {generating && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center px-8 py-16">
                <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-lg mb-2">Planning your content</p>
                <p className="text-gray-500 text-sm animate-pulse">{LOADING_MESSAGES[loadingStep]}</p>
                <p className="text-gray-600 text-xs mt-3 font-mono tabular-nums">
                  {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")} <span className="text-gray-700">/ ~3-4 min</span>
                </p>
                {elapsedSeconds > 180 && (
                  <p className="text-amber-400/80 text-xs mt-2">Taking longer than usual — the AI may be under heavy load.</p>
                )}
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* PHASE 3: Results                                                */}
          {/* ──────────────────────────────────────────────────────────────── */}
          {plan && !generating && (
            <div className="space-y-6">
              {/* Month Theme Banner */}
              <div className="relative overflow-hidden rounded-2xl border border-teal-400/20 bg-gradient-to-r from-teal-400/[0.08] to-transparent p-6 md:p-8">
                <div className="relative z-10">
                  <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
                    {getMonthLabel(plan.month)} Theme
                  </p>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{plan.monthTheme}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{plan.monthThemeDescription}</p>
                </div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Posts</p>
                  <p className="text-2xl font-bold text-white">{plan.posts.length}</p>
                  <p className="text-xs text-gray-600">{plan.postsPerWeek}x per week</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <p className="text-xs text-gray-500 font-medium mb-2">Funnel Split</p>
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-blue-400 rounded-l-full" style={{ width: `${plan.funnelBreakdown.tofu}%` }} />
                    <div className="bg-amber-400" style={{ width: `${plan.funnelBreakdown.mofu}%` }} />
                    <div className="bg-teal-400 rounded-r-full" style={{ width: `${plan.funnelBreakdown.bofu}%` }} />
                  </div>
                  <div className="flex gap-3 text-[10px]">
                    <span className="text-blue-400">{plan.funnelBreakdown.tofu}% Top</span>
                    <span className="text-amber-400">{plan.funnelBreakdown.mofu}% Mid</span>
                    <span className="text-teal-400">{plan.funnelBreakdown.bofu}% Bot</span>
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <p className="text-xs text-gray-500 font-medium mb-1">Content Pillars</p>
                  <p className="text-2xl font-bold text-white">{pillars.length}</p>
                  <p className="text-xs text-gray-600 truncate">{pillars.join(", ")}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <p className="text-xs text-gray-500 font-medium mb-1">Formats</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {uniqueFormats.map((f) => (
                      <span key={f} className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                        <FormatIcon format={f} className="w-3 h-3" />
                        {plan.posts.filter((p) => p.format === f).length}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Frequency Rationale */}
              {plan.frequencyRationale && (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex items-start gap-3">
                  <svg className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <p className="text-sm text-gray-400 leading-relaxed">{plan.frequencyRationale}</p>
                </div>
              )}

              {/* Filter Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                  {(["all", "TOFU", "MOFU", "BOFU"] as const).map((stage) => (
                    <button
                      key={stage}
                      onClick={() => setFilterStage(stage)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterStage === stage
                          ? stage === "all"
                            ? "bg-white/10 text-white"
                            : `${FUNNEL_COLORS[stage].bg} ${FUNNEL_COLORS[stage].text}`
                          : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                      {stage === "all" ? "All" : stage}
                    </button>
                  ))}
                </div>

                <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                  <button
                    onClick={() => setFilterFormat("all")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterFormat === "all" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                      }`}
                  >
                    All
                  </button>
                  {uniqueFormats.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterFormat(f)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all inline-flex items-center gap-1 ${filterFormat === f ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                      <FormatIcon format={f} className="w-3 h-3" />
                      {f}
                    </button>
                  ))}
                </div>

                {pillars.length > 1 && (
                  <select
                    aria-label="Filter by pillar"
                    value={filterPillar}
                    onChange={(e) => setFilterPillar(e.target.value)}
                    className="px-3 py-2 text-xs font-medium rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-400 focus:outline-none focus:border-teal-400/50 appearance-none cursor-pointer"
                  >
                    <option value="all">All Pillars</option>
                    {pillars.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                )}

                <div className="flex-1" />

                <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                  <button
                    onClick={() => setActiveView("calendar")}
                    className={`p-1.5 rounded-md transition-all ${activeView === "calendar" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
                    title="Calendar view"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveView("list")}
                    className={`p-1.5 rounded-md transition-all ${activeView === "list" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
                    title="List view"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Empty filter state */}
              {filteredPosts.length === 0 && plan.posts.length > 0 && (
                <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
                  <p className="text-gray-500 font-medium mb-2">No posts match your filters</p>
                  <button
                    onClick={() => { setFilterStage("all"); setFilterFormat("all"); setFilterPillar("all") }}
                    className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Calendar View */}
              {activeView === "calendar" && filteredPosts.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-7 border-b border-white/[0.06]">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {calendarCells.map((cell, i) => (
                      <div
                        key={cell.dateStr ?? `empty-${i}`}
                        className={`min-h-[100px] md:min-h-[120px] border-b border-r border-white/[0.04] p-1.5 md:p-2 ${!cell.isCurrentMonth ? "bg-white/[0.01]" : ""
                          }`}
                      >
                        {cell.isCurrentMonth && (
                          <>
                            <span className={`text-xs font-medium ${cell.post ? "text-gray-400" : "text-gray-600"}`}>
                              {cell.date}
                            </span>
                            {cell.post && (
                              <button
                                onClick={() => setSelectedPost(cell.post)}
                                className={`w-full mt-1 p-1.5 md:p-2 rounded-lg border text-left transition-all hover:scale-[1.02] ${FUNNEL_COLORS[cell.post.funnel_stage].bg
                                  } ${FUNNEL_COLORS[cell.post.funnel_stage].border}`}
                              >
                                <p className="text-[11px] md:text-xs font-semibold text-white leading-tight line-clamp-2 mb-1">
                                  {cell.post.title}
                                </p>
                                <div className="flex items-center gap-1.5">
                                  <FormatIcon format={cell.post.format} className="w-3 h-3 text-gray-400" />
                                  <span className={`w-1.5 h-1.5 rounded-full ${FUNNEL_COLORS[cell.post.funnel_stage].dot}`} />
                                </div>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* List View */}
              {activeView === "list" && filteredPosts.length > 0 && (
                <div className="space-y-3">
                  {sortedFilteredPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="w-full text-left bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 md:p-5 hover:border-white/15 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-14 text-center">
                          <p className="text-xs text-gray-500">{post.dayOfWeek.slice(0, 3)}</p>
                          <p className="text-xl font-bold text-white">{parseInt(post.date.split("-")[2], 10)}</p>
                          <p className="text-[10px] text-gray-600">{post.posting_time}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">
                              {post.title}
                            </h3>
                            <FunnelBadge stage={post.funnel_stage} size="xs" />
                            <FormatBadge format={post.format} />
                          </div>
                          <p className="text-xs text-gray-500 mb-1 line-clamp-1">{post.description}</p>
                          {post.why_it_works && (
                            <p className="text-[11px] text-teal-400/60 line-clamp-1">
                              <span className="text-teal-400/80 font-medium">Why:</span> {post.why_it_works}
                            </p>
                          )}
                        </div>
                        <span className="hidden md:block shrink-0 text-[11px] text-gray-600 font-medium px-2 py-1 bg-white/[0.03] rounded-md">
                          {post.pillar}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Export Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-300 hover:text-white hover:border-white/20 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download CSV
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-300 hover:text-white hover:border-white/20 transition-all"
                >
                  {copiedToClipboard ? (
                    <>
                      <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                      </svg>
                      Copy to Clipboard
                    </>
                  )}
                </button>
                <div className="flex-1" />
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-gray-500 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                  </svg>
                  New Plan
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
              )}
            </div>
          )}
      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Post Detail Panel                                                   */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      {selectedPost && (
        <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="post-detail-title" onClick={() => setSelectedPost(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg bg-[#111111] border-l border-white/10 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">
                  {selectedPost.dayOfWeek}, {selectedPost.date} &middot; {selectedPost.posting_time}
                </p>
                <button autoFocus onClick={() => setSelectedPost(null)} className="p-1 text-gray-500 hover:text-white transition-colors" aria-label="Close post details">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <h2 id="post-detail-title" className="text-xl font-bold text-white">{selectedPost.title}</h2>

              <div className="flex flex-wrap gap-2">
                <FunnelBadge stage={selectedPost.funnel_stage} />
                <FormatBadge format={selectedPost.format} />
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.06] border border-white/[0.08] text-gray-400">
                  {selectedPost.pillar}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">Concept</p>
                <p className="text-sm text-gray-300 leading-relaxed">{selectedPost.description}</p>
              </div>

              {/* Why It Works */}
              {selectedPost.why_it_works && (
                <div className="bg-teal-400/[0.06] border border-teal-400/15 rounded-xl p-4">
                  <p className="text-xs text-teal-400 font-medium mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                    Why This Works
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedPost.why_it_works}</p>
                </div>
              )}

              {/* Engagement Tip */}
              {selectedPost.engagement_tip && (
                <div className="bg-amber-400/[0.06] border border-amber-400/15 rounded-xl p-4">
                  <p className="text-xs text-amber-400 font-medium mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    Engagement Tip
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedPost.engagement_tip}</p>
                </div>
              )}

              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">Caption Hook</p>
                <p className="text-sm text-white font-medium italic leading-relaxed">&ldquo;{selectedPost.caption_hook}&rdquo;</p>
              </div>

              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Best Time</p>
                  <p className="text-sm text-white font-semibold">{selectedPost.posting_time}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Format</p>
                  <p className="text-sm text-white font-semibold">{selectedPost.format}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Stage</p>
                  <p className="text-sm text-white font-semibold">{FUNNEL_LABELS[selectedPost.funnel_stage]}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">Hashtags</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPost.hashtags.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs text-gray-400 bg-white/[0.04] border border-white/[0.06] rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleRegeneratePost(selectedPost)}
                disabled={regeneratingPostId === selectedPost.id}
                className="w-full py-3 rounded-xl text-sm font-semibold border border-white/[0.12] text-gray-300 hover:text-white hover:border-white/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {regeneratingPostId === selectedPost.id ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Regenerating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                    </svg>
                    Regenerate This Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
