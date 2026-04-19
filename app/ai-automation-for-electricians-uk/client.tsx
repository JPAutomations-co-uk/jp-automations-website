"use client"

import TradeLandingPage from "@/app/components/TradeLandingPage"

export default function TradePageClient() {
  return (
    <TradeLandingPage
      trade="Electricians"
      heroImage="/trades/hero-electricians.jpg"
      headline={"CERTIFICATES.\nCIS. BUILDING\nCONTROL.\nDONE."}
      subhead="Certificates, building control, CIS, MTD — compliance has become an unpaid second job. We build AI systems that handle all of it automatically."
      painPoints={[
        {
          title: "Compliance Is a Full-Time Job You're Not Getting Paid For",
          stat: "18+",
          body: "EICs, minor works certificates, building control notifications, NICEIC paperwork — every job generates a paper trail. Miss one notification and you're explaining yourself to your scheme provider. It's not hard work. It's just relentless.",
        },
        {
          title: "CIS Returns: Monthly Dread",
          stat: "19th",
          body: "Every month, same panic. Chasing subbies for UTR numbers, cross-referencing HMRC verification, calculating deductions by hand. One wrong figure and you're looking at penalties. It shouldn't take a full evening to file something HMRC already knows about.",
        },
        {
          title: "Admin Is Eating Your Billable Hours",
          stat: "8hrs/wk",
          body: "Eight hours a week on invoicing, certificates, and chasing payments. That's a full day you could be on-site earning. At £45/hour, you're burning through roughly £18k a year doing work a system should handle.",
        },
      ]}
      systems={[
        {
          title: "Certificates Done Before You Leave Site",
          body: "Finish a board change and the EIC is auto-generated from your test results. Building control notified, customer emailed, everything validated against BS 7671 — all before you've packed up your tools. No more Friday night paperwork.",
        },
        {
          title: "Quotes That Don't Sit There",
          body: "Live pricing from your wholesalers, proper margins applied, and follow-ups that run without you remembering. The system chases at 3, 7, and 14 days — you just do the site visit and let it handle the rest.",
        },
        {
          title: "No More Missed Emergency Callouts",
          body: "Every call answered 24/7, even when you're halfway through a consumer unit swap. After-hours emergencies get routed to you immediately. Routine jobs get booked into the diary. No more checking voicemail at 6pm to find you've lost three callouts.",
        },
        {
          title: "MTD and Invoicing Without the Headache",
          body: "Invoices fire on cert completion. Payment chasing happens automatically — polite, then firm. Quarterly HMRC submissions ready to go, CIS reconciliation building itself throughout the month. The 19th passes without you noticing.",
        },
        {
          title: "Assessment Day Without the Panic",
          body: "Your NICEIC compliance tracked in the background — certs archived, competence logged, insurance monitored. Mock audit report generates automatically 8 weeks before your assessment. Walk in knowing everything's sorted, not hoping it is.",
        },
        {
          title: "The Right Materials at the Right Price",
          body: "Voice-note a job scope and get a full bill of materials with the best prices across your wholesaler accounts. No more ringing round three suppliers or overpaying because you were in a rush. Every cost feeds straight into the job record.",
        },
      ]}
      caseStudy={{
        client: "NICEIC-Registered Contractor — Manchester",
        problem:
          "Two-man team drowning in compliance admin. Every Friday was a write-off: certificates, building control submissions, CIS returns, and invoice chasing. Missed a building control notification on a bathroom rewire that nearly cost them their NICEIC registration.",
        whatWeBuilt:
          "End-to-end compliance and admin system. Certificates auto-generate from job data, building control notifications fire on completion, CIS builds throughout the month, invoices go out same-day with automated chase sequences.",
        results: [
          "Admin dropped from 8 hours to 30 minutes per week",
          "Zero missed building control notifications in 12 months",
          "£40k/year in recovered billable time",
          "CIS returns filed on time every month — no more 19th-of-the-month panic",
        ],
        metric: "8hrs → 30min",
        metricLabel: "Weekly admin time",
        system: "Full Compliance Automation",
      }}
      faqs={[
        {
          q: "Does this work with NICEIC / NAPIT / ELECSA schemes?",
          a: "Yes. The system generates certificates in the formats your scheme provider expects. We set it up around your specific scheme's requirements — whether that's NICEIC, NAPIT, or ELECSA. Same data, right format, no re-keying.",
        },
        {
          q: "What about Part P building control notifications?",
          a: "Handled automatically. When a notifiable job completes, the system generates and submits the building control notification with the correct details. You get a confirmation so you know it's done. No more mental load tracking which jobs need notifying.",
        },
        {
          q: "Can it handle CIS if I use subbies occasionally?",
          a: "That's exactly when CIS gets messy — irregular subcontractor use means you forget the process between returns. The system tracks payments as they happen, verifies UTR numbers with HMRC, calculates deductions, and builds your return automatically. Works whether you use one subbie a year or ten a month.",
        },
        {
          q: "I'm a one-man band. Is this overkill?",
          a: "Honestly, one-man operations benefit the most. You don't have an office manager or apprentice to dump admin on. Every hour you spend on paperwork is an hour you're not earning. The sparks who get the most from this are the ones doing everything themselves.",
        },
        {
          q: "Will this mess up my existing accounting software?",
          a: "No. It feeds into whatever you're already using — Xero, QuickBooks, FreeAgent, even spreadsheets if that's your thing. We don't replace your accounting setup. We just stop you having to manually type the same information into three different places.",
        },
        {
          q: "What does this actually cost?",
          a: "Depends on what you need built. Most electricians are looking at a one-off build fee plus a small monthly for hosting and maintenance. But here's the thing — if the system doesn't pay for itself within 90 days, we keep building until it does. That's in the contract, not just on the website.",
        },
      ]}
      relatedTrades={[
        { label: "Roofers", href: "/ai-automation-for-roofers-uk" },
        { label: "Plumbers", href: "/ai-automation-for-plumbers-uk" },
        { label: "Builders", href: "/ai-automation-for-builders-uk" },
        { label: "Landscapers", href: "/ai-automation-for-landscapers-uk" },
      ]}
      relatedPosts={[
        { title: "AI Receptionist for Electricians UK", href: "/blog/ai-receptionist-electricians-uk", description: "How NICEIC electricians are using AI call handling to book more jobs without missing a call while on site." },
        { title: "How to Automate Quoting and Invoicing", href: "/blog/automate-quoting-invoicing-uk-trades", description: "The full quote-to-cash pipeline UK trades use to send quotes faster, follow up automatically, and get paid sooner." },
        { title: "Compliance Admin Automation for Electricians", href: "/blog/ai-automation-roofing-companies-uk", description: "How trades are cutting 8+ hours of weekly admin down to under 30 minutes with automated certificates and notifications." },
      ]}
    />
  )
}
