"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

type Mode = "tweet" | "thread"
type Goal = "Brand Awareness" | "Lead Generation" | "Community Building" | "Sales & Conversions" | "Education & Authority"
type ThreadType = "Educational" | "How-To" | "Story" | "Case Study" | "Hot Take" | "Social Proof"
type Tone = "Direct" | "Casual" | "Bold" | "Witty" | "Educational" | "Inspirational" | "Story" | "Professional"

const GOALS: Goal[] = [
  "Brand Awareness",
  "Lead Generation",
  "Community Building",
  "Sales & Conversions",
  "Education & Authority",
]

const THREAD_TYPES: ThreadType[] = [
  "Educational",
  "How-To",
  "Story",
  "Case Study",
  "Hot Take",
  "Social Proof",
]

const TONES: { value: Tone; desc: string }[] = [
  { value: "Direct", desc: "Sharp, no fluff" },
  { value: "Casual", desc: "Friendly, relatable" },
  { value: "Bold", desc: "Provocative takes" },
  { value: "Witty", desc: "Clever, punchy" },
  { value: "Educational", desc: "Clear, authoritative" },
  { value: "Inspirational", desc: "Motivational" },
  { value: "Story", desc: "Narrative, personal" },
  { value: "Professional", desc: "Polished, credible" },
]

const TOKEN_COSTS: Record<Mode, number> = {
  tweet: 2,
  thread: 8,
}

interface TweetVariant {
  text: string
  hook: string
  angle: string
  cta: string
  char_count: number
  why_it_works: string
}

interface ThreadTweet {
  tweet_number: number
  text: string
  type: "hook" | "body" | "cta"
  char_count: number
}

interface ThreadResult {
  thread: ThreadTweet[]
  hook: string
  thread_type: string
  tweet_count: number
  goal_alignment: string
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
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
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
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

function CopyAllButton({ tweets }: { tweets: ThreadTweet[] }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    const fullThread = tweets.map((t) => t.text).join("\n\n")
    navigator.clipboard.writeText(fullThread)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="text-sm text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1.5"
    >
      {copied ? "Copied!" : "Copy full thread"}
    </button>
  )
}

function buildPromptPreview({
  mode, topic, goal, tone, threadType, masterPrompt, temperature,
}: {
  mode: Mode; topic: string; goal: Goal; tone: Tone; threadType: ThreadType; masterPrompt: string; temperature: number
}): string {
  const lines = [
    `── SYSTEM ──────────────────────────────`,
    `Role: Elite X (Twitter) ${mode === "tweet" ? "copywriter" : "thread writer"}`,
    `Goal directive: Serve the goal of "${goal}"`,
    `Tone: ${tone}`,
    `Temperature: ${temperature.toFixed(2)}`,
    masterPrompt.trim() ? `\nMaster Prompt (your custom rules):\n${masterPrompt.trim()}` : "",
    `\n── USER REQUEST ────────────────────────`,
    `Mode: ${mode === "tweet" ? "Single Tweet — generate 3 variants" : `Thread — ${threadType} format`}`,
    `Topic: ${topic.trim() || "(not entered yet)"}`,
    `Goal: ${goal}`,
    `Tone: ${tone}`,
    `Business Context: [Fetched from your saved profile]`,
    `\n── RULES ───────────────────────────────`,
    `• Every tweet under 280 characters`,
    `• Hook must stop the scroll in ≤5 words`,
    `• Never open with "I" or the business name`,
    mode === "tweet"
      ? `• 3 variants with different angles (hot take / insight / story / question)`
      : `• Thread structure: Hook → Body (numbered) → CTA`,
  ].filter(Boolean).join("\n")
  return lines
}

export default function XComposePage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  const [mode, setMode] = useState<Mode>("tweet")
  const [topic, setTopic] = useState("")
  const [goal, setGoal] = useState<Goal>("Lead Generation")
  const [tone, setTone] = useState<Tone>("Direct")
  const [temperature, setTemperature] = useState(0.7)
  const [masterPrompt, setMasterPrompt] = useState("")
  const [threadType, setThreadType] = useState<ThreadType>("Educational")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPromptPreview, setShowPromptPreview] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [tweetResults, setTweetResults] = useState<TweetVariant[]>([])
  const [threadResult, setThreadResult] = useState<ThreadResult | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Persist master prompt across sessions
  useEffect(() => {
    const saved = localStorage.getItem("x-master-prompt")
    if (saved) setMasterPrompt(saved)
  }, [])

  const handleMasterPromptChange = (value: string) => {
    setMasterPrompt(value)
    localStorage.setItem("x-master-prompt", value)
  }

  const temperatureLabel = temperature <= 0.3 ? "Precise" : temperature <= 0.6 ? "Balanced" : temperature <= 0.85 ? "Creative" : "Wild"

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }
    if (!user) {
      router.push(`/login?redirect=/dashboard/x`)
      return
    }
    const cost = TOKEN_COSTS[mode]
    if (tokenBalance < cost) {
      setError(`Insufficient tokens. You need ${cost} but have ${tokenBalance}.`)
      return
    }

    setGenerating(true)
    setError("")
    setTweetResults([])
    setThreadResult(null)

    try {
      const res = await fetch("/api/generate/x-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, topic: topic.trim(), goal, threadType, tone, temperature, masterPrompt }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Generation failed")
        return
      }
      if (mode === "tweet") {
        setTweetResults(data.tweets || [])
      } else {
        setThreadResult(data)
      }
      refreshBalance()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setGenerating(false)
    }
  }, [topic, mode, goal, threadType, tone, temperature, masterPrompt, user, tokenBalance, refreshBalance, router])

  const hasResults = tweetResults.length > 0 || threadResult !== null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 border-b border-white/5 bg-black/20 backdrop-blur-sm">
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25 4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                  </svg>
                  <span className="text-sm font-semibold text-teal-400">{tokenBalance}</span>
                  <span className="text-xs text-gray-500">tokens</span>
                </div>
                <UserMenu />
              </>
            ) : (
              <a href="/login?redirect=/dashboard/x" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all hover:scale-105">
                Sign In
              </a>
            )}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-50 p-2 text-white focus:outline-none"
          >
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
          {user && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-lg font-semibold text-teal-400">{tokenBalance} tokens</span>
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors mb-8 group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Apps
          </a>

          {/* Header + Tab Nav */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">X Content Engine</span>
            </div>

            <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6 max-w-sm">
              <span className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">
                Compose
              </span>
              <a href="/dashboard/x/planner" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Planner
              </a>
              <a href="/dashboard/x/interactions" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Accounts
              </a>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Compose</h1>
            <p className="text-gray-500">Write tweets and threads built around your goal.</p>
          </div>

          <div className="grid lg:grid-cols-[380px_1fr] gap-8">

            {/* Controls */}
            <div className="space-y-5">

              {/* Mode */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <label className="block text-sm font-medium text-gray-400 mb-3">Content Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["tweet", "thread"] as Mode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                        mode === m
                          ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                          : "border-white/[0.08] text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <XIcon className="w-5 h-5" />
                      <span className="text-sm font-semibold capitalize">{m === "tweet" ? "Single Tweet" : "Thread"}</span>
                      <span className="text-xs opacity-60">{TOKEN_COSTS[m]} tokens</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <label className="block text-sm font-medium text-gray-400 mb-3">Topic or Idea</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none text-sm"
                  placeholder={mode === "tweet"
                    ? "Why most service businesses fail on X..."
                    : "How I got my first 10 clients with zero ad spend..."}
                />
              </div>

              {/* Tone of Voice */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <label className="block text-sm font-medium text-gray-400 mb-3">Tone of Voice</label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`flex flex-col text-left px-3 py-2.5 rounded-xl border transition-all ${
                        tone === t.value
                          ? "border-teal-400/50 bg-teal-400/10"
                          : "border-white/[0.08] hover:border-white/20"
                      }`}
                    >
                      <span className={`text-xs font-semibold ${tone === t.value ? "text-teal-400" : "text-gray-300"}`}>{t.value}</span>
                      <span className="text-[10px] text-gray-600 mt-0.5">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <label className="block text-sm font-medium text-gray-400 mb-3">Goal</label>
                <div className="space-y-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${
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

              {/* Thread type (thread mode only) */}
              {mode === "thread" && (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <label className="block text-sm font-medium text-gray-400 mb-3">Thread Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {THREAD_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setThreadType(t)}
                        className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                          threadType === t
                            ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                            : "border-white/[0.08] text-gray-500 hover:border-white/20 hover:text-gray-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-400">Advanced</span>
                    {masterPrompt.trim() && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-400/10 text-teal-500 border border-teal-400/20">Active</span>
                    )}
                  </div>
                  <svg className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showAdvanced && (
                  <div className="px-5 pb-5 space-y-5 border-t border-white/[0.06] pt-4">

                    {/* Temperature */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-gray-400">Temperature</label>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            temperature <= 0.3 ? "bg-blue-500/10 text-blue-400" :
                            temperature <= 0.6 ? "bg-teal-500/10 text-teal-400" :
                            temperature <= 0.85 ? "bg-amber-500/10 text-amber-400" :
                            "bg-red-500/10 text-red-400"
                          }`}>{temperatureLabel}</span>
                          <span className="text-xs text-gray-500 font-mono">{temperature.toFixed(2)}</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-400 [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] text-gray-600">Precise / Consistent</span>
                        <span className="text-[10px] text-gray-600">Creative / Varied</span>
                      </div>
                    </div>

                    {/* Master Prompt */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Master Prompt
                      </label>
                      <p className="text-[10px] text-gray-600 mb-2">Persistent rules applied to every generation. Use this to lock your writing style, handle, language, and constraints.</p>
                      <textarea
                        value={masterPrompt}
                        onChange={(e) => handleMasterPromptChange(e.target.value)}
                        rows={5}
                        placeholder={`e.g. Always write in British English.\nMy Twitter handle is @yourhandle.\nNever use exclamation marks.\nAlways end with a question to drive replies.\nAvoid generic motivational phrases.`}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-700 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none text-xs leading-relaxed font-mono"
                      />
                      <p className="text-[10px] text-gray-600 mt-1.5">Saved to your browser automatically.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate */}
              <button
                onClick={handleGenerate}
                disabled={generating || !topic.trim()}
                className="w-full py-4 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {generating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate {mode === "tweet" ? "3 Tweets" : "Thread"}
                    <span className="text-black/60 text-sm">({TOKEN_COSTS[mode]} tokens)</span>
                  </>
                )}
              </button>

              {/* Prompt Preview toggle */}
              <button
                onClick={() => setShowPromptPreview(!showPromptPreview)}
                className="w-full text-xs text-gray-600 hover:text-gray-400 transition-colors py-1 flex items-center justify-center gap-1.5"
              >
                <svg className={`w-3 h-3 transition-transform duration-200 ${showPromptPreview ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {showPromptPreview ? "Hide" : "Preview"} master prompt
              </button>

              {showPromptPreview && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-medium">Assembled Prompt</p>
                  <pre className="text-[10px] text-gray-500 leading-relaxed whitespace-pre-wrap font-mono">
                    {buildPromptPreview({ mode, topic, goal, tone, threadType, masterPrompt, temperature })}
                  </pre>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Results */}
            <div className="min-h-[400px]">
              {!hasResults && !generating ? (
                <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
                  <div className="text-center px-8 py-16">
                    <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                      <XIcon className="w-7 h-7 text-gray-600" />
                    </div>
                    <p className="text-gray-500 font-medium mb-1">No content yet</p>
                    <p className="text-gray-600 text-sm">Enter a topic and hit generate.</p>
                  </div>
                </div>
              ) : generating ? (
                <div className="h-full flex items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <div className="text-center px-8 py-16">
                    <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                    <p className="text-white font-medium mb-1">
                      {mode === "tweet" ? "Writing 3 tweet variants..." : `Writing ${threadType} thread...`}
                    </p>
                    <p className="text-gray-500 text-sm">This takes about 10–20 seconds.</p>
                  </div>
                </div>
              ) : mode === "tweet" && tweetResults.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">3 Tweet Variants</h2>
                  {tweetResults.map((tweet, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-teal-400/20 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Variant {i + 1} · {tweet.angle}</span>
                        <div className="flex items-center gap-3">
                          <CharBadge count={tweet.char_count || tweet.text?.length || 0} />
                          <CopyButton text={tweet.text} />
                        </div>
                      </div>
                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap mb-4">{tweet.text}</p>
                      <div className="border-t border-white/[0.06] pt-3 space-y-1.5">
                        <p className="text-xs text-gray-600"><span className="text-gray-500">Why it works:</span> {tweet.why_it_works}</p>
                        <p className="text-xs text-gray-600"><span className="text-gray-500">CTA:</span> {tweet.cta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : threadResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">{threadResult.thread_type} Thread · {threadResult.tweet_count} tweets</h2>
                    <CopyAllButton tweets={threadResult.thread} />
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
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
