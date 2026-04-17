import type { Metadata } from "next"
import LeedsClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Trades in Leeds | JP Automations",
  description:
    "AI automation for Leeds tradespeople. One Leeds heating engineer recovered £16,800 in a single winter with AI call handling. Built bespoke. 90-day ROI guarantee.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-trades-leeds",
  },
  openGraph: {
    title: "AI Automation for Trades in Leeds | JP Automations",
    description:
      "AI automation for Leeds tradespeople. One heating engineer recovered £16,800 in a single winter with AI call handling. 90-day ROI guarantee.",
    url: "https://www.jpautomations.co.uk/ai-automation-for-trades-leeds",
    type: "website",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Trades+in+Leeds&subtitle=JP+Automations", width: 1200, height: 630, alt: "AI Automation for Leeds Trades — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Trades in Leeds | JP Automations",
    description: "AI automation for Leeds tradespeople. One heating engineer recovered £16,800 in a single winter with AI call handling. 90-day ROI guarantee.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Trades+in+Leeds&subtitle=JP+Automations"],
  },
}

export default function Page() {
  return <LeedsClient />
}
