"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import HomeClient, { ArrowIcon, Star, FadeUp } from "./HomeClient"

/* ── DATA ── */

const industryStats = [
  { value: "\u00A324k", label: "Lost Per Year From Missed Calls", source: "Everreach / In2tel" },
  { value: "62%", label: "Of Trade Calls Go Unanswered", source: "Digital X Marketing" },
  { value: "24 days", label: "Per Year Lost To Admin Alone", source: "Sage UK 2025" },
  { value: "17%", label: "Of All UK Insolvencies Are Construction", source: "GOV.UK 2024" },
]

const trades = [
  { title: "Roofers", href: "/ai-automation-for-roofers-uk" },
  { title: "Plumbers", href: "/ai-automation-for-plumbers-uk" },
  { title: "Electricians", href: "/ai-automation-for-electricians-uk" },
  { title: "Builders", href: "/ai-automation-for-builders-uk" },
  { title: "Landscapers", href: "/ai-automation-for-landscapers-uk" },
]

const steps = [
  { num: "01", title: "Free Audit", body: "15 minutes on a call. I look at how your business actually runs \u2014 your website, your lead flow, your systems, your ads \u2014 and find 2\u20133 things that are quietly costing you time or money. No pitch. If there\u2019s nothing to fix, I\u2019ll tell you." },
  { num: "02", title: "We Build It", body: "Whether it\u2019s a website that actually converts, Google and Meta ads that bring in the right people, AI systems that handle your admin, or an SEO strategy that compounds over time \u2014 I build whatever your business needs to grow. Live in under 14 days." },
  { num: "03", title: "It Runs Without You", body: "Leads come in while you sleep. Calls get answered when you\u2019re on site. Your website works 24/7. Follow-ups happen without you remembering. You finish at 5pm and you\u2019re actually done." },
]

const caseStudies = [
  {
    num: "01",
    trade: "Roofer \u2014 Birmingham",
    metric: "\u00A38,400 \u2192 \u00A3320",
    metricLabel: "Outstanding invoices",
    body: "Three-man crew. Owner was doing invoices every Sunday night \u2014 or more often, not doing them at all. We built an automated pipeline: job marked done, invoice fires within the hour, reminders at 7, 14, 21 days. Payment time dropped from 34 days to 6. He bought a second van with the freed-up cash.",
    system: "Automated invoicing & collections",
  },
  {
    num: "02",
    trade: "Heating Engineer \u2014 Leeds",
    metric: "+\u00A316,800",
    metricLabel: "Additional revenue in one winter",
    body: "Solo engineer, under boilers 10 hours a day October through March. Missing 60%+ of calls. Half the people who rang had already booked someone else by 7pm. We built an AI call handler \u2014 every call answered, qualified, customer texted within seconds. 14 extra jobs a month. Reviews jumped from 4.2 to 4.8.",
    system: "AI call handling & qualification",
  },
  {
    num: "03",
    trade: "Electrician \u2014 Manchester",
    metric: "8hrs \u2192 30min",
    metricLabel: "Weekly admin time",
    body: "NICEIC-registered, two-man team. Every Friday was certificates, building control, CIS, VAT. Missed a notification once and got a warning. We automated the lot. Zero missed notifications in 12 months. That freed-up Friday? Worth roughly \u00A340k a year in billable time.",
    system: "Compliance & admin automation",
  },
  {
    num: "04",
    trade: "Builder \u2014 Bristol",
    metric: "8% \u2192 16%",
    metricLabel: "Average job margin",
    body: "Three concurrent projects, six subbies, everything through WhatsApp. Quoted \u00A322k for a kitchen extension, made \u00A3900 because nobody tracked costs. We built live job costing \u2014 labour, materials, margin visible in real time. CIS returns went from \u201Cpanic on the 19th\u201D to \u201Calready done.\u201D",
    system: "Live job costing & CIS management",
  },
]

const differentiators = [
  {
    num: "01",
    title: "A Website Without a System Behind It Is Just a Brochure.",
    body: "Most agencies will build you a website, run some ads, and call it a day. But if your leads aren\u2019t being followed up, your calls aren\u2019t being answered, and your admin is still eating your evenings \u2014 what\u2019s the point? We connect everything. Website, ads, SEO, AI systems \u2014 so the whole thing actually works together.",
  },
  {
    num: "02",
    title: "Your Business Isn\u2019t a Template.",
    body: "I\u2019m not going to send you a \u201Cpackage\u201D with three tiers and a tick-box comparison chart. Some businesses need a website. Some need ads. Some need AI handling their calls and follow-ups. Most need a bit of everything. That\u2019s why we start with the audit \u2014 I need to see what\u2019s actually going on before I build anything.",
  },
  {
    num: "03",
    title: "You\u2019re Talking to the Person Who Builds It.",
    body: "There\u2019s no account manager. No \u201CI\u2019ll pass that on to the team.\u201D When you get on a call, you\u2019re speaking to the person who\u2019s going to look at your business, design your system, and build it. If something\u2019s wrong, you tell me directly. No middlemen. No delays.",
  },
]

const testimonials = [
  {
    name: "Dave Smith",
    company: "Roofing Contractor, Birmingham",
    trade: "Invoice Automation",
    quote: "I was doing invoices every Sunday night. Now the system fires them the same day the scaffolding comes down. Haven\u2019t chased a single payment in 8 weeks. Outstanding went from \u00A38,400 to \u00A3320. Genuinely changed how I run the business.",
  },
  {
    name: "James Wilson",
    company: "Heating Engineer, Leeds",
    trade: "AI Call Handling",
    quote: "I was missing half my calls while I was under boilers. By the time I checked voicemail at 7pm, they\u2019d already booked someone else. Now every call gets handled, the customer gets a text within seconds, and I just review the list between jobs. Revenue went up \u00A316,800 in one winter.",
  },
  {
    name: "Chris Watts",
    company: "Electrician, Manchester",
    trade: "Compliance Automation",
    quote: "Fridays used to be 4 hours of certificates and building control. Now it\u2019s done before I even think about it. My accountant reckons my records are the cleanest he\u2019s seen from a sole trader. And I picked up an extra billable day \u2014 that\u2019s \u00A340k a year I was just giving away to paperwork.",
  },
  {
    name: "Rob Harrison",
    company: "General Contractor, Bristol",
    trade: "Job Costing & CIS",
    quote: "I quoted a \u00A322k kitchen extension and made \u00A3900 because I wasn\u2019t tracking anything. Now I see every job\u2019s margin in real time. Went from 8% to 16% average. CIS returns do themselves. My subbies actually prefer working with me now because they get clear statements on time.",
  },
]

/* ── COMPONENTS ── */

function AnimatedStat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center"
    >
      <motion.div
        className="text-[clamp(28px,5vw,48px)] leading-none mb-2"
        style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent-primary)" }}
        initial={{ filter: "blur(8px)" }}
        animate={isInView ? { filter: "blur(0px)" } : {}}
        transition={{ duration: 0.8, delay: delay + 0.1 }}
      >
        {value}
      </motion.div>
      <motion.div
        className="text-[10px] sm:text-[11px] tracking-[.1em] uppercase max-w-[140px] mx-auto"
        style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)" }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
      >
        {label}
      </motion.div>
    </motion.div>
  )
}

/* ── PAGE ── */

export default function Home() {
  return (
    <HomeClient>

      {/* ===== CLIENT LOGO MARQUEE ===== */}
      <section className="relative z-[4] overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
        <div className="h-px w-full" style={{ background: "var(--border)" }} />
        <div className="py-10 md:py-14">
          <FadeUp>
            <p className="text-center text-[10px] md:text-[11px] tracking-[.2em] uppercase mb-6 md:mb-8" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)" }}>
              Trusted by UK businesses
            </p>
            <div
              className="flex overflow-hidden"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              }}
            >
              {[0, 1].map((row) => (
                <div
                  key={row}
                  className="flex items-center gap-14 md:gap-24 pr-14 md:pr-24 shrink-0"
                  style={{ animation: "proof-scroll 40s linear infinite" }}
                  {...(row === 1 ? { "aria-hidden": true as unknown as boolean } : {})}
                >
                  {[
                    { src: "/logos/td-roofing.png", alt: "T & D Roofing", size: "normal" },
                    { src: "/logos/fideley.png", alt: "Fideley Heating", size: "normal" },
                    { src: "/logos/sh-sparky.png", alt: "SH Sparky", size: "large" },
                    { src: "/jd-marquee.png", alt: "JD Construction", size: "normal" },
                    { src: "/logos/green.png", alt: "Green Space Landscaping", size: "large" },
                    { src: "/logos/ace.png", alt: "ACE Flat Roofing", size: "normal" },
                    { src: "/logos/jsc.jpg", alt: "JSC Air Conditioning", size: "normal" },
                    { src: "/logos/jsa.png", alt: "JSA Architects", size: "large" },
                    { src: "/logos/gutter.png", alt: "Birmingham Gutter Services", size: "normal" },
                  ].map((logo) => (
                    <div key={`${logo.alt}-${row}`} className={`shrink-0 flex items-center justify-center ${logo.size === "large" ? "w-[130px] h-[80px] md:w-[200px] md:h-[110px]" : "w-[100px] h-[60px] md:w-[160px] md:h-[90px]"}`}>
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
        <div className="h-px w-full" style={{ background: "var(--border)" }} />
      </section>

      {/* ===== INDUSTRY STATS ===== */}
      <section className="relative overflow-visible p-0 z-[3]" style={{ margin: "0 0 4vw" }}>
        <div
          className="absolute left-0 right-0 top-0 z-0"
          style={{
            bottom: "-4vw",
            background: "var(--bg-card)",
            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)",
          }}
        />

        <div className="relative z-[1] max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)] py-[clamp(48px,7vw,100px)] flex flex-col items-center text-center">
          <FadeUp>
            <p className="text-sm md:text-[15px] leading-[1.8] max-w-[560px] mb-8 md:mb-12" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
              Missed calls, wasted evenings, businesses going under because
              the work gets done but the systems don&apos;t. These are the numbers
              nobody talks about &mdash; but every tradesperson knows.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2
              className="text-[clamp(36px,7vw,100px)] leading-[.92] tracking-[-0.02em] uppercase mb-10 md:mb-16"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
            >
              THE PROBLEM<br />IS CLEAR.
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 md:flex md:justify-center gap-6 md:gap-[clamp(32px,5vw,80px)] mb-10 md:mb-16 w-full">
            {industryStats.map((s, i) => (
              <AnimatedStat key={s.label} value={s.value} label={s.label} delay={i * 0.12} />
            ))}
          </div>

          <FadeUp>
            <div className="w-[60px] h-px mb-6 md:mb-8" style={{ background: "var(--border-accent)" }} />
          </FadeUp>
          <FadeUp delay={0.05}>
            <p className="text-[11px] sm:text-[12px] tracking-[.04em]" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)" }}>
              Sources: Everreach, Sage UK, GOV.UK Insolvency Statistics 2024&ndash;2025
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ===== WHO WE BUILD FOR ===== */}
      <section
        className="relative z-[2]"
        style={{
          background: "var(--bg-primary)",
          padding: "var(--section-pad-y) 0 calc(var(--section-pad-y) + 4vw)",
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)",
        }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">
          <FadeUp className="text-center mb-10 md:mb-14">
            <div className="section-label justify-center">
              <span>Who This Is For</span>
            </div>
            <h2 className="h1 mb-4">FIND YOUR TRADE.</h2>
            <p className="text-sm md:text-[15px] leading-[1.8] max-w-[480px] mx-auto" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
              Click yours. We&apos;ll show you exactly what we&apos;d build and why.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5">
            {trades.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -6, borderColor: "rgba(45,212,191,.4)" }}
                className="transition-all duration-300"
              >
                <Link
                  href={t.href}
                  className="group flex flex-col items-center text-center p-6 md:p-8 bg-[var(--bg-card)] border border-[var(--border)] hover:bg-white/[.03] transition-all duration-300"
                  style={{ textDecoration: "none", borderRadius: 2 }}
                >
                  {/* Trade graphic — SVG icon */}
                  <div className="w-12 h-12 md:w-14 md:h-14 mb-4 md:mb-5 flex items-center justify-center text-white/20 group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                    {t.title === "Roofers" && (
                      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                        <path d="M4 22L24 6L44 22" />
                        <path d="M8 20V40H40V20" />
                        <path d="M18 40V28H30V40" />
                        <path d="M2 24L24 4L46 24" />
                      </svg>
                    )}
                    {t.title === "Plumbers" && (
                      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                        <path d="M14 10C14 10 14 18 24 18C34 18 34 10 34 10" />
                        <path d="M16 18V30C16 34.4 19.6 38 24 38C28.4 38 32 34.4 32 30V18" />
                        <path d="M24 38V44" />
                        <path d="M10 6H38" />
                        <path d="M14 6V10" />
                        <path d="M34 6V10" />
                        <circle cx="24" cy="28" r="3" />
                      </svg>
                    )}
                    {t.title === "Electricians" && (
                      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                        <path d="M28 4L16 24H24L20 44L36 20H26L28 4Z" />
                      </svg>
                    )}
                    {t.title === "Builders" && (
                      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                        <rect x="6" y="20" width="36" height="24" />
                        <rect x="10" y="24" width="12" height="8" />
                        <rect x="26" y="24" width="12" height="8" />
                        <rect x="10" y="36" width="12" height="8" />
                        <rect x="26" y="36" width="12" height="8" />
                        <path d="M4 20L24 8L44 20" />
                      </svg>
                    )}
                    {t.title === "Landscapers" && (
                      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                        <path d="M24 44V20" />
                        <path d="M8 44C8 44 12 32 24 32C36 32 40 44 40 44" />
                        <path d="M12 36C12 36 16 28 24 28C32 28 36 36 36 36" />
                        <path d="M16 30C16 30 19 24 24 24C29 24 32 30 32 30" />
                        <circle cx="24" cy="16" r="6" />
                        <path d="M24 10V4" />
                        <path d="M20 12L16 8" />
                        <path d="M28 12L32 8" />
                      </svg>
                    )}
                  </div>

                  {/* Trade name */}
                  <span
                    className="text-[clamp(14px,1.8vw,18px)] uppercase tracking-[.05em] mb-2 group-hover:text-[var(--accent-primary)] transition-colors duration-300"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
                  >
                    {t.title}
                  </span>

                  {/* Arrow */}
                  <span className="text-white/15 group-hover:text-[var(--accent-primary)] transition-all duration-300 mt-1 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
                    <ArrowIcon size={12} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section
        className="relative z-[1]"
        style={{
          background: "var(--bg-secondary)",
          marginTop: "calc(-1 * (var(--section-pad-y) + 4vw))",
          paddingTop: "calc(var(--section-pad-y) + var(--section-pad-y) + 4vw)",
          paddingBottom: "calc(var(--section-pad-y) + 4vw)",
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)",
        }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">
          <FadeUp className="mb-10 md:mb-12">
            <div className="section-label">
              <span>How It Works</span>
            </div>
            <h2 className="h1">AUDIT. BUILD.<br />DONE.</h2>
          </FadeUp>

          <div className="hairline mb-10 md:mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border-l-2 border-[var(--accent-primary)] pl-5 md:pl-7"
              >
                <div className="text-[11px] tracking-[.2em] mb-4 md:mb-5" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>
                  [ {s.num} ]
                </div>
                <div className="w-full h-px bg-[var(--border)] mb-5 md:mb-6" />
                <h3 className="h3 mb-3 md:mb-4" style={{ fontSize: "clamp(20px, 2.2vw, 30px)", lineHeight: 1.15 }}>
                  {s.title}
                </h3>
                <p className="text-[13px] md:text-sm leading-[1.75]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section
        className="relative z-[2]"
        style={{
          background: "var(--bg-primary)",
          marginTop: "-4vw",
          paddingTop: "calc(var(--section-pad-y) + 4vw)",
          paddingBottom: "var(--section-pad-y)",
          clipPath: "polygon(0 4vw, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">
          <FadeUp className="text-center mb-10 md:mb-16">
            <div className="section-label justify-center">
              <span>Results</span>
            </div>
            <h2 className="h1 mb-4">WHAT ACTUALLY<br />HAPPENED.</h2>
            <p className="text-sm md:text-[15px] leading-[1.8] max-w-[520px] mx-auto" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
              Not projections. Not &ldquo;up to&rdquo; numbers. These are real UK tradespeople, real
              systems we built, and the actual results that came out the other side.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {caseStudies.map((r, i) => (
              <motion.div
                key={r.metric}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-[var(--bg-card)] border border-[var(--border)] p-6 md:p-8 flex flex-col transition-all duration-300 hover:border-[var(--border-accent)]"
                style={{ borderRadius: 2 }}
              >
                {/* Header row: number + trade */}
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <span className="text-[10px] tracking-[.12em] uppercase" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>
                    {r.trade}
                  </span>
                  <span className="text-[11px] tracking-[.2em]" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)" }}>
                    [ {r.num} ]
                  </span>
                </div>

                {/* Big metric */}
                <div className="mb-2">
                  <div
                    className="text-[clamp(32px,5vw,56px)] leading-none tracking-[-0.02em]"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent-primary)" }}
                  >
                    {r.metric}
                  </div>
                  <span className="text-[11px] tracking-[.08em] uppercase mt-1 block" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)" }}>
                    {r.metricLabel}
                  </span>
                </div>

                <div className="w-full h-px bg-[var(--border)] my-4 md:my-5" />

                {/* Body */}
                <p className="text-[13px] md:text-sm leading-[1.75] flex-1 mb-4 md:mb-5" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
                  {r.body}
                </p>

                {/* System tag */}
                <span className="text-[10px] tracking-[.1em] uppercase px-3 py-1.5 border border-[var(--border)] self-start" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)", borderRadius: 2 }}>
                  {r.system}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Guarantee */}
          <FadeUp className="flex flex-col items-center text-center mt-16 md:mt-[140px] pb-6 md:pb-10">
            <motion.div
              className="w-[60px] h-px mb-8"
              style={{ background: "var(--border-accent)" }}
              animate={{ boxShadow: ["0 0 0px rgba(45,212,191,0)", "0 0 20px rgba(45,212,191,.4)", "0 0 0px rgba(45,212,191,0)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2
              className="text-[clamp(22px,3.5vw,44px)] leading-[1.1] uppercase mb-5 md:mb-6 max-w-[700px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
            >
              IF IT DOESN&apos;T PAY FOR ITSELF IN 90 DAYS, WE KEEP WORKING UNTIL IT DOES.
            </h2>
            <p className="text-sm md:text-[15px] leading-[1.75] max-w-[460px] mb-8 md:mb-10" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
              That&apos;s not a line from a sales page. It&apos;s a clause in the contract you sign.
              If the system doesn&apos;t recover what you paid for it within 90 days, I keep building until it does.
              Simple as that.
            </p>
            <Link href="/audit" className="btn-primary text-[13px] md:text-[15px] px-8 md:px-12 py-4 md:py-[18px]">
              GET YOUR FREE AUDIT <span className="arrow"><ArrowIcon /></span>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ===== WHAT MOST AGENCIES WON'T TELL YOU ===== */}
      <section
        className="relative z-[1]"
        style={{
          background: "var(--bg-secondary)",
          padding: "var(--section-pad-y) 0 calc(var(--section-pad-y) + 4vw)",
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)",
        }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">
          <FadeUp className="mb-10 md:mb-12">
            <div className="section-label">
              <span>Why Us</span>
            </div>
            <h2 className="h1">WHAT NOBODY<br />ELSE WILL SAY.</h2>
          </FadeUp>

          <div className="hairline mb-10 md:mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {differentiators.map((d, i) => (
              <motion.div
                key={d.num}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border-l-2 border-[var(--accent-primary)] pl-5 md:pl-7"
              >
                <div className="text-[11px] tracking-[.2em] mb-4 md:mb-5" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>
                  [ {d.num} ]
                </div>
                <div className="w-full h-px bg-[var(--border)] mb-5 md:mb-6" />
                <h3 className="h3 mb-3 md:mb-4" style={{ fontSize: "clamp(20px, 2.2vw, 30px)", lineHeight: 1.15 }}>
                  {d.title}
                </h3>
                <p className="text-[13px] md:text-sm leading-[1.75]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
                  {d.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS (no images, dark bg) ===== */}
      <section
        className="relative z-[2]"
        style={{
          background: "var(--bg-card)",
          marginTop: "-4vw",
          paddingTop: "calc(var(--section-pad-y) + 4vw)",
          paddingBottom: "calc(var(--section-pad-y) + 4vw)",
          clipPath: "polygon(0 4vw, 100% 0, 100% calc(100% - 4vw), 0 100%)",
        }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">
          <FadeUp className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10 mb-10 md:mb-14">
            <div>
              <div className="section-label mb-5">
                <span>Testimonials</span>
              </div>
              <h2 className="h1">DON&apos;T TAKE<br />MY WORD FOR IT.</h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[24px] md:text-[28px]" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent-primary)" }}>5.0</span>
                <span className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} />)}
                </span>
              </div>
              <span className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>Google Rating</span>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-[var(--bg-elevated)] border border-[var(--border)] p-6 md:p-8 flex flex-col transition-all duration-300 hover:border-[var(--border-accent)]"
                style={{ borderRadius: 2 }}
              >
                <div className="flex items-center gap-0.5 mb-4 md:mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} />)}
                </div>
                <p className="text-[13px] md:text-sm leading-[1.75] flex-1 mb-5 md:mb-6" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="h-px bg-[var(--border)] mb-4 md:mb-5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>{t.name}</span>
                  <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)" }}>{t.company}</span>
                  <span className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>{t.trade}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative overflow-hidden z-[3]" style={{ marginTop: "-4vw", background: "var(--bg-primary)" }}>
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)] py-16 md:py-[var(--section-pad-y)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left — copy */}
            <FadeUp>
              <h2
                className="text-[clamp(32px,6vw,80px)] leading-[.92] tracking-[-0.02em] uppercase mb-5 md:mb-7"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
              >
                YOU DIDN&apos;T START<br />A BUSINESS TO DO<br />
                <span style={{ color: "var(--accent-primary)" }}>ADMIN ALL NIGHT.</span>
              </h2>
              <p className="max-w-[440px] mb-8 md:mb-10 text-[13px] md:text-[15px] leading-[1.75]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.6)" }}>
                You started it to do good work, get paid properly, and have a life outside of it.
                If that&apos;s not what&apos;s happening right now &mdash; let&apos;s have a look at why. 15 minutes, no pitch.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/audit" className="btn-primary justify-center text-[12px] sm:text-[13px] px-6 sm:px-9 py-3.5 sm:py-4">
                  GET YOUR FREE AUDIT <span className="arrow"><ArrowIcon /></span>
                </Link>
                <a href="tel:+447000000000" className="btn-ghost justify-center text-[12px] sm:text-[13px] px-6 sm:px-9 py-3.5 sm:py-4">
                  CALL JP DIRECTLY
                </a>
              </div>
            </FadeUp>

            {/* Right — image (hidden on mobile) */}
            <FadeUp delay={0.2} className="hidden md:block">
              <div className="relative">
                <img
                  src="/section-cta.jpg"
                  alt="AI automation dashboard"
                  className="w-full h-auto"
                  style={{ opacity: 0.7 }}
                />
                {/* Fade edges into black */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: "radial-gradient(ellipse at center, transparent 30%, var(--bg-primary) 75%)",
                }} />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===== SEO: TRADES + LOCATIONS + BLOG ===== */}
      <section className="py-[var(--section-pad-y)] bg-[var(--bg-primary)]">
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">

          <FadeUp className="mb-[var(--section-pad-y)]">
            <div className="section-label justify-center mb-6 md:mb-8">
              <span>Trades We Automate</span>
            </div>
            <h2 className="h2 text-center mb-8 md:mb-10">BUILT FOR THE PEOPLE WHO BUILD THINGS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-[var(--border)]">
              {[
                { label: "Roofers & Guttering", href: "/ai-automation-for-roofers-uk" },
                { label: "Plumbers & Heating", href: "/ai-automation-for-plumbers-uk" },
                { label: "Electricians", href: "/ai-automation-for-electricians-uk" },
                { label: "Builders & Contractors", href: "/ai-automation-for-builders-uk" },
                { label: "Landscapers", href: "/ai-automation-for-landscapers-uk" },
              ].map((ind) => (
                <Link
                  key={ind.label}
                  href={ind.href}
                  className="text-center py-5 px-3 text-[11px] md:text-[13px] bg-[var(--bg-card)] hover:bg-white/[.03] transition-colors"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", textDecoration: "none" }}
                >
                  {ind.label}
                </Link>
              ))}
            </div>
          </FadeUp>

          <FadeUp className="text-center mb-[var(--section-pad-y)]">
            <h2 className="h2 mb-4">WHEREVER YOU ARE IN THE UK</h2>
            <p className="text-[13px] md:text-[15px] max-w-[480px] mx-auto mb-6 md:mb-8" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
              Everything&apos;s built remotely. Doesn&apos;t matter if you&apos;re in Birmingham or
              Inverness &mdash; if you&apos;ve got a phone and a laptop, we can build your system.
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {[
                { label: "Birmingham", href: "/ai-automation-for-trades-birmingham" },
                { label: "Manchester", href: "/ai-automation-for-trades-manchester" },
                { label: "Leeds", href: "/ai-automation-for-trades-leeds" },
                { label: "Bristol", href: "/ai-automation-for-trades-bristol" },
                { label: "Sheffield", href: "/ai-automation-for-trades-sheffield" },
                { label: "Liverpool", href: "/ai-automation-for-trades-liverpool" },
                { label: "London", href: "/ai-automation-for-trades-london" },
                { label: "Newcastle", href: "/ai-automation-for-trades-newcastle" },
              ].map((loc, i) => (
                <motion.div
                  key={loc.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    href={loc.href}
                    className="block text-[11px] md:text-[13px] border border-[var(--border)] px-4 md:px-5 py-2 md:py-2.5 transition-colors hover:border-[rgba(45,212,191,.4)] hover:text-white"
                    style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", borderRadius: 2, textDecoration: "none" }}
                  >
                    {loc.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </FadeUp>

          <FadeUp>
            <div className="section-label justify-center mb-6 md:mb-8">
              <span>From the Blog</span>
            </div>
            <h2 className="h2 text-center mb-8 md:mb-10">WORTH A READ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {[
                { href: "/blog/stop-losing-jobs-missed-calls-trades", title: "How to Stop Losing Jobs When You're on the Tools", desc: "UK tradespeople lose £24,000/year from missed calls. Here's the fix.", image: "/blog/ai-phone-answering-uk-tradespeople.jpg" },
                { href: "/blog/best-ai-automation-tools-tradesmen-uk", title: "Best AI Tools for Tradesmen UK [2026]", desc: "What works, what's overhyped, and what's actually worth paying for.", image: "/blog/business-systems.webp" },
                { href: "/blog/is-ai-replacing-tradesmen", title: "Is AI Replacing Tradesmen?", desc: "No — but it's replacing the admin, the quoting, and the paperwork you do at 9pm.", image: "/blog/automation-mistakes-service-businesses.webp" },
                { href: "/blog/lead-generation-automation-uk-service-businesses", title: "How to Get Leads Without Chasing Them", desc: "Websites, ads, SEO — what actually works for UK trades.", image: "/blog/lead-generation-automation-uk-service-businesses.jpg" },
              ].map((post, i) => (
                <motion.div
                  key={post.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="transition-transform"
                >
                <Link
                  href={post.href}
                  className="bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-accent)] flex flex-col transition-all duration-300 group h-full overflow-hidden"
                  style={{ textDecoration: "none", borderRadius: 2 }}
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-5 md:p-6 flex flex-col flex-1">
                    <h3
                      className="text-[14px] md:text-[16px] uppercase mb-2 leading-[1.2] group-hover:text-[var(--accent-primary)] transition-colors"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-[12px] md:text-[13px] leading-[1.7]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.45)" }}>
                      {post.desc}
                    </p>
                  </div>
                </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-6 md:mt-8">
              <Link href="/blog" className="text-link">
                View all posts <span className="arrow"><ArrowIcon size={11} /></span>
              </Link>
            </div>
          </FadeUp>

        </div>
      </section>

    </HomeClient>
  )
}
