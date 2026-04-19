import type { Metadata } from "next"

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "JP Automations — AI Automation for Manchester Trades",
  description: "AI automation systems for Manchester tradespeople. Invoice automation, AI call handling, compliance, and lead generation built bespoke for UK trades.",
  url: "https://www.jpautomations.co.uk/ai-automation-for-trades-manchester",
  logo: "https://www.jpautomations.co.uk/logo.png",
  email: "jp@jpautomations.com",
  areaServed: [
    { "@type": "City", name: "Manchester" },
    { "@type": "AdministrativeArea", name: "Greater Manchester" },
  ],
  serviceType: ["AI Automation for Tradespeople", "Invoice Automation", "AI Call Handling", "Compliance Automation"],
  priceRange: "££",
  sameAs: ["https://www.instagram.com/jpautomations/", "https://youtube.com/@jpautomations", "https://www.linkedin.com/in/james-harvey-0583b2370/"],
}

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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <ManchesterClient />
    </>
  )
}
