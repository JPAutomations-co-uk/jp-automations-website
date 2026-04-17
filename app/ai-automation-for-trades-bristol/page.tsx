import type { Metadata } from "next"
import BristolClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Trades in Bristol | JP Automations",
  description:
    "AI automation for Bristol tradespeople. Live job costing, CIS automation, invoice systems, and lead gen. One Bristol builder's margins went from 8% to 16%. 90-day ROI guarantee.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-trades-bristol",
  },
  openGraph: {
    title: "AI Automation for Trades in Bristol | JP Automations",
    description:
      "AI automation for Bristol tradespeople. One builder's margins went from 8% to 16% with live job costing. Built bespoke. 90-day ROI guarantee.",
    url: "https://www.jpautomations.co.uk/ai-automation-for-trades-bristol",
    type: "website",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Trades+in+Bristol&subtitle=JP+Automations", width: 1200, height: 630, alt: "AI Automation for Bristol Trades — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Trades in Bristol | JP Automations",
    description: "AI automation for Bristol tradespeople. One builder's margins went from 8% to 16% with live job costing. 90-day ROI guarantee.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Trades+in+Bristol&subtitle=JP+Automations"],
  },
}

export default function Page() {
  return <BristolClient />
}
