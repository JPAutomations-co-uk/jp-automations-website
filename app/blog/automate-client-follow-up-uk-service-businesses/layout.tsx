import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Automate Client Follow-Up Without a CRM",
  description:
    "Most UK service businesses lose leads not because of bad pricing — but because follow-up is slow or inconsistent. Here's how to automate it without a CRM.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/automate-client-follow-up-uk-service-businesses",
  },
  openGraph: {
    title: "How to Automate Client Follow-Up for UK Service Businesses (Without a CRM) | JP Automations",
    description:
      "A lead comes in on Tuesday. You're on a job. By Friday, they've hired someone else. Here's how to fix that — without expensive CRM software.",
    url: "https://www.jpautomations.co.uk/blog/automate-client-follow-up-uk-service-businesses",
    type: "article",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=How+to+Automate+Client+Follow-Up+for+UK+Service+Businesses&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "Automate Client Follow-Up — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automate Client Follow-Up Without a CRM",
    description:
      "Most UK service businesses lose leads not because of bad pricing — but because follow-up is slow or inconsistent. Here's how to fix it.",
    images: ["https://www.jpautomations.co.uk/api/og?title=How+to+Automate+Client+Follow-Up+for+UK+Service+Businesses&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="Automate Client Follow-Up Without a CRM" slug="automate-client-follow-up-uk-service-businesses" />
      {children}
    </>
  )
}
