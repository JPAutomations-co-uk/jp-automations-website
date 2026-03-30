"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"

/* Diagonal arrow SVG */
function ArrowIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 11.5L11.5 1.5M11.5 1.5H4.5M11.5 1.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* Star SVG */
function Star({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

/* Fade-up animation wrapper */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { ArrowIcon, Star, FadeUp }

/* Trades dropdown for nav */
function TradesDropdown() {
  const [open, setOpen] = useState(false)
  const trades = [
    { label: "Roofers", href: "/ai-automation-for-roofers-uk", icon: "🏠" },
    { label: "Plumbers", href: "/ai-automation-for-plumbers-uk", icon: "🔧" },
    { label: "Electricians", href: "/ai-automation-for-electricians-uk", icon: "⚡" },
    { label: "Builders", href: "/ai-automation-for-builders-uk", icon: "🏗️" },
    { label: "Landscapers", href: "/ai-automation-for-landscapers-uk", icon: "🌿" },
  ]
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="text-link" style={{ fontSize: 15, letterSpacing: ".15em" }}>
        Trades
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-[#111] border border-[var(--border)] py-2 min-w-[200px] z-50"
            style={{ borderRadius: 2 }}
          >
            {trades.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-center gap-3 px-5 py-2.5 text-[13px] text-white/60 hover:text-white hover:bg-white/[.04] transition-colors"
                style={{ fontFamily: "var(--font-body)", textDecoration: "none" }}
              >
                <span>{t.icon}</span> {t.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HomeClient({ children, hideHero = false }: { children?: React.ReactNode; hideHero?: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <main className="bg-[var(--bg-primary)] min-h-screen text-white relative">

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-[1000] h-[70px] md:h-[90px] transition-all duration-300 ${scrolled ? "bg-black/70 backdrop-blur-[20px] border-b border-[var(--border)]" : ""}`}>
        <div className="max-w-[var(--content-max)] mx-auto px-5 md:px-[var(--gutter)] h-full flex items-center justify-between">
          <Link href="/" className="z-[1001]">
            <Image src="/logo.png" alt="JP Automations" width={150} height={56} className="h-10 md:h-14 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-[50px]">
            <TradesDropdown />
            <Link href="/results" className="text-link" style={{ fontSize: 15, letterSpacing: ".15em" }}>Results</Link>
            <Link href="/blog" className="text-link" style={{ fontSize: 15, letterSpacing: ".15em" }}>Blog</Link>
            <Link href="/audit" className="btn-outline" style={{ padding: "13px 30px", fontSize: 15 }}>
              GET YOUR FREE AUDIT <span className="arrow"><ArrowIcon size={16} /></span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden flex-col gap-[7px] p-2 z-[1001]"
            aria-label="Toggle menu"
          >
            <span className={`block w-7 h-[2px] bg-white transition-all duration-300 origin-center ${isMobileMenuOpen ? "rotate-45 translate-y-[9px]" : ""}`} />
            <span className={`block w-7 h-[2px] bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-7 h-[2px] bg-white transition-all duration-300 origin-center ${isMobileMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/[.98] z-[999] overflow-y-auto"
          >
            <div className="flex flex-col min-h-full pt-[90px] pb-10 px-8">
              {/* Primary nav */}
              <div className="flex flex-col gap-1 mb-8">
                {[
                  { label: "Results", href: "/results" },
                  { label: "Blog", href: "/blog" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.35 }}
                  >
                    <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-[clamp(28px,8vw,44px)] font-extrabold uppercase text-white py-1"
                      style={{ fontFamily: "var(--font-display)" }}>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Trades section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <span className="text-[10px] tracking-[.2em] uppercase mb-3 block" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>Find Your Trade</span>
                <div className="h-px bg-[rgba(255,255,255,.08)] mb-4" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-8">
                  {[
                    { label: "Roofers", href: "/ai-automation-for-roofers-uk" },
                    { label: "Plumbers", href: "/ai-automation-for-plumbers-uk" },
                    { label: "Electricians", href: "/ai-automation-for-electricians-uk" },
                    { label: "Builders", href: "/ai-automation-for-builders-uk" },
                    { label: "Landscapers", href: "/ai-automation-for-landscapers-uk" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.04, duration: 0.3 }}
                    >
                      <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-[15px] text-white/60 hover:text-white py-1.5 transition-colors"
                        style={{ fontFamily: "var(--font-body)" }}>
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA — pushed to bottom */}
              <div className="mt-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.4 }}>
                  <Link href="/audit" className="btn-primary w-full justify-center text-[13px] py-4" onClick={() => setIsMobileMenuOpen(false)}>
                    GET YOUR FREE AUDIT <span className="arrow"><ArrowIcon /></span>
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.4 }} className="mt-4 text-center">
                  <a href="tel:+447000000000" className="text-[12px] text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                    Or call JP directly
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO --- */}
      {!hideHero && <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden z-[2] py-[100px] md:pt-[120px] md:pb-[80px]"
      >
        {/* Black background behind video */}
        <div className="absolute inset-0 z-0 bg-black" />

        {/* Background video at 75% opacity */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-[1]"
          style={{ opacity: 0.75 }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 z-[2]" style={{
          background: "radial-gradient(ellipse at center 40%, transparent 0%, rgba(0,0,0,.4) 60%, rgba(0,0,0,.8) 100%), linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 30%)",
        }} />

        <div className="relative z-[3] w-full px-5 md:px-[var(--gutter)] max-w-[var(--content-max)] mx-auto text-center flex justify-center">
          <div className="max-w-[900px] flex flex-col items-center">

            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="section-label mb-3 md:mb-7"
            >
              <span>AI Systems, Websites &amp; Lead Gen for UK Trades</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="mb-4 md:mb-7"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-.02em", lineHeight: 0.92 }}
            >
              <span className="block text-[clamp(38px,11vw,100px)]">YOU HANDLE</span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="block text-[clamp(38px,11vw,100px)]"
              >
                THE WORK.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="block text-[clamp(38px,11vw,100px)]"
                style={{ color: "var(--accent-primary)", textShadow: "0 0 60px rgba(45,212,191,.25)" }}
              >
                WE HANDLE THE REST.
              </motion.span>
            </motion.h1>

            {/* Subtext — conversational, specific, qualifying */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              className="text-[13px] md:text-[17px] text-center max-w-[540px] mb-7 md:mb-10 leading-[1.75] md:leading-[1.8]"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
            >
              If it&apos;s not the actual work, it shouldn&apos;t need you.
              We build AI systems that handle everything else.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-6 md:mb-6 w-full sm:w-auto"
            >
              <Link href="/audit" className="btn-primary w-full sm:w-auto justify-center text-[12px] sm:text-[13px] px-6 sm:px-9 py-3.5 sm:py-4">
                GET YOUR FREE AUDIT <span className="arrow"><ArrowIcon /></span>
              </Link>
              <a href="tel:+447000000000" className="btn-ghost w-full sm:w-auto justify-center text-[12px] sm:text-[13px] px-6 sm:px-9 py-3.5 sm:py-4">
                CALL JP DIRECTLY
              </a>
            </motion.div>

            {/* Google reviews badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex items-center justify-center gap-3 scale-[0.8] sm:scale-[0.85] origin-center"
            >
              <svg className="h-8 sm:h-10 w-auto" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-lg sm:text-xl" style={{ fontFamily: "var(--font-body)" }}>5.0</span>
                  <span className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} />)}
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.4)" }}>Based on Google Reviews</span>
              </div>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="flex items-center gap-5 mt-4 md:mt-6"
            >
              {[
                { href: "https://www.instagram.com/jpautomations/", label: "Instagram", icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/> },
                { href: "https://youtube.com/@jpautomations", label: "YouTube", icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/> },
                { href: "https://www.linkedin.com/in/james-harvey-0583b2370/", label: "LinkedIn", icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> },
                { href: "https://x.com/JamesHarve24282", label: "X", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> },
              ].map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/25 hover:text-[var(--accent-primary)] transition-colors duration-300" title={s.label}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                </a>
              ))}
            </motion.div>

          </div>
        </div>
      </motion.section>}

      {/* --- CHILDREN (page sections) --- */}
      {children}

      {/* --- FOOTER --- */}
      <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] py-16 md:py-20 px-5 md:px-[var(--gutter)]">
        <div className="max-w-[var(--content-max)] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.5fr_1fr] gap-10 md:gap-16 mb-16">
            {/* Brand */}
            <div>
              <Link href="/" className="inline-block mb-5">
                <Image src="/logo.png" alt="JP Automations" width={100} height={36} className="h-9 w-auto" />
              </Link>
              <p className="text-[13px] text-white/40 leading-[1.8] mb-5" style={{ fontFamily: "var(--font-body)" }}>
                Websites, lead generation, AI systems, and SEO for UK trades businesses. Built to grow your business without growing your workload.
              </p>
              <p className="text-xs text-white/25 mb-6" style={{ fontFamily: "var(--font-body)" }}>
                United Kingdom. Built for trades.
              </p>
              <div className="flex gap-5">
                {[
                  { href: "https://www.instagram.com/jpautomations/", label: "Instagram", icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/> },
                  { href: "https://youtube.com/@jpautomations", label: "YouTube", icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/> },
                  { href: "https://www.linkedin.com/in/james-harvey-0583b2370/", label: "LinkedIn", icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> },
                  { href: "https://x.com/JamesHarve24282", label: "X", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> },
                ].map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 hover:text-[var(--accent-primary)] transition-colors duration-300" title={s.label}>
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                    <span className="hidden md:inline text-[11px] tracking-[.1em] uppercase" style={{ fontFamily: "var(--font-body)" }}>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 gap-8 md:gap-12">
              {[
                { title: "Trades", links: [
                  { label: "For Roofers", href: "/ai-automation-for-roofers-uk" },
                  { label: "For Plumbers", href: "/ai-automation-for-plumbers-uk" },
                  { label: "For Electricians", href: "/ai-automation-for-electricians-uk" },
                  { label: "For Builders", href: "/ai-automation-for-builders-uk" },
                  { label: "For Landscapers", href: "/ai-automation-for-landscapers-uk" },
                ]},
                { title: "Company", links: [
                  { label: "Results", href: "/results" },
                  { label: "Blog", href: "/blog" },
                  { label: "Free Resources", href: "/free-resources" },
                  { label: "Free Audit", href: "/audit" },
                ]},
              ].map((col) => (
                <div key={col.title} className="flex flex-col gap-2.5">
                  <span className="text-[10px] tracking-[.2em] uppercase text-white/25" style={{ fontFamily: "var(--font-body)" }}>{col.title}</span>
                  <div className="h-px bg-[var(--border)] mb-1" />
                  {col.links.map((l) => (
                    <Link key={l.label} href={l.href} className="text-[13px] text-white/50 hover:text-white transition-colors py-0.5" style={{ fontFamily: "var(--font-body)" }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] tracking-[.2em] uppercase text-white/25" style={{ fontFamily: "var(--font-body)" }}>Get In Touch</span>
              <div className="h-px bg-[var(--border)] mb-1" />
              <a href="mailto:jp@jpautomations.com" className="text-[13px] text-white/50 hover:text-white transition-colors py-0.5" style={{ fontFamily: "var(--font-body)" }}>
                jp@jpautomations.com
              </a>
              <Link href="/audit" className="text-link mt-2" style={{ fontSize: 12 }}>
                GET YOUR FREE AUDIT <span className="arrow"><ArrowIcon size={11} /></span>
              </Link>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between pt-6 border-t border-[var(--border)] text-[10px] text-white/20 gap-2" style={{ fontFamily: "var(--font-body)" }}>
            <span>&copy; {new Date().getFullYear()} JP Automations. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </main>
  )
}
