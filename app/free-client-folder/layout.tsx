import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The AI Client Folder — Free Guide",
  description:
    "Get the free AI Client Folder system. Fill in one brief per client and AI generates your proposal, invoice, contract, and CRM entry in under 5 minutes. Setup takes 30 minutes.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/free-client-folder",
  },
  openGraph: {
    title: "The AI Client Folder — Free Guide | JP Automations",
    description:
      "One brief per client. AI generates your proposal, invoice, contract, and CRM entry — formatted, client-ready, in under 5 minutes.",
    url: "https://www.jpautomations.co.uk/free-client-folder",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=The+AI+Client+Folder&subtitle=Free+Guide+%E2%80%94+JP+Automations",
        width: 1200,
        height: 630,
        alt: "The AI Client Folder — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The AI Client Folder — Free Guide | JP Automations",
    description:
      "One brief. AI generates your proposal, invoice, contract, and CRM entry in under 5 minutes.",
    images: ["https://www.jpautomations.co.uk/api/og?title=The+AI+Client+Folder&subtitle=Free+Guide+%E2%80%94+JP+Automations"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
