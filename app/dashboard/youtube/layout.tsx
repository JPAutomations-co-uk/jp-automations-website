import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "YouTube Content Engine — Outliers & Title Variants",
  description:
    "Run YouTube outlier scans and generate title variants directly from your dashboard.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/dashboard/youtube",
  },
  openGraph: {
    title: "YouTube Content Engine | JP Automations",
    description:
      "Find high-performing YouTube outliers and generate title variants in one workflow.",
    url: "https://www.jpautomations.co.uk/dashboard/youtube",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "YouTube Content Engine — JP Automations",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function YoutubeLayout({ children }: { children: React.ReactNode }) {
  return children
}
