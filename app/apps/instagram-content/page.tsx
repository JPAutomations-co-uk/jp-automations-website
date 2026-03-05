import type { Metadata } from "next"
import WaitlistCTA from "@/app/components/WaitlistCTA"

export const metadata: Metadata = {
  title: "AI Instagram Content Generator",
  description:
    "Generate scroll-stopping Instagram reels, carousels, images, and captions with AI. For any business growing on Instagram. Pay per use from £2.50. No subscription required.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/apps/instagram-content",
  },
  openGraph: {
    title: "AI Instagram Content Generator | JP Automations",
    description:
      "Reels, carousels, single images, and captions — AI-generated for your brand. For any business growing on Instagram. Pay as you go from £2.50. No monthly contract.",
    url: "https://www.jpautomations.co.uk/apps/instagram-content",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "Instagram Content Engine — JP Automations",
      },
    ],
  },
}

const features = [
  {
    name: "AI Reels",
    desc: "Script, storyboard, and generate short-form video reels tailored to your niche and brand style.",
    tokens: 15,
    icon: "▶",
  },
  {
    name: "Carousel Posts",
    desc: "7-slide carousels generated from a single topic — designed for saves, shares, and reach.",
    tokens: 10,
    icon: "⊞",
  },
  {
    name: "Single Images",
    desc: "Branded AI-generated images in any aspect ratio — square, portrait, story, or landscape.",
    tokens: 5,
    icon: "◻",
  },
  {
    name: "Captions",
    desc: "Scroll-stopping captions with hooks, hashtags, and calls to action matched to the post.",
    tokens: 1,
    icon: "✎",
  },
  {
    name: "Content Plans",
    desc: "A full month of planned content — topics, formats, posting schedule, and funnel strategy.",
    tokens: 25,
    icon: "◈",
  },
  {
    name: "Ad Creatives",
    desc: "Meta-ready ad images and copy for paid campaigns — single images or carousels.",
    tokens: 10,
    icon: "◎",
  },
]

const steps = [
  {
    n: "01",
    title: "Pick your content type",
    desc: "Choose from reels, carousels, single images, captions, content plans, or ad creatives.",
  },
  {
    n: "02",
    title: "Describe what you want",
    desc: "Enter your topic, brand style, or a simple prompt. The AI does the research and creative work.",
  },
  {
    n: "03",
    title: "Download and post",
    desc: "Your content is ready in seconds. Download it and post directly to Instagram — no editing needed.",
  },
]

const faqs = [
  {
    q: "Do I need design experience?",
    a: "No. The entire process is prompt-based. Describe what you want in plain English and the AI generates the content.",
  },
  {
    q: "What aspect ratios are supported?",
    a: "Square (1:1), portrait (4:5), story/reel (9:16), and landscape (16:9) — all standard Instagram formats.",
  },
  {
    q: "Can I use my own brand colours and style?",
    a: "Yes. During onboarding you define your brand style, and all generated content will reflect it consistently.",
  },
  {
    q: "How long does generation take?",
    a: "Single images take 10–20 seconds. 7-slide carousels take 30–60 seconds. Reels take 1–2 minutes.",
  },
  {
    q: "Do tokens expire?",
    a: "No. Tokens never expire and work across all apps — Instagram, SEO Blog, and every new app released.",
  },
]

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Instagram Content Engine",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered Instagram content generator — reels, carousels, single images, captions, content plans, and ad creatives. For any business growing on Instagram. Pay per use with tokens that never expire.",
  url: "https://www.jpautomations.co.uk/apps/instagram-content",
  offers: {
    "@type": "Offer",
    price: "0.31",
    priceCurrency: "GBP",
    description: "From £0.31 per token with a bundle. Pay-as-you-go from £0.50 per token.",
  },
  provider: {
    "@type": "Organization",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
}

export default function InstagramContentPage() {
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

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:48px_48px]"
          style={{ maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)" }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500/8 blur-[120px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 px-6 py-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/">
            <img src="/logo.png" alt="JP Automations" className="h-14 w-auto hover:opacity-80 transition-opacity" />
          </a>
          <div className="flex items-center gap-6">
            <a href="/apps/seo-blog" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">SEO Blog Writer</a>
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

        {/* Hero */}
        <section className="px-6 pt-20 pb-24 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-sm font-medium text-gray-300">Instagram Content Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
            Instagram content.<br />
            <span className="text-teal-400">Generated in seconds.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered reels, carousels, images, and captions for any business that wants to grow faster on Instagram.
            Pay per use — no monthly subscription, no wasted spend.
          </p>
          <div id="waitlist">
            <WaitlistCTA />
          </div>
          <p className="text-gray-600 text-sm mt-4">Join the waitlist · Early access coming soon</p>
        </section>

        {/* Features */}
        <section className="px-6 pb-24 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything you need to stay consistent on Instagram</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Six content types. One token balance. Generate what you need, when you need it.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.name}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-teal-400/20 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl text-teal-400">{f.icon}</span>
                  <span className="text-xs font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-full">
                    {f.tokens} tokens
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 pb-24 max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-gray-400">Three steps. Zero design experience needed.</p>
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

        {/* Token pricing */}
        <section className="px-6 pb-24 max-w-3xl mx-auto">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-white/[0.06]">
              <h2 className="text-xl font-bold text-white">Token pricing</h2>
              <p className="text-gray-500 text-sm mt-1">Pay only for what you generate. Tokens never expire.</p>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {features.map((f) => (
                <div key={f.name} className="flex items-center justify-between px-8 py-4">
                  <span className="text-sm text-gray-300">{f.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-teal-400">{f.tokens} tokens</span>
                    <span className="text-xs text-gray-600">≈ £{(f.tokens * 0.31).toFixed(2)}–£{(f.tokens * 0.50).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-8 py-5 bg-white/[0.02] border-t border-white/[0.06]">
              <p className="text-xs text-gray-500">Tokens are £0.50 each at pay-as-you-go, or from £0.31 per token with a bundle. <a href="/pricing" className="text-teal-400 hover:underline">View bundles →</a></p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24">
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20 rounded-2xl p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to stop stressing about content?</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              We&apos;re opening early access soon. Join the waitlist and be first in line.
            </p>
            <WaitlistCTA />
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 pb-24 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-teal-500/20 transition-all">
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-white font-medium text-sm list-none">
                  {faq.q}
                  <svg className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <a href="/">
              <img src="/logo.png" alt="JP Automations" className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity" />
            </a>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="/apps/seo-blog" className="hover:text-gray-400 transition-colors">SEO Blog Writer</a>
              <a href="/pricing" className="hover:text-gray-400 transition-colors">Pricing</a>
              <a href="/blog" className="hover:text-gray-400 transition-colors">Blog</a>
              <a href="/apply" className="hover:text-gray-400 transition-colors">Book a Call</a>
            </div>
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} JP Automations</p>
          </div>
        </footer>

      </div>
    </main>
  )
}
