import type { Metadata } from "next"
import BirminghamClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Trades in Birmingham | JP Automations",
  description:
    "AI automation for Birmingham roofers, plumbers, electricians, builders, and landscapers. Invoice automation, AI call handling, and lead management. 90-day ROI guarantee.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-trades-birmingham",
  },
  openGraph: {
    title: "AI Automation for Trades in Birmingham | JP Automations",
    description:
      "AI automation for Birmingham tradespeople. Invoice automation, AI call handling, lead management. Built bespoke for your trade. 90-day ROI guarantee.",
    url: "https://www.jpautomations.co.uk/ai-automation-for-trades-birmingham",
    type: "website",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Trades+in+Birmingham&subtitle=JP+Automations", width: 1200, height: 630, alt: "AI Automation for Birmingham Trades — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Trades in Birmingham | JP Automations",
    description: "AI automation for Birmingham tradespeople. Invoice automation, AI call handling, lead management. 90-day ROI guarantee.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Trades+in+Birmingham&subtitle=JP+Automations"],
  },
}

export default function Page() {
  return <BirminghamClient />
}
