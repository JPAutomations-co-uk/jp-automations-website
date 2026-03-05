import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Instagram Content Engine — AI Reels, Carousels & Captions",
  description:
    "Generate scroll-stopping Instagram content with AI. Reels from 15 tokens, carousels from 10, single images from 5, caption rewrites from 1. Sign in to start.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/dashboard/instagram",
  },
  openGraph: {
    title: "Instagram Content Engine | JP Automations",
    description:
      "AI-generated Instagram reels, carousels, captions, and content plans. Built for UK small businesses. Start creating in minutes.",
    url: "https://www.jpautomations.co.uk/dashboard/instagram",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "Instagram Content Engine — JP Automations",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function InstagramLayout({ children }: { children: React.ReactNode }) {
  return children
}
