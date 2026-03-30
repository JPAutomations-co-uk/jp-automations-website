"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/app/components/AuthProvider"

type Platform = "instagram" | "linkedin" | "x" | "youtube"
type TimeRange = "7d" | "30d" | "90d"

interface PlatformMetrics {
  followers: number
  followersChange: number
  impressions: number
  impressionsChange: number
  engagement: number
  engagementChange: number
  posts: number
}

interface ConnectionStatus {
  platform: Platform
  connected: boolean
  accountName?: string
  lastSynced?: string
}

const PLATFORMS: { id: Platform; name: string; color: string; icon: React.ReactNode }[] = [
  {
    id: "instagram",
    name: "Instagram",
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    id: "x",
    name: "X (Twitter)",
    color: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.5A2.25 2.25 0 0 1 4.5 5.25h15A2.25 2.25 0 0 1 21.75 7.5v9a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 16.5v-9Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m10 9.75 4 2.25-4 2.25v-4.5Z" />
      </svg>
    ),
  },
]

function MetricCard({ label, value, change, suffix = "" }: { label: string; value: number | string; change?: number; suffix?: string }) {
  const isPositive = (change ?? 0) >= 0
  return (
    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}{suffix}
        </span>
        {change !== undefined && (
          <span className={`text-xs font-semibold mb-1 ${isPositive ? "text-teal-400" : "text-red-400"}`}>
            {isPositive ? "+" : ""}{change}%
          </span>
        )}
      </div>
    </div>
  )
}

function ConnectionCard({ platform, connected, onConnect }: { platform: typeof PLATFORMS[number]; connected: boolean; onConnect: () => void }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${connected ? "bg-white/[0.03] border-white/[0.08]" : "bg-white/[0.02] border-dashed border-white/[0.06]"}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${platform.color}`}>
          {platform.icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{platform.name}</p>
          <p className="text-xs text-gray-500">{connected ? "Connected" : "Not connected"}</p>
        </div>
      </div>
      {connected ? (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-400/10 border border-teal-400/20">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          <span className="text-xs font-semibold text-teal-400">Active</span>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="px-4 py-2 text-xs font-semibold bg-white/[0.06] border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all"
        >
          Connect
        </button>
      )}
    </div>
  )
}

export default function AnalyticsDashboardPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const [connections, setConnections] = useState<ConnectionStatus[]>([])
  const [metrics, setMetrics] = useState<Record<Platform, PlatformMetrics | null>>({
    instagram: null,
    linkedin: null,
    x: null,
    youtube: null,
  })
  const [loading, setLoading] = useState(true)

  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch("/api/social-connections")
      if (res.ok) {
        const data = await res.json()
        setConnections(data.connections || [])
      }
    } catch {
      // silently fail
    }
  }, [])

  const fetchMetrics = useCallback(async (platform: Platform) => {
    try {
      const res = await fetch(`/api/${platform}/insights/sync?range=${timeRange}`)
      if (res.ok) {
        const data = await res.json()
        setMetrics((prev) => ({ ...prev, [platform]: data.metrics || null }))
      }
    } catch {
      // silently fail
    }
  }, [timeRange])

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetchConnections().then(() => {
      const connected = connections.filter((c) => c.connected).map((c) => c.platform)
      Promise.all(connected.map(fetchMetrics)).finally(() => setLoading(false))
    })
  }, [user, fetchConnections, fetchMetrics, connections])

  const connectedPlatforms = connections.filter((c) => c.connected)
  const hasAnyConnection = connectedPlatforms.length > 0

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-300">Analytics Dashboard</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Performance Overview</h1>
        <p className="text-gray-500">Track your content performance across all connected platforms.</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
        {(["7d", "30d", "90d"] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              timeRange === range
                ? "bg-teal-400/10 text-teal-400 border border-teal-400/30"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
          </button>
        ))}
      </div>

      {/* Platform Connections */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Connected Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PLATFORMS.map((p) => {
            const conn = connections.find((c) => c.platform === p.id)
            return (
              <ConnectionCard
                key={p.id}
                platform={p}
                connected={conn?.connected ?? false}
                onConnect={() => window.location.href = `/dashboard/settings`}
              />
            )
          })}
        </div>
      </div>

      {/* Metrics */}
      {hasAnyConnection ? (
        <>
          {/* Overview Cards */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard
                label="Total Followers"
                value={Object.values(metrics).reduce((acc, m) => acc + (m?.followers ?? 0), 0)}
                change={Math.round(Object.values(metrics).reduce((acc, m) => acc + (m?.followersChange ?? 0), 0) / Math.max(connectedPlatforms.length, 1))}
              />
              <MetricCard
                label="Total Impressions"
                value={Object.values(metrics).reduce((acc, m) => acc + (m?.impressions ?? 0), 0)}
                change={Math.round(Object.values(metrics).reduce((acc, m) => acc + (m?.impressionsChange ?? 0), 0) / Math.max(connectedPlatforms.length, 1))}
              />
              <MetricCard
                label="Avg Engagement"
                value={(Object.values(metrics).reduce((acc, m) => acc + (m?.engagement ?? 0), 0) / Math.max(connectedPlatforms.length, 1)).toFixed(1)}
                suffix="%"
              />
              <MetricCard
                label="Posts Published"
                value={Object.values(metrics).reduce((acc, m) => acc + (m?.posts ?? 0), 0)}
              />
            </div>
          </div>

          {/* Per-Platform Breakdown */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Platform Breakdown</h2>
            <div className="space-y-4">
              {PLATFORMS.map((p) => {
                const conn = connections.find((c) => c.platform === p.id)
                const m = metrics[p.id]
                if (!conn?.connected) return null
                return (
                  <div key={p.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${p.color}`}>
                        {p.icon}
                      </div>
                      <h3 className="text-base font-semibold text-white">{p.name}</h3>
                      {conn.lastSynced && (
                        <span className="text-xs text-gray-600 ml-auto">
                          Last synced: {new Date(conn.lastSynced).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {m ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <MetricCard label="Followers" value={m.followers} change={m.followersChange} />
                        <MetricCard label="Impressions" value={m.impressions} change={m.impressionsChange} />
                        <MetricCard label="Engagement" value={m.engagement.toFixed(1)} suffix="%" change={m.engagementChange} />
                        <MetricCard label="Posts" value={m.posts} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-3 text-gray-500">
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span className="text-sm">Syncing {p.name} data...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No platforms connected</h3>
          <p className="text-sm text-gray-500 max-w-md mb-6">
            Connect your social media accounts to see real-time analytics. Go to Settings to link your Instagram, LinkedIn, X, or YouTube accounts.
          </p>
          <a
            href="/dashboard/settings"
            className="px-6 py-3 text-sm font-semibold bg-teal-400 text-black rounded-xl hover:bg-teal-300 transition-all"
          >
            Connect Accounts
          </a>
        </div>
      )}
    </div>
  )
}
