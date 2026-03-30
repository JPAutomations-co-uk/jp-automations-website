"use client"

import { useAuth } from "@/app/components/AuthProvider"

const HUB_CARDS = [
  {
    title: "Write Post",
    description: "Generate a LinkedIn post optimised for dwell time and engagement.",
    href: "/dashboard/social-engine/linkedin/write",
    tokens: 3,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    title: "Content Planner",
    description: "Plan a week of posts with AI-driven strategy and scheduling.",
    href: "/dashboard/social-engine/linkedin/planner",
    tokens: 5,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "Post Images",
    description: "Generate AI images to accompany your LinkedIn posts.",
    href: "/dashboard/social-engine/linkedin/images",
    tokens: 3,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v14.25a1.5 1.5 0 0 0 1.5 1.5z" />
      </svg>
    ),
  },
  {
    title: "Profile",
    description: "Edit your brand voice, tone, and content preferences.",
    href: "/dashboard/social-engine/profile",
    tokens: null,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
]

export default function LinkedInDashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-300">LinkedIn Content Engine</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">LinkedIn Dashboard</h1>
        <p className="text-gray-500">Create content that builds authority and generates leads.</p>
      </div>

      {/* Hub Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {HUB_CARDS.map((card) => (
          <a
            key={card.title}
            href={card.href}
            className="group bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:border-teal-400/30 hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 group-hover:text-teal-400 group-hover:border-teal-400/30 transition-all">
                {card.icon}
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-teal-400 transition-colors">
              {card.title}
            </h3>
            <p className="text-sm text-gray-500">{card.description}</p>
            {card.tokens && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                <svg className="w-3 h-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                </svg>
                <span className="text-xs text-gray-400">{card.tokens} tokens</span>
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
