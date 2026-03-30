import type { Metadata } from "next"
import TradePageClient from "./client"

export const metadata: Metadata = {
  title: "AI Systems, Websites & Lead Gen for Electricians UK",
  description:
    "Compliance automation, lead generation, websites, Google ads, and SEO for UK electricians. One client cut admin from 8 hours to 30 minutes per week.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-electricians-uk",
  },
}

export default function Page() {
  return <TradePageClient />
}
