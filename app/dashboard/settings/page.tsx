"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"

type Profile = {
  display_name: string | null
  business_name: string | null
  website_url: string | null
  instagram_handle: string | null
  x_handle: string | null
  linkedin_handle: string | null
  industry: string | null
  location: string | null
  target_audience: string | null
  offers: string | null
  usp: string | null
  primary_cta: string | null
  proof_points: string | null
  tone: string | null
  visual_style: string | null
  primary_color: string | null
  secondary_color: string | null
  voice_sample: string | null
  subscription_tier: string | null
  subscription_status: string | null
}

type Transaction = {
  id: string
  type: string
  description: string
  amount: number
  created_at: string
}

type PlatformProfileRow = {
  platform: string
  tone: string | null
  copy_examples: string[] | null
  goals: string | null
  primary_cta: string | null
  posting_frequency: number | null
  style_description: string | null
}

type PlatformConnection = {
  platform: string
  connected: boolean
  accountId: string | null
  tokenExpiresAt: string | null
  connectedAt: string | null
  updatedAt: string | null
}

type PlatformConnectionForm = {
  accessToken: string
  accountId: string
  tokenExpiresAt: string
}

const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", accountLabel: "Business Account ID", accountPlaceholder: "1784...", icon: "IG" },
  { id: "linkedin", label: "LinkedIn", accountLabel: "Organization URN", accountPlaceholder: "urn:li:organization:12345", icon: "Li" },
  { id: "x", label: "X (Twitter)", accountLabel: "User ID", accountPlaceholder: "Your Twitter user ID", icon: "X" },
  { id: "youtube", label: "YouTube", accountLabel: "Channel ID", accountPlaceholder: "UC...", icon: "YT" },
] as const

const TONES = [
  { id: "Direct", label: "Direct", desc: "No fluff. Clear and to the point." },
  { id: "Casual", label: "Casual", desc: "Relaxed, like talking to a friend." },
  { id: "Bold", label: "Bold", desc: "Strong opinions, confident voice." },
  { id: "Witty", label: "Witty", desc: "Sharp, clever, with a sense of humour." },
  { id: "Educational", label: "Educational", desc: "Teaches and explains clearly." },
  { id: "Inspirational", label: "Inspirational", desc: "Motivates and uplifts." },
  { id: "Story", label: "Story-led", desc: "Narrative-driven and relatable." },
  { id: "Professional", label: "Professional", desc: "Polished, credible, trustworthy." },
]
const VISUAL_STYLE_OPTIONS = ["Minimalist", "Bold & Colorful", "Dark & Moody", "Light & Airy", "Vintage", "Modern"]

const VOICE_TRAITS = [
  "Contrarian", "Data-backed", "Authentic / vulnerable", "Blunt / no-sugarcoating",
  "Subtle wit / dry humour", "Energetic", "Calm / measured", "Storytelling-first",
  "Teaching-focused", "Opinionated", "Understated", "Conversational",
]

const WRITING_RHYTHMS = [
  { value: "Short & punchy", desc: "Short sentences, fragments, one idea per line" },
  { value: "Long & flowing", desc: "Longer sentences that build on each other" },
  { value: "Mixed", desc: "Short hooks, longer context — depends on the post" },
]

export default function SettingsPage() {
  const { tokenBalance } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [platformProfiles, setPlatformProfiles] = useState<PlatformProfileRow[]>([])
  const [activePlatformTab, setActivePlatformTab] = useState("linkedin")
  const [platformForms, setPlatformForms] = useState<Record<string, {
    tone: string; copyExamples: string; cta: string; goals: string; frequency: number
  }>>({})
  const [platformSaving, setPlatformSaving] = useState(false)
  const [platformSaved, setPlatformSaved] = useState(false)
  const [platformError, setPlatformError] = useState("")

  // Global voice settings (loaded from platform profiles, saved back to all)
  const [voiceTraits, setVoiceTraits] = useState<string[]>([])
  const [writingRhythm, setWritingRhythm] = useState("Mixed")
  const [bannedWords, setBannedWords] = useState("")
  const [copyExamples, setCopyExamples] = useState("")

  const [activeConnectionTab, setActiveConnectionTab] = useState("instagram")
  const [connectionLoading, setConnectionLoading] = useState(false)
  const [connectionSaving, setConnectionSaving] = useState(false)
  const [connectionError, setConnectionError] = useState("")
  const [connectionSaved, setConnectionSaved] = useState(false)
  const [platformConnections, setPlatformConnections] = useState<Record<string, PlatformConnection>>({})
  const [connectionForms, setConnectionForms] = useState<Record<string, PlatformConnectionForm>>(
    Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p.id, { accessToken: "", accountId: "", tokenExpiresAt: "" }]))
  )

  // Form state
  const [form, setForm] = useState({
    display_name: "",
    business_name: "",
    website_url: "",
    instagram_handle: "",
    x_handle: "",
    linkedin_handle: "",
    industry: "",
    location: "",
    target_audience: "",
    offers: "",
    usp: "",
    primary_cta: "",
    proof_points: "",
    tone: "",
    visual_style: "",
    primary_color: "#2dd4bf",
    secondary_color: "#0a0a0a",
    voice_sample: "",
  })

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, historyRes, connectionsRes, platformRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/tokens/history?limit=50"),
          fetch("/api/social-connections"),
          fetch("/api/platform-profiles"),
        ])

        if (profileRes.ok) {
          const data = await profileRes.json()
          setProfile(data.profile)
          setEmail(data.email || "")
          setForm({
            display_name: data.profile.display_name || "",
            business_name: data.profile.business_name || "",
            website_url: data.profile.website_url || "",
            instagram_handle: data.profile.instagram_handle || "",
            x_handle: data.profile.x_handle || "",
            linkedin_handle: data.profile.linkedin_handle || "",
            industry: data.profile.industry || "",
            location: data.profile.location || "",
            target_audience: data.profile.target_audience || "",
            offers: data.profile.offers || "",
            usp: data.profile.usp || "",
            primary_cta: data.profile.primary_cta || "",
            proof_points: data.profile.proof_points || "",
            tone: data.profile.tone || "",
            visual_style: data.profile.visual_style || "",
            primary_color: data.profile.primary_color || "#2dd4bf",
            secondary_color: data.profile.secondary_color || "#0a0a0a",
            voice_sample: data.profile.voice_sample || "",
          })
        }

        if (historyRes.ok) {
          const data = await historyRes.json()
          setTransactions(data.transactions)
        }

        if (connectionsRes.ok) {
          const data = await connectionsRes.json()
          const conns: Record<string, PlatformConnection> = {}
          const forms: Record<string, PlatformConnectionForm> = {}
          for (const c of data.connections || []) {
            conns[c.platform] = {
              platform: c.platform,
              connected: c.connected,
              accountId: c.accountName || null,
              tokenExpiresAt: null,
              connectedAt: null,
              updatedAt: c.lastSynced || null,
            }
            forms[c.platform] = {
              accessToken: "",
              accountId: c.accountName || "",
              tokenExpiresAt: "",
            }
          }
          // Fill defaults for platforms without connections
          for (const p of SOCIAL_PLATFORMS) {
            if (!conns[p.id]) {
              conns[p.id] = { platform: p.id, connected: false, accountId: null, tokenExpiresAt: null, connectedAt: null, updatedAt: null }
            }
            if (!forms[p.id]) {
              forms[p.id] = { accessToken: "", accountId: "", tokenExpiresAt: "" }
            }
          }
          setPlatformConnections(conns)
          setConnectionForms(forms)
        }

        if (platformRes.ok) {
          const data = await platformRes.json()
          const profiles = (data.platformProfiles || []) as PlatformProfileRow[]
          setPlatformProfiles(profiles)
          const forms: Record<string, { tone: string; copyExamples: string; cta: string; goals: string; frequency: number }> = {}
          for (const pp of profiles) {
            forms[pp.platform] = {
              tone: pp.tone || "",
              copyExamples: (pp.copy_examples || []).join("\n---\n"),
              cta: pp.primary_cta || "",
              goals: pp.goals || "",
              frequency: pp.posting_frequency || 3,
            }
          }
          setPlatformForms(forms)
          if (profiles.length > 0) setActivePlatformTab(profiles[0].platform)

          // Load global voice settings from first platform profile (they're the same across all)
          const first = profiles[0]
          if (first) {
            try {
              const extras = JSON.parse(first.style_description || "{}")
              setVoiceTraits(extras.voice_traits || [])
              setWritingRhythm(extras.writing_style || "Mixed")
              setBannedWords((extras.banned_words || []).join(", "))
            } catch { /* ignore parse errors */ }
            setCopyExamples((first.copy_examples || []).join("\n---\n"))
          }
        }
      } catch {
        // Silently handle errors
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSaved(false)

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Failed to save")

      // Propagate global voice settings to all platform profiles
      if (platformProfiles.length > 0) {
        const bannedWordsList = bannedWords.split(",").map((w) => w.trim()).filter(Boolean)
        const copyExamplesList = copyExamples.split("\n---\n").map((s) => s.trim()).filter(Boolean)
        for (const pp of platformProfiles) {
          let existingExtras: Record<string, unknown> = {}
          try { existingExtras = JSON.parse(pp.style_description || "{}") } catch { /* ignore */ }
          const newStyleDescription = JSON.stringify({
            ...existingExtras,
            writing_style: writingRhythm,
            voice_traits: voiceTraits,
            banned_words: bannedWordsList,
          })
          await fetch("/api/platform-profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              platform: pp.platform,
              tone: form.tone || undefined,
              ...(copyExamplesList.length > 0 ? { copy_examples: copyExamplesList } : {}),
              style_description: newStyleDescription,
            }),
          })
        }
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Failed to save changes. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const refreshPlatformConnection = async (platform: string) => {
    setConnectionLoading(true)
    try {
      const res = await fetch(`/api/social-connections?platform=${platform}`)
      if (res.ok) {
        const data = await res.json()
        setPlatformConnections((prev) => ({
          ...prev,
          [platform]: {
            platform,
            connected: data.connected,
            accountId: data.connection?.accountId || null,
            tokenExpiresAt: data.connection?.tokenExpiresAt || null,
            connectedAt: data.connection?.connectedAt || null,
            updatedAt: data.connection?.updatedAt || null,
          },
        }))
        if (data.connected) {
          setConnectionForms((prev) => ({
            ...prev,
            [platform]: {
              ...prev[platform],
              accountId: data.connection?.accountId || "",
              tokenExpiresAt: data.connection?.tokenExpiresAt || "",
            },
          }))
        }
      }
    } catch {
      // Ignore refresh errors.
    } finally {
      setConnectionLoading(false)
    }
  }

  const savePlatformConnection = async (platform: string) => {
    setConnectionSaving(true)
    setConnectionError("")
    setConnectionSaved(false)

    const form = connectionForms[platform]
    if (!form) return

    try {
      const res = await fetch("/api/social-connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          accessToken: form.accessToken,
          accountId: form.accountId,
          tokenExpiresAt: form.tokenExpiresAt || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Failed to save ${platform} connection`)

      setConnectionForms((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], accessToken: "" },
      }))
      setConnectionSaved(true)
      setTimeout(() => setConnectionSaved(false), 3000)
      await refreshPlatformConnection(platform)
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : `Failed to save ${platform} connection`)
    } finally {
      setConnectionSaving(false)
    }
  }

  const disconnectPlatformConnection = async (platform: string) => {
    setConnectionSaving(true)
    setConnectionError("")

    try {
      const res = await fetch(`/api/social-connections?platform=${platform}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Failed to disconnect ${platform}`)

      setPlatformConnections((prev) => ({
        ...prev,
        [platform]: { platform, connected: false, accountId: null, tokenExpiresAt: null, connectedAt: null, updatedAt: null },
      }))
      setConnectionForms((prev) => ({
        ...prev,
        [platform]: { accessToken: "", accountId: "", tokenExpiresAt: "" },
      }))
      setConnectionSaved(true)
      setTimeout(() => setConnectionSaved(false), 3000)
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : `Failed to disconnect ${platform}`)
    } finally {
      setConnectionSaving(false)
    }
  }

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const tierLabel = profile?.subscription_tier || "free"
  const tierColors: Record<string, string> = {
    free: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    pro: "bg-teal-400/20 text-teal-400 border-teal-400/30",
    business: "bg-purple-400/20 text-purple-400 border-purple-400/30",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="relative z-50">
            <img src="/logo.png" alt="JP Automations" className="h-16 md:h-20 w-auto hover:opacity-80 transition-opacity" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Home</Link>
            <Link href="/blog" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Blog</Link>
            <Link href="/dashboard" className="px-5 py-2.5 text-sm font-semibold border border-teal-400/40 text-teal-400 rounded-lg hover:bg-teal-400/10 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]">
              My Apps
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-lg">
              <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
              </svg>
              <span className="text-sm font-semibold text-teal-400">{tokenBalance}</span>
              <span className="text-xs text-gray-500">tokens</span>
            </div>
            <UserMenu />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-50 p-2 text-white focus:outline-none"
          >
            <div className="w-8 h-6 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <Link href="/" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/blog" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
          <Link href="/dashboard" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>My Apps</Link>
          <Link href="/dashboard/settings" className="text-4xl font-bold text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Settings</Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-40 pb-32">

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-3">
            Settings
          </h1>
          <p className="text-gray-400 text-lg">Manage your profile, business info, and tokens.</p>
        </div>

        {/* ─── Section 1: Profile ─── */}
        <section className="mb-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
              <input
                type="text"
                value={form.display_name}
                onChange={(e) => updateForm("display_name", e.target.value)}
                placeholder="Your name"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Subscription Badge */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm text-gray-400">Plan:</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${tierColors[tierLabel] || tierColors.free}`}>
              {tierLabel}
            </span>
            {profile?.subscription_status && profile.subscription_status !== "active" && (
              <span className="text-xs text-yellow-400/80">({profile.subscription_status})</span>
            )}
          </div>
        </section>

        {/* ─── Section 2: Business Info ─── */}
        <section className="mb-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Business Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Business Name</label>
              <input
                type="text"
                value={form.business_name}
                onChange={(e) => updateForm("business_name", e.target.value)}
                placeholder="Your business"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Website</label>
              <input
                type="url"
                value={form.website_url}
                onChange={(e) => updateForm("website_url", e.target.value)}
                placeholder="https://yoursite.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Instagram Handle</label>
              <input
                type="text"
                value={form.instagram_handle}
                onChange={(e) => updateForm("instagram_handle", e.target.value)}
                placeholder="@yourhandle"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">X (Twitter) Handle</label>
              <input
                type="text"
                value={form.x_handle}
                onChange={(e) => updateForm("x_handle", e.target.value)}
                placeholder="@yourhandle"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn Handle</label>
              <input
                type="text"
                value={form.linkedin_handle}
                onChange={(e) => updateForm("linkedin_handle", e.target.value)}
                placeholder="yourname"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Industry</label>
              <input
                type="text"
                value={form.industry}
                onChange={(e) => updateForm("industry", e.target.value)}
                placeholder="e.g. Architecture, Real Estate"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateForm("location", e.target.value)}
                placeholder="City, Country"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Target Audience</label>
              <input
                type="text"
                value={form.target_audience}
                onChange={(e) => updateForm("target_audience", e.target.value)}
                placeholder="Who are your ideal customers?"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              />
            </div>
          </div>

          {/* Brand Identity */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <h3 className="text-lg font-semibold text-white mb-1">Voice & Tone</h3>
            <p className="text-sm text-gray-500 mb-5">Applied to all platforms. Override per-platform in Platform Profiles below.</p>

            {/* Primary tone */}
            <label className="block text-sm font-medium text-gray-400 mb-3">Primary tone</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateForm("tone", t.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    form.tone === t.id
                      ? "border-teal-400 bg-teal-400/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">{t.label}</div>
                  <div className="text-xs text-gray-500 leading-snug">{t.desc}</div>
                </button>
              ))}
            </div>

            {/* Voice characteristics */}
            <label className="block text-sm font-medium text-gray-400 mb-2">Voice characteristics</label>
            <p className="text-xs text-gray-600 mb-3">Pick everything that sounds like you.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {VOICE_TRAITS.map((trait) => {
                const selected = voiceTraits.includes(trait)
                return (
                  <button
                    key={trait}
                    type="button"
                    onClick={() => setVoiceTraits((prev) =>
                      prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait]
                    )}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selected
                        ? "border-teal-400 bg-teal-400/10 text-teal-400"
                        : "border-white/10 bg-black/40 text-gray-400 hover:border-teal-400/40 hover:text-gray-200"
                    }`}
                  >
                    {trait}
                  </button>
                )
              })}
            </div>

            {/* Writing rhythm */}
            <label className="block text-sm font-medium text-gray-400 mb-2">Writing rhythm</label>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {WRITING_RHYTHMS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setWritingRhythm(r.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    writingRhythm === r.value
                      ? "border-teal-400 bg-teal-400/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <div className={`font-semibold text-sm mb-0.5 ${writingRhythm === r.value ? "text-teal-400" : "text-white"}`}>{r.value}</div>
                  <div className="text-xs text-gray-500 leading-snug">{r.desc}</div>
                </button>
              ))}
            </div>

            {/* Copy examples */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Writing examples <span className="text-gray-600 font-normal">(most important for voice matching)</span>
              </label>
              <textarea
                value={copyExamples}
                onChange={(e) => setCopyExamples(e.target.value)}
                rows={6}
                placeholder={"Example 1 — paste something you've written...\n---\nExample 2 — another piece...\n---\nExample 3 — optional..."}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors resize-none text-sm"
              />
              <p className="text-xs text-gray-600 mt-1.5">Separate multiple examples with --- on its own line.</p>
            </div>

            {/* Words to avoid */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Words & phrases to avoid</label>
              <input
                type="text"
                value={bannedWords}
                onChange={(e) => setBannedWords(e.target.value)}
                placeholder="e.g. synergy, hustle, game-changer, 10x, just, very..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors text-sm"
              />
            </div>

            {/* Legacy voice sample (kept for backward compat) */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Additional voice note <span className="text-gray-600 font-normal">(optional)</span></label>
              <textarea
                value={form.voice_sample}
                onChange={(e) => updateForm("voice_sample", e.target.value)}
                rows={3}
                placeholder="Any other notes about how you write — style, things to always/never do, etc."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors resize-none text-sm"
              />
            </div>

            {/* Visual Style */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Visual Style</label>
              <select
                value={form.visual_style}
                onChange={(e) => updateForm("visual_style", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors appearance-none"
              >
                <option value="" className="bg-[#141414]">Select...</option>
                {VISUAL_STYLE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#141414]">{opt}</option>
                ))}
              </select>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.primary_color}
                    onChange={(e) => updateForm("primary_color", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.primary_color}
                    onChange={(e) => updateForm("primary_color", e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white font-mono text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.secondary_color}
                    onChange={(e) => updateForm("secondary_color", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.secondary_color}
                    onChange={(e) => updateForm("secondary_color", e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white font-mono text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Offers & Positioning */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <h3 className="text-lg font-semibold text-white mb-2">Offers & Positioning</h3>
            <p className="text-sm text-gray-500 mb-5">Injected into every AI prompt so your content references real services and proof.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">What do you offer?</label>
                <textarea
                  value={form.offers}
                  onChange={(e) => updateForm("offers", e.target.value)}
                  rows={4}
                  placeholder="e.g. I run a social media content service for service businesses. £997/month. Clients get a full month of content — captions, reels scripts, and carousels — planned and written for them each week."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors resize-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">What makes you different? <span className="text-gray-600 font-normal">(USP)</span></label>
                <textarea
                  value={form.usp}
                  onChange={(e) => updateForm("usp", e.target.value)}
                  rows={3}
                  placeholder="e.g. Unlike generic agencies, I specialise only in service businesses and use AI to cut production time — so clients get premium content at a third of the cost."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors resize-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Primary CTA <span className="text-gray-600 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={form.primary_cta}
                  onChange={(e) => updateForm("primary_cta", e.target.value)}
                  placeholder="e.g. Book a free call, DM me 'content', Visit my website"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors text-sm"
                />
                <p className="text-xs text-gray-600 mt-1.5">Default call-to-action used across generated content.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Proof Points <span className="text-gray-600 font-normal">(optional)</span></label>
                <textarea
                  value={form.proof_points}
                  onChange={(e) => updateForm("proof_points", e.target.value)}
                  rows={3}
                  placeholder="e.g. Helped 20 clients hit £10K/month. 5★ rating from 30+ clients. Featured in Forbes."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors resize-none text-sm"
                />
                <p className="text-xs text-gray-600 mt-1.5">Key results and wins — used in social proof hooks.</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && (
              <span className="text-sm text-teal-400 font-medium animate-pulse">Changes saved</span>
            )}
            {error && (
              <span className="text-sm text-red-400 font-medium">{error}</span>
            )}
          </div>
        </section>

        {/* ─── Section 3: Platform Profiles ─── */}
        {platformProfiles.length > 0 && (
          <section className="mb-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-2">Platform Profiles</h2>
            <p className="text-sm text-gray-500 mb-6">Platform-specific overrides — CTA, goal, frequency, and optional tone override. Global voice settings are set above.</p>

            {/* Platform tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {platformProfiles.map((pp) => (
                <button
                  key={pp.platform}
                  onClick={() => setActivePlatformTab(pp.platform)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activePlatformTab === pp.platform
                      ? "bg-teal-400/10 text-teal-400 border border-teal-400/30"
                      : "bg-white/[0.04] text-gray-400 border border-white/10 hover:border-white/20"
                  }`}
                >
                  {pp.platform === "x" ? "X (Twitter)" : pp.platform.charAt(0).toUpperCase() + pp.platform.slice(1)}
                </button>
              ))}
            </div>

            {/* Active platform form */}
            {platformForms[activePlatformTab] && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tone override <span className="text-gray-600 font-normal">(optional — leave blank to use global tone)</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[{ id: "", label: "Global", desc: "Uses your global setting" }, ...TONES].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setPlatformForms((prev) => ({
                          ...prev,
                          [activePlatformTab]: { ...prev[activePlatformTab], tone: t.id },
                        }))}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          platformForms[activePlatformTab].tone === t.id
                            ? "border-teal-400 bg-teal-400/10 text-white"
                            : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <div className="font-semibold text-xs mb-0.5">{t.label}</div>
                        <div className="text-[11px] text-gray-500 leading-snug">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Platform-specific copy examples <span className="text-gray-600 font-normal">(optional — overrides global examples for this platform)</span></label>
                  <textarea
                    value={platformForms[activePlatformTab].copyExamples}
                    onChange={(e) => setPlatformForms((prev) => ({
                      ...prev,
                      [activePlatformTab]: { ...prev[activePlatformTab], copyExamples: e.target.value },
                    }))}
                    rows={6}
                    placeholder="Paste example posts you like. Separate multiple examples with ---"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors resize-none text-sm"
                  />
                  <p className="text-xs text-gray-600 mt-1.5">Separate multiple examples with --- on its own line.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">CTA</label>
                    <input
                      type="text"
                      value={platformForms[activePlatformTab].cta}
                      onChange={(e) => setPlatformForms((prev) => ({
                        ...prev,
                        [activePlatformTab]: { ...prev[activePlatformTab], cta: e.target.value },
                      }))}
                      placeholder="e.g. DM me 'content', Book a call"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Goal</label>
                    <select
                      value={platformForms[activePlatformTab].goals}
                      onChange={(e) => setPlatformForms((prev) => ({
                        ...prev,
                        [activePlatformTab]: { ...prev[activePlatformTab], goals: e.target.value },
                      }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors appearance-none text-sm"
                    >
                      <option value="" className="bg-[#141414]">Select goal...</option>
                      {["Lead Generation", "Brand Awareness", "Thought Leadership", "Sales & Conversions", "Community Building"].map((g) => (
                        <option key={g} value={g} className="bg-[#141414]">{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Posting Frequency</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={7}
                      value={platformForms[activePlatformTab].frequency}
                      onChange={(e) => setPlatformForms((prev) => ({
                        ...prev,
                        [activePlatformTab]: { ...prev[activePlatformTab], frequency: Number(e.target.value) },
                      }))}
                      className="flex-1 accent-teal-400"
                    />
                    <span className="text-sm text-teal-400 font-semibold w-20 text-right">
                      {platformForms[activePlatformTab].frequency}x/week
                    </span>
                  </div>
                </div>

                {/* Style description (read-only) */}
                {platformProfiles.find((p) => p.platform === activePlatformTab)?.style_description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">AI Style Analysis</label>
                    <div className="bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-gray-300 leading-relaxed">
                      {platformProfiles.find((p) => p.platform === activePlatformTab)?.style_description}
                    </div>
                    <p className="text-xs text-gray-600 mt-1.5">Generated from your uploaded example screenshots.</p>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <button
                    onClick={async () => {
                      setPlatformSaving(true)
                      setPlatformError("")
                      setPlatformSaved(false)
                      try {
                        const f = platformForms[activePlatformTab]
                        const copyExamples = f.copyExamples.split("\n---\n").map((s) => s.trim()).filter(Boolean)
                        const res = await fetch("/api/platform-profiles", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            platform: activePlatformTab,
                            tone: f.tone,
                            copy_examples: copyExamples,
                            primary_cta: f.cta,
                            goals: f.goals,
                            posting_frequency: f.frequency,
                          }),
                        })
                        if (!res.ok) throw new Error("Failed to save")
                        setPlatformSaved(true)
                        setTimeout(() => setPlatformSaved(false), 3000)
                      } catch {
                        setPlatformError("Failed to save platform profile.")
                      } finally {
                        setPlatformSaving(false)
                      }
                    }}
                    disabled={platformSaving}
                    className="px-8 py-3 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {platformSaving ? "Saving..." : `Save ${activePlatformTab === "x" ? "X" : activePlatformTab.charAt(0).toUpperCase() + activePlatformTab.slice(1)} Profile`}
                  </button>
                  {platformSaved && <span className="text-sm text-teal-400 font-medium animate-pulse">Saved</span>}
                  {platformError && <span className="text-sm text-red-400 font-medium">{platformError}</span>}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ─── Section 4: Platform Connections ─── */}
        <section className="mb-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Platform Connections</h2>
            <p className="text-sm text-gray-500 mt-1">
              Connect your social accounts for publishing and analytics sync.
            </p>
          </div>

          {/* Platform connection status badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {SOCIAL_PLATFORMS.map((p) => {
              const conn = platformConnections[p.id]
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveConnectionTab(p.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    activeConnectionTab === p.id
                      ? "border-teal-400/40 bg-teal-400/5"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    conn?.connected
                      ? "bg-teal-400/10 text-teal-400 border border-teal-400/20"
                      : "bg-white/[0.04] text-gray-500 border border-white/10"
                  }`}>
                    {p.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${activeConnectionTab === p.id ? "text-teal-400" : "text-white"}`}>{p.label}</p>
                    <p className={`text-[10px] font-medium ${conn?.connected ? "text-teal-400/70" : "text-gray-600"}`}>
                      {conn?.connected ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active platform form */}
          {(() => {
            const platform = SOCIAL_PLATFORMS.find((p) => p.id === activeConnectionTab)
            if (!platform) return null
            const conn = platformConnections[platform.id]
            const formData = connectionForms[platform.id] || { accessToken: "", accountId: "", tokenExpiresAt: "" }

            return (
              <div className="border-t border-white/[0.06] pt-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-white">{platform.label}</h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      conn?.connected
                        ? "bg-teal-400/10 text-teal-400 border-teal-400/30"
                        : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                    }`}
                  >
                    {conn?.connected ? "Connected" : "Not Connected"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Access Token</label>
                    <input
                      type="password"
                      value={formData.accessToken}
                      onChange={(e) => setConnectionForms((prev) => ({
                        ...prev,
                        [platform.id]: { ...prev[platform.id], accessToken: e.target.value },
                      }))}
                      placeholder={conn?.connected ? "Enter a new token to rotate credentials" : `Paste your ${platform.label} access token`}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
                    />
                    <p className="text-xs text-gray-600 mt-1.5">
                      Token is encrypted at rest when SOCIAL_TOKEN_ENCRYPTION_KEY is configured.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{platform.accountLabel}</label>
                    <input
                      type="text"
                      value={formData.accountId}
                      onChange={(e) => setConnectionForms((prev) => ({
                        ...prev,
                        [platform.id]: { ...prev[platform.id], accountId: e.target.value },
                      }))}
                      placeholder={platform.accountPlaceholder}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Token Expires At (optional)</label>
                    <input
                      type="text"
                      value={formData.tokenExpiresAt}
                      onChange={(e) => setConnectionForms((prev) => ({
                        ...prev,
                        [platform.id]: { ...prev[platform.id], tokenExpiresAt: e.target.value },
                      }))}
                      placeholder="2026-12-31T00:00:00Z"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
                    />
                  </div>
                </div>

                {conn?.updatedAt && (
                  <p className="text-xs text-gray-600 mt-4">
                    Last updated: {new Date(conn.updatedAt).toLocaleString()}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => savePlatformConnection(platform.id)}
                    disabled={connectionSaving || !formData.accountId || !formData.accessToken}
                    className="px-6 py-3 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {connectionSaving ? "Saving..." : `Save ${platform.label} Connection`}
                  </button>
                  <button
                    onClick={() => disconnectPlatformConnection(platform.id)}
                    disabled={connectionSaving || !conn?.connected}
                    className="px-6 py-3 bg-white/[0.06] border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/[0.1] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={() => refreshPlatformConnection(platform.id)}
                    disabled={connectionLoading}
                    className="px-6 py-3 bg-white/[0.06] border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/[0.1] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {connectionLoading ? "Refreshing..." : "Refresh Status"}
                  </button>
                  {connectionSaved && <span className="text-sm text-teal-400 font-medium">{platform.label} settings saved</span>}
                  {connectionError && <span className="text-sm text-red-400 font-medium">{connectionError}</span>}
                </div>
              </div>
            )
          })()}
        </section>

        {/* ─── Section 4: Tokens & Billing ─── */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Tokens & Billing</h2>

          {/* Balance Card */}
          <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-teal-400/10 to-transparent border border-teal-400/20 mb-8">
            <div>
              <p className="text-sm text-gray-400 mb-1">Current Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-teal-400">{tokenBalance}</span>
                <span className="text-gray-500">tokens</span>
              </div>
            </div>
            <a
              href="/pricing"
              className="px-6 py-3 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all"
            >
              Buy More Tokens
            </a>
          </div>

          {/* Transaction History */}
          <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No transactions yet.</p>
              <p className="text-sm mt-1">Your token purchases and usage will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/[0.06]">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Description</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/[0.03]">
                      <td className="py-3.5 pr-4 text-sm text-gray-400">
                        {new Date(tx.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          tx.type === "purchase"
                            ? "bg-teal-400/10 text-teal-400"
                            : "bg-white/[0.04] text-gray-400"
                        }`}>
                          {tx.type === "purchase" ? "Purchase" : "Usage"}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-sm text-gray-300">{tx.description}</td>
                      <td className={`py-3.5 text-sm font-semibold text-right ${
                        tx.amount > 0 ? "text-teal-400" : "text-red-400"
                      }`}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
