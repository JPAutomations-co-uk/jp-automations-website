import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Receptionist for Electricians: How It Works, What It Costs",
  description:
    "An AI receptionist answers every call, qualifies the job, and books it into your diary. Here's how it works for UK electricians and what it actually costs.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/ai-receptionist-electricians-uk",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AI Receptionist for Electricians UK | JP Automations",
    description: "An AI receptionist answers every call, qualifies the job, and books it into your diary. Here's how it works for UK electricians.",
    url: "https://www.jpautomations.co.uk/blog/ai-receptionist-electricians-uk",
    type: "article",
    publishedTime: "2026-04-07",
    authors: ["https://www.jpautomations.co.uk"],
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Receptionist+for+Electricians+UK&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "AI Receptionist for Electricians — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Receptionist for Electricians UK",
    description: "An AI receptionist that answers every call, qualifies the job, and books it. Here's how it works and what it costs.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Receptionist+for+Electricians+UK&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="AI Receptionist for Electricians UK" slug="ai-receptionist-electricians-uk" />
      {children}
    </>
  )
}
