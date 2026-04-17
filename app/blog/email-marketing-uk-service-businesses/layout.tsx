import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Email Marketing UK | Service Business Growth",
  description:
    "Email marketing for UK service businesses doing £250k+. How to automate campaigns that convert enquiries into paying clients without the manual work.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/email-marketing-uk-service-businesses",
  },
  openGraph: {
    title: "Email Marketing for UK Service Businesses That Actually Converts | JP Automations",
    description:
      "Email marketing for UK service businesses doing £250k+. How to automate campaigns that convert enquiries into paying clients without the manual work.",
    url: "https://www.jpautomations.co.uk/blog/email-marketing-uk-service-businesses",
    type: "article",
    publishedTime: "2026-03-09",
    authors: ["https://www.jpautomations.co.uk"],
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=Email+Marketing+for+UK+Service+Businesses&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "Email Marketing for UK Service Businesses — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Email Marketing UK | Service Business Growth",
    description:
      "Email marketing for UK service businesses doing £250k+. How to automate campaigns that convert enquiries into paying clients without the manual work.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Email+Marketing+for+UK+Service+Businesses&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="Email Marketing for UK Service Businesses" slug="email-marketing-uk-service-businesses" />
      {children}
    </>
  )
}
