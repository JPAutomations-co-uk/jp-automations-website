import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Use AI Effectively — Prompting Guide for Better LLM Outputs",
  description:
    "Most people get average results from AI because they prompt it wrong. Learn how to use ChatGPT, Claude, and other LLMs effectively with the four-layer prompt framework, iteration techniques, and model selection strategies.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/how-to-use-ai-effectively",
  },
  openGraph: {
    title: "How to Actually Use AI — 99% of People Are Doing This Wrong | JP Automations",
    description:
      "Stop getting generic AI outputs. Learn the four-layer prompt framework, iteration techniques, and how to pick the right model for every task.",
    url: "https://www.jpautomations.co.uk/blog/how-to-use-ai-effectively",
    type: "article",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=How+to+Actually+Use+AI+Effectively&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "How to Use AI Effectively — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Use AI Effectively — The Prompting Guide Most People Need",
    description:
      "Vague prompts get vague outputs. Learn the four-layer prompt framework, iteration mindset, and model selection strategy that changes everything.",
    images: [
      "https://www.jpautomations.co.uk/api/og?title=How+to+Actually+Use+AI+Effectively&subtitle=JP+Automations+Blog",
    ],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="How to Use AI Effectively" slug="how-to-use-ai-effectively" />
      {children}
    </>
  )
}
