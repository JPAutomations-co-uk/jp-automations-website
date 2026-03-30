"use client"

import { useState } from "react"

type FeedbackState = "idle" | "positive_done" | "awaiting_text" | "submitting" | "negative_done"

interface FeedbackButtonsProps {
  contentType: "linkedin_post" | "linkedin_plan" | "linkedin_image_prompt" | "x_post" | "x_plan" | "x_article" | "instagram_post" | "instagram_carousel" | "instagram_reel" | "youtube_script"
  contentSnapshot: Record<string, unknown>
  onRegenerate?: (note: string) => void
}

export default function FeedbackButtons({ contentType, contentSnapshot, onRegenerate }: FeedbackButtonsProps) {
  const [state, setState] = useState<FeedbackState>("idle")
  const [feedbackText, setFeedbackText] = useState("")

  const submitFeedback = async (positive: boolean, text?: string) => {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: contentType,
          positive,
          feedback_text: text || null,
          content_snapshot: contentSnapshot,
        }),
      })
    } catch {
      // Non-critical — don't block the UI
    }
  }

  const handleThumbsUp = async () => {
    setState("positive_done")
    await submitFeedback(true)
  }

  const handleThumbsDown = () => {
    setState("awaiting_text")
  }

  const handleSubmitNegative = async () => {
    if (!feedbackText.trim()) return
    setState("submitting")
    const note = feedbackText.trim()
    await submitFeedback(false, note)
    setState("negative_done")
    onRegenerate?.(note)
  }

  if (state === "positive_done") {
    return (
      <div className="flex items-center gap-2 text-xs text-teal-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Thanks!
      </div>
    )
  }

  if (state === "negative_done") {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {onRegenerate ? "Got it — regenerating with your note..." : "Got it, we'll improve"}
      </div>
    )
  }

  if (state === "awaiting_text" || state === "submitting") {
    return (
      <div className="flex flex-col gap-2 mt-2">
        <p className="text-xs text-gray-500">What should be different?</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmitNegative() }}
            placeholder="e.g. Too salesy, wrong tone, needs more storytelling..."
            className="flex-1 px-3 py-2 text-xs bg-white/[0.04] border border-white/[0.10] rounded-lg text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-teal-400/40"
            autoFocus
            disabled={state === "submitting"}
          />
          <button
            onClick={handleSubmitNegative}
            disabled={state === "submitting" || !feedbackText.trim()}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state === "submitting" ? "..." : "Send"}
          </button>
          <button
            onClick={() => setState("idle")}
            className="px-2 py-2 text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // idle state
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleThumbsUp}
        className="p-1.5 rounded-lg text-gray-600 hover:text-teal-400 hover:bg-teal-400/10 transition-all"
        title="Good output"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      </button>
      <button
        onClick={handleThumbsDown}
        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
        title="Needs improvement"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a3.5 3.5 0 003.5 3.5h.792c.458 0 .83-.371.83-.83a4.07 4.07 0 01.685-2.258L17 13V4m-7 10h2m5-6h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
        </svg>
      </button>
    </div>
  )
}
