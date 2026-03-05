import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Whiteboard Image Prompt — Free",
  description:
    "Get the exact prompt to generate photorealistic professor whiteboard images for X and LinkedIn. Works with Grok, Nano Banana, and any image model. Stops the scroll consistently.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/free-prompt",
  },
  openGraph: {
    title: "The Whiteboard Image Prompt — Free | JP Automations",
    description:
      "The exact system prompt for iPhone 16 Pro-quality whiteboard images — copy, paste, run. Works for any topic. Consistently stops the scroll on X and LinkedIn.",
    url: "https://www.jpautomations.co.uk/free-prompt",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=The+Whiteboard+Image+Prompt&subtitle=Free+%E2%80%94+JP+Automations",
        width: 1200,
        height: 630,
        alt: "The Whiteboard Image Prompt — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Whiteboard Image Prompt — Free | JP Automations",
    description:
      "The exact prompt for photorealistic professor whiteboard images. Copy, paste, run. Stops the scroll on X and LinkedIn.",
    images: ["https://www.jpautomations.co.uk/api/og?title=The+Whiteboard+Image+Prompt&subtitle=Free+%E2%80%94+JP+Automations"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
