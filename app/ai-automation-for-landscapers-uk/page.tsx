import type { Metadata } from "next"
import LandscapersClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Landscapers UK | JP Automations",
  description:
    "Maintenance plan automation, lead gen, and websites for UK landscapers. One Surrey landscaper built £3,995/month in recurring revenue and broke the feast-or-famine cycle. 90-day ROI guarantee.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-landscapers-uk",
  },
  openGraph: {
    title: "AI Automation for Landscapers UK | JP Automations",
    description:
      "Maintenance plan automation and lead gen for UK landscapers. One client built £3,995/month in recurring revenue. Broke the feast-or-famine cycle for good. 90-day ROI guarantee.",
    url: "https://www.jpautomations.co.uk/ai-automation-for-landscapers-uk",
    type: "website",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Landscapers+UK&subtitle=JP+Automations", width: 1200, height: 630, alt: "AI Automation for UK Landscapers — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Landscapers UK | JP Automations",
    description: "Maintenance plan automation and lead gen for UK landscapers. One client built £3,995/month in recurring revenue. 90-day ROI guarantee.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Landscapers+UK&subtitle=JP+Automations"],
  },
}

export default function LandscapersPage() {
  return <LandscapersClient />
}
