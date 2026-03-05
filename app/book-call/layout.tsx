import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a Free Discovery Call",
  description:
    "Claim your free 30-minute Digital Growth Map call. We'll map out the automation opportunities in your business and build a clear plan — no obligation, no hard sell.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/book-call",
  },
  openGraph: {
    title: "Book a Free Discovery Call | JP Automations",
    description:
      "30 minutes. We map your automation opportunities, identify where you're losing time and revenue, and build a clear plan. Free, no obligation.",
    url: "https://www.jpautomations.co.uk/book-call",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=Book+a+Free+Discovery+Call&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "Book a Free Discovery Call — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Free Discovery Call | JP Automations",
    description:
      "30 minutes. We map your automation opportunities and build a clear plan — free, no obligation.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Book+a+Free+Discovery+Call&subtitle=JP+Automations"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
