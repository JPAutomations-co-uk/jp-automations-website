import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The 10-Minute Onboarding System — Free Guide",
  description:
    "Get the free guide to building a fully automated client onboarding system using free tools. Setup takes 2–3 hours once. Every client after that takes under 10 minutes.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/free-onboarding",
  },
  openGraph: {
    title: "The 10-Minute Onboarding System — Free Guide | JP Automations",
    description:
      "Build a complete client onboarding system with Tally, Calendly, Brevo, and Notion — all free. Setup once, runs automatically from there.",
    url: "https://www.jpautomations.co.uk/free-onboarding",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=The+10-Minute+Onboarding+System&subtitle=Free+Guide+%E2%80%94+JP+Automations",
        width: 1200,
        height: 630,
        alt: "The 10-Minute Onboarding System — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The 10-Minute Onboarding System — Free Guide | JP Automations",
    description:
      "Build a fully automated client onboarding system with free tools. 2–3 hours to set up. Under 10 minutes per client.",
    images: ["https://www.jpautomations.co.uk/api/og?title=The+10-Minute+Onboarding+System&subtitle=Free+Guide+%E2%80%94+JP+Automations"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
