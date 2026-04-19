"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import HomeClient, { ArrowIcon, Star, FadeUp } from "../HomeClient"

interface CaseStudy {
  client: string
  problem: string
  whatWeBuilt: string
  results: string[]
  metric: string
  metricLabel: string
  system: string
}

interface FAQ {
  q: string
  a: string
}

interface TradePageProps {
  trade: string
  headline: string
  subhead: string
  heroImage?: string
  painPoints: { title: string; stat: string; body: string }[]
  systems: { title: string; body: string }[]
  caseStudy: CaseStudy
  faqs: FAQ[]
  relatedTrades: { label: string; href: string }[]
  relatedPosts?: { title: string; href: string; description: string }[]
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="border-b border-[var(--border)] py-6 md:py-7"
    >
      <h3
        className="text-[clamp(15px,1.6vw,18px)] mb-3"
        style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)", textTransform: "uppercase" }}
      >
        {q}
      </h3>
      <p className="text-[13px] md:text-sm leading-[1.75]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
        {a}
      </p>
    </motion.div>
  )
}

export default function TradeLandingPage({
  trade, headline, subhead, heroImage, painPoints, systems, caseStudy, faqs, relatedTrades, relatedPosts,
}: TradePageProps) {
  // FAQ Schema for rich results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  }

  return (
    <HomeClient hideHero>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ===== HERO ===== */}
      <section
        className="relative overflow-visible p-0 z-[3] min-h-[100svh] flex items-end"
        style={{ margin: "0 0 4vw" }}
      >
        <div
          className="absolute left-0 right-0 top-0 z-0"
          style={{
            bottom: "-4vw",
            background: "var(--bg-card)",
            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)",
          }}
        />

        {/* Hero image */}
        {heroImage && (
          <>
            <div className="absolute left-0 right-0 top-0 z-[1] overflow-hidden" style={{ bottom: "-4vw", clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)" }}>
              <Image src={heroImage} alt={`AI Automation for ${trade}`} fill className="object-cover" style={{ opacity: 0.35 }} priority />
            </div>
            <div className="absolute left-0 right-0 top-0 z-[2]" style={{ bottom: "-4vw", background: "linear-gradient(to top, rgba(17,17,17,.95) 0%, rgba(17,17,17,.6) 40%, rgba(17,17,17,.3) 70%, rgba(17,17,17,.5) 100%)" }} />
          </>
        )}

        <div className="relative z-[3] w-full max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)] pb-[clamp(60px,10vw,120px)] pt-[120px]">
          <FadeUp>
            <div className="section-label mb-4 md:mb-6">
              <span>Websites, Lead Gen &amp; AI Systems for {trade}</span>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1
              className="text-[clamp(36px,7vw,96px)] leading-[.92] tracking-[-0.02em] uppercase mb-5 md:mb-7"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
            >
              {headline}
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-sm md:text-[17px] leading-[1.75] max-w-[600px] mb-8 md:mb-10" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
              {subhead}
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/audit" className="btn-primary justify-center text-[12px] sm:text-[13px] px-6 sm:px-9 py-3.5 sm:py-4">
                GET YOUR FREE AUDIT <span className="arrow"><ArrowIcon /></span>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== PAIN POINTS ===== */}
      <section
        className="relative z-[2]"
        style={{
          background: "var(--bg-primary)",
          padding: "var(--section-pad-y) 0 calc(var(--section-pad-y) + 4vw)",
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)",
        }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">
          <FadeUp className="mb-10 md:mb-14">
            <div className="section-label">
              <span>Sound Familiar?</span>
            </div>
            <h2 className="h1">THIS IS WHERE<br />YOU ARE NOW.</h2>
          </FadeUp>

          <div className="hairline mb-10 md:mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {painPoints.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border-l-2 border-[var(--accent-primary)] pl-5 md:pl-7"
              >
                <div className="text-[clamp(24px,4vw,40px)] leading-none mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent-primary)" }}>
                  {p.stat}
                </div>
                <div className="w-full h-px bg-[var(--border)] mb-4 md:mb-5" />
                <h3 className="h3 mb-3" style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.15 }}>
                  {p.title}
                </h3>
                <p className="text-[13px] md:text-sm leading-[1.75]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT WE BUILD ===== */}
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
              <span>Where You Could Be</span>
            </div>
            <h2 className="h1">THIS IS WHAT<br />CHANGES.</h2>
            <p className="text-sm md:text-[15px] leading-[1.8] max-w-[520px] mt-4" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
              Through a combination of websites, Google &amp; Meta ads, SEO, and AI
              infrastructure &mdash; built around how your business actually works.
            </p>
          </FadeUp>

          <div className="hairline mb-10 md:mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {systems.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-[var(--bg-card)] border border-[var(--border)] p-6 md:p-8 hover:border-[var(--border-accent)] transition-all duration-300"
                style={{ borderRadius: 2 }}
              >
                <div className="text-[11px] tracking-[.2em] mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>
                  [ 0{i + 1} ]
                </div>
                <h3 className="h3 mb-3" style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.15 }}>
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

      {/* ===== CASE STUDY ===== */}
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
          <FadeUp className="mb-10 md:mb-14">
            <div className="section-label">
              <span>Proof It Works</span>
            </div>
            <h2 className="h1">SOMEONE LIKE YOU<br />ALREADY DID THIS.</h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 md:p-10" style={{ borderRadius: 2 }}>
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] tracking-[.12em] uppercase" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>
                  {caseStudy.client}
                </span>
                <span className="text-[10px] tracking-[.1em] uppercase px-3 py-1.5 border border-[var(--border)]" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)", borderRadius: 2 }}>
                  {caseStudy.system}
                </span>
              </div>

              <div className="text-[clamp(32px,5vw,56px)] leading-none tracking-[-0.02em] mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent-primary)" }}>
                {caseStudy.metric}
              </div>
              <span className="text-[11px] tracking-[.08em] uppercase block mb-6" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)" }}>
                {caseStudy.metricLabel}
              </span>

              <div className="w-full h-px bg-[var(--border)] mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6">
                <div>
                  <h4 className="text-[11px] tracking-[.15em] uppercase mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>Problem</h4>
                  <p className="text-[13px] leading-[1.75]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>{caseStudy.problem}</p>
                </div>
                <div>
                  <h4 className="text-[11px] tracking-[.15em] uppercase mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>What We Built</h4>
                  <p className="text-[13px] leading-[1.75]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>{caseStudy.whatWeBuilt}</p>
                </div>
                <div>
                  <h4 className="text-[11px] tracking-[.15em] uppercase mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>Results</h4>
                  <ul className="text-[13px] leading-[1.75] list-none" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
                    {caseStudy.results.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 mb-1">
                        <span style={{ color: "var(--accent-primary)" }}>—</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Guarantee + CTA */}
          <FadeUp className="flex flex-col items-center text-center mt-16 md:mt-[100px]">
            <motion.div
              className="w-[60px] h-px mb-8"
              style={{ background: "var(--border-accent)" }}
              animate={{ boxShadow: ["0 0 0px rgba(45,212,191,0)", "0 0 20px rgba(45,212,191,.4)", "0 0 0px rgba(45,212,191,0)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2
              className="text-[clamp(20px,3vw,36px)] leading-[1.1] uppercase mb-5 max-w-[600px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
            >
              90-DAY ROI GUARANTEE. IN THE CONTRACT.
            </h2>
            <p className="text-sm md:text-[15px] leading-[1.75] max-w-[440px] mb-8" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
              If it doesn&apos;t pay for itself, I keep building until it does. That&apos;s not a marketing line.
            </p>
            <Link href="/audit" className="btn-primary text-[13px] md:text-[15px] px-8 md:px-12 py-4 md:py-[18px]">
              GET YOUR FREE AUDIT <span className="arrow"><ArrowIcon /></span>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ===== FAQ ===== */}
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
              <span>FAQ</span>
            </div>
            <h2 className="h1">COMMON<br />QUESTIONS.</h2>
          </FadeUp>

          <div className="max-w-[800px]">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FROM THE BLOG ===== */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-[var(--section-pad-y)] bg-[var(--bg-secondary)]" style={{ marginTop: "-4vw", paddingTop: "calc(var(--section-pad-y) + 4vw)", paddingBottom: "calc(var(--section-pad-y) + 4vw)", clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)" }}>
          <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">
            <FadeUp className="mb-10 md:mb-12">
              <div className="section-label"><span>From the Blog</span></div>
              <h2 className="h1">READ MORE.</h2>
            </FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {relatedPosts.map((post, i) => (
                <motion.div
                  key={post.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link
                    href={post.href}
                    className="block bg-[var(--bg-card)] border border-[var(--border)] p-6 md:p-8 hover:border-[var(--border-accent)] transition-all duration-300 h-full"
                    style={{ borderRadius: 2, textDecoration: "none" }}
                  >
                    <p className="text-[11px] tracking-[.2em] mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>[ BLOG ]</p>
                    <h3 className="text-[clamp(15px,1.5vw,18px)] leading-[1.3] mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)", textTransform: "uppercase" }}>
                      {post.title}
                    </h3>
                    <p className="text-[13px] leading-[1.7]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.45)" }}>
                      {post.description}
                    </p>
                    <p className="text-[12px] mt-4 flex items-center gap-2" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>
                      Read article <ArrowIcon size={11} />
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== OTHER TRADES ===== */}
      <section className="py-[var(--section-pad-y)] bg-[var(--bg-primary)]" style={{ marginTop: "-4vw", paddingTop: "calc(var(--section-pad-y) + 4vw)" }}>
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">
          <FadeUp className="text-center mb-8">
            <h2 className="h2">NOT A {trade.toUpperCase()}?</h2>
            <p className="text-sm md:text-[15px] mt-3" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
              We build systems for other trades too.
            </p>
          </FadeUp>
          <div className="flex flex-wrap justify-center gap-3">
            {relatedTrades.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="text-[12px] md:text-[13px] border border-[var(--border)] px-5 py-2.5 hover:border-[var(--border-accent)] hover:text-[var(--accent-primary)] transition-all duration-300"
                style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", textDecoration: "none", borderRadius: 2 }}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </HomeClient>
  )
}
