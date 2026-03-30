import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Automated Follow-Up for Trades: The Step-by-Step Guide",
  description:
    "80% of sales happen after the 5th contact. Most tradespeople stop after 1. Here's how to automate follow-ups that actually get responses.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/automated-follow-up-trades-guide",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Automated Follow-Up for Trades: Step-by-Step Guide | JP Automations",
    description: "80% of sales happen after the 5th contact. Most tradespeople stop after 1. Here's how to automate follow-ups that actually get responses.",
    url: "https://www.jpautomations.co.uk/blog/automated-follow-up-trades-guide",
    type: "article",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=Automated+Follow-Up+for+Trades&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "Automated Follow-Up for Trades — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automated Follow-Up for Trades: The Step-by-Step Guide",
    description: "80% of sales happen after the 5th contact. Most tradespeople stop after 1. Here's how to automate follow-ups.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Automated+Follow-Up+for+Trades&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="Automated Follow-Up for Trades" slug="automated-follow-up-trades-guide" />
      {children}
    </>
  )
}
