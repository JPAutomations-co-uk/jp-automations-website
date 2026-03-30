"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"
import ChatQA, { type ChatMessage, type ButtonOption } from "@/app/components/ChatQA"

// ─── Types ───────────────────────────────────────────────────────────────────

type PostGoal = "engagement" | "leads" | "authority" | "shares"
type PostFormat = "auto" | "text_post" | "story" | "step_by_step" | "bold_claim" | "hot_take"

type ChatStep =
  | "checking_plan"
  | "plan_prompt"
  | "content_input"
  | "goal_select"
  | "format_select"
  | "confirm"
  | "generating"
  | "batch_generating"
  | "results"

interface GeneratedPost {
  hook: string
  body: string
  cta: string
  hashtags: string[]
  full_post: string
  writing_score: number
  writing_tips: string[]
  input_index?: number
  input_summary?: string
  // For plan posts
  planPostTitle?: string
  planPostId?: string
}

interface PlanPost {
  id: string
  date: string
  dayOfWeek: string
  title: string
  description: string
  format: string
  funnel_stage: string
  pillar: string
  caption_hook: string
  caption_body: string
  posting_time: string
  hashtags: string[]
  why_it_works: string
  engagement_tip: string
  status: string
  hasFullPost: boolean
}

interface SavedPlan {
  id: string
  month: string
  goals: string
  created_at: string
  posts: PlanPost[]
}

interface ProfileData {
  industry?: string
  target_audience?: string
  goals?: string
  desired_outcomes?: string
  tone?: string
  content_pillars?: string[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TOKEN_COST_SINGLE = 3

const GOALS: ButtonOption[] = [
  { value: "engagement", label: "Engagement", description: "Maximise comments and discussion" },
  { value: "leads", label: "Lead Generation", description: "Drive DMs, calls, and enquiries" },
  { value: "authority", label: "Thought Leadership", description: "Build expert reputation" },
  { value: "shares", label: "Reshares", description: "Content people send to their network" },
]

const FORMATS: ButtonOption[] = [
  { value: "auto", label: "Auto", description: "AI picks the best format" },
  { value: "text_post", label: "Text Post", description: "Personal, direct, conversational" },
  { value: "story", label: "Hook → Story → Lesson", description: "Story with a takeaway" },
  { value: "step_by_step", label: "Step-by-Step", description: "Numbered actionable steps" },
  { value: "bold_claim", label: "Bold Claim", description: "Counterintuitive statement + proof" },
  { value: "hot_take", label: "Hot Take", description: "Contrarian opinion that sparks debate" },
]

const LOADING_MESSAGES = [
  "Crafting your hook...",
  "Structuring for maximum dwell time...",
  "Writing your opening lines...",
  "Optimising for LinkedIn's algorithm...",
  "Polishing for authenticity...",
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function msgId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
}

function mapGoalLabel(goal: PostGoal): string {
  return GOALS.find((g) => g.value === goal)?.label || goal
}

function mapFormatLabel(format: PostFormat): string {
  return FORMATS.find((f) => f.value === format)?.label || format
}

function WritingScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
  const color =
    score >= 80
      ? "bg-teal-400/10 text-teal-400 border-teal-400/20"
      : score >= 60
        ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
        : "bg-red-400/10 text-red-400 border-red-400/20"
  const sizeClass = size === "sm" ? "w-10 h-10 text-xs" : "w-14 h-14 text-sm"
  return (
    <div className={`${sizeClass} ${color} rounded-full border flex items-center justify-center font-bold shrink-0`}>
      {score}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LinkedInWritePage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [step, setStep] = useState<ChatStep>("checking_plan")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Inputs collected through chat
  const [content, setContent] = useState("")
  const [goal, setGoal] = useState<PostGoal>("engagement")
  const [format, setFormat] = useState<PostFormat>("auto")

  // Plan data
  const [savedPlan, setSavedPlan] = useState<SavedPlan | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [generateFromPlan, setGenerateFromPlan] = useState(false)

  // Generation state
  const [posts, setPosts] = useState<GeneratedPost[]>([])
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 })
  const [loadingMessage, setLoadingMessage] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [error, setError] = useState("")

  // Image generation state
  const [generatingImageFor, setGeneratingImageFor] = useState<number | null>(null)
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({})

  const mountedRef = useRef(true)
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current)
    }
  }, [])

  // ─── On mount: fetch profile + check for plan ─────────────────────────────

  useEffect(() => {
    async function init() {
      // Fetch profile
      try {
        const profileRes = await fetch("/api/profile")
        if (profileRes.ok) {
          const profileJson = await profileRes.json()
          if (profileJson.profile) {
            setProfileData(profileJson.profile)
          }
        }
      } catch { /* non-critical */ }

      // Check for saved plan
      try {
        const planRes = await fetch("/api/plans")
        if (planRes.ok) {
          const planJson = await planRes.json()
          if (planJson.plan && planJson.plan.posts?.length > 0) {
            setSavedPlan(planJson.plan)
            const ungenerated = planJson.plan.posts.filter((p: PlanPost) => !p.hasFullPost)
            if (ungenerated.length > 0) {
              addMessages([
                {
                  id: msgId(),
                  role: "assistant",
                  content: `You have a content plan with ${planJson.plan.posts.length} posts (${ungenerated.length} still need full content). Want to generate from your plan, or write something new?`,
                },
              ])
              setStep("plan_prompt")
              return
            }
          }
        }
      } catch { /* non-critical */ }

      // No plan or all posts generated — go to content input
      addMessages([
        {
          id: msgId(),
          role: "assistant",
          content: "What do you want to write about? Describe a topic, share a story, or paste an idea.",
        },
      ])
      setStep("content_input")
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Message helpers ──────────────────────────────────────────────────────

  const addMessages = useCallback((newMsgs: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...newMsgs])
  }, [])

  // ─── Step handlers ────────────────────────────────────────────────────────

  const handlePlanPrompt = useCallback((value: string) => {
    if (value === "from_plan") {
      addMessages([
        { id: msgId(), role: "user", content: "Generate from my plan" },
        { id: msgId(), role: "assistant", content: "I'll generate full posts for every planned topic that doesn't have content yet. This will use 3 tokens per post." },
      ])
      setGenerateFromPlan(true)
      // Jump straight to batch generation
      setStep("confirm")
    } else {
      addMessages([
        { id: msgId(), role: "user", content: "Write something new" },
        { id: msgId(), role: "assistant", content: "What do you want to write about? Describe a topic, share a story, or paste an idea." },
      ])
      setStep("content_input")
    }
  }, [addMessages])

  const handleContentSubmit = useCallback((text: string) => {
    setContent(text)
    const truncated = text.length > 100 ? text.slice(0, 100) + "..." : text
    addMessages([
      { id: msgId(), role: "user", content: truncated },
      { id: msgId(), role: "assistant", content: "What's the goal for this post?" },
    ])
    setStep("goal_select")
  }, [addMessages])

  const handleGoalSelect = useCallback((value: string) => {
    setGoal(value as PostGoal)
    addMessages([
      { id: msgId(), role: "user", content: mapGoalLabel(value as PostGoal) },
      { id: msgId(), role: "assistant", content: "Pick a format, or let AI choose the best one." },
    ])
    setStep("format_select")
  }, [addMessages])

  const handleFormatSelect = useCallback((value: string) => {
    setFormat(value as PostFormat)
    addMessages([
      { id: msgId(), role: "user", content: mapFormatLabel(value as PostFormat) },
    ])
    setStep("confirm")
  }, [addMessages])

  // ─── Generation: single post ──────────────────────────────────────────────

  const generateSinglePost = useCallback(async () => {
    if (!user) {
      router.push("/login?redirect=/dashboard/linkedin")
      return
    }
    if (tokenBalance < TOKEN_COST_SINGLE) {
      setError(`Insufficient tokens. You need ${TOKEN_COST_SINGLE} but have ${tokenBalance}.`)
      return
    }

    setStep("generating")
    setError("")
    let msgStep = 0
    loadingIntervalRef.current = setInterval(() => {
      msgStep = (msgStep + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[msgStep])
    }, 3000)
    setLoadingMessage(LOADING_MESSAGES[0])

    try {
      const res = await fetch("/api/generate/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "single",
          content: content.trim(),
          goal,
          format,
        }),
      })

      if (!mountedRef.current) return
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Generation failed")
        setStep("confirm")
        return
      }

      setPosts(data.posts || [])
      refreshBalance()
      setStep("results")
    } catch {
      if (mountedRef.current) setError("Something went wrong. Please try again.")
      setStep("confirm")
    } finally {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
        loadingIntervalRef.current = null
      }
    }
  }, [user, tokenBalance, content, goal, format, refreshBalance, router])

  // ─── Generation: batch from plan ──────────────────────────────────────────

  const generateFromPlanBatch = useCallback(async () => {
    if (!savedPlan || !user) return

    const ungeneratedPosts = savedPlan.posts.filter((p) => !p.hasFullPost)
    const totalCost = ungeneratedPosts.length * TOKEN_COST_SINGLE

    if (tokenBalance < totalCost) {
      setError(`Need ${totalCost} tokens but have ${tokenBalance}.`)
      return
    }

    setStep("batch_generating")
    setError("")
    setBatchProgress({ current: 0, total: ungeneratedPosts.length })

    const results: GeneratedPost[] = []

    for (let i = 0; i < ungeneratedPosts.length; i++) {
      if (!mountedRef.current) break

      const planPost = ungeneratedPosts[i]
      setBatchProgress({ current: i + 1, total: ungeneratedPosts.length })
      setLoadingMessage(`Generating post ${i + 1} of ${ungeneratedPosts.length}: "${planPost.title}"`)

      try {
        const brief = `Topic: ${planPost.title}\nFormat: ${planPost.format}\nDescription: ${planPost.description}`
        const res = await fetch("/api/generate/linkedin-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "single",
            content: brief,
            goal: savedPlan.goals === "Lead Generation" ? "leads"
              : savedPlan.goals === "Brand Awareness" ? "engagement"
              : savedPlan.goals === "Thought Leadership" ? "authority"
              : savedPlan.goals === "Sales & Conversions" ? "leads"
              : "engagement",
            format: planPost.format?.toLowerCase().replace(/[→\s]+/g, "_").replace("hook_story_lesson", "story") || "auto",
          }),
        })

        const data = await res.json()
        if (res.ok && data.posts?.length > 0) {
          const generated = {
            ...data.posts[0],
            planPostTitle: planPost.title,
            planPostId: planPost.id,
          }
          results.push(generated)
        }
      } catch {
        // Skip failed posts, continue batch
      }
    }

    if (mountedRef.current) {
      setPosts(results)
      refreshBalance()
      setStep("results")
    }
  }, [savedPlan, user, tokenBalance, refreshBalance])

  // ─── Image generation ─────────────────────────────────────────────────────

  const handleGenerateImage = useCallback(async (postIndex: number) => {
    const post = posts[postIndex]
    if (!post) return

    setGeneratingImageFor(postIndex)
    try {
      const prompt = `Professional LinkedIn post image. Topic: ${post.hook}. Style: clean, modern, corporate-friendly. No text overlay.`
      const res = await fetch("/api/generate/linkedin-image-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio: "1:1" }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.imageUrl) {
          setGeneratedImages((prev) => ({ ...prev, [postIndex]: data.imageUrl }))
        }
      }
    } catch { /* non-critical */ }
    setGeneratingImageFor(null)
  }, [posts])

  // ─── Copy ─────────────────────────────────────────────────────────────────

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => { if (mountedRef.current) setCopiedIndex(null) }, 2000)
    } catch { /* ignore */ }
  }, [])

  // ─── Reset ────────────────────────────────────────────────────────────────

  const handleNewPost = useCallback(() => {
    setPosts([])
    setContent("")
    setGoal("engagement")
    setFormat("auto")
    setGenerateFromPlan(false)
    setError("")
    setGeneratedImages({})
    setMessages([
      { id: msgId(), role: "assistant", content: "What do you want to write about? Describe a topic, share a story, or paste an idea." },
    ])
    setStep("content_input")
  }, [])

  // ─── Confirm action (triggers generation) ─────────────────────────────────

  useEffect(() => {
    if (step === "confirm") {
      if (generateFromPlan) {
        generateFromPlanBatch()
      } else {
        generateSinglePost()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // ─── Chat input mode per step ─────────────────────────────────────────────

  const getInputMode = (): "none" | "buttons" | "textarea" => {
    switch (step) {
      case "plan_prompt": return "buttons"
      case "content_input": return "textarea"
      case "goal_select": return "buttons"
      case "format_select": return "buttons"
      default: return "none"
    }
  }

  const getButtonOptions = (): ButtonOption[] => {
    switch (step) {
      case "plan_prompt": {
        const ungenerated = savedPlan?.posts.filter((p) => !p.hasFullPost).length || 0
        return [
          { value: "from_plan", label: `Generate all (${ungenerated} posts)`, description: `${ungenerated * TOKEN_COST_SINGLE} tokens` },
          { value: "new_ideas", label: "Write something new", description: "Start from scratch" },
        ]
      }
      case "goal_select": {
        const opts = [...GOALS]
        if (profileData?.goals) {
          const profileGoal = GOALS.find((g) => g.label.toLowerCase().includes(profileData.goals!.toLowerCase().split(" ")[0]))
          if (profileGoal) {
            return [
              { ...profileGoal, label: `${profileGoal.label} (profile default)` },
              ...opts.filter((g) => g.value !== profileGoal.value),
            ]
          }
        }
        return opts
      }
      case "format_select": return FORMATS
      default: return []
    }
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
              <a href="/login?redirect=/dashboard/linkedin" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all hover:scale-105">
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

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <a href="/" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <AppsMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
          {user ? (
            <>
              <div className="flex items-center gap-2 mt-4">
                <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                </svg>
                <span className="text-lg font-semibold text-teal-400">{tokenBalance} tokens</span>
              </div>
              <a href="/dashboard/settings" className="text-lg text-gray-500 hover:text-teal-400 transition-colors mt-2" onClick={() => setIsMobileMenuOpen(false)}>Settings</a>
            </>
          ) : (
            <a href="/login?redirect=/dashboard/linkedin" className="text-4xl font-bold text-teal-400 hover:text-teal-300 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign In</a>
          )}
        </div>
      </div>

      {/* Main */}
      <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

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
              <span className="text-sm font-medium text-gray-300">LinkedIn Content Engine</span>
            </div>

            {/* Tab Nav */}
            <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6 max-w-sm">
              <span className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">
                Write
              </span>
              <a href="/dashboard/linkedin/planner" className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Plan
              </a>
              <a href="/dashboard/linkedin/images" className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Images
              </a>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Write Posts</h1>
            <p className="text-gray-500">Generate LinkedIn posts that stop the scroll and drive real engagement.</p>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm mb-6">
              {error}
              <button onClick={() => setError("")} className="ml-3 underline text-xs">Dismiss</button>
            </div>
          )}

          {/* Chat Q&A Flow (before results) */}
          {step !== "results" && (
            <ChatQA
              messages={messages}
              inputMode={getInputMode()}
              buttonOptions={getButtonOptions()}
              placeholder="Describe your topic, a story, a lesson, or an idea..."
              onSubmitText={step === "content_input" ? handleContentSubmit : undefined}
              onSelectButton={
                step === "plan_prompt" ? handlePlanPrompt
                : step === "goal_select" ? handleGoalSelect
                : step === "format_select" ? handleFormatSelect
                : undefined
              }
              loading={step === "generating" || step === "batch_generating" || step === "checking_plan"}
              loadingMessage={
                step === "checking_plan" ? "Checking for saved plans..."
                : step === "batch_generating" ? loadingMessage || `Generating post ${batchProgress.current} of ${batchProgress.total}...`
                : loadingMessage || LOADING_MESSAGES[0]
              }
            >
              {/* Batch progress bar */}
              {step === "batch_generating" && batchProgress.total > 0 && (
                <div className="animate-[fadeSlideIn_0.3s_ease-out]">
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-white">Generating posts from plan</p>
                      <p className="text-sm text-teal-400 font-mono">{batchProgress.current}/{batchProgress.total}</p>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 animate-pulse">{loadingMessage}</p>
                  </div>
                </div>
              )}
            </ChatQA>
          )}

          {/* Results */}
          {step === "results" && posts.length > 0 && (
            <div className="space-y-6 animate-[fadeSlideIn_0.3s_ease-out]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-white">
                  {posts.length === 1 ? "Your post is ready" : `${posts.length} posts generated`}
                </p>
              </div>

              {posts.map((post, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-start justify-between p-5 md:p-6">
                    <div className="flex-1 min-w-0">
                      {post.planPostTitle && (
                        <p className="text-xs text-gray-600 mb-1">From plan: {post.planPostTitle}</p>
                      )}
                      <p className="text-lg font-bold text-white italic truncate">&ldquo;{post.hook}&rdquo;</p>
                    </div>
                    <WritingScoreBadge score={post.writing_score} />
                  </div>

                  {/* Post breakdown */}
                  <div className="border-t border-white/[0.06] p-5 md:p-6 space-y-5">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hook (before &ldquo;see more&rdquo;)</p>
                      <p className="text-base font-bold text-white italic">&ldquo;{post.hook}&rdquo;</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Body</p>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{post.body}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Call to Action</p>
                      <p className="text-sm font-semibold text-teal-400">{post.cta}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hashtags</p>
                      <div className="flex flex-wrap gap-2">
                        {post.hashtags.map((tag, ti) => (
                          <span key={ti} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Full post block */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Full Post</p>
                      <div className="relative bg-black/40 border border-white/10 rounded-xl p-5">
                        <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-[family-name:var(--font-geist-sans)]">
                          {post.full_post}
                        </pre>
                        <button
                          onClick={() => handleCopy(post.full_post, i)}
                          className="absolute top-3 right-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all"
                        >
                          {copiedIndex === i ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    {/* Writing tips */}
                    {post.writing_tips?.length > 0 && (
                      <PostTips tips={post.writing_tips} />
                    )}

                    {/* Image generation */}
                    <div className="pt-2 border-t border-white/[0.06]">
                      {generatedImages[i] ? (
                        <div className="space-y-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Generated Image</p>
                          <img
                            src={generatedImages[i]}
                            alt="Generated post image"
                            className="w-full max-w-md rounded-xl border border-white/[0.08]"
                          />
                          <a
                            href={generatedImages[i]}
                            download={`linkedin-post-${i + 1}.png`}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </a>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleGenerateImage(i)}
                          disabled={generatingImageFor === i}
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-teal-400 hover:border-teal-400/30 hover:bg-teal-400/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {generatingImageFor === i ? (
                            <>
                              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Generating image...
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                              </svg>
                              Generate Image (3 tokens)
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Action bar */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  onClick={handleNewPost}
                  className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all"
                >
                  New Post
                </button>
                {posts.length > 1 && (
                  <button
                    onClick={async () => {
                      const all = posts.map((p, i) => `--- Post ${i + 1} ---\n${p.full_post}`).join("\n\n")
                      handleCopy(all, -1)
                    }}
                    className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    {copiedIndex === -1 ? "Copied All!" : "Copy All"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* No results fallback */}
          {step === "results" && posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 mb-4">No posts were generated. Please try again.</p>
              <button
                onClick={handleNewPost}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-teal-400 text-black hover:bg-teal-300 transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function PostTips({ tips }: { tips: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
      >
        Writing Tips ({tips.length})
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="mt-3 space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
              <span className="text-teal-400 mt-0.5 shrink-0">&bull;</span>
              {tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
