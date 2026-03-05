import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Resources — Guides & Templates",
  description:
    "Free automation guides, templates, and tools for UK service businesses. The Automation Blueprint, AI Client Folder, 10-Minute Onboarding System, Prompt Engineering Guide, and more.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/free-resources",
  },
  openGraph: {
    title: "Free Resources for UK Service Businesses | JP Automations",
    description:
      "Guides, templates, and tools to help you automate your service business — all free, no fluff. Start with the Automation Blueprint.",
    url: "https://www.jpautomations.co.uk/free-resources",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=Free+Resources&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "Free Resources — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Resources for UK Service Businesses | JP Automations",
    description:
      "Free automation guides and templates for UK service businesses. All free, no fluff.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Free+Resources&subtitle=JP+Automations"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
