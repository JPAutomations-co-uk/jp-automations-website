import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "5 Processes UK Service Businesses Should Automate",
  description:
    "Most UK service businesses automate the wrong things first. Here are the 5 processes that actually save time, recover revenue, and remove you from the day-to-day.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/business-process-automation-uk-service-businesses",
  },
  openGraph: {
    title: "5 Business Processes Every UK Service Business Should Automate | JP Automations",
    description:
      "Invoice chasing, appointment reminders, lead follow-up, review requests, client onboarding. These five automations remove the biggest time drains in a service business.",
    url: "https://www.jpautomations.co.uk/blog/business-process-automation-uk-service-businesses",
    type: "article",
    publishedTime: "2026-03-05",
    authors: ["https://www.jpautomations.co.uk"],
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=5+Business+Processes+Every+UK+Service+Business+Should+Automate&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "Business Process Automation UK — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "5 Processes UK Service Businesses Should Automate",
    description:
      "Most UK service businesses automate the wrong things first. Here are the 5 that actually move the needle.",
    images: ["https://www.jpautomations.co.uk/api/og?title=5+Business+Processes+Every+UK+Service+Business+Should+Automate&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="5 Processes UK Service Businesses Should Automate" slug="business-process-automation-uk-service-businesses" />
      {children}
    </>
  )
}
