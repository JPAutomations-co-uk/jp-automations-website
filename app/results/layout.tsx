import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Client Results — Real UK Trades Businesses, Real Numbers",
  description: "Case studies from UK roofers, plumbers, electricians, builders, and landscapers. Invoice automation, AI call handling, compliance systems, job costing. See what changed.",
  alternates: { canonical: "https://www.jpautomations.co.uk/results" },
  openGraph: {
    title: "Client Results | JP Automations",
    description: "Real results from real UK trades businesses. £8,400 to £320 outstanding. +£16,800 in one winter. Admin cut from 8 hours to 30 minutes.",
    url: "https://www.jpautomations.co.uk/results",
    type: "website",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=Client+Results&subtitle=Real+UK+Trades+Businesses%2C+Real+Numbers", width: 1200, height: 630, alt: "JP Automations Client Results" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Results | JP Automations",
    description: "Real results from real UK trades businesses. £8,400 to £320 outstanding. +£16,800 in one winter. Admin cut from 8 hours to 30 minutes.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Client+Results&subtitle=Real+UK+Trades+Businesses%2C+Real+Numbers"],
  },
}

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
