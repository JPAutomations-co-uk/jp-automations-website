import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How UK Cleaning Companies Are Using AI to Manage Clients, Staff, and Cash Flow",
  description:
    "AI automation for UK cleaning companies — scheduling, quoting, client communication, team management, and payment collection. All running without you.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/ai-automation-cleaning-companies-uk",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "AI Automation for UK Cleaning Companies | JP Automations",
    description: "How cleaning businesses in the UK are using AI to automate scheduling, quoting, and client management.",
    url: "https://www.jpautomations.co.uk/blog/ai-automation-cleaning-companies-uk",
    type: "article",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+UK+Cleaning+Companies&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "AI Automation for Cleaning Companies — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for UK Cleaning Companies",
    description: "How cleaning businesses in the UK are automating scheduling, quoting, and client management.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+UK+Cleaning+Companies&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="AI Automation for UK Cleaning Companies" slug="ai-automation-cleaning-companies-uk" />
      {children}
    </>
  )
}
