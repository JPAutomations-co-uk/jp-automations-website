import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free 15-Minute Audit — Find Where You're Losing Time",
  description: "Free 15-minute audit for UK trades businesses. I'll look at how your business runs and show you exactly where you're losing time and money. No pitch, no obligation.",
  alternates: { canonical: "https://www.jpautomations.co.uk/audit" },
  openGraph: {
    title: "Free Audit | JP Automations",
    description: "15 minutes. I'll show you where your business is leaking time and money — and what to do about it. No pitch.",
    url: "https://www.jpautomations.co.uk/audit",
  },
}

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
