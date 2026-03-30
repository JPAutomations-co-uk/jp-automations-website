"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"

interface XProfile {
  name: string
  niche: string
  current_followers: number
  growth_goal: string
}

interface Draft {
  id: string
  type: "post" | "thread"
  topic: string
  created_at: string
}

const HUB_CARDS = [
  {
    title: "Monthly Planner",
    description: "Algorithm-optimised content plan with daily activity schedule and inline post writing.",
    href: "/dashboard/social-engine/x/planner",
    tokens: "25–60",
    featured: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "Single Post",
    description: "Generate 3 tweet variants with different angles and hooks.",
    href: "/dashboard/social-engine/x/post",
    tokens: 2,
    featured: false,
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    title: "Article",
    description: "Long-form articles published on X — indexed by Google, shared as a tweet card.",
    href: "/dashboard/social-engine/x/article",
    tokens: 5,
    featured: false,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: "Thread",
    description: "Create engaging multi-tweet threads that build authority.",
    href: "/dashboard/social-engine/x/thread",
    tokens: 8,
    featured: false,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
      </svg>
    ),
  },
  {
    title: "Research",
    description: "Analyze top performers and competitors in your niche.",
    href: "/dashboard/social-engine/x/research",
    tokens: null,
    featured: false,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    title: "Profile",
    description: "Edit your brand voice, tone, and voice examples.",
    href: "/dashboard/social-engine/x/profile",
    tokens: null,
    featured: false,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
]

export default function XDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<XProfile | null>(null)
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    Promise.all([
      fetch("/api/x-profile").then((r) => r.json()),
      fetch("/api/x-profile/drafts?limit=5").then((r) => r.json()),
    ])
      .then(([profileData, draftsData]) => {
        if (!profileData.profile) {
          router.replace("/dashboard/social-engine/x/onboarding")
          return
        }
        setProfile(profileData.profile)
        setDrafts(draftsData.drafts || [])
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
          <span className="text-sm font-medium text-gray-300">X Content Engine</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {profile?.name ? `Hey ${profile.name}` : "X Dashboard"}
        </h1>
        <p className="text-gray-500">Create content that grows your audience.</p>
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
            className={`group border rounded-2xl p-6 transition-all ${card.featured
              ? "bg-teal-400/5 border-teal-400/20 hover:border-teal-400/40 hover:bg-teal-400/8 md:col-span-2"
              : "bg-white/[0.03] border-white/[0.08] hover:border-teal-400/30 hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${card.featured
                ? "bg-teal-400/10 border border-teal-400/30 text-teal-400"
                : "bg-white/[0.05] border border-white/[0.08] text-gray-400 group-hover:text-teal-400 group-hover:border-teal-400/30"
              }`}>
                {card.icon}
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
            <h3 className={`text-lg font-semibold mb-1 transition-colors ${card.featured ? "text-teal-400" : "text-white group-hover:text-teal-400"}`}>
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

      {/* Recent Drafts */}
      {drafts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Drafts</h2>
          <div className="space-y-2">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex items-center justify-between bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    draft.type === "thread"
                      ? "bg-purple-500/10 text-purple-400"
                      : "bg-teal-400/10 text-teal-400"
                  }`}>
                    {draft.type}
                  </span>
                  <span className="text-sm text-gray-300 truncate max-w-[300px]">
                    {draft.topic || "Untitled"}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {new Date(draft.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
