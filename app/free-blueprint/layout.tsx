import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Automation Blueprint — Free Guide",
  description:
    "Get the free Automation Blueprint — the exact framework we use to find, build, and scale the right automation for any service business. No tools until the problem is fully understood.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/free-blueprint",
  },
  openGraph: {
    title: "The Automation Blueprint — Free Guide | JP Automations",
    description:
      "The framework behind every automation we build. How to audit your business, validate the problem, and build something that gets stronger as you grow.",
    url: "https://www.jpautomations.co.uk/free-blueprint",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=The+Automation+Blueprint&subtitle=Free+Guide+%E2%80%94+JP+Automations",
        width: 1200,
        height: 630,
        alt: "The Automation Blueprint — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Automation Blueprint — Free Guide | JP Automations",
    description:
      "The exact framework we use to find, build, and scale the right automation for any service business.",
    images: ["https://www.jpautomations.co.uk/api/og?title=The+Automation+Blueprint&subtitle=Free+Guide+%E2%80%94+JP+Automations"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
