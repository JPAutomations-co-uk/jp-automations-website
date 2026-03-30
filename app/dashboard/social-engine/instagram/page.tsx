"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"

interface IGProfile {
  name: string
  niche: string
  handle: string
  current_followers: number
  growth_goal: string
  content_format: string
}

const HUB_CARDS = [
  {
    title: "Post / Caption",
    description: "Generate 3 caption variants optimised for saves, shares, and reach.",
    href: "/dashboard/social-engine/instagram/post",
    tokens: 3,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    title: "Reels",
    description: "Create AI reels with motion graphics, Ken Burns, and beat sync.",
    href: "/dashboard/social-engine/instagram/reels",
    tokens: 5,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    title: "Ad Creatives",
    description: "Generate carousel, single-image, and animated video ads.",
    href: "/dashboard/social-engine/instagram/ads",
    tokens: 5,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
      </svg>
    ),
  },
  {
    title: "Content Planner",
    description: "Plan a week of content with AI-driven strategy.",
    href: "/dashboard/social-engine/instagram/planner",
    tokens: 5,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "SEO Captions",
    description: "Keyword-optimised captions for Instagram search discovery.",
    href: "/dashboard/social-engine/instagram/captions",
    tokens: 5,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
  {
    title: "Profile",
    description: "Edit your brand voice, aesthetic, and content preferences.",
    href: "/dashboard/social-engine/instagram/onboarding",
    tokens: null,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
]

export default function InstagramDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<IGProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    fetch("/api/instagram-profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data.profile) {
          router.replace("/dashboard/social-engine/instagram/onboarding")
          return
        }
        setProfile(data.profile)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user, router])

  if (!user || loading) {
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
          <span className="text-sm font-medium text-gray-300">Instagram Content Engine</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {profile?.name ? `Hey ${profile.name}` : "Instagram Dashboard"}
        </h1>
        <p className="text-gray-500">Create content that drives saves, shares, and followers.</p>
      </div>

      {/* Quick Stats */}
      {profile && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Niche</p>
            <p className="text-sm font-medium text-white capitalize">{profile.niche || "—"}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Followers</p>
            <p className="text-sm font-medium text-white">{(profile.current_followers || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 col-span-2 md:col-span-1">
            <p className="text-xs text-gray-500 mb-1">Growth Goal</p>
            <p className="text-sm font-medium text-white">{profile.growth_goal || "—"}</p>
          </div>
        </div>
      )}

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
