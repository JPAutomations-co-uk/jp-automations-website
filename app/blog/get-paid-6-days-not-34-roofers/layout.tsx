import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Get Paid in 6 Days Instead of 34 as a Roofer",
  description:
    "The average roofer waits 34 days to get paid. One Birmingham crew got it down to 6 with automated invoicing. Here's exactly how.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/get-paid-6-days-not-34-roofers",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Get Paid in 6 Days Instead of 34 as a Roofer | JP Automations",
    description: "The average roofer waits 34 days to get paid. One Birmingham crew got it down to 6 with automated invoicing. Here's exactly how.",
    url: "https://www.jpautomations.co.uk/blog/get-paid-6-days-not-34-roofers",
    type: "article",
    publishedTime: "2026-04-24",
    authors: ["https://www.jpautomations.co.uk"],
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=Get+Paid+in+6+Days+Not+34+as+a+Roofer&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "Roofer Invoice Automation — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Get Paid in 6 Days Instead of 34 as a Roofer",
    description: "The average roofer waits 34 days to get paid. One Birmingham crew got it down to 6 with automated invoicing.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Get+Paid+in+6+Days+Not+34+as+a+Roofer&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="Get Paid in 6 Days Instead of 34 as a Roofer" slug="get-paid-6-days-not-34-roofers" />
      {children}
    </>
  )
}
