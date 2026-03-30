"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import ChatQA, { type ChatMessage, type ButtonOption, type ChipOption } from "@/app/components/ChatQA"
import FeedbackButtons from "@/app/components/FeedbackButtons"
import { IMAGE_STYLES, STYLE_COPY_HINTS } from "@/app/dashboard/social-engine/linkedin/images/page"

// ─── Types ───────────────────────────────────────────────────────────────────

type PlanDuration = "1_week" | "2_weeks" | "3_weeks" | "4_weeks" | "full_month"
type PostingFrequency = 1 | 2 | 3 | 4 | 5 | 6 | 7
type FunnelStage = "TOFU" | "MOFU" | "BOFU"
type PostGenPhase =
  | "idle"
  | "hooks"
  | "goal"
  | "cta"
  | "generating"
  | "result"
  | "image_style"
  | "image_copy_review"
  | "image_result"

interface PostFlowState {
  phase: PostGenPhase
  hooks: string[]
  selectedHook: string
  goal: string
  cta: string
  generatingHooks: boolean
  imageStyle: string
  imageCopy: string
  imageGeneratingCopy: boolean
  imagePrompt: string | null
}

interface PostVariant {
  title: string
  description: string
  caption_hook: string
}

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
  variants?: PostVariant[]
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

const DEFAULT_POST_FLOW: PostFlowState = {
  phase: "idle",
  hooks: [],
  selectedHook: "",
  goal: "",
  cta: "",
  generatingHooks: false,
  imageStyle: "dark_stat_card",
  imageCopy: "",
  imageGeneratingCopy: false,
  imagePrompt: null,
}

const POST_GOAL_OPTIONS = [
  { value: "awareness", label: "Give away free value", description: "Educate and add value" },
  { value: "leads", label: "Attract leads", description: "Get enquiries and DMs" },
  { value: "authority", label: "Build authority", description: "Establish expert reputation" },
  { value: "engagement", label: "Start a conversation", description: "Drive comments and discussion" },
  { value: "leads_offer", label: "Promote an offer", description: "Turn followers into clients" },
  { value: "shares", label: "Drive to content", description: "Push to a link or resource" },
]

const POST_CTA_OPTIONS = [
  { value: "DM me [KEYWORD]", label: "DM me [KEYWORD]" },
  { value: "Book a free call", label: "Book a free call" },
  { value: "Comment below", label: "Comment below" },
  { value: "Follow for more", label: "Follow for more" },
  { value: "Link in bio", label: "Link in bio" },
  { value: "", label: "No CTA" },
]

const GOALS_WITH_CTA_POST = ["leads", "leads_offer"]

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

const DURATION_WEEKS: Record<PlanDuration, number> = {
  "1_week": 1,
  "2_weeks": 2,
  "3_weeks": 3,
  "4_weeks": 4,
  "full_month": 4,
}
const getDurationDays = (d: PlanDuration) => DURATION_WEEKS[d] * 7

// ─── Chat Steps ──────────────────────────────────────────────────────────────

type ChatStep =
  | "verify_profile"
  | "posted_recently"
  | "top_content"
  | "duration"
  | "goal"
  | "frequency"
  | "images"
  | "images_count"
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
  const [wantsImages, setWantsImages] = useState(false)
  const [imagesPerWeek, setImagesPerWeek] = useState(0)
  const [topics, setTopics] = useState("")
  const [selectedPillars, setSelectedPillars] = useState<string[]>([])
  const [verifyTopContent, setVerifyTopContent] = useState("")

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

  // Variant selection (per post) and Generate All modal
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({})
  const [showGenerateAllModal, setShowGenerateAllModal] = useState(false)
  const [generateAllNotes, setGenerateAllNotes] = useState("")

  // Per-post inline generation flow
  const [postFlows, setPostFlows] = useState<Record<string, PostFlowState>>({})
  const [copiedImagePost, setCopiedImagePost] = useState<string | null>(null)

  const mountedRef = useRef(true)
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { mountedRef.current = false }
  }, [])

  // Warn before leaving when a plan is loaded
  useEffect(() => {
    if (!plan) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [plan])

  const nextId = () => `msg-${++msgIdRef.current}`

  const addMessage = useCallback((role: "assistant" | "user", content: string | React.ReactNode, isWidget = false) => {
    setMessages((prev) => [...prev, { id: nextId(), role, content, isWidget }])
  }, [])

  // Load profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileRes, platformRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/platform-profiles?platform=linkedin"),
        ])

        let baseGoal = ""
        let basePillars: string[] = []

        if (profileRes.ok) {
          const { profile: p } = await profileRes.json()
          setProfile(p)
          if (p?.goals) baseGoal = p.goals
          if (p?.content_pillars?.length) basePillars = p.content_pillars
        }

        if (platformRes.ok) {
          const { platformProfile: pp } = await platformRes.json()
          // LinkedIn platform profile overrides base profile where set
          if (pp?.goals) baseGoal = pp.goals
          if (pp?.content_pillars?.length) basePillars = pp.content_pillars
          if (pp?.posting_frequency) setFrequency(pp.posting_frequency as PostingFrequency)
        }

        if (baseGoal) setGoal(baseGoal)
        if (basePillars.length) setSelectedPillars(basePillars)
      } catch { /* ignore */ }
      setProfileLoaded(true)
    }
    if (user) loadProfile()
    else setProfileLoaded(true)
  }, [user])

  // Start chat when profile loads
  useEffect(() => {
    if (profileLoaded && messages.length === 0) {
      if (profile?.goals || profile?.industry) {
        setStep("verify_profile")
        addMessage("assistant", "Your profile is loaded — I'll use your business context to build the plan. Confirm or adjust the settings below.")
      } else {
        addMessage("assistant", "Let's build your LinkedIn content plan. First — have you posted on LinkedIn recently?")
      }
    }
  }, [profileLoaded, messages.length, addMessage, profile])

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
    addMessage("assistant", "Do you want to include image or carousel posts in your plan?")
    setStep("images")
  }, [addMessage])

  const handleWantsImages = useCallback((value: string) => {
    const wants = value === "yes"
    setWantsImages(wants)
    addMessage("user", wants ? "Yes, include image posts" : "No, text posts only")
    if (wants) {
      addMessage("assistant", "How many image or carousel posts in total across the plan?")
      setStep("images_count")
    } else {
      setImagesPerWeek(0)
      addMessage("assistant", "Any specific topics or themes you want to focus on? Select from the pillars below, or skip to let me choose for you.")
      setStep("topics")
    }
  }, [addMessage])

  const handleImagesCount = useCallback((value: string) => {
    const count = Number(value)
    setImagesPerWeek(count)
    addMessage("user", `${count} image post${count !== 1 ? "s" : ""} total`)
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

  const handleGenerate = useCallback(async (topContentOverride?: string) => {
    if (!user) {
      router.push("/login?redirect=/dashboard/social-engine/linkedin/planner")
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
          topPerformingContent: (topContentOverride ?? topContent) || undefined,
          industry: profile?.industry || "",
          businessDescription: profile?.business_description || "",
          targetAudience: profile?.target_audience || "",
          audienceSize: "1K-10K",
          goals: goal,
          desiredOutcomes: profile?.desired_outcomes || "",
          contentPillars: selectedPillars.length > 0 ? selectedPillars : undefined,
          enabledFormats: ["Text Post", "Image Post", "Carousel", "Long-form Post", "Poll"],
          wantsImages,
          imagesPerWeek: wantsImages ? Math.max(1, Math.round(imagesPerWeek / DURATION_WEEKS[duration])) : 0,
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
    if (g.includes("Awareness")) return "awareness"
    if (g.includes("Community")) return "engagement"
    if (g.includes("Thought")) return "authority"
    return "engagement"
  }

  const buildPostContent = useCallback((post: PlannedPost, variantIdx?: number, notes?: string) => {
    const vi = variantIdx ?? selectedVariants[post.id] ?? 0
    const v = post.variants?.[vi] ?? post
    const notesClause = notes?.trim() ? `\n\nAdditional instructions: ${notes.trim()}` : ""
    return `${v.caption_hook}\n\n${v.description}\n\nTopic: ${v.title}\nFormat: ${post.format}\nPillar: ${post.pillar}${notesClause}`
  }, [selectedVariants])

  const handleGeneratePost = useCallback(async (post: PlannedPost, notes?: string) => {
    if (!user || generatingPostId) return
    setGeneratingPostId(post.id)

    try {
      const res = await fetch("/api/generate/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "single",
          content: buildPostContent(post, undefined, notes),
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
  }, [user, generatingPostId, goal, refreshBalance, buildPostContent])

  // ─── Per-post Inline Flow ──────────────────────────────────────────────────

  const getPostFlow = (postId: string): PostFlowState => postFlows[postId] ?? DEFAULT_POST_FLOW

  const updatePostFlow = useCallback((postId: string, updates: Partial<PostFlowState>) => {
    setPostFlows((prev) => ({
      ...prev,
      [postId]: { ...(prev[postId] ?? DEFAULT_POST_FLOW), ...updates },
    }))
  }, [])

  const handleStartPostFlow = useCallback(async (post: PlannedPost) => {
    if (!user) return
    updatePostFlow(post.id, { phase: "hooks", hooks: [], generatingHooks: true })

    try {
      const topic = `${post.title}: ${post.description}`
      const res = await fetch("/api/generate/linkedin-hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, context: post.caption_hook }),
      })
      const data = await res.json()

      if (res.ok && data.hooks?.length) {
        const variantHooks = post.variants?.map((v) => v.caption_hook) ?? [post.caption_hook]
        const generated: string[] = data.hooks
        const combined = [
          ...variantHooks,
          ...generated.filter((h) => !variantHooks.includes(h)),
        ].slice(0, 10)
        updatePostFlow(post.id, { hooks: combined, generatingHooks: false })
        refreshBalance()
      } else {
        updatePostFlow(post.id, { phase: "idle", generatingHooks: false })
      }
    } catch {
      updatePostFlow(post.id, { phase: "idle", generatingHooks: false })
    }
  }, [user, updatePostFlow, refreshBalance])

  const handlePostFlowGenerate = useCallback(async (post: PlannedPost, noteOverride?: string, goalOverride?: string, ctaOverride?: string) => {
    const flow = postFlows[post.id] ?? DEFAULT_POST_FLOW
    if (!user) return

    const effectiveGoal = goalOverride ?? flow.goal
    const effectiveCta = ctaOverride !== undefined ? ctaOverride : flow.cta

    updatePostFlow(post.id, { phase: "generating" })

    const ctaClause = effectiveCta ? `\n\nCTA: ${effectiveCta}` : ""
    const noteClause = noteOverride ? `\n\nAdditional instructions: ${noteOverride}` : ""
    const content = `${flow.selectedHook || post.caption_hook}\n\n${post.description}\n\nTopic: ${post.title}\nFormat: ${post.format}${ctaClause}${noteClause}`

    try {
      const res = await fetch("/api/generate/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "single",
          content,
          goal: effectiveGoal || mapGoalToApi(goal),
          format: "auto",
        }),
      })
      const data = await res.json()
      if (res.ok && data.posts?.[0]) {
        setGeneratedPosts((prev) => ({
          ...prev,
          [post.id]: { full_post: data.posts[0].full_post, writing_score: data.posts[0].writing_score },
        }))
        updatePostFlow(post.id, { phase: "result" })
        refreshBalance()
      } else {
        updatePostFlow(post.id, { phase: GOALS_WITH_CTA_POST.includes(effectiveGoal) ? "cta" : "goal" })
      }
    } catch {
      updatePostFlow(post.id, { phase: GOALS_WITH_CTA_POST.includes(effectiveGoal) ? "cta" : "goal" })
    }
  }, [postFlows, user, goal, updatePostFlow, refreshBalance])

  // ─── Inline Image Copy (AI) ────────────────────────────────────────────────

  const handlePostFlowGenerateImageCopy = useCallback(async (postId: string) => {
    const flow = postFlows[postId] ?? DEFAULT_POST_FLOW
    const generatedPost = generatedPosts[postId]
    if (!user || !generatedPost) return

    updatePostFlow(postId, { imageGeneratingCopy: true })

    try {
      const res = await fetch("/api/generate/linkedin-image-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postContent: generatedPost.full_post,
          styleId: flow.imageStyle,
        }),
      })
      const data = await res.json()
      if (res.ok && data.copy) {
        updatePostFlow(postId, { imageCopy: data.copy, imageGeneratingCopy: false })
        refreshBalance()
      } else {
        updatePostFlow(postId, { imageGeneratingCopy: false })
      }
    } catch {
      updatePostFlow(postId, { imageGeneratingCopy: false })
    }
  }, [user, postFlows, generatedPosts, updatePostFlow, refreshBalance])

  // ─── Generate All Posts ────────────────────────────────────────────────────

  const handleGenerateAllPosts = useCallback(async (notes?: string) => {
    if (!plan?.posts || generatingAll) return
    setShowGenerateAllModal(false)
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
            content: buildPostContent(post, undefined, notes),
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
  }, [plan, generatingAll, generatedPosts, goal, refreshBalance, buildPostContent])

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
    setPlan(null)
    setExpandedPost(null)
    setError("")
    setGeneratedPosts({})
    setHasPostedRecently(false)
    setTopContent("")
    setVerifyTopContent("")
    setTopics("")
    setWantsImages(false)
    setImagesPerWeek(0)
    setSelectedVariants({})
    setGenerateAllNotes("")
    setShowGenerateAllModal(false)
    msgIdRef.current = 0
    setTimeout(() => {
      if (profile?.goals || profile?.industry) {
        setStep("verify_profile")
        addMessage("assistant", "Your profile is loaded — I'll use your business context to build the plan. Confirm or adjust the settings below.")
      } else {
        setStep("posted_recently")
        addMessage("assistant", "Let's build your LinkedIn content plan. First — have you posted on LinkedIn recently?")
      }
    }, 100)
  }, [addMessage, profile])

  // ─── Input Mode ────────────────────────────────────────────────────────────

  const getInputMode = () => {
    if (step === "verify_profile") return "none" as const
    if (step === "posted_recently") return "buttons" as const
    if (step === "top_content") return "textarea" as const
    if (step === "duration") return "buttons" as const
    if (step === "goal") return "buttons" as const
    if (step === "frequency") return "buttons" as const
    if (step === "images") return "buttons" as const
    if (step === "images_count") return "buttons" as const
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
    if (step === "images") return [
      { value: "yes", label: "Yes, include images", description: "Mix of image and carousel posts" },
      { value: "no", label: "No, text only", description: "All text-based posts" },
    ]
    if (step === "images_count") return Array.from({ length: getDurationDays(duration) }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1}`,
      description: `${i + 1} image post${i + 1 !== 1 ? "s" : ""} total`,
    }))
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
    else if (step === "images") handleWantsImages(value)
    else if (step === "images_count") handleImagesCount(value)
  }

  const formatMonthDisplay = (m: string) => {
    const [y, mo] = m.split("-").map(Number)
    return new Date(y, mo - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-300">LinkedIn Content Engine</span>
        </div>

        {/* Tab Nav */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6">
          <a href="/dashboard/social-engine/linkedin/write" className="flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Write</a>
          <span className="flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">Plan</span>
          <a href="/dashboard/social-engine/linkedin/images" className="flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Images</a>
          <a href="/dashboard/social-engine/linkedin/saved" className="flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Saved</a>
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
            {/* Verify profile card */}
            {step === "verify_profile" && (
              <div className="mt-4 animate-[fadeSlideIn_0.3s_ease-out]">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan settings</p>

                  {/* Goal */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Primary goal</p>
                    <div className="flex flex-wrap gap-2">
                      {GOAL_OPTIONS.map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => setGoal(o.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            goal === o.value
                              ? "border-teal-400 bg-teal-400/10 text-teal-400"
                              : "border-white/10 bg-black/40 text-gray-400 hover:border-teal-400/40 hover:text-gray-200"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Duration</p>
                    <div className="flex flex-wrap gap-2">
                      {DURATION_OPTIONS.map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => setDuration(o.value as PlanDuration)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            duration === o.value
                              ? "border-teal-400 bg-teal-400/10 text-teal-400"
                              : "border-white/10 bg-black/40 text-gray-400 hover:border-teal-400/40 hover:text-gray-200"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frequency */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Posts per week</p>
                    <div className="flex flex-wrap gap-2">
                      {([1, 2, 3, 4, 5, 6, 7] as PostingFrequency[]).map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setFrequency(n)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            frequency === n
                              ? "border-teal-400 bg-teal-400/10 text-teal-400"
                              : "border-white/10 bg-black/40 text-gray-400 hover:border-teal-400/40 hover:text-gray-200"
                          }`}
                        >
                          {n}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Include image / carousel posts?</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setWantsImages(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          wantsImages ? "border-teal-400 bg-teal-400/10 text-teal-400" : "border-white/10 bg-black/40 text-gray-400 hover:border-teal-400/40"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => { setWantsImages(false); setImagesPerWeek(0) }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          !wantsImages ? "border-teal-400 bg-teal-400/10 text-teal-400" : "border-white/10 bg-black/40 text-gray-400 hover:border-teal-400/40"
                        }`}
                      >
                        No, text only
                      </button>
                    </div>
                    {wantsImages && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.from({ length: getDurationDays(duration) }, (_, i) => i + 1).map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setImagesPerWeek(n)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              imagesPerWeek === n ? "border-teal-400 bg-teal-400/10 text-teal-400" : "border-white/10 bg-black/40 text-gray-400 hover:border-teal-400/40"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pillars */}
                  {selectedPillars.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Content pillars</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPillars.map((p) => (
                          <span key={p} className="px-2.5 py-1 text-xs rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 flex items-center gap-1.5">
                            {p}
                            <button
                              type="button"
                              onClick={() => setSelectedPillars((prev) => prev.filter((x) => x !== p))}
                              className="text-teal-400/60 hover:text-teal-400 leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent posts — optional */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Any recent posts performing well? <span className="text-gray-600">(optional)</span>
                    </p>
                    <p className="text-xs text-gray-600 mb-2">Paste topics, hooks, or content — helps optimise the plan</p>
                    <textarea
                      placeholder="e.g. &quot;Most businesses don't have a growth problem, they have a systems problem&quot; — got 200+ reactions..."
                      value={verifyTopContent}
                      onChange={(e) => setVerifyTopContent(e.target.value)}
                      rows={2}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none text-sm"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">{error}</div>
                  )}

                  <button
                    onClick={() => handleGenerate(verifyTopContent.trim() || undefined)}
                    className="w-full py-4 px-6 rounded-xl text-sm font-bold bg-teal-400 text-black hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all"
                  >
                    Generate Content Plan
                    <span className="ml-2 text-xs opacity-75">({TOKEN_COST} tokens)</span>
                  </button>
                </div>
              </div>
            )}

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
                    <div>
                      <p className="text-gray-500 text-xs">Image posts</p>
                      <p className="text-white font-medium">{wantsImages ? `${imagesPerWeek} post${imagesPerWeek !== 1 ? "s" : ""} total` : "Text only"}</p>
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
                    onClick={() => handleGenerate()}
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
                onClick={() => {
                  if (generatingAll || Object.keys(generatedPosts).length === plan.posts.length) return
                  setGenerateAllNotes("")
                  setShowGenerateAllModal(true)
                }}
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

          {/* Generate All Modal */}
          {showGenerateAllModal && plan.posts && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="w-full max-w-md bg-[#0e0e0e] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
                <div>
                  <h3 className="text-lg font-bold text-white">Generate All Posts</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Generating {plan.posts.filter((p) => !generatedPosts[p.id]).length} posts &nbsp;·&nbsp;{" "}
                    {plan.posts.filter((p) => !generatedPosts[p.id]).length * 3} tokens
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                    Additional instructions <span className="text-gray-600 font-normal normal-case">(optional)</span>
                  </label>
                  <textarea
                    value={generateAllNotes}
                    onChange={(e) => setGenerateAllNotes(e.target.value)}
                    placeholder="e.g. make them more conversational, include specific stats about our results, avoid jargon, focus more on storytelling..."
                    rows={4}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-teal-400/50 transition-colors"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGenerateAllModal(false)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleGenerateAllPosts(generateAllNotes || undefined)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold bg-teal-400 text-black hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all"
                  >
                    Generate All
                  </button>
                </div>
              </div>
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
                    {/* Variant Picker */}
                    {post.variants && post.variants.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pick a topic angle</p>
                        <div className="space-y-2">
                          {post.variants.map((v, vi) => {
                            const isSelected = (selectedVariants[post.id] ?? 0) === vi
                            return (
                              <button
                                key={vi}
                                type="button"
                                onClick={() => setSelectedVariants((prev) => ({ ...prev, [post.id]: vi }))}
                                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                                  isSelected
                                    ? "border-teal-400/50 bg-teal-400/5"
                                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-teal-400" : "border-gray-600"}`}>
                                    {isSelected && <span className="w-2 h-2 rounded-full bg-teal-400 block" />}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className={`text-sm font-semibold mb-1 ${isSelected ? "text-teal-400" : "text-white"}`}>{v.title}</p>
                                    <p className={`text-xs italic mb-1.5 ${isSelected ? "text-teal-300/70" : "text-gray-500"}`}>&ldquo;{v.caption_hook}&rdquo;</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{v.description}</p>
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hook</p>
                          <p className="text-sm font-semibold text-white italic">&ldquo;{post.caption_hook}&rdquo;</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content Brief</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{post.description}</p>
                        </div>
                      </>
                    )}

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
                        <div className="mt-3">
                          <FeedbackButtons
                            contentType="linkedin_plan"
                            contentSnapshot={{ ...post, full_post: generatedPosts[post.id].full_post } as unknown as Record<string, unknown>}
                            onRegenerate={(note) => handlePostFlowGenerate(post, note)}
                          />
                        </div>
                      </div>
                    )}

                    {/* ─── Inline post generation flow ─── */}
                    {(() => {
                      const flow = getPostFlow(post.id)

                      if (flow.phase === "hooks") {
                        return (
                          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3 animate-[fadeSlideIn_0.2s_ease-out]">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pick a hook to lead with</p>
                              <button onClick={() => updatePostFlow(post.id, { phase: "idle" })} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Cancel</button>
                            </div>
                            {flow.generatingHooks ? (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Generating hooks... (1 token)
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                {flow.hooks.map((hook, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => updatePostFlow(post.id, { selectedHook: hook, phase: "goal" })}
                                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs text-gray-300 bg-white/[0.02] border border-white/[0.06] hover:border-teal-400/40 hover:bg-teal-400/5 hover:text-teal-300 transition-all leading-relaxed"
                                  >
                                    {hook}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      }

                      if (flow.phase === "goal") {
                        return (
                          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3 animate-[fadeSlideIn_0.2s_ease-out]">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Goal for this post</p>
                                <p className="text-xs text-gray-600 mt-0.5 italic truncate max-w-xs">&ldquo;{flow.selectedHook.slice(0, 60)}{flow.selectedHook.length > 60 ? "…" : ""}&rdquo;</p>
                              </div>
                              <button onClick={() => updatePostFlow(post.id, { phase: "hooks" })} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">← Back</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {POST_GOAL_OPTIONS.map((o) => (
                                <button
                                  key={o.value}
                                  type="button"
                                  onClick={() => {
                                    if (GOALS_WITH_CTA_POST.includes(o.value)) {
                                      updatePostFlow(post.id, { goal: o.value, phase: "cta" })
                                    } else {
                                      updatePostFlow(post.id, { goal: o.value, cta: "", phase: "generating" })
                                      handlePostFlowGenerate(post, undefined, o.value, "")
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 bg-black/40 text-gray-400 hover:border-teal-400/40 hover:text-gray-200 transition-all"
                                >
                                  {o.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      }

                      if (flow.phase === "cta") {
                        return (
                          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3 animate-[fadeSlideIn_0.2s_ease-out]">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Add a CTA?</p>
                              <button onClick={() => updatePostFlow(post.id, { phase: "goal" })} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">← Back</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {POST_CTA_OPTIONS.map((o) => (
                                <button
                                  key={o.value || "none"}
                                  type="button"
                                  onClick={() => {
                                    const currentGoal = postFlows[post.id]?.goal ?? ""
                                    updatePostFlow(post.id, { cta: o.value, phase: "generating" })
                                    handlePostFlowGenerate(post, undefined, currentGoal, o.value)
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 bg-black/40 text-gray-400 hover:border-teal-400/40 hover:text-gray-200 transition-all"
                                >
                                  {o.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      }

                      if (flow.phase === "generating") {
                        return (
                          <div className="flex items-center gap-2 text-xs text-gray-500 animate-[fadeSlideIn_0.2s_ease-out]">
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Writing your post...
                          </div>
                        )
                      }

                      if (flow.phase === "image_style") {
                        return (
                          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3 animate-[fadeSlideIn_0.2s_ease-out]">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Choose an image style</p>
                              <button onClick={() => updatePostFlow(post.id, { phase: "result" })} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">← Back to post</button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {IMAGE_STYLES.map((style) => {
                                const isSelected = flow.imageStyle === style.id
                                return (
                                  <button
                                    key={style.id}
                                    type="button"
                                    onClick={() => {
                                      const postCopy = generatedPosts[post.id]?.full_post ?? ""
                                      updatePostFlow(post.id, { imageStyle: style.id, imageCopy: postCopy, phase: "image_copy_review" })
                                    }}
                                    className={`text-left rounded-xl border transition-all overflow-hidden ${
                                      isSelected
                                        ? "border-teal-400/50 bg-teal-400/5"
                                        : "border-white/[0.06] bg-white/[0.02] hover:border-teal-400/30 hover:bg-teal-400/[0.03]"
                                    }`}
                                  >
                                    {style.demoImage && (
                                      <div className="w-full h-14 overflow-hidden bg-black/20">
                                        <img src={style.demoImage} alt={style.label} className="w-full h-full object-cover object-top opacity-75" />
                                      </div>
                                    )}
                                    <div className="p-2.5">
                                      <p className={`text-xs font-semibold ${isSelected ? "text-teal-400" : "text-white"}`}>{style.label}</p>
                                      <p className="text-[10px] text-gray-600 leading-relaxed mt-0.5 line-clamp-2">{style.description}</p>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      }

                      if (flow.phase === "image_copy_review") {
                        const currentImageStyle = IMAGE_STYLES.find((s) => s.id === flow.imageStyle)
                        return (
                          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3 animate-[fadeSlideIn_0.2s_ease-out]">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Review image copy</p>
                              <button onClick={() => updatePostFlow(post.id, { phase: "image_style" })} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">← Back</button>
                            </div>

                            {/* Style hint */}
                            <div className="flex items-start gap-2 p-3 bg-teal-400/5 border border-teal-400/20 rounded-lg">
                              <svg className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="text-[10px] font-semibold text-teal-400 mb-0.5">{currentImageStyle?.label}</p>
                                <p className="text-[10px] text-gray-400 leading-relaxed">{STYLE_COPY_HINTS[flow.imageStyle] || "Edit the content to suit this format."}</p>
                              </div>
                            </div>

                            {/* Label row with AI generate button */}
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Image copy</p>
                              <button
                                onClick={() => handlePostFlowGenerateImageCopy(post.id)}
                                disabled={flow.imageGeneratingCopy || !generatedPosts[post.id]}
                                className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {flow.imageGeneratingCopy ? (
                                  <>
                                    <svg className="w-2.5 h-2.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                    </svg>
                                    Generate with AI (1 token)
                                  </>
                                )}
                              </button>
                            </div>

                            <textarea
                              value={flow.imageCopy}
                              onChange={(e) => updatePostFlow(post.id, { imageCopy: e.target.value })}
                              rows={6}
                              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none text-xs leading-relaxed"
                              placeholder="Edit the content that will appear in the image..."
                            />

                            <button
                              onClick={() => {
                                const style = IMAGE_STYLES.find((s) => s.id === flow.imageStyle)
                                if (!style || !flow.imageCopy.trim()) return
                                const prompt = `${style.prompt}\n\n---\n\nContent to encode in the image:\n\n${flow.imageCopy.trim()}`
                                updatePostFlow(post.id, { imagePrompt: prompt, phase: "image_result" })
                              }}
                              disabled={!flow.imageCopy.trim()}
                              className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Generate Prompt →
                            </button>
                          </div>
                        )
                      }

                      if (flow.phase === "image_result") {
                        return (
                          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3 animate-[fadeSlideIn_0.2s_ease-out]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <p className="text-xs font-semibold text-white">Image prompt ready</p>
                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400">
                                  {IMAGE_STYLES.find((s) => s.id === flow.imageStyle)?.label}
                                </span>
                              </div>
                              <button onClick={() => updatePostFlow(post.id, { phase: "image_copy_review" })} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">← Edit copy</button>
                            </div>

                            <div className="bg-black/40 border border-white/10 rounded-lg p-3 max-h-48 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-[10px] text-gray-300 leading-relaxed font-[family-name:var(--font-geist-sans)]">
                                {flow.imagePrompt}
                              </pre>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={async () => {
                                  if (!flow.imagePrompt) return
                                  try {
                                    await navigator.clipboard.writeText(flow.imagePrompt)
                                    setCopiedImagePost(post.id)
                                    setTimeout(() => { if (mountedRef.current) setCopiedImagePost(null) }, 2000)
                                  } catch { /* ignore */ }
                                }}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-400 text-black hover:bg-teal-300 transition-all"
                              >
                                {copiedImagePost === post.id ? "Copied!" : "Copy Prompt"}
                              </button>
                              <a
                                href="https://gemini.google.com/app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"
                              >
                                Open Gemini →
                              </a>
                              <button
                                onClick={() => updatePostFlow(post.id, { phase: "image_style", imagePrompt: null })}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"
                              >
                                Change style
                              </button>
                            </div>
                          </div>
                        )
                      }

                      return null
                    })()}

                    <div className="flex items-center gap-2 flex-wrap">
                      {(() => {
                        const flow = getPostFlow(post.id)
                        const activePhases: PostGenPhase[] = ["hooks", "goal", "cta", "generating", "image_style", "image_copy_review", "image_result"]
                        const isFlowActive = activePhases.includes(flow.phase)
                        if (isFlowActive) return null
                        return (
                          <>
                            <button
                              onClick={() => handleStartPostFlow(post)}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-teal-400 hover:border-teal-400/30 hover:bg-teal-400/5 transition-all"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                              </svg>
                              {generatedPosts[post.id] ? "Rewrite" : "Write this post"}
                              <span className="text-gray-600">(1+3 tokens)</span>
                            </button>

                            {generatedPosts[post.id] ? (
                              <button
                                onClick={() => updatePostFlow(post.id, { phase: "image_style" })}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-teal-400 hover:border-teal-400/30 hover:bg-teal-400/5 transition-all"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Create image prompt →
                              </button>
                            ) : (post.format === "Image Post" || post.format === "Carousel") ? (
                              <a
                                href={`/dashboard/social-engine/linkedin/images?content=${encodeURIComponent(
                                  buildPostContent(post)
                                )}&style=${post.format === "Carousel" ? "blueprint" : "whiteboard"}&back=planner`}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-teal-400 hover:border-teal-400/30 hover:bg-teal-400/5 transition-all"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Get Image Prompt
                              </a>
                            ) : null}
                          </>
                        )
                      })()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="px-6 py-3 text-sm font-semibold rounded-xl bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"
          >
            &larr; New Plan
          </button>
        </div>
      ) : null}
    </div>
  )
}
