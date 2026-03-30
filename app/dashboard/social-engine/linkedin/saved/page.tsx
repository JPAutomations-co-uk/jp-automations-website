"use client"

import { useState, useEffect } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface SavedItem {
  id: string
  content_type: string
  feedback_text: string | null
  content_snapshot: Record<string, unknown> | null
  created_at: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  linkedin_post: "Post",
  linkedin_plan: "Post (from plan)",
  linkedin_image_prompt: "Image Prompt",
  x_post: "X Post",
  instagram_post: "Instagram Post",
}

const TYPE_COLOURS: Record<string, string> = {
  linkedin_post: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  linkedin_plan: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  linkedin_image_prompt: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  x_post: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  instagram_post: "bg-pink-400/10 text-pink-400 border-pink-400/20",
}

function extractText(item: SavedItem): string | null {
  const snap = item.content_snapshot
  if (!snap) return null
  if (typeof snap.full_post === "string") return snap.full_post
  if (typeof snap.prompt === "string") return snap.prompt
  return null
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

// ─── Nav tabs (shared across all LinkedIn engine pages) ───────────────────────

const TAB_NAV = (
  <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6">
    <a href="/dashboard/social-engine/linkedin/write" className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Write</a>
    <a href="/dashboard/social-engine/linkedin/planner" className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Plan</a>
    <a href="/dashboard/social-engine/linkedin/images" className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Images</a>
    <span className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">Saved</span>
  </div>
)

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LinkedInSavedPage() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/feedback")
        if (res.ok) {
          const data = await res.json()
          setItems(data.items ?? [])
        }
      } catch { /* ignore */ }
      setLoading(false)
    }
    load()
  }, [])

  const handleCopy = async (item: SavedItem) => {
    const text = extractText(item)
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch { /* ignore */ }
  }

  const contentTypes = ["all", ...Array.from(new Set(items.map((i) => i.content_type)))]
  const filtered = filter === "all" ? items : items.filter((i) => i.content_type === filter)

  const posts = filtered.filter((i) => i.content_type === "linkedin_post" || i.content_type === "linkedin_plan")
  const imagePrompts = filtered.filter((i) => i.content_type === "linkedin_image_prompt")
  const other = filtered.filter((i) => !["linkedin_post", "linkedin_plan", "linkedin_image_prompt"].includes(i.content_type))

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-300">LinkedIn Content Engine</span>
        </div>
        {TAB_NAV}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Saved Outputs</h1>
        <p className="text-gray-500">Everything you&apos;ve given a thumbs up — your best posts and image prompts.</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading saved items...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </div>
          <p className="text-white font-semibold">No saved outputs yet</p>
          <p className="text-sm text-gray-500">Give a post or image prompt a thumbs up and it&apos;ll appear here.</p>
          <div className="flex gap-3 justify-center pt-2">
            <a href="/dashboard/social-engine/linkedin/write" className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all">
              Write a post
            </a>
            <a href="/dashboard/social-engine/linkedin/images" className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white transition-all">
              Get image prompt
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Filter chips */}
          {contentTypes.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    filter === t
                      ? "border-teal-400 bg-teal-400/10 text-teal-400"
                      : "border-white/[0.08] bg-white/[0.02] text-gray-500 hover:text-gray-300 hover:border-white/20"
                  }`}
                >
                  {t === "all" ? `All (${items.length})` : `${TYPE_LABELS[t] || t} (${items.filter((i) => i.content_type === t).length})`}
                </button>
              ))}
            </div>
          )}

          {/* Posts */}
          {posts.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Posts</h2>
              {posts.map((item) => {
                const text = extractText(item)
                const isExpanded = expandedId === item.id
                return (
                  <div key={item.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all">
                    <div className="p-5 flex items-start gap-4">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="flex-1 text-left min-w-0"
                      >
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TYPE_COLOURS[item.content_type] || "bg-gray-400/10 text-gray-400 border-gray-400/20"}`}>
                            {TYPE_LABELS[item.content_type] || item.content_type}
                          </span>
                          <span className="text-[10px] text-gray-600">{formatDate(item.created_at)}</span>
                        </div>
                        <p className={`text-sm text-gray-300 leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}>
                          {text ?? "No content"}
                        </p>
                        {!isExpanded && text && text.length > 120 && (
                          <p className="text-xs text-teal-400/70 mt-1">Show more ↓</p>
                        )}
                      </button>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopy(item)}
                          disabled={!text}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all disabled:opacity-40"
                        >
                          {copiedId === item.id ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                    {isExpanded && text && (
                      <div className="border-t border-white/[0.06] p-5">
                        <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4">
                          <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-[family-name:var(--font-geist-sans)]">
                            {text}
                          </pre>
                        </div>
                        {typeof item.content_snapshot?.writing_score === "number" && (
                          <p className="text-xs text-teal-400 mt-2 font-bold">Score: {item.content_snapshot.writing_score}</p>
                        )}
                        {/* Image prompt link */}
                        <div className="mt-3">
                          <a
                            href={`/dashboard/social-engine/linkedin/images?content=${encodeURIComponent(text)}&back=saved`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-teal-400 hover:border-teal-400/30 transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Get Image Prompt
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </section>
          )}

          {/* Image Prompts */}
          {imagePrompts.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Image Prompts</h2>
              {imagePrompts.map((item) => {
                const text = extractText(item)
                const isExpanded = expandedId === item.id
                const style = item.content_snapshot?.style as string | undefined
                return (
                  <div key={item.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all">
                    <div className="p-5 flex items-start gap-4">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="flex-1 text-left min-w-0"
                      >
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TYPE_COLOURS[item.content_type]}`}>
                            Image Prompt
                          </span>
                          {style && (
                            <span className="text-[10px] font-medium text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full capitalize">
                              {style.replace(/_/g, " ")}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-600">{formatDate(item.created_at)}</span>
                        </div>
                        <p className={`text-sm text-gray-400 leading-relaxed font-mono ${!isExpanded ? "line-clamp-2 text-xs" : "text-xs"}`}>
                          {text ?? "No content"}
                        </p>
                        {!isExpanded && (
                          <p className="text-xs text-teal-400/70 mt-1">Show full prompt ↓</p>
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(item)}
                        disabled={!text}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all shrink-0 disabled:opacity-40"
                      >
                        {copiedId === item.id ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    {isExpanded && text && (
                      <div className="border-t border-white/[0.06] p-5">
                        <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4 max-h-[400px] overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-xs text-gray-300 leading-relaxed font-mono">
                            {text}
                          </pre>
                        </div>
                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={() => handleCopy(item)}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-400 text-black hover:bg-teal-300 transition-all"
                          >
                            {copiedId === item.id ? "Copied!" : "Copy Prompt"}
                          </button>
                          <a
                            href="https://gemini.google.com/app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white transition-all"
                          >
                            Open Gemini →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </section>
          )}

          {/* Other types */}
          {other.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Other</h2>
              {other.map((item) => {
                const text = extractText(item)
                return (
                  <div key={item.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex items-start gap-4 hover:border-white/10 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-gray-400/10 text-gray-400 border-gray-400/20">
                          {TYPE_LABELS[item.content_type] || item.content_type}
                        </span>
                        <span className="text-[10px] text-gray-600">{formatDate(item.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{text ?? "No content"}</p>
                    </div>
                    {text && (
                      <button
                        onClick={() => handleCopy(item)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all shrink-0"
                      >
                        {copiedId === item.id ? "Copied!" : "Copy"}
                      </button>
                    )}
                  </div>
                )
              })}
            </section>
          )}
        </div>
      )}
    </div>
  )
}
