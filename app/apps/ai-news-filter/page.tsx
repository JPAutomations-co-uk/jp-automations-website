import type { Metadata } from "next"
import AiNewsFilterApp from "./AiNewsFilterApp"

export const metadata: Metadata = {
  title: "AI News Filter — Get a Weekly AI Brief Built Around Your Work",
  description:
    "Stop drowning in AI news. Enter your work context, pick your sources, and get a personalised weekly brief — what dropped, what matters for your workflow, and what to test. Free tool.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/apps/ai-news-filter",
  },
  openGraph: {
    title: "AI News Filter | JP Automations",
    description:
      "Weekly AI updates filtered through your specific work context. Stop reading everything. Start acting on what matters.",
    url: "https://www.jpautomations.co.uk/apps/ai-news-filter",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI News Filter — JP Automations",
      },
    ],
  },
}

const steps = [
  { n: "01", title: "Define your sources" },
  { n: "02", title: "Set up intake" },
  { n: "03", title: "Build the filter" },
  { n: "04", title: "Deliver your brief" },
]

const faqs = [
  {
    q: "What is an AI news filter?",
    a: "An AI news filter reads AI-related news from your chosen sources and uses a language model to decide which releases actually impact your specific work. Instead of reading 40+ updates per week, you get 3–5 that matter — filtered through your role, your tools, and your daily tasks.",
  },
  {
    q: "How does the weekly AI brief work?",
    a: "Enter your work context (role, tools, daily tasks), select your sources, and the AI reads everything published that week. It filters out anything irrelevant to your workflow and formats the rest into four sections: what dropped, what's relevant to your work, what to test, and what to safely ignore.",
  },
  {
    q: "Can I use this if I'm not a developer?",
    a: "Yes. Enter your role — copywriter, marketer, video producer, designer — and the AI adapts its filter accordingly. A copywriter gets flagged on text model updates; a video producer gets flagged on generation tools. Everything else is quietly dropped.",
  },
  {
    q: "What sources does the AI news filter use?",
    a: "You pick your own. The tool works best with factual sources: specific X accounts that cover releases without hype, RSS feeds from Anthropic, OpenAI, Google DeepMind, and Hugging Face, and newsletters like The Rundown AI or AI Breakfast.",
  },
  {
    q: "Can I automate this to run every week?",
    a: "Yes. The configured version runs via n8n on a weekly schedule — every Saturday night it pulls your sources, runs the filter, and delivers your brief before Monday morning. Book a call and we'll set up the full automated workflow for you.",
  },
]

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI News Filter",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Weekly AI news filtered through your specific work context. Enter your role and daily tools — get a personalised brief covering what dropped, what matters for your work, and what to test. Free tool by JP Automations.",
  url: "https://www.jpautomations.co.uk/apps/ai-news-filter",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
    description: "Free tool — no account required.",
  },
  provider: {
    "@type": "Organization",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
}

export default function AiNewsFilterPage() {
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
            <a href="/apps/seo-blog" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">
              SEO Blog Writer
            </a>
            <a href="/apps/instagram-content" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">
              Instagram Content
            </a>
            <a href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">
              Pricing
            </a>
            <a
              href="/apply"
              className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all hover:scale-105"
            >
              Book a Call →
            </a>
          </div>
        </div>
      </nav>

      <div className="relative z-10">

        {/* Hero */}
        <section className="px-6 pt-20 pb-20 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-sm font-medium text-gray-300">AI News Filter · Free Tool</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
            The AI news filter<br />
            <span className="text-teal-400">built around your work.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Every week, dozens of AI tools release updates. Most of them don't affect you.
            This filter reads everything and surfaces only what matters for how you actually work.
          </p>
          <a
            href="#configurator"
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]"
          >
            Build my brief ↓
          </a>
          <p className="text-gray-600 text-sm mt-4">Free · No account required · Powered by Claude</p>
        </section>

        {/* How it works — horizontal timeline */}
        <section className="px-6 pb-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How the AI news filter works</h2>
          </div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:flex items-start gap-0">
            {steps.map((s, i) => (
              <div key={s.n} className="flex-1 flex flex-col items-center">
                <div className="flex items-center w-full">
                  {i > 0 && <div className="flex-1 h-px border-t border-white/[0.06]" />}
                  <div className="w-12 h-12 shrink-0 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-400 font-bold text-sm">
                    {s.n}
                  </div>
                  {i < steps.length - 1 && <div className="flex-1 h-px border-t border-white/[0.06]" />}
                </div>
                <p className="text-sm font-medium text-white mt-4 text-center px-3">{s.title}</p>
              </div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden space-y-6">
            {steps.map((s) => (
              <div key={s.n} className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-400 font-bold text-xs">
                  {s.n}
                </div>
                <p className="text-sm font-medium text-white">{s.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive configurator */}
        <AiNewsFilterApp />

        {/* CTA */}
        <section className="px-6 pb-24">
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20 rounded-2xl p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want this running every Sunday automatically?
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              The full workflow runs on n8n — pulling your sources, filtering through Claude, and delivering your brief before Monday morning. We set it up for you.
            </p>
            <a
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]"
            >
              Book a call →
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 pb-24 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-teal-500/20 transition-all"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-white font-medium text-sm list-none">
                  {faq.q}
                  <svg
                    className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform shrink-0 ml-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Also from JP Automations */}
        <section className="px-6 pb-16 max-w-2xl mx-auto text-center">
          <p className="text-gray-500 text-sm mb-4">Also from JP Automations</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/apps/seo-blog"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-teal-400/30 hover:text-white transition-all text-sm font-medium"
            >
              SEO Blog Writer →
            </a>
            <a
              href="/apps/instagram-content"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-teal-400/30 hover:text-white transition-all text-sm font-medium"
            >
              Instagram Content Engine →
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <a href="/">
              <img
                src="/logo.png"
                alt="JP Automations"
                className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity"
              />
            </a>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="/apps/seo-blog" className="hover:text-gray-400 transition-colors">SEO Blog Writer</a>
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
