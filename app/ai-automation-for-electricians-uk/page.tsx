import type { Metadata } from "next"
import TradePageClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Electricians UK | JP Automations",
  description:
    "Compliance automation, cert generation, lead gen, and websites for UK electricians. One NICEIC contractor cut admin from 8 hours to 30 minutes per week. 90-day ROI guarantee.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-electricians-uk",
  },
  openGraph: {
    title: "AI Automation for Electricians UK | JP Automations",
    description:
      "Compliance automation, cert generation, and lead gen for UK electricians. One contractor cut admin from 8 hours to 30 minutes. 90-day ROI guarantee.",
    url: "https://www.jpautomations.co.uk/ai-automation-for-electricians-uk",
    type: "website",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Electricians+UK&subtitle=JP+Automations", width: 1200, height: 630, alt: "AI Automation for UK Electricians — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Electricians UK | JP Automations",
    description: "Compliance automation and lead gen for UK electricians. One contractor cut admin from 8 hours to 30 minutes. 90-day ROI guarantee.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Electricians+UK&subtitle=JP+Automations"],
  },
}

export default function Page() {
  return <TradePageClient />
}
