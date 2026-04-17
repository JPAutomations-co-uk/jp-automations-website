import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Automate Your Checkatrade Leads (So You Don't Lose Them)",
  description:
    "Most Checkatrade leads go cold because nobody responds fast enough. Here's how to respond instantly, qualify automatically, and book the job.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/automate-checkatrade-leads",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "How to Automate Your Checkatrade Leads | JP Automations",
    description: "Most Checkatrade leads go cold because nobody responds fast enough. Here's how to respond instantly, qualify automatically, and book the job.",
    url: "https://www.jpautomations.co.uk/blog/automate-checkatrade-leads",
    type: "article",
    publishedTime: "2026-03-31",
    authors: ["https://www.jpautomations.co.uk"],
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=Automate+Your+Checkatrade+Leads&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "Automate Checkatrade Leads — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Automate Your Checkatrade Leads",
    description: "Most Checkatrade leads go cold because nobody responds fast enough. Here's how to respond instantly and book the job.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Automate+Your+Checkatrade+Leads&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="How to Automate Your Checkatrade Leads" slug="automate-checkatrade-leads" />
      {children}
    </>
  )
}
