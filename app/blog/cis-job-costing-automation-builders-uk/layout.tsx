import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How UK Builders Are Automating CIS and Job Costing",
  description:
    "UK builders and general contractors are using AI to track job margins in real time and eliminate CIS admin. Here's how it works and what it costs.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/cis-job-costing-automation-builders-uk",
  },
  openGraph: {
    title: "How UK Builders Are Automating CIS and Job Costing | JP Automations",
    description:
      "Most builders quote a job and have no idea if they made money until it's done. AI job costing changes that — and handles CIS automatically.",
    url: "https://www.jpautomations.co.uk/blog/cis-job-costing-automation-builders-uk",
    type: "article",
    publishedTime: "2026-04-30",
    authors: ["https://www.jpautomations.co.uk"],
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=How+UK+Builders+Are+Automating+CIS+and+Job+Costing&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "CIS and Job Costing Automation for UK Builders — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How UK Builders Are Automating CIS and Job Costing",
    description:
      "Most builders quote a job and have no idea if they made money until it's done. AI job costing changes that.",
    images: ["https://www.jpautomations.co.uk/api/og?title=How+UK+Builders+Are+Automating+CIS+and+Job+Costing&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="How UK Builders Are Automating CIS and Job Costing" slug="cis-job-costing-automation-builders-uk" />
      {children}
    </>
  )
}
