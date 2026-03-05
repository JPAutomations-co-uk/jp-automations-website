"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

// ─── Types ───────────────────────────────────────────────────────────────────

type PostGoal = "engagement" | "leads" | "authority" | "shares"
type PostFormat = "auto" | "text_post" | "story" | "step_by_step" | "bold_claim" | "hot_take"
type PostMode = "single" | "batch"

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
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TOKEN_COST_SINGLE = 3
const TOKEN_COST_BATCH_PER_ITEM = 2

const GOALS: { value: PostGoal; label: string; description: string }[] = [
  { value: "engagement", label: "Engagement", description: "Maximise comments and genuine discussion" },
  { value: "leads", label: "Lead Generation", description: "Drive DMs, calls, and enquiries" },
  { value: "authority", label: "Thought Leadership", description: "Build expert reputation in your niche" },
  { value: "shares", label: "Reshares", description: "Create content people send to their network" },
]

const FORMATS: { value: PostFormat; label: string; description: string }[] = [
  { value: "auto", label: "Auto", description: "AI picks the best format for your content" },
  { value: "text_post", label: "Text Post", description: "Personal, direct, conversational" },
  { value: "story", label: "Hook → Story → Lesson", description: "Personal story with a takeaway" },
  { value: "step_by_step", label: "Step-by-Step", description: "Numbered actionable steps" },
  { value: "bold_claim", label: "Bold Claim", description: "Counterintuitive statement + proof" },
  { value: "hot_take", label: "Hot Take", description: "Contrarian opinion that sparks debate" },
]

const LOADING_MESSAGES = [
  "Crafting your hook...",
  "Structuring your post for maximum dwell time...",
  "Writing your opening lines...",
  "Optimising for LinkedIn's algorithm...",
  "Polishing for authenticity and impact...",
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

  const [mode, setMode] = useState<PostMode>("single")
  const [content, setContent] = useState("")
  const [batchContent, setBatchContent] = useState("")
  const [goal, setGoal] = useState<PostGoal>("engagement")
  const [format, setFormat] = useState<PostFormat>("auto")

  const [generating, setGenerating] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [error, setError] = useState("")

  const [posts, setPosts] = useState<GeneratedPost[] | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const batchItems = useMemo(() => parseBatchItems(batchContent), [batchContent])
  const batchCount = Math.min(batchItems.length, 20)
  const tokenCost = mode === "single" ? TOKEN_COST_SINGLE : batchCount * TOKEN_COST_BATCH_PER_ITEM
  const canGenerate = mode === "single" ? content.trim().length > 0 : batchCount > 0

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return

    if (!user) {
      router.push("/login?redirect=/dashboard/linkedin")
      return
    }

    if (tokenBalance < tokenCost) {
      setError(`Insufficient tokens. You need ${tokenCost} tokens but have ${tokenBalance}.`)
      return
    }

    setGenerating(true)
    setError("")
    setPosts(null)
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
      const res = await fetch("/api/generate/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          mode,
          content: mode === "single" ? content.trim() : undefined,
          batchContent: mode === "batch" ? batchItems.slice(0, 20).join("\n") : undefined,
          goal,
          format,
        }),
      })

      if (!mountedRef.current) return
      const data = await res.json()
      if (!mountedRef.current) return

      if (!res.ok) {
        setError(data.error || "Generation failed")
        return
      }

      setPosts(data.posts)
      if (data.posts?.length === 1) setExpandedIndex(0)
      refreshBalance()
    } catch (err) {
      if (mountedRef.current) {
        const isTimeout = err instanceof DOMException && err.name === "AbortError"
        setError(isTimeout ? "Generation timed out. Please try again." : "Something went wrong. Please try again.")
      }
    } finally {
      clearTimeout(timeoutId)
      if (loadingIntervalRef.current) { clearInterval(loadingIntervalRef.current); loadingIntervalRef.current = null }
      if (timerIntervalRef.current) { clearInterval(timerIntervalRef.current); timerIntervalRef.current = null }
      if (mountedRef.current) setGenerating(false)
    }
  }, [mode, content, batchContent, goal, format, canGenerate, user, tokenBalance, tokenCost, refreshBalance, router, batchItems])

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
    if (!posts) return
    const all = posts.map((p, i) => `--- Post ${i + 1} ---\n${p.full_post}`).join("\n\n")
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
  }, [posts])

  const handleReset = useCallback(() => {
    setPosts(null)
    setExpandedIndex(null)
    setError("")
  }, [])

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

          {/* Phase 1: Input */}
          {!posts && !generating && (
            <div className="space-y-6">

              {/* Mode Toggle */}
              <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl max-w-xs">
                <button
                  onClick={() => setMode("single")}
                  className={`flex-1 py-2.5 px-4 text-sm font-semibold text-center rounded-lg transition-all ${mode === "single" ? "bg-teal-400/10 text-teal-400 border border-teal-400/20" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Single
                </button>
                <button
                  onClick={() => setMode("batch")}
                  className={`flex-1 py-2.5 px-4 text-sm font-semibold text-center rounded-lg transition-all ${mode === "batch" ? "bg-teal-400/10 text-teal-400 border border-teal-400/20" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Batch
                </button>
              </div>

              {/* Content Input */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-1">Your Content</h2>
                <p className="text-sm text-gray-500 mb-4">
                  {mode === "single"
                    ? "Describe what your post is about — a topic, a story, a lesson, or an idea."
                    : "Enter multiple post ideas, one per line or as a numbered list (max 20)."}
                </p>

                {mode === "single" ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="e.g. How I saved a plumber 15 hours a week by automating their entire enquiry-to-invoice process, and what that did to their work-life balance..."
                    rows={5}
                    maxLength={2000}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                  />
                ) : (
                  <textarea
                    value={batchContent}
                    onChange={(e) => setBatchContent(e.target.value)}
                    placeholder={"1. How automation saved our client 15 hours a week\n2. 3 signs your business needs a CRM\n3. Why I turned down a £10k client"}
                    rows={8}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                  />
                )}

                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-600">
                    {mode === "single"
                      ? `${content.length}/2000 characters`
                      : `${batchCount} idea${batchCount !== 1 ? "s" : ""} detected`}
                  </span>
                  {mode === "batch" && batchCount > 20 && (
                    <span className="text-xs text-amber-400">Max 20 — only the first 20 will be used</span>
                  )}
                </div>
              </div>

              {/* Goal */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-1">Post Goal</h2>
                <p className="text-sm text-gray-500 mb-4">What do you want this post to achieve?</p>
                <div className="grid grid-cols-2 gap-3">
                  {GOALS.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setGoal(g.value)}
                      className={`text-left p-4 rounded-xl border transition-all ${goal === g.value ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}
                    >
                      <p className={`text-sm font-semibold ${goal === g.value ? "text-teal-400" : "text-white"}`}>{g.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{g.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-1">Post Format</h2>
                <p className="text-sm text-gray-500 mb-4">Choose a structure, or let AI pick the best one.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FORMATS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFormat(f.value)}
                      className={`text-left p-4 rounded-xl border transition-all ${format === f.value ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}
                    >
                      <p className={`text-sm font-semibold ${format === f.value ? "text-teal-400" : "text-white"}`}>{f.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{f.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div role="alert" className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`w-full py-4 px-6 rounded-xl text-sm font-bold transition-all ${canGenerate ? "bg-teal-400 text-black hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
              >
                Generate Post{mode === "batch" && batchCount > 1 ? "s" : ""}
                <span className="ml-2 text-xs opacity-75">({tokenCost} token{tokenCost !== 1 ? "s" : ""})</span>
              </button>
            </div>
          )}

          {/* Phase 2: Loading */}
          {generating && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center px-8 py-16">
                <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-lg mb-2">Writing your LinkedIn post{mode === "batch" && batchCount > 1 ? "s" : ""}</p>
                <p className="text-gray-500 text-sm animate-pulse">{LOADING_MESSAGES[loadingStep]}</p>
                <p className="text-gray-600 text-xs mt-3 font-mono tabular-nums">
                  {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")}
                  <span className="text-gray-700"> / ~{mode === "batch" ? "20-40" : "10-20"} sec</span>
                </p>
              </div>
            </div>
          )}

          {/* Phase 3: Results */}
          {posts && !generating && (
            <div className="space-y-6">
              {error && (
                <div role="alert" className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">{error}</div>
              )}

              {posts.length === 1 && (
                <PostCard post={posts[0]} index={0} copiedIndex={copiedIndex} onCopy={handleCopy} />
              )}

              {posts.length > 1 && (
                <div className="space-y-3">
                  {posts.map((post, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
                      <div className="flex items-center gap-4 p-5">
                        <button
                          onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                          className="flex-1 flex items-center gap-4 text-left min-w-0"
                        >
                          <span className="text-xs font-bold text-gray-600 w-6">#{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-400 truncate">{post.input_summary || `Post ${i + 1}`}</p>
                            <p className="text-sm text-white font-medium truncate mt-0.5">&ldquo;{post.hook}&rdquo;</p>
                          </div>
                          <WritingScoreBadge score={post.writing_score} size="sm" />
                          <svg className={`w-4 h-4 text-gray-500 transition-transform ${expandedIndex === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleCopy(post.full_post, i)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all shrink-0"
                        >
                          {copiedIndex === i ? "Copied!" : "Copy"}
                        </button>
                      </div>

                      {expandedIndex === i && (
                        <div className="border-t border-white/[0.06] p-5 md:p-6">
                          <PostDetail post={post} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/[0.06]">
                {posts.length > 1 && (
                  <button onClick={handleCopyAll} className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all">
                    {copiedIndex === -1 ? "Copied All!" : "Copy All"}
                  </button>
                )}
                <button onClick={handleGenerate} className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all">
                  Regenerate ({tokenCost} tokens)
                </button>
                <button onClick={handleReset} className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all">
                  New Post
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

function PostCard({
  post,
  index,
  copiedIndex,
  onCopy,
}: {
  post: GeneratedPost
  index: number
  copiedIndex: number | null
  onCopy: (text: string, index: number) => void
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Your LinkedIn Post</p>
          <p className="text-sm text-gray-400">Ready to copy and post</p>
        </div>
        <WritingScoreBadge score={post.writing_score} />
      </div>

      <PostDetail post={post} />

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Full Post (ready to paste)</p>
        <div className="relative bg-black/40 border border-white/10 rounded-xl p-5">
          <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-[family-name:var(--font-geist-sans)]">
            {post.full_post}
          </pre>
          <button
            onClick={() => onCopy(post.full_post, index)}
            className="absolute top-3 right-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all"
          >
            {copiedIndex === index ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  )
}

function PostDetail({ post }: { post: GeneratedPost }) {
  const [tipsOpen, setTipsOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hook (before &ldquo;see more&rdquo;)</p>
        <p className="text-lg font-bold text-white italic">&ldquo;{post.hook}&rdquo;</p>
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
          {post.hashtags.map((tag, i) => (
            <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {post.writing_tips.length > 0 && (
        <div>
          <button
            onClick={() => setTipsOpen(!tipsOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
          >
            Writing Tips ({post.writing_tips.length})
            <svg className={`w-3 h-3 transition-transform ${tipsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {tipsOpen && (
            <ul className="mt-3 space-y-2">
              {post.writing_tips.map((tip, i) => (
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
