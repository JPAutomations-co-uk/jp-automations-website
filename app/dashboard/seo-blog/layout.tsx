import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SEO Blog Writer — AI Blog Posts That Rank on Google",
  description:
    "Write publish-ready SEO blog posts for any UK local keyword. Includes keyword research, content planning, and full articles with meta tags and FAQs. From 20 tokens.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/dashboard/seo-blog",
  },
  openGraph: {
    title: "SEO Blog Writer | JP Automations",
    description:
      "AI-generated SEO blog posts, keyword research, and content plans — built for UK local service businesses. Sign in to get started.",
    url: "https://www.jpautomations.co.uk/dashboard/seo-blog",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEO Blog Writer — JP Automations",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function SEOBlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
