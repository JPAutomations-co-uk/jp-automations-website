import BlogBreadcrumb from "@/app/components/BlogBreadcrumb"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "From Quote to Paid: How UK Tradesmen Are Automating the Entire Job Lifecycle",
  description:
    "The full job lifecycle automated — from enquiry to quote to invoice to payment. How UK tradespeople eliminate admin between jobs and get paid faster.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog/automate-quoting-invoicing-uk-trades",
  },
  robots: {
    index: true,
    follow: false,
  },
  openGraph: {
    title: "Automate Quoting & Invoicing for UK Trades | JP Automations",
    description: "The complete automation guide for UK tradespeople: enquiry → quote → job → invoice → payment → review. All connected. All automatic.",
    url: "https://www.jpautomations.co.uk/blog/automate-quoting-invoicing-uk-trades",
    type: "article",
    images: [{ url: "https://www.jpautomations.co.uk/api/og?title=From+Quote+to+Paid%3A+Automating+the+Job+Lifecycle&subtitle=JP+Automations+Blog", width: 1200, height: 630, alt: "Quote to Paid Automation — JP Automations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "From Quote to Paid: Automating the Job Lifecycle",
    description: "How UK tradesmen are automating the entire journey from enquiry to payment.",
    images: ["https://www.jpautomations.co.uk/api/og?title=From+Quote+to+Paid%3A+Automating+the+Job+Lifecycle&subtitle=JP+Automations+Blog"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBreadcrumb title="From Quote to Paid: Automating the Job Lifecycle" slug="automate-quoting-invoicing-uk-trades" />
      {children}
    </>
  )
}
