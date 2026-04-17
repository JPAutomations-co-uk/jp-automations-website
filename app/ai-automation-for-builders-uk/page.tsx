import type { Metadata } from "next"
import TradePageClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Builders UK | JP Automations",
  description:
    "Live job costing, CIS automation, and lead gen for UK builders and contractors. One Bristol contractor went from 8% to 16% average margin. 90-day ROI guarantee.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-builders-uk",
  },
  openGraph: {
    title: "AI Automation for Builders UK | JP Automations",
    description:
      "Live job costing, CIS automation, and lead gen for UK builders. One contractor went from 8% to 16% average margin. 90-day ROI guarantee.",
    url: "https://www.jpautomations.co.uk/ai-automation-for-builders-uk",
    type: "website",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Builders+UK&subtitle=JP+Automations", width: 1200, height: 630, alt: "AI Automation for UK Builders — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Builders UK | JP Automations",
    description: "Live job costing, CIS automation, and lead gen for UK builders. One contractor went from 8% to 16% average margin.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Builders+UK&subtitle=JP+Automations"],
  },
}

export default function Page() {
  return <TradePageClient />
}
