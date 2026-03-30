import type { Metadata } from "next"
import TradePageClient from "./client"

export const metadata: Metadata = {
  title: "AI Systems, Websites & Lead Gen for Builders UK",
  description:
    "Job costing, CIS automation, websites, Google & Meta ads, and SEO for UK builders and contractors. One client's margins went from 8% to 16%.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-builders-uk",
  },
}

export default function Page() {
  return <TradePageClient />
}
