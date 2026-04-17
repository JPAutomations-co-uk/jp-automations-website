import type { Metadata } from "next"
import LondonClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Trades in London | JP Automations",
  description:
    "AI automation for London tradespeople. Invoice automation, AI call handling, CRM systems, and lead gen. Built bespoke for your trade. 90-day ROI guarantee.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-trades-london",
  },
  openGraph: {
    title: "AI Automation for Trades in London | JP Automations",
    description:
      "AI automation for London tradespeople. Invoice automation, AI call handling, CRM systems. Built bespoke for your trade. 90-day ROI guarantee.",
    url: "https://www.jpautomations.co.uk/ai-automation-for-trades-london",
    type: "website",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Trades+in+London&subtitle=JP+Automations", width: 1200, height: 630, alt: "AI Automation for London Trades — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Trades in London | JP Automations",
    description: "AI automation for London tradespeople. Invoice automation, AI call handling, CRM systems. 90-day ROI guarantee.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Trades+in+London&subtitle=JP+Automations"],
  },
}

export default function Page() {
  return <LondonClient />
}
