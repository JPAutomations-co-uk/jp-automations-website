"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

// ─── Types ───────────────────────────────────────────────────────────────────

type PostingFrequency = 3 | 5
type FunnelStage = "TOFU" | "MOFU" | "BOFU"
type AudienceSize = "0-1K" | "1K-10K" | "10K-50K" | "50K+"

interface PlannedPost {
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
  why_it_works?: string
  engagement_tip?: string
  goal_alignment?: string
  primary_kpi?: string
}

interface ContentPlan {
  month: string
  monthTheme: string
  monthThemeDescription: string
  postsPerWeek: PostingFrequency
  frequencyRationale: string
  funnelBreakdown: { tofu: number; mofu: number; bofu: number }
  posts: PlannedPost[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GOAL_OPTIONS = [
  "Lead Generation",
  "Brand Awareness",
  "Thought Leadership",
  "Sales & Conversions",
  "Community Building",
]

const FORMAT_OPTIONS = [
  { value: "Text Post", label: "Text Post", desc: "Personal, direct, conversational" },
  { value: "Image Post", label: "Image Post", desc: "Single image with caption" },
  { value: "Carousel", label: "Carousel", desc: "Multi-image educational posts" },
  { value: "Long-form Post", label: "Long-form", desc: "Deep dives and detailed stories" },
  { value: "Poll", label: "Poll", desc: "Questions that drive engagement" },
]

const PILLAR_SUGGESTIONS = [
  "Thought leadership",
  "Client results",
  "Behind the scenes",
  "Tips & education",
  "Industry trends",
  "Personal stories",
  "Case studies",
  "Business lessons",
  "Tool recommendations",
  "Q&A / Myth busting",
]

const AUDIENCE_SIZE_OPTIONS: { value: AudienceSize; label: string; description: string }[] = [
  { value: "0-1K", label: "Building", description: "0–1K connections" },
  { value: "1K-10K", label: "Growing", description: "1K–10K connections" },
  { value: "10K-50K", label: "Established", description: "10K–50K connections" },
  { value: "50K+", label: "Large", description: "50K+ connections" },
]

const FUNNEL_COLOURS: Record<FunnelStage, string> = {
  TOFU: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  MOFU: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  BOFU: "bg-teal-400/10 text-teal-400 border-teal-400/20",
}

const FORMAT_ICONS: Record<string, string> = {
  "Text Post": "✎",
  "Image Post": "◻",
  "Carousel": "⊞",
  "Long-form Post": "≡",
  "Poll": "◎",
}

const LOADING_MESSAGES = [
  "Analysing your business goals...",
  "Building your content calendar...",
  "Crafting hooks and descriptions...",
  "Optimising funnel distribution...",
  "Finalising your LinkedIn strategy...",
]

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LinkedInPlannerPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  // Form state
  const [industry, setIndustry] = useState("")
  const [businessDescription, setBusinessDescription] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [audienceSize, setAudienceSize] = useState<AudienceSize>("1K-10K")
  const [goals, setGoals] = useState("Lead Generation")
  const [desiredOutcomes, setDesiredOutcomes] = useState("")
  const [postsPerWeek, setPostsPerWeek] = useState<PostingFrequency>(3)
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["Text Post", "Image Post", "Carousel"])
  const [pillars, setPillars] = useState<string[]>(["Thought leadership", "Client results", "Tips & education"])
  const [customPillar, setCustomPillar] = useState("")

  // Generation state
  const [generating, setGenerating] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [error, setError] = useState("")

  // Results
  const [plan, setPlan] = useState<ContentPlan | null>(null)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [copiedPost, setCopiedPost] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mountedRef = useRef(true)

  const TOKEN_COST = 25

  const toggleFormat = (fmt: string) => {
    setSelectedFormats((prev) =>
      prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]
    )
  }

  const togglePillar = (p: string) => {
    setPillars((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])
  }

  const addCustomPillar = () => {
    const trimmed = customPillar.trim()
    if (trimmed && !pillars.includes(trimmed) && pillars.length < 8) {
      setPillars((prev) => [...prev, trimmed])
      setCustomPillar("")
    }
  }

  const canGenerate = industry.trim().length > 0 && targetAudience.trim().length > 0 && selectedFormats.length > 0

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return

    if (!user) {
      router.push("/login?redirect=/dashboard/linkedin/planner")
      return
    }

    if (tokenBalance < TOKEN_COST) {
      setError(`Insufficient tokens. You need ${TOKEN_COST} tokens but have ${tokenBalance}.`)
      return
    }

    setGenerating(true)
    setError("")
    setPlan(null)
    setExpandedPost(null)
    setLoadingStep(0)
    setElapsedSeconds(0)

    loadingIntervalRef.current = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 4000)

    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 180_000)

    try {
      const res = await fetch("/api/generate/linkedin-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          month,
          postsPerWeek,
          industry: industry.trim(),
          businessDescription: businessDescription.trim(),
          targetAudience: targetAudience.trim(),
          audienceSize,
          goals,
          desiredOutcomes: desiredOutcomes.trim(),
          contentPillars: pillars,
          enabledFormats: selectedFormats,
        }),
      })

      if (!mountedRef.current) return
      const data = await res.json()
      if (!mountedRef.current) return

      if (!res.ok) {
        setError(data.error || "Generation failed. Please try again.")
        return
      }

      setPlan(data.plan as ContentPlan)
      refreshBalance()
    } catch (err) {
      if (mountedRef.current) {
        const isTimeout = err instanceof DOMException && err.name === "AbortError"
        setError(isTimeout ? "Generation timed out. Please try again." : "Something went wrong. Please try again.")
      }
    } finally {
      clearTimeout(timeoutId)
      if (loadingIntervalRef.current) { clearInterval(loadingIntervalRef.current); loadingIntervalRef.current = null }
      if (timerIntervalRef.current) { clearInterval(timerIntervalRef.current); timerIntervalRef.current = null }
      if (mountedRef.current) setGenerating(false)
    }
  }, [canGenerate, user, tokenBalance, router, month, postsPerWeek, industry, businessDescription, targetAudience, audienceSize, goals, desiredOutcomes, pillars, selectedFormats, refreshBalance])

  const handleCopyPost = useCallback(async (post: PlannedPost) => {
    const text = `${post.caption_hook}\n\n${post.description}\n\n${post.hashtags.map(h => `#${h}`).join(" ")}`
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPost(post.id)
      setTimeout(() => { if (mountedRef.current) setCopiedPost(null) }, 2000)
    } catch {
      setError("Failed to copy to clipboard.")
    }
  }, [])

  const formatMonthDisplay = (m: string) => {
    const [y, mo] = m.split("-").map(Number)
    return new Date(y, mo - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="relative z-50">
            <img src="/logo.png" alt="JP Automations" className="h-16 md:h-20 w-auto hover:opacity-80 transition-opacity" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Home</a>
            <a href="/blog" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Blog</a>
            <AppsDropdown />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-lg">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                  </svg>
                  <span className="text-sm font-semibold text-teal-400">{tokenBalance}</span>
                  <span className="text-xs text-gray-500">tokens</span>
                </div>
                <UserMenu />
              </>
            ) : (
              <a href="/login?redirect=/dashboard/linkedin/planner" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all hover:scale-105">Sign In</a>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden relative z-50 p-2 text-white focus:outline-none">
            <div className="w-8 h-6 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <a href="/" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <AppsMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          <a href="/dashboard/linkedin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors mb-8 group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Write
          </a>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">LinkedIn Content Engine</span>
            </div>

            <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6 max-w-sm">
              <a href="/dashboard/linkedin" className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Write</a>
              <span className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">Plan</span>
              <a href="/dashboard/linkedin/images" className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Images</a>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Content Planner</h1>
            <p className="text-gray-500">Generate a full month of LinkedIn content, strategically mapped to your goals.</p>
          </div>

          {/* Loading */}
          {generating && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center px-8 py-16">
                <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-lg mb-2">Building your LinkedIn content plan</p>
                <p className="text-gray-500 text-sm animate-pulse">{LOADING_MESSAGES[loadingStep]}</p>
                <p className="text-gray-600 text-xs mt-3 font-mono tabular-nums">
                  {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")}
                  <span className="text-gray-700"> / ~30–60 sec</span>
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          {plan && !generating && (
            <div className="space-y-8">
              {/* Plan Header */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{formatMonthDisplay(plan.month)}</p>
                    <h2 className="text-2xl font-bold text-white">{plan.monthTheme}</h2>
                    <p className="text-gray-400 text-sm mt-2 max-w-xl leading-relaxed">{plan.monthThemeDescription}</p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <div className="text-center px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                      <p className="text-2xl font-bold text-teal-400">{plan.posts?.length || 0}</p>
                      <p className="text-xs text-gray-500 mt-0.5">posts</p>
                    </div>
                    <div className="text-center px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                      <p className="text-2xl font-bold text-teal-400">{plan.postsPerWeek}x</p>
                      <p className="text-xs text-gray-500 mt-0.5">per week</p>
                    </div>
                  </div>
                </div>

                {/* Funnel breakdown */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { stage: "TOFU", label: "Awareness", pct: plan.funnelBreakdown?.tofu || 0 },
                    { stage: "MOFU", label: "Nurture", pct: plan.funnelBreakdown?.mofu || 0 },
                    { stage: "BOFU", label: "Convert", pct: plan.funnelBreakdown?.bofu || 0 },
                  ].map(({ stage, label, pct }) => (
                    <div key={stage} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-lg font-bold text-white">{Math.round(pct)}%</p>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-[10px] font-semibold text-gray-600 mt-0.5">{stage}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posts list */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-white mb-4">
                  {plan.posts?.length || 0} Posts — {formatMonthDisplay(plan.month)}
                </h2>

                {(plan.posts || []).map((post) => (
                  <div key={post.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.10] transition-all">
                    <div className="flex items-start gap-4 p-5">
                      <button
                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        className="flex-1 flex items-start gap-4 text-left min-w-0"
                      >
                        {/* Date */}
                        <div className="shrink-0 text-center w-12">
                          <p className="text-xs font-semibold text-gray-600 uppercase">
                            {post.dayOfWeek.slice(0, 3)}
                          </p>
                          <p className="text-xl font-bold text-white leading-none mt-0.5">
                            {post.date.split("-")[2]}
                          </p>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${FUNNEL_COLOURS[post.funnel_stage]}`}>
                              {post.funnel_stage}
                            </span>
                            <span className="text-[10px] font-medium text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
                              {FORMAT_ICONS[post.format] || "◻"} {post.format}
                            </span>
                            <span className="text-[10px] text-gray-600">{post.posting_time}</span>
                          </div>
                          <p className="text-sm font-semibold text-white truncate">{post.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 italic truncate">&ldquo;{post.caption_hook}&rdquo;</p>
                        </div>

                        <svg className={`w-4 h-4 text-gray-600 shrink-0 transition-transform mt-1 ${expandedPost === post.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleCopyPost(post)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all shrink-0 mt-0.5"
                      >
                        {copiedPost === post.id ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    {expandedPost === post.id && (
                      <div className="border-t border-white/[0.06] p-5 md:p-6 space-y-5">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hook (before &ldquo;see more&rdquo;)</p>
                          <p className="text-sm font-semibold text-white italic">&ldquo;{post.caption_hook}&rdquo;</p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content Brief</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{post.description}</p>
                        </div>

                        {post.why_it_works && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Why It Works</p>
                            <p className="text-sm text-gray-400 leading-relaxed">{post.why_it_works}</p>
                          </div>
                        )}

                        {post.engagement_tip && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Engagement Tip</p>
                            <p className="text-sm text-teal-400 leading-relaxed">{post.engagement_tip}</p>
                          </div>
                        )}

                        {post.hashtags?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hashtags</p>
                            <div className="flex flex-wrap gap-2">
                              {post.hashtags.map((tag, i) => (
                                <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setPlan(null); setError("") }}
                className="px-6 py-3 text-sm font-semibold rounded-xl bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"
              >
                ← Generate New Plan
              </button>
            </div>
          )}

          {/* Form */}
          {!plan && !generating && (
            <div className="space-y-6">

              {/* Month & Frequency */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-1">Plan Settings</h2>
                <p className="text-sm text-gray-500 mb-6">Choose your month and posting frequency.</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Month</label>
                    <input
                      type="month"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Posts per Week</label>
                    <div className="grid grid-cols-2 gap-3">
                      {([3, 5] as PostingFrequency[]).map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setPostsPerWeek(freq)}
                          className={`p-4 rounded-xl border text-center transition-all ${postsPerWeek === freq ? "border-teal-400/50 bg-teal-400/10 text-teal-400" : "border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-white/20"}`}
                        >
                          <p className="text-lg font-bold">{freq}x</p>
                          <p className="text-xs opacity-70 mt-0.5">~{freq === 3 ? "12" : "20"} posts/month</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Context */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8 space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Business Context</h2>
                  <p className="text-sm text-gray-500">Tell us about your business so the plan fits your brand.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Industry <span className="text-red-400">*</span></label>
                  <input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Business Automation, Digital Marketing, Real Estate"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Business Description</label>
                  <textarea
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Briefly describe what you do, who you help, and what makes you different."
                    rows={3}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Target Audience <span className="text-red-400">*</span></label>
                  <input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. UK service business owners with 1-20 employees"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Network Size</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {AUDIENCE_SIZE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAudienceSize(opt.value)}
                        className={`p-3 rounded-xl border text-center transition-all ${audienceSize === opt.value ? "border-teal-400/50 bg-teal-400/10 text-teal-400" : "border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-white/20"}`}
                      >
                        <p className="text-xs font-bold">{opt.label}</p>
                        <p className="text-[10px] opacity-60 mt-0.5">{opt.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Goal */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8 space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Content Goal</h2>
                  <p className="text-sm text-gray-500">Your primary goal shapes the entire content strategy.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {GOAL_OPTIONS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoals(g)}
                      className={`p-4 rounded-xl border text-left transition-all ${goals === g ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}
                    >
                      <p className={`text-sm font-semibold ${goals === g ? "text-teal-400" : "text-white"}`}>{g}</p>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Desired Outcomes (optional)</label>
                  <textarea
                    value={desiredOutcomes}
                    onChange={(e) => setDesiredOutcomes(e.target.value)}
                    placeholder="e.g. Book 5 discovery calls per month, grow to 2K followers by Q3"
                    rows={2}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Formats */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-1">Post Formats</h2>
                <p className="text-sm text-gray-500 mb-4">Select which post types to include in your plan.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FORMAT_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => toggleFormat(f.value)}
                      className={`text-left p-4 rounded-xl border transition-all ${selectedFormats.includes(f.value) ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}
                    >
                      <p className={`text-sm font-semibold ${selectedFormats.includes(f.value) ? "text-teal-400" : "text-white"}`}>{f.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Pillars */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-1">Content Pillars</h2>
                <p className="text-sm text-gray-500 mb-4">Choose 3–8 recurring topics that define your LinkedIn content.</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {PILLAR_SUGGESTIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePillar(p)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${pillars.includes(p) ? "border-teal-400/50 bg-teal-400/10 text-teal-400" : "border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-white/20"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={customPillar}
                    onChange={(e) => setCustomPillar(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomPillar() } }}
                    placeholder="Add custom pillar..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                  />
                  <button
                    onClick={addCustomPillar}
                    disabled={!customPillar.trim() || pillars.length >= 8}
                    className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>

                {pillars.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {pillars.map((p) => (
                      <span key={p} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400">
                        {p}
                        <button onClick={() => togglePillar(p)} className="hover:text-white transition-colors">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div role="alert" className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">{error}</div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`w-full py-4 px-6 rounded-xl text-sm font-bold transition-all ${canGenerate ? "bg-teal-400 text-black hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
              >
                Generate Content Plan
                <span className="ml-2 text-xs opacity-75">(25 tokens)</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
