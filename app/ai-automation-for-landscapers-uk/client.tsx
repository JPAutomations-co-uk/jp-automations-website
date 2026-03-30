"use client"

import TradeLandingPage from "@/app/components/TradeLandingPage"

export default function LandscapersClient() {
  return (
    <TradeLandingPage
      trade="Landscapers"
      heroImage="/trades/hero-landscapers.jpg"
      headline={"BREAK THE\nFEAST-OR-FAMINE\nCYCLE.\nFOR GOOD."}
      subhead="£18k summers, £4k winters, and no recurring revenue. We build AI systems that smooth the cycle and give you predictable income year-round."
      painPoints={[
        {
          title: "Seasonal Revenue Crash",
          stat: "75%",
          body: "That's how much revenue drops for the average UK landscaper between October and February. You spend summer building cash reserves just to survive winter. It's not a business model — it's a holding pattern.",
        },
        {
          title: "No Recurring Revenue Model",
          stat: "£0/mo",
          body: "You've got hundreds of past clients with lawns, hedges, and beds that need regular maintenance. But you've never had time to package it up, price it properly, and actually sell it. So that revenue goes to the bloke with a Transit and a Facebook page.",
        },
        {
          title: "Quote Follow-Up Nonexistent",
          stat: "0%",
          body: "You spend 45 minutes driving to a site visit, write up a quote on the way home, send it off... and never follow up. Not because you don't care — because you're already ankle-deep in topsoil on the next job. Half your quotes die in someone's inbox.",
        },
      ]}
      systems={[
        {
          title: "Revenue That Doesn't Disappear in October",
          body: "Every completed garden build triggers a maintenance plan offer automatically. Pricing pulled from the job data, scheduling sorted, recurring invoicing set up. Customers sign up without you selling — they just spent £20k on a garden and want it to stay looking like that.",
        },
        {
          title: "Every Enquiry Handled Before You've Put the Mower Down",
          body: "Calls, forms, Instagram DMs — all responded to instantly. Site visits booked before competitors even call back. By the time you check your phone, the customer's already seen your portfolio and picked a time slot.",
        },
        {
          title: "A Full Winter Diary",
          body: "Your AI reaches out to past clients in August with winter project offers — driveways, fencing, garden rooms, drainage. Personalised, relevant, timed perfectly. The quiet months fill up before they arrive.",
        },
        {
          title: "Quotes Sent Same Day, Not Same Week",
          body: "Take photos and voice notes on site. A professional PDF quote lands in the customer's inbox before you've driven home — quantities calculated, current supplier pricing, proper margins. No more quotes going out three days late and losing the job.",
        },
        {
          title: "Reviews and Referrals Without Asking",
          body: "Before/after photos compiled automatically. Review requests sent at the right moment — one-tap Google link, dead easy. Referral programmes that run themselves with voucher incentives. Your reputation grows while you work.",
        },
        {
          title: "Invoices and Payments on Autopilot",
          body: "The job's done and the invoice is already sent. Payment links embedded, chase sequence running, money arriving without evening admin. Monthly P&L per job type so you know which work actually makes you money.",
        },
      ]}
      caseStudy={{
        client: "Landscaper — Surrey",
        problem: "Owner plus two staff. Summers were flat out, winters were terrifying. No recurring revenue, no maintenance contracts, no system for converting one-off jobs into ongoing relationships. Every January started from zero.",
        whatWeBuilt: "Maintenance plan engine with automated proposals to 200+ past clients. Seasonal scheduling system. Quote automation with multi-step follow-up. Review collection after every job.",
        results: [
          "47 maintenance clients signed up at £85/month",
          "£3,995/month in recurring revenue — from zero",
          "Winter revenue doubled year-on-year",
          "Hired 4th team member in January",
          "Quote conversion rate up 2.3x",
        ],
        metric: "£3,995/mo",
        metricLabel: "Recurring revenue from zero",
        system: "Maintenance plans & seasonal automation",
      }}
      faqs={[
        {
          q: "We're mostly design-and-build. Does this work for us?",
          a: "Yes. Even design-and-build landscapers have past clients with gardens that need maintaining. The maintenance plan engine works alongside your project work — it's not either/or. Think of it as turning every completed project into an ongoing revenue stream.",
        },
        {
          q: "What if our clients don't want maintenance contracts?",
          a: "They do. They just haven't been asked properly. Most homeowners who've spent £15-40k on a garden renovation would happily pay £85/month to keep it looking like that. The system handles the asking — you'd be surprised how many say yes when it's packaged right.",
        },
        {
          q: "We don't have capacity for maintenance rounds right now.",
          a: "That's the point. You build the recurring revenue first, then hire into it. Much less risky than hiring and hoping the work appears. The Surrey landscaper hired his fourth team member after the maintenance revenue was already covering the cost.",
        },
        {
          q: "How long before we see results?",
          a: "The maintenance plan proposals go out in week one. Most clients see their first sign-ups within 10 days. The full system — scheduling, follow-ups, reviews — is usually running within 3-4 weeks. Revenue impact is immediate because maintenance payments start straight away.",
        },
        {
          q: "What about the seasonal scheduling — does it handle different services?",
          a: "It handles everything. Lawn care frequencies change with the seasons, hedge trimming windows, leaf clearance in autumn, planting schedules in spring. It builds optimised routes by postcode so your crew aren't zig-zagging across the county.",
        },
        {
          q: "We already use [software X] for quoting. Will this replace it?",
          a: "Probably not, and it doesn't need to. The automation layer sits on top of your existing tools. If you love your quoting software, great — we'll plug into it. The value isn't replacing what works, it's automating what doesn't happen at all right now: the follow-ups, the maintenance upsells, the review requests.",
        },
      ]}
      relatedTrades={[
        { label: "Roofers", href: "/ai-automation-for-roofers-uk" },
        { label: "Plumbers", href: "/ai-automation-for-plumbers-uk" },
        { label: "Electricians", href: "/ai-automation-for-electricians-uk" },
        { label: "Builders", href: "/ai-automation-for-builders-uk" },
      ]}
    />
  )
}
