import type { Metadata } from "next"
import BirminghamClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Trades in Birmingham",
  description:
    "AI automation systems for roofers, plumbers, electricians, builders, and landscapers in Birmingham. Invoice automation, call handling, and lead management.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-trades-birmingham",
  },
}

export default function Page() {
  return <BirminghamClient />
}
