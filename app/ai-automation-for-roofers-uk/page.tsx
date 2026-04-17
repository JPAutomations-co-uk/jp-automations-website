import type { Metadata } from "next"
import TradePageClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Roofers UK | JP Automations",
  description:
    "Invoice automation, AI call handling, and lead gen for UK roofers. One crew cut payment time from 34 days to 6. Built bespoke, live in 14 days, 90-day ROI guarantee.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-roofers-uk",
  },
  openGraph: {
    title: "AI Automation for Roofers UK | JP Automations",
    description:
      "Invoice automation, AI call handling, and lead gen for UK roofers. One crew cut payment time from 34 days to 6. 90-day ROI guarantee.",
    url: "https://www.jpautomations.co.uk/ai-automation-for-roofers-uk",
    type: "website",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Roofers+UK&subtitle=JP+Automations", width: 1200, height: 630, alt: "AI Automation for UK Roofers — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Roofers UK | JP Automations",
    description: "Invoice automation, AI call handling, and lead gen for UK roofers. One crew cut payment time from 34 days to 6.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Roofers+UK&subtitle=JP+Automations"],
  },
}

export default function Page() {
  return <TradePageClient />
}
