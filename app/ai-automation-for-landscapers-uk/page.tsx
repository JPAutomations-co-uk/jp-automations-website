import type { Metadata } from "next"
import LandscapersClient from "./client"

export const metadata: Metadata = {
  title: "AI Systems, Websites & Lead Gen for Landscapers UK",
  description:
    "Maintenance plan automation, lead generation, websites, SEO, and Google ads for UK landscapers. One client built £3,995/month in recurring revenue.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-landscapers-uk",
  },
}

export default function LandscapersPage() {
  return <LandscapersClient />
}
