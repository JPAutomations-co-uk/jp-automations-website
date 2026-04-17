import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Best AI Automation Tools for Tradesmen UK [2026]",
  description:
    "A straight comparison of AI automation tools for UK tradespeople — what works, what's overhyped, and what's actually worth paying for.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/best-ai-automation-tools-tradesmen-uk",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Best AI Automation Tools for Tradesmen UK [2026] | JP Automations",
    description: "A straight comparison of AI automation tools for UK tradespeople — what works, what's overhyped, and what's actually worth paying for.",
    url: "https://www.jpautomations.co.uk/blog/best-ai-automation-tools-tradesmen-uk",
    type: "article",
    publishedTime: "2026-04-28",
    authors: ["https://www.jpautomations.co.uk"],
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=Best+AI+Tools+for+Tradesmen+UK+2026&subtitle=JP+Automations+Blog", width: 1200, height: 630 }],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="Best AI Automation Tools for Tradesmen UK [2026]" />
      {children}
    </>
  )
}
