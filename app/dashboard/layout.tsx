import type { Metadata } from "next"
import DashboardGuard from "@/app/components/DashboardGuard"

export const metadata: Metadata = {
  title: "My Apps — AI Tools for Instagram & SEO",
  description:
    "Access your JP Automations tools. Generate Instagram reels, carousels, and captions. Write SEO blog posts and run keyword research. One token balance across every app.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/dashboard",
  },
  openGraph: {
    title: "My Apps — AI Tools for Instagram & SEO | JP Automations",
    description:
      "Instagram Content Engine and SEO Blog Writer — two AI tools in one dashboard. Sign in to start creating.",
    url: "https://www.jpautomations.co.uk/dashboard",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "JP Automations Apps Dashboard",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardGuard>{children}</DashboardGuard>
}
