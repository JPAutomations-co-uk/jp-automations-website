/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

type LogsResult = {
  sheetUrl: string
  durationMs?: number
  stdout?: string
  stderr?: string
}

const OUTLIER_TOKEN_COST = 10
const TITLE_VARIANT_TOKEN_COST = 3

function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function YoutubeDashboardPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [keywords, setKeywords] = useState("AI automation,AI agents,LangGraph,CrewAI")
  const [days, setDays] = useState(14)
  const [limit, setLimit] = useState(30)
  const [minScore, setMinScore] = useState(1.5)
  const [top, setTop] = useState(10)
  const [outlierRunning, setOutlierRunning] = useState(false)
  const [outlierError, setOutlierError] = useState("")
  const [outlierResult, setOutlierResult] = useState<LogsResult | null>(null)

  const [sheetUrl, setSheetUrl] = useState("")
  const [titleLimit, setTitleLimit] = useState(20)
  const [variants, setVariants] = useState(3)
  const [variantRunning, setVariantRunning] = useState(false)
  const [variantError, setVariantError] = useState("")
  const [variantResult, setVariantResult] = useState<LogsResult | null>(null)

  const handleRunOutliers = useCallback(async () => {
    if (!user) {
      router.push("/login?redirect=/dashboard/youtube")
      return
    }
    if (tokenBalance < OUTLIER_TOKEN_COST) {
      setOutlierError(`Insufficient tokens. You need ${OUTLIER_TOKEN_COST} tokens but have ${tokenBalance}.`)
      return
    }

    setOutlierRunning(true)
    setOutlierError("")
    setOutlierResult(null)
    setVariantResult(null)
    setVariantError("")

    try {
      const parsedKeywords = keywords
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)

      const res = await fetch("/api/generate/youtube-outliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: parsedKeywords,
          days,
          limit,
          minScore,
          top,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setOutlierError(data.error || "Outlier scan failed.")
        return
      }

      const result: LogsResult = {
        sheetUrl: String(data.sheetUrl || ""),
        durationMs: Number(data.durationMs || 0),
        stdout: String(data.stdout || ""),
        stderr: String(data.stderr || ""),
      }
      setOutlierResult(result)
      setSheetUrl(result.sheetUrl)
      refreshBalance()
    } catch {
      setOutlierError("Something went wrong while running outlier scan.")
    } finally {
      setOutlierRunning(false)
    }
  }, [user, router, tokenBalance, keywords, days, limit, minScore, top, refreshBalance])

  const handleRunTitleVariants = useCallback(async () => {
    if (!user) {
      router.push("/login?redirect=/dashboard/youtube")
      return
    }
    if (!sheetUrl.trim()) {
      setVariantError("Please provide a Google Sheet URL first.")
      return
    }
    if (tokenBalance < TITLE_VARIANT_TOKEN_COST) {
      setVariantError(
        `Insufficient tokens. You need ${TITLE_VARIANT_TOKEN_COST} tokens but have ${tokenBalance}.`
      )
      return
    }

    setVariantRunning(true)
    setVariantError("")
    setVariantResult(null)

    try {
      const res = await fetch("/api/generate/youtube-title-variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetUrl: sheetUrl.trim(),
          limit: titleLimit,
          variants,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setVariantError(data.error || "Title variant generation failed.")
        return
      }

      setVariantResult({
        sheetUrl: String(data.sheetUrl || sheetUrl.trim()),
        durationMs: Number(data.durationMs || 0),
        stdout: String(data.stdout || ""),
        stderr: String(data.stderr || ""),
      })
      refreshBalance()
    } catch {
      setVariantError("Something went wrong while generating title variants.")
    } finally {
      setVariantRunning(false)
    }
  }, [user, router, sheetUrl, tokenBalance, titleLimit, variants, refreshBalance])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                  </svg>
                  <span className="text-sm font-semibold text-teal-400">{tokenBalance}</span>
                  <span className="text-xs text-gray-500">tokens</span>
                </div>
                <UserMenu />
              </>
            ) : (
              <a href="/login?redirect=/dashboard/youtube" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all hover:scale-105">
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

      <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Apps
          </a>

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">YouTube Content Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Outliers + Title Variants</h1>
            <p className="text-gray-500">
              Run outlier detection from your niche, then generate title variants directly into your Google Sheet.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">1. Outlier Scan</h2>
                <span className="text-xs text-teal-400 font-semibold">{OUTLIER_TOKEN_COST} tokens</span>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Keywords (comma-separated)</label>
                <textarea
                  rows={3}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Days back</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value || 14))}
                    className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-teal-400/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Videos / keyword</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value || 30))}
                    className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-teal-400/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Min outlier score</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value || 1.5))}
                    className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-teal-400/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Top summaries</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={top}
                    onChange={(e) => setTop(Number(e.target.value || 10))}
                    className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-teal-400/40"
                  />
                </div>
              </div>

              <button
                onClick={handleRunOutliers}
                disabled={outlierRunning}
                className="w-full py-3 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {outlierRunning ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    Running outlier scan...
                  </>
                ) : (
                  <>Run Outlier Scan ({OUTLIER_TOKEN_COST} tokens)</>
                )}
              </button>

              {outlierError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {outlierError}
                </div>
              )}

              {outlierResult && (
                <div className="p-4 rounded-xl bg-teal-400/10 border border-teal-400/20 space-y-2">
                  <p className="text-sm text-teal-300 font-semibold">Outlier sheet ready</p>
                  <a
                    href={outlierResult.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-teal-300 hover:text-teal-200 transition-colors break-all"
                  >
                    {outlierResult.sheetUrl}
                  </a>
                  {!!outlierResult.durationMs && (
                    <p className="text-xs text-gray-400">Runtime: {(outlierResult.durationMs / 1000).toFixed(1)}s</p>
                  )}
                  {(outlierResult.stdout || outlierResult.stderr) && (
                    <details className="text-xs text-gray-300">
                      <summary className="cursor-pointer text-gray-400 hover:text-gray-200">View execution logs</summary>
                      <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-black/40 border border-white/[0.06] p-3 text-[11px] leading-relaxed">
                        {[outlierResult.stdout || "", outlierResult.stderr || ""].filter(Boolean).join("\n")}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">2. Title Variants</h2>
                <span className="text-xs text-teal-400 font-semibold">{TITLE_VARIANT_TOKEN_COST} tokens</span>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Google Sheet URL</label>
                <input
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/40"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Rows to process</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={titleLimit}
                    onChange={(e) => setTitleLimit(Number(e.target.value || 20))}
                    className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-teal-400/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Variants / title</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={variants}
                    onChange={(e) => setVariants(Number(e.target.value || 3))}
                    className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-teal-400/40"
                  />
                </div>
              </div>

              <button
                onClick={handleRunTitleVariants}
                disabled={variantRunning}
                className="w-full py-3 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {variantRunning ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    Generating variants...
                  </>
                ) : (
                  <>Generate Title Variants ({TITLE_VARIANT_TOKEN_COST} tokens)</>
                )}
              </button>

              {variantError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {variantError}
                </div>
              )}

              {variantResult && (
                <div className="p-4 rounded-xl bg-teal-400/10 border border-teal-400/20 space-y-2">
                  <p className="text-sm text-teal-300 font-semibold">Variants added to sheet</p>
                  <a
                    href={variantResult.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-teal-300 hover:text-teal-200 transition-colors break-all"
                  >
                    {variantResult.sheetUrl}
                  </a>
                  {!!variantResult.durationMs && (
                    <p className="text-xs text-gray-400">Runtime: {(variantResult.durationMs / 1000).toFixed(1)}s</p>
                  )}
                  {(variantResult.stdout || variantResult.stderr) && (
                    <details className="text-xs text-gray-300">
                      <summary className="cursor-pointer text-gray-400 hover:text-gray-200">View execution logs</summary>
                      <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-black/40 border border-white/[0.06] p-3 text-[11px] leading-relaxed">
                        {[variantResult.stdout || "", variantResult.stderr || ""].filter(Boolean).join("\n")}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
