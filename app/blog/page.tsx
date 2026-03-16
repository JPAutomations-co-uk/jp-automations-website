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

const allPosts = [
  // --- NEW ARTICLES (scheduled) ---
  {
    title: "The PT's Guide to Running a Fully Automated Fitness Business",
    excerpt:
      "CRM, scheduling, and client management automation for personal trainers. How to run a fitness business that doesn't depend on you remembering everything.",
    slug: "/crm-automation-personal-trainers-uk",
    image: "/blog/crm-automation-personal-trainers-uk.jpg",
    date: "9 April 2026",
    publishDate: "2026-04-09",
  },
  {
    title: "How UK Cleaning Companies Are Using AI to Manage Clients, Staff, and Cash Flow",
    excerpt:
      "How cleaning businesses in the UK use AI automation for scheduling, quoting, client communication, and team management.",
    slug: "/ai-automation-cleaning-companies-uk",
    image: "/blog/ai-automation-cleaning-companies-uk.jpg",
    date: "6 April 2026",
    publishDate: "2026-04-06",
  },
  {
    title: "From Quote to Paid: How UK Tradesmen Are Automating the Entire Job Lifecycle",
    excerpt:
      "The full job lifecycle automated — from enquiry to quote to invoice to payment. How UK tradespeople eliminate admin between jobs.",
    slug: "/automate-quoting-invoicing-uk-trades",
    image: "/blog/automate-quoting-invoicing-uk-trades.jpg",
    date: "2 April 2026",
    publishDate: "2026-04-02",
  },
  {
    title: "AI Phone Answering for UK Tradespeople: Never Miss Another Lead",
    excerpt:
      "AI phone answering for trades. Never miss a lead again with automated call handling that books jobs while you're on the tools.",
    slug: "/ai-phone-answering-uk-tradespeople",
    image: "/blog/ai-phone-answering-uk-tradespeople.jpg",
    date: "30 March 2026",
    publishDate: "2026-03-30",
  },
  {
    title: "How to Build an Automated Lead Generation System for Your UK Service Business",
    excerpt:
      "Stop chasing leads manually. How UK service businesses automate lead capture, qualification, and follow-up to fill their pipeline.",
    slug: "/lead-generation-automation-uk-service-businesses",
    image: "/blog/lead-generation-automation-uk-service-businesses.jpg",
    date: "26 March 2026",
    publishDate: "2026-03-26",
  },
  {
    title: "WhatsApp Automation for UK Service Businesses",
    excerpt:
      "How UK service businesses use WhatsApp Business API automation for quotes, bookings, and follow-ups without being glued to their phone.",
    slug: "/whatsapp-automation-uk-service-businesses",
    image: "/blog/whatsapp-automation-uk-service-businesses.jpg",
    date: "23 March 2026",
    publishDate: "2026-03-23",
  },
  {
    title: "AI Automation for Roofing Companies in the UK",
    excerpt:
      "How UK roofing contractors are using AI automation for quoting, scheduling, invoicing, and client management — without hiring more office staff.",
    slug: "/ai-automation-roofing-companies-uk",
    image: "/blog/ai-automation-roofing-companies-uk.jpg",
    date: "19 March 2026",
    publishDate: "2026-03-19",
  },
  {
    title: "How to Automate Google Reviews for Your Trade Business",
    excerpt:
      "Automated review collection for UK tradespeople. How to get 5-star Google reviews on autopilot without awkward asking.",
    slug: "/automate-google-reviews-uk-trades",
    image: "/blog/automate-google-reviews-uk-trades.jpg",
    date: "16 March 2026",
  },
  // --- EXISTING ARTICLES ---
  {
    title: "Email Marketing for UK Service Businesses That Actually Converts",
    excerpt:
      "Email marketing for UK service businesses doing £250k+. How to automate campaigns that convert enquiries into paying clients without the manual work.",
    slug: "/email-marketing-uk-service-businesses",
    image: "/blog/email.jpg",
    date: "9 March 2026",
  },
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

const today = new Date().toISOString().slice(0, 10)
const posts = allPosts.filter((p) => !p.publishDate || p.publishDate <= today)

export default function BlogIndexPage() {
  return <BlogListClient posts={posts} />
}
