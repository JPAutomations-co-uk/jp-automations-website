import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The OpenClaw Security Guide — Free",
  description:
    "OpenClaw sits inside your inbox and client files. Get the free guide on how to use it without putting your data — or your clients' data — at risk.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/free-openclaw",
  },
  openGraph: {
    title: "The OpenClaw Security Guide — Free | JP Automations",
    description:
      "AI agents like OpenClaw have access to everything. Here's how to configure access controls, audit what it can see, and keep client data safe.",
    url: "https://www.jpautomations.co.uk/free-openclaw",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=The+OpenClaw+Security+Guide&subtitle=Free+%E2%80%94+JP+Automations",
        width: 1200,
        height: 630,
        alt: "The OpenClaw Security Guide — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The OpenClaw Security Guide — Free | JP Automations",
    description:
      "OpenClaw has access to your inbox and client files. Here's the guide to using it safely.",
    images: ["https://www.jpautomations.co.uk/api/og?title=The+OpenClaw+Security+Guide&subtitle=Free+%E2%80%94+JP+Automations"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
