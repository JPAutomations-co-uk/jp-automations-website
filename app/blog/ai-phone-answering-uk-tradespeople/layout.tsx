import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Phone Answering for UK Tradespeople: Never Miss Another Lead",
  description:
    "UK tradespeople miss 40-60% of inbound calls because they're on a job. AI phone answering handles calls, books appointments, and captures leads — 24/7.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/ai-phone-answering-uk-tradespeople",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "AI Phone Answering for UK Tradespeople | JP Automations",
    description: "Never miss a lead again. AI phone answering for trades — handles calls, books jobs, and captures enquiries while you're on the tools.",
    url: "https://www.jpautomations.co.uk/blog/ai-phone-answering-uk-tradespeople",
    type: "article",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Phone+Answering+for+UK+Tradespeople&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "AI Phone Answering — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Phone Answering for UK Tradespeople",
    description: "AI phone answering for trades. Never miss a lead again with automated call handling that books jobs while you're on the tools.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Phone+Answering+for+UK+Tradespeople&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="AI Phone Answering for UK Tradespeople" slug="ai-phone-answering-uk-tradespeople" />
      {children}
    </>
  )
}
