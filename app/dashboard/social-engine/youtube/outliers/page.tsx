"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"

const OUTLIER_TOKEN_COST = 10

type LogsResult = {
  sheetUrl: string
  durationMs?: number
  stdout?: string
  stderr?: string
}

export default function YouTubeOutliersPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  const [keywords, setKeywords] = useState("AI automation,AI agents,LangGraph,CrewAI")
  const [days, setDays] = useState(14)
  const [limit, setLimit] = useState(30)
  const [minScore, setMinScore] = useState(1.5)
  const [top, setTop] = useState(10)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<LogsResult | null>(null)

  const handleRun = useCallback(async () => {
    if (!user) {
      router.push("/login?redirect=/dashboard/social-engine/youtube/outliers")
      return
    }
    if (tokenBalance < OUTLIER_TOKEN_COST) {
      setError(`Insufficient tokens. You need ${OUTLIER_TOKEN_COST} tokens but have ${tokenBalance}.`)
      return
    }

    setRunning(true)
    setError("")
    setResult(null)

    try {
      const parsedKeywords = keywords.split(",").map((v) => v.trim()).filter(Boolean)

      const res = await fetch("/api/generate/youtube-outliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: parsedKeywords, days, limit, minScore, top }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Outlier scan failed.")
        return
      }

      setResult({
        sheetUrl: String(data.sheetUrl || ""),
        durationMs: Number(data.durationMs || 0),
        stdout: String(data.stdout || ""),
        stderr: String(data.stderr || ""),
      })
      refreshBalance()
    } catch {
      setError("Something went wrong while running outlier scan.")
    } finally {
      setRunning(false)
    }
  }, [user, router, tokenBalance, keywords, days, limit, minScore, top, refreshBalance])

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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Outlier Scan</h1>
          <span className="text-xs text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
            {OUTLIER_TOKEN_COST} tokens
          </span>
        </div>
        <p className="text-gray-500">Find viral videos in your niche and analyse what makes them work.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
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
          onClick={handleRun}
          disabled={running}
          className="w-full py-3 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {running ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Running outlier scan...
            </>
          ) : (
            <>Run Outlier Scan ({OUTLIER_TOKEN_COST} tokens)</>
          )}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-5 rounded-2xl bg-teal-400/10 border border-teal-400/20 space-y-3">
          <p className="text-sm text-teal-300 font-semibold">Outlier sheet ready</p>
          <a
            href={result.sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-teal-300 hover:text-teal-200 transition-colors break-all"
          >
            {result.sheetUrl}
          </a>
          {!!result.durationMs && (
            <p className="text-xs text-gray-400">Runtime: {(result.durationMs / 1000).toFixed(1)}s</p>
          )}
          {(result.stdout || result.stderr) && (
            <details className="text-xs text-gray-300">
              <summary className="cursor-pointer text-gray-400 hover:text-gray-200">View execution logs</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-black/40 border border-white/[0.06] p-3 text-[11px] leading-relaxed">
                {[result.stdout || "", result.stderr || ""].filter(Boolean).join("\n")}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
