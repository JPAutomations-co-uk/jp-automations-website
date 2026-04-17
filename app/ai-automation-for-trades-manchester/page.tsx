import type { Metadata } from "next"
import ManchesterClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Trades in Manchester | JP Automations",
  description:
    "AI automation for Manchester tradespeople. Invoice automation, AI call handling, compliance systems. One Manchester electrician cut admin from 8 hours to 30 minutes a week.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-trades-manchester",
  },
  openGraph: {
    title: "AI Automation for Trades in Manchester | JP Automations",
    description:
      "AI automation for Manchester tradespeople. One electrician cut admin from 8 hours to 30 minutes a week. Built bespoke. 90-day ROI guarantee.",
    url: "https://www.jpautomations.co.uk/ai-automation-for-trades-manchester",
    type: "website",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Trades+in+Manchester&subtitle=JP+Automations", width: 1200, height: 630, alt: "AI Automation for Manchester Trades — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Trades in Manchester | JP Automations",
    description: "AI automation for Manchester tradespeople. One electrician cut admin from 8 hours to 30 minutes a week. 90-day ROI guarantee.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Trades+in+Manchester&subtitle=JP+Automations"],
  },
}

export default function Page() {
  return <ManchesterClient />
}
