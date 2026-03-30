"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"

const TITLE_VARIANT_TOKEN_COST = 3

type LogsResult = {
  sheetUrl: string
  durationMs?: number
  stdout?: string
  stderr?: string
}

export default function YouTubeTitleVariantsPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  const [sheetUrl, setSheetUrl] = useState("")
  const [titleLimit, setTitleLimit] = useState(20)
  const [variants, setVariants] = useState(3)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<LogsResult | null>(null)

  const handleRun = useCallback(async () => {
    if (!user) {
      router.push("/login?redirect=/dashboard/social-engine/youtube/title-variants")
      return
    }
    if (!sheetUrl.trim()) {
      setError("Please provide a Google Sheet URL first.")
      return
    }
    if (tokenBalance < TITLE_VARIANT_TOKEN_COST) {
      setError(`Insufficient tokens. You need ${TITLE_VARIANT_TOKEN_COST} tokens but have ${tokenBalance}.`)
      return
    }

    setRunning(true)
    setError("")
    setResult(null)

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
        setError(data.error || "Title variant generation failed.")
        return
      }

      setResult({
        sheetUrl: String(data.sheetUrl || sheetUrl.trim()),
        durationMs: Number(data.durationMs || 0),
        stdout: String(data.stdout || ""),
        stderr: String(data.stderr || ""),
      })
      refreshBalance()
    } catch {
      setError("Something went wrong while generating title variants.")
    } finally {
      setRunning(false)
    }
  }, [user, router, sheetUrl, tokenBalance, titleLimit, variants, refreshBalance])

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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Title Variants</h1>
          <span className="text-xs text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
            {TITLE_VARIANT_TOKEN_COST} tokens
          </span>
        </div>
        <p className="text-gray-500">Generate high-CTR title alternatives from your outlier sheet.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
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
              Generating variants...
            </>
          ) : (
            <>Generate Title Variants ({TITLE_VARIANT_TOKEN_COST} tokens)</>
          )}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-5 rounded-2xl bg-teal-400/10 border border-teal-400/20 space-y-3">
          <p className="text-sm text-teal-300 font-semibold">Variants added to sheet</p>
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
