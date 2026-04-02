"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import HomeClient, { ArrowIcon, Star, FadeUp } from "../HomeClient"

const trustStats = [
  { value: "14 days", label: "Audit to live systems" },
  { value: "90 day", label: "ROI guarantee" },
  { value: "5.0", label: "Google rating", hasStar: true },
]

const steps = [
  { num: "01", title: "You fill this in", body: "Takes 2 minutes. Tell me what you do, roughly how much you're turning over, and what's eating your time." },
  { num: "02", title: "I look at your business", body: "I'll research your online presence, check how you handle enquiries, and spot 2-3 things that are quietly costing you." },
  { num: "03", title: "You get a straight answer", body: "Within 24 hours. No PDF deck, no sales call. Just a message with what I found and what I'd fix. If there's nothing — I'll tell you." },
]

export default function AuditPage() {
  const [form, setForm] = useState({
    name: "",
    business: "",
    trade: "",
    revenue: "",
    timeEater: "",
    phone: "",
    email: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        alert("Something went wrong. Please try again.")
      }
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <HomeClient hideHero>

      {/* ===== HERO ===== */}
      <section
        className="relative z-[3] min-h-[100svh] flex items-center justify-center overflow-hidden"
        style={{ background: "var(--bg-primary)" }}
      >
        {/* Hero image */}
        <div className="absolute inset-0 z-0">
          <img src="/trades/hero-audit.jpg" alt="" className="w-full h-full object-cover" style={{ opacity: 0.2 }} />
        </div>
        <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(to top, var(--bg-primary) 0%, rgba(0,0,0,.5) 40%, rgba(0,0,0,.3) 100%)" }} />

        <div className="relative z-[2] w-full max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)] py-[120px] text-center">
          <FadeUp>
            <div className="section-label justify-center mb-6 md:mb-8">
              <span>Free 15-Minute Audit</span>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1
              className="text-[clamp(40px,9vw,120px)] leading-[.92] tracking-[-0.02em] uppercase mb-6 md:mb-8"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}
            >
              WHERE ARE YOU<br />
              <span style={{ color: "var(--accent-primary)" }}>LOSING TIME?</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p
              className="text-[13px] md:text-[17px] leading-[1.8] max-w-[480px] mx-auto mb-10 md:mb-14"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
            >
              I&apos;ll look at how your business runs and show you exactly what&apos;s
              costing you time and money — in 15 minutes. No pitch, no obligation.
            </p>
          </FadeUp>

          {/* Trust stats */}
          <FadeUp delay={0.3}>
            <div className="flex justify-center gap-10 md:gap-16">
              {trustStats.map((s) => (
                <div key={s.label} className="flex flex-col items-center">
                  <span
                    className="text-[clamp(22px,3vw,36px)] leading-none mb-2 flex items-center gap-1.5"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent-primary)" }}
                  >
                    {s.value}
                    {s.hasStar && <Star size={18} />}
                  </span>
                  <span className="text-[10px] tracking-[.12em] uppercase" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section
        className="relative z-[2]"
        style={{
          background: "var(--bg-secondary)",
          padding: "var(--section-pad-y) 0 calc(var(--section-pad-y) + 4vw)",
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)",
        }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
            {steps.map((s, i) => (
              <FadeUp key={s.num} delay={i * 0.1}>
                <div className="border-l-2 border-[var(--accent-primary)] pl-5 md:pl-7">
                  <div className="text-[11px] tracking-[.2em] mb-4" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>
                    [ {s.num} ]
                  </div>
                  <div className="w-full h-px bg-[var(--border)] mb-5" />
                  <h3 className="text-[clamp(18px,2vw,24px)] uppercase mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.15 }}>
                    {s.title}
                  </h3>
                  <p className="text-[13px] leading-[1.75]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
                    {s.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FORM SECTION ===== */}
      <section
        className="relative z-[1]"
        style={{
          background: "var(--bg-card)",
          marginTop: "-4vw",
          paddingTop: "calc(var(--section-pad-y) + 4vw)",
          paddingBottom: "calc(var(--section-pad-y) + 4vw)",
          clipPath: "polygon(0 4vw, 100% 0, 100% calc(100% - 4vw), 0 100%)",
        }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">
          <div className="max-w-[640px] mx-auto">

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
                  <FadeUp>
                    <p className="text-center text-[13px] md:text-[15px] mb-8 md:mb-10" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                      Fill this in — takes 2 minutes. I&apos;ll come back to you within 24 hours
                      with what I&apos;ve found.
                    </p>
                  </FadeUp>

                  <FadeUp delay={0.1}>
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="name" className="text-[11px] tracking-[.15em] uppercase" style={{ fontFamily: "var(--font-body)", color: focusedField === "name" ? "var(--accent-primary)" : "var(--text-tertiary)" }}>
                            Your Name
                          </label>
                          <input
                            id="name" name="name" type="text" required autoComplete="name"
                            value={form.name} onChange={handleChange}
                            onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                            className="bg-[var(--bg-elevated)] border border-[var(--border)] text-white text-sm px-4 py-3.5 outline-none focus:border-[var(--accent-primary)] transition-all duration-200"
                            style={{ fontFamily: "var(--font-body)", borderRadius: 2 }}
                            placeholder="John"
                          />
                        </div>

                        {/* Business */}
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="business" className="text-[11px] tracking-[.15em] uppercase" style={{ fontFamily: "var(--font-body)", color: focusedField === "business" ? "var(--accent-primary)" : "var(--text-tertiary)" }}>
                            Business Name
                          </label>
                          <input
                            id="business" name="business" type="text" required autoComplete="organization"
                            value={form.business} onChange={handleChange}
                            onFocus={() => setFocusedField("business")} onBlur={() => setFocusedField(null)}
                            className="bg-[var(--bg-elevated)] border border-[var(--border)] text-white text-sm px-4 py-3.5 outline-none focus:border-[var(--accent-primary)] transition-all duration-200"
                            style={{ fontFamily: "var(--font-body)", borderRadius: 2 }}
                            placeholder="Smith Roofing"
                          />
                        </div>

                        {/* Trade */}
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="trade" className="text-[11px] tracking-[.15em] uppercase" style={{ fontFamily: "var(--font-body)", color: focusedField === "trade" ? "var(--accent-primary)" : "var(--text-tertiary)" }}>
                            Your Trade
                          </label>
                          <select
                            id="trade" name="trade" required
                            value={form.trade} onChange={handleChange}
                            onFocus={() => setFocusedField("trade")} onBlur={() => setFocusedField(null)}
                            className="bg-[var(--bg-elevated)] border border-[var(--border)] text-white text-sm px-4 py-3.5 outline-none focus:border-[var(--accent-primary)] transition-all duration-200 appearance-none cursor-pointer"
                            style={{ fontFamily: "var(--font-body)", borderRadius: 2 }}
                          >
                            <option value="" disabled>Select your trade</option>
                            <option value="Roofer">Roofer</option>
                            <option value="Plumber">Plumber / Heating Engineer</option>
                            <option value="Electrician">Electrician</option>
                            <option value="Builder">Builder / Contractor</option>
                            <option value="Landscaper">Landscaper</option>
                            <option value="Other">Other Service Business</option>
                          </select>
                        </div>

                        {/* Revenue */}
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="revenue" className="text-[11px] tracking-[.15em] uppercase" style={{ fontFamily: "var(--font-body)", color: focusedField === "revenue" ? "var(--accent-primary)" : "var(--text-tertiary)" }}>
                            Monthly Revenue
                          </label>
                          <select
                            id="revenue" name="revenue" required
                            value={form.revenue} onChange={handleChange}
                            onFocus={() => setFocusedField("revenue")} onBlur={() => setFocusedField(null)}
                            className="bg-[var(--bg-elevated)] border border-[var(--border)] text-white text-sm px-4 py-3.5 outline-none focus:border-[var(--accent-primary)] transition-all duration-200 appearance-none cursor-pointer"
                            style={{ fontFamily: "var(--font-body)", borderRadius: 2 }}
                          >
                            <option value="" disabled>Roughly how much?</option>
                            <option value="Under £10k">Under £10k/month</option>
                            <option value="£10-20k">£10-20k/month</option>
                            <option value="£20-50k">£20-50k/month</option>
                            <option value="£50k+">£50k+/month</option>
                          </select>
                        </div>
                      </div>

                      {/* Time eater */}
                      <div className="flex flex-col gap-1.5 mb-4 md:mb-5">
                        <label htmlFor="timeEater" className="text-[11px] tracking-[.15em] uppercase" style={{ fontFamily: "var(--font-body)", color: focusedField === "timeEater" ? "var(--accent-primary)" : "var(--text-tertiary)" }}>
                          What&apos;s eating most of your time?
                        </label>
                        <textarea
                          id="timeEater" name="timeEater" required rows={3}
                          value={form.timeEater} onChange={handleChange}
                          onFocus={() => setFocusedField("timeEater")} onBlur={() => setFocusedField(null)}
                          className="bg-[var(--bg-elevated)] border border-[var(--border)] text-white text-sm px-4 py-3.5 outline-none focus:border-[var(--accent-primary)] transition-all duration-200 resize-none"
                          style={{ fontFamily: "var(--font-body)", borderRadius: 2 }}
                          placeholder="Invoicing, chasing payments, quoting, missed calls..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-6 md:mb-8">
                        {/* Phone */}
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="phone" className="text-[11px] tracking-[.15em] uppercase" style={{ fontFamily: "var(--font-body)", color: focusedField === "phone" ? "var(--accent-primary)" : "var(--text-tertiary)" }}>
                            Phone Number
                          </label>
                          <input
                            id="phone" name="phone" type="tel" required autoComplete="tel"
                            value={form.phone} onChange={handleChange}
                            onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)}
                            className="bg-[var(--bg-elevated)] border border-[var(--border)] text-white text-sm px-4 py-3.5 outline-none focus:border-[var(--accent-primary)] transition-all duration-200"
                            style={{ fontFamily: "var(--font-body)", borderRadius: 2 }}
                            placeholder="07xxx xxxxxx"
                          />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="email" className="text-[11px] tracking-[.15em] uppercase" style={{ fontFamily: "var(--font-body)", color: focusedField === "email" ? "var(--accent-primary)" : "var(--text-tertiary)" }}>
                            Email
                          </label>
                          <input
                            id="email" name="email" type="email" required autoComplete="email"
                            value={form.email} onChange={handleChange}
                            onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                            className="bg-[var(--bg-elevated)] border border-[var(--border)] text-white text-sm px-4 py-3.5 outline-none focus:border-[var(--accent-primary)] transition-all duration-200"
                            style={{ fontFamily: "var(--font-body)", borderRadius: 2 }}
                            placeholder="john@smithroofing.co.uk"
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full justify-center text-[13px] md:text-[15px] px-8 py-4 md:py-[18px]"
                        whileHover={{ scale: submitting ? 1 : 1.01 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                        style={{ opacity: submitting ? 0.6 : 1 }}
                      >
                        {submitting ? "SUBMITTING..." : "GET MY FREE AUDIT"} {!submitting && <span className="arrow"><ArrowIcon /></span>}
                      </motion.button>

                      <p className="text-center text-[12px] mt-4" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.25)" }}>
                        No spam. No sales calls. Just a straight answer.
                      </p>
                    </form>
                  </FadeUp>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div
                    className="border border-[var(--border-accent)] p-8 md:p-14 text-center"
                    style={{ borderRadius: 2, background: "rgba(45,212,191,.04)" }}
                  >
                    <motion.div
                      className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2 border-[var(--accent-primary)] rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </motion.div>

                    <div
                      className="text-[clamp(28px,5vw,48px)] leading-[1] uppercase mb-4"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent-primary)" }}
                    >
                      GOT IT, {form.name.split(" ")[0].toUpperCase() || "MATE"}.
                    </div>
                    <p
                      className="text-[13px] md:text-[15px] leading-[1.75] max-w-[440px] mx-auto mb-6"
                      style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}
                    >
                      I&apos;ll have a proper look at {form.business || "your business"} and get back to you
                      within 24 hours with 2-3 things I&apos;ve spotted. No fluff, no pitch deck — just
                      what I&apos;d actually fix.
                    </p>
                    <div className="h-px bg-[var(--border)] mb-6 max-w-[200px] mx-auto" />
                    <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.3)" }}>
                      In the meantime, have a look at what we&apos;ve done for others:
                    </p>
                    <Link href="/results" className="text-link mt-3 inline-flex" style={{ fontSize: 12 }}>
                      VIEW RESULTS <span className="arrow"><ArrowIcon size={11} /></span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF STRIP ===== */}
      <section
        className="relative z-[0]"
        style={{
          background: "var(--bg-primary)",
          marginTop: "-4vw",
          paddingTop: "calc(var(--section-pad-y) + 4vw)",
          paddingBottom: "var(--section-pad-y)",
        }}
      >
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)]">
          {/* Quick proof */}
          <FadeUp className="text-center">
            <p className="text-[13px] md:text-[15px] mb-6" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)" }}>
              What happened when other tradespeople did this:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {[
                { metric: "£8,400 → £320", label: "Outstanding invoices", trade: "Roofer" },
                { metric: "+£16,800", label: "Winter revenue recovered", trade: "Plumber" },
                { metric: "8hrs → 30min", label: "Weekly admin time", trade: "Electrician" },
                { metric: "8% → 16%", label: "Job margins", trade: "Builder" },
              ].map((item, i) => (
                <FadeUp key={item.trade} delay={i * 0.08}>
                  <div
                    className="bg-[var(--bg-card)] border border-[var(--border)] p-4 md:p-5 text-center hover:border-[var(--border-accent)] transition-colors duration-300"
                    style={{ borderRadius: 2 }}
                  >
                    <div className="text-[clamp(16px,2.5vw,24px)] leading-none mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent-primary)" }}>
                      {item.metric}
                    </div>
                    <div className="text-[10px] tracking-[.08em] uppercase mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--text-tertiary)" }}>
                      {item.label}
                    </div>
                    <div className="text-[10px] tracking-[.1em] uppercase" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.25)" }}>
                      {item.trade}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

    </HomeClient>
  )
}
