import type { Metadata } from "next"
import BlogListClient from "./BlogListClient"

export const metadata: Metadata = {
  title: "AI Automation Guides for UK Trades — Case Studies, Frameworks & Systems",
  description:
    "30+ guides and case studies for UK roofers, plumbers, electricians, builders and landscapers. How AI automation recovers revenue, eliminates admin, and builds systems that run without you.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AI Automation Guides for UK Trades | JP Automations",
    description:
      "Case studies and practical frameworks for UK trade businesses. See how roofers, plumbers and electricians use AI to save 25+ hours per week.",
    url: "https://www.jpautomations.co.uk/blog",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "JP Automations Blog — AI Automation for UK Trades",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation Guides for UK Trades — Case Studies & Systems",
    description:
      "30+ guides for UK trade businesses. Invoice automation, call handling, compliance, lead generation — all running without you.",
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
    title: "How UK Builders Are Automating CIS and Job Costing",
    excerpt:
      "UK builders and general contractors are using AI to track job margins in real time and eliminate CIS admin. Here's how it works and what it costs.",
    slug: "/cis-job-costing-automation-builders-uk",
    image: "/blog/cis-job-costing-automation-builders-uk.jpg",
    date: "30 April 2026",
    publishDate: "2026-04-30",
  },
  {
    title: "Best AI Automation Tools for Tradesmen UK [2026]",
    excerpt:
      "A straight comparison of AI automation tools for UK tradespeople — what works, what's overhyped, and what's actually worth paying for.",
    slug: "/best-ai-automation-tools-tradesmen-uk",
    image: "/blog/best-ai-automation-tools-tradesmen-uk.jpg",
    date: "28 April 2026",
    publishDate: "2026-04-28",
  },
  {
    title: "How to Get Paid in 6 Days Instead of 34 as a Roofer",
    excerpt:
      "The average roofer waits 34 days to get paid. One Birmingham crew got it down to 6 with automated invoicing. Here's exactly how.",
    slug: "/get-paid-6-days-not-34-roofers",
    image: "/blog/get-paid-6-days-not-34-roofers.jpg",
    date: "24 April 2026",
    publishDate: "2026-04-24",
  },
  {
    title: "Automated Follow-Up for Trades: The Step-by-Step Guide",
    excerpt:
      "80% of sales happen after the 5th contact. Most tradespeople stop after 1. Here's how to automate follow-ups that actually get responses.",
    slug: "/automated-follow-up-trades-guide",
    image: "/blog/automated-follow-up-trades-guide.jpg",
    date: "21 April 2026",
    publishDate: "2026-04-21",
  },
  {
    title: "Is AI Replacing Tradesmen? No — But It's Replacing Their Admin",
    excerpt:
      "AI isn't coming for your job. It's coming for the invoicing, the quoting, the follow-ups, and the paperwork you do at 9pm. Here's what that actually means.",
    slug: "/is-ai-replacing-tradesmen",
    image: "/blog/is-ai-replacing-tradesmen.jpg",
    date: "17 April 2026",
    publishDate: "2026-04-17",
  },
  {
    title: "The Real Cost of Missed Calls for Plumbers (And How to Fix It)",
    excerpt:
      "UK plumbers miss 62% of inbound calls. At £180 per emergency callout, that's thousands walking to competitors every month. Here's the fix.",
    slug: "/real-cost-missed-calls-plumbers",
    image: "/blog/real-cost-missed-calls-plumbers.jpg",
    date: "14 April 2026",
    publishDate: "2026-04-14",
  },
  {
    title: "How a Roofer Automated Quotes and Saved 12 Hours a Week",
    excerpt:
      "A Birmingham roofer was spending 12 hours a week on quoting and follow-ups. Here's how he automated the entire process and won more jobs.",
    slug: "/automate-quotes-roofers-uk",
    image: "/blog/automate-quotes-roofers-uk.jpg",
    date: "10 April 2026",
    publishDate: "2026-04-10",
  },
  {
    title: "AI Receptionist for Electricians: How It Works, What It Costs",
    excerpt:
      "An AI receptionist answers every call, qualifies the job, and books it into your diary. Here's how it works for UK electricians and what it actually costs.",
    slug: "/ai-receptionist-electricians-uk",
    image: "/blog/ai-receptionist-electricians-uk.jpg",
    date: "7 April 2026",
    publishDate: "2026-04-07",
  },
  {
    title: "WhatsApp Automation for UK Tradespeople: The Complete Guide",
    excerpt:
      "Most UK trades run their business through WhatsApp. Here's how to turn it from a chaotic group chat into an actual system.",
    slug: "/whatsapp-automation-tradespeople-uk",
    image: "/blog/whatsapp-automation-tradespeople-uk.jpg",
    date: "3 April 2026",
    publishDate: "2026-04-03",
  },
  {
    title: "How to Automate Your Checkatrade Leads (So You Don't Lose Them)",
    excerpt:
      "Most Checkatrade leads go cold because nobody responds fast enough. Here's how to respond instantly, qualify automatically, and book the job.",
    slug: "/automate-checkatrade-leads",
    image: "/blog/automate-checkatrade-leads.jpg",
    date: "31 March 2026",
    publishDate: "2026-03-31",
  },
  {
    title: "How to Stop Losing Jobs When You're on the Tools",
    excerpt:
      "UK tradespeople lose £24,000/year from missed calls. Here's how to make sure every enquiry gets handled — even when you can't pick up.",
    slug: "/stop-losing-jobs-missed-calls-trades",
    image: "/blog/stop-losing-jobs-missed-calls-trades.jpg",
    date: "28 March 2026",
    publishDate: "2026-03-28",
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
