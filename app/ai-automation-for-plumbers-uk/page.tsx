import type { Metadata } from "next"
import TradePageClient from "./client"

export const metadata: Metadata = {
  title: "AI Systems, Websites & Lead Gen for Plumbers UK",
  description:
    "AI call handling, websites that generate enquiries, Google ads, SEO, and service contract automation for UK plumbers and heating engineers.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-plumbers-uk",
  },
}

export default function Page() {
  return <TradePageClient />
}
