import type { Metadata } from "next"
import WaitlistCTA from "@/app/components/WaitlistCTA"

export const metadata: Metadata = {
  title: "AI X Content Engine — Grow Faster on X (Twitter)",
  description:
    "Generate scroll-stopping tweets, threads, and viral hooks with AI. Goal-based content planning, copywriting, and account strategy for any business growing on X. Pay per use from £1. No subscription required.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/apps/x-content",
  },
  openGraph: {
    title: "AI X Content Engine | JP Automations",
    description:
      "Tweets, threads, content plans, and account strategy — AI-generated for your goals. For any business growing on X. Pay as you go. No monthly contract.",
    url: "https://www.jpautomations.co.uk/apps/x-content",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "X Content Engine — JP Automations",
      },
    ],
  },
}

const features = [
  {
    name: "Content Planner",
    desc: "A full month of X content — dates, formats, funnel stage, hooks, and posting times. Built around your specific growth goal.",
    tokens: 25,
    tokensLabel: "fast",
    icon: "◈",
  },
  {
    name: "Thread Writer",
    desc: "Full threads from a single topic — hook tweet, value chain, and CTA — structured for saves, replies, and follows.",
    tokens: 8,
    icon: "≡",
  },
  {
    name: "Single Tweets",
    desc: "Three variants per prompt — hot takes, viral hooks, and engagement-bait — all under 280 characters.",
    tokens: 2,
    icon: "✦",
  },
  {
    name: "Account Strategy",
    desc: "The exact accounts to reply to and engage with based on your niche and goal. Tiered by audience size with interaction tactics per account.",
    tokens: 5,
    icon: "◎",
  },
]

const steps = [
  {
    n: "01",
    title: "Set your goal",
    desc: "Choose what you're growing toward — brand awareness, lead generation, authority, community, or sales. Everything is built around it.",
  },
  {
    n: "02",
    title: "Generate your plan or post",
    desc: "Get a full month of content or write individual tweets and threads. All output is X-native — no Instagram formats, no carousels.",
  },
  {
    n: "03",
    title: "Know exactly who to engage with",
    desc: "Get a tiered list of accounts to reply to and follow — with specific interaction tactics for each one. The fastest X growth strategy most people ignore.",
  },
]

const faqs = [
  {
    q: "What X formats does the planner use?",
    a: "Only X-native formats: single tweets, threads (5–15 tweets), and polls. The mix is determined by your goal — awareness-focused plans weight toward viral single tweets, lead gen plans toward threads.",
  },
  {
    q: "How does the goal-based planner work?",
    a: "You pick a goal (brand awareness, lead generation, authority, community, or sales). The planner uses a TOFU/MOFU/BOFU funnel model to determine the right mix of awareness, nurture, and conversion content for that goal across the month.",
  },
  {
    q: "Are the account recommendations real accounts?",
    a: "Yes — where possible, the AI recommends specific named accounts in your niche. It also provides archetypes and Twitter search queries so you can find accounts it may not know about. You should verify accounts are still active before following.",
  },
  {
    q: "What's the difference between Fast and Pro plans?",
    a: "Fast (25 tokens) generates a plan in a single pass. Pro (60 tokens) runs up to 3 generation attempts with quality scoring and auto-repair — stronger hooks, better funnel alignment, and more consistent voice.",
  },
  {
    q: "Do tokens expire?",
    a: "No. Tokens never expire and work across all apps — X, Instagram, SEO Blog, and every new app released.",
  },
]

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "X Content Engine",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered X (Twitter) content engine — goal-based content plans, thread writing, single tweet generation, and account interaction strategy. Pay per use with tokens that never expire.",
  url: "https://www.jpautomations.co.uk/apps/x-content",
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

export default function XContentPage() {
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
            <a href="/apps/instagram-content" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Instagram Engine</a>
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
            <span className="text-sm font-medium text-gray-300">X Content Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
            X content built<br />
            <span className="text-teal-400">around your goals.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Goal-based content plans, thread writing, and the exact accounts to engage with.
            Everything is X-native — built for the algorithm, not repurposed from Instagram.
          </p>
          <div id="waitlist">
            <WaitlistCTA />
          </div>
          <p className="text-gray-600 text-sm mt-4">Join the waitlist · Early access coming soon</p>
        </section>

        {/* Features */}
        <section className="px-6 pb-24 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything you need to grow on X</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Four focused tools. One token balance. No fluff, no Instagram formats.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.name}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-teal-400/20 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl text-teal-400">{f.icon}</span>
                  <div className="flex items-center gap-2">
                    {f.tokensLabel && (
                      <span className="text-xs text-gray-600">{f.tokensLabel}</span>
                    )}
                    <span className="text-xs font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-full">
                      {f.tokens} tokens
                    </span>
                  </div>
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
            <p className="text-gray-400">Three steps. Built around your goal from the start.</p>
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

        {/* What makes X different callout */}
        <section className="px-6 pb-24 max-w-4xl mx-auto">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Why X is different</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-400 leading-relaxed">
              <p>
                On Instagram, you post and wait. On X, the fastest growth comes from <span className="text-white font-medium">who you engage with</span>. Replying to a 300K-follower account in your niche puts your name in front of their entire audience — for free.
              </p>
              <p>
                The Account Strategy tool gives you the exact accounts to target, what kind of content to engage with, and how often. Most X growth tools ignore this entirely. We built it as a first-class feature.
              </p>
            </div>
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
              <div className="flex items-center justify-between px-8 py-4">
                <span className="text-sm text-gray-300">Single Tweet (3 variants)</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-teal-400">2 tokens</span>
                  <span className="text-xs text-gray-600">≈ £0.62–£1.00</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-8 py-4">
                <span className="text-sm text-gray-300">Thread (5–12 tweets)</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-teal-400">8 tokens</span>
                  <span className="text-xs text-gray-600">≈ £2.48–£4.00</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-8 py-4">
                <span className="text-sm text-gray-300">Content Plan — Fast</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-teal-400">25 tokens</span>
                  <span className="text-xs text-gray-600">≈ £7.75–£12.50</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-8 py-4">
                <span className="text-sm text-gray-300">Content Plan — Pro</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-teal-400">60 tokens</span>
                  <span className="text-xs text-gray-600">≈ £18.60–£30.00</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-8 py-4">
                <span className="text-sm text-gray-300">Account Strategy</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-teal-400">5 tokens</span>
                  <span className="text-xs text-gray-600">≈ £1.55–£2.50</span>
                </div>
              </div>
            </div>
            <div className="px-8 py-5 bg-white/[0.02] border-t border-white/[0.06]">
              <p className="text-xs text-gray-500">Tokens are £0.50 each at pay-as-you-go, or from £0.31 per token with a bundle. <a href="/pricing" className="text-teal-400 hover:underline">View bundles →</a></p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24">
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20 rounded-2xl p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to stop guessing on X?</h2>
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
              <a href="/apps/instagram-content" className="hover:text-gray-400 transition-colors">Instagram Engine</a>
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
