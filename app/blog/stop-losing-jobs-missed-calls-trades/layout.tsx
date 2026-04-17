import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Stop Losing Jobs When You're on the Tools",
  description:
    "UK tradespeople lose £24,000/year from missed calls. Here's how to make sure every enquiry gets handled — even when you can't pick up.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/stop-losing-jobs-missed-calls-trades",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "How to Stop Losing Jobs When You're on the Tools | JP Automations",
    description: "UK tradespeople lose £24,000/year from missed calls. Here's how to make sure every enquiry gets handled — even when you can't pick up.",
    url: "https://www.jpautomations.co.uk/blog/stop-losing-jobs-missed-calls-trades",
    type: "article",
    publishedTime: "2026-03-28",
    authors: ["https://www.jpautomations.co.uk"],
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=Stop+Losing+Jobs+From+Missed+Calls&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "Stop Losing Jobs From Missed Calls — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Stop Losing Jobs When You're on the Tools",
    description: "UK tradespeople lose £24,000/year from missed calls. Here's how to make sure every enquiry gets handled.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Stop+Losing+Jobs+From+Missed+Calls&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="How to Stop Losing Jobs When You're on the Tools" slug="stop-losing-jobs-missed-calls-trades" />
      {children}
    </>
  )
}
