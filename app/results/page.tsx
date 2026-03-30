"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import HomeClient, { ArrowIcon, FadeUp } from "../HomeClient"

const caseStudies = [
  // ── Trade-specific case studies ──
  {
    num: "01",
    trade: "Roofer — Birmingham",
    client: "T & D Roofing",
    logo: "/logos/td-roofing.png",
    metric: "£8,400 → £320",
    metricLabel: "Outstanding invoices",
    problem: "Owner doing invoices every Sunday night — or more often, not doing them at all. £8,400 outstanding at any given time. Materials coming out of his own pocket while customers sat on 30-day invoices.",
    whatWeBuilt: "Automated invoicing pipeline: job marked done, invoice fires within the hour. Reminders at 7, 14, 21 days. Late payment escalation. Payment links in every message.",
    results: [
      "Payment time dropped from 34 days to 6",
      "Outstanding invoices fell from £8,400 to £320",
      "Bought a second van with freed-up cash flow",
      "Took on a fourth team member",
      "Zero manual invoice chasing",
    ],
    system: "Automated invoicing & collections",
  },
  {
    num: "02",
    trade: "Heating Engineer — Leeds",
    client: "Fidelity Heating",
    logo: "/logos/fideley.png",
    metric: "+£16,800",
    metricLabel: "Additional revenue in one winter",
    problem: "Under boilers 10 hours a day, October through March. Missing 60%+ of calls. Half the people who rang had already booked someone else by 7pm.",
    whatWeBuilt: "AI call handler — every call answered, qualified, and triaged. Customer texted within seconds. Booking system for available slots. Emergency routing for after-hours.",
    results: [
      "14 extra jobs per month captured",
      "+£16,800 additional revenue in one winter",
      "Google reviews jumped from 4.2 to 4.8",
      "Zero missed calls during working hours",
      "Didn't work more hours — just stopped losing work",
    ],
    system: "AI call handling & qualification",
  },
  {
    num: "03",
    trade: "Electrician — Manchester",
    client: "SH Sparky",
    logo: "/logos/sh-sparky.png",
    metric: "8hrs → 30min",
    metricLabel: "Weekly admin time",
    problem: "Every Friday was certificates, building control notifications, CIS returns, VAT prep. Missed a notification once and got a warning. Eight hours of admin every week — a full billable day gone.",
    whatWeBuilt: "Full compliance automation. Certificates generated from job data. Building control notifications sent automatically. CIS returns calculated and filed. VAT tracked in real time.",
    results: [
      "Admin dropped from 8 hours to 30 minutes per week",
      "Zero missed notifications in 12 months",
      "Freed-up Friday worth ~£40k/year in billable time",
      "Accountant said records were 'the cleanest I've seen'",
      "Never hired an office manager — didn't need one",
    ],
    system: "Compliance & admin automation",
  },
  {
    num: "04",
    trade: "Builder — Bristol",
    client: "JD Construction Services",
    logo: "/logos/jd.png",
    metric: "8% → 16%",
    metricLabel: "Average job margin",
    problem: "Three concurrent projects, six subbies, everything through WhatsApp. Quoted £22k for a kitchen extension, made £900 because nobody tracked costs. CIS returns consistently late — HMRC had already sent a penalty notice.",
    whatWeBuilt: "Live job costing dashboard — labour, materials, and margin visible in real time. Subcontractor payment tracking with CIS auto-calculation. Monthly returns pre-compiled and filed.",
    results: [
      "Average margin doubled from 8% to 16%",
      "Caught two cost overruns before they became disasters",
      "CIS returns went from panic to automatic",
      "Zero HMRC penalties since go-live",
      "Subbies preferred working with him — clear statements on time",
    ],
    system: "Live job costing & CIS management",
  },
  {
    num: "05",
    trade: "Landscaper — Surrey",
    client: "Green Space Landscaping",
    logo: "/logos/green.png",
    metric: "£3,995/mo",
    metricLabel: "Recurring revenue from zero",
    problem: "£18k summer months swinging to £4k in winter. No maintenance contracts, no recurring revenue. Every January started from zero with an empty calendar and a nervous bank balance.",
    whatWeBuilt: "Maintenance plan engine with automated proposals to 200+ past clients. Seasonal scheduling. Quote automation with multi-step follow-up. Review collection after every job.",
    results: [
      "47 maintenance clients at £85/month",
      "£3,995/month in recurring revenue — from zero",
      "Winter revenue doubled year-on-year",
      "Hired 4th team member in January",
      "Feast-or-famine cycle broken for good",
    ],
    system: "Maintenance plans & seasonal automation",
  },
  // ── Prior client results ──
  {
    num: "06",
    trade: "Roofing Contractor",
    client: "ACE Flat Roofing Ltd",
    logo: "/logos/ace.png",
    metric: "25+ hrs/wk",
    metricLabel: "Hours reclaimed from admin",
    problem: "Running a busy flat roofing operation with admin consuming every evening. Invoicing, follow-ups, chasing quotes — all done manually after a full day on the tools. £2,995 sitting in outstanding invoices at any given time.",
    whatWeBuilt: "End-to-end automation: CRM watches for completed jobs, auto-generates Xero invoices, 48-hour follow-up via SMS and WhatsApp. No new tools, no behaviour change from the team.",
    results: [
      "25+ hours per week reclaimed from admin",
      "£2,995 recovered — £0 outstanding vs £2,995 owed before",
      "Cash flow stabilised",
      "No new tools required — built on existing Xero",
      "Zero team behaviour change needed",
    ],
    system: "Invoice automation & admin systems",
  },
  {
    num: "07",
    trade: "Air Conditioning",
    client: "JSC Air Conditioning",
    logo: "/logos/jsc.jpg",
    metric: "24/7",
    metricLabel: "Lead generation running non-stop",
    problem: "No digital presence generating inbound leads. Relying entirely on word of mouth and repeat clients. Website either didn't exist or wasn't bringing in any work.",
    whatWeBuilt: "End-to-end website built to generate clients around the clock. Designed to capture, qualify, and convert enquiries without JSC needing to lift a finger outside of doing the actual work.",
    results: [
      "Website generating leads 24/7",
      "Enquiries coming in outside business hours",
      "Professional online presence established",
      "Reduced reliance on word-of-mouth alone",
    ],
    system: "Website & lead generation",
  },
  {
    num: "08",
    trade: "Architecture",
    client: "JSA Architects",
    logo: "/logos/jsa.png",
    metric: "Full Digital",
    metricLabel: "Content, SEO & lead gen — fully managed",
    problem: "A premium architecture practice with no consistent online presence and no system for attracting new clients digitally. High brand standards meant nothing generic would work — every piece of content and every page had to reflect the quality of their actual work.",
    whatWeBuilt: "End-to-end digital system: weekly social content researched, written, designed and scheduled. SEO blog articles targeting high-intent local search terms. Local landing pages built for key service areas. The entire pipeline — from content creation to search ranking to lead capture — running without the client touching it.",
    results: [
      "Consistent qualified enquiries coming in from search",
      "SEO blog and landing pages ranking for local terms",
      "Premium weekly social content across platforms",
      "Complete digital lead generation system running autonomously",
    ],
    system: "Content, SEO & lead generation",
  },
  {
    num: "09",
    trade: "Guttering & Home Services",
    client: "Birmingham Gutter Services",
    logo: "/logos/gutter.png",
    metric: "Full-Stack",
    metricLabel: "Website + SEO from scratch",
    problem: "No website, no SEO, no online lead generation at all. All work came through referrals and van signage. Missing out on the entire online search market in Birmingham for gutter and fascia services.",
    whatWeBuilt: "Full-stack website development with SEO implementation. Built from scratch, optimised for local search terms, designed to convert visitors into booked jobs.",
    results: [
      "Professional website live and generating enquiries",
      "Local SEO ranking for Birmingham gutter services",
      "Online lead generation channel established from zero",
      "Reduced dependency on referrals alone",
    ],
    system: "Website development & SEO",
  },
]

export default function ResultsPage() {
  return (
    <HomeClient hideHero>
      {/* Hero */}
      <section
        className="relative z-[3] min-h-[100svh] flex items-center justify-center overflow-hidden"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="absolute inset-0 z-0">
          <img src="/trades/hero-results.jpg" alt="" className="w-full h-full object-cover" style={{ opacity: 0.25 }} />
        </div>
        <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(to top, var(--bg-primary) 0%, rgba(0,0,0,.5) 40%, rgba(0,0,0,.3) 100%)" }} />
        <div className="relative z-[2] max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)] text-center py-[120px]">
          <FadeUp>
            <div className="section-label justify-center mb-4 md:mb-6">
              <span>Results</span>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1
              className="text-[clamp(40px,9vw,120px)] leading-[.92] tracking-[-0.02em] uppercase mb-6 md:mb-8"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
            >
              CLIENT <span style={{ color: "var(--accent-primary)" }}>RESULTS.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p
              className="text-[13px] md:text-[17px] leading-[1.8] max-w-[480px] mx-auto"
              style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}
            >
              Every business on this page had the same problems you do.
              Here&apos;s what their numbers looked like after we got involved.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Case studies */}
      <section
        className="relative z-[2]"
        style={{
          background: "var(--bg-card)",
          padding: "var(--section-pad-y) 0 calc(var(--section-pad-y) + 4vw)",
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)",
        }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">

          {/* Section label */}
          <FadeUp className="mb-8 md:mb-12">
            <div className="section-label">
              <span>Trade Automation</span>
            </div>
            <h2 className="h2">AI SYSTEMS FOR<br />UK TRADES.</h2>
          </FadeUp>

          {/* Trade case studies (1-5) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-16 md:mb-[120px]">
            {caseStudies.slice(0, 5).map((r, i) => (
              <motion.div
                key={r.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
                className={`bg-[var(--bg-elevated)] border border-[var(--border)] p-6 md:p-8 transition-all duration-300 hover:border-[var(--border-accent)] ${i === 4 ? "md:col-span-2 md:max-w-[calc(50%-12px)]" : ""}`}
                style={{ borderRadius: 2 }}
              >
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <div className="flex items-center gap-3">
                    {r.logo && (
                      <img src={r.logo} alt={r.client} className="h-8 md:h-11 w-auto object-contain" />
                    )}
                    <div>
                      <span className="text-[12px] block mb-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)", textTransform: "uppercase" }}>
                        {r.client}
                      </span>
                      <span className="text-[10px] tracking-[.12em] uppercase" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>
                        {r.trade}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] tracking-[.08em] uppercase px-2.5 py-1 border border-[var(--border)] hidden sm:block" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)", borderRadius: 2 }}>
                    {r.system}
                  </span>
                </div>

                <div className="text-[clamp(28px,4vw,48px)] leading-none tracking-[-0.02em] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent-primary)" }}>
                  {r.metric}
                </div>
                <span className="text-[10px] tracking-[.08em] uppercase block mb-5" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)" }}>
                  {r.metricLabel}
                </span>

                <div className="w-full h-px bg-[var(--border)] mb-5" />

                <p className="text-[13px] leading-[1.75] mb-4" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.45)" }}>
                  {r.problem}
                </p>

                <ul className="text-[13px] leading-[1.75] list-none" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
                  {r.results.slice(0, 3).map((result, j) => (
                    <li key={j} className="flex items-start gap-2 mb-0.5">
                      <span style={{ color: "var(--accent-primary)" }}>—</span> {result}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Prior clients section */}
          <FadeUp className="mb-8 md:mb-12">
            <div className="section-label">
              <span>Other Projects</span>
            </div>
            <h2 className="h2">WEBSITES, CONTENT<br />& LEAD GEN.</h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {caseStudies.slice(5).map((r, i) => (
              <motion.div
                key={r.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
                className="bg-[var(--bg-elevated)] border border-[var(--border)] p-6 md:p-8 transition-all duration-300 hover:border-[var(--border-accent)]"
                style={{ borderRadius: 2 }}
              >
                <div className="flex items-center justify-between mb-4 md:mb-5">
                  <div className="flex items-center gap-3">
                    {r.logo && (
                      <img src={r.logo} alt={r.client} className="h-8 md:h-11 w-auto object-contain" />
                    )}
                    <div>
                      <span className="text-[13px] block mb-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)", textTransform: "uppercase" }}>
                        {r.client}
                      </span>
                      <span className="text-[10px] tracking-[.12em] uppercase" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>
                        {r.trade}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] tracking-[.08em] uppercase px-2.5 py-1 border border-[var(--border)] hidden sm:block" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)", borderRadius: 2 }}>
                    {r.system}
                  </span>
                </div>

                <div className="text-[clamp(24px,3.5vw,40px)] leading-none tracking-[-0.02em] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent-primary)" }}>
                  {r.metric}
                </div>
                <span className="text-[10px] tracking-[.08em] uppercase block mb-5" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)" }}>
                  {r.metricLabel}
                </span>

                <div className="w-full h-px bg-[var(--border)] mb-5" />

                <p className="text-[13px] leading-[1.75] mb-4" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.45)" }}>
                  {r.whatWeBuilt}
                </p>

                <ul className="text-[13px] leading-[1.75] list-none" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
                  {r.results.slice(0, 3).map((result, j) => (
                    <li key={j} className="flex items-start gap-2 mb-0.5">
                      <span style={{ color: "var(--accent-primary)" }}>—</span> {result}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative z-[1]"
        style={{
          background: "var(--bg-primary)",
          marginTop: "-4vw",
          paddingTop: "calc(var(--section-pad-y) + 4vw)",
          paddingBottom: "var(--section-pad-y)",
        }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">
          <FadeUp className="flex flex-col items-center text-center">
            <motion.div
              className="w-[60px] h-px mb-8"
              style={{ background: "var(--border-accent)" }}
              animate={{ boxShadow: ["0 0 0px rgba(45,212,191,0)", "0 0 20px rgba(45,212,191,.4)", "0 0 0px rgba(45,212,191,0)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2
              className="text-[clamp(28px,5vw,56px)] leading-[.92] uppercase mb-5 max-w-[600px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
            >
              YOUR TURN.
            </h2>
            <p
              className="text-sm md:text-[15px] leading-[1.75] max-w-[440px] mb-8"
              style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}
            >
              15 minutes. I&apos;ll look at how your business runs and tell you where
              you&apos;re losing time and money. No pitch.
            </p>
            <Link href="/audit" className="btn-primary text-[13px] md:text-[15px] px-8 md:px-12 py-4 md:py-[18px]">
              GET YOUR FREE AUDIT <span className="arrow"><ArrowIcon /></span>
            </Link>
          </FadeUp>
        </div>
      </section>
    </HomeClient>
  )
}
