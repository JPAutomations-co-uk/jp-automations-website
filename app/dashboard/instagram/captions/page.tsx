"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"

// ─── Types ───────────────────────────────────────────────────────────────────

type CaptionGoal = "engagement" | "leads" | "authority" | "saves" | "shares" | "traffic"
type CaptionFramework = "auto" | "pas" | "hook_story_lesson" | "myth_vs_reality" | "step_by_step" | "hot_take"
type CaptionMode = "single" | "batch"

interface GeneratedCaption {
  hook: string
  body: string
  cta: string
  hashtags: string[]
  keywords: string[]
  full_caption: string
  seo_score: number
  seo_tips: string[]
  input_index?: number
  input_summary?: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TOKEN_COST_SINGLE = 5
const TOKEN_COST_BATCH_PER_ITEM = 3

const GOALS: { value: CaptionGoal; label: string; description: string }[] = [
  { value: "engagement", label: "Engagement", description: "Maximise comments, likes, and interactions" },
  { value: "leads", label: "Lead Generation", description: "Drive DMs, link clicks, and enquiries" },
  { value: "authority", label: "Authority", description: "Position as the expert in your niche" },
  { value: "saves", label: "Saves", description: "Create bookmark-worthy reference content" },
  { value: "shares", label: "Shares", description: "Make content people send to friends" },
  { value: "traffic", label: "Website Traffic", description: "Drive clicks to your link in bio" },
]

const FRAMEWORKS: { value: CaptionFramework; label: string; description: string }[] = [
  { value: "auto", label: "Auto", description: "AI picks the best framework for your content" },
  { value: "pas", label: "PAS", description: "Problem \u2192 Agitate \u2192 Solution" },
  { value: "hook_story_lesson", label: "Hook \u2192 Story \u2192 Lesson", description: "Open strong, tell a story, extract the insight" },
  { value: "myth_vs_reality", label: "Myth vs Reality", description: "Debunk a common misconception" },
  { value: "step_by_step", label: "Step-by-Step", description: "Numbered actionable steps" },
  { value: "hot_take", label: "Hot Take", description: "Bold opinion backed by proof" },
]

const LOADING_MESSAGES = [
  "Researching trending SEO keywords for your niche...",
  "Crafting a scroll-stopping hook...",
  "Optimising for Instagram\u2019s search algorithm...",
  "Selecting high-impact hashtags...",
  "Polishing your caption for maximum reach...",
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseBatchItems(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\d+[\.\)\-]\s*/, ""))
    .filter((item) => item.length > 0)
}

function highlightKeywords(text: string, keywords: string[]): React.ReactNode[] {
  if (!keywords.length) return [text]
  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  const regex = new RegExp(`(${escaped.join("|")})`, "gi")
  const parts = text.split(regex)
  return parts.map((part, i) => {
    const isKeyword = keywords.some((k) => k.toLowerCase() === part.toLowerCase())
    return isKeyword ? (
      <mark key={i} className="bg-teal-400/20 text-teal-300 px-0.5 rounded">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  })
}

function SEOScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
  const color =
    score >= 80
      ? "bg-green-400/10 text-green-400 border-green-400/20"
      : score >= 60
        ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
        : "bg-red-400/10 text-red-400 border-red-400/20"

  const sizeClass = size === "sm" ? "w-10 h-10 text-xs" : "w-14 h-14 text-sm"

  return (
    <div
      className={`${sizeClass} ${color} rounded-full border flex items-center justify-center font-bold shrink-0`}
      aria-label={`SEO score: ${score} out of 100`}
      title={`SEO Score: ${score}/100`}
    >
      {score}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SEOCaptionsPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  // Input state
  const [mode, setMode] = useState<CaptionMode>("single")
  const [content, setContent] = useState("")
  const [batchContent, setBatchContent] = useState("")
  const [goal, setGoal] = useState<CaptionGoal>("engagement")
  const [framework, setFramework] = useState<CaptionFramework>("auto")

  // Generation state
  const [generating, setGenerating] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [error, setError] = useState("")

  // Results state
  const [captions, setCaptions] = useState<GeneratedCaption[] | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Nav
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Refs
  const mountedRef = useRef(true)
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current)
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  // Batch item count (capped at 20)
  const batchItems = useMemo(() => parseBatchItems(batchContent), [batchContent])
  const batchCount = Math.min(batchItems.length, 20)

  // Token cost
  const tokenCost = mode === "single" ? TOKEN_COST_SINGLE : batchCount * TOKEN_COST_BATCH_PER_ITEM

  // Validation
  const canGenerate =
    mode === "single"
      ? content.trim().length > 0
      : batchCount > 0

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return

    if (!user) {
      router.push("/login?redirect=/dashboard/instagram/captions")
      return
    }

    if (tokenBalance < tokenCost) {
      setError(`Insufficient tokens. You need ${tokenCost} tokens but have ${tokenBalance}.`)
      return
    }

    setGenerating(true)
    setError("")
    setCaptions(null)
    setExpandedIndex(null)
    setLoadingStep(0)
    setElapsedSeconds(0)

    loadingIntervalRef.current = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 3000)

    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120_000)

    try {
      const res = await fetch("/api/generate/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          mode,
          content: mode === "single" ? content.trim() : undefined,
          batchContent: mode === "batch" ? batchItems.slice(0, 20).join("\n") : undefined,
          goal,
          framework,
        }),
      })

      if (!mountedRef.current) return

      const data = await res.json()

      if (!mountedRef.current) return

      if (!res.ok) {
        setError(data.error || "Generation failed")
        return
      }

      setCaptions(data.captions)
      if (data.captions?.length === 1) setExpandedIndex(0)
      refreshBalance()
    } catch (err) {
      if (mountedRef.current) {
        const isTimeout = err instanceof DOMException && err.name === "AbortError"
        setError(
          isTimeout
            ? "Generation timed out. Please try again."
            : "Something went wrong. Please try again."
        )
      }
    } finally {
      clearTimeout(timeoutId)
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
        loadingIntervalRef.current = null
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      if (mountedRef.current) setGenerating(false)
    }
  }, [mode, content, batchContent, goal, framework, canGenerate, user, tokenBalance, tokenCost, refreshBalance, router])

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) setCopiedIndex(null)
      }, 2000)
    } catch {
      setError("Failed to copy to clipboard.")
    }
  }, [])

  const handleCopyAll = useCallback(async () => {
    if (!captions) return
    const all = captions.map((c, i) => `--- Caption ${i + 1} ---\n${c.full_caption}`).join("\n\n")
    try {
      await navigator.clipboard.writeText(all)
      setCopiedIndex(-1)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) setCopiedIndex(null)
      }, 2000)
    } catch {
      setError("Failed to copy to clipboard.")
    }
  }, [captions])

  const handleReset = useCallback(() => {
    setCaptions(null)
    setExpandedIndex(null)
    setError("")
  }, [])

  // ─── Render ────────────────────────────────────────────────────────────────

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
            <a href="/dashboard" className="px-5 py-2.5 text-sm font-semibold border border-teal-400/40 text-teal-400 rounded-lg hover:bg-teal-400/10 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]">
              My Apps
            </a>
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
              <a href="/login?redirect=/dashboard/instagram/captions" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all hover:scale-105">
                Sign In
              </a>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMobileMenuOpen} className="md:hidden relative z-50 p-2 text-white focus:outline-none">
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
          <a href="/dashboard" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>My Apps</a>
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
            <a href="/login?redirect=/dashboard/instagram/captions" className="text-4xl font-bold text-teal-400 hover:text-teal-300 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign In</a>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <a href="/dashboard/instagram" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors mb-8 group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Instagram
          </a>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">Instagram Content Engine</span>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6 max-w-2xl">
              <a href="/dashboard/instagram" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Generate
              </a>
              <a href="/dashboard/instagram/planner" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Plan
              </a>
              <span className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">
                Captions
              </span>
              <a href="/dashboard/instagram/ads" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Ads
              </a>
              <a href="/dashboard/instagram/reels" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Reels
              </a>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">SEO Captions</h1>
            <p className="text-gray-500">Generate search-optimised Instagram captions that rank and convert.</p>
          </div>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* PHASE 1: Input Form                                             */}
          {/* ──────────────────────────────────────────────────────────────── */}
          {!captions && !generating && (
            <div className="max-w-3xl space-y-6">
              {/* Mode Toggle */}
              <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl max-w-xs">
                <button
                  onClick={() => setMode("single")}
                  aria-pressed={mode === "single"}
                  className={`flex-1 py-2.5 px-4 text-sm font-semibold text-center rounded-lg transition-all ${
                    mode === "single"
                      ? "bg-teal-400/10 text-teal-400 border border-teal-400/20"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Single
                </button>
                <button
                  onClick={() => setMode("batch")}
                  aria-pressed={mode === "batch"}
                  className={`flex-1 py-2.5 px-4 text-sm font-semibold text-center rounded-lg transition-all ${
                    mode === "batch"
                      ? "bg-teal-400/10 text-teal-400 border border-teal-400/20"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Batch
                </button>
              </div>

              {/* Content Input */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-1">Your Content</h2>
                <p className="text-sm text-gray-500 mb-4">
                  {mode === "single"
                    ? "Describe what your post is about \u2014 a script, idea, or brief description."
                    : "Paste multiple content ideas, one per line or as a numbered list (max 20)."}
                </p>

                {mode === "single" ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="e.g. A reel showing how I automated a plumber's entire enquiry-to-invoice flow, saving them 15 hours a week..."
                    rows={5}
                    maxLength={2000}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                  />
                ) : (
                  <textarea
                    value={batchContent}
                    onChange={(e) => setBatchContent(e.target.value)}
                    placeholder={"1. Reel showing client's automated enquiry system\n2. Carousel: 5 signs you need business automation\n3. Before/after of a tradesman's workflow"}
                    rows={8}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                  />
                )}

                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-600">
                    {mode === "single"
                      ? `${content.length}/2000 characters`
                      : `${batchCount} item${batchCount !== 1 ? "s" : ""} detected`}
                  </span>
                  {mode === "batch" && batchCount > 20 && (
                    <span className="text-xs text-amber-400">Max 20 items — only the first 20 will be used</span>
                  )}
                </div>
              </div>

              {/* Goal Selector */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-1">Caption Goal</h2>
                <p className="text-sm text-gray-500 mb-4">What do you want this caption to achieve?</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {GOALS.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setGoal(g.value)}
                      aria-pressed={goal === g.value}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        goal === g.value
                          ? "border-teal-400/50 bg-teal-400/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <p className={`text-sm font-semibold ${goal === g.value ? "text-teal-400" : "text-white"}`}>
                        {g.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{g.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Framework Selector */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-1">Caption Framework</h2>
                <p className="text-sm text-gray-500 mb-4">Choose a structure, or let the AI pick the best one.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FRAMEWORKS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFramework(f.value)}
                      aria-pressed={framework === f.value}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        framework === f.value
                          ? "border-teal-400/50 bg-teal-400/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <p className={`text-sm font-semibold ${framework === f.value ? "text-teal-400" : "text-white"}`}>
                        {f.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{f.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div role="alert" className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`w-full py-4 px-6 rounded-xl text-sm font-bold transition-all ${
                  canGenerate
                    ? "bg-teal-400 text-black hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                Generate Caption{mode === "batch" && batchCount > 1 ? "s" : ""}
                <span className="ml-2 text-xs opacity-75">
                  ({tokenCost} token{tokenCost !== 1 ? "s" : ""})
                </span>
              </button>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* PHASE 2: Loading                                                */}
          {/* ──────────────────────────────────────────────────────────────── */}
          {generating && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center px-8 py-16">
                <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-lg mb-2">Generating your caption{mode === "batch" && batchCount > 1 ? "s" : ""}</p>
                <p className="text-gray-500 text-sm animate-pulse">{LOADING_MESSAGES[loadingStep]}</p>
                <p className="text-gray-600 text-xs mt-3 font-mono tabular-nums">
                  {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")}
                  <span className="text-gray-700"> / ~{mode === "batch" ? "30-60" : "15-30"} sec</span>
                </p>
                {elapsedSeconds > 60 && (
                  <p className="text-amber-400/80 text-xs mt-2">Taking longer than usual — the AI may be under heavy load.</p>
                )}
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* PHASE 3: Results                                                */}
          {/* ──────────────────────────────────────────────────────────────── */}
          {captions && !generating && (
            <div className="space-y-6">
              {/* Error */}
              {error && (
                <div role="alert" className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Single Caption Result */}
              {captions.length === 1 && (
                <CaptionCard
                  caption={captions[0]}
                  index={0}
                  copiedIndex={copiedIndex}
                  onCopy={handleCopy}
                />
              )}

              {/* Batch Caption Results */}
              {captions.length > 1 && (
                <div className="space-y-3">
                  {captions.map((caption, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden transition-all">
                      {/* Collapsed Header */}
                      <div className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-all">
                        <button
                          onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                          aria-expanded={expandedIndex === i}
                          className="flex-1 flex items-center gap-4 text-left min-w-0"
                        >
                          <span className="text-xs font-bold text-gray-600 w-6">#{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-400 truncate">
                              {caption.input_summary || `Caption ${i + 1}`}
                            </p>
                            <p className="text-sm text-white font-medium truncate mt-0.5">
                              &ldquo;{caption.hook}&rdquo;
                            </p>
                          </div>
                          <SEOScoreBadge score={caption.seo_score} size="sm" />
                          <svg
                            className={`w-4 h-4 text-gray-500 transition-transform ${expandedIndex === i ? "rotate-180" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleCopy(caption.full_caption, i)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all shrink-0"
                        >
                          {copiedIndex === i ? "Copied!" : "Copy"}
                        </button>
                      </div>

                      {/* Expanded Content */}
                      {expandedIndex === i && (
                        <div className="border-t border-white/[0.06] p-5 md:p-6">
                          <CaptionDetail caption={caption} keywords={caption.keywords} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Action Bar */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/[0.06]">
                {captions.length > 1 && (
                  <button
                    onClick={handleCopyAll}
                    className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    {copiedIndex === -1 ? "Copied All!" : "Copy All"}
                  </button>
                )}
                <button
                  onClick={handleGenerate}
                  className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"
                >
                  Regenerate ({tokenCost} tokens)
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all"
                >
                  New Caption
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function CaptionCard({
  caption,
  index,
  copiedIndex,
  onCopy,
}: {
  caption: GeneratedCaption
  index: number
  copiedIndex: number | null
  onCopy: (text: string, index: number) => void
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header with Score */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Caption</p>
          <p className="text-sm text-gray-400">SEO-optimised and ready to paste</p>
        </div>
        <SEOScoreBadge score={caption.seo_score} />
      </div>

      <CaptionDetail caption={caption} keywords={caption.keywords} />

      {/* Full Caption (ready to paste) */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Full Caption (ready to paste)</p>
        <div className="relative bg-black/40 border border-white/10 rounded-xl p-5">
          <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-[family-name:var(--font-geist-sans)]">
            {caption.full_caption}
          </pre>
          <button
            onClick={() => onCopy(caption.full_caption, index)}
            className="absolute top-3 right-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all"
          >
            {copiedIndex === index ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  )
}

function CaptionDetail({
  caption,
  keywords,
}: {
  caption: GeneratedCaption
  keywords: string[]
}) {
  const [tipsOpen, setTipsOpen] = useState(false)

  return (
    <div className="space-y-5">
      {/* Hook */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hook</p>
        <p className="text-lg font-bold text-white italic">&ldquo;{caption.hook}&rdquo;</p>
      </div>

      {/* Body */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Body</p>
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
          {highlightKeywords(caption.body, keywords)}
        </p>
      </div>

      {/* CTA */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Call to Action</p>
        <p className="text-sm font-semibold text-teal-400">{caption.cta}</p>
      </div>

      {/* Hashtags */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hashtags</p>
        <div className="flex flex-wrap gap-2">
          {caption.hashtags.map((tag, i) => (
            <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* SEO Keywords */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">SEO Keywords</p>
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, i) => (
            <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400">
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* SEO Tips */}
      {caption.seo_tips.length > 0 && (
        <div>
          <button
            onClick={() => setTipsOpen(!tipsOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
          >
            SEO Tips ({caption.seo_tips.length})
            <svg
              className={`w-3 h-3 transition-transform ${tipsOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {tipsOpen && (
            <ul className="mt-3 space-y-2">
              {caption.seo_tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-teal-400 mt-0.5 shrink-0">&bull;</span>
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
