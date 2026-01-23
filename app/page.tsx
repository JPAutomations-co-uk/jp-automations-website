"use client"

import { useEffect, useState, FormEvent, ChangeEvent } from "react"

export default function Home() {
  const services = [
    "Operational Workflows",
    "AI-Powered Automations",
    "Optimised Marketing Systems",
    "Lead Generation & Nurturing",
    "24/7 Admin Support",
    "Optimised Online Presence",
    "Scalable Business Infrastructure"
  ]

  const [index, setIndex] = useState(0)

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % services.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Contact form submit handler
  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingContact(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setContactSuccess(true)
        setContactForm({ name: '', email: '', message: '' })
        
        // Hide success message after 5 seconds
        setTimeout(() => setContactSuccess(false), 5000)
      } else {
        alert('Something went wrong. Please try again or email us directly.')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      alert('Something went wrong. Please try again or email us directly.')
    } finally {
      setIsSubmittingContact(false)
    }
  }

  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black">
      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Logo */}
        <div className="absolute top-6 left-6 z-20">
          <img
            src="/logo.png"
            alt="Your Company Name"
            className="h-20 w-auto transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="absolute top-6 right-6 z-20">
          <div className="flex items-center gap-4">
            <a
              href="/blog"
              className="group px-6 py-3 text-gray-300 hover:text-teal-400 font-medium transition-all duration-300 relative"
            >
              <span className="relative z-10">Blog</span>
              <span className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gray-700 group-hover:border-teal-400" />
            </a>
            <a
              href="/apply"
              className="group px-6 py-3 bg-teal-400/10 backdrop-blur-sm text-teal-400 font-semibold rounded-lg border-2 border-teal-400 hover:bg-teal-400 hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]"
            >
              Book Call
            </a>
          </div>
        </nav>

        {/* Background vertical lines */}
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Floating gradient orbs for depth */}
        <div className="absolute top-1/4 left-1/4 w-200 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-6">
          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight animate-fade-in">
            Grow Your Business With Transformative
          </h1>

          {/* Rotating services */}
          <div className="mt-4 h-[56px] overflow-hidden">
            <p
              key={index}
              className="text-4xl md:text-5xl text-teal-400 font-medium animate-slide-up"
            >
              {services[index]}
            </p>
          </div>

          {/* Subheading */}
          <p className="mt-6 text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
            End-to-end systems that remove you as the bottleneck - giving you a business that runs smoothly, scales predictably, and supports your life instead of consuming it.
          </p>

          {/* CTA */}
          <div className="mt-12 flex justify-center">
            <a
              href="/apply"
              className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-teal-400 text-teal-400 rounded-xl font-semibold hover:bg-teal-400 hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]"
            >
              Book a Free Call
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
            
          {/* Feature stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
            {/* Stat 1 */}
            <div className="group cursor-default transition-transform duration-300 hover:scale-110">
              <p className="text-5xl font-bold text-teal-400 transition-colors group-hover:text-teal-300">
                24/7
              </p>
              <p className="mt-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                Availability
              </p>
            </div>

            {/* Stat 2 */}
            <div className="group cursor-default transition-transform duration-300 hover:scale-110">
              <p className="text-5xl font-bold text-teal-400 transition-colors group-hover:text-teal-300">
                100%
              </p>
              <p className="mt-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                Client Success
              </p>
            </div>

            {/* Stat 3 */}
            <div className="group cursor-default transition-transform duration-300 hover:scale-110">
              <p className="text-5xl font-bold text-teal-400 flex justify-center items-center gap-1 group-hover:text-teal-300 transition-colors">
                5
                <span className="text-yellow-400 group-hover:text-yellow-300 transition-colors">★</span>
              </p>
              <p className="mt-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                Google Star rating
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VSL SECTION */}
      <section className="w-full py-24 px-6 border-t border-gray-800">
        <div className="mx-auto max-w-6xl text-center">
          {/* VSL Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See How Trade Businesses Automate Growth
          </h2>

          {/* VSL Subheading */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            A short walkthrough of how AI-powered systems remove admin, capture more leads, and let your business run without constant interruptions.
          </p>

          {/* YouTube VSL Placeholder */}
          <div className="group relative w-full aspect-video rounded-2xl border-2 border-gray-800 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center shadow-2xl overflow-hidden transition-all duration-300 hover:border-teal-400 hover:shadow-[0_0_40px_rgba(45,212,191,0.3)]">
            <div className="flex flex-col items-center text-gray-400">
              <div className="mb-4 text-sm uppercase tracking-widest">
                Video Coming Soon
              </div>

              <div className="w-20 h-20 rounded-full border-2 border-gray-700 flex items-center justify-center text-2xl group-hover:border-teal-400 group-hover:text-teal-400 transition-all duration-300 group-hover:scale-110">
                ▶
              </div>

              <p className="mt-4 text-sm">
                This is where your VSL will live
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-STEP TRANSFORMATION */}
      <section className="py-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              The <span className="text-teal-400">3-Step</span> Transformation
            </h2>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              No two businesses share the same systems, goals, or structures. That's why every client goes through this process, ensuring the results we deliver are aligned with what matters most to you.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group rounded-2xl bg-gray-800/50 backdrop-blur-sm p-8 shadow-xl border border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:border-teal-400 hover:shadow-[0_0_40px_rgba(45,212,191,0.2)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/20 text-teal-400 font-bold border border-teal-400">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                  Audit
                </h3>
              </div>
              
              <p className="mt-4 text-gray-300 leading-relaxed">
                We analyze your core systems, from internal workflows to external marketing, to pinpoint inefficiencies. Our goal is to transform your current operations into a high-performance engine fueled by strategic automation.
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  "Architectural Visualization & Playbooks",
                  "Friction Diagnostics & Performance Baselines",
                  "Vulnerability Mapping & Contingency Planning",
                  "Economic Impact & Profit-Leak Analysis",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 group/item">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-400/20 text-teal-400 text-sm transition-transform group-hover/item:scale-110">
                      ✓
                    </span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl bg-gray-800/50 backdrop-blur-sm p-8 shadow-xl border border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:border-teal-400 hover:shadow-[0_0_40px_rgba(45,212,191,0.2)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/20 text-teal-400 font-bold border border-teal-400">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                  Consultation
                </h3>
              </div>

              <p className="mt-4 text-gray-300 leading-relaxed">
                We don't just hand over a report and walk away - we present a clear, actionable roadmap and kickstart the implementation process, allowing you to see tangible benefits of our strategy before you commit to a long-term investment.
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  "Rapid Prototyping & Quick Wins",
                  "Operational Proof-of-Concept",
                  "Seamless Integration Support",
                  "Performance Validation & ROI Benchmarking",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 group/item">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-400/20 text-teal-400 text-sm transition-transform group-hover/item:scale-110">
                      ✓
                    </span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl bg-gray-800/50 backdrop-blur-sm p-8 shadow-xl border border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:border-teal-400 hover:shadow-[0_0_40px_rgba(45,212,191,0.2)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/20 text-teal-400 font-bold border border-teal-400">
                  3
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                  Action
                </h3>
              </div>

              <p className="mt-4 text-gray-300 leading-relaxed">
                We fully integrate AI-driven automations across your operations and marketing, targeting every point of leverage to eliminate manual overhead and unlock exponential growth.
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  "Autonomous Operational Engines",
                  "Total Cross-Departmental Synchronization",
                  "Infinite Scalability without Complexity",
                  "Human-Centric High-Value Focus",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 group/item">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-400/20 text-teal-400 text-sm transition-transform group-hover/item:scale-110">
                      ✓
                    </span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <a
              href="/apply"
              className="group inline-flex items-center gap-2 mt-12 px-8 py-4 border-2 border-teal-400 text-teal-400 rounded-xl font-semibold hover:bg-teal-400 hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]"
            >
              Start Your 3-Step Process Now
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section className="py-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              From the <span className="text-teal-400">Blog</span>
            </h2>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              Free resources, insights, and practical tips designed to help trade businesses grow to their full potential using smart digital systems.
            </p>
          </div>

          {/* Blog Cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Why Most Automation Projects Fail",
                excerpt:
                  "The hidden mistakes companies make when implementing automation — and how to avoid them.",
                slug: "/blog/automation-projects-fail",
                image: "/blog/automation-fail.jpg",
              },
              {
                title: "The 3 Systems Every Scalable Business Needs",
                excerpt:
                  "If your business feels stuck, these are the systems likely holding you back.",
                slug: "/blog/essential-business-systems",
                image: "/blog/business-systems.jpg",
              },
              {
                title: "Process Before Tools: A Better Way to Automate",
                excerpt:
                  "Why choosing software too early often leads to more complexity, not less.",
                slug: "/blog/process-before-tools",
                image: "/blog/process-before-tools.jpg",
              },
              {
                title: "How to Identify Automation Opportunities",
                excerpt:
                  "A practical framework for spotting high-ROI automation opportunities.",
                slug: "/blog/identify-automation.jpg",
                image: "/blog/automation-opportunities.jpg",
              },
            ].map((post) => (
              <a
                key={post.slug}
                href={post.slug}
                className="group overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-teal-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(45,212,191,0.2)]"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/10] overflow-hidden bg-gray-900">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-400 leading-relaxed">{post.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-teal-400 group-hover:gap-2 transition-all">
                    Read more
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <a
              href="/blog"
              className="group px-8 py-4 border-2 border-teal-400 text-teal-400 rounded-xl font-semibold hover:bg-teal-400 hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] inline-flex items-center gap-2"
            >
              View all blog posts
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-teal-400 text-sm uppercase tracking-widest text-center mb-4">
            FAQs
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-6">
            Frequently Asked <span className="text-teal-400">Questions</span>
          </h2>

          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16 leading-relaxed">
            Clear answers to the questions most business owners ask before getting started.
          </p>

          <div className="space-y-4">
            {[
              {
                q: "How is this different from any other agency or freelancer?",
                a: [
                  "Most agencies and freelancers focus on individual tasks delivered in isolation.",
                  "We build connected systems across your entire business.",
                  "Instead of more tools to manage, we design workflows that link enquiries, operations, admin, and growth — without relying on you to oversee everything.",
                  "The outcome isn't more activity. It's a business that runs smoothly, scales with control, and doesn't depend on you."
                ]
              },
              {
                q: "Will this actually work for a trade or service business like mine?",
                a: [
                  "Yes, trade and service businesses are ideal for this.",
                  "They often have strong demand but weak systems, which makes the owner the bottleneck. That's exactly what we fix.",
                  "Everything is built around how your business actually operates — not generic theory."
                ]
              },
              {
                q: "How involved do I need to be once things are set up?",
                a: [
                  "Very little.",
                  "Upfront, we get clarity on how you operate and where the friction is. After that, everything is built for you.",
                  "Once live, systems handle the work and you step in only where decisions genuinely matter."
                ]
              },
              {
                q: "Will I still have visibility and control over my business?",
                a: [
                  "Yes, you gain more control, not less.",
                  "Visibility is built into the systems so you always know what's happening without micromanaging."
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
                  "Setup is focused and efficient. Your time investment drops almost entirely once systems go live."
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
                  "• Businesses happy staying small",
                  "• Owners looking for shortcuts",
                  "• People unwilling to modernise",
                  "• Anyone shopping purely on price"
                ]
              }
            ].map((faq, i) => (
              <details 
                key={i}
                className="group border border-gray-700/50 rounded-2xl transition-all duration-300 hover:border-teal-400 open:border-teal-400 open:shadow-[0_0_30px_rgba(45,212,191,0.15)]"
              >
                <summary className="cursor-pointer list-none px-6 py-6 flex justify-between items-center">
                  <span className="font-bold text-lg md:text-xl text-white transition-colors group-hover:text-teal-400 group-open:text-teal-400">
                    {faq.q}
                  </span>
                  <span className="text-gray-400 text-2xl transition-transform group-open:rotate-180 duration-300">⌄</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 space-y-3 leading-relaxed">
                  {faq.a.map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="px-6 py-24 border-t border-gray-800">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-10">
          {/* Heading */}
          <div className="text-white">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-teal-400">
              Get in touch
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Have a question or want to explore whether this is a fit?
              Leave your details and ask any questions you may have, we'll get back to you within 24 hours.
            </p>
          </div>

          {/* Success Message */}
          {contactSuccess && (
            <div className="w-full p-4 bg-teal-500/20 border border-teal-500 rounded-xl text-teal-300">
              ✓ Message sent! We'll get back to you within 24 hours.
            </div>
          )}

          {/* Contact form */}
          <form 
            onSubmit={handleContactSubmit}
            className="w-full bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 space-y-6 transition-all duration-300 hover:border-teal-400/50 hover:shadow-[0_0_40px_rgba(45,212,191,0.1)]"
          >
            <input
              type="text"
              placeholder="Your name"
              value={contactForm.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setContactForm({...contactForm, name: e.target.value})}
              required
              className="w-full px-4 py-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
            />

            <input
              type="email"
              placeholder="Your email"
              value={contactForm.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setContactForm({...contactForm, email: e.target.value})}
              required
              className="w-full px-4 py-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
            />

            <textarea
              placeholder="Your message"
              value={contactForm.message}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContactForm({...contactForm, message: e.target.value})}
              required
              rows={4}
              className="w-full px-4 py-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all resize-none"
            />

            <button
              type="submit"
              disabled={isSubmittingContact}
              className={`group w-full py-4 rounded-xl font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 ${
                isSubmittingContact
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-teal-400 text-black hover:bg-teal-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]'
              }`}
            >
              {isSubmittingContact ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send message
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer bottom */}
        <div className="max-w-6xl mx-auto mt-20 border-t border-gray-800 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social links with SVG icons */}
          <div className="flex items-center gap-6">
            {/* Facebook */}
            <a 
              href="https://www.facebook.com/JPAutomations/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 border border-gray-700 hover:border-teal-400 hover:bg-gray-700 transition-all duration-300 hover:scale-110"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/jpautomations/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 border border-gray-700 hover:border-teal-400 hover:bg-gray-700 transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a 
              href="https://youtube.com/@jpautomations?si=HTkaJJYnbck-d7rQ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 border border-gray-700 hover:border-teal-400 hover:bg-gray-700 transition-all duration-300 hover:scale-110"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} JP Automations. All rights reserved.
          </p>
        </div>
      </section>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        details[open] summary ~ * {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </main>
  )
}