"use client"

import { useAuth } from "@/app/components/AuthProvider"

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Reels, carousels, images, captions, content plans, and ad creatives.",
    href: "/dashboard/social-engine/instagram",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Posts, content plans, batch writing, and on-brand images.",
    href: "/dashboard/social-engine/linkedin",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    id: "x",
    name: "X (Twitter)",
    description: "Tweets, threads, content plans, and account strategy.",
    href: "/dashboard/social-engine/x",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Outlier detection, title variants, and research sheets.",
    href: "/dashboard/social-engine/youtube",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.5A2.25 2.25 0 0 1 4.5 5.25h15A2.25 2.25 0 0 1 21.75 7.5v9a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 16.5v-9Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m10 9.75 4 2.25-4 2.25v-4.5Z" />
      </svg>
    ),
  },
]

export default function SocialEnginePage() {
  const { tokenBalance } = useAuth()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-300">Social Media Engine</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          Choose a Platform
        </h1>
        <p className="text-gray-500">
          Select a platform to start creating content. One token balance across all platforms.
        </p>
      </div>

      {/* Token Balance */}
      <div className="mb-8 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
        <span className="text-sm text-gray-400">Token Balance</span>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
          </svg>
          <span className="text-lg font-bold text-teal-400 tabular-nums">{tokenBalance}</span>
          <span className="text-sm text-gray-500">tokens</span>
        </div>
      </div>

      {/* Tone of Voice */}
      <a
        href="/dashboard/social-engine/tone"
        className="group mb-8 flex items-center gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-teal-400/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.06)]"
      >
        <div className="w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center shrink-0 text-teal-400 group-hover:bg-teal-400/20 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
            Tone of Voice
          </h3>
          <p className="text-xs text-gray-500">Set your writing style — used across all platforms.</p>
        </div>
        <span className="text-sm font-semibold text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </a>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((p) => (
          <a
            key={p.id}
            href={p.href}
            className="group flex items-start gap-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-teal-400/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.06)]"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center shrink-0 text-teal-400 group-hover:bg-teal-400/20 transition-colors">
              {p.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                  {p.name}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-400/10 border border-teal-400/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider">Live</span>
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
              <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Open Engine <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
