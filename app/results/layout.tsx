import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Client Results — Real UK Trades Businesses, Real Numbers",
  description: "Case studies from UK roofers, plumbers, electricians, builders, and landscapers. Invoice automation, AI call handling, compliance systems, job costing. See what changed.",
  alternates: { canonical: "https://www.jpautomations.co.uk/results" },
  openGraph: {
    title: "Client Results | JP Automations",
    description: "Real results from real UK trades businesses. £8,400 to £320 outstanding. +£16,800 in one winter. Admin cut from 8 hours to 30 minutes.",
    url: "https://www.jpautomations.co.uk/results",
  },
}

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
