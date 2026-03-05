"use client"

import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "25 Hours Reclaimed, Four Figures Recovered — Invoice Automation Case Study",
  description:
    "How a simple invoicing automation removed 25 hours/week of admin and recovered £2,995 in outstanding payments for a UK roofing contractor.",
  author: {
    "@type": "Organization",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
  publisher: {
    "@type": "Organization",
    name: "JP Automations",
    logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" },
  },
  datePublished: "2026-01-24",
  dateModified: "2026-01-24",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.jpautomations.co.uk/blog/invoice-case-study",
  },
  keywords: [
    "invoice automation UK",
    "invoicing case study",
    "automate invoice chasing",
    "service business automation",
    "roofing contractor automation",
  ],
}

export default function CaseStudy() {
  return (
    <main className="bg-black text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="relative max-w-5xl mx-auto px-6 py-24">
        
        {/* Back to blog */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="text-sm text-gray-400 hover:text-teal-400 transition"
          >
            ← Back to all articles
          </Link>
        </div>

        {/* Header */}
        <div className="mb-16">
          <p className="text-sm text-gray-400 mb-2">
            Published {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="text-teal-400 text-sm font-medium tracking-wide uppercase mb-4">
            Case Study — Roofing Contractor
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6">
            25 Hours Reclaimed.<br />
            <span className="text-teal-400">Four Figures Recovered.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            How a simple invoicing automation eliminated admin and stabilised cash flow.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-20">
          {[
            { value: "25hrs", label: "Reclaimed weekly" },
            { value: "£0", label: "Outstanding" },
            { value: "+£2.9k", label: "Balance increase" },
            { value: "0", label: "New tools" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-2xl md:text-3xl font-bold text-teal-400">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Problem */}
        <section className="mb-20">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">The Problem</h2>
          <p className="text-2xl md:text-3xl font-medium leading-snug mb-8">
            Jobs getting done. Clients happy.<br />
            <span className="text-gray-500">Cash flow unpredictable. Admin eating weeks alive.</span>
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "Invoices sent days late — whenever he 'got round to it'",
              "Follow-ups forgotten entirely",
              "Payments slipping weeks behind",
              "~25 hours/week lost to zero-value admin",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
                <span className="text-red-400 text-sm">✕</span>
                <p className="text-gray-400 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Constraint */}
        <section className="mb-20">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">The Constraint</h2>
          <p className="text-2xl md:text-3xl font-medium leading-snug mb-6">
            The problem wasn't Xero.<br />
            <span className="text-gray-500">It was manual dependency.</span>
          </p>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            As long as invoicing relied on him noticing, remembering, and chasing — it was never going to run properly. But who can be arsed to send invoices on a Friday night after a week on the tools? You'd rather be in the pub. Fair enough.
          </p>
          <p className="text-white font-medium mt-6">
            So we removed him from the process entirely.
          </p>
        </section>

        {/* System */}
        <section className="mb-20">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">The System</h2>
          <p className="text-2xl md:text-3xl font-medium leading-snug mb-8">
            Lightweight automation.<br />
            <span className="text-gray-500">Built around how he already worked.</span>
          </p>
          <div className="space-y-2">
            {[
              "System watches CRM for completed jobs",
              "Invoice generated in Xero instantly — no delay",
              "Unpaid after 48hrs → follow-ups via SMS & WhatsApp",
              "No new tools, no behaviour change, no dashboards",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-teal-400">→</span>
                <p className="text-gray-400">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Before/After Comparison */}
        <section className="mb-20">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">The Proof</h2>
          <p className="text-2xl md:text-3xl font-medium leading-snug mb-10">
            Same business. Same Xero.<br />
            <span className="text-gray-500">Before and after.</span>
          </p>
          
          {/* Side by Side Images */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Before */}
            <div className="relative">
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1.5 bg-red-500/90 text-white text-xs font-medium rounded-full">
                  Before
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <img
                  src="/case-studies/xero-image-1.webp"
                  alt="Xero before automation - £2,995 outstanding"
                  className="w-full"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-red-400 font-bold text-lg">£2,995</span>
                  <span className="text-gray-500 ml-2">owed</span>
                </div>
                <div>
                  <span className="text-white font-bold">£10,966</span>
                  <span className="text-gray-500 ml-2">projected</span>
                </div>
              </div>
            </div>

            {/* After */}
            <div className="relative">
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1.5 bg-teal-400 text-black text-xs font-medium rounded-full">
                  After
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-teal-400/30">
                <img
                  src="/case-studies/xero-image-2.webp"
                  alt="Xero after automation - £0 outstanding"
                  className="w-full"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-teal-400 font-bold text-lg">£0</span>
                  <span className="text-gray-500 ml-2">owed</span>
                </div>
                <div>
                  <span className="text-white font-bold">£13,921</span>
                  <span className="text-gray-500 ml-2">projected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="bg-teal-400/5 border border-teal-400/20 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-teal-400 font-bold text-xl">+£2,955 projected. £0 outstanding.</p>
              <p className="text-gray-500 text-sm">Same 30-day window. Different system.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-red-400">£2,995</span>
              <span>→</span>
              <span className="text-teal-400 font-bold">£0</span>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mb-20">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">The Result</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "25 hours a week reclaimed",
              "Four figures in recovered revenue",
              "Cash flow stabilised",
              "Invoicing out of his head",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-teal-400/5 border border-teal-400/10 rounded-lg px-4 py-3">
                <span className="text-teal-400 text-sm">✓</span>
                <p className="text-white text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 mt-6">
            Same clients. Same pricing. Same workload. One system removed the bottleneck.
          </p>
        </section>

        {/* Who This Is For */}
        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-xl font-bold mb-3">Who This Is For</h2>
          <p className="text-gray-400">
            Trade and service businesses doing £7.5k–£10k+ per month — where the work gets done, but admin and cash flow lag behind.
          </p>
          <p className="text-white font-medium mt-4">
            If invoicing still depends on you remembering, you're paying for it.
          </p>
        </section>

        {/* CTA */}
        <section className="mb-20 bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Want this for your business?
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Book a free systems audit. I'll show you where time and money are leaking.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-medium rounded-xl hover:bg-teal-300 transition"
          >
            Book a Free Audit
          </Link>
        </section>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl text-sm hover:border-teal-400 hover:text-teal-400 transition"
          >
            ← All Case Studies
          </Link>
          <Link
            href="/blog/essential-business-systems"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl text-sm hover:border-teal-400 hover:text-teal-400 transition"
          >
            Read: 3 Systems Every Business Needs →
          </Link>
          <Link
            href="/blog/automate-client-follow-up-uk-service-businesses"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl text-sm hover:border-teal-400 hover:text-teal-400 transition"
          >
            Read: Automate Client Follow-Up →
          </Link>
          <Link
            href="/ai-automation-for-service-businesses"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl text-sm hover:border-teal-400 hover:text-teal-400 transition"
          >
            AI Automation for Service Businesses →
          </Link>
        </div>
      </article>
    </main>
  )
}