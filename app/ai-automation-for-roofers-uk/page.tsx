import type { Metadata } from "next"
import TradePageClient from "./client"

export const metadata: Metadata = {
  title: "AI Systems, Websites & Lead Gen for Roofers UK",
  description:
    "Websites that convert, Google ads that bring in jobs, SEO that compounds, and AI systems that handle your admin. Built for UK roofing contractors doing £250k+.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-roofers-uk",
  },
}

export default function Page() {
  return <TradePageClient />
}
