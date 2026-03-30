"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"
import ChatQA, { type ChatMessage, type ButtonOption, type ChipOption } from "@/app/components/ChatQA"

// ─── Types ───────────────────────────────────────────────────────────────────

type PlanDuration = "1_week" | "2_weeks" | "3_weeks" | "4_weeks" | "full_month"
type PostingFrequency = 1 | 2 | 3 | 4 | 5 | 6 | 7
type FunnelStage = "TOFU" | "MOFU" | "BOFU"

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

interface ProfileData {
  industry?: string | null
  target_audience?: string | null
  goals?: string | null
  desired_outcomes?: string | null
  content_pillars?: string[] | null
  business_name?: string | null
  business_description?: string | null
  tone?: string | null
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GOAL_OPTIONS: ButtonOption[] = [
  { value: "Lead Generation", label: "Lead Generation", description: "Get enquiries, DMs, and calls" },
  { value: "Brand Awareness", label: "Brand Awareness", description: "Reach new people and grow" },
  { value: "Thought Leadership", label: "Thought Leadership", description: "Build expert reputation" },
  { value: "Sales & Conversions", label: "Sales & Conversions", description: "Turn followers into clients" },
  { value: "Community Building", label: "Community Building", description: "Build genuine connections" },
]

const DURATION_OPTIONS: ButtonOption[] = [
  { value: "1_week", label: "1 Week", description: "Quick sprint" },
  { value: "2_weeks", label: "2 Weeks", description: "Short-term plan" },
  { value: "3_weeks", label: "3 Weeks" },
  { value: "4_weeks", label: "4 Weeks", description: "Full month" },
]

const FREQUENCY_OPTIONS: ButtonOption[] = [
  { value: "1", label: "1x per week", description: "Minimal — just staying visible" },
  { value: "2", label: "2x per week", description: "Consistent without the pressure" },
  { value: "3", label: "3x per week", description: "Sweet spot for most people" },
  { value: "4", label: "4x per week", description: "Strong presence, solid growth" },
  { value: "5", label: "5x per week", description: "Weekday domination" },
  { value: "6", label: "6x per week", description: "Near-daily, serious momentum" },
  { value: "7", label: "7x per week", description: "Maximum growth — post every day" },
]

const DEFAULT_PILLARS = [
  "Thought leadership", "Client results", "Behind the scenes",
  "Tips & education", "Industry trends", "Personal stories",
  "Case studies", "Business lessons", "Tool recommendations", "Q&A / Myth busting",
]

const FUNNEL_COLOURS: Record<FunnelStage, string> = {
  TOFU: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  MOFU: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  BOFU: "bg-teal-400/10 text-teal-400 border-teal-400/20",
}

const FORMAT_ICONS: Record<string, string> = {
  "Text Post": "✎", "Image Post": "◻", "Carousel": "⊞", "Long-form Post": "≡", "Poll": "◎",
}

const LOADING_MESSAGES = [
  "Analysing your business goals...",
  "Building your content calendar...",
  "Crafting hooks and descriptions...",
  "Optimising funnel distribution...",
  "Finalising your LinkedIn strategy...",
]

const TOKEN_COST = 25

// ─── Chat Steps ──────────────────────────────────────────────────────────────

type ChatStep =
  | "posted_recently"
  | "top_content"
  | "duration"
  | "goal"
  | "frequency"
  | "topics"
  | "review"
  | "generating"
  | "results"

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LinkedInPlannerPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  // Profile data
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [profileLoaded, setProfileLoaded] = useState(false)

  // Chat state
  const [step, setStep] = useState<ChatStep>("posted_recently")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const msgIdRef = useRef(0)

  // Collected answers
  const [hasPostedRecently, setHasPostedRecently] = useState(false)
  const [topContent, setTopContent] = useState("")
  const [duration, setDuration] = useState<PlanDuration>("4_weeks")
  const [goal, setGoal] = useState("")
  const [frequency, setFrequency] = useState<PostingFrequency>(3)
  const [topics, setTopics] = useState("")
  const [selectedPillars, setSelectedPillars] = useState<string[]>([])

  // Generation state
  const [generating, setGenerating] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState("")

  // Results
  const [plan, setPlan] = useState<ContentPlan | null>(null)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [copiedPost, setCopiedPost] = useState<string | null>(null)
  const [generatingPostId, setGeneratingPostId] = useState<string | null>(null)
  const [generatedPosts, setGeneratedPosts] = useState<Record<string, { full_post: string; writing_score: number }>>({})
  const [generatingAll, setGeneratingAll] = useState(false)
  const [generatingAllProgress, setGeneratingAllProgress] = useState(0)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mountedRef = useRef(true)
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { mountedRef.current = false }
  }, [])

  const nextId = () => `msg-${++msgIdRef.current}`

  const addMessage = useCallback((role: "assistant" | "user", content: string | React.ReactNode, isWidget = false) => {
    setMessages((prev) => [...prev, { id: nextId(), role, content, isWidget }])
  }, [])

  // Load profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const { profile: p } = await res.json()
          setProfile(p)
          if (p?.goals) setGoal(p.goals)
          if (p?.content_pillars?.length) setSelectedPillars(p.content_pillars)
        }
      } catch { /* ignore */ }
      setProfileLoaded(true)
    }
    if (user) loadProfile()
    else setProfileLoaded(true)
  }, [user])

  // Start chat when profile loads
  useEffect(() => {
    if (profileLoaded && messages.length === 0) {
      addMessage("assistant", "Let's build your LinkedIn content plan. First — have you posted on LinkedIn recently?")
    }
  }, [profileLoaded, messages.length, addMessage])

  // ─── Step Handlers ─────────────────────────────────────────────────────────

  const handlePostedRecently = useCallback((value: string) => {
    const yes = value === "yes"
    setHasPostedRecently(yes)
    addMessage("user", yes ? "Yes, I've been posting" : "No, I'm starting fresh")

    if (yes) {
      addMessage("assistant", "Great! Share your top 3 best-performing posts — paste the topics, hooks, or the content itself. This helps me optimise your plan based on what already works.")
      setStep("top_content")
    } else {
      addMessage("assistant", "No problem — we'll build from scratch. How long should your content plan be?")
      setStep("duration")
    }
  }, [addMessage])

  const handleTopContent = useCallback((text: string) => {
    setTopContent(text)
    addMessage("user", text)
    addMessage("assistant", "Got it — I'll use those as reference. How long should your content plan be?")
    setStep("duration")
  }, [addMessage])

  const handleDuration = useCallback((value: string) => {
    setDuration(value as PlanDuration)
    const label = DURATION_OPTIONS.find((d) => d.value === value)?.label || value
    addMessage("user", label)

    const goalQuestion = profile?.goals
      ? `What's your primary goal? Based on your profile, I'd suggest "${profile.goals}" — but feel free to change it.`
      : "What's your primary goal for this plan?"
    addMessage("assistant", goalQuestion)
    setStep("goal")
  }, [addMessage, profile])

  const handleGoal = useCallback((value: string) => {
    setGoal(value)
    addMessage("user", value)
    addMessage("assistant", "How often do you want to post? Pick whatever fits your schedule — more posts means faster growth, but consistency matters more than volume.")
    setStep("frequency")
  }, [addMessage])

  const handleFrequency = useCallback((value: string) => {
    const freq = Number(value) as PostingFrequency
    setFrequency(freq)
    addMessage("user", `${freq}x per week`)
    addMessage("assistant", "Any specific topics or themes you want to focus on? Select from the pillars below, or skip to let me choose for you.")
    setStep("topics")
  }, [addMessage])

  const handleTopicsSkip = useCallback(() => {
    addMessage("user", "No specific topics — surprise me")
    setStep("review")
  }, [addMessage])

  const handlePillarsSubmit = useCallback((selected: string[]) => {
    setSelectedPillars(selected)
    addMessage("user", selected.join(", "))
    setStep("review")
  }, [addMessage])

  // ─── Generate Plan ─────────────────────────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    if (!user) {
      router.push("/login?redirect=/dashboard/linkedin/planner")
      return
    }
    if (tokenBalance < TOKEN_COST) {
      setError(`Insufficient tokens. You need ${TOKEN_COST} but have ${tokenBalance}.`)
      return
    }

    setStep("generating")
    setGenerating(true)
    setError("")
    setPlan(null)
    setLoadingStep(0)

    loadingIntervalRef.current = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 4000)

    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

    try {
      const res = await fetch("/api/generate/linkedin-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          postsPerWeek: frequency,
          duration,
          topPerformingContent: topContent || undefined,
          industry: profile?.industry || "",
          businessDescription: profile?.business_description || "",
          targetAudience: profile?.target_audience || "",
          audienceSize: "1K-10K",
          goals: goal,
          desiredOutcomes: profile?.desired_outcomes || "",
          contentPillars: selectedPillars.length > 0 ? selectedPillars : undefined,
          enabledFormats: ["Text Post", "Image Post", "Carousel", "Long-form Post", "Poll"],
          additionalTopics: topics || undefined,
        }),
      })

      if (!mountedRef.current) return
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Generation failed. Please try again.")
        setStep("review")
        return
      }

      setPlan(data.plan as ContentPlan)
      refreshBalance()

      // Save plan to Supabase (non-blocking)
      try {
        await fetch("/api/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: data.plan }),
        })
      } catch { /* non-critical */ }

      setStep("results")
    } catch (err) {
      if (mountedRef.current) {
        const isTimeout = err instanceof DOMException && err.name === "AbortError"
        setError(isTimeout ? "Generation timed out." : "Something went wrong.")
        setStep("review")
      }
    } finally {
      if (loadingIntervalRef.current) { clearInterval(loadingIntervalRef.current); loadingIntervalRef.current = null }
      if (mountedRef.current) setGenerating(false)
    }
  }, [user, tokenBalance, router, frequency, duration, topContent, goal, topics, selectedPillars, profile, refreshBalance])

  // ─── Generate Individual Post ──────────────────────────────────────────────

  const mapGoalToApi = (g: string) => {
    if (g.includes("Lead") || g.includes("Sales")) return "leads"
    if (g.includes("Awareness") || g.includes("Community")) return "engagement"
    if (g.includes("Thought")) return "authority"
    return "engagement"
  }

  const handleGeneratePost = useCallback(async (post: PlannedPost) => {
    if (!user || generatingPostId) return
    setGeneratingPostId(post.id)

    try {
      const res = await fetch("/api/generate/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "single",
          content: `${post.caption_hook}\n\n${post.description}\n\nTopic: ${post.title}\nFormat: ${post.format}\nPillar: ${post.pillar}`,
          goal: mapGoalToApi(goal),
          format: "auto",
        }),
      })

      const data = await res.json()
      if (res.ok && data.posts?.[0]) {
        setGeneratedPosts((prev) => ({
          ...prev,
          [post.id]: { full_post: data.posts[0].full_post, writing_score: data.posts[0].writing_score },
        }))
        refreshBalance()
      }
    } catch { /* ignore */ }
    setGeneratingPostId(null)
  }, [user, generatingPostId, goal, refreshBalance])

  // ─── Generate All Posts ────────────────────────────────────────────────────

  const handleGenerateAllPosts = useCallback(async () => {
    if (!plan?.posts || generatingAll) return
    setGeneratingAll(true)
    setGeneratingAllProgress(0)

    const ungenerated = plan.posts.filter((p) => !generatedPosts[p.id])

    for (let i = 0; i < ungenerated.length; i++) {
      const post = ungenerated[i]
      setGeneratingAllProgress(i + 1)
      setGeneratingPostId(post.id)

      try {
        const res = await fetch("/api/generate/linkedin-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "single",
            content: `${post.caption_hook}\n\n${post.description}\n\nTopic: ${post.title}\nFormat: ${post.format}\nPillar: ${post.pillar}`,
            goal: mapGoalToApi(goal),
            format: "auto",
          }),
        })

        const data = await res.json()
        if (res.ok && data.posts?.[0]) {
          setGeneratedPosts((prev) => ({
            ...prev,
            [post.id]: { full_post: data.posts[0].full_post, writing_score: data.posts[0].writing_score },
          }))
          refreshBalance()
        }
      } catch { /* continue */ }
    }

    setGeneratingPostId(null)
    setGeneratingAll(false)
  }, [plan, generatingAll, generatedPosts, goal, refreshBalance])

  // ─── Copy ──────────────────────────────────────────────────────────────────

  const handleCopyPost = useCallback(async (text: string, postId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPost(postId)
      setTimeout(() => { if (mountedRef.current) setCopiedPost(null) }, 2000)
    } catch { setError("Failed to copy.") }
  }, [])

  const handleReset = useCallback(() => {
    setMessages([])
    setStep("posted_recently")
    setPlan(null)
    setExpandedPost(null)
    setError("")
    setGeneratedPosts({})
    setHasPostedRecently(false)
    setTopContent("")
    setTopics("")
    msgIdRef.current = 0
    setTimeout(() => {
      addMessage("assistant", "Let's build your LinkedIn content plan. First — have you posted on LinkedIn recently?")
    }, 100)
  }, [addMessage])

  // ─── Input Mode ────────────────────────────────────────────────────────────

  const getInputMode = () => {
    if (step === "posted_recently") return "buttons" as const
    if (step === "top_content") return "textarea" as const
    if (step === "duration") return "buttons" as const
    if (step === "goal") return "buttons" as const
    if (step === "frequency") return "buttons" as const
    if (step === "topics") return "chips" as const
    return "none" as const
  }

  const getButtonOptions = (): ButtonOption[] => {
    if (step === "posted_recently") return [
      { value: "yes", label: "Yes", description: "I've been posting recently" },
      { value: "no", label: "No", description: "Starting fresh or haven't posted in a while" },
    ]
    if (step === "duration") return DURATION_OPTIONS
    if (step === "goal") return GOAL_OPTIONS
    if (step === "frequency") return FREQUENCY_OPTIONS
    return []
  }

  const getChipOptions = (): ChipOption[] => {
    if (step !== "topics") return []
    return DEFAULT_PILLARS.map((p) => ({
      value: p,
      label: p,
      selected: selectedPillars.includes(p),
    }))
  }

  const handleButtonSelect = (value: string) => {
    if (step === "posted_recently") handlePostedRecently(value)
    else if (step === "duration") handleDuration(value)
    else if (step === "goal") handleGoal(value)
    else if (step === "frequency") handleFrequency(value)
  }

  const formatMonthDisplay = (m: string) => {
    const [y, mo] = m.split("-").map(Number)
    return new Date(y, mo - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
  }

  // ─── Render ────────────────────────────────────────────────────────────────

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
            <p className="text-gray-500">Build a strategic LinkedIn content plan through a quick conversation.</p>
          </div>

          {/* Chat + Results */}
          {step !== "results" ? (
            <div className="max-w-2xl">
              <ChatQA
                messages={messages}
                inputMode={step === "review" || step === "generating" ? "none" : getInputMode()}
                buttonOptions={getButtonOptions()}
                chipOptions={getChipOptions()}
                placeholder="Paste your top performing content or describe the topics..."
                optional={step === "topics"}
                onSubmitText={step === "top_content" ? handleTopContent : undefined}
                onSelectButton={handleButtonSelect}
                onSubmitChips={handlePillarsSubmit}
                onSkip={handleTopicsSkip}
                loading={generating}
                loadingMessage={LOADING_MESSAGES[loadingStep]}
              >
                {/* Review card */}
                {step === "review" && (
                  <div className="mt-4 animate-[fadeSlideIn_0.3s_ease-out]">
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                      <h3 className="text-lg font-bold text-white">Your plan summary</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Duration</p>
                          <p className="text-white font-medium">{DURATION_OPTIONS.find((d) => d.value === duration)?.label}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Goal</p>
                          <p className="text-white font-medium">{goal}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Frequency</p>
                          <p className="text-white font-medium">{frequency}x per week</p>
                        </div>
                        {hasPostedRecently && topContent && (
                          <div>
                            <p className="text-gray-500 text-xs">Top content</p>
                            <p className="text-white font-medium truncate">Provided</p>
                          </div>
                        )}
                      </div>
                      {selectedPillars.length > 0 && (
                        <div>
                          <p className="text-gray-500 text-xs mb-2">Pillars</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPillars.map((p) => (
                              <span key={p} className="px-2.5 py-1 text-xs rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400">{p}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {error && (
                        <div className="p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">{error}</div>
                      )}

                      <button
                        onClick={handleGenerate}
                        className="w-full py-4 px-6 rounded-xl text-sm font-bold bg-teal-400 text-black hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all"
                      >
                        Generate Content Plan
                        <span className="ml-2 text-xs opacity-75">({TOKEN_COST} tokens)</span>
                      </button>
                    </div>
                  </div>
                )}
              </ChatQA>
            </div>
          ) : plan ? (
            /* ─── Results View ─── */
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

              {/* Generate All Posts */}
              {plan.posts && plan.posts.length > 0 && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleGenerateAllPosts}
                    disabled={generatingAll || Object.keys(generatedPosts).length === plan.posts.length}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                      generatingAll || Object.keys(generatedPosts).length === plan.posts.length
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-teal-400 text-black hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]"
                    }`}
                  >
                    {generatingAll
                      ? `Generating... ${generatingAllProgress}/${plan.posts.filter((p) => !generatedPosts[p.id]).length}`
                      : Object.keys(generatedPosts).length === plan.posts.length
                        ? "All Posts Generated"
                        : `Generate All Posts (${plan.posts.filter((p) => !generatedPosts[p.id]).length * 3} tokens)`}
                  </button>
                  {Object.keys(generatedPosts).length > 0 && (
                    <span className="text-xs text-gray-500">{Object.keys(generatedPosts).length}/{plan.posts.length} generated</span>
                  )}
                </div>
              )}

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
                        <div className="shrink-0 text-center w-12">
                          <p className="text-xs font-semibold text-gray-600 uppercase">{post.dayOfWeek?.slice(0, 3)}</p>
                          <p className="text-xl font-bold text-white leading-none mt-0.5">{post.date?.split("-")[2]}</p>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${FUNNEL_COLOURS[post.funnel_stage]}`}>{post.funnel_stage}</span>
                            <span className="text-[10px] font-medium text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
                              {FORMAT_ICONS[post.format] || "◻"} {post.format}
                            </span>
                            <span className="text-[10px] text-gray-600">{post.posting_time}</span>
                            {generatedPosts[post.id] && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-400/10 text-teal-400 border border-teal-400/20">Generated</span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-white truncate">{post.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 italic truncate">&ldquo;{post.caption_hook}&rdquo;</p>
                        </div>

                        <svg className={`w-4 h-4 text-gray-600 shrink-0 transition-transform mt-1 ${expandedPost === post.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {expandedPost === post.id && (
                      <div className="border-t border-white/[0.06] p-5 md:p-6 space-y-5">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hook</p>
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
                                <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400">#{tag}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {generatedPosts[post.id] && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Post</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-teal-400 font-bold">Score: {generatedPosts[post.id].writing_score}</span>
                                <button
                                  onClick={() => handleCopyPost(generatedPosts[post.id].full_post, post.id)}
                                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all"
                                >
                                  {copiedPost === post.id ? "Copied!" : "Copy"}
                                </button>
                              </div>
                            </div>
                            <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                              <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-[family-name:var(--font-geist-sans)]">
                                {generatedPosts[post.id].full_post}
                              </pre>
                            </div>
                          </div>
                        )}

                        {!generatedPosts[post.id] && (
                          <button
                            onClick={() => handleGeneratePost(post)}
                            disabled={generatingPostId === post.id}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                              generatingPostId === post.id
                                ? "bg-white/[0.04] border border-white/[0.06] text-gray-500"
                                : "bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-teal-400 hover:border-teal-400/30 hover:bg-teal-400/5"
                            }`}
                          >
                            {generatingPostId === post.id ? (
                              <>
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Generating...
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                                Generate Full Post (3 tokens)
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-3 text-sm font-semibold rounded-xl bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"
              >
                ← New Plan
              </button>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}
