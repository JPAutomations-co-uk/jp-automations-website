"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import FeedbackButtons from "@/app/components/FeedbackButtons"

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "input" | "generating" | "result"

type ArticleType = "Tutorial" | "Deep Dive" | "Case Study" | "Opinion" | "Framework"
type ArticleLength = "brief" | "standard" | "longform"

interface ArticleResult {
  title: string
  body: string
  companionTweet: string
  wordCount: number
  readTime: number
  articleType: string
  length: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ARTICLE_TYPES: { value: ArticleType; label: string; description: string }[] = [
  { value: "Tutorial", label: "Tutorial", description: "Step-by-step how-to with clear outcomes" },
  { value: "Deep Dive", label: "Deep Dive", description: "Thorough exploration of one topic" },
  { value: "Case Study", label: "Case Study", description: "Real results with process breakdown" },
  { value: "Opinion", label: "Opinion", description: "Contrarian or bold POV with evidence" },
  { value: "Framework", label: "Framework", description: "Named system or model others can steal" },
]

const ARTICLE_LENGTHS: { value: ArticleLength; label: string; description: string; words: string }[] = [
  { value: "brief", label: "Brief", description: "Quick read", words: "400–600w" },
  { value: "standard", label: "Standard", description: "Solid depth", words: "800–1,200w" },
  { value: "longform", label: "Long Form", description: "Deep authority", words: "1,500–2,500w" },
]

const TOKEN_COST = 5

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// Render markdown-ish body — converts ## headers and **bold** for display
function ArticleBody({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n")
  return (
    <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="text-base font-semibold text-white mt-5 mb-1 first:mt-0">
              {line.replace(/^## /, "")}
            </h2>
          )
        }
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2">
              <span className="text-teal-400 mt-0.5 shrink-0">·</span>
              <span dangerouslySetInnerHTML={{ __html: line.replace(/^- /, "").replace(/\*\*(.+?)\*\*/g, "<strong class='text-white font-medium'>$1</strong>") }} />
            </div>
          )
        }
        if (line.trim() === "") {
          return <div key={i} className="h-1" />
        }
        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong class='text-white font-medium'>$1</strong>") }} />
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function XArticlePage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  const [phase, setPhase] = useState<Phase>("input")
  const [topic, setTopic] = useState("")
  const [articleType, setArticleType] = useState<ArticleType>("Deep Dive")
  const [articleLength, setArticleLength] = useState<ArticleLength>("standard")
  const [result, setResult] = useState<ArticleResult | null>(null)
  const [error, setError] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleGenerate = async () => {
    if (!user) {
      router.push("/login?redirect=/dashboard/social-engine/x/article")
      return
    }
    if (!topic.trim()) {
      setError("Enter a topic or angle first.")
      textareaRef.current?.focus()
      return
    }
    if (tokenBalance < TOKEN_COST) {
      setError(`You need ${TOKEN_COST} tokens. Current balance: ${tokenBalance}.`)
      return
    }

    setPhase("generating")
    setError("")

    try {
      const res = await fetch("/api/generate/x-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), articleType, length: articleLength }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Generation failed")
        setPhase("input")
        return
      }

      setResult(data as ArticleResult)
      setPhase("result")
      refreshBalance()
    } catch {
      setError("Something went wrong. Please try again.")
      setPhase("input")
    }
  }

  const handleReset = () => {
    setResult(null)
    setPhase("input")
    setTopic("")
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
          <h1 className="text-2xl md:text-3xl font-bold text-white">X Article</h1>
          <span className="text-xs text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
            {TOKEN_COST} tokens
          </span>
        </div>
        <p className="text-gray-500">Long-form articles published directly on X — indexed by Google, shared as a tweet card.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Input phase */}
      {phase === "input" && (
        <div className="space-y-6">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Topic or angle</label>
            <textarea
              ref={textareaRef}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Why most agency owners plateau at £10k/month — and the one shift that breaks through it"
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.10] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 resize-none transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate()
              }}
            />
            <p className="text-[11px] text-gray-600 mt-1.5">⌘ + Enter to generate</p>
          </div>

          {/* Article type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2.5">Article type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ARTICLE_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setArticleType(t.value)}
                  className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
                    articleType === t.value
                      ? "bg-teal-400/10 border-teal-400/40 text-white"
                      : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-teal-400/30"
                  }`}
                >
                  <p className="text-sm font-medium mb-0.5">{t.label}</p>
                  <p className="text-[11px] text-gray-500 leading-tight">{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2.5">Length</label>
            <div className="grid grid-cols-3 gap-2">
              {ARTICLE_LENGTHS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setArticleLength(l.value)}
                  className={`text-center px-3 py-3 rounded-xl border transition-all ${
                    articleLength === l.value
                      ? "bg-teal-400/10 border-teal-400/40 text-white"
                      : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-teal-400/30"
                  }`}
                >
                  <p className="text-sm font-medium">{l.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{l.words}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="w-full py-3 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400 font-semibold hover:bg-teal-400/15 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Generate Article ({TOKEN_COST} tokens)
          </button>
        </div>
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
          <p className="text-white font-medium mb-1">Writing your X article...</p>
          <p className="text-gray-500 text-sm">About 15–20 seconds.</p>
        </div>
      )}

      {/* Result */}
      {phase === "result" && result && (
        <div className="space-y-5">
          {/* Meta row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400">
                {result.articleType}
              </span>
              <span className="text-[10px] text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
                ~{result.wordCount || "—"} words · {result.readTime || "—"} min read
              </span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-teal-400 transition-colors"
            >
              ← New article
            </button>
          </div>

          {/* Companion tweet */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Companion Tweet</p>
              <CopyButton text={result.companionTweet} />
            </div>
            <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{result.companionTweet}</p>
            <p className="text-[10px] text-gray-600 mt-2">{result.companionTweet?.length || 0}/280 chars</p>
          </div>

          {/* Article */}
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <h2 className="text-xl font-bold text-white leading-tight flex-1">{result.title}</h2>
              <CopyButton
                text={`# ${result.title}\n\n${result.body}`}
                label="Copy article"
              />
            </div>
            <ArticleBody markdown={result.body} />
          </div>

          {/* Feedback */}
          <div className="pt-1">
            <FeedbackButtons
              contentType="x_article"
              contentSnapshot={{ title: result.title, body: result.body, articleType: result.articleType }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
