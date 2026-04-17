import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Setting Up Your IDE Properly, From Scratch",
  description:
    "The complete VS Code and Cursor setup guide — secrets protection, commit signing, auto-formatting, linting, TypeScript strict mode, pre-commit hooks, and AI configuration. Everything you need, nothing you don't.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/setup-your-ide-properly",
  },
  openGraph: {
    title: "Setting Up Your IDE Properly, From Scratch | JP Automations",
    description:
      "Most developers open VS Code, install a dark theme, and think they're done. They're not. This is the setup that catches bugs before you can run the code — step by step.",
    url: "https://www.jpautomations.co.uk/blog/setup-your-ide-properly",
    type: "article",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=Setting+Up+Your+IDE+Properly%2C+From+Scratch&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "IDE Setup Guide — JP Automations",
      },
    ],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="Setting Up Your IDE Properly" slug="setup-your-ide-properly" />
      {children}
    </>
  )
}
