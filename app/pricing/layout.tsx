import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing — AI Content Tools",
  description:
    "Pay-as-you-go AI content tools for UK service businesses. Instagram reels, carousels, SEO blog posts, and LinkedIn content. Tokens from £20, never expire.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/pricing",
  },
  openGraph: {
    title: "Pricing — AI Instagram & SEO Tools | JP Automations",
    description:
      "One token balance. Every app. Instagram content, SEO blog writing, keyword research. Buy tokens from £20, use across all tools. No subscriptions.",
    url: "https://www.jpautomations.co.uk/pricing",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=Pricing+%E2%80%94+AI+Content+Tools&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "JP Automations Pricing — AI Content Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — AI Content Tools",
    description:
      "Pay-as-you-go AI content tools for UK service businesses. Tokens from £20, never expire.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Pricing+%E2%80%94+AI+Content+Tools&subtitle=JP+Automations"],
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
