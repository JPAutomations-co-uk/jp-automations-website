import type { Metadata } from "next"
import InstaEngineClient from "./InstaEngineClient"

export const metadata: Metadata = {
  title: "InstaEngine — AI Instagram Content Generator | Reels, Carousels & Captions in Seconds",
  description:
    "Generate scroll-stopping Instagram reels, carousels, images, captions, and content plans with AI. One-time $97 investment, lifetime access. No subscription. Setup in 15 minutes.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/apps/instagram-content",
  },
  openGraph: {
    title: "InstaEngine — AI Instagram Content Generator",
    description:
      "Stop the chaos. Start the engine. AI-powered Instagram reels, carousels, captions, and content plans — generated in seconds. One-time investment from $97. No subscription.",
    url: "https://www.jpautomations.co.uk/apps/instagram-content",
    siteName: "JP Automations",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "InstaEngine — AI Instagram Content Generator by JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaEngine — AI Instagram Content Generated in Seconds",
    description:
      "AI-powered reels, carousels, captions & content plans. One-time $97 investment. No subscription. By JP Automations.",
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
  name: "InstaEngine",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered Instagram content engine — reels, carousels, single images, captions, content plans, and ad creatives. One-time investment for lifetime access.",
  url: "https://www.jpautomations.co.uk/apps/instagram-content",
  offers: {
    "@type": "Offer",
    price: "97",
    priceCurrency: "USD",
    description: "One-time investment starting at $97 for lifetime access.",
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
      name: "What is InstaEngine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A comprehensive operating system built on Notion/Airtable designed to automate your entire content pipeline.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need coding experience?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Zero. If you can drag and drop, you can run the Engine.",
      },
    },
    {
      "@type": "Question",
      name: "How long does setup take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Under 15 minutes. You'll be generating ready-to-post content on day one.",
      },
    },
    {
      "@type": "Question",
      name: "Is this a subscription?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. It is a one-time investment for lifetime access to the core engine.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work for my niche?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The frameworks are industry-agnostic and adapt to your unique voice.",
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
