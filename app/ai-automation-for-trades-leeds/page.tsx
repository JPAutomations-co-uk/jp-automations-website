import type { Metadata } from "next"

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "JP Automations — AI Automation for Leeds Trades",
  description: "AI automation systems for Leeds tradespeople. Invoice automation, AI call handling, compliance, and lead generation built bespoke for UK trades.",
  url: "https://www.jpautomations.co.uk/ai-automation-for-trades-leeds",
  logo: "https://www.jpautomations.co.uk/logo.png",
  email: "jp@jpautomations.com",
  areaServed: [
    { "@type": "City", name: "Leeds" },
    { "@type": "AdministrativeArea", name: "West Yorkshire" },
  ],
  serviceType: ["AI Automation for Tradespeople", "Invoice Automation", "AI Call Handling", "Compliance Automation"],
  priceRange: "££",
  sameAs: ["https://www.instagram.com/jpautomations/", "https://youtube.com/@jpautomations", "https://www.linkedin.com/in/james-harvey-0583b2370/"],
}

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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <LeedsClient />
    </>
  )
}
