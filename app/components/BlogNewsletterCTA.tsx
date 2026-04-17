"use client"

import { useState } from "react"

export default function BlogNewsletterCTA() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog-inline" }),
      })
      if (res.ok) {
        setStatus("success")
        setEmail("")
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "newsletter_subscribe", { method: "blog_inline" })
        }
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="bg-black border-t border-white/5 py-12">
    <div className="max-w-4xl mx-auto px-6">
    <div className="border border-white/10 rounded-2xl p-8 bg-white/[0.02]">
      <p className="text-xs tracking-[.2em] uppercase text-teal-400 mb-3">Weekly newsletter</p>
      <h3 className="text-2xl font-bold mb-2">
        One automation insight, every week.
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">
        Real examples. No fluff. Written for service businesses doing £250k+/year who want to stop being the bottleneck.
      </p>

      {status === "success" ? (
        <p className="text-teal-400 text-sm">You&apos;re in. Check your inbox for the first email.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-teal-400 text-black text-sm font-semibold rounded-xl hover:bg-teal-300 transition disabled:opacity-60 whitespace-nowrap"
          >
            {status === "loading" ? "Subscribing..." : "Get the newsletter"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-red-400 text-xs mt-2">Something went wrong. Try again.</p>
      )}
    </div>
    </div>
    </div>
  )
}
