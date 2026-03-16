import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Biggest Automation Mistakes Service Businesses Make",
  description:
    "Why most automation projects fail — and how UK service businesses should actually approach AI automation to save time and recover revenue without adding complexity.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/biggest-automation-mistakes-service-businesses",
  },
  openGraph: {
    title: "The Biggest Automation Mistakes Service Businesses Make | JP Automations",
    description:
      "Most automation projects fail for the same reasons. Here's what goes wrong — and what to do instead.",
    url: "https://www.jpautomations.co.uk/blog/biggest-automation-mistakes-service-businesses",
    type: "article",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=The+Biggest+Automation+Mistakes+Service+Businesses+Make&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "Automation Mistakes — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Biggest Automation Mistakes Service Businesses Make",
    description:
      "Why most automation projects fail — and how to approach AI automation the right way.",
    images: ["https://www.jpautomations.co.uk/api/og?title=The+Biggest+Automation+Mistakes+Service+Businesses+Make&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="The Biggest Automation Mistakes Service Businesses Make" slug="biggest-automation-mistakes-service-businesses" />
      {children}
    </>
  )
}
