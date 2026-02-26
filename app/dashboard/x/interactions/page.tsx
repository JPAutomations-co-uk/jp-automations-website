"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

type Goal = "Brand Awareness" | "Lead Generation" | "Community Building" | "Sales & Conversions" | "Education & Authority"

const GOALS: Goal[] = [
  "Brand Awareness",
  "Lead Generation",
  "Community Building",
  "Sales & Conversions",
  "Education & Authority",
]

const TOKEN_COST = 5

interface Tier1Account {
  handle: string
  is_named: boolean
  confidence: "high" | "medium" | "verify"
  follower_range: string
  why_relevant: string
  content_type: string
  reply_angle: string
  reply_frequency: string
}

interface Tier2Account {
  handle: string
  is_named: boolean
  confidence: "high" | "medium" | "verify"
  follower_range: string
  why_relevant: string
  engagement_strategy: string
  collaboration_potential: string
}

interface Tier3Account {
  archetype: string
  search_query: string
  why_follow_early: string
  follow_count_target: number
}

interface WeeklyRoutine {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  weekend: string
}

interface AccountStrategy {
  tier1_reply_targets: Tier1Account[]
  tier2_peer_accounts: Tier2Account[]
  tier3_emerging: Tier3Account[]
  weekly_routine: WeeklyRoutine
  search_terms: string[]
  hashtags_to_monitor: string[]
  strategy_summary: string
  niche: string
  goal: string
}

const CONFIDENCE_STYLES = {
  high: "bg-teal-500/10 border-teal-500/20 text-teal-400",
  medium: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  verify: "bg-gray-500/10 border-gray-500/20 text-gray-400",
}

const CONFIDENCE_LABELS = {
  high: "Confident",
  medium: "Likely active",
  verify: "Verify first",
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="text-xs text-gray-500 hover:text-teal-400 transition-colors shrink-0"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}

function Tier1Card({ account }: { account: Tier1Account }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all">
      <div className="flex items-start gap-4 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-10 h-10 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center shrink-0">
          <XIcon className="w-4 h-4 text-teal-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-bold text-white">{account.handle}</span>
            <span className="text-xs text-gray-600">{account.follower_range}</span>
            {account.is_named && (
              <span className={`text-xs px-1.5 py-0.5 rounded border ${CONFIDENCE_STYLES[account.confidence]}`}>
                {CONFIDENCE_LABELS[account.confidence]}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 line-clamp-1">{account.why_relevant}</p>
        </div>
        <svg className={`w-4 h-4 text-gray-600 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {expanded && (
        <div className="border-t border-white/[0.06] p-4 space-y-3">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Why their audience is your target</span>
            <p className="text-sm text-gray-300 leading-relaxed">{account.why_relevant}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">What they post about</span>
            <p className="text-sm text-gray-300">{account.content_type}</p>
          </div>
          <div className="bg-teal-400/5 border border-teal-400/20 rounded-xl p-3">
            <span className="text-xs font-semibold text-teal-400 block mb-1">Reply strategy</span>
            <p className="text-sm text-gray-300 leading-relaxed">{account.reply_angle}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Reply frequency: <span className="text-white">{account.reply_frequency}</span></span>
            {account.is_named && account.confidence === "verify" && (
              <span className="text-amber-400">⚠ Verify this account is still active</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Tier2Card({ account }: { account: Tier2Account }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all">
      <div className="flex items-start gap-4 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
          <XIcon className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-bold text-white">{account.handle}</span>
            <span className="text-xs text-gray-600">{account.follower_range}</span>
            {account.is_named && (
              <span className={`text-xs px-1.5 py-0.5 rounded border ${CONFIDENCE_STYLES[account.confidence]}`}>
                {CONFIDENCE_LABELS[account.confidence]}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 line-clamp-1">{account.why_relevant}</p>
        </div>
        <svg className={`w-4 h-4 text-gray-600 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {expanded && (
        <div className="border-t border-white/[0.06] p-4 space-y-3">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Why they're a good peer</span>
            <p className="text-sm text-gray-300 leading-relaxed">{account.why_relevant}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">How to engage</span>
            <p className="text-sm text-gray-300 leading-relaxed">{account.engagement_strategy}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Collaboration potential</span>
            <p className="text-sm text-gray-300 leading-relaxed">{account.collaboration_potential}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Tier3Card({ account }: { account: Tier3Account }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:border-white/10 transition-all">
      <p className="text-sm font-medium text-white mb-1">{account.archetype}</p>
      <p className="text-xs text-gray-400 mb-3">{account.why_follow_early}</p>
      <div className="flex items-center justify-between gap-3">
        <code className="text-xs text-teal-400 bg-teal-400/5 border border-teal-400/10 rounded-lg px-3 py-1.5 flex-1 truncate font-mono">
          {account.search_query}
        </code>
        <CopyButton text={account.search_query} />
      </div>
      <p className="text-xs text-gray-600 mt-2">Target: follow ~{account.follow_count_target} accounts from this search</p>
    </div>
  )
}

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "weekend"] as const

export default function XInteractionsPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  const [niche, setNiche] = useState("")
  const [goal, setGoal] = useState<Goal>("Lead Generation")
  const [targetAudience, setTargetAudience] = useState("")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [strategy, setStrategy] = useState<AccountStrategy | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleGenerate = useCallback(async () => {
    if (!niche.trim()) {
      setError("Please describe your niche.")
      return
    }
    if (!user) {
      router.push(`/login?redirect=/dashboard/x/interactions`)
      return
    }
    if (tokenBalance < TOKEN_COST) {
      setError(`Insufficient tokens. You need ${TOKEN_COST} but have ${tokenBalance}.`)
      return
    }

    setGenerating(true)
    setError("")
    setStrategy(null)

    try {
      const res = await fetch("/api/generate/x-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: niche.trim(), goal, targetAudience: targetAudience.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Generation failed")
        return
      }
      setStrategy(data)
      refreshBalance()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setGenerating(false)
    }
  }, [niche, goal, targetAudience, user, tokenBalance, refreshBalance, router])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="relative z-50">
            <img src="/logo.png" alt="JP Automations" className="h-16 md:h-20 w-auto hover:opacity-80 transition-opacity" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Home</a>
            <AppsDropdown />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-lg">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25 4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                  </svg>
                  <span className="text-sm font-semibold text-teal-400">{tokenBalance}</span>
                  <span className="text-xs text-gray-500">tokens</span>
                </div>
                <UserMenu />
              </>
            ) : (
              <a href="/login?redirect=/dashboard/x/interactions" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all">Sign In</a>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden relative z-50 p-2">
            <div className="w-8 h-6 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <AppsMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors mb-8 group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Apps
          </a>

          {/* Header + Tabs */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">X Content Engine</span>
            </div>

            <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6 max-w-sm">
              <a href="/dashboard/x" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Compose
              </a>
              <a href="/dashboard/x/planner" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Planner
              </a>
              <span className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">
                Accounts
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Account Strategy</h1>
            <p className="text-gray-500 max-w-xl">
              The exact accounts to follow and engage with — tiered by audience size with a specific strategy for each.
              Replying to the right accounts is the fastest organic growth lever on X.
            </p>
          </div>

          {!strategy ? (
            <div className="max-w-xl space-y-5">

              {/* Niche */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <label className="block text-sm font-medium text-gray-400 mb-2">Your Niche *</label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. Marketing automation for service businesses"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 transition-all text-sm"
                />
                <p className="text-xs text-gray-600 mt-2">Be specific — "fitness coaching for women over 40" gets better results than "fitness".</p>
              </div>

              {/* Target Audience */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <label className="block text-sm font-medium text-gray-400 mb-2">Who you're trying to reach (optional)</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Service business owners doing £100K–£500K/year"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 transition-all text-sm"
                />
              </div>

              {/* Goal */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <label className="block text-sm font-medium text-gray-400 mb-3">Primary Goal</label>
                <div className="space-y-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${
                        goal === g
                          ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                          : "border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-gray-300"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="flex gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <svg className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Named accounts are based on AI training knowledge — verify handles are still active before engaging.
                  Archetypes and search queries always work regardless of platform changes.
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || !niche.trim()}
                className="w-full py-4 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {generating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Building your account strategy...
                  </>
                ) : (
                  <>
                    Generate Account Strategy
                    <span className="text-black/60 text-sm">({TOKEN_COST} tokens)</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
              )}
            </div>
          ) : (
            <div className="space-y-10">

              {/* Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{strategy.niche} · {strategy.goal}</p>
                  <p className="text-gray-300 text-sm max-w-2xl leading-relaxed">{strategy.strategy_summary}</p>
                </div>
                <button onClick={() => setStrategy(null)} className="text-sm text-gray-500 hover:text-teal-400 transition-colors shrink-0">
                  ← New strategy
                </button>
              </div>

              {/* Tier 1 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-teal-400">T1</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Reply Targets</h2>
                    <p className="text-xs text-gray-500">Large accounts (100K+). Reply to their posts to get in front of their audience for free.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {(strategy.tier1_reply_targets || []).map((acc, i) => (
                    <Tier1Card key={i} account={acc} />
                  ))}
                </div>
              </div>

              {/* Tier 2 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-amber-400">T2</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Peer Accounts</h2>
                    <p className="text-xs text-gray-500">Similar-sized creators (5K–100K). Genuine engagement builds relationships and cross-referrals.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {(strategy.tier2_peer_accounts || []).map((acc, i) => (
                    <Tier2Card key={i} account={acc} />
                  ))}
                </div>
              </div>

              {/* Tier 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-400">T3</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Emerging Voices</h2>
                    <p className="text-xs text-gray-500">Up-and-coming accounts under 5K. Follow early to build mutual relationships before they grow.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {(strategy.tier3_emerging || []).map((acc, i) => (
                    <Tier3Card key={i} account={acc} />
                  ))}
                </div>
              </div>

              {/* Weekly Routine */}
              {strategy.weekly_routine && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-4">Weekly Interaction Routine</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {DAY_ORDER.map((day) => {
                      const text = strategy.weekly_routine[day]
                      if (!text) return null
                      return (
                        <div key={day} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                          <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">{day}</div>
                          <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Search terms + Hashtags */}
              <div className="grid sm:grid-cols-2 gap-6">
                {strategy.search_terms && strategy.search_terms.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Twitter Search Queries</h3>
                    <div className="space-y-2">
                      {strategy.search_terms.map((term, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2">
                          <code className="text-xs text-teal-400 font-mono flex-1">{term}</code>
                          <CopyButton text={term} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {strategy.hashtags_to_monitor && strategy.hashtags_to_monitor.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Hashtags to Monitor</h3>
                    <div className="flex flex-wrap gap-2">
                      {strategy.hashtags_to_monitor.map((tag, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-full px-3 py-1.5">
                          <span className="text-xs text-teal-400 font-medium">{tag}</span>
                          <CopyButton text={tag} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Regenerate */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <p className="text-xs text-gray-600">Generated for: {strategy.niche}</p>
                <button
                  onClick={() => setStrategy(null)}
                  className="text-sm text-gray-500 hover:text-teal-400 transition-colors"
                >
                  Regenerate strategy →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
