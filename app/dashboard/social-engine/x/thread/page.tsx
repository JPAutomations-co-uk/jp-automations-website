"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import ConversationalQA, { type Question } from "@/app/components/chat/ConversationalQA"
import FeedbackButtons from "@/app/components/FeedbackButtons"

const THREAD_QUESTIONS: Question[] = [
  {
    id: "topic",
    question: "What's the core topic or argument?",
    inputType: "textarea",
    placeholder: "e.g. How I got my first 10 clients with zero ad spend...",
  },
  {
    id: "format",
    question: "What format fits this thread?",
    inputType: "single-select",
    options: [
      { label: "Step-by-step", value: "How-To" },
      { label: "Personal story", value: "Story" },
      { label: "Opinion + arguments", value: "Hot Take" },
      { label: "Insight list", value: "Educational" },
    ],
  },
  {
    id: "tweet_count",
    question: "How many tweets should this thread be?",
    inputType: "single-select",
    options: [
      { label: "5", value: "5" },
      { label: "8", value: "8" },
      { label: "10", value: "10" },
      { label: "15+", value: "15" },
    ],
  },
  {
    id: "hook",
    question: "What's the hook — why should someone stop scrolling for this?",
    inputType: "textarea",
    placeholder: "e.g. I spent £0 on ads and built a 6-figure agency. Here's exactly how.",
  },
  {
    id: "takeaway",
    question: "What should readers walk away knowing, feeling, or doing?",
    inputType: "textarea",
    placeholder: "e.g. They should feel confident they can replicate this approach",
  },
  {
    id: "data",
    question: "Any data, stats, or specifics to weave in?",
    inputType: "textarea",
    placeholder: "e.g. 73% of businesses fail in year 1, my revenue went from £2k to £15k in 4 months",
    optional: true,
  },
]

interface ThreadTweet {
  tweet_number: number
  text: string
  type: "hook" | "body" | "cta"
  char_count: number
}

interface ReplyVariant {
  text: string
  scenario: string
  strategy: string
  char_count: number
  why_it_works: string
}

interface ThreadResult {
  thread: ThreadTweet[]
  hook: string
  thread_type: string
  tweet_count: number
  goal_alignment: string
  replies?: ReplyVariant[]
}

function CharBadge({ count }: { count: number }) {
  const over = count > 280
  const close = count > 260
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded ${over ? "bg-red-500/20 text-red-400" : close ? "bg-yellow-500/20 text-yellow-400" : "bg-white/[0.06] text-gray-500"}`}>
      {count}/280
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
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
          Copy
        </>
      )}
    </button>
  )
}

export default function ThreadGeneratorPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()
  const [phase, setPhase] = useState<"questions" | "generating" | "results">("questions")
  const [sessionInputs, setSessionInputs] = useState<Record<string, unknown>>({})
  const [threadResult, setThreadResult] = useState<ThreadResult | null>(null)
  const [error, setError] = useState("")
  const [savingDraft, setSavingDraft] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)
  const [prefillData, setPrefillData] = useState<Record<string, unknown>>({})

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          const profile = data.profile
          if (profile) {
            const prefill: Record<string, unknown> = {}
            if (profile.primary_cta) prefill.takeaway = profile.primary_cta
            if (Object.keys(prefill).length > 0) setPrefillData(prefill)
          }
        }
      } catch { /* non-critical */ }
    }
    fetchProfile()
  }, [])

  const handleComplete = useCallback(
    async (answers: Record<string, unknown>) => {
      setSessionInputs(answers)

      if (!user) {
        router.push("/login?redirect=/dashboard/social-engine/x/thread")
        return
      }
      if (tokenBalance < 8) {
        setError("Insufficient tokens. You need 8 tokens to generate a thread.")
        return
      }

      setPhase("generating")
      setError("")

      try {
        const topicWithContext = [
          answers.topic,
          answers.hook ? `\n\nHook idea: ${answers.hook}` : "",
          answers.takeaway ? `\n\nReader takeaway: ${answers.takeaway}` : "",
          answers.data ? `\n\nData/specifics: ${answers.data}` : "",
        ].join("")

        const res = await fetch("/api/generate/x-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "thread",
            topic: topicWithContext,
            goal: "Education & Authority",
            threadType: answers.format || "Educational",
            tone: "Direct",
            temperature: 0.7,
            masterPrompt: `Thread should be approximately ${answers.tweet_count || 8} tweets.`,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Generation failed")
          setPhase("questions")
          return
        }

        setThreadResult(data)
        setPhase("results")
        refreshBalance()
      } catch {
        setError("Something went wrong. Please try again.")
        setPhase("questions")
      }
    },
    [user, tokenBalance, refreshBalance, router]
  )

  const handleSaveDraft = async () => {
    if (savingDraft) return
    setSavingDraft(true)
    try {
      await fetch("/api/x-profile/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "thread",
          topic: sessionInputs.topic,
          format: sessionInputs.format,
          output_json: threadResult,
          session_inputs: sessionInputs,
        }),
      })
    } catch {
      // silent fail
    }
    setSavingDraft(false)
  }

  const handleCopyAll = () => {
    if (!threadResult) return
    const fullThread = threadResult.thread.map((t) => t.text).join("\n\n")
    navigator.clipboard.writeText(fullThread)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  const handleStartOver = () => {
    setPhase("questions")
    setThreadResult(null)
    setSessionInputs({})
    setError("")
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <a
            href="/dashboard/social-engine/x"
            className="text-gray-500 hover:text-teal-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Thread</h1>
          <span className="text-xs text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
            8 tokens
          </span>
        </div>
        <p className="text-gray-500">Build a thread that positions you as an authority.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Q&A Phase */}
      {phase === "questions" && (
        <ConversationalQA
          questions={THREAD_QUESTIONS}
          onComplete={handleComplete}
          finalButtonLabel="Generate Thread"
          prefillData={prefillData}
        />
      )}

      {/* Generating */}
      {phase === "generating" && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-white font-medium mb-1">Writing your thread...</p>
          <p className="text-gray-500 text-sm">This takes about 15–30 seconds.</p>
        </div>
      )}

      {/* Results */}
      {phase === "results" && threadResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {threadResult.thread_type} Thread · {threadResult.tweet_count} tweets
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyAll}
                className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
              >
                {copiedAll ? "Copied!" : "Copy full thread"}
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={savingDraft}
                className="text-xs text-gray-500 hover:text-teal-400 transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
                {savingDraft ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={handleStartOver}
                className="text-xs text-gray-500 hover:text-teal-400 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>

          {threadResult.goal_alignment && (
            <p className="text-xs text-gray-500 italic">{threadResult.goal_alignment}</p>
          )}

          <div className="space-y-3">
            {threadResult.thread.map((tweet) => (
              <div
                key={tweet.tweet_number}
                className={`bg-white/[0.03] border rounded-2xl p-4 transition-all ${
                  tweet.type === "hook"
                    ? "border-teal-400/30 bg-teal-400/5"
                    : tweet.type === "cta"
                      ? "border-teal-400/20"
                      : "border-white/[0.08]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      tweet.type === "hook"
                        ? "bg-teal-400/20 text-teal-400"
                        : tweet.type === "cta"
                          ? "bg-teal-400/10 text-teal-500"
                          : "bg-white/[0.06] text-gray-500"
                    }`}>
                      {tweet.type === "hook" ? "Hook" : tweet.type === "cta" ? "CTA" : `${tweet.tweet_number}/`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CharBadge count={tweet.char_count || tweet.text?.length || 0} />
                    <CopyButton text={tweet.text} />
                  </div>
                </div>
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{tweet.text}</p>
              </div>
            ))}
          </div>

          <div className="pt-3">
            <FeedbackButtons contentType="x_post" contentSnapshot={{ thread: threadResult.thread, thread_type: threadResult.thread_type }} />
          </div>

          {/* Replies Section */}
          {threadResult.replies && threadResult.replies.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-white/[0.06]">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Strategic Replies</h2>
                <p className="text-xs text-gray-500">Drop these under niche tweets to build authority and attract followers.</p>
              </div>

              {threadResult.replies.map((reply, i) => (
                <div key={`reply-${i}`} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:border-teal-400/20 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400/70 bg-teal-400/10 px-2 py-0.5 rounded">Reply</span>
                      <span className="text-xs text-gray-600">{reply.strategy}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CharBadge count={reply.char_count || reply.text?.length || 0} />
                      <CopyButton text={reply.text} />
                    </div>
                  </div>
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap mb-3">{reply.text}</p>
                  <div className="border-t border-white/[0.04] pt-2.5 space-y-1">
                    <p className="text-xs text-gray-600">
                      <span className="text-gray-500">Use when:</span> {reply.scenario}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="text-gray-500">Why it works:</span> {reply.why_it_works}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
