import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Automate Google Reviews for Your Trade Business",
  description:
    "Automated review collection for UK tradespeople. The 3-step system to get 5-star Google reviews on autopilot — without awkward asking or chasing clients.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/automate-google-reviews-uk-trades",
  },
  openGraph: {
    title: "How to Automate Google Reviews for Your Trade Business | JP Automations",
    description:
      "The 3-step system UK tradespeople use to collect 5-star Google reviews automatically — without chasing clients or awkward conversations.",
    url: "https://www.jpautomations.co.uk/blog/automate-google-reviews-uk-trades",
    type: "article",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=How+to+Automate+Google+Reviews+for+Your+Trade+Business&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "Automate Google Reviews — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Automate Google Reviews for Your Trade Business",
    description:
      "The 3-step system UK tradespeople use to collect 5-star Google reviews automatically.",
    images: [
      "https://www.jpautomations.co.uk/api/og?title=How+to+Automate+Google+Reviews+for+Your+Trade+Business&subtitle=JP+Automations+Blog",
    ],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="How to Automate Google Reviews for Your Trade Business" slug="automate-google-reviews-uk-trades" />
      {children}
    </>
  )
}
