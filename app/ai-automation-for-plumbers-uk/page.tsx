import type { Metadata } from "next"
import TradePageClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Plumbers UK | JP Automations",
  description:
    "AI call handling so you never miss a job, plus websites, lead gen, and service contract automation for UK plumbers. One engineer added £16,800 in one winter.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-plumbers-uk",
  },
  openGraph: {
    title: "AI Automation for Plumbers UK | JP Automations",
    description:
      "AI call handling so you never miss a job. One heating engineer added £16,800 in one winter. Built bespoke for UK plumbers. 90-day ROI guarantee.",
    url: "https://www.jpautomations.co.uk/ai-automation-for-plumbers-uk",
    type: "website",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Plumbers+UK&subtitle=JP+Automations", width: 1200, height: 630, alt: "AI Automation for UK Plumbers — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Plumbers UK | JP Automations",
    description: "AI call handling so you never miss a job. One heating engineer added £16,800 in one winter. 90-day ROI guarantee.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Plumbers+UK&subtitle=JP+Automations"],
  },
}

export default function Page() {
  return <TradePageClient />
}
