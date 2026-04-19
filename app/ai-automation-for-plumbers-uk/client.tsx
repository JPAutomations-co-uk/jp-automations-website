"use client"

import TradeLandingPage from "@/app/components/TradeLandingPage"

export default function TradePageClient() {
  return (
    <TradeLandingPage
      trade="Plumbers"
      heroImage="/trades/hero-plumbers.jpg"
      headline={"EVERY CALL\nANSWERED.\nEVEN UNDER\nA BOILER."}
      subhead="Missed calls, no service contracts, invoices sitting unpaid. We build AI systems that handle all of it — so you just do the plumbing."
      painPoints={[
        {
          title: "62% of Calls Go Unanswered",
          stat: "62%",
          body: "Not because you don't want the work — because you're doing the work. You're under a sink, behind a bath panel, halfway through a first fix. Your phone rings four times and goes to voicemail. The customer hangs up and Googles the next plumber. By tea time you've lost three jobs you never knew existed.",
        },
        {
          title: "Invoices Sent Late, Paid Later",
          stat: "£4,800 avg outstanding",
          body: "You finish the job, drive to the next one, and the invoice doesn't go out for a week. Then it sits in their inbox for another three. Before you know it you've got nearly five grand floating in unpaid invoices and your materials bill is due Friday. The cash is there — it's just stuck in other people's bank accounts.",
        },
        {
          title: "Service Contracts Nobody's Selling",
          stat: "£0 recurring revenue",
          body: "Every boiler you install is a service contract waiting to happen. Annual service, landlord gas safety certs, priority callout — that's predictable monthly income. But nobody's setting them up because there's no system for it. You finish the install, shake hands, and hope they remember you next year. Most won't.",
        },
      ]}
      systems={[
        {
          title: "Every Call Answered. Every Job Booked.",
          body: "The phone gets picked up while you're under a boiler. The customer gets a text confirmation before you've even finished the job. No more losing work to voicemail — every call answered, every lead captured, every emergency routed straight to you.",
        },
        {
          title: "A Full Diary Without Lifting a Finger",
          body: "Service reminders go out automatically to every boiler you've touched. Customers book themselves in. Quiet months fill up without you chasing anyone. Cross-sells powerflush and system upgrades while you're busy doing actual plumbing.",
        },
        {
          title: "Landlord Portfolios That Run Themselves",
          body: "CP12 renewals tracked and chased automatically — 8 weeks, 4 weeks, 1 week before expiry. Certificates emailed to landlords and tenants on completion. You never miss an expiry, never lose a landlord, never have to think about it.",
        },
        {
          title: "Quotes That Chase Themselves",
          body: "Send a price and the system follows up at 3, 7, and 14 days. It handles the objections, keeps the conversation warm, and you only step in when they're ready to book. No more quotes dying in someone's inbox because you were too busy to chase.",
        },
        {
          title: "5-Star Reviews on Autopilot",
          body: "Every happy customer gets a review request without you asking — one-tap Google link, dead easy. Your Google listing climbs while you work. Follow-ups go out if they don't leave one. You just do good work, the reputation builds itself.",
        },
        {
          title: "Get Paid Without Chasing",
          body: "Invoices send themselves on job completion. Reminders escalate automatically — polite, then firm, then formal. Money arrives without a single awkward phone call. You never have to be the one asking where your money is.",
        },
      ]}
      caseStudy={{
        client: "Solo heating engineer, Leeds",
        problem:
          "Missing 8–12 calls per week during boiler installs. No service contracts set up despite fitting 60+ boilers a year. Reviews stuck at 4.2 stars with only 23 reviews.",
        whatWeBuilt:
          "AI call answering to capture every enquiry, automated service contract offers post-install, and a review collection system triggered on job completion.",
        results: [
          "Missed calls dropped to zero — every enquiry captured",
          "Recovered £16,800 in additional winter revenue from jobs that would have gone elsewhere",
          "34 service contracts set up in the first 4 months",
          "Google reviews jumped from 4.2 to 4.8 stars (89 reviews)",
        ],
        metric: "+£16,800",
        metricLabel: "Recovered revenue in one winter",
        system: "AI call handling + service contracts + reviews",
      }}
      faqs={[
        {
          q: "How does the AI call handling actually work?",
          a: "When you can't pick up, the AI answers like a real receptionist — friendly, professional, knows you're a plumber. It takes the caller's details, finds out what they need, and texts you a summary. If it's an emergency, it flags it straight away. If it's someone asking for a quote on fitting a dishwasher, it captures that too. You decide who to call back.",
        },
        {
          q: "How much does this cost?",
          a: "It depends on what you need. Most plumbers start with call handling and invoicing — that's a one-off setup fee and a small monthly. We'll jump on a quick call, work out what's costing you the most money right now, and give you a fixed price. No hourly rates, no scope creep.",
        },
        {
          q: "I'm a one-man band — is this overkill?",
          a: "It's literally built for one-man bands. You're the person who needs this most because you can't answer the phone and do the job at the same time. The whole system runs in the background — you just do your work and the admin handles itself.",
        },
        {
          q: "What about emergency callouts — can the AI handle those?",
          a: "Yes. The AI knows the difference between 'I'd like a quote for a new bathroom' and 'there's water pouring through my ceiling.' Emergencies get flagged to you immediately with a call and a text. Everything else gets queued for when you're free.",
        },
        {
          q: "How long until it's up and running?",
          a: "Call handling can be live in under a week. The full setup — invoicing, service contracts, reviews — usually takes 2–3 weeks. You'll notice the difference after day one when your phone stops going to voicemail.",
        },
        {
          q: "What if something breaks or I need to change something?",
          a: "You message us and we sort it. Same day, usually within the hour. This isn't a piece of software we hand over and disappear — we manage it, we maintain it, and we improve it. If something's not working, it's on us to fix it.",
        },
      ]}
      relatedTrades={[
        { label: "Roofers", href: "/ai-automation-for-roofers-uk" },
        { label: "Electricians", href: "/ai-automation-for-electricians-uk" },
        { label: "Builders", href: "/ai-automation-for-builders-uk" },
        { label: "Landscapers", href: "/ai-automation-for-landscapers-uk" },
      ]}
      relatedPosts={[
        { title: "The Real Cost of Missed Calls for Plumbers", href: "/blog/real-cost-missed-calls-plumbers", description: "UK plumbers miss 62% of inbound calls during working hours. At £180 per callout, here's what that actually costs you." },
        { title: "Stop Losing Jobs to Missed Calls", href: "/blog/stop-losing-jobs-missed-calls-trades", description: "The exact system UK tradespeople use to answer every call, qualify every lead, and never lose a job while on site." },
        { title: "AI Phone Answering for UK Tradespeople", href: "/blog/ai-phone-answering-uk-tradespeople", description: "How an AI call handler books jobs while you're on the tools — and why one heating engineer added £16,800 in a single winter." },
      ]}
    />
  )
}
