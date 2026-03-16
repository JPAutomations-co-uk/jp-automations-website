import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The PT's Guide to Running a Fully Automated Fitness Business",
  description:
    "CRM, scheduling, and client management automation for personal trainers. How to run a fitness business that doesn't depend on you remembering everything.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/crm-automation-personal-trainers-uk",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "The PT's Guide to a Fully Automated Fitness Business | JP Automations",
    description: "CRM, booking, and client automation for personal trainers. Run a fitness business that grows without admin holding you back.",
    url: "https://www.jpautomations.co.uk/blog/crm-automation-personal-trainers-uk",
    type: "article",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=The+PT%27s+Guide+to+a+Fully+Automated+Fitness+Business&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "PT Automation Guide — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The PT's Guide to a Fully Automated Fitness Business",
    description: "CRM, scheduling, and client management automation for personal trainers.",
    images: ["https://www.jpautomations.co.uk/api/og?title=The+PT%27s+Guide+to+a+Fully+Automated+Fitness+Business&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="The PT's Guide to a Fully Automated Fitness Business" slug="crm-automation-personal-trainers-uk" />
      {children}
    </>
  )
}
