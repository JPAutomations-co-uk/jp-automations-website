"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/components/AuthProvider"

interface XProfile {
  name: string
  niche: string
  audience_description: string
  tone: string
  writing_style: string
  hook_style: string
  post_length_preference: string
  hashtag_preference: boolean
  banned_words: string[]
  cta_preference: string
  current_followers: number
  growth_goal: string
  growth_timeframe: string
  secondary_metric: string
  thread_structure_preference: string
}

interface VoiceExample {
  id: string
  post_text: string
  performance_label: string
  likes: number
  reposts: number
  impressions: number
  source: string
  created_at: string
}

const PROFILE_FIELDS: {
  key: keyof XProfile
  label: string
  type: "text" | "textarea" | "number" | "toggle"
}[] = [
  { key: "name", label: "Name / Handle", type: "text" },
  { key: "niche", label: "Niche", type: "text" },
  { key: "audience_description", label: "Target Audience", type: "textarea" },
  { key: "tone", label: "Tone", type: "text" },
  { key: "writing_style", label: "Writing Style", type: "text" },
  { key: "hook_style", label: "Hook Style", type: "text" },
  { key: "post_length_preference", label: "Post Length Preference", type: "text" },
  { key: "hashtag_preference", label: "Use Hashtags", type: "toggle" },
  { key: "cta_preference", label: "CTA Style", type: "text" },
  { key: "current_followers", label: "Current Followers", type: "number" },
  { key: "growth_goal", label: "Growth Goal", type: "text" },
  { key: "secondary_metric", label: "Secondary Metric", type: "text" },
]

export default function XProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<XProfile | null>(null)
  const [examples, setExamples] = useState<VoiceExample[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [editedProfile, setEditedProfile] = useState<Partial<XProfile>>({})

  // Voice example form
  const [newPostText, setNewPostText] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [addingExample, setAddingExample] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([
      fetch("/api/x-profile").then((r) => r.json()),
      fetch("/api/x-profile/voice-examples").then((r) => r.json()),
    ])
      .then(([profileData, examplesData]) => {
        if (profileData.profile) {
          setProfile(profileData.profile)
          setEditedProfile(profileData.profile)
        }
        setExamples(examplesData.examples || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaveMessage("")
    try {
      const res = await fetch("/api/x-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedProfile),
      })
      if (res.ok) {
        setSaveMessage("Profile saved")
        setProfile(editedProfile as XProfile)
        setTimeout(() => setSaveMessage(""), 3000)
      } else {
        setSaveMessage("Failed to save")
      }
    } catch {
      setSaveMessage("Failed to save")
    }
    setSaving(false)
  }

  const handleAddExample = async () => {
    if (!newPostText.trim()) return
    setAddingExample(true)
    try {
      const res = await fetch("/api/x-profile/voice-examples", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_text: newPostText.trim(),
          performance_label: newLabel.trim() || null,
          source: "manual",
        }),
      })
      const data = await res.json()
      if (res.ok && data.example) {
        setExamples([data.example, ...examples])
        setNewPostText("")
        setNewLabel("")
      }
    } catch {
      // silent fail
    }
    setAddingExample(false)
  }

  const handleDeleteExample = async (id: string) => {
    try {
      const res = await fetch(`/api/x-profile/voice-examples?id=${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setExamples(examples.filter((e) => e.id !== id))
      }
    } catch {
      // silent fail
    }
  }

  const updateField = (key: keyof XProfile, value: unknown) => {
    setEditedProfile((prev) => ({ ...prev, [key]: value }))
  }

  if (!user || loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-gray-500 mb-4">No X profile found.</p>
        <a
          href="/dashboard/social-engine/x/onboarding"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all"
        >
          Set Up Profile
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <a
            href="/dashboard/social-engine/x"
            className="text-gray-500 hover:text-teal-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-2xl md:text-3xl font-bold text-white">X Profile</h1>
        </div>
        <p className="text-gray-500">Edit your brand voice settings and manage voice examples.</p>
      </div>

      {/* Brand Profile */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-6">Brand Profile</h2>
        <div className="space-y-5">
          {PROFILE_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={String(editedProfile[field.key] ?? "")}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none text-sm"
                />
              ) : field.type === "toggle" ? (
                <button
                  onClick={() => updateField(field.key, !editedProfile[field.key])}
                  className={`relative w-14 h-7 rounded-full transition-all ${
                    editedProfile[field.key] ? "bg-teal-400" : "bg-white/[0.1]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      editedProfile[field.key] ? "translate-x-7" : ""
                    }`}
                  />
                </button>
              ) : (
                <input
                  type={field.type}
                  value={String(editedProfile[field.key] ?? "")}
                  onChange={(e) =>
                    updateField(
                      field.key,
                      field.type === "number"
                        ? parseInt(e.target.value, 10) || 0
                        : e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saveMessage && (
            <span className={`text-sm ${saveMessage === "Profile saved" ? "text-teal-400" : "text-red-400"}`}>
              {saveMessage}
            </span>
          )}
        </div>
      </div>

      {/* Voice Examples */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Voice Examples</h2>
        <p className="text-sm text-gray-500 mb-6">
          Add your best tweets so the AI can learn your style.
        </p>

        {/* Add new */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-6">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            rows={3}
            placeholder="Paste one of your best tweets here..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none text-sm mb-3"
          />
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Performance label (e.g. went viral, most replies)"
              className="flex-1 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 text-sm"
            />
            <button
              onClick={handleAddExample}
              disabled={!newPostText.trim() || addingExample}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-50 shrink-0"
            >
              {addingExample ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {/* List */}
        {examples.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-8">
            No voice examples yet. Add your best-performing tweets above.
          </p>
        ) : (
          <div className="space-y-3">
            {examples.map((ex) => (
              <div
                key={ex.id}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap flex-1">
                    {ex.post_text}
                  </p>
                  <button
                    onClick={() => handleDeleteExample(ex.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {ex.performance_label && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-medium text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full">
                      {ex.performance_label}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {ex.source}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
