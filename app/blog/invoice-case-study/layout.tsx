import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Invoice Automation: 25 Hours & £2,995 Recovered",
  description:
    "How a simple invoicing automation removed 25 hours/week of admin and recovered £2,995 in outstanding payments for a UK roofing contractor. Full breakdown inside.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/invoice-case-study",
  },
  openGraph: {
    title: "Case Study: 25 Hours Reclaimed & £2,995 Recovered | JP Automations",
    description:
      "A roofing contractor was losing 25 hours/week to invoice admin and had £2,995 outstanding. One automation fixed both. Here's exactly how.",
    url: "https://www.jpautomations.co.uk/blog/invoice-case-study",
    type: "article",
    publishedTime: "2026-01-24",
    authors: ["https://www.jpautomations.co.uk"],
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=Case+Study%3A+25+Hours+Reclaimed+%26+%C2%A32%2C995+Recovered&subtitle=JP+Automations+Blog",
        width: 1200,
        height: 630,
        alt: "Invoicing Automation Case Study — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Study: 25 Hours Reclaimed & £2,995 Recovered",
    description:
      "How a simple invoicing automation removed 25 hours/week of admin and recovered £2,995 for a UK roofing contractor.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Case+Study%3A+25+Hours+Reclaimed+%26+%C2%A32%2C995+Recovered&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="Invoice Automation: 25 Hours & £2,995 Recovered" slug="invoice-case-study" />
      {children}
    </>
  )
}
