import type { Metadata } from "next"
import LeedsClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Trades in Leeds",
  description:
    "AI systems for Leeds tradespeople. One heating engineer recovered £16,800 in a single winter with our AI call handling system.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-trades-leeds",
  },
}

export default function Page() {
  return <LeedsClient />
}
