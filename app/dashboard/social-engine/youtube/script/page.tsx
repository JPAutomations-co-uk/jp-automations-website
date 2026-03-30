"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import ConversationalQA, { type Question } from "@/app/components/chat/ConversationalQA"
import FeedbackButtons from "@/app/components/FeedbackButtons"

const SCRIPT_QUESTIONS: Question[] = [
  {
    id: "topic",
    question: "What's the video about?",
    inputType: "textarea",
    placeholder: "e.g. How to automate your business with AI agents...",
  },
  {
    id: "video_length",
    question: "How long should the video be?",
    inputType: "single-select",
    options: [
      { label: "YouTube Short (< 60s)", value: "short" },
      { label: "Short (5-8 min)", value: "5-8" },
      { label: "Medium (10-15 min)", value: "10-15" },
      { label: "Long (20+ min)", value: "20+" },
    ],
  },
  {
    id: "goal",
    question: "What's the primary goal?",
    inputType: "single-select",
    options: [
      { label: "Subscribers", value: "subscribers" },
      { label: "Watch time", value: "watch_time" },
      { label: "Leads / sales", value: "leads" },
      { label: "Authority", value: "authority" },
    ],
  },
  {
    id: "hook_style",
    question: "How should the video open?",
    inputType: "single-select",
    options: [
      { label: "Bold promise", value: "promise" },
      { label: "Question", value: "question" },
      { label: "Story", value: "story" },
      { label: "Shocking stat", value: "stat" },
    ],
  },
  {
    id: "key_points",
    question: "Main points to cover?",
    inputType: "textarea",
    optional: true,
    placeholder: "e.g. 1. Why manual processes cost you\n2. The 3 workflows to automate first...",
  },
]

interface ScriptSection {
  section_title: string
  script: string
  b_roll_note: string
  retention_technique: string
}

interface ThumbnailConcept {
  text_overlay: string
  visual_description: string
  emotion: string
  layout: string
}

interface ScriptResult {
  title: string
  title_variants: string[]
  description: string
  script: {
    hook: string
    setup: string
    body: ScriptSection[]
    cta: string
    outro: string
  }
  thumbnail_concepts: ThumbnailConcept[]
  tags: string[]
  why_it_works: string
  estimated_duration: string
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

function buildFullScript(script: ScriptResult["script"]): string {
  const parts = []
  if (script.hook) parts.push(`[HOOK]\n${script.hook}`)
  if (script.setup) parts.push(`[SETUP]\n${script.setup}`)
  if (script.body) {
    script.body.forEach((section) => {
      parts.push(`[${section.section_title.toUpperCase()}]\n${section.script}`)
    })
  }
  if (script.cta) parts.push(`[CTA]\n${script.cta}`)
  if (script.outro) parts.push(`[OUTRO]\n${script.outro}`)
  return parts.join("\n\n")
}

export default function YouTubeScriptPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()
  const [phase, setPhase] = useState<"questions" | "generating" | "results">("questions")
  const [result, setResult] = useState<ScriptResult | null>(null)
  const [error, setError] = useState("")

  const handleComplete = useCallback(
    async (answers: Record<string, unknown>) => {
      if (!user) {
        router.push("/login?redirect=/dashboard/social-engine/youtube/script")
        return
      }
      if (tokenBalance < 5) {
        setError("Insufficient tokens. You need 5 tokens to generate a script.")
        return
      }

      setPhase("generating")
      setError("")

      try {
        const res = await fetch("/api/generate/youtube-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: answers.topic,
            video_length: answers.video_length,
            goal: answers.goal,
            hook_style: answers.hook_style,
            key_points: answers.key_points || "",
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Generation failed")
          setPhase("questions")
          return
        }

        setResult(data)
        setPhase("results")
        refreshBalance()
      } catch {
        setError("Something went wrong. Please try again.")
        setPhase("questions")
      }
    },
    [user, tokenBalance, refreshBalance, router]
  )

  const handleStartOver = () => {
    setPhase("questions")
    setResult(null)
    setError("")
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <a
            href="/dashboard/social-engine/youtube"
            className="text-gray-500 hover:text-teal-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Script Writer</h1>
          <span className="text-xs text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
            5 tokens
          </span>
        </div>
        <p className="text-gray-500">Answer a few questions and we&apos;ll generate a full video script with titles and thumbnail concepts.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Q&A Phase */}
      {phase === "questions" && (
        <ConversationalQA
          questions={SCRIPT_QUESTIONS}
          onComplete={handleComplete}
          finalButtonLabel="Generate Script"
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
          <p className="text-white font-medium mb-1">Writing your script...</p>
          <p className="text-gray-500 text-sm">This takes about 20-40 seconds for longer scripts.</p>
        </div>
      )}

      {/* Results */}
      {phase === "results" && result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Your Script</h2>
            <button
              onClick={handleStartOver}
              className="text-xs text-gray-500 hover:text-teal-400 transition-colors"
            >
              Start Over
            </button>
          </div>

          {/* Title + Variants */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400/70">Title</span>
              <CopyButton text={result.title} />
            </div>
            <p className="text-white text-lg font-semibold mb-3">{result.title}</p>
            {result.title_variants && result.title_variants.length > 0 && (
              <div className="border-t border-white/[0.06] pt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-2">Alternatives</p>
                <ul className="space-y-1.5">
                  {result.title_variants.map((v, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{v}</span>
                      <CopyButton text={v} label="" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Script Sections */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400/70">Full Script</span>
              <div className="flex items-center gap-3">
                {result.estimated_duration && (
                  <span className="text-xs text-gray-600">{result.estimated_duration}</span>
                )}
                <CopyButton text={buildFullScript(result.script)} label="Copy All" />
              </div>
            </div>

            {/* Hook */}
            <div className="mb-4 p-3 rounded-lg bg-teal-400/5 border border-teal-400/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400/70">Hook (0-30s)</span>
                <CopyButton text={result.script.hook} />
              </div>
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{result.script.hook}</p>
            </div>

            {/* Setup */}
            {result.script.setup && (
              <div className="mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block mb-1">Setup</span>
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{result.script.setup}</p>
              </div>
            )}

            {/* Body sections */}
            {result.script.body && result.script.body.map((section, i) => (
              <div key={i} className="mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                    {section.section_title}
                  </span>
                  <CopyButton text={section.script} />
                </div>
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap mb-2">{section.script}</p>
                {section.b_roll_note && (
                  <p className="text-xs text-gray-600">
                    <span className="text-gray-500">B-roll:</span> {section.b_roll_note}
                  </p>
                )}
                {section.retention_technique && (
                  <p className="text-xs text-gray-600">
                    <span className="text-gray-500">Retention:</span> {section.retention_technique}
                  </p>
                )}
              </div>
            ))}

            {/* CTA */}
            {result.script.cta && (
              <div className="mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block mb-1">CTA</span>
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{result.script.cta}</p>
              </div>
            )}

            {/* Outro */}
            {result.script.outro && (
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block mb-1">Outro</span>
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{result.script.outro}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400/70">Description</span>
              <CopyButton text={result.description} />
            </div>
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{result.description}</p>
          </div>

          {/* Thumbnail Concepts */}
          {result.thumbnail_concepts && result.thumbnail_concepts.length > 0 && (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400/70 block mb-3">Thumbnail Concepts</span>
              <div className="space-y-3">
                {result.thumbnail_concepts.map((thumb, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-white">Option {i + 1}</span>
                      {thumb.text_overlay && (
                        <span className="text-xs text-teal-400/70 bg-teal-400/10 px-2 py-0.5 rounded">
                          &quot;{thumb.text_overlay}&quot;
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{thumb.visual_description}</p>
                    <div className="flex gap-3 text-xs text-gray-600">
                      {thumb.emotion && <span>Emotion: {thumb.emotion}</span>}
                      {thumb.layout && <span>Layout: {thumb.layout}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {result.tags && result.tags.length > 0 && (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400/70">Tags</span>
                <CopyButton text={result.tags.join(", ")} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.tags.map((tag, j) => (
                  <span key={j} className="text-xs text-gray-400 bg-white/[0.04] px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Why it works */}
          {result.why_it_works && (
            <div className="border-t border-white/[0.06] pt-3">
              <p className="text-xs text-gray-600">
                <span className="text-gray-500">Why it works:</span> {result.why_it_works}
              </p>
            </div>
          )}

          <div className="pt-2">
            <FeedbackButtons contentType="youtube_script" contentSnapshot={{ result }} />
          </div>
        </div>
      )}
    </div>
  )
}
