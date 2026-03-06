import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The AI Edge — Free Weekly Newsletter",
  description:
    "One actionable AI automation system every week. Save time, cut costs, and grow your service business without adding headcount. Free.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/newsletter",
  },
  openGraph: {
    title: "The AI Edge — Free Weekly Newsletter | JP Automations",
    description:
      "One actionable AI automation system every week you can plug straight into your service business. No fluff — just what works.",
    url: "https://www.jpautomations.co.uk/newsletter",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=The+AI+Edge&subtitle=Free+Weekly+Newsletter+%E2%80%94+JP+Automations",
        width: 1200,
        height: 630,
        alt: "The AI Edge — Free Weekly Newsletter | JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The AI Edge — Free Weekly Newsletter | JP Automations",
    description:
      "One actionable AI automation system every week you can plug straight into your service business.",
    images: [
      "https://www.jpautomations.co.uk/api/og?title=The+AI+Edge&subtitle=Free+Weekly+Newsletter+%E2%80%94+JP+Automations",
    ],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
