"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/app/components/AuthProvider"
import { useRouter } from "next/navigation"

const ADMIN_EMAIL = String(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").trim().toLowerCase()

type AnalyticsData = {
  sessions: number
  users: number
  sessionsPrev: number
  usersPrev: number
  topPages: { path: string; sessions: number }[]
  error?: string
}

function delta(current: number, prev: number) {
  if (prev === 0) return null
  return Math.round(((current - prev) / prev) * 100)
}

function StatCard({ label, value, prev, loading }: { label: string; value: number; prev: number; loading: boolean }) {
  const pct = delta(value, prev)
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      {loading ? (
        <div className="h-8 w-20 bg-white/5 rounded animate-pulse" />
      ) : (
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-white">{value.toLocaleString()}</span>
          {pct !== null && (
            <span className={`text-sm font-medium mb-1 ${pct >= 0 ? "text-teal-400" : "text-red-400"}`}>
              {pct >= 0 ? "↑" : "↓"} {Math.abs(pct)}% vs last week
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default function AnalyticsDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const isAdmin = user?.email?.trim().toLowerCase() === ADMIN_EMAIL

  useEffect(() => {
    if (authLoading) return
    if (!user || !isAdmin) {
      router.replace("/dashboard")
      return
    }
    fetch("/api/analytics/summary")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user, isAdmin, authLoading, router])

  if (authLoading || !user || !isAdmin) return null

  const notConfigured = !loading && data?.error === "Analytics not configured"

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/">
            <img src="/logo.png" alt="JP Automations" className="h-14 w-auto hover:opacity-80 transition-opacity" />
          </a>
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">← Dashboard</a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-500 text-sm">Last 7 days — updated on page load</p>
        </div>

        {notConfigured ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-8 text-center mb-8">
            <p className="text-yellow-400 font-semibold mb-2">GA4 not connected</p>
            <p className="text-gray-400 text-sm">Add <code className="text-teal-400">GOOGLE_SERVICE_ACCOUNT_KEY</code> and <code className="text-teal-400">GA4_PROPERTY_ID</code> to your Vercel environment variables to see live data.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <StatCard label="Sessions" value={data?.sessions ?? 0} prev={data?.sessionsPrev ?? 0} loading={loading} />
              <StatCard label="Active Users" value={data?.users ?? 0} prev={data?.usersPrev ?? 0} loading={loading} />
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-8">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Top Pages (7 days)</h2>
              {loading ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-6 bg-white/5 rounded animate-pulse" />)}</div>
              ) : (data?.topPages?.length ?? 0) > 0 ? (
                <div className="space-y-3">
                  {data!.topPages.map((page) => {
                    const max = data!.topPages[0].sessions
                    const pct = max > 0 ? (page.sessions / max) * 100 : 0
                    return (
                      <div key={page.path} className="flex items-center gap-4">
                        <span className="text-gray-300 text-sm font-mono w-48 truncate flex-shrink-0">{page.path}</span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-400/60 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-gray-400 text-sm w-12 text-right">{page.sessions}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No page data yet</p>
              )}
            </div>
          </>
        )}

        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Google Analytics", desc: "Traffic, sources, full reports", href: "https://analytics.google.com", color: "text-orange-400" },
            { name: "Microsoft Clarity", desc: "Session recordings & heatmaps", href: "https://clarity.microsoft.com", color: "text-blue-400" },
            { name: "Meta Events Manager", desc: "Pixel events & ad audiences", href: "https://business.facebook.com/events_manager", color: "text-blue-500" },
          ].map((tool) => (
            <a key={tool.name} href={tool.href} target="_blank" rel="noopener noreferrer"
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/10 transition-all group">
              <p className={`text-sm font-semibold mb-1 ${tool.color}`}>{tool.name}</p>
              <p className="text-gray-500 text-xs">{tool.desc}</p>
              <p className="text-gray-600 text-xs mt-3 group-hover:text-gray-400 transition-colors">Open →</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
