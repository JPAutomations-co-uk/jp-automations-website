"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import HomeClient, { ArrowIcon, FadeUp } from "../HomeClient"

const trades = [
  { label: "Roofers", href: "/ai-automation-for-roofers-uk", icon: "01" },
  { label: "Plumbers", href: "/ai-automation-for-plumbers-uk", icon: "02" },
  { label: "Electricians", href: "/ai-automation-for-electricians-uk", icon: "03" },
  { label: "Builders", href: "/ai-automation-for-builders-uk", icon: "04" },
  { label: "Landscapers", href: "/ai-automation-for-landscapers-uk", icon: "05" },
]

export default function ManchesterClient() {
  return (
    <HomeClient hideHero>

      {/* ===== HERO ===== */}
      <section
        className="relative overflow-visible p-0 z-[3]"
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

        <div className="relative z-[1] max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)] py-[clamp(48px,7vw,100px)]">
          <FadeUp>
            <div className="section-label mb-4 md:mb-6">
              <span>AI Automation for Trades in Manchester</span>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1
              className="text-[clamp(36px,7vw,96px)] leading-[.92] tracking-[-0.02em] uppercase mb-5 md:mb-7"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)", whiteSpace: "pre-line" }}
            >
              {"AI AUTOMATION\nFOR MANCHESTER\nTRADES."}
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-sm md:text-[17px] leading-[1.75] max-w-[600px] mb-8 md:mb-10" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
              Manchester tradespeople are stretched thin &mdash; more jobs than hours, more admin than patience. We build the systems that handle everything except the actual trade.
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

      {/* ===== WHY MANCHESTER ===== */}
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
              <span>Why Manchester</span>
            </div>
            <h2 className="h1">FASTEST-GROWING<br />CITY. BUSIEST TRADES.</h2>
          </FadeUp>

          <div className="hairline mb-10 md:mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="border-l-2 border-[var(--accent-primary)] pl-5 md:pl-7"
            >
              <h3 className="h3 mb-3" style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.15 }}>
                Construction Capital
              </h3>
              <p className="text-[13px] md:text-sm leading-[1.75]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
                More cranes on the skyline than any UK city outside London. Manchester&apos;s building boom means trade businesses are overloaded with demand &mdash; and choking on the admin that comes with it.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="border-l-2 border-[var(--accent-primary)] pl-5 md:pl-7"
            >
              <h3 className="h3 mb-3" style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.15 }}>
                Fierce Competition
              </h3>
              <p className="text-[13px] md:text-sm leading-[1.75]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
                Greater Manchester has over 2.8 million people across Salford, Stockport, Bolton, and beyond. Every missed call is a job that goes to the next name on Checkatrade. Speed wins.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="border-l-2 border-[var(--accent-primary)] pl-5 md:pl-7"
            >
              <h3 className="h3 mb-3" style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.15 }}>
                Proven in Manchester
              </h3>
              <p className="text-[13px] md:text-sm leading-[1.75]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
                A Manchester electrician cut his weekly admin from two full days down to 30 minutes. Same workload, same team &mdash; just systems handling the quoting, invoicing, and follow-up.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES GRID ===== */}
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
              <span>Trades We Serve</span>
            </div>
            <h2 className="h1">PICK YOUR TRADE.</h2>
          </FadeUp>

          <div className="hairline mb-10 md:mb-16" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {trades.map((t, i) => (
              <motion.div
                key={t.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={t.href}
                  className="block bg-[var(--bg-card)] border border-[var(--border)] p-6 md:p-8 hover:border-[var(--border-accent)] transition-all duration-300"
                  style={{ borderRadius: 2, textDecoration: "none" }}
                >
                  <div className="text-[11px] tracking-[.2em] mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>
                    [ {t.icon} ]
                  </div>
                  <h3 className="h3 mb-2" style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.15 }}>
                    {t.label}
                  </h3>
                  <p className="text-[13px] leading-[1.75] flex items-center gap-2" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>
                    See how it works <ArrowIcon size={11} />
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GUARANTEE + CTA ===== */}
      <section
        className="relative z-[2]"
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

    </HomeClient>
  )
}
