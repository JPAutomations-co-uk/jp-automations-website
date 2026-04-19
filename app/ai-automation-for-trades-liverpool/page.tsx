import type { Metadata } from "next"

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "JP Automations — AI Automation for Liverpool Trades",
  description: "AI automation systems for Liverpool tradespeople. Invoice automation, AI call handling, compliance, and lead generation built bespoke for UK trades.",
  url: "https://www.jpautomations.co.uk/ai-automation-for-trades-liverpool",
  logo: "https://www.jpautomations.co.uk/logo.png",
  email: "jp@jpautomations.com",
  areaServed: [
    { "@type": "City", name: "Liverpool" },
    { "@type": "AdministrativeArea", name: "Merseyside" },
  ],
  serviceType: ["AI Automation for Tradespeople", "Invoice Automation", "AI Call Handling", "Compliance Automation"],
  priceRange: "££",
  sameAs: ["https://www.instagram.com/jpautomations/", "https://youtube.com/@jpautomations", "https://www.linkedin.com/in/james-harvey-0583b2370/"],
}

import LiverpoolClient from "./client"

export const metadata: Metadata = {
  title: "AI Automation for Trades in Liverpool | JP Automations",
  description:
    "AI automation for Liverpool tradespeople. Invoice automation, AI call handling, lead gen, and compliance systems. Built bespoke for your trade. 90-day ROI guarantee.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-trades-liverpool",
  },
  openGraph: {
    title: "AI Automation for Trades in Liverpool | JP Automations",
    description:
      "AI automation for Liverpool tradespeople. Invoice automation, AI call handling, lead gen. Built bespoke for your trade. 90-day ROI guarantee.",
    url: "https://www.jpautomations.co.uk/ai-automation-for-trades-liverpool",
    type: "website",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Trades+in+Liverpool&subtitle=JP+Automations", width: 1200, height: 630, alt: "AI Automation for Liverpool Trades — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Trades in Liverpool | JP Automations",
    description: "AI automation for Liverpool tradespeople. Invoice automation, AI call handling, lead gen. 90-day ROI guarantee.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Trades+in+Liverpool&subtitle=JP+Automations"],
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <LiverpoolClient />
    </>
  )
}
