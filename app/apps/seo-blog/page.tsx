import type { Metadata } from "next"
import WaitlistCTA from "@/app/components/WaitlistCTA"

export const metadata: Metadata = {
  title: "AI SEO Blog Writer for UK Small Businesses",
  description:
    "Write publish-ready SEO blog posts that rank on Google in minutes. Keyword research, content planning, and full articles — built for UK local service businesses. From £4.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/apps/seo-blog",
  },
  openGraph: {
    title: "AI SEO Blog Writer for UK Businesses | JP Automations",
    description:
      "Full SEO articles, keyword research, and content plans for UK local service businesses. 800–2,000 words. Pay per article — no subscription.",
    url: "https://www.jpautomations.co.uk/apps/seo-blog",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEO Blog Writer — JP Automations",
      },
    ],
  },
}

const features = [
  {
    name: "SEO Blog Articles",
    desc: "Full publish-ready articles at 800, 1,200, or 2,000 words — with meta title, meta description, FAQ section, and internal link suggestions.",
    tokens: "20–40",
    icon: "◎",
  },
  {
    name: "Keyword Research",
    desc: "Find the exact search terms your customers use on Google. Ranked by intent (transactional, commercial, informational) and competition.",
    tokens: "5",
    icon: "⌕",
  },
  {
    name: "SEO Content Planner",
    desc: "A phased roadmap of blog topics, publishing frequency, and everything else needed to rank in your local area — over 3, 6, or 12 months.",
    tokens: "25",
    icon: "◈",
  },
  {
    name: "Article History",
    desc: "Every article you've generated is stored and accessible — searchable by keyword, location, and date.",
    tokens: "Free",
    icon: "◷",
  },
]

const goals = [
  { label: "Rank on Google", desc: "Maximum local SEO optimisation to outrank competitors" },
  { label: "Answer Questions", desc: "Target People Also Ask and featured snippets" },
  { label: "Show Expertise", desc: "Build trust and authority with local readers" },
  { label: "Drive Enquiries", desc: "Convert readers into calls and booked jobs" },
]

const steps = [
  {
    n: "01",
    title: "Enter your keyword and location",
    desc: "Type the search term you want to rank for and the area you serve. The AI researches local intent before writing.",
  },
  {
    n: "02",
    title: "Choose your goal and length",
    desc: "Pick your article goal — rank on Google, drive enquiries, answer questions — and choose 800, 1,200, or 2,000 words.",
  },
  {
    n: "03",
    title: "Get a publish-ready article",
    desc: "Receive the full article with H1, meta title, meta description, FAQ section, and internal link suggestions. Copy and paste into your CMS.",
  },
]

const faqs = [
  {
    q: "Will the articles actually rank on Google?",
    a: "They're structured to. Every article targets your keyword, includes semantic variations, answers related questions, and follows on-page SEO best practices. Ranking also depends on your domain authority and competition, but the content itself is built to compete.",
  },
  {
    q: "Are the articles written for UK businesses?",
    a: "Yes. The AI writes in British English and targets UK local search intent. You can specify your city or region and it builds content around that area.",
  },
  {
    q: "Can I paste my own writing style?",
    a: "Yes. There's a tone of voice field where you can paste an example of how you write — a website paragraph, a previous blog post, or anything written in your voice. The article will match that style.",
  },
  {
    q: "What format does the article come in?",
    a: "The article renders in the app and can be copied as formatted markdown or downloaded as a .md file — ready to paste into WordPress, Webflow, Squarespace, or any CMS.",
  },
  {
    q: "What's the SEO Planner?",
    a: "It's a full content roadmap for your business — it builds a phased plan of which blog topics to write, in what order, with publishing frequency recommendations and quick wins. Ideal for businesses starting from scratch or trying to overtake a competitor.",
  },
  {
    q: "Do tokens expire?",
    a: "No. Tokens never expire and work across all apps — SEO Blog, Instagram Content Engine, and every new tool released.",
  },
]

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SEO Blog Writer",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI SEO blog writer for UK businesses. Generate publish-ready articles at 800–2,000 words with meta tags, FAQs, and internal link suggestions. Includes keyword research and content planning.",
  url: "https://www.jpautomations.co.uk/apps/seo-blog",
  offers: {
    "@type": "Offer",
    price: "0.31",
    priceCurrency: "GBP",
    description: "From £0.31 per token with a bundle. Articles from 20 tokens (≈ £6–£10).",
  },
  provider: {
    "@type": "Organization",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
}

export default function SEOBlogPage() {
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
            <a href="/apps/instagram-content" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Instagram Content</a>
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
            <span className="text-sm font-medium text-gray-300">SEO Blog Writer</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
            Blog posts that rank.<br />
            <span className="text-teal-400">Written in minutes.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-generated SEO blog articles, keyword research, and content plans — built for UK local service businesses.
            Pay per article, no subscription.
          </p>
          <div id="waitlist">
            <WaitlistCTA />
          </div>
          <p className="text-gray-600 text-sm mt-4">Join the waitlist · Early access coming soon</p>
        </section>

        {/* What's included */}
        <section className="px-6 pb-24 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Four tools inside one app</h2>
            <p className="text-gray-400 max-w-xl mx-auto">From a single article to a full 12-month content strategy — all from your token balance.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.name}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7 hover:border-teal-400/20 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl text-teal-400">{f.icon}</span>
                  <span className="text-xs font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-full">
                    {f.tokens === "Free" ? "Free" : `${f.tokens} tokens`}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Goals */}
        <section className="px-6 pb-24 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Pick your blog goal</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Every article is written with a specific purpose — not just words on a page.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {goals.map((g, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 text-center hover:border-teal-400/20 transition-all">
                <div className="w-10 h-10 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-sm font-bold text-teal-400">{i + 1}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{g.label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 pb-24 max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-gray-400">From keyword to publish-ready article in under a minute.</p>
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
              <p className="text-gray-500 text-sm mt-1">Pay only for what you generate. No monthly fee.</p>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {[
                { label: "800-word article", tokens: 20 },
                { label: "1,200-word article", tokens: 30 },
                { label: "2,000-word article", tokens: 40 },
                { label: "Keyword research (20 ideas)", tokens: 5 },
                { label: "SEO Content Planner", tokens: 25 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between px-8 py-4">
                  <span className="text-sm text-gray-300">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-teal-400">{item.tokens} tokens</span>
                    <span className="text-xs text-gray-600">≈ £{(item.tokens * 0.31).toFixed(2)}–£{(item.tokens * 0.50).toFixed(2)}</span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start ranking on Google this week</h2>
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

        {/* Also see */}
        <section className="px-6 pb-16 max-w-2xl mx-auto text-center">
          <p className="text-gray-500 text-sm mb-4">Also from JP Automations</p>
          <a
            href="/apps/instagram-content"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-teal-400/30 hover:text-white transition-all text-sm font-medium"
          >
            Instagram Content Engine — AI reels, carousels & captions →
          </a>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <a href="/">
              <img src="/logo.png" alt="JP Automations" className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity" />
            </a>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="/apps/instagram-content" className="hover:text-gray-400 transition-colors">Instagram Content</a>
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
