import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Automation for Roofing Companies in the UK",
  description:
    "How UK roofing contractors are using AI automation for quoting, scheduling, invoicing, and client management — without hiring more office staff.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/ai-automation-roofing-companies-uk",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AI Automation for Roofing Companies in the UK | JP Automations",
    description:
      "The complete guide to AI automation for UK roofing contractors. Quoting, scheduling, invoicing, and review collection — all running without you.",
    url: "https://www.jpautomations.co.uk/blog/ai-automation-roofing-companies-uk",
    type: "article",
    publishedTime: "2026-03-19",
    authors: ["https://www.jpautomations.co.uk"],
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Roofing+Companies+in+the+UK&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "AI Automation for Roofing Companies — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Roofing Companies in the UK",
    description:
      "How UK roofing contractors are using AI to automate quoting, scheduling, invoicing, and client management.",
    images: [
      "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+Roofing+Companies+in+the+UK&subtitle=JP+Automations+Blog",
    ],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="AI Automation for Roofing Companies in the UK" slug="ai-automation-roofing-companies-uk" />
      {children}
    </>
  )
}
