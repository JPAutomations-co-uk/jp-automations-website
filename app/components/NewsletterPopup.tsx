"use client"

import { useState, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"

const SUPPRESSED_PREFIXES = [
  "/free-",
  "/apply",
  "/book-call",
  "/pricing",
  "/login",
  "/signup",
  "/dashboard",
  "/onboarding",
]

const LS_SUBSCRIBED = "newsletter_subscribed"
const LS_DISMISSED = "newsletter_dismissed"
const DISMISS_DAYS = 30
const DELAY_MS = 10_000
const SCROLL_THRESHOLD = 0.5

export default function NewsletterPopup() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [animatingOut, setAnimatingOut] = useState(false)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  // Check if popup should be suppressed
  const isSuppressed = useCallback(() => {
    if (SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p))) return true
    try {
      if (localStorage.getItem(LS_SUBSCRIBED) === "true") return true
      const dismissed = localStorage.getItem(LS_DISMISSED)
      if (dismissed) {
        const diff = Date.now() - new Date(dismissed).getTime()
        if (diff < DISMISS_DAYS * 24 * 60 * 60 * 1000) return true
      }
    } catch {}
    return false
  }, [pathname])

  // Trigger logic: scroll 50% + 10s delay
  useEffect(() => {
    if (isSuppressed()) return

    let timerReady = false
    let scrollReady = false
    let triggered = false

    const maybeShow = () => {
      if (triggered) return
      if (timerReady && scrollReady) {
        triggered = true
        setVisible(true)
      }
    }

    const timer = setTimeout(() => {
      timerReady = true
      maybeShow()
    }, DELAY_MS)

    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      if (window.scrollY / scrollable >= SCROLL_THRESHOLD) {
        scrollReady = true
        maybeShow()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // check initial position

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isSuppressed])

  // Escape key
  useEffect(() => {
    if (!visible || animatingOut) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [visible, animatingOut])

  // Body scroll lock
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [visible])

  const handleDismiss = useCallback(() => {
    if (animatingOut) return
    setAnimatingOut(true)
    try { localStorage.setItem(LS_DISMISSED, new Date().toISOString()) } catch {}
    setTimeout(() => setVisible(false), 250)
  }, [animatingOut])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === "loading") return

    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "popup" }),
      })

      if (!res.ok) throw new Error("Failed")

      setStatus("success")
      try { localStorage.setItem(LS_SUBSCRIBED, "true") } catch {}

      // Analytics
      if (typeof window !== "undefined") {
        window.gtag?.("event", "newsletter_subscribe")
        window.fbq?.("track", "Lead")
      }

      setTimeout(() => {
        setAnimatingOut(true)
        setTimeout(() => setVisible(false), 250)
      }, 2500)
    } catch {
      setStatus("error")
    }
  }

  if (!visible) return null

  return (
    <>
      <style jsx>{`
        @keyframes popup-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popup-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(16px) scale(0.97); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[60] flex items-center justify-center px-4"
        role="dialog"
        aria-modal="true"
        aria-label="Newsletter signup"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          style={{
            animation: animatingOut ? "fade-out 250ms ease-out forwards" : "fade-in 250ms ease-out forwards",
          }}
          onClick={handleDismiss}
        />

        {/* Panel */}
        <div
          className="relative bg-[#0B0F14] border border-white/[0.1] rounded-2xl p-8 max-w-md w-full shadow-2xl"
          style={{
            animation: animatingOut
              ? "popup-out 250ms ease-out forwards"
              : "popup-in 300ms ease-out forwards",
          }}
        >
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.06),transparent_70%)] rounded-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="relative">
            {status === "success" ? (
              <div className="text-center py-6">
                <p className="text-2xl font-bold text-white mb-2">You're in.</p>
                <p className="text-gray-400 text-sm">Check your inbox for a welcome email.</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold tracking-[0.15em] text-teal-400 uppercase mb-3">
                  The AI Edge
                </p>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Get Smarter About AI Automation
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Weekly tips, tools, and insights to help you run your business on autopilot. No fluff. Just stuff that works.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-5 py-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-teal-400/50 transition"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                  >
                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>

                {status === "error" && (
                  <p className="text-red-400 text-xs mt-3 text-center">
                    Something went wrong — try again.
                  </p>
                )}

                <p className="text-gray-600 text-xs text-center mt-4">
                  No spam. Unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
