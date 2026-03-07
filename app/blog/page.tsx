import type { Metadata } from "next"
import BlogListClient from "./BlogListClient"

export const metadata: Metadata = {
  title: "Blog — AI Automation Guides & Case Studies",
  description:
    "Free guides and case studies for UK trade and service businesses. Learn how AI automation saves time, recovers revenue, and builds scalable systems that run without you.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog",
  },
  openGraph: {
    title: "Blog — AI Automation for UK Service Businesses | JP Automations",
    description:
      "Case studies, frameworks, and practical guides for UK trade businesses ready to use AI automation to grow.",
    url: "https://www.jpautomations.co.uk/blog",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "JP Automations Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — AI Automation Guides & Case Studies",
    description:
      "Free guides and case studies for UK service businesses. AI automation tips that save time and recover revenue.",
    images: ["https://www.jpautomations.co.uk/og-image.png"],
  },
}

const posts = [
  {
    title: "How to Actually Use AI — 99% of People Are Doing This Wrong",
    excerpt:
      "Vague prompts get vague outputs. Learn the four-layer prompt framework, iteration techniques, and how to pick the right AI model for every task.",
    slug: "/how-to-use-ai-effectively",
    image: "/blog/llm.jpg",
    date: "7 March 2026",
  },
  {
    title: "5 Business Processes Every UK Service Business Should Automate",
    excerpt:
      "The five processes quietly draining time and revenue every week — and how to automate each one for immediate, measurable impact.",
    slug: "/business-process-automation-uk-service-businesses",
    image: "/blog/business-process-automation.webp",
    date: "5 March 2026",
  },
  {
    title: "How to Automate Client Follow-Up for UK Service Businesses (Without a CRM)",
    excerpt:
      "Most service businesses lose leads not because of bad pricing — but because follow-up is slow or inconsistent. Here's how to fix it automatically.",
    slug: "/automate-client-follow-up-uk-service-businesses",
    image: "/blog/follow-up.webp",
    date: "2 March 2026",
  },
  {
    title: "Case Study: 25 Hours Reclaimed, Four Figures Recovered",
    excerpt:
      "How a simple invoicing automation eliminated admin and stabilised cash flow for a roofing contractor.",
    slug: "/invoice-case-study",
    image: "/blog/case-study-invoice.webp",
    date: "January 2026",
  },
  {
    title: "The Biggest Automation Mistakes Service Businesses Make",
    excerpt:
      "Why most automation projects fail — and how service businesses should actually approach AI automation.",
    slug: "/biggest-automation-mistakes-service-businesses",
    image: "/blog/automation-mistakes-service-businesses.webp",
    date: "24 January 2026",
  },
  {
    title: "The 3 Systems Every Scalable Business Needs",
    excerpt:
      "If your business feels stuck, these are the systems likely holding you back.",
    slug: "/essential-business-systems",
    image: "/blog/business-systems.webp",
    date: "January 2026",
  },
]

export default function BlogIndexPage() {
  return <BlogListClient posts={posts} />
}
