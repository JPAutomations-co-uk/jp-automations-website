"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveTab = "generate" | "keywords" | "planner" | "history"
type WordCount = "800" | "1200" | "2000"
type BlogGoal = "rank" | "questions" | "expertise" | "enquiries"
type ResultTab = "article" | "seo" | "links"
type PlannerGoal = "local" | "competitor" | "leads" | "authority"
type PlannerTimeframe = "3" | "6" | "12"
type WebsiteStatus = "none" | "new" | "some" | "established"

interface BlogResult {
  title: string
  slug: string
  meta_title: string
  meta_description: string
  reading_time: string
  target_keyword: string
  secondary_keywords: string[]
  content: string
  faq: { question: string; answer: string }[]
  internal_link_suggestions: string[]
  cta_text: string
}

interface KeywordResult {
  keyword: string
  intent: "Transactional" | "Commercial" | "Informational"
  difficulty: "Low" | "Medium" | "High"
  angle: string
}

interface PlannerBlogTopic {
  title: string
  keyword: string
  priority: "High" | "Medium" | "Low"
  intent: string
}

interface PlannerPhase {
  phase: number
  title: string
  months: string
  objective: string
  blogTopics: PlannerBlogTopic[]
  otherActions: string[]
}

interface PlannerResult {
  overview: string
  publishingFrequency: string
  phases: PlannerPhase[]
  beyondContent: {
    technical: string[]
    googleBusiness: string[]
    citations: string[]
    backlinks: string[]
  }
  quickWins: string[]
  timelineExpectations: string
}

interface HistoryItem {
  id: string
  target_keyword: string
  location: string
  title: string
  word_count: number
  created_at: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOKEN_COSTS: Record<WordCount, number> = { "800": 20, "1200": 30, "2000": 40 }

const BLOG_GOALS: { value: BlogGoal; label: string; desc: string }[] = [
  { value: "rank", label: "Rank on Google", desc: "Maximum SEO optimisation to outrank competitors" },
  { value: "questions", label: "Answer Questions", desc: "Target People Also Ask and featured snippets" },
  { value: "expertise", label: "Show Expertise", desc: "Build trust and authority with local readers" },
  { value: "enquiries", label: "Drive Enquiries", desc: "Convert readers into leads and calls" },
]

const PLANNER_GOALS: { value: PlannerGoal; label: string; desc: string }[] = [
  { value: "local", label: "Get Found Locally", desc: "Appear when customers search for your service in your area" },
  { value: "competitor", label: "Beat Competitors", desc: "Overtake businesses currently ranking above you" },
  { value: "leads", label: "More Enquiries", desc: "Drive calls and form submissions from Google traffic" },
  { value: "authority", label: "Build Authority", desc: "Become the recognised expert in your local area" },
]

const WEBSITE_STATUSES: { value: WebsiteStatus; label: string; desc: string }[] = [
  { value: "none", label: "No website yet", desc: "Starting from scratch" },
  { value: "new", label: "New site, no blog", desc: "Site exists but no content yet" },
  { value: "some", label: "Some content", desc: "A few posts or pages already" },
  { value: "established", label: "Established site", desc: "2+ years online, decent content" },
]

const GENERATE_LOADING = [
  "Researching local search intent for your keyword…",
  "Structuring content for Google's featured snippets…",
  "Weaving in LSI keywords and local signals…",
  "Writing the FAQ section for People Also Ask…",
  "Polishing for British English and readability…",
]

const PLANNER_LOADING = [
  "Analysing local SEO landscape for your area…",
  "Sequencing keywords by competition and intent…",
  "Building your phased content roadmap…",
  "Identifying your highest-ROI quick wins…",
  "Checking industry-specific backlink opportunities…",
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function intentColor(intent: string) {
  if (intent === "Transactional") return "bg-green-400/10 text-green-400 border-green-400/20"
  if (intent === "Commercial") return "bg-amber-400/10 text-amber-400 border-amber-400/20"
  return "bg-blue-400/10 text-blue-400 border-blue-400/20"
}

function priorityColor(priority: string) {
  if (priority === "High") return "text-red-400"
  if (priority === "Medium") return "text-amber-400"
  return "text-gray-500"
}

function difficultyColor(difficulty: string) {
  if (difficulty === "Low") return "text-green-400"
  if (difficulty === "Medium") return "text-amber-400"
  return "text-red-400"
}

function metaDescColor(len: number) {
  if (len >= 140 && len <= 155) return "text-green-400"
  if (len >= 120 && len < 140) return "text-amber-400"
  return "text-red-400"
}

function buildMarkdown(blog: BlogResult): string {
  return `# ${blog.title}\n\n${blog.content}\n\n---\n\n*${blog.reading_time} · Target keyword: ${blog.target_keyword}*`
}

function downloadMd(blog: BlogResult) {
  const blob = new Blob([buildMarkdown(blog)], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${blog.slug || "seo-blog"}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── Markdown Renderer ───────────────────────────────────────────────────────

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-base font-bold text-white mt-5 mb-2">
          {renderInline(line.slice(4))}
        </h3>
      )
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-lg font-bold text-white mt-7 mb-3 pb-2 border-b border-white/[0.06]">
          {renderInline(line.slice(3))}
        </h2>
      )
    } else if (line.startsWith("---")) {
      elements.push(<hr key={key++} className="border-white/[0.08] my-5" />)
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = []
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-1 my-3 text-gray-300 text-sm leading-relaxed ml-2">
          {items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
        </ul>
      )
      continue
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""))
        i++
      }
      elements.push(
        <ol key={key++} className="list-decimal list-inside space-y-1 my-3 text-gray-300 text-sm leading-relaxed ml-2">
          {items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
        </ol>
      )
      continue
    } else if (line.trim() === "") {
      // skip
    } else {
      elements.push(
        <p key={key++} className="text-gray-300 text-sm leading-relaxed mb-3">
          {renderInline(line)}
        </p>
      )
    }
    i++
  }

  return <div>{elements}</div>
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i} className="italic">{part.slice(1, -1)}</em>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ user, tokenBalance, isMobileMenuOpen, setIsMobileMenuOpen }: {
  user: ReturnType<typeof useAuth>["user"]
  tokenBalance: number
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (v: boolean) => void
}) {
  return (
    <>
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
              <a href="/login?redirect=/dashboard/seo-blog" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all hover:scale-105">
                Sign In
              </a>
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
      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <a href="/" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <AppsMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
          {user ? (
            <div className="flex items-center gap-2 mt-4">
              <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
              </svg>
              <span className="text-lg font-semibold text-teal-400">{tokenBalance} tokens</span>
            </div>
          ) : (
            <a href="/login?redirect=/dashboard/seo-blog" className="text-4xl font-bold text-teal-400 hover:text-teal-300 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign In</a>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Loading State ───────────────────────────────────────────────────────────

function LoadingPanel({ messages, step, elapsed, label }: {
  messages: string[]
  step: number
  elapsed: number
  label: string
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px] rounded-2xl border border-white/[0.08] bg-white/[0.02]">
      <div className="text-center px-8 py-16">
        <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-white font-semibold text-lg mb-2">{label}</p>
        <p className="text-gray-500 text-sm animate-pulse mb-3">{messages[step]}</p>
        <p className="text-gray-600 text-xs font-mono">
          {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
          <span className="text-gray-700"> / ~30-60 sec</span>
        </p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SEOBlogPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>("generate")

  // ── Generate form state ──────────────────────────────────────────────────
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [toneExample, setToneExample] = useState("")
  const [specificTopic, setSpecificTopic] = useState("")
  const [wordCount, setWordCount] = useState<WordCount>("1200")
  const [goal, setGoal] = useState<BlogGoal>("rank")

  const [generating, setGenerating] = useState(false)
  const [genLoadingStep, setGenLoadingStep] = useState(0)
  const [genElapsed, setGenElapsed] = useState(0)
  const [generateError, setGenerateError] = useState("")
  const [blog, setBlog] = useState<BlogResult | null>(null)
  const [resultTab, setResultTab] = useState<ResultTab>("article")
  const [copied, setCopied] = useState<string | null>(null)

  // ── Keywords tab state ───────────────────────────────────────────────────
  const [kwService, setKwService] = useState("")
  const [kwLocation, setKwLocation] = useState("")
  const [kwServices, setKwServices] = useState("")
  const [kwAudience, setKwAudience] = useState("")
  const [kwGenerating, setKwGenerating] = useState(false)
  const [kwError, setKwError] = useState("")
  const [keywords, setKeywords] = useState<KeywordResult[] | null>(null)

  // ── Planner tab state ────────────────────────────────────────────────────
  const [plannerBusinessType, setPlannerBusinessType] = useState("")
  const [plannerLocation, setPlannerLocation] = useState("")
  const [plannerGoal, setPlannerGoal] = useState<PlannerGoal>("local")
  const [plannerTimeframe, setPlannerTimeframe] = useState<PlannerTimeframe>("6")
  const [websiteStatus, setWebsiteStatus] = useState<WebsiteStatus>("new")
  const [plannerServices, setPlannerServices] = useState("")
  const [plannerGenerating, setPlannerGenerating] = useState(false)
  const [plannerLoadingStep, setPlannerLoadingStep] = useState(0)
  const [plannerElapsed, setPlannerElapsed] = useState(0)
  const [plannerError, setPlannerError] = useState("")
  const [plannerResult, setPlannerResult] = useState<PlannerResult | null>(null)
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0)
  const [expandedBeyond, setExpandedBeyond] = useState<string | null>("technical")

  // ── History tab state ────────────────────────────────────────────────────
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // Refs
  const mountedRef = useRef(true)
  const genLoadingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const genTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const planLoadingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const planTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      ;[genLoadingRef, genTimerRef, planLoadingRef, planTimerRef].forEach(r => {
        if (r.current) clearInterval(r.current)
      })
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  // Pre-fill from profile
  useEffect(() => {
    if (!user) return
    fetch("/api/profile")
      .then(r => r.json())
      .then(data => {
        if (!mountedRef.current) return
        const profile = data.profile || data
        if (profile.business_name) setBusinessName(profile.business_name)
        if (profile.industry) {
          setBusinessType(profile.industry)
          setPlannerBusinessType(profile.industry)
          setKwService(profile.industry)
        }
        if (profile.location) {
          setLocation(profile.location)
          setKwLocation(profile.location)
          setPlannerLocation(profile.location)
        }
        if (profile.target_audience) setKwAudience(profile.target_audience)
      })
      .catch(() => {})
  }, [user])

  // Load history
  useEffect(() => {
    if (activeTab !== "history" || !user) return
    setHistoryLoading(true)
    fetch("/api/seo-blog/history")
      .then(r => r.json())
      .then(data => {
        if (!mountedRef.current) return
        if (Array.isArray(data.blogs)) setHistory(data.blogs)
      })
      .catch(() => {})
      .finally(() => { if (mountedRef.current) setHistoryLoading(false) })
  }, [activeTab, user])

  // ── Generate Blog ──────────────────────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    if (!keyword.trim()) return
    if (!user) { router.push("/login?redirect=/dashboard/seo-blog"); return }
    const cost = TOKEN_COSTS[wordCount]
    if (tokenBalance < cost) {
      setGenerateError(`Insufficient tokens. You need ${cost} but have ${tokenBalance}.`)
      return
    }

    setGenerating(true)
    setGenerateError("")
    setBlog(null)
    setGenLoadingStep(0)
    setGenElapsed(0)

    genLoadingRef.current = setInterval(() => setGenLoadingStep(p => (p + 1) % GENERATE_LOADING.length), 3500)
    genTimerRef.current = setInterval(() => setGenElapsed(p => p + 1), 1000)

    try {
      const res = await fetch("/api/generate/seo-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, location, businessName, businessType, websiteUrl, toneExample, specificTopic, wordCount, goal }),
      })
      if (!mountedRef.current) return
      const data = await res.json()
      if (!mountedRef.current) return
      if (!res.ok) { setGenerateError(data.error || "Generation failed"); return }
      setBlog(data.blog)
      setResultTab("article")
      refreshBalance()
    } catch {
      if (mountedRef.current) setGenerateError("Something went wrong. Please try again.")
    } finally {
      if (genLoadingRef.current) { clearInterval(genLoadingRef.current); genLoadingRef.current = null }
      if (genTimerRef.current) { clearInterval(genTimerRef.current); genTimerRef.current = null }
      if (mountedRef.current) setGenerating(false)
    }
  }, [keyword, location, businessName, businessType, websiteUrl, toneExample, specificTopic, wordCount, goal, user, tokenBalance, refreshBalance, router])

  // ── Generate Keywords ────────────────────────────────────────────────────

  const handleKeywords = useCallback(async () => {
    if (!kwService.trim() || !kwLocation.trim()) return
    if (!user) { router.push("/login?redirect=/dashboard/seo-blog"); return }
    if (tokenBalance < 5) { setKwError("Insufficient tokens. You need 5 tokens."); return }

    setKwGenerating(true)
    setKwError("")
    setKeywords(null)

    try {
      const res = await fetch("/api/generate/seo-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: kwService,
          location: kwLocation,
          ...(kwServices.trim() ? { services: kwServices.trim() } : {}),
          ...(kwAudience.trim() ? { audience: kwAudience.trim() } : {}),
        }),
      })
      if (!mountedRef.current) return
      const data = await res.json()
      if (!mountedRef.current) return
      if (!res.ok) { setKwError(data.error || "Failed to generate keywords"); return }
      setKeywords(data.keywords)
      refreshBalance()
    } catch {
      if (mountedRef.current) setKwError("Something went wrong. Please try again.")
    } finally {
      if (mountedRef.current) setKwGenerating(false)
    }
  }, [kwService, kwLocation, kwServices, kwAudience, user, tokenBalance, refreshBalance, router])

  // ── Generate Plan ────────────────────────────────────────────────────────

  const handlePlanner = useCallback(async () => {
    if (!plannerBusinessType.trim() || !plannerLocation.trim()) return
    if (!user) { router.push("/login?redirect=/dashboard/seo-blog"); return }
    if (tokenBalance < 25) { setPlannerError("Insufficient tokens. You need 25 tokens."); return }

    setPlannerGenerating(true)
    setPlannerError("")
    setPlannerResult(null)
    setPlannerLoadingStep(0)
    setPlannerElapsed(0)
    setExpandedPhase(0)

    planLoadingRef.current = setInterval(() => setPlannerLoadingStep(p => (p + 1) % PLANNER_LOADING.length), 3500)
    planTimerRef.current = setInterval(() => setPlannerElapsed(p => p + 1), 1000)

    try {
      const res = await fetch("/api/generate/seo-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: plannerBusinessType,
          location: plannerLocation,
          goal: plannerGoal,
          timeframe: plannerTimeframe,
          websiteStatus,
          services: plannerServices,
        }),
      })
      if (!mountedRef.current) return
      const data = await res.json()
      if (!mountedRef.current) return
      if (!res.ok) { setPlannerError(data.error || "Failed to generate plan"); return }
      setPlannerResult(data.plan)
      refreshBalance()
    } catch {
      if (mountedRef.current) setPlannerError("Something went wrong. Please try again.")
    } finally {
      if (planLoadingRef.current) { clearInterval(planLoadingRef.current); planLoadingRef.current = null }
      if (planTimerRef.current) { clearInterval(planTimerRef.current); planTimerRef.current = null }
      if (mountedRef.current) setPlannerGenerating(false)
    }
  }, [plannerBusinessType, plannerLocation, plannerGoal, plannerTimeframe, websiteStatus, plannerServices, user, tokenBalance, refreshBalance, router])

  // ── Copy ─────────────────────────────────────────────────────────────────

  const handleCopy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => { if (mountedRef.current) setCopied(null) }, 2000)
    } catch {
      setGenerateError("Failed to copy to clipboard.")
    }
  }, [])

  // ── Use Keyword in Generate ──────────────────────────────────────────────

  const useKeyword = useCallback((kw: KeywordResult) => {
    setKeyword(kw.keyword)
    setActiveTab("generate")
  }, [])

  const usePlannerTopic = useCallback((topic: PlannerBlogTopic) => {
    setKeyword(topic.keyword)
    setSpecificTopic(topic.title)
    setActiveTab("generate")
  }, [])

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">
      <Nav user={user} tokenBalance={tokenBalance} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Back */}
          <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors mb-8 group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Apps
          </a>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">SEO Blog Writer</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6 max-w-md">
              {(["generate", "keywords", "planner", "history"] as ActiveTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg transition-all capitalize ${
                    activeTab === tab
                      ? "bg-teal-400/10 text-teal-400 border border-teal-400/20"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "generate" && <><h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Generate SEO Blog</h1><p className="text-gray-500">Create a publish-ready blog post that ranks for local search keywords.</p></>}
            {activeTab === "keywords" && <><h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Keyword Research</h1><p className="text-gray-500">Find what your clients&apos; customers are searching for on Google.</p></>}
            {activeTab === "planner" && <><h1 className="text-3xl md:text-4xl font-bold text-white mb-2">SEO Blog Planner</h1><p className="text-gray-500">A phased roadmap and everything else needed to hit your SEO goals.</p></>}
            {activeTab === "history" && <><h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Blog History</h1><p className="text-gray-500">Previously generated articles.</p></>}
          </div>

          {/* ── GENERATE TAB ─────────────────────────────────────────────────── */}
          {activeTab === "generate" && (
            <div className="grid lg:grid-cols-[420px_1fr] gap-8">

              {/* Left: Inputs */}
              <div className="space-y-5">

                {/* Keyword */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-white mb-1">
                    Target Keyword <span className="text-red-400">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">The search phrase you want to rank for on Google.</p>
                  <input
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="e.g. emergency plumber Bristol"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm"
                  />
                </div>

                {/* Specific Topic */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-white mb-1">
                    Specific Topic or Question <span className="text-gray-600 font-normal">(optional)</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Is there a particular angle, question, or point you want this article to cover?</p>
                  <input
                    type="text"
                    value={specificTopic}
                    onChange={e => setSpecificTopic(e.target.value)}
                    placeholder="e.g. Why local plumbers are better than national firms for emergencies"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm"
                  />
                </div>

                {/* Business Details */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                  <p className="text-sm font-semibold text-white">Business Details</p>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Business Name</label>
                    <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. Johnson Plumbing Ltd" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Service / Business Type</label>
                    <input type="text" value={businessType} onChange={e => setBusinessType(e.target.value)} placeholder="e.g. plumber, roofer, electrician" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Bristol" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Website URL <span className="text-gray-600">(optional)</span></label>
                    <input type="text" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="e.g. johnsonplumbing.co.uk" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm" />
                  </div>
                </div>

                {/* Tone of Voice */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-white mb-1">
                    Tone of Voice Sample <span className="text-gray-600 font-normal">(optional)</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Paste a paragraph from their website, an existing blog, or any text written in their voice. The article will match this writing style.</p>
                  <textarea
                    value={toneExample}
                    onChange={e => setToneExample(e.target.value)}
                    rows={4}
                    maxLength={1500}
                    placeholder={"Paste an example of their writing here — a website paragraph, previous blog post, or even a social media caption. The more specific, the better the style match."}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm resize-none"
                  />
                  <p className="text-xs text-gray-600 mt-1.5 text-right">{toneExample.length}/1500</p>
                </div>

                {/* Word Count */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-white mb-3">Article Length</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["800", "1200", "2000"] as WordCount[]).map(wc => (
                      <button
                        key={wc}
                        onClick={() => setWordCount(wc)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                          wordCount === wc
                            ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                            : "border-white/[0.08] text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <span className="text-sm font-bold">{wc}w</span>
                        <span className="text-[10px] opacity-60">{TOKEN_COSTS[wc]} tokens</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-3">800w = quick wins · 1,200w = standard · 2,000w = pillar content</p>
                </div>

                {/* Goal */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-white mb-3">Blog Goal</label>
                  <div className="space-y-2">
                    {BLOG_GOALS.map(g => (
                      <button
                        key={g.value}
                        onClick={() => setGoal(g.value)}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          goal === g.value
                            ? "border-teal-400/50 bg-teal-400/10"
                            : "border-white/[0.08] hover:border-white/20"
                        }`}
                      >
                        <span className={`text-sm font-semibold ${goal === g.value ? "text-teal-400" : "text-white"}`}>{g.label}</span>
                        <span className="text-xs text-gray-500 block mt-0.5">{g.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {generateError && (
                  <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">{generateError}</div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={generating || !keyword.trim()}
                  className="w-full py-4 rounded-xl font-bold bg-teal-400 text-black hover:bg-teal-300 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3 text-sm"
                >
                  {generating ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Writing your article…</>
                  ) : (
                    <>Generate Blog <span className="opacity-60">({TOKEN_COSTS[wordCount]} tokens)</span></>
                  )}
                </button>
              </div>

              {/* Right: Output */}
              <div className="min-h-[500px]">
                {!blog && !generating && (
                  <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] min-h-[400px]">
                    <div className="text-center px-8 py-16">
                      <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium mb-1">No article yet</p>
                      <p className="text-gray-600 text-sm max-w-xs">Enter a keyword and hit Generate to create a publish-ready SEO blog post.</p>
                    </div>
                  </div>
                )}

                {generating && (
                  <LoadingPanel messages={GENERATE_LOADING} step={genLoadingStep} elapsed={genElapsed} label="Writing your article" />
                )}

                {blog && !generating && (
                  <div className="space-y-5">
                    {/* Meta strip */}
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">H1 Title</p>
                          <p className="text-lg font-bold text-white leading-snug">{blog.title}</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/[0.06] border border-white/[0.08] text-gray-400 shrink-0">{blog.reading_time}</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meta Title</p>
                            <span className="text-xs text-gray-600 font-mono">{blog.meta_title?.length || 0} chars</span>
                          </div>
                          <p className="text-sm text-gray-300">{blog.meta_title}</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meta Description</p>
                            <span className={`text-xs font-mono ${metaDescColor(blog.meta_description?.length || 0)}`}>{blog.meta_description?.length || 0}/155</span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">{blog.meta_description}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Suggested URL slug</p>
                          <code className="text-xs text-teal-400 bg-teal-400/10 px-2 py-1 rounded-lg">/blog/{blog.slug}</code>
                        </div>
                      </div>
                    </div>

                    {/* Result sub-tabs */}
                    <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl max-w-xs">
                      {(["article", "seo", "links"] as ResultTab[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setResultTab(t)}
                          className={`flex-1 py-2 px-3 text-xs font-semibold text-center rounded-lg transition-all ${
                            resultTab === t
                              ? "bg-teal-400/10 text-teal-400 border border-teal-400/20"
                              : "text-gray-500 hover:text-gray-300"
                          }`}
                        >
                          {t === "links" ? "Int. Links" : t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>

                    {resultTab === "article" && (
                      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                        <MarkdownContent content={blog.content} />
                      </div>
                    )}

                    {resultTab === "seo" && (
                      <div className="space-y-4">
                        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Primary Keyword</p>
                          <span className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400">{blog.target_keyword}</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Secondary Keywords Woven In</p>
                          <div className="flex flex-wrap gap-2">
                            {blog.secondary_keywords?.map((kw, i) => (
                              <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400">{kw}</span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">FAQ — People Also Ask</p>
                          <div className="space-y-4">
                            {blog.faq?.map((item, i) => (
                              <div key={i} className="border-b border-white/[0.06] pb-4 last:border-0 last:pb-0">
                                <p className="text-sm font-semibold text-white mb-1">{item.question}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{item.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {resultTab === "links" && (
                      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Internal Linking Opportunities</p>
                        <div className="space-y-3">
                          {blog.internal_link_suggestions?.map((s, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                              <span className="text-teal-400 font-bold text-sm shrink-0 mt-0.5">{i + 1}.</span>
                              <p className="text-sm text-gray-300 leading-relaxed">{s}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 mt-4">Add these internal links after publishing to strengthen your site's SEO structure.</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => handleCopy(buildMarkdown(blog), "md")}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-teal-400 text-black hover:bg-teal-300 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>
                        {copied === "md" ? "Copied!" : "Copy Markdown"}
                      </button>
                      <button
                        onClick={() => downloadMd(blog)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-white/[0.06] border border-white/[0.08] text-gray-300 hover:text-white hover:border-white/20 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        Download .md
                      </button>
                      <button
                        onClick={() => { setBlog(null); setGenerateError("") }}
                        className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-white/[0.04] border border-white/[0.06] text-gray-500 hover:text-gray-300 transition-all"
                      >
                        New Article
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── KEYWORDS TAB ──────────────────────────────────────────────────── */}
          {activeTab === "keywords" && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">Service Type <span className="text-red-400">*</span></label>
                  <input type="text" value={kwService} onChange={e => setKwService(e.target.value)} placeholder="e.g. plumber, roofing contractor, electrician" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">Location <span className="text-red-400">*</span></label>
                  <input type="text" value={kwLocation} onChange={e => setKwLocation(e.target.value)} placeholder="e.g. Bristol, Manchester, London" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm" />
                </div>
                <div className="pt-1 border-t border-white/[0.06]">
                  <p className="text-xs text-gray-500 mb-3">Optional — add these for more specific keywords</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Specific services offered</label>
                      <input type="text" value={kwServices} onChange={e => setKwServices(e.target.value)} placeholder="e.g. boiler repair, bathroom fitting, emergency call-outs" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Typical customers</label>
                      <input type="text" value={kwAudience} onChange={e => setKwAudience(e.target.value)} placeholder="e.g. homeowners, landlords, small businesses, letting agents" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm" />
                    </div>
                  </div>
                </div>
                {kwError && <div className="p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">{kwError}</div>}
                <button
                  onClick={handleKeywords}
                  disabled={kwGenerating || !kwService.trim() || !kwLocation.trim()}
                  className="w-full py-3.5 rounded-xl font-bold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {kwGenerating ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Finding keywords…</>
                  ) : (
                    <>Find Keyword Ideas <span className="opacity-60">(5 tokens)</span></>
                  )}
                </button>
              </div>

              {keywords && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-400">{keywords.length} keyword ideas</p>
                  {keywords.map((kw, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.12] transition-all group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="text-sm font-bold text-white">{kw.keyword}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${intentColor(kw.intent)}`}>{kw.intent}</span>
                            <span className={`text-xs font-semibold ${difficultyColor(kw.difficulty)}`}>{kw.difficulty}</span>
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">{kw.angle}</p>
                        </div>
                        <button
                          onClick={() => useKeyword(kw)}
                          className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                          Use →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PLANNER TAB ───────────────────────────────────────────────────── */}
          {activeTab === "planner" && (
            <div>
              {!plannerResult && !plannerGenerating && (
                <div className="max-w-2xl space-y-5">
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-1">Business Type <span className="text-red-400">*</span></label>
                      <input type="text" value={plannerBusinessType} onChange={e => setPlannerBusinessType(e.target.value)} placeholder="e.g. plumber, roofer, electrician, architect" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-1">Location <span className="text-red-400">*</span></label>
                      <input type="text" value={plannerLocation} onChange={e => setPlannerLocation(e.target.value)} placeholder="e.g. Bristol" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Top Services <span className="text-gray-600">(optional)</span></label>
                      <input type="text" value={plannerServices} onChange={e => setPlannerServices(e.target.value)} placeholder="e.g. boiler repairs, bathroom fitting, emergency plumbing" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm" />
                    </div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-white mb-3">Main Goal</label>
                    <div className="grid grid-cols-2 gap-3">
                      {PLANNER_GOALS.map(g => (
                        <button
                          key={g.value}
                          onClick={() => setPlannerGoal(g.value)}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            plannerGoal === g.value
                              ? "border-teal-400/50 bg-teal-400/10"
                              : "border-white/[0.08] hover:border-white/20"
                          }`}
                        >
                          <p className={`text-sm font-semibold ${plannerGoal === g.value ? "text-teal-400" : "text-white"}`}>{g.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{g.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-white mb-3">Timeframe</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["3", "6", "12"] as PlannerTimeframe[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setPlannerTimeframe(t)}
                          className={`flex flex-col items-center gap-1 p-4 rounded-xl border transition-all ${
                            plannerTimeframe === t
                              ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                              : "border-white/[0.08] text-gray-400 hover:border-white/20"
                          }`}
                        >
                          <span className="text-sm font-bold">{t} months</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                    <label className="block text-sm font-semibold text-white mb-3">Current Website Status</label>
                    <div className="space-y-2">
                      {WEBSITE_STATUSES.map(s => (
                        <button
                          key={s.value}
                          onClick={() => setWebsiteStatus(s.value)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                            websiteStatus === s.value
                              ? "border-teal-400/50 bg-teal-400/10"
                              : "border-white/[0.08] hover:border-white/20"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${websiteStatus === s.value ? "border-teal-400" : "border-gray-600"}`}>
                            {websiteStatus === s.value && <div className="w-2 h-2 rounded-full bg-teal-400" />}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${websiteStatus === s.value ? "text-teal-400" : "text-white"}`}>{s.label}</p>
                            <p className="text-xs text-gray-500">{s.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {plannerError && <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">{plannerError}</div>}

                  <button
                    onClick={handlePlanner}
                    disabled={plannerGenerating || !plannerBusinessType.trim() || !plannerLocation.trim()}
                    className="w-full py-4 rounded-xl font-bold bg-teal-400 text-black hover:bg-teal-300 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3 text-sm"
                  >
                    Generate SEO Plan <span className="opacity-60">(25 tokens)</span>
                  </button>
                </div>
              )}

              {plannerGenerating && (
                <div className="max-w-2xl">
                  <LoadingPanel messages={PLANNER_LOADING} step={plannerLoadingStep} elapsed={plannerElapsed} label="Building your SEO roadmap" />
                </div>
              )}

              {plannerResult && !plannerGenerating && (
                <div className="space-y-6 max-w-4xl">
                  {/* Overview bar */}
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-6 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Strategic Overview</p>
                        <p className="text-sm text-gray-300 leading-relaxed">{plannerResult.overview}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-gray-500 mb-1">Publishing frequency</p>
                        <p className="text-sm font-semibold text-teal-400">{plannerResult.publishingFrequency}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setPlannerResult(null); setPlannerError("") }}
                      className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      ← New plan
                    </button>
                  </div>

                  {/* Quick Wins */}
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      <p className="text-sm font-bold text-teal-400 uppercase tracking-wider">Quick Wins — Do These First</p>
                    </div>
                    <div className="space-y-2">
                      {plannerResult.quickWins?.map((win, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-teal-400 font-bold text-sm shrink-0 mt-0.5">{i + 1}.</span>
                          <p className="text-sm text-gray-300 leading-relaxed">{win}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phases */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Content Roadmap</p>
                    {plannerResult.phases?.map((phase, phaseIdx) => (
                      <div key={phaseIdx} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
                        {/* Phase header */}
                        <button
                          onClick={() => setExpandedPhase(expandedPhase === phaseIdx ? null : phaseIdx)}
                          className="w-full flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-all text-left"
                        >
                          <div className="w-8 h-8 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-teal-400">{phase.phase}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white">{phase.title}</p>
                            <p className="text-xs text-gray-500">{phase.months} · {phase.blogTopics?.length || 0} blog posts</p>
                          </div>
                          <svg className={`w-4 h-4 text-gray-500 transition-transform ${expandedPhase === phaseIdx ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {expandedPhase === phaseIdx && (
                          <div className="border-t border-white/[0.06] p-5 space-y-5">
                            <p className="text-sm text-gray-400 leading-relaxed">{phase.objective}</p>

                            {/* Blog Topics */}
                            {phase.blogTopics && phase.blogTopics.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Blog Posts to Write</p>
                                <div className="space-y-2">
                                  {phase.blogTopics.map((topic, ti) => (
                                    <div key={ti} className="flex items-start justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] group hover:border-white/[0.1] transition-all">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                          <span className={`text-[10px] font-bold ${priorityColor(topic.priority)}`}>{topic.priority}</span>
                                          {topic.intent && <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border ${intentColor(topic.intent)}`}>{topic.intent}</span>}
                                        </div>
                                        <p className="text-sm font-semibold text-white">{topic.title}</p>
                                        <p className="text-xs text-teal-400/80 mt-0.5">Keyword: {topic.keyword}</p>
                                      </div>
                                      <button
                                        onClick={() => usePlannerTopic(topic)}
                                        className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all opacity-0 group-hover:opacity-100 whitespace-nowrap"
                                      >
                                        Write this →
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Other Actions */}
                            {phase.otherActions && phase.otherActions.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Other Actions This Phase</p>
                                <div className="space-y-2">
                                  {phase.otherActions.map((action, ai) => (
                                    <div key={ai} className="flex items-start gap-2">
                                      <svg className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                                      <p className="text-sm text-gray-400">{action}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Beyond Content */}
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
                    <p className="text-sm font-bold text-white p-5 border-b border-white/[0.06]">Beyond Content — What Else You Need</p>
                    {[
                      { key: "technical", label: "Technical SEO", icon: "⚙️" },
                      { key: "googleBusiness", label: "Google Business Profile", icon: "📍" },
                      { key: "citations", label: "Local Citations & Directories", icon: "📋" },
                      { key: "backlinks", label: "Backlink Opportunities", icon: "🔗" },
                    ].map(section => {
                      const items = plannerResult.beyondContent?.[section.key as keyof typeof plannerResult.beyondContent] || []
                      return (
                        <div key={section.key} className="border-b border-white/[0.06] last:border-0">
                          <button
                            onClick={() => setExpandedBeyond(expandedBeyond === section.key ? null : section.key)}
                            className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-all text-left"
                          >
                            <span className="text-sm font-semibold text-white">{section.icon} {section.label}</span>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${expandedBeyond === section.key ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {expandedBeyond === section.key && (
                            <div className="px-5 pb-5 space-y-2">
                              {items.map((item, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <svg className="w-4 h-4 text-teal-400/60 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                                  <p className="text-sm text-gray-300">{item}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Timeline Expectations */}
                  <div className="bg-amber-400/[0.06] border border-amber-400/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                      <p className="text-sm font-bold text-amber-400">Realistic Timeline Expectations</p>
                    </div>
                    <p className="text-sm text-amber-200/70 leading-relaxed">{plannerResult.timelineExpectations}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── HISTORY TAB ───────────────────────────────────────────────────── */}
          {activeTab === "history" && (
            <div className="max-w-3xl">
              {historyLoading && (
                <div className="flex items-center justify-center py-16">
                  <svg className="w-6 h-6 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}
              {!historyLoading && history.length === 0 && (
                <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/[0.08] min-h-[300px]">
                  <div className="text-center px-8 py-16">
                    <p className="text-gray-500 font-medium mb-1">No blogs generated yet</p>
                    <p className="text-gray-600 text-sm">Generate your first article in the Generate tab.</p>
                    <button onClick={() => setActiveTab("generate")} className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all">
                      Go to Generate →
                    </button>
                  </div>
                </div>
              )}
              {!historyLoading && history.length > 0 && (
                <div className="space-y-3">
                  {history.map(item => (
                    <div key={item.id} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.12] transition-all">
                      <p className="text-sm font-bold text-white mb-1 truncate">{item.title}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-teal-400">{item.target_keyword}</span>
                        {item.location && <span className="text-xs text-gray-500">{item.location}</span>}
                        <span className="text-xs text-gray-600">{item.word_count}w</span>
                        <span className="text-xs text-gray-600">{new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
