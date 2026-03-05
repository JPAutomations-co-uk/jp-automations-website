import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Prompt Engineering Guide — Free",
  description:
    "Get the complete prompt engineering guide — the anatomy of a high-performance prompt, chain of thought, few-shot examples, and copy-paste templates for coding, writing, and automation.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/free-prompt-guide",
  },
  openGraph: {
    title: "The Prompt Engineering Guide — Free | JP Automations",
    description:
      "Learn how to write prompts that AI actually executes on. Role, context, constraints, output format — plus copy-paste templates for every use case.",
    url: "https://www.jpautomations.co.uk/free-prompt-guide",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=The+Prompt+Engineering+Guide&subtitle=Free+%E2%80%94+JP+Automations",
        width: 1200,
        height: 630,
        alt: "The Prompt Engineering Guide — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Prompt Engineering Guide — Free | JP Automations",
    description:
      "The complete guide to writing prompts that AI actually executes on — with copy-paste templates for every use case.",
    images: ["https://www.jpautomations.co.uk/api/og?title=The+Prompt+Engineering+Guide&subtitle=Free+%E2%80%94+JP+Automations"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
