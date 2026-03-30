"use client"

import TradeLandingPage from "@/app/components/TradeLandingPage"

export default function TradePageClient() {
  return (
    <TradeLandingPage
      trade="Builders"
      heroImage="/trades/hero-builders.jpg"
      headline={"KNOW WHAT\nEVERY JOB\nCOSTS YOU.\nIN REAL TIME."}
      subhead="Margins you can't see, CIS returns you're guessing, and everything running through WhatsApp. We build AI systems that give you real visibility and control."
      painPoints={[
        {
          title: "WhatsApp Is Not a Project Management Tool",
          stat: "0%",
          body: "Zero visibility. Materials ordered in a group chat, variations agreed on a voice note, costs buried in a thread you can't find. You don't know what a job's costing you until it's finished — and by then it's too late to fix it.",
        },
        {
          title: "Margin Leakage You Can't See",
          stat: "£900",
          body: "You quoted £22k. You made £900. Somewhere between the quote and the final account, money disappeared — a price increase you absorbed, extras you forgot to charge for, a day's labour you didn't track. Guesswork isn't a pricing strategy.",
        },
        {
          title: "CIS: The 19th-of-the-Month Panic",
          stat: "19th",
          body: "Every month, same drill. Dig through bank statements, chase subbies for UTR numbers, try to reconcile payments you made in cash. One missed return and HMRC starts asking questions. It's not complicated — it's just badly organised.",
        },
      ]}
      systems={[
        {
          title: "Actually Know Your Margins",
          body: "See what every job is costing you in real time — materials, labour, subbies, the lot. No more finding out you made £900 on a £22k job after it's done. Weekly P&L lands in your inbox, budget alerts fire before you've blown the margin.",
        },
        {
          title: "CIS That Does Itself",
          body: "The 19th of the month passes without you noticing. Deductions calculated, returns filed, subbies getting clear statements. No more scrambling through bank statements or chasing UTR numbers. It just happens.",
        },
        {
          title: "Cash That Doesn't Sit in Limbo",
          body: "Stage payments invoiced the moment milestones hit. Reminders that escalate — polite, then firm, then statutory interest notices for the ones who take the mick. Retentions tracked and chased on release dates. Money moves when it should.",
        },
        {
          title: "Everyone Where They Need to Be",
          body: "Subbies get WhatsApp confirmations 48 hours before. Morning briefings generated with site details and what's expected. No-shows flagged before they cascade into a week-long delay. Everyone knows where they need to be and when.",
        },
        {
          title: "H&S Docs in 3 Minutes, Not 3 Hours",
          body: "Describe the job and get compliant RAMS, COSHH assessments, and construction phase plans instantly. Site inductions go digital — QR code, sign-off, done. No more writing RAMS at the kitchen table the night before.",
        },
        {
          title: "No More Free Work",
          body: "Every \"while you're here\" gets caught, quoted, and signed off before you pick up a tool. Variations tracked against the original scope, cost impact shown immediately, digital sign-off before the work starts. No more absorbing extras because you forgot to charge for them.",
        },
      ]}
      caseStudy={{
        client: "General Contractor — Bristol",
        problem:
          "Running three concurrent projects with six subcontractors. No system for tracking job costs in real time. Margins were a mystery until the accountant did the year-end. CIS returns were consistently late. Subbies were threatening to go work for someone who actually paid on time with proper paperwork.",
        whatWeBuilt:
          "Live job costing dashboard pulling in material costs, labour, and subcontractor payments in real time. CIS automation handling UTR verification, deductions, and return preparation. Automated subcontractor payment schedules with CIS statements.",
        results: [
          "Margins improved from 8% to 16% within four months",
          "Zero late CIS returns since implementation",
          "Subcontractors actively prefer working with him — reliable payments, proper paperwork",
          "Quotes now go out same-day instead of end-of-week",
        ],
        metric: "8% → 16%",
        metricLabel: "Profit margin improvement",
        system: "Job Costing & CIS Automation",
      }}
      faqs={[
        {
          q: "I'm running multiple projects at once. Can this handle that?",
          a: "That's the whole point. Each project has its own cost tracker — materials, labour, subbies — all separate but visible in one place. You see exactly which jobs are making money and which ones are bleeding. No more end-of-year surprises.",
        },
        {
          q: "My subbies aren't exactly tech-savvy. Will this cause problems?",
          a: "They don't need to do anything differently. The system tracks what you pay them, not what they do. They get their CIS statements automatically, payments land on time, and they stop ringing you asking where their money is. If anything, they'll like you more.",
        },
        {
          q: "I already use Xero / QuickBooks. Does this replace that?",
          a: "No. It feeds into your existing accounting software, not around it. Think of it as the layer between the building site and your accountant. The bit where information currently gets lost, forgotten, or typed in wrong three weeks later.",
        },
        {
          q: "What if my jobs change scope halfway through?",
          a: "They will. That's construction. The system handles variations — you log the change, it updates the live cost, and you can see immediately what that variation does to your margin. No more absorbing extras because you lost track.",
        },
        {
          q: "How does the quote follow-up work? I don't want to annoy people.",
          a: "The sequence is spaced out and written in your voice — not aggressive, not salesy. First follow-up at 48 hours, second at a week, final at two weeks. You set the tone once and it handles the rest. Most builders tell us they win jobs purely because they were the only one who actually followed up.",
        },
        {
          q: "What does this actually cost?",
          a: "It depends on what you need. Most builders go for job costing plus CIS automation as the core, then add bits as they see what's possible. One-off build fee plus a small monthly. And the 90-day ROI guarantee means if it doesn't pay for itself, we keep building until it does. Written into the contract.",
        },
      ]}
      relatedTrades={[
        { label: "Roofers", href: "/ai-automation-for-roofers-uk" },
        { label: "Plumbers", href: "/ai-automation-for-plumbers-uk" },
        { label: "Electricians", href: "/ai-automation-for-electricians-uk" },
        { label: "Landscapers", href: "/ai-automation-for-landscapers-uk" },
      ]}
    />
  )
}
