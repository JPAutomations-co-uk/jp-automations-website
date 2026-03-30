import type { Metadata } from "next"
import LondonClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Trades in London",
  description:
    "AI automation for London tradespeople and service businesses. Invoice automation, call handling, CRM systems. 90-day ROI guarantee.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-trades-london",
  },
}

export default function Page() {
  return <LondonClient />
}
