"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

const platforms = [
  { id: "instagram", label: "Instagram", href: "/dashboard/social-engine/instagram" },
  { id: "linkedin", label: "LinkedIn", href: "/dashboard/social-engine/linkedin" },
  { id: "x", label: "X", href: "/dashboard/social-engine/x" },
  { id: "youtube", label: "YouTube", href: "/dashboard/social-engine/youtube" },
  { id: "tone", label: "Tone", href: "/dashboard/social-engine/tone" },
  { id: "analytics", label: "Analytics", href: "/dashboard/social-engine/analytics" },
  { id: "settings", label: "Settings", href: "/dashboard/settings" },
]

export default function SocialEngineLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, tokenBalance } = useAuth()
  const pathname = usePathname()

  const activePlatform = platforms.find((p) => pathname.startsWith(p.href))?.id ?? null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="relative z-50">
              <img src="/logo.png" alt="JP Automations" className="h-12 md:h-14 w-auto hover:opacity-80 transition-opacity" />
            </a>
            <div className="hidden md:block h-6 w-px bg-white/10" />
            <a href="/dashboard" className="hidden md:flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-400 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              All Apps
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <AppsDropdown />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg">
                  <svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                  </svg>
                  <span className="text-sm font-semibold text-teal-400 tabular-nums">{tokenBalance}</span>
                </div>
                <UserMenu />
              </>
            ) : (
              <a href="/login?redirect=/dashboard/social-engine" className="px-4 py-2 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all">
                Sign In
              </a>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden relative z-50 p-2 text-white">
            <div className="w-7 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-6 text-center">
          <a href="/" className="text-3xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="/dashboard" className="text-3xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>All Apps</a>
          <div className="w-12 h-px bg-white/10 my-1" />
          {platforms.map((p) => (
            <a
              key={p.id}
              href={p.href}
              className={`text-2xl font-bold transition-colors ${activePlatform === p.id ? "text-teal-400" : "text-gray-400 hover:text-teal-400"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {p.label}
            </a>
          ))}
          <div className="w-12 h-px bg-white/10 my-1" />
          <AppsMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
          {user ? (
            <div className="flex items-center gap-2 mt-2">
              <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
              </svg>
              <span className="text-lg font-semibold text-teal-400">{tokenBalance} tokens</span>
            </div>
          ) : (
            <a href="/login?redirect=/dashboard/social-engine" className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign In</a>
          )}
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="fixed top-[80px] md:top-[88px] left-0 right-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {platforms.map((p) => (
              <a
                key={p.id}
                href={p.href}
                className={`shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activePlatform === p.id
                    ? "bg-teal-400/10 text-teal-400 border border-teal-400/30"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {p.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 pt-36 md:pt-40 pb-32 px-4 md:px-6">
        {children}
      </main>
    </div>
  )
}
