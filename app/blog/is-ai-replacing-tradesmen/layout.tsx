import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Is AI Replacing Tradesmen? No — But It's Replacing Their Admin",
  description:
    "AI isn't coming for your job. It's coming for the invoicing, the quoting, the follow-ups, and the paperwork you do at 9pm. Here's what that actually means.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/is-ai-replacing-tradesmen",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Is AI Replacing Tradesmen? No — But It's Replacing Their Admin | JP Automations",
    description: "AI isn't coming for your job. It's coming for the invoicing, the quoting, the follow-ups, and the paperwork you do at 9pm.",
    url: "https://www.jpautomations.co.uk/blog/is-ai-replacing-tradesmen",
    type: "article",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=Is+AI+Replacing+Tradesmen%3F&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "Is AI Replacing Tradesmen — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Is AI Replacing Tradesmen? No — But It's Replacing Their Admin",
    description: "AI isn't coming for your job. It's coming for the invoicing, the quoting, the follow-ups, and the paperwork you do at 9pm.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Is+AI+Replacing+Tradesmen%3F&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="Is AI Replacing Tradesmen?" slug="is-ai-replacing-tradesmen" />
      {children}
    </>
  )
}
