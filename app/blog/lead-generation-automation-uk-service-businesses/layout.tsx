import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Build an Automated Lead Generation System for Your UK Service Business",
  description:
    "Stop chasing leads manually. How UK service businesses automate lead capture, qualification, and follow-up to fill their pipeline — without paid ads or cold calling.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/lead-generation-automation-uk-service-businesses",
  },
  openGraph: {
    title: "Automated Lead Generation for UK Service Businesses | JP Automations",
    description:
      "The system UK service businesses use to generate, qualify, and convert leads automatically — without paid ads.",
    url: "https://www.jpautomations.co.uk/blog/lead-generation-automation-uk-service-businesses",
    type: "article",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=Automated+Lead+Generation+for+UK+Service+Businesses&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "Lead Generation Automation — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automated Lead Generation for UK Service Businesses",
    description: "How UK service businesses automate lead capture, qualification, and follow-up to fill their pipeline.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Automated+Lead+Generation+for+UK+Service+Businesses&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="Automated Lead Generation for UK Service Businesses" slug="lead-generation-automation-uk-service-businesses" />
      {children}
    </>
  )
}
