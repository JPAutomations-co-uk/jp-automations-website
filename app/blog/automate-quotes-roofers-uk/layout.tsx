import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How a Roofer Automated Quotes and Saved 12 Hours a Week",
  description:
    "A Birmingham roofer was spending 12 hours a week on quoting and follow-ups. Here's how he automated the entire process and won more jobs.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/automate-quotes-roofers-uk",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "How a Roofer Automated Quotes and Saved 12 Hours a Week | JP Automations",
    description: "A Birmingham roofer was spending 12 hours a week on quoting and follow-ups. Here's how he automated the entire process.",
    url: "https://www.jpautomations.co.uk/blog/automate-quotes-roofers-uk",
    type: "article",
    publishedTime: "2026-04-10",
    authors: ["https://www.jpautomations.co.uk"],
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=Roofer+Automated+Quotes+%E2%80%94+Saved+12+Hours%2FWeek&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "Automate Quotes for Roofers — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How a Roofer Automated Quotes and Saved 12 Hours a Week",
    description: "A Birmingham roofer automated his quoting process and saved 12 hours a week. Here's exactly how.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Roofer+Automated+Quotes+%E2%80%94+Saved+12+Hours%2FWeek&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="How a Roofer Automated Quotes and Saved 12 Hours a Week" slug="automate-quotes-roofers-uk" />
      {children}
    </>
  )
}
