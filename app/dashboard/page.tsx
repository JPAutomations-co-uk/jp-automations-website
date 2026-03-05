"use client"

import { useState } from "react"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

const apps = [
  {
    name: "Instagram Content Engine",
    description:
      "Generate scroll-stopping reels, carousels, images, and captions — or plan a full month of strategic content with funnel stages and a visual calendar.",
    videoId: "", // YouTube video ID goes here
    status: "live" as const,
    href: "/dashboard/instagram",
  },
  {
    name: "LinkedIn Content Engine",
    description:
      "Write high-performing LinkedIn posts, plan a month of strategic content across funnel stages, and generate on-brand images — all tuned to LinkedIn's algorithm and your business goals.",
    videoId: "",
    status: "live" as const,
    href: "/dashboard/linkedin",
  },
  {
    name: "SEO Blog Writer",
    description:
      "Generate publish-ready blog posts that rank on Google for local service keywords. Enter a keyword, get a full article with meta tags, FAQs, and internal link suggestions — ready to paste into any CMS.",
    videoId: "",
    status: "live" as const,
    href: "/dashboard/seo-blog",
  },
  {
    name: "YouTube Content Engine",
    description:
      "Find outlier YouTube videos in your niche, analyze why they perform, and generate title variants directly into your research sheet.",
    videoId: "",
    status: "live" as const,
    href: "/dashboard/youtube",
  },
  {
    name: "X Content Engine",
    description:
      "Goal-based monthly content plans, tweet and thread writing, and a tiered account strategy — all X-native. Threads, single tweets, and polls built around your growth goal. No Instagram formats.",
    videoId: "",
    status: "live" as const,
    href: "/dashboard/x",
  },
]

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, tokenBalance } = useAuth()
  const adminEmail = String(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").trim().toLowerCase()
  const isAdmin = user?.email?.trim().toLowerCase() === adminEmail

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="relative z-50">
            <img src="/logo.png" alt="JP Automations" className="h-16 md:h-20 w-auto hover:opacity-80 transition-opacity" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Home</a>
            <a href="/blog" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Blog</a>
            {isAdmin && (
              <a href="/dashboard/analytics" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Analytics</a>
            )}
            <AppsDropdown />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-lg">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                  </svg>
                  <span className="text-sm font-semibold text-teal-400">{tokenBalance}</span>
                  <span className="text-xs text-gray-500">tokens</span>
                </div>
                <UserMenu />
              </>
            ) : (
              <a href="/login?redirect=/dashboard" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all hover:scale-105">
                Sign In
              </a>
            )}
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
          {user ? (
            <a href="/dashboard/settings" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Settings</a>
          ) : (
            <a href="/login?redirect=/dashboard" className="text-4xl font-bold text-teal-400 hover:text-teal-300 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign In</a>
          )}
          <div className="w-16 h-1 bg-gray-800 rounded-full mt-4" />
        </div>
      </div>

      {/* Hero */}
      <section className="relative w-full px-6 pt-40 pb-16 md:pt-48 md:pb-24 overflow-hidden">

        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-xl">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-sm font-medium text-gray-300 tracking-wide">Your Automation Suite</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-6 leading-[1.1]">
            My Apps
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Every system we&apos;ve built for you, ready to run. Pick an app, hit go, and let it work while you don&apos;t.
          </p>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="relative z-10 px-6 pb-32">
        <div className="max-w-6xl mx-auto">

          {/* Divider */}
          <div className="border-t border-white/5 mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {apps.map((app) => (
              <a
                key={app.name}
                href={app.href}
                className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 overflow-hidden hover:border-white/10 hover:shadow-[0_0_40px_rgba(45,212,191,0.06)]"
              >
                {/* Video Embed */}
                <div className="relative aspect-video w-full bg-black/40">
                  {app.videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${app.videoId}`}
                      title={app.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-teal-400/10 group-hover:border-teal-400/30 transition-all duration-300">
                          <svg className="w-6 h-6 text-gray-500 group-hover:text-teal-400 transition-colors ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-600 font-medium tracking-wide uppercase">Video coming soon</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                      {app.name}
                    </h3>
                    {app.status === "live" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-400/10 border border-teal-400/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                        <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">Live</span>
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 leading-relaxed text-[15px]">
                    {app.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Open App
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </a>
            ))}

            {/* Placeholder for next app */}
            <div className="relative flex flex-col rounded-2xl border border-dashed border-white/[0.06] bg-transparent items-center justify-center min-h-[360px] group">
              <div className="flex flex-col items-center gap-4 text-center px-8">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium">More apps coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
