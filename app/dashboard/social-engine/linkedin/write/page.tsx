"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import ChatQA, { type ChatMessage, type ButtonOption } from "@/app/components/ChatQA"
import FeedbackButtons from "@/app/components/FeedbackButtons"

// ─── Types ───────────────────────────────────────────────────────────────────

type WriteStep =
  | "loading"
  | "topic"
  | "generating_hooks"
  | "hooks"
  | "goal"
  | "cta"
  | "generating_post"
  | "result"

interface GeneratedPost {
  hook: string
  body: string
  cta: string
  full_post: string
  writing_score: number
  writing_tips: string[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GOAL_OPTIONS: ButtonOption[] = [
  { value: "awareness", label: "Give away free value", description: "Pure insight — no CTA, let the content do the work" },
  { value: "leads", label: "Attract leads", description: "Drive DMs, calls, or profile visits" },
  { value: "authority", label: "Build authority", description: "Position as the go-to expert in your space" },
  { value: "engagement", label: "Start a conversation", description: "Comments, debate, and genuine discussion" },
  { value: "leads_offer", label: "Promote an offer", description: "Direct or soft sell — drive to a specific offer" },
  { value: "awareness", label: "Drive to content", description: "Newsletter, podcast, YouTube — grow another channel" },
]

// Goals that need a CTA picker
const GOALS_WITH_CTA = ["leads", "leads_offer"]

const CTA_OPTIONS: ButtonOption[] = [
  { value: "dm_keyword", label: "DM me [KEYWORD]", description: "e.g. 'DM me AUDIT and I'll send you...'" },
  { value: "book_call", label: "Book a free call — link in bio", description: "Direct booking CTA" },
  { value: "comment_word", label: "Comment [WORD] below", description: "e.g. 'Comment FRAMEWORK and I'll send it'" },
  { value: "follow_more", label: "Follow for more", description: "Soft ask to grow your audience" },
  { value: "custom", label: "Custom CTA", description: "I'll type my own" },
  { value: "skip", label: "Let AI decide", description: "Based on your goal and voice" },
]

const GOAL_API_MAP: Record<string, string> = {
  awareness: "awareness",
  leads: "leads",
  authority: "authority",
  engagement: "engagement",
  leads_offer: "leads",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WritingScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-teal-400/10 text-teal-400 border-teal-400/20"
      : score >= 60
        ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
        : "bg-red-400/10 text-red-400 border-red-400/20"
  return (
    <div className={`w-14 h-14 ${color} rounded-full border flex items-center justify-center font-bold text-sm shrink-0`}>
      {score}
    </div>
  )
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="text-xs text-gray-500 hover:text-teal-400 transition-colors flex items-center gap-1"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LinkedInWritePage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState<WriteStep>("loading")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState("")

  // Flow state
  const [topic, setTopic] = useState("")
  const [hooks, setHooks] = useState<string[]>([])
  const [selectedHook, setSelectedHook] = useState("")
  const [selectedGoal, setSelectedGoal] = useState("")
  const [selectedCta, setSelectedCta] = useState("")
  const [customCtaText, setCustomCtaText] = useState("")
  const [showCustomCta, setShowCustomCta] = useState(false)

  // Post state
  const [post, setPost] = useState<GeneratedPost | null>(null)

  const mountedRef = useRef(true)
  useEffect(() => { return () => { mountedRef.current = false } }, [])

  // ─── Init ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const welcome: ChatMessage = {
      id: "welcome",
      role: "assistant",
      content: "What do you want to write about today?",
    }
    setMessages([welcome])
    setStep("topic")
  }, [])

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const addMessage = (role: "assistant" | "user", content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, role, content },
    ])
  }

  // ─── Topic submitted → generate hooks ─────────────────────────────────────

  const handleTopicSubmit = useCallback(async (text: string) => {
    if (!user) { router.push("/login"); return }
    if (!text.trim()) return

    const topicText = text.trim()
    setTopic(topicText)
    addMessage("user", topicText)
    addMessage("assistant", "Generating 10 hooks for that topic...")
    setStep("generating_hooks")
    setError("")

    try {
      const res = await fetch("/api/generate/linkedin-hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicText }),
      })

      if (!mountedRef.current) return
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to generate hooks")
        setMessages((prev) => [...prev.slice(0, -1), {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: data.error || "Failed to generate hooks. Try again.",
        }])
        setStep("topic")
        return
      }

      const generatedHooks: string[] = data.hooks || []
      setHooks(generatedHooks)
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { id: `hooks-msg-${Date.now()}`, role: "assistant", content: "Here are 10 hooks — pick the one that fits your angle:" },
      ])
      setStep("hooks")
      refreshBalance()
    } catch {
      if (mountedRef.current) {
        setError("Something went wrong generating hooks.")
        setStep("topic")
      }
    }
  }, [user, router, refreshBalance])

  // ─── Hook selected ─────────────────────────────────────────────────────────

  const handleHookSelect = useCallback((hook: string) => {
    setSelectedHook(hook)
    addMessage("user", hook)
    addMessage("assistant", "What's the goal of this post?")
    setStep("goal")
  }, [])

  // ─── Goal selected ─────────────────────────────────────────────────────────

  const handleGoalSelect = useCallback((goalValue: string, goalLabel: string) => {
    setSelectedGoal(goalValue)
    addMessage("user", goalLabel)

    if (GOALS_WITH_CTA.includes(goalValue)) {
      addMessage("assistant", "What CTA do you want to use?")
      setStep("cta")
    } else {
      addMessage("assistant", "Generating your post...")
      generatePost(topic, selectedHook || "", goalValue, "")
    }
  }, [topic, selectedHook]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── CTA selected ──────────────────────────────────────────────────────────

  const handleCtaSelect = useCallback((ctaValue: string, ctaLabel: string) => {
    if (ctaValue === "custom") {
      setShowCustomCta(true)
      return
    }

    const ctaText =
      ctaValue === "skip" ? "" :
      ctaValue === "dm_keyword" ? "DM me [KEYWORD] and I'll send you [VALUE]" :
      ctaValue === "book_call" ? "Book a free call — link in bio" :
      ctaValue === "comment_word" ? "Comment [WORD] below and I'll send it over" :
      ctaValue === "follow_more" ? "Follow for more posts like this" : ""

    setSelectedCta(ctaText)
    addMessage("user", ctaValue === "skip" ? "Let AI decide" : ctaLabel)
    addMessage("assistant", "Generating your post...")
    generatePost(topic, selectedHook, selectedGoal, ctaText)
  }, [topic, selectedHook, selectedGoal]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCustomCtaSubmit = useCallback(() => {
    const cta = customCtaText.trim()
    setSelectedCta(cta)
    setShowCustomCta(false)
    addMessage("user", cta || "Custom CTA")
    addMessage("assistant", "Generating your post...")
    generatePost(topic, selectedHook, selectedGoal, cta)
  }, [customCtaText, topic, selectedHook, selectedGoal]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Generate post ─────────────────────────────────────────────────────────

  const generatePost = useCallback(async (
    topicStr: string,
    hookStr: string,
    goalStr: string,
    ctaStr: string,
    regenerateNote?: string
  ) => {
    if (!user) return
    setStep("generating_post")
    setPost(null)
    setError("")

    const content = [
      `Topic: ${topicStr}`,
      hookStr ? `Hook to use: ${hookStr}` : "",
      ctaStr ? `CTA: ${ctaStr}` : "",
      regenerateNote ? `Improvement note: ${regenerateNote}` : "",
    ].filter(Boolean).join("\n\n")

    const apiGoal = GOAL_API_MAP[goalStr] || "engagement"

    try {
      const res = await fetch("/api/generate/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "single",
          content: content.trim(),
          goal: apiGoal,
          format: "auto",
        }),
      })

      if (!mountedRef.current) return
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Generation failed")
        setMessages((prev) => [...prev.slice(0, -1), {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: data.error || "Generation failed. Try again.",
        }])
        setStep("result")
        return
      }

      const generatedPost = data.posts?.[0]
      if (!generatedPost) {
        setError("No post returned.")
        setStep("result")
        return
      }

      setPost(generatedPost)
      setMessages((prev) => [...prev.slice(0, -1), {
        id: `done-${Date.now()}`,
        role: "assistant",
        content: regenerateNote ? "Regenerated with your note:" : "Here's your post:",
      }])
      setStep("result")
      refreshBalance()
    } catch {
      if (mountedRef.current) {
        setError("Something went wrong. Please try again.")
        setStep("result")
      }
    }
  }, [user, refreshBalance])

  // ─── Regenerate from feedback ───────────────────────────────────────────────

  const handleRegenerate = useCallback((note: string) => {
    addMessage("user", `Improve: ${note}`)
    addMessage("assistant", "Regenerating with your note...")
    generatePost(topic, selectedHook, selectedGoal, selectedCta, note)
  }, [generatePost, topic, selectedHook, selectedGoal, selectedCta])

  // ─── Reset ─────────────────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    setTopic("")
    setHooks([])
    setSelectedHook("")
    setSelectedGoal("")
    setSelectedCta("")
    setCustomCtaText("")
    setShowCustomCta(false)
    setPost(null)
    setError("")
    setMessages([{
      id: `welcome-${Date.now()}`,
      role: "assistant",
      content: "What do you want to write about today?",
    }])
    setStep("topic")
  }, [])

  // ─── ChatQA input config ────────────────────────────────────────────────────

  const getInputMode = () => {
    if (step === "topic") return "textarea" as const
    if (step === "hooks") return "buttons" as const
    if (step === "goal") return "buttons" as const
    if (step === "cta" && !showCustomCta) return "buttons" as const
    return "none" as const
  }

  const getButtonOptions = (): ButtonOption[] => {
    if (step === "hooks") {
      return hooks.map((hook, i) => ({
        value: hook,
        label: hook,
        description: `Hook ${i + 1}`,
      }))
    }
    if (step === "goal") return GOAL_OPTIONS
    if (step === "cta") return CTA_OPTIONS
    return []
  }

  const handleSelectButton = (value: string) => {
    if (step === "hooks") {
      handleHookSelect(value)
    } else if (step === "goal") {
      const option = GOAL_OPTIONS.find((o) => o.value === value)
      handleGoalSelect(value, option?.label || value)
    } else if (step === "cta") {
      const option = CTA_OPTIONS.find((o) => o.value === value)
      handleCtaSelect(value, option?.label || value)
    }
  }

  const isLoading = step === "generating_hooks" || step === "generating_post"

  const loadingMessage =
    step === "generating_hooks"
      ? "Finding your best hooks..."
      : "Writing your post — optimising for dwell time and engagement..."

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-300">LinkedIn Content Engine</span>
        </div>

        {/* Tab Nav */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6">
          <span className="flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">Write</span>
          <a href="/dashboard/social-engine/linkedin/planner" className="flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Plan</a>
          <a href="/dashboard/social-engine/linkedin/images" className="flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Images</a>
          <a href="/dashboard/social-engine/linkedin/saved" className="flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Saved</a>
        </div>

        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Write Post</h1>
          <span className="text-xs text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">4 tokens</span>
        </div>
        <p className="text-gray-500 text-sm">Topic → 10 hooks → goal → generate.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
          <button onClick={() => setError("")} className="ml-3 underline text-xs">Dismiss</button>
        </div>
      )}

      {step === "loading" ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-teal-400/30 border-t-teal-400 animate-spin mx-auto" />
        </div>
      ) : (
        <ChatQA
          messages={messages}
          inputMode={getInputMode()}
          buttonOptions={getButtonOptions()}
          onSubmitText={step === "topic" ? handleTopicSubmit : undefined}
          onSelectButton={handleSelectButton}
          loading={isLoading}
          loadingMessage={loadingMessage}
          placeholder="Describe a topic, story, or idea for your post..."
        >
          {/* Custom CTA input (shown inline when "Custom CTA" is selected) */}
          {step === "cta" && showCustomCta && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customCtaText}
                onChange={(e) => setCustomCtaText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCustomCtaSubmit() }}
                placeholder="e.g. DM me 'SYSTEM' and I'll send you the framework"
                autoFocus
                className="flex-1 px-3 py-2 text-sm bg-white/[0.04] border border-white/[0.10] rounded-lg text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-teal-400/40"
              />
              <button
                onClick={handleCustomCtaSubmit}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all"
              >
                Use this CTA
              </button>
            </div>
          )}

          {/* Result */}
          {step === "result" && post && (
            <div className="mt-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4 animate-[fadeSlideIn_0.3s_ease-out]">
              {/* Score + header */}
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">LinkedIn Post</span>
                <WritingScoreBadge score={post.writing_score} />
              </div>

              {/* Hook */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400/70 mb-1">Hook (before "see more")</p>
                <p className="text-white text-sm font-semibold italic">&ldquo;{post.hook}&rdquo;</p>
              </div>

              {/* Body */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Body</p>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{post.body}</p>
              </div>

              {/* CTA */}
              {post.cta && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Call to Action</p>
                  <p className="text-sm font-semibold text-teal-400">{post.cta}</p>
                </div>
              )}

              {/* Full post */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Full Post</p>
                  <CopyButton text={post.full_post} />
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-[family-name:var(--font-geist-sans)]">
                    {post.full_post}
                  </pre>
                </div>
              </div>

              {/* Writing tips */}
              {post.writing_tips?.length > 0 && <PostTips tips={post.writing_tips} />}

              {/* Feedback + actions */}
              <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-4">
                <FeedbackButtons
                  contentType="linkedin_post"
                  contentSnapshot={post as unknown as Record<string, unknown>}
                  onRegenerate={handleRegenerate}
                />
                <a
                  href={`/dashboard/social-engine/linkedin/images?content=${encodeURIComponent(post.full_post)}&back=write`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-teal-400 hover:border-teal-400/30 hover:bg-teal-400/5 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Get Image Prompt
                </a>
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  Write another
                </button>
              </div>
            </div>
          )}

          {/* Result with error (no post) */}
          {step === "result" && !post && error && (
            <div className="mt-2 flex gap-3">
              <button
                onClick={() => generatePost(topic, selectedHook, selectedGoal, selectedCta)}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all"
              >
                Try again
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white transition-all"
              >
                Start over
              </button>
            </div>
          )}
        </ChatQA>
      )}
    </div>
  )
}
