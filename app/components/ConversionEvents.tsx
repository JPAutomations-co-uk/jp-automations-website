"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export default function ConversionEvents() {
  useEffect(() => {
    // GA4 — generate_lead conversion event
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", {
        event_category: "Apply Form",
        event_label: "Application Submitted",
      })
    }
    // Meta Pixel — Lead conversion event
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead")
    }
  }, [])

  return null
}
