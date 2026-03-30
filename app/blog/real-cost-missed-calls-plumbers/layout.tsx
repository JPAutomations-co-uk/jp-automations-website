import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Real Cost of Missed Calls for Plumbers (And How to Fix It)",
  description:
    "UK plumbers miss 62% of inbound calls. At £180 per emergency callout, that's thousands walking to competitors every month. Here's the fix.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/real-cost-missed-calls-plumbers",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "The Real Cost of Missed Calls for Plumbers | JP Automations",
    description: "UK plumbers miss 62% of inbound calls. At £180 per emergency callout, that's thousands walking to competitors every month. Here's the fix.",
    url: "https://www.jpautomations.co.uk/blog/real-cost-missed-calls-plumbers",
    type: "article",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=The+Real+Cost+of+Missed+Calls+for+Plumbers&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "Missed Calls for Plumbers — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Real Cost of Missed Calls for Plumbers",
    description: "UK plumbers miss 62% of inbound calls. At £180 per emergency callout, that's thousands walking to competitors every month.",
    images: ["https://www.jpautomations.co.uk/api/og?title=The+Real+Cost+of+Missed+Calls+for+Plumbers&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="The Real Cost of Missed Calls for Plumbers" slug="real-cost-missed-calls-plumbers" />
      {children}
    </>
  )
}
