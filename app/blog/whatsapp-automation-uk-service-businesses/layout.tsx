import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WhatsApp Automation for UK Service Businesses",
  description:
    "How UK service businesses use WhatsApp Business API automation for quotes, bookings, follow-ups, and payment reminders — without being glued to their phone.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/whatsapp-automation-uk-service-businesses",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "WhatsApp Automation for UK Service Businesses | JP Automations",
    description:
      "Automate quotes, bookings, and client follow-up through WhatsApp — the channel your clients already use every day.",
    url: "https://www.jpautomations.co.uk/blog/whatsapp-automation-uk-service-businesses",
    type: "article",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=WhatsApp+Automation+for+UK+Service+Businesses&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "WhatsApp Automation — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatsApp Automation for UK Service Businesses",
    description:
      "How UK service businesses automate quotes, bookings, and follow-ups through WhatsApp.",
    images: [
      "https://www.jpautomations.co.uk/api/og?title=WhatsApp+Automation+for+UK+Service+Businesses&subtitle=JP+Automations+Blog",
    ],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="WhatsApp Automation for UK Service Businesses" slug="whatsapp-automation-uk-service-businesses" />
      {children}
    </>
  )
}
