"use client"

import { useState } from "react"
import { useAuth } from "@/app/components/AuthProvider"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

const TOKEN_PACKS = [
  { tokens: 50, price: 20, label: "Starter", sublabel: "50 tokens", badge: null },
  { tokens: 150, price: 55, label: "Growth", sublabel: "150 tokens", badge: "Save 27%" },
  { tokens: 350, price: 110, label: "Pro Bundle", sublabel: "350 tokens", badge: "Best Value" },
]

const TOKEN_COSTS = [
  { app: "Instagram", feature: "Content Plan", tokens: 25 },
  { app: "Instagram", feature: "AI Reel (30s)", tokens: 15 },
  { app: "Instagram", feature: "Carousel (7 slides)", tokens: 10 },
  { app: "Instagram", feature: "Single Image", tokens: 5 },
  { app: "Instagram", feature: "Highlight Cover", tokens: 3 },
  { app: "Instagram", feature: "Caption Regen", tokens: 1 },
  { app: "LinkedIn", feature: "Content Plan", tokens: 25 },
  { app: "LinkedIn", feature: "Post Writer", tokens: 3 },
  { app: "LinkedIn", feature: "Batch Writer (per post)", tokens: 2 },
  { app: "LinkedIn", feature: "Image Creator", tokens: 5 },
  { app: "SEO Blog", feature: "Blog (800 words)", tokens: 20 },
  { app: "SEO Blog", feature: "Blog (1,200 words)", tokens: 30 },
  { app: "SEO Blog", feature: "Blog (2,000 words)", tokens: 40 },
  { app: "SEO Blog", feature: "Keyword Research", tokens: 5 },
  { app: "SEO Blog", feature: "SEO Planner", tokens: 25 },
]

const tiers = [
  {
    name: "Pay As You Go",
    priceLine: "£0.50",
    priceSub: "/token",
    description: "Buy tokens and spend them across any app — Instagram, LinkedIn, SEO blogs, and more.",
    features: [
      "Works across all apps — one token balance",
      "Instagram: reels, carousels, images, highlights",
      "LinkedIn: posts, content plans, images",
      "SEO Blog: articles, keyword research, content plans",
      "Tokens never expire",
      "Buy any amount — no minimum",
    ],
    cta: "Buy Tokens",
    popular: false,
    tier: "payg",
  },
  {
    name: "Business Plan",
    priceLine: "Custom",
    priceSub: "per month",
    description: "Book a call with JP. We'll define which apps you need, how many tokens per month, and build a custom plan.",
    features: [
      "Custom token allocation across all apps",
      "Better per-token rate at scale",
      "Instagram content engine included",
      "LinkedIn content engine included",
      "SEO blog generation included",
      "Strategy session with JP",
      "Priority support",
    ],
    cta: "Book a Call",
    popular: true,
    tier: "business",
  },
]

export default function PricingPage() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [loadingPack, setLoadingPack] = useState<number | null>(null)
  const [loadingCustom, setLoadingCustom] = useState(false)
  const [customAmount, setCustomAmount] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  const customTokens = parseInt(customAmount) || 0
  const customPrice = (customTokens * 0.5).toFixed(2)

  const handleSelectTier = async (tier: string) => {
    if (tier === "payg") {
      setShowTokenModal(true)
      return
    }
    if (tier === "business") {
      window.location.href = "/apply"
      return
    }
    if (!user) {
      window.location.href = `/login?redirect=/pricing`
      return
    }
    setLoadingTier(tier)
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, billingCycle: "monthly" }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setLoadingTier(null)
      }
    } catch {
      setLoadingTier(null)
    }
  }

  const handleBuyTokens = async (tokens: number) => {
    if (!user) {
      window.location.href = `/login?redirect=/pricing`
      return
    }
    setLoadingPack(tokens)
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "tokens", tokenPack: tokens }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setLoadingPack(null)
      }
    } catch {
      setLoadingPack(null)
    }
  }

  const handleBuyCustomTokens = async () => {
    if (customTokens < 1) return
    if (!user) {
      window.location.href = `/login?redirect=/pricing`
      return
    }
    setLoadingCustom(true)
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "tokens", tokenPack: customTokens }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setLoadingCustom(false)
      }
    } catch {
      setLoadingCustom(false)
    }
  }

  return (
    <main className="bg-black min-h-screen text-white selection:bg-teal-400 selection:text-black font-sans relative">

      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)' }}
        />
        <div className="absolute inset-0 max-w-7xl mx-auto border-x border-white/5">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent -translate-x-1/2" />
          <div className="hidden md:block absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-white/5 to-transparent" />
          <div className="hidden md:block absolute right-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-white/5 to-transparent" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-teal-900/20 via-black/50 to-transparent blur-3xl" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* NOISE TEXTURE */}
      <div className="fixed inset-0 z-[1] opacity-[0.2] pointer-events-none mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* --- TOKEN MODAL --- */}
      {showTokenModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowTokenModal(false)} />
          <div className="relative bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowTokenModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-white mb-2">Buy Tokens</h3>
            <p className="text-gray-400 text-sm mb-6">One token balance — use across all apps. Instagram, LinkedIn, SEO blogs, and more.</p>

            {/* Custom amount */}
            <div className="mb-6 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Custom amount — £0.50/token</p>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter tokens"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-400/50 transition-colors"
                  />
                </div>
                <button
                  onClick={handleBuyCustomTokens}
                  disabled={customTokens < 1 || loadingCustom}
                  className="px-4 py-3 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm font-semibold hover:border-teal-400/50 hover:bg-teal-400/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loadingCustom ? "..." : customTokens > 0 ? `Buy for £${customPrice}` : "Buy"}
                </button>
              </div>
            </div>

            {/* Bundle packs */}
            <div className="mb-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Or save with a bundle</p>
              <div className="space-y-3">
                {TOKEN_PACKS.map((pack) => (
                  <button
                    key={pack.tokens}
                    onClick={() => handleBuyTokens(pack.tokens)}
                    disabled={loadingPack === pack.tokens}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-teal-400/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="text-white font-semibold text-sm">{pack.label} <span className="text-gray-500 font-normal">— {pack.sublabel}</span></div>
                        <div className="text-gray-500 text-xs">£{(pack.price / pack.tokens).toFixed(2)}/token</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {pack.badge && (
                        <span className="text-[10px] font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {pack.badge}
                        </span>
                      )}
                      <span className="text-white font-bold group-hover:text-teal-400 transition-colors">
                        {loadingPack === pack.tokens ? "..." : `£${pack.price}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-4">
              {["Instagram", "LinkedIn", "SEO Blog"].map((app) => (
                <div key={app}>
                  <p className="text-xs text-gray-600 font-medium mb-2 uppercase tracking-wider">{app}</p>
                  <div className="space-y-1.5">
                    {TOKEN_COSTS.filter(i => i.app === app).map((item) => (
                      <div key={item.feature} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{item.feature}</span>
                        <span className="text-teal-400 font-medium">{item.tokens} tokens</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs text-center mt-4">Tokens never expire. Use them whenever you want.</p>
          </div>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="relative z-50">
            <img src="/logo.png" alt="JP Automations" className="h-16 md:h-20 w-auto hover:opacity-80 transition-opacity" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Home</a>
            <a href="/blog" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Blog</a>
            <AppsDropdown />
            <a href="/apply" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]">
              Book Call
            </a>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-50 p-2 text-white focus:outline-none"
          >
            <div className="w-8 h-6 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <a href="/" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="/blog" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Blog</a>
          <AppsMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
          <a href="/apply" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Book a Call</a>
          <div className="w-16 h-1 bg-gray-800 rounded-full mt-4" />
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-teal-400 mb-4">Pricing</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              One balance. Every app.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Tokens work across Instagram, LinkedIn, SEO blogs, and every app we build — buy once, use anywhere.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {tiers.map((tier) => {
              const isLoading = loadingTier === tier.tier

              return (
                <div
                  key={tier.name}
                  className={`relative group rounded-2xl p-8 transition-all duration-500 ${
                    tier.popular
                      ? "bg-white/[0.04] border-2 border-teal-400/50 hover:border-teal-400"
                      : "bg-white/[0.02] border border-white/[0.06] hover:border-teal-500/30 hover:bg-white/[0.04]"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="text-xs font-bold text-black bg-teal-400 px-4 py-1.5 rounded-full uppercase tracking-wider">
                        Primary Offer
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-white mb-2">{tier.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{tier.description}</p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-white">{tier.priceLine}</span>
                      <span className="text-gray-500">{tier.priceSub}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectTier(tier.tier)}
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 mb-8 ${
                      tier.popular
                        ? "bg-teal-400 text-black hover:bg-teal-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]"
                        : "bg-white/[0.06] text-white border border-white/10 hover:border-teal-400/50 hover:bg-teal-400/10"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? "Redirecting..." : tier.cta}
                  </button>

                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                        <svg className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Token bundles row */}
          <div className="mt-10 max-w-4xl mx-auto">
            <p className="text-xs text-gray-600 text-center uppercase tracking-widest mb-5">Or buy a token bundle</p>
            <div className="grid md:grid-cols-3 gap-4">
              {TOKEN_PACKS.map((pack) => (
                <button
                  key={pack.tokens}
                  onClick={() => { setShowTokenModal(true) }}
                  className="group flex flex-col items-center gap-1 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-teal-400/30 hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-lg">£{pack.price}</span>
                    {pack.badge && (
                      <span className="text-[10px] font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {pack.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-sm">{pack.label} — {pack.sublabel}</span>
                  <span className="text-gray-600 text-xs">£{(pack.price / pack.tokens).toFixed(2)}/token</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl px-8 py-5">
              <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">No commitment</p>
                <p className="text-gray-500 text-xs">Tokens never expire. Buy what you need, use them at your own pace.</p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-24 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Buy tokens",
                  description: "Pick any amount at £0.50/token or grab a bundle for a better rate. Your balance works across every app.",
                },
                {
                  step: "02",
                  title: "Open any app",
                  description: "Instagram, LinkedIn, SEO Blog — pick what you need and spend tokens on the output.",
                },
                {
                  step: "03",
                  title: "Get publish-ready output",
                  description: "Reels, carousels, captions, blog articles, keyword plans — all ready to post or publish immediately.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 font-bold text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-24 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "What do I actually receive?",
                  a: "A Google Sheet with your content calendar, captions, and reel scripts — plus a Google Drive folder with all your carousel images, slide designs, and AI-generated video files. Everything is ready to post.",
                },
                {
                  q: "How does the token system work?",
                  a: "Tokens are your currency across all apps. Instagram: a reel costs 15 tokens, a carousel 10, a caption regen 1. LinkedIn: a content plan costs 25 tokens, a post 3, a batch post 2, an image 5. SEO Blog: an 800-word article costs 20, a 1,200-word article 30, keyword research 5. Buy any number at £0.50/token, or save with a bundle. Tokens never expire.",
                },
                {
                  q: "What apps do tokens work across?",
                  a: "The Instagram Content Engine (reels, carousels, images, captions, highlight covers), the LinkedIn Content Engine (posts, content plans, images), and the SEO Blog Writer (full articles, keyword research, content planners). Every new app we release will use the same token balance.",
                },
                {
                  q: "What is the Business Plan?",
                  a: "Book a call with JP and we'll build a custom monthly package based on which apps you need and how much content you want. You get a better per-token rate at volume, a regular delivery cadence, and a dedicated strategy session.",
                },
                {
                  q: "How is the content tailored to my business?",
                  a: "During onboarding, you tell us about your brand, audience, goals, and style. Our AI then researches your niche, discovers your competitors, analyses what works, and creates a strategic blueprint before generating any content.",
                },
                {
                  q: "Do I need to provide any images or videos?",
                  a: "No. All carousel images, slide designs, and video reels are AI-generated based on your brand style. You can also upload your own clips and we'll edit them into optimised reels.",
                },
                {
                  q: "What if I'm in a niche industry?",
                  a: "The system works for any business. During setup, our AI automatically discovers competitors and top performers in your specific niche, no matter how specialised.",
                },
                {
                  q: "How long until I get my first content?",
                  a: "Your first content is delivered within 24-48 hours of completing the onboarding form.",
                },
              ].map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-teal-500/30 transition-all"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-white font-medium text-sm list-none">
                    {faq.q}
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform shrink-0 ml-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/">
            <img src="/logo.png" alt="JP Automations" className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity" />
          </a>
          <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} JP Automations. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
