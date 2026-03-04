"use client"

import { useState } from "react"

const ROLES = ["Copywriter", "Developer", "Video Producer", "Marketer", "Founder", "Designer"]

const X_SOURCES = ["@AnthropicAI", "@OpenAI", "@GoogleDeepMind", "@huggingface", "@karpathy", "@sama"]
const RSS_SOURCES = ["Anthropic Blog", "OpenAI Blog", "Google AI Blog", "Hacker News AI"]

type BriefResult = {
  what_dropped: string[]
  relevant: { item: string; why: string; test: string }[]
  test_this_week: string
  safely_ignore: string[]
}

export default function AiNewsFilterApp() {
  const [role, setRole] = useState("")
  const [context, setContext] = useState("")
  const [xSources, setXSources] = useState<string[]>(["@AnthropicAI", "@OpenAI", "@karpathy"])
  const [rssSources, setRssSources] = useState<string[]>(["Anthropic Blog", "OpenAI Blog"])
  const [customSource, setCustomSource] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BriefResult | null>(null)
  const [error, setError] = useState("")

  function toggleSource(source: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(source) ? list.filter((s) => s !== source) : [...list, source])
  }

  function addCustomSource() {
    const trimmed = customSource.trim()
    if (!trimmed) return
    if (!xSources.includes(trimmed) && !rssSources.includes(trimmed)) {
      setXSources((prev) => [...prev, trimmed])
    }
    setCustomSource("")
    setShowCustomInput(false)
  }

  async function generate() {
    if (!role || !context.trim()) return
    setLoading(true)
    setResult(null)
    setError("")
    try {
      const res = await fetch("/api/ai-news-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, context, sources: [...xSources, ...rssSources] }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = await res.json()
      setResult(data)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setResult(null)
    setError("")
  }

  const chipBase = "px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer select-none"
  const chipSelected = "border-teal-400 bg-teal-400/10 text-teal-400"
  const chipUnselected = "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-white"

  const pillBase = "px-4 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer select-none"
  const pillSelected = "border-teal-400 bg-teal-400/10 text-teal-400"
  const pillUnselected = "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-white"

  return (
    <section id="configurator" className="px-6 pb-24 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Build your weekly AI brief</h2>
        <p className="text-gray-400 text-sm">Takes 30 seconds. No account required.</p>
      </div>

      {!result ? (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7 space-y-8">
          {/* Role */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your role</p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`${pillBase} ${role === r ? pillSelected : pillUnselected}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Context */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your daily work and tools</p>
            <textarea
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. I write copy for e-commerce brands, use ChatGPT daily for drafts, edit in Google Docs, and publish via Shopify..."
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-teal-400/40 focus:outline-none w-full resize-none text-sm leading-relaxed"
            />
          </div>

          {/* Sources */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your sources</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-2">X / Twitter</p>
                <div className="flex flex-wrap gap-2">
                  {X_SOURCES.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSource(s, xSources, setXSources)}
                      className={`${chipBase} ${xSources.includes(s) ? chipSelected : chipUnselected}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-2">RSS feeds</p>
                <div className="flex flex-wrap gap-2">
                  {RSS_SOURCES.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSource(s, rssSources, setRssSources)}
                      className={`${chipBase} ${rssSources.includes(s) ? chipSelected : chipUnselected}`}
                    >
                      {s}
                    </button>
                  ))}
                  {showCustomInput ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={customSource}
                        onChange={(e) => setCustomSource(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCustomSource()}
                        placeholder="Add source..."
                        className="bg-white/[0.03] border border-white/[0.08] rounded-full px-3 py-1.5 text-white placeholder-gray-600 focus:border-teal-400/40 focus:outline-none text-xs w-32"
                      />
                      <button onClick={addCustomSource} className={`${chipBase} ${chipSelected}`}>Add</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCustomInput(true)}
                      className={`${chipBase} ${chipUnselected}`}
                    >
                      + custom
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Generate */}
          <button
            onClick={generate}
            disabled={!role || !context.trim() || loading}
            className="w-full py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                Filtering through your work context...
              </span>
            ) : (
              "Generate my brief →"
            )}
          </button>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Output card */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-gray-600">Your AI brief · {role}</span>
              <span className="text-xs text-gray-700">week of {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long" })}</span>
            </div>

            {/* What dropped */}
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">↓ What dropped this week</p>
              <ul className="space-y-1.5">
                {result.what_dropped.map((item, i) => (
                  <li key={i} className="text-sm text-gray-400 flex gap-2">
                    <span className="text-gray-700 shrink-0">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Relevant */}
            {result.relevant.length > 0 && (
              <div className="px-6 py-5 border-b border-white/[0.06]">
                <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-4">★ Relevant to your work</p>
                <div className="space-y-4">
                  {result.relevant.map((r, i) => (
                    <div key={i}>
                      <p className="text-sm font-semibold text-white mb-1">{r.item}</p>
                      <p className="text-sm text-gray-400 leading-relaxed mb-2">{r.why}</p>
                      <p className="text-sm text-teal-400">→ Test: {r.test}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test this week */}
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">→ Test this week</p>
              <p className="text-sm text-white leading-relaxed">{result.test_this_week}</p>
            </div>

            {/* Safely ignore */}
            <div className="px-6 py-5">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">× Safely ignore</p>
              <p className="text-sm text-gray-600">{result.safely_ignore.join(" · ")}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={reset}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← Try different context
            </button>
            <a
              href="/apply"
              className="px-6 py-3 bg-teal-400 text-black text-sm font-semibold rounded-xl hover:bg-teal-300 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]"
            >
              Want this every Sunday →
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
