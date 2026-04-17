"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import MorePageSections from "@/app/components/MorePageSections"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

export default function MorePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <main className="bg-black min-h-screen text-white selection:bg-teal-400 selection:text-black font-sans relative">
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        <div className="absolute inset-0 max-w-7xl mx-auto flex justify-between px-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-px h-full bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent" />
          ))}
        </div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link className="relative z-50" href="/">
            <Image src="/logo.png" alt="JP Automations" width={160} height={64} className="h-11 md:h-16 w-auto hover:opacity-80 transition-opacity" />
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <a href="/blog" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Blog</a>
            <a href="/newsletter" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Newsletter</a>
            <AppsDropdown />
            <a href="/apply" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all">
              Book a Call
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-50 p-2 text-white focus:outline-none"
            aria-label="Open menu"
          >
            <div className="w-8 h-6 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <Link href="/" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <a href="/blog" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Blog</a>
          <a href="/newsletter" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Newsletter</a>
          <AppsMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
          <a href="/apply" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Book a Call</a>
        </div>
      </div>

      <div className="relative z-10 pt-28 md:pt-32">
        <MorePageSections />
      </div>
    </main>
  )
}
