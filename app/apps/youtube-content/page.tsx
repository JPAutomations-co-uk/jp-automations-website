/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
import type { Metadata } from "next"
import WaitlistCTA from "@/app/components/WaitlistCTA"

export const metadata: Metadata = {
  title: "YouTube Content Engine — Outliers, Titles & Research",
  description:
    "Discover YouTube outliers in your niche and generate high-performing title variants in one workflow.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/apps/youtube-content",
  },
  openGraph: {
    title: "YouTube Content Engine | JP Automations",
    description:
      "Run niche outlier scans and generate title variants straight into Google Sheets.",
    url: "https://www.jpautomations.co.uk/apps/youtube-content",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "YouTube Content Engine — JP Automations",
      },
    ],
  },
}

const features = [
  {
    name: "Outlier Detection",
    desc: "Scan YouTube for videos outperforming their channel baseline and score them automatically.",
    tokens: 10,
    icon: "▲",
  },
  {
    name: "Transcript Summaries",
    desc: "Get plain-language summaries of top outliers so you can extract hooks, structure, and framing fast.",
    tokens: "included",
    icon: "≡",
  },
  {
    name: "Title Variants",
    desc: "Generate multiple title options directly into your outlier sheet to speed up ideation and testing.",
    tokens: 3,
    icon: "✦",
  },
  {
    name: "Sheet-First Workflow",
    desc: "Everything lands in Google Sheets, so your research, ideas, and production queue stay in one place.",
    tokens: "included",
    icon: "◎",
  },
]

const steps = [
  {
    n: "01",
    title: "Run outlier scan",
    desc: "Set keywords, lookback window, and thresholds. The engine finds high-leverage videos and writes results to a sheet.",
  },
  {
    n: "02",
    title: "Review the winners",
    desc: "Use the outlier score, views, and transcript summaries to identify repeatable formats and narrative patterns.",
  },
  {
    n: "03",
    title: "Generate title options",
    desc: "Create title variants from top performers and feed them into your production pipeline.",
  },
]

const faqs = [
  {
    q: "Do I need API keys to use this app?",
    a: "Yes. Outlier scans require APIFY and Anthropic keys, plus Google credentials for sheet writing. We provide setup docs in your workspace.",
  },
  {
    q: "Can I use my own niche keywords?",
    a: "Yes. You can pass custom keyword lists for each run and tune the lookback window, score threshold, and processing depth.",
  },
  {
    q: "Where do outputs go?",
    a: "Results are written to Google Sheets. You’ll get a direct sheet URL after each run.",
  },
  {
    q: "Do tokens expire?",
    a: "No. Tokens are shared across all apps and never expire.",
  },
]

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "YouTube Content Engine",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered YouTube research engine for outlier detection, transcript summaries, and title variant generation.",
  url: "https://www.jpautomations.co.uk/apps/youtube-content",
  offers: {
    "@type": "Offer",
    price: "0.31",
    priceCurrency: "GBP",
    description: "From £0.31 per token with bundles.",
  },
  provider: {
    "@type": "Organization",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
}

export default function YoutubeContentPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }

  return (
    <main className="bg-black min-h-screen text-white selection:bg-teal-400 selection:text-black font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:48px_48px]"
          style={{ maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)" }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500/8 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 px-6 py-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/">
            <img src="/logo.png" alt="JP Automations" className="h-14 w-auto hover:opacity-80 transition-opacity" />
          </a>
          <div className="flex items-center gap-6">
            <a href="/apps/instagram-content" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Instagram Engine</a>
            <a href="/apps/x-content" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">X Engine</a>
            <a href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Pricing</a>
            <a
              href="#waitlist"
              className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all hover:scale-105"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        <section className="px-6 pt-20 pb-24 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-sm font-medium text-gray-300">YouTube Content Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
            Build YouTube ideas from<br />
            <span className="text-teal-400">real outlier data.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Find high-performing videos in your niche, analyze why they worked, and generate title variants ready for your next uploads.
          </p>
          <div id="waitlist">
            <WaitlistCTA />
          </div>
          <p className="text-gray-600 text-sm mt-4">Join the waitlist · Early access coming soon</p>
        </section>

        <section className="px-6 pb-24 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What you can do</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Research, analysis, and title ideation in one pipeline.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.name}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-teal-400/20 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl text-teal-400">{f.icon}</span>
                  <span className="text-xs font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-full">
                    {typeof f.tokens === "number" ? `${f.tokens} tokens` : f.tokens}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-24 max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-gray-400">From signal to content decisions in three steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 font-bold text-sm mb-5">
                  {s.n}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-24 max-w-3xl mx-auto">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-white/[0.06]">
              <h2 className="text-xl font-bold text-white">FAQ</h2>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {faqs.map((faq) => (
                <div key={faq.q} className="px-8 py-6">
                  <h3 className="text-sm font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
