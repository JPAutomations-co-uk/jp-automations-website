import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The 3 Systems Every Scalable Service Business Needs",
  description:
    "If your service business feels stuck or chaotic as it grows, these are the three systems likely holding it back — and how to build them properly with AI automation.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/essential-business-systems",
  },
  openGraph: {
    title: "The 3 Systems Every Scalable Business Needs | JP Automations",
    description:
      "Most service businesses plateau because they're missing these three core systems. Here's what they are and how to build them.",
    url: "https://www.jpautomations.co.uk/blog/essential-business-systems",
    type: "article",
    publishedTime: "2026-01-24",
    authors: ["https://www.jpautomations.co.uk"],
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=The+3+Systems+Every+Scalable+Service+Business+Needs&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "Essential Business Systems — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The 3 Systems Every Scalable Service Business Needs",
    description:
      "Most service businesses plateau because they're missing these three core systems.",
    images: ["https://www.jpautomations.co.uk/api/og?title=The+3+Systems+Every+Scalable+Service+Business+Needs&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="The 3 Systems Every Scalable Service Business Needs" slug="essential-business-systems" />
      {children}
    </>
  )
}
