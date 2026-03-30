"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/components/AuthProvider"

interface VoiceExample {
  id: string
  post_text: string
  performance_label: string
  source: string
  created_at: string
}

export default function XResearchPage() {
  const { user } = useAuth()
  const [examples, setExamples] = useState<VoiceExample[]>([])
  const [loading, setLoading] = useState(true)
  const [newPostText, setNewPostText] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [addingExample, setAddingExample] = useState(false)

  useEffect(() => {
    if (!user) return
    fetch("/api/x-profile/voice-examples")
      .then((r) => r.json())
      .then((data) => {
        setExamples(data.examples || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  const handleAddExample = async () => {
    if (!newPostText.trim()) return
    setAddingExample(true)
    try {
      const res = await fetch("/api/x-profile/voice-examples", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_text: newPostText.trim(),
          performance_label: newLabel.trim() || null,
          source: "manual",
        }),
      })
      const data = await res.json()
      if (res.ok && data.example) {
        setExamples([data.example, ...examples])
        setNewPostText("")
        setNewLabel("")
      }
    } catch {
      // silent fail
    }
    setAddingExample(false)
  }

  if (!user || loading) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <a
            href="/dashboard/social-engine/x"
            className="text-gray-500 hover:text-teal-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Research</h1>
        </div>
        <p className="text-gray-500">Analyze your niche, competitors, and your own top content.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* Own Posts Analysis */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-1">Own Posts Analysis</h3>
          <p className="text-sm text-gray-500 mb-4">
            Scrape and analyze your own X posts to find what works.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <span className="text-xs text-gray-500">Coming soon</span>
          </div>
        </div>

        {/* Niche Top Posts */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-1">Niche Top Posts</h3>
          <p className="text-sm text-gray-500 mb-4">
            Find the highest-performing posts in your niche.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <span className="text-xs text-gray-500">Coming soon</span>
          </div>
        </div>

        {/* Competitor Analysis */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.479m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-1">Competitor Research</h3>
          <p className="text-sm text-gray-500 mb-4">
            Study competitor accounts and extract winning patterns.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <span className="text-xs text-gray-500">Coming soon</span>
          </div>
        </div>
      </div>

      {/* Voice Examples — quick add */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Add Voice Examples</h2>
        <p className="text-sm text-gray-500 mb-6">
          Paste your best-performing tweets here. The AI will use these to learn your style.
        </p>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-6">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            rows={3}
            placeholder="Paste one of your best tweets here..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none text-sm mb-3"
          />
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Why did this work? (e.g. went viral, most replies)"
              className="flex-1 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 text-sm"
            />
            <button
              onClick={handleAddExample}
              disabled={!newPostText.trim() || addingExample}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-50 shrink-0"
            >
              {addingExample ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {examples.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-3">{examples.length} voice example{examples.length !== 1 ? "s" : ""} saved</p>
            <div className="space-y-2">
              {examples.slice(0, 5).map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-start gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3"
                >
                  <p className="text-sm text-gray-400 flex-1 line-clamp-2">{ex.post_text}</p>
                  {ex.performance_label && (
                    <span className="text-[10px] font-medium text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full shrink-0">
                      {ex.performance_label}
                    </span>
                  )}
                </div>
              ))}
              {examples.length > 5 && (
                <a
                  href="/dashboard/social-engine/x/profile"
                  className="block text-center text-xs text-gray-500 hover:text-teal-400 transition-colors py-2"
                >
                  View all {examples.length} examples →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
