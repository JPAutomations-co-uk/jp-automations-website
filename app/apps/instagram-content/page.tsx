import type { Metadata } from "next"
import InstaEngineClient from "./InstaEngineClient"

export const metadata: Metadata = {
  title: "Instagram Content Engine — AI Reels, Carousels & Captions in Seconds | JP Automations",
  description:
    "AI-powered Instagram reels, carousels, images, captions, and content plans for service businesses. Pay-as-you-go from £0.50/token — no monthly subscription. Generated in seconds.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/apps/instagram-content",
  },
  openGraph: {
    title: "Instagram Content Engine — AI Content Generated in Seconds",
    description:
      "AI-powered reels, carousels, images, captions & content plans for any business. Pay per use from £0.50/token. No subscription. By JP Automations.",
    url: "https://www.jpautomations.co.uk/apps/instagram-content",
    siteName: "JP Automations",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "Instagram Content Engine — AI Instagram Content by JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Content Engine — AI Content Generated in Seconds",
    description:
      "AI-powered reels, carousels, captions & content plans. Pay-as-you-go from £0.50/token. No subscription. By JP Automations.",
    images: ["https://www.jpautomations.co.uk/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Instagram Content Engine",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered Instagram content engine — reels, carousels, single images, captions, content plans, and ad creatives. Token-based pay-as-you-go pricing with no monthly subscription.",
  url: "https://www.jpautomations.co.uk/apps/instagram-content",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "0.50",
    highPrice: "110",
    priceCurrency: "GBP",
    offerCount: "3",
    description: "Pay-as-you-go from £0.50/token or Pro Bundle 350 tokens for £110.",
  },
  provider: {
    "@type": "Organization",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need design experience?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The entire process is prompt-based. Describe what you want in plain English and the AI generates the content.",
      },
    },
    {
      "@type": "Question",
      name: "What aspect ratios are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Square (1:1), portrait (4:5), story/reel (9:16), and landscape (16:9) — all standard Instagram formats.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use my own brand colours and style?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. During onboarding you define your brand style, and all generated content will reflect it consistently.",
      },
    },
    {
      "@type": "Question",
      name: "How long does generation take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Single images take 10–20 seconds. 7-slide carousels take 30–60 seconds. Reels take 1–2 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "Do tokens expire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Tokens never expire and work across all apps — Instagram, SEO Blog, and every new app we release.",
      },
    },
    {
      "@type": "Question",
      name: "Is this a monthly subscription?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. You buy tokens when you need them. Pay-as-you-go at £0.50/token, or save with a bundle. No contracts, no commitments.",
      },
    },
  ],
}

export default function InstagramContentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <InstaEngineClient />
    </>
  )
}
