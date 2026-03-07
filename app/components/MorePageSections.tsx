"use client"

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease },
  viewport: { once: true, margin: "-100px" },
}

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  viewport: { once: true, margin: "-100px" },
}

const staggerItem = {
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease },
}

const staggerItemLeft = {
  initial: { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease },
}

const AnimatedStat = ({ value }: { value: string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease, type: "spring", stiffness: 100 }}
      className="text-4xl md:text-5xl lg:text-5xl font-semibold text-teal-400 tracking-tighter block font-mono"
    >
      {value}
    </motion.span>
  )
}

type MarqueeClient = {
  logo: string
  name: string
  result: string
  caseStudy: string | null
  ctaText?: string
}

export default function MorePageSections() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)

  const dreamStates = [
    "running without you",
    "25+ hours reclaimed",
    "leads on autopilot",
    "scaling, no chaos",
    "free of the bottleneck",
    "follow-up on autopilot",
    "growth without hiring",
    "built to scale itself",
    "runs like a machine",
    "out of the weeds",
  ]
  const [dreamStateIndex, setDreamStateIndex] = useState(0)
  const [dreamVisible, setDreamVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setDreamVisible(false)
      setTimeout(() => {
        setDreamStateIndex(i => (i + 1) % dreamStates.length)
        setDreamVisible(true)
      }, 300)
    }, 2600)
    return () => clearInterval(timer)
  }, [])

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingContact(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setContactSuccess(true)
        setContactForm({ name: "", email: "", message: "" })
        setTimeout(() => setContactSuccess(false), 5000)
      } else {
        alert("Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Contact form error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmittingContact(false)
    }
  }

  const clients: MarqueeClient[] = [
    {
      logo: "/prince.png",
      name: "Prince Ogbe",
      result: "From no pipeline to paid deal in 24 hours.",
      caseStudy: "https://www.instagram.com/reel/DTu8ks6DACH/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
    },
    {
      logo: "/jsc.jpg",
      name: "JSC air conditioning",
      result: "End-to-end website development that generates clients 24/7.",
      caseStudy: "https://client-jsc.vercel.app",
      ctaText: "Check out the website"
    },
    {
      logo: "/will.png",
      name: "Will Young",
      result: "5x increase in sales from email marketing automations",
      caseStudy: "https://www.instagram.com/stories/highlights/18066854684108342/",
      ctaText: "Check out the video testimonial"
    },
    {
      logo: "/jsa.png",
      name: "JSA Architects",
      result: "Premium weekly social content, fully handled.",
      caseStudy: "https://www.instagram.com/jsa.architects.uk/",
      ctaText: "Check out their social media"
    },
    {
      logo: "/ace.png",
      name: "ACE Flat Roofing LTD",
      result: "25 Hours Reclaimed per Week, \u00A32,995 Recovered",
      caseStudy: "https://www.jpautomations.co.uk/blog/invoice-case-study",
      ctaText: "Check out the full case study"
    },
    {
      logo: "/gutter-logo.png",
      name: "Birmingham Gutter Services",
      result: "Full-stack website development and SEO implementation",
      caseStudy: "https://www.jpautomations.co.uk/blog/invoice-case-study",
      ctaText: "Check out their new website"
    }
  ]

  return (
    <div>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pb-14 md:pb-20 pt-4 md:pt-8 px-4 md:px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="text-teal-400 text-xs font-mono uppercase tracking-[0.25em] mb-6"
          >
            For service business owners doing \u00A3250K+/year
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            className="font-extrabold text-white tracking-tight leading-[1.1] mb-6"
            style={{ fontSize: "clamp(1.5rem, 6.5vw, 5rem)" }}
          >
            Your business,<br />
            <span
              className="text-teal-400 inline-block"
              style={{
                whiteSpace: "nowrap",
                opacity: dreamVisible ? 1 : 0,
                filter: dreamVisible ? "blur(0px)" : "blur(10px)",
                transform: dreamVisible ? "translateY(0px) scale(1)" : "translateY(5px) scale(0.97)",
                transition: dreamVisible
                  ? "opacity 0.45s ease, filter 0.5s ease, transform 0.45s ease"
                  : "opacity 0.18s ease, filter 0.18s ease, transform 0.18s ease",
              }}
            >
              {dreamStates[dreamStateIndex]}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.32, ease }}
            className="text-base md:text-xl text-gray-400 leading-relaxed mb-8"
          >
            More revenue, recovered from what&apos;s currently slipping through the gaps. More time, freed from the admin that shouldn&apos;t need you. The kind of freedom that comes when your business is finally built to run without you.
          </motion.p>
          <motion.a
            href="/apply"
            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.46, ease }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(45,212,191,0.3)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-7 py-4 bg-teal-400 text-black rounded-xl font-semibold text-base hover:bg-teal-300 transition-colors"
          >
            Book a Free Call <span>&rarr;</span>
          </motion.a>
        </div>
      </section>

      {/* --- SOCIAL PROOF / CASE STUDIES MARQUEE --- */}
      <motion.section {...fadeInUp} id="proof" className="relative z-10 pt-0 pb-16 md:pb-20 border-t border-white/5 overflow-hidden">
        <div className="text-center mb-9 md:mb-10 px-6">
          <p className="text-teal-400 text-xs font-mono uppercase tracking-[0.2em] mb-4">Case Studies</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            A Few of our <span className="text-teal-400">Client Wins.</span>
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div className="marquee-track">
              {[0, 1].map((setIdx) => (
                <div key={setIdx} className="marquee-content">
                  {clients.map((client, i) => (
                    <div key={`${setIdx}-${i}`} className="flex-shrink-0 mx-3 md:mx-4">
                      <motion.div
                        whileHover={{ scale: 1.03, borderColor: "rgba(45,212,191,0.4)", boxShadow: "0 10px 40px rgba(45,212,191,0.1)" }}
                        className="group w-[280px] md:w-[320px] p-5 md:p-6 rounded-xl bg-white/[0.02] border border-white/10 transition-all duration-300 relative before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom,rgba(45,212,191,0.1)_0,transparent_70%)] before:opacity-0 hover:before:opacity-100 flex flex-col"
                      >
                        <div className="h-10 md:h-12 mb-4 flex items-center">
                          <img
                            src={client.logo}
                            alt={`${client.name} logo - JP Automations client`}
                            className="h-full w-auto object-contain opacity-100 transition-opacity"
                          />
                        </div>
                        <p className="text-white font-medium text-base mb-2 font-sans tracking-tight">{client.result}</p>
                        <p className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-4 border-b border-white/5 pb-4">{client.name}</p>
                        {client.caseStudy ? (
                          <a href={client.caseStudy} className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors group/link">
                            {client.ctaText || "See the full case study"} <span className="transition-transform group-hover/link:translate-x-0.5">&rarr;</span>
                          </a>
                        ) : (
                          <span className="text-xs font-mono text-teal-400/60 uppercase tracking-widest">Results verified</span>
                        )}
                      </motion.div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- VSL SECTION --- */}
      <motion.section {...fadeInUp} id="vsl" className="relative z-10 py-24 md:py-32 px-6 border-t border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-6 tracking-tighter">
            Watch How We Diagnose and Rebuild a <span className="text-teal-400">Service Business</span> in Under 90 Days
          </h2>
          <p className="text-xl md:text-2xl font-medium text-gray-400 max-w-3xl mx-auto mb-12">
            This is what the audit process looks like. What we find. What we build. And how fast things change.
          </p>

          <motion.div
            whileHover={{ borderColor: "rgba(45,212,191,0.4)", boxShadow: "0 20px 80px rgba(45,212,191,0.15)" }}
            className="group relative w-full aspect-video rounded-2xl border border-teal-500/20 bg-black/60 shadow-[0_20px_80px_rgba(45,212,191,0.1)] flex items-center justify-center overflow-hidden transition-all duration-500 backdrop-blur-xl before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.1)_0,transparent_100%)]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center text-gray-500 z-10">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-28 h-28 rounded-full border border-teal-500/30 bg-teal-500/5 flex items-center justify-center text-3xl text-teal-400 transition-all duration-300 shadow-[0_0_30px_rgba(45,212,191,0.2)]"
              >
                <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>&#9654;</motion.span>
              </motion.div>
              <p className="mt-6 text-sm font-medium uppercase tracking-widest">Watch the full breakdown</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* --- 3-STEP TRANSFORMATION --- */}
      <motion.section {...fadeInUp} id="process" className="relative z-10 py-28 md:py-36 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              The <span className="text-teal-400">3-Step</span> Transformation
            </h2>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              No two businesses share the same systems, goals, or structures. That&apos;s why every engagement starts with understanding yours.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease }}
              viewport={{ once: true }}
              className="absolute top-[52px] -left-4 -right-4 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent z-0 max-md:hidden origin-left"
            />

            {[
              {
                num: "1",
                title: "Audit",
                desc: "We tear apart your operations to find exactly where time and money are leaking \u2014 and what should never require you.",
                items: [
                  "Map every workflow that touches revenue",
                  "Identify where time and money are leaking",
                  "Pinpoint which tasks should never require you",
                  "Baseline your current cost of doing nothing"
                ]
              },
              {
                num: "2",
                title: "Consultation",
                desc: "We present a clear roadmap with priorities, timelines, and expected outcomes \u2014 then we get to work.",
                items: [
                  "Present a prioritised build roadmap",
                  "Show exactly what gets built and why",
                  "Align on timelines \u2014 quick wins first",
                  "Set measurable benchmarks before we start"
                ]
              },
              {
                num: "3",
                title: "Action",
                desc: "We build, deploy, and test every system against your real workflows \u2014 then refine until it runs without you.",
                items: [
                  "Build and deploy every agreed system",
                  "Connect all parts so nothing falls through gaps",
                  "Test against real workflows before handover",
                  "Refine until it runs without you in the loop"
                ]
              }
            ].map((step) => (
              <motion.div
                key={step.num}
                variants={staggerItem}
                whileHover={{ y: -8, borderColor: "rgba(45,212,191,0.4)", boxShadow: "0 20px 60px rgba(45,212,191,0.1)" }}
                className="group rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-8 transition-all duration-500 relative overflow-hidden z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(45,212,191,0.3)" }}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-black/80 text-teal-400 font-mono text-lg font-bold border border-teal-500/30 group-hover:bg-teal-500/10 group-hover:border-teal-400 transition-all duration-500 z-20 relative"
                    >
                      {step.num}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">{step.title}</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed mb-8">{step.desc}</p>
                  <motion.ul
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-50px" }}
                    className="space-y-4"
                  >
                    {step.items.map((item) => (
                      <motion.li key={item} variants={staggerItemLeft} className="flex items-start gap-3 text-[13px] text-gray-400 font-mono tracking-tight">
                        <span className="text-teal-400 mt-0.5 font-mono text-sm leading-none">[+]</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeInUp} className="mt-16 text-center">
            <motion.a
              href="/apply"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(45,212,191,0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-teal-400 text-black rounded-xl font-semibold hover:bg-teal-300 transition-colors"
            >
              Book a Call
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* --- GUARANTEES & RESULTS SECTION --- */}
      <motion.section {...fadeInUp} id="guarantees" className="relative z-10 py-28 md:py-36 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-teal-400 text-xs uppercase tracking-[0.2em] mb-5 font-mono">Our Guarantees</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              We Don&apos;t Make Promises.<br />
              <span className="text-teal-400">We Make Guarantees.</span>
            </h2>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08] rounded-2xl overflow-hidden mb-20 border border-white/5"
          >
            {[
              { label: "Time", title: "25+ hours back per week \u2014 or we rebuild it for free", desc: "Our average client reclaims a full working day before the first month is over." },
              { label: "ROI", title: "Recover your investment within 90 days \u2014 or we keep working", desc: "One client recovered \u00A310,000+ in the first month alone. We don\u2019t stop until the numbers prove it." },
              { label: "Speed", title: "Systems live within 14 days \u2014 not 14 meetings", desc: "From audit to deployed infrastructure in under a month. No committees. No delays." },
            ].map((g, i) => (
              <motion.div key={i} variants={staggerItem} className="bg-black p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.2em] text-teal-400 mb-4 font-mono font-medium">{g.label}</p>
                <h3 className="text-lg font-semibold text-white mb-3 leading-snug">{g.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{g.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden"
          >
            {[
              { stat: "45+ hrs", label: "reclaimed per week" },
              { stat: "\u00A310,000+", label: "recovered in month one" },
              { stat: "< 24 hrs", label: "to first paid deal" },
              { stat: "5x", label: "sales revenue increase" },
              { stat: "< 14 days", label: "audit to live systems" },
              { stat: "100%", label: "client success rate" }
            ].map((item) => (
              <motion.div key={item.stat} variants={staggerItem} className="bg-black py-8 md:py-10 px-6 text-center">
                <AnimatedStat value={item.stat} />
                <span className="text-[11px] md:text-xs text-gray-500 mt-3 block font-mono uppercase tracking-widest">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* --- WHO THIS IS FOR / NOT FOR --- */}
      <motion.section {...fadeInUp} id="fit" className="relative z-10 py-28 md:py-36 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Not for Everyone. <span className="text-teal-400">By Design.</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              We only work with service businesses doing \u00A315k+/month who are serious about building infrastructure that scales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ borderColor: "rgba(45,212,191,0.5)", boxShadow: "0 10px 40px rgba(45,212,191,0.08)" }}
              className="rounded-xl bg-black border border-teal-500/30 p-8 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-teal-500/10 before:via-teal-400 before:to-teal-500/10 transition-all"
            >
              <h3 className="text-sm font-mono text-teal-400 mb-8 border-b border-teal-500/20 pb-4 tracking-widest uppercase">&gt; _REQUIREMENTS_MATCH</h3>
              <motion.ul
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-50px" }}
                className="space-y-4"
              >
                {[
                  "You run a service business doing \u00A3250K/year and you\u2019re ready to scale without the chaos",
                  "You\u2019re spending real hours on admin, chasing leads, or managing things that shouldn\u2019t need you",
                  "You want custom-built infrastructure, not another software subscription",
                  "You\u2019re ready to move fast, audit to live in under 2 weeks",
                  "You value results over hours and output over activity"
                ].map((item) => (
                  <motion.li key={item} variants={staggerItemLeft} className="flex items-start gap-3 text-[13px] text-gray-400 font-mono tracking-tight">
                    <span className="text-teal-400 mt-0.5 font-mono text-sm leading-none">[+]</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              whileHover={{ borderColor: "rgba(255,255,255,0.15)" }}
              className="rounded-xl bg-black/50 border border-white/10 p-8 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-white/10 transition-all"
            >
              <h3 className="text-sm font-mono text-gray-400 mb-8 border-b border-white/10 pb-4 tracking-widest uppercase">&gt; _REQUIREMENTS_FAIL</h3>
              <motion.ul
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-50px" }}
                className="space-y-4"
              >
                {[
                  "You\u2019re pre-revenue or still finding product-market fit",
                  "You\u2019re looking for the cheapest option available",
                  "You\u2019re happy at your current size and not looking to grow",
                  "You want off-the-shelf software, not something engineered for your business",
                  "You\u2019re not willing to open up your processes for a proper audit"
                ].map((item) => (
                  <motion.li key={item} variants={staggerItemLeft} className="flex items-start gap-3 text-[13px] text-gray-400 font-mono tracking-tight leading-relaxed">
                    <span className="text-gray-600 mt-0.5 font-mono text-sm leading-none">[-]</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* --- BLOG SECTION --- */}
      <motion.section {...fadeInUp} id="blog" className="relative z-10 py-28 md:py-36 border-t border-white/5 bg-[#020408]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-7xl mx-auto mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              From the <span className="text-teal-400">Blog</span>
            </h2>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              Free resources and frameworks for service business owners who are serious about scaling.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                title: "How to Actually Use AI \u2014 99% of People Are Doing This Wrong",
                excerpt: "Vague prompts get vague outputs. The four-layer prompt framework, iteration mindset, and model selection strategy that changes everything.",
                slug: "/blog/how-to-use-ai-effectively",
                image: "/blog/llm.jpg"
              },
              {
                title: "5 Business Processes Every UK Service Business Should Automate",
                excerpt: "The five processes quietly draining time and revenue every week \u2014 and how to automate each one for immediate, measurable impact.",
                slug: "/blog/business-process-automation-uk-service-businesses",
                image: "/blog/business-process-automation.webp"
              },
              {
                title: "How to Automate Client Follow-Up for UK Service Businesses (Without a CRM)",
                excerpt: "Most service businesses lose leads not because of bad pricing \u2014 but because follow-up is slow or inconsistent. Here\u2019s how to fix it.",
                slug: "/blog/automate-client-follow-up-uk-service-businesses",
                image: "/blog/follow-up.webp"
              },
              {
                title: "Case Study: Invoicing System",
                excerpt: "How this roofing business saves 25 hours/week & recovered \u00A32,995 in revenue",
                slug: "/blog/invoice-case-study",
                image: "/blog/case-study-invoice.webp"
              },
            ].map((post) => (
              <motion.a
                key={post.slug}
                variants={staggerItem}
                href={post.slug}
                whileHover={{ y: -6, borderColor: "rgba(45,212,191,0.3)", boxShadow: "0 0 30px rgba(45,212,191,0.1)" }}
                className="group block rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5 transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-900 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors leading-tight mb-3">
                    {post.title}
                  </h3>
                  <p className="text-[13px] text-gray-400 font-mono tracking-tight leading-relaxed mb-6 line-clamp-2">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-400 group-hover:gap-2 transition-all">
                    Read more <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </motion.a>
            ))}
          </motion.div>

          <motion.div {...fadeInUp} className="mt-16 flex justify-center">
            <motion.a
              href="/blog"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(45,212,191,1)", color: "#000" }}
              whileTap={{ scale: 0.97 }}
              className="group px-8 py-4 border-2 border-teal-400 text-teal-400 rounded-xl font-semibold transition-all duration-300 inline-flex items-center gap-2"
            >
              View all blog posts <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* --- FAQ SECTION --- */}
      <motion.section {...fadeInUp} id="faq" className="relative z-10 py-28 md:py-36 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-teal-400 text-sm uppercase tracking-widest text-center mb-4">FAQs</p>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-6 tracking-tight">
            Frequently Asked <span className="text-teal-400">Questions</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16 leading-relaxed">
            Clear answers to the questions most business owners ask before getting started.
          </p>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-4"
          >
            {[
              {
                q: "How is this different from any other agency or freelancer?",
                a: [
                  "Most agencies and freelancers focus on individual tasks delivered in isolation.",
                  "We build connected systems across your entire business.",
                  "The outcome isn\u2019t more activity. It\u2019s a business that runs smoothly, scales with control, and doesn\u2019t depend on you."
                ]
              },
              {
                q: "Will this work for my type of service business?",
                a: [
                  "Service businesses across sectors are ideal \u2014 strong demand, weak systems, owner as the bottleneck.",
                  "If you\u2019re doing \u00A315k+/month and growth is creating chaos instead of freedom, this is built for you."
                ]
              },
              {
                q: "How involved do I need to be once things are set up?",
                a: [
                  "Very little.",
                  "Once live, systems handle the work and you step in only where decisions genuinely matter."
                ]
              },
              {
                q: "Will I still have visibility and control over my business?",
                a: [
                  "Yes, you gain more control, not less.",
                  "Visibility is built into the systems so you always know what\u2019s happening without micromanaging."
                ]
              },
              {
                q: "What happens if I want to change or adjust systems later?",
                a: [
                  "Nothing is locked in.",
                  "Everything is custom-built, documented, and designed to evolve as your business grows."
                ]
              },
              {
                q: "How much of my time does setup take?",
                a: [
                  "Less than continuing to do everything yourself.",
                  "We handle the build. You give us access and clarity on how things work. That\u2019s it."
                ]
              },
              {
                q: "Will this add more complexity to my business?",
                a: [
                  "No, it completely removes it.",
                  "Systems replace chaos and mental load with structure, clarity, and simplicity."
                ]
              },
              {
                q: "Who is this not a good fit for?",
                a: [
                  "Businesses happy staying small.",
                  "Owners looking for shortcuts.",
                  "People unwilling to modernise.",
                  "Anyone shopping purely on price.",
                  "Anyone unwilling to have their processes documented and examined."
                ]
              },
              {
                q: "How much does it cost?",
                a: [
                  "Every engagement is scoped after the audit because every business is different.",
                  "We don\u2019t publish prices because a price without context is meaningless.",
                  "What we can tell you: this is a serious investment that serious business owners make when they\u2019re tired of losing time and money to broken systems.",
                  "If budget is the primary concern, we\u2019re probably not the right fit yet. Book a call and we\u2019ll be upfront about whether this makes sense for you."
                ]
              }
            ].map((faq, i) => (
              <motion.details
                key={i}
                variants={staggerItem}
                className="group border border-white/10 rounded-2xl transition-all duration-300 hover:border-teal-500/50 open:border-teal-500/50 open:bg-white/[0.02]"
              >
                <summary className="cursor-pointer list-none px-6 py-6 flex justify-between items-center">
                  <span className="font-bold text-lg md:text-xl text-white transition-colors group-hover:text-teal-400 group-open:text-teal-400">{faq.q}</span>
                  <span className="text-gray-400 text-2xl transition-transform group-open:rotate-180 duration-300 flex-shrink-0 ml-4">&#8964;</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 space-y-3 leading-relaxed">
                  {faq.a.map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* --- CONTACT SECTION --- */}
      <motion.section {...fadeInUp} id="contact" className="relative z-10 px-6 py-28 md:py-36 border-t border-white/5 bg-[#020408]">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-10">
          <div className="text-white">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-teal-400 tracking-tight">Ready to Fix It?</h2>
            <p className="text-gray-400 leading-relaxed">
              First conversation is diagnostic, not sales. Tell us what&apos;s broken and we&apos;ll tell you if we can help.
            </p>
          </div>

          {contactSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full p-6 bg-teal-500/10 border border-teal-500 rounded-2xl text-teal-300 text-lg font-medium"
            >
              &#10003; Message sent! We&apos;ll get back to you within 24 hours.
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleContactSubmit}
              whileHover={{ borderColor: "rgba(45,212,191,0.4)" }}
              className="w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 transition-all duration-500 shadow-[0_20px_80px_rgba(45,212,191,0.1)] relative overflow-hidden group/form"
            >
              <div className="absolute top-0 -right-20 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none group-hover/form:bg-teal-500/20 transition-colors duration-700" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none group-hover/form:bg-teal-500/15 transition-colors duration-700" />

              <input
                type="text"
                placeholder="Your name"
                value={contactForm.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setContactForm({ ...contactForm, name: e.target.value })}
                required
                className="w-full px-6 py-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all relative z-10"
              />
              <input
                type="email"
                placeholder="Your email"
                value={contactForm.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setContactForm({ ...contactForm, email: e.target.value })}
                required
                className="w-full px-6 py-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all relative z-10"
              />
              <textarea
                placeholder="Tell us what's broken"
                value={contactForm.message}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                rows={4}
                className="w-full px-6 py-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none relative z-10"
              />
              <motion.button
                type="submit"
                disabled={isSubmittingContact}
                whileHover={!isSubmittingContact ? { scale: 1.02, boxShadow: "0 0 30px rgba(45,212,191,0.5)" } : {}}
                whileTap={!isSubmittingContact ? { scale: 0.97 } : {}}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 relative z-10 ${isSubmittingContact
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-teal-400 text-black hover:bg-teal-300"
                  }`}
              >
                {isSubmittingContact ? "Sending..." : (
                  <>Send message <span>&rarr;</span></>
                )}
              </motion.button>
            </motion.form>
          )}
        </div>

        <div className="max-w-6xl mx-auto mt-20 border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/jpautomations/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-teal-400 hover:bg-white/10 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="https://youtube.com/@jpautomations?si=HTkaJJYnbck-d7rQ" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-teal-400 hover:bg-white/10 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </a>
            <a href="https://www.linkedin.com/in/james-harvey-0583b2370/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-teal-400 hover:bg-white/10 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            <a href="https://x.com/JamesHarve24282" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-teal-400 hover:bg-white/10 transition-all duration-300 hover:scale-110">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-teal-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>

          <div className="text-center md:text-right w-full md:w-auto">
            <a href="mailto:jp@jpautomations.com" className="block text-gray-400 hover:text-teal-400 transition-colors mb-2">jp@jpautomations.com</a>
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} JP Automations. All rights reserved.</p>
          </div>
        </div>
      </motion.section>

      <style jsx>{`
  @keyframes marquee-scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .marquee-track {
    display: flex;
    width: max-content;
    animation: marquee-scroll 40s linear infinite;
  }
  .marquee-track:hover {
    animation-play-state: paused;
  }
  .marquee-content {
    display: flex;
    flex-shrink: 0;
  }
`}</style>
    </div>
  )
}
