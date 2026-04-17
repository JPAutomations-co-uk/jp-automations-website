import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WhatsApp Automation for UK Tradespeople: The Complete Guide",
  description:
    "Most UK trades run their business through WhatsApp. Here's how to turn it from a chaotic group chat into an actual system.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/whatsapp-automation-tradespeople-uk",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "WhatsApp Automation for UK Tradespeople | JP Automations",
    description: "Most UK trades run their business through WhatsApp. Here's how to turn it from a chaotic group chat into an actual system.",
    url: "https://www.jpautomations.co.uk/blog/whatsapp-automation-tradespeople-uk",
    type: "article",
    publishedTime: "2026-04-03",
    authors: ["https://www.jpautomations.co.uk"],
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=WhatsApp+Automation+for+UK+Tradespeople&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "WhatsApp Automation for Tradespeople — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatsApp Automation for UK Tradespeople",
    description: "Turn WhatsApp from a chaotic group chat into an actual business system. The complete guide for UK trades.",
    images: ["https://www.jpautomations.co.uk/api/og?title=WhatsApp+Automation+for+UK+Tradespeople&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="WhatsApp Automation for UK Tradespeople" slug="whatsapp-automation-tradespeople-uk" />
      {children}
    </>
  )
}
