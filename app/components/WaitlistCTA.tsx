"use client"

import { useState } from "react"

export default function WaitlistCTA({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === "loading") return

    setStatus("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error("Failed")
      setStatus("success")
      if (typeof window !== "undefined") {
        window.gtag?.("event", "waitlist_signup")
        window.fbq?.("track", "Lead")
      }
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-teal-400 font-semibold text-lg">You&apos;re on the list.</p>
        <p className="text-gray-500 text-sm mt-1">We&apos;ll let you know when early access opens.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 max-w-lg mx-auto ${className}`}>
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 px-5 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {status === "loading" ? "Joining..." : "Join the Waitlist"}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-xs text-center sm:text-left">Something went wrong — try again.</p>
      )}
    </form>
  )
}
