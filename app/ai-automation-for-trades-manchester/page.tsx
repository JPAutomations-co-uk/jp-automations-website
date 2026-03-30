import type { Metadata } from "next"
import ManchesterClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Trades in Manchester",
  description:
    "AI systems for Manchester tradespeople. Automated invoicing, AI call handling, compliance automation. From the electrician who cut admin to 30 minutes a week.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-trades-manchester",
  },
}

export default function Page() {
  return <ManchesterClient />
}
