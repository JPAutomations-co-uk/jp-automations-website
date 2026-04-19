"use client"

import TradeLandingPage from "@/app/components/TradeLandingPage"

export default function TradePageClient() {
  return (
    <TradeLandingPage
      trade="Roofers"
      heroImage="/trades/hero-roofers.jpg"
      headline={"GET PAID THE\nWEEK THE\nSCAFFOLDING\nCOMES DOWN."}
      subhead="Invoices sitting for weeks. Quotes that never get chased. Evenings lost to admin. We build AI systems that sort all of it — so you just do the roofing."
      painPoints={[
        {
          title: "Late Payments Are Bleeding You Dry",
          stat: "£6,210",
          body: "That's the average outstanding balance for a UK roofing contractor at any given time. Not because clients won't pay — because nobody's chasing them. Your invoice is sitting in a Gmail folder they opened once. We fix that with automated reminders that are polite, persistent, and impossible to ignore.",
        },
        {
          title: "Missed Calls While You're on a Roof",
          stat: "£24k/year",
          body: "You're three storeys up stripping tiles and your phone's ringing in the van. By the time you check it at 5pm, they've already booked someone else. That's roughly £24k a year in jobs that called you first but paid someone else. Every unanswered call is a quote you never got to give.",
        },
        {
          title: "Quotes That Disappear Into Thin Air",
          stat: "68% never followed up",
          body: "You spent 45 minutes measuring up, drove home, typed out the quote, sent it off — and then never heard back. Most roofers don't follow up because they're already onto the next job. But the data's clear: a single follow-up within 48 hours doubles your close rate. Two follow-ups triples it.",
        },
      ]}
      systems={[
        {
          title: "Get Paid the Same Week",
          body: "Money landing in your account within days of the scaffold coming down. No chasing, no awkward phone calls, no waiting 30 days for someone to open your invoice. The system sends it, follows up, and gets you paid — you just do the next job.",
        },
        {
          title: "Never Lose a Quote Again",
          body: "Every quote you send gets followed up automatically — at 3 days, 7 days, 14 days. No more sending a price and hoping they call back. The system handles the chasing so you're not the one who forgot to follow up.",
        },
        {
          title: "Finish Admin in 5 Minutes, Not 5 Hours",
          body: "Job cards, crew assignments, and material lists happening automatically from a voice note. You tell it what the job is, and everything gets created — no typing, no spreadsheets, no scribbling on the back of a fag packet at 9pm.",
        },
        {
          title: "Always Have the Right People",
          body: "Know 6 weeks ahead when you'll be short-handed. A vetted sub pool with up-to-date CSCS and insurance, ready to go when you need them. No more scrambling on WhatsApp the night before a job starts.",
        },
        {
          title: "Every Call Answered, Even on the Roof",
          body: "Never lose a job because you couldn't pick up the phone. AI handles the call while you're three storeys up, qualifies the lead, and books the survey. By the time you check your phone, the appointment's already in your diary.",
        },
        {
          title: "CDM Sorted Without Thinking About It",
          body: "RAMS and compliance docs generate themselves from your job data. Site inductions go digital — QR code, sign-off, done. No more Friday evening paperwork sessions or panicking before a CHAS audit.",
        },
      ]}
      caseStudy={{
        client: "3-man roofing crew, Birmingham",
        problem:
          "Outstanding invoices totalling £8,400 across 11 jobs. Average payment time was 34 days. The owner was spending Sunday evenings chasing money instead of resting before Monday's job.",
        whatWeBuilt:
          "Automated invoicing triggered on job completion, payment reminders at 3/7/14 days, and a missed-call text-back system to capture every enquiry.",
        results: [
          "Outstanding invoices dropped from £8,400 to £320 in 8 weeks",
          "Average payment time cut from 34 days to 6 days",
          "Recovered enough cash flow to buy a second van",
          "Owner got his Sundays back",
        ],
        metric: "£8,400 → £320",
        metricLabel: "Outstanding invoices after 8 weeks",
        system: "Invoice automation + missed call recovery",
      }}
      faqs={[
        {
          q: "How much does this cost?",
          a: "Depends on what you need. Most roofing contractors start with invoicing and missed-call recovery — that's a one-off build fee plus a small monthly. We'll scope it on a call and give you a fixed price. No hourly billing, no surprises.",
        },
        {
          q: "How long until it's running?",
          a: "Most systems are live within 2–3 weeks. The invoicing and payment chasing can be up in days. More complex setups like full quote-to-cash pipelines take a bit longer, but you'll see results fast.",
        },
        {
          q: "I'm not exactly tech-savvy — will I be able to use this?",
          a: "If you can send a text, you can use this. Seriously. The whole point is that it runs in the background. You finish the job, mark it done, and the system handles the rest. We set it up, walk you through it, and make sure you're comfortable before we step back.",
        },
        {
          q: "What if it doesn't work for my business?",
          a: "We offer a 90-day guarantee. If the system doesn't deliver measurable results — faster payments, more calls answered, better follow-up — we'll rebuild it or refund you. We've never had to, but the safety net's there.",
        },
        {
          q: "What tools do I need?",
          a: "A phone and a bank account. We plug into whatever you're already using — Google Calendar, WhatsApp, your accounting software. If you're running everything off a notebook and a biro, that's fine too. We'll build around you, not the other way round.",
        },
        {
          q: "What happens if something breaks?",
          a: "You message us and we fix it. Same day, usually within the hour. You're not buying software and being left to figure it out — you're getting a system with a team behind it. If something goes wrong, it's our problem, not yours.",
        },
      ]}
      relatedTrades={[
        { label: "Plumbers", href: "/ai-automation-for-plumbers-uk" },
        { label: "Electricians", href: "/ai-automation-for-electricians-uk" },
        { label: "Builders", href: "/ai-automation-for-builders-uk" },
        { label: "Landscapers", href: "/ai-automation-for-landscapers-uk" },
      ]}
      relatedPosts={[
        { title: "How Roofers Are Automating Quotes and Winning More Jobs", href: "/blog/automate-quotes-roofers-uk", description: "How roofers are sending quotes the same day, following up automatically, and hitting 52% close rates." },
        { title: "Get Paid in 6 Days Instead of 34", href: "/blog/get-paid-6-days-not-34-roofers", description: "One Birmingham crew cut payment time from 34 days to 6 using automated invoicing. Here's exactly how." },
        { title: "How to Automate Checkatrade Leads", href: "/blog/automate-checkatrade-leads", description: "Stop letting Checkatrade leads go cold. The follow-up system that turns enquiries into booked jobs automatically." },
      ]}
    />
  )
}
