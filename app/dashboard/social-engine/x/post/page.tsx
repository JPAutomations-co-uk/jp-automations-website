"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import ConversationalQA, { type Question } from "@/app/components/chat/ConversationalQA"
import FeedbackButtons from "@/app/components/FeedbackButtons"

const POST_QUESTIONS: Question[] = [
  {
    id: "topic",
    question: "What's the topic or idea for this post?",
    inputType: "textarea",
    placeholder: "e.g. Why most service businesses fail on X...",
  },
  {
    id: "desired_outcome",
    question: "What do you want the reader to feel or do after reading?",
    inputType: "text",
    placeholder: "e.g. DM me for help, feel inspired to start",
  },
  {
    id: "angle",
    question: "What angle feels right?",
    inputType: "single-select",
    options: [
      { label: "Hot take", value: "hot take" },
      { label: "Personal story", value: "personal story" },
      { label: "Educational", value: "educational" },
      { label: "Promotional", value: "promotional" },
    ],
  },
  {
    id: "specifics",
    question: "Any specific stats, quotes, or facts to include?",
    inputType: "textarea",
    placeholder: "e.g. 73% of businesses fail in the first year...",
    optional: true,
  },
  {
    id: "cta_destination",
    question: "Is there a CTA destination — link, reply prompt, follow ask?",
    inputType: "text",
    placeholder: "e.g. link in bio, reply 'YES', follow for more",
    optional: true,
  },
]

interface TweetVariant {
  text: string
  hook: string
  angle: string
  cta: string
  char_count: number
  why_it_works: string
}

interface ReplyVariant {
  text: string
  scenario: string
  strategy: string
  char_count: number
  why_it_works: string
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

export default function PostGeneratorPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()
  const [phase, setPhase] = useState<"questions" | "generating" | "results">("questions")
  const [sessionInputs, setSessionInputs] = useState<Record<string, unknown>>({})
  const [tweets, setTweets] = useState<TweetVariant[]>([])
  const [replies, setReplies] = useState<ReplyVariant[]>([])
  const [error, setError] = useState("")
  const [savingDraft, setSavingDraft] = useState(false)
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
            if (profile.primary_cta) prefill.cta_destination = profile.primary_cta
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
        router.push("/login?redirect=/dashboard/social-engine/x/post")
        return
      }
      if (tokenBalance < 2) {
        setError("Insufficient tokens. You need 2 tokens to generate tweets.")
        return
      }

      setPhase("generating")
      setError("")

      try {
        const res = await fetch("/api/generate/x-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "tweet",
            topic: `${answers.topic}${answers.specifics ? `\n\nInclude these specifics: ${answers.specifics}` : ""}${answers.cta_destination ? `\n\nCTA: ${answers.cta_destination}` : ""}`,
            goal: answers.desired_outcome === "DM me for help" ? "Lead Generation" : "Brand Awareness",
            tone: "Direct",
            temperature: 0.7,
            masterPrompt: `Angle: ${answers.angle}. Reader should: ${answers.desired_outcome}`,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Generation failed")
          setPhase("questions")
          return
        }

        setTweets(data.tweets || [])
        setReplies(data.replies || [])
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
          type: "post",
          topic: sessionInputs.topic,
          angle: sessionInputs.angle,
          output_json: { tweets },
          session_inputs: sessionInputs,
        }),
      })
    } catch {
      // silent fail
    }
    setSavingDraft(false)
  }

  const handleStartOver = () => {
    setPhase("questions")
    setTweets([])
    setReplies([])
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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Single Post</h1>
          <span className="text-xs text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
            2 tokens
          </span>
        </div>
        <p className="text-gray-500">Answer a few questions and we&apos;ll generate 3 tweet variants.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Q&A Phase */}
      {phase === "questions" && (
        <ConversationalQA
          questions={POST_QUESTIONS}
          onComplete={handleComplete}
          finalButtonLabel="Generate 3 Tweets"
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
          <p className="text-white font-medium mb-1">Writing 3 tweet variants...</p>
          <p className="text-gray-500 text-sm">This takes about 10–20 seconds.</p>
        </div>
      )}

      {/* Results */}
      {phase === "results" && tweets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">3 Tweet Variants</h2>
            <div className="flex items-center gap-3">
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

          {tweets.map((tweet, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-teal-400/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Variant {i + 1} · {tweet.angle}
                </span>
                <div className="flex items-center gap-3">
                  <CharBadge count={tweet.char_count || tweet.text?.length || 0} />
                  <CopyButton text={tweet.text} />
                </div>
              </div>
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap mb-4">{tweet.text}</p>
              <div className="border-t border-white/[0.06] pt-3 space-y-1.5">
                <p className="text-xs text-gray-600">
                  <span className="text-gray-500">Why it works:</span> {tweet.why_it_works}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="text-gray-500">CTA:</span> {tweet.cta}
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.04]">
                <FeedbackButtons contentType="x_post" contentSnapshot={{ tweet }} />
              </div>
            </div>
          ))}

          {/* Replies Section */}
          {replies.length > 0 && (
            <>
              <div className="pt-6 border-t border-white/[0.06]">
                <h2 className="text-lg font-semibold text-white mb-1">Strategic Replies</h2>
                <p className="text-xs text-gray-500 mb-4">Drop these under niche tweets to build authority and attract followers.</p>
              </div>

              {replies.map((reply, i) => (
                <div key={`reply-${i}`} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-teal-400/20 transition-all">
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
            </>
          )}
        </div>
      )}
    </div>
  )
}
