"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

type Goal = "Brand Awareness" | "Lead Generation" | "Community Building" | "Sales & Conversions" | "Education & Authority"
type QualityMode = "fast" | "pro"
type PostsPerWeek = 3 | 5 | 7

interface GeneratedPost {
  id: string
  date: string
  dayOfWeek: string
  format: "Single Tweet" | "Thread" | "Poll"
  post_type: string
  thread_type?: string
  thread_tweet_count?: number
  funnel_stage: "TOFU" | "MOFU" | "BOFU"
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
  funnelBreakdown: { tofu: number; mofu: number; bofu: number }
  pillarDistribution: Record<string, number>
  posts: GeneratedPost[]
}

const GOALS: Goal[] = [
  "Brand Awareness",
  "Lead Generation",
  "Community Building",
  "Sales & Conversions",
  "Education & Authority",
]

const QUALITY_COSTS: Record<QualityMode, number> = { fast: 25, pro: 60 }

const FORMAT_ICONS: Record<string, string> = {
  "Single Tweet": "✦",
  Thread: "≡",
  Poll: "◉",
}

const STAGE_COLORS: Record<string, string> = {
  TOFU: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  MOFU: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  BOFU: "bg-teal-500/10 border-teal-500/20 text-teal-400",
}

const STAGE_DOT: Record<string, string> = {
  TOFU: "bg-blue-400",
  MOFU: "bg-amber-400",
  BOFU: "bg-teal-400",
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="text-xs text-gray-500 hover:text-teal-400 transition-colors"
    >
      {copied ? "Copied!" : (label || "Copy hook")}
    </button>
  )
}

function PostCard({ post, index }: { post: GeneratedPost; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all">
      <div
        className="flex items-start gap-4 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Date */}
        <div className="text-center shrink-0 w-10">
          <div className="text-xs text-gray-600 uppercase">{post.dayOfWeek.slice(0, 3)}</div>
          <div className="text-lg font-bold text-white leading-none">{post.date.split("-")[2]}</div>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STAGE_COLORS[post.funnel_stage]}`}>
              {post.funnel_stage}
            </span>
            <span className="text-xs text-gray-500 font-medium">{FORMAT_ICONS[post.format]} {post.format}</span>
            {post.thread_tweet_count && (
              <span className="text-xs text-gray-600">{post.thread_tweet_count} tweets</span>
            )}
            <span className="text-xs text-gray-600 hidden sm:block">· {post.posting_time}</span>
          </div>
          <p className="text-sm text-white font-medium leading-snug line-clamp-2">{post.hook}</p>
          <p className="text-xs text-gray-600 mt-1">{post.pillar}</p>
        </div>

        {/* Expand */}
        <svg
          className={`w-4 h-4 text-gray-600 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expanded && (
        <div className="border-t border-white/[0.06] p-4 space-y-4">

          {/* Hook with copy */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hook / Opening</span>
              <CopyButton text={post.hook} />
            </div>
            <p className="text-sm text-white leading-relaxed bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">{post.hook}</p>
          </div>

          {/* Content brief */}
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Content Brief</span>
            <p className="text-sm text-gray-300 leading-relaxed">{post.content_brief}</p>
          </div>

          {/* Thread info */}
          {post.format === "Thread" && post.thread_type && (
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs text-gray-600">Thread type</span>
                <p className="text-sm font-medium text-white">{post.thread_type}</p>
              </div>
              <div>
                <span className="text-xs text-gray-600">Tweet count</span>
                <p className="text-sm font-medium text-white">{post.thread_tweet_count}</p>
              </div>
              <div>
                <span className="text-xs text-gray-600">Post at</span>
                <p className="text-sm font-medium text-white">{post.posting_time}</p>
              </div>
            </div>
          )}

          {/* Why it works / Engagement tip / Goal alignment */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Why it works</span>
              <p className="text-xs text-gray-400 leading-relaxed">{post.why_it_works}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Engagement tip</span>
              <p className="text-xs text-gray-400 leading-relaxed">{post.engagement_tip}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Goal alignment</span>
              <p className="text-xs text-gray-400 leading-relaxed">{post.goal_alignment}</p>
            </div>
          </div>

          {/* Generate the post link */}
          <div className="flex justify-end">
            <a
              href={`/dashboard/x?prefill=${encodeURIComponent(post.hook)}&format=${post.format === "Thread" ? "thread" : "tweet"}&threadType=${encodeURIComponent(post.thread_type || "Educational")}`}
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
            >
              Write this post →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function XPlannerPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  const [month, setMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })
  const [postsPerWeek, setPostsPerWeek] = useState<PostsPerWeek>(5)
  const [goal, setGoal] = useState<Goal>("Lead Generation")
  const [industry, setIndustry] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [businessDescription, setBusinessDescription] = useState("")
  const [pillarsRaw, setPillarsRaw] = useState("")
  const [qualityMode, setQualityMode] = useState<QualityMode>("fast")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [plan, setPlan] = useState<GeneratedPlan | null>(null)
  const [selectedPost, setSelectedPost] = useState<GeneratedPost | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleGenerate = useCallback(async () => {
    if (!industry.trim() || !targetAudience.trim()) {
      setError("Industry and target audience are required.")
      return
    }
    if (!user) {
      router.push(`/login?redirect=/dashboard/x/planner`)
      return
    }
    const cost = QUALITY_COSTS[qualityMode]
    if (tokenBalance < cost) {
      setError(`Insufficient tokens. You need ${cost} but have ${tokenBalance}.`)
      return
    }

    setGenerating(true)
    setError("")
    setPlan(null)

    try {
      const contentPillars = pillarsRaw
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)

      const res = await fetch("/api/generate/x-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          postsPerWeek,
          goals: goal,
          industry: industry.trim(),
          targetAudience: targetAudience.trim(),
          businessDescription: businessDescription.trim(),
          contentPillars,
          qualityMode,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Generation failed")
        return
      }
      setPlan(data.plan)
      refreshBalance()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setGenerating(false)
    }
  }, [month, postsPerWeek, goal, industry, targetAudience, businessDescription, pillarsRaw, qualityMode, user, tokenBalance, refreshBalance, router])

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
            <AppsDropdown />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-lg">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25 4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                  </svg>
                  <span className="text-sm font-semibold text-teal-400">{tokenBalance}</span>
                  <span className="text-xs text-gray-500">tokens</span>
                </div>
                <UserMenu />
              </>
            ) : (
              <a href="/login?redirect=/dashboard/x/planner" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all">Sign In</a>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden relative z-50 p-2">
            <div className="w-8 h-6 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <AppsMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6">
        <div className="max-w-6xl mx-auto">

          <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors mb-8 group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Apps
          </a>

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">X Content Engine</span>
            </div>

            <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6 max-w-sm">
              <a href="/dashboard/x" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Compose
              </a>
              <span className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">
                Planner
              </span>
              <a href="/dashboard/x/interactions" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Accounts
              </a>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Content Planner</h1>
            <p className="text-gray-500">A full month of X content built around your goal. Only X-native formats — no carousels.</p>
          </div>

          {!plan ? (
            <div className="max-w-2xl space-y-5">

              {/* Goal */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <label className="block text-sm font-medium text-gray-400 mb-3">Primary Goal</label>
                <div className="space-y-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        goal === g
                          ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                          : "border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-gray-300"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month + Frequency */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Month</label>
                  <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-teal-400/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Posts per week</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([3, 5, 7] as PostsPerWeek[]).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPostsPerWeek(n)}
                        className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                          postsPerWeek === n
                            ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                            : "border-white/[0.08] text-gray-500 hover:border-white/20"
                        }`}
                      >
                        {n}x / week
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Business context */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-medium text-gray-400">Business Context</h3>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Industry *</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Digital marketing, Construction, SaaS"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Target Audience *</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Service business owners doing £100K–£500K/year"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Business Description (optional)</label>
                  <textarea
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    rows={2}
                    placeholder="What you do and who you help..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 transition-all resize-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Content Pillars (optional, comma separated)</label>
                  <input
                    type="text"
                    value={pillarsRaw}
                    onChange={(e) => setPillarsRaw(e.target.value)}
                    placeholder="e.g. Lead gen tips, Client results, Business mindset"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Quality mode */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <label className="block text-sm font-medium text-gray-400 mb-3">Quality Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setQualityMode("fast")}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      qualityMode === "fast"
                        ? "border-teal-400/50 bg-teal-400/10"
                        : "border-white/[0.08] hover:border-white/20"
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${qualityMode === "fast" ? "text-teal-400" : "text-white"}`}>Fast</div>
                    <div className="text-xs text-gray-500">Single pass · 25 tokens</div>
                  </button>
                  <button
                    onClick={() => setQualityMode("pro")}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      qualityMode === "pro"
                        ? "border-teal-400/50 bg-teal-400/10"
                        : "border-white/[0.08] hover:border-white/20"
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${qualityMode === "pro" ? "text-teal-400" : "text-white"}`}>Pro</div>
                    <div className="text-xs text-gray-500">Auto-retry · 60 tokens</div>
                  </button>
                </div>
              </div>

              {/* Generate */}
              <button
                onClick={handleGenerate}
                disabled={generating || !industry.trim() || !targetAudience.trim()}
                className="w-full py-4 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {generating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating your X plan... ({qualityMode === "pro" ? "up to 60s" : "~30s"})
                  </>
                ) : (
                  <>
                    Generate Content Plan
                    <span className="text-black/60 text-sm">({QUALITY_COSTS[qualityMode]} tokens)</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
              )}
            </div>
          ) : (
            <div>
              {/* Plan header */}
              <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{plan.monthTheme}</h2>
                  <p className="text-gray-400 text-sm max-w-2xl">{plan.monthThemeDescription}</p>
                </div>
                <button
                  onClick={() => setPlan(null)}
                  className="text-sm text-gray-500 hover:text-teal-400 transition-colors shrink-0"
                >
                  ← New plan
                </button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{plan.posts.length}</div>
                  <div className="text-xs text-gray-500 mt-1">Total posts</div>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{plan.funnelBreakdown.tofu}%</div>
                  <div className="text-xs text-gray-500 mt-1">TOFU (awareness)</div>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-amber-400">{plan.funnelBreakdown.mofu}%</div>
                  <div className="text-xs text-gray-500 mt-1">MOFU (nurture)</div>
                </div>
                <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-teal-400">{plan.funnelBreakdown.bofu}%</div>
                  <div className="text-xs text-gray-500 mt-1">BOFU (convert)</div>
                </div>
              </div>

              {/* Format breakdown */}
              <div className="flex items-center gap-6 mb-8 text-sm text-gray-500">
                {["Single Tweet", "Thread", "Poll"].map((fmt) => {
                  const count = plan.posts.filter((p) => p.format === fmt).length
                  if (count === 0) return null
                  return (
                    <div key={fmt} className="flex items-center gap-1.5">
                      <span className="text-teal-400">{FORMAT_ICONS[fmt]}</span>
                      <span>{count}× {fmt}</span>
                    </div>
                  )
                })}
                <span className="text-gray-600">· {plan.frequencyRationale.slice(0, 80)}...</span>
              </div>

              {/* Posts */}
              <div className="space-y-3">
                {plan.posts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>

              {/* Pillars */}
              {Object.keys(plan.pillarDistribution).length > 0 && (
                <div className="mt-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Pillar Distribution</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(plan.pillarDistribution).map(([pillar, count]) => (
                      <span key={pillar} className="px-3 py-1.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-full text-gray-300">
                        {pillar} <span className="text-gray-600">({count})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
