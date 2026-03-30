"use client"

import { useState, useRef, useEffect } from "react"

const apps = [
  {
    href: "/apps/social-engine",
    name: "Social Media Engine",
    desc: "Instagram, LinkedIn, X & YouTube",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.97.633-3.792 1.708-5.272" />
      </svg>
    ),
  },
  {
    href: "/apps/seo-blog",
    name: "SEO Blog Writer",
    desc: "Articles, keywords & content plans",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
      </svg>
    ),
  },
]

export function AppsDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold border border-teal-400/40 text-teal-400 rounded-lg hover:bg-teal-400/10 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]"
      >
        Apps
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* Dashboard link */}
          <a
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.04] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-gray-500 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">My Dashboard</p>
              <p className="text-xs text-gray-600">Open your apps</p>
            </div>
          </a>

          <div className="border-t border-white/[0.06] mx-4 my-1" />
          <p className="px-4 py-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Available Apps</p>

          {apps.map((app) => (
            <a
              key={app.href}
              href={app.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center shrink-0 text-teal-400">
                {app.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors leading-tight">{app.name}</p>
                <p className="text-xs text-gray-600 mt-0.5">{app.desc}</p>
              </div>
            </a>
          ))}

          <div className="border-t border-white/[0.06] p-3">
            <a
              href="/pricing"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold text-gray-500 hover:text-teal-400 transition-colors"
            >
              View pricing →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

/** Mobile version — renders a single Apps link for use inside a mobile menu */
export function AppsMobileLinks({ onClose }: { onClose: () => void }) {
  return (
    <a
      href="/dashboard"
      className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors"
      onClick={onClose}
    >
      Apps
    </a>
  )
}
