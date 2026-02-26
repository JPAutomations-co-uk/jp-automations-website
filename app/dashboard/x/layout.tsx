import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "X Content Engine — Dashboard | JP Automations",
  description: "Generate tweets, threads, content plans, and account strategies for X (Twitter).",
  robots: { index: false, follow: false },
}

export default function XDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
