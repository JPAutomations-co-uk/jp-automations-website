import type { Metadata } from "next"
import WaitlistCTA from "@/app/components/WaitlistCTA"

export const metadata: Metadata = {
  title: "AI LinkedIn Content Engine — Posts, Plans & Images | JP Automations",
  description:
    "Generate high-performing LinkedIn posts, monthly content plans, and images with AI. Built for UK service business owners who want consistent LinkedIn presence without the hours. Pay per use — no subscription.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/apps/linkedin-content",
  },
  openGraph: {
    title: "AI LinkedIn Content Engine | JP Automations",
    description:
      "LinkedIn posts, content plans, and images — AI-generated in your voice. Funnel-mapped strategy, platform-native formatting, and no monthly contract.",
    url: "https://www.jpautomations.co.uk/apps/linkedin-content",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "LinkedIn Content Engine — JP Automations",
      },
    ],
  },
}

const features = [
  {
    name: "Content Plans",
    desc: "A full month of LinkedIn content mapped to your goals — topics, formats, funnel stages, posting times, and hooks. One generation. Done.",
    tokens: 25,
    icon: "◈",
  },
  {
    name: "Post Writer",
    desc: "LinkedIn posts written in your voice — text posts, personal stories, step-by-steps, bold claims, and hot takes. Each one optimised for reach.",
    tokens: 3,
    icon: "✎",
  },
  {
    name: "Batch Writer",
    desc: "Generate up to 20 posts at once from a list of ideas. Batch your content in one session and post throughout the month.",
    tokens: 2,
    icon: "≡",
  },
  {
    name: "Image Creator",
    desc: "AI-generated images sized for LinkedIn — square, portrait, or landscape. On-brand visuals without a designer.",
    tokens: 5,
    icon: "◻",
  },
]

const steps = [
  {
    n: "01",
    title: "Pick your content type",
    desc: "Post writer, content planner, or image creator. Single posts or a full month's calendar in one go.",
  },
  {
    n: "02",
    title: "Describe your business and goals",
    desc: "Tell it your niche, audience, and what you're trying to achieve. The AI handles the research and writing.",
  },
  {
    n: "03",
    title: "Copy and post",
    desc: "Your post is ready in seconds. Copy it, paste it into LinkedIn, and you're done. No editing required.",
  },
]

const linkedinDifferences = [
  {
    title: "Hooks built for the cutoff",
    desc: "LinkedIn cuts your post off after ~210 characters. Our AI writes hooks that stop the scroll and force the 'see more' click before the reader even thinks about it.",
  },
  {
    title: "Platform-native formatting",
    desc: "Short paragraphs, intentional line breaks, 3–5 hashtags max, and no corporate filler. Structured exactly like the posts that top performers publish every week.",
  },
  {
    title: "Sounds like you, not a template",
    desc: "Your brand voice, your industry, your audience. Every post is written around your profile — not pulled from a generic prompt library.",
  },
  {
    title: "Every post serves a purpose",
    desc: "Each piece of content is mapped to a funnel stage — awareness, engagement, or conversion — and tied to a specific growth goal. Nothing is posted just to post.",
  },
]

const faqs = [
  {
    q: "How is this different from just using ChatGPT?",
    a: "ChatGPT doesn't know that LinkedIn cuts off your post at 210 characters, that 3–5 hashtags outperform 15, or that certain post formats get buried by the algorithm. This does. It's built specifically for LinkedIn — not adapted from a general-purpose tool.",
  },
  {
    q: "What post formats does it support?",
    a: "Text posts, personal story (Hook→Story→Lesson), step-by-step breakdowns, bold claims, and hot takes. The content planner also schedules carousels and image posts.",
  },
  {
    q: "Will it sound like me?",
    a: "Yes. When you set up your profile, you define your brand voice, tone, industry, and target audience. Every post is written around that — not around a generic template.",
  },
  {
    q: "How long does it take?",
    a: "Single posts: 10–20 seconds. Batch (up to 20): 30–60 seconds. Content plans: 30–60 seconds.",
  },
  {
    q: "Do tokens expire?",
    a: "No. Tokens never expire and work across every app — LinkedIn, Instagram, SEO Blog Writer, and anything new we release.",
  },
  {
    q: "Can I plan a full month of content in one go?",
    a: "Yes. The Content Planner builds a complete monthly calendar — dates, formats, funnel stages, hooks, and content briefs. One generation, ready to execute.",
  },
]

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LinkedIn Content Engine",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered LinkedIn content generator for UK service business owners. Writes posts, builds monthly content plans, and generates images — in your brand voice, mapped to your growth goals. Pay per use with tokens that never expire.",
  url: "https://www.jpautomations.co.uk/apps/linkedin-content",
  offers: {
    "@type": "Offer",
    price: "0.31",
    priceCurrency: "GBP",
    description: "From £0.31 per token with a bundle. Pay-as-you-go at £0.50 per token.",
  },
  provider: {
    "@type": "Organization",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
}

export default function LinkedInContentPage() {
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
            <a href="/apps/x-content" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">X Content Engine</a>
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
            <span className="text-sm font-medium text-gray-300">LinkedIn Content Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
            LinkedIn content.<br />
            <span className="text-teal-400">Generated in seconds.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered posts, content plans, and images for service business owners who want to build authority on LinkedIn — without spending hours writing.
            In your voice. Pay per use. No subscription.
          </p>
          <div id="waitlist">
            <WaitlistCTA />
          </div>
          <p className="text-gray-600 text-sm mt-4">Join the waitlist · Early access coming soon</p>
        </section>

        {/* Features */}
        <section className="px-6 pb-24 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything you need to stay consistent on LinkedIn</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Four tools. One token balance. Generate what you need, when you need it.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
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

        {/* LinkedIn-specific section */}
        <section className="px-6 pb-24 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Built for how LinkedIn actually works</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Not a general-purpose AI wrapper. Every post is structured for LinkedIn&apos;s algorithm, character limits, and audience behaviour.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {linkedinDifferences.map((d) => (
              <div
                key={d.title}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-teal-400/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{d.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 pb-24 max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-gray-400">Three steps. Zero writing experience needed.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to show up on LinkedIn consistently?</h2>
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
              <a href="/apps/x-content" className="hover:text-gray-400 transition-colors">X Content Engine</a>
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
