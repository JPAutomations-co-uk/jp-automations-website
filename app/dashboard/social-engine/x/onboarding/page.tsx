"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import ConversationalQA, { type Question } from "@/app/components/chat/ConversationalQA"

const ONBOARDING_QUESTIONS: Question[] = [
  {
    id: "name",
    question: "What's your name or creator handle?",
    inputType: "text",
    placeholder: "e.g. JP or @jpautomations",
  },
  {
    id: "niche",
    question: "What's your niche or topic?",
    inputType: "text",
    placeholder: "e.g. AI automation, fitness coaching, personal finance",
  },
  {
    id: "audience_description",
    question: "Describe your target audience in a sentence or two.",
    inputType: "textarea",
    placeholder: "e.g. Service business owners doing £15k+/month who want to automate their operations",
  },
  {
    id: "tone",
    question: "How would you describe your tone? Pick all that apply.",
    inputType: "multi-select",
    options: [
      { label: "Witty", value: "witty" },
      { label: "Raw / Honest", value: "raw/honest" },
      { label: "Professional", value: "professional" },
      { label: "Educational", value: "educational" },
      { label: "Conversational", value: "conversational" },
      { label: "Inspirational", value: "inspirational" },
      { label: "Sarcastic", value: "sarcastic" },
      { label: "Calm", value: "calm" },
    ],
  },
  {
    id: "writing_style",
    question: "How do you naturally write?",
    inputType: "single-select",
    options: [
      { label: "Short punchy sentences", value: "short punchy sentences" },
      { label: "Flowing and descriptive", value: "flowing and descriptive" },
      { label: "Mix of both", value: "mix of both" },
      { label: "Data-driven and structured", value: "data-driven and structured" },
    ],
  },
  {
    id: "hook_style",
    question: "What kind of hook do you prefer?",
    inputType: "single-select",
    options: [
      { label: "Bold claim", value: "bold claim" },
      { label: "Personal story", value: "personal story" },
      { label: "Surprising stat", value: "surprising stat" },
      { label: "Controversial question", value: "controversial question" },
      { label: "Relatable observation", value: "relatable observation" },
    ],
  },
  {
    id: "post_length_preference",
    question: "How long do your posts usually run?",
    inputType: "single-select",
    options: [
      { label: "Short (under 140 chars)", value: "short" },
      { label: "Medium (140–220 chars)", value: "medium" },
      { label: "Long (220–280 chars)", value: "long" },
      { label: "No preference", value: "no preference" },
    ],
  },
  {
    id: "hashtag_preference",
    question: "Do you use hashtags?",
    inputType: "toggle",
  },
  {
    id: "cta_preference",
    question: "What's your main CTA style?",
    inputType: "single-select",
    options: [
      { label: "Follow me", value: "follow me" },
      { label: "Reply with your thoughts", value: "reply with your thoughts" },
      { label: "Click the link", value: "click the link" },
      { label: "Repost if this helped", value: "repost if this helped" },
      { label: "No CTA", value: "no cta" },
    ],
  },
  {
    id: "banned_words",
    question: "Any words, topics, or phrases to always avoid?",
    inputType: "text",
    placeholder: "e.g. hustle, grind, 10x — separate with commas",
    optional: true,
  },
  {
    id: "current_followers",
    question: "How many followers do you have right now?",
    inputType: "number",
    placeholder: "e.g. 500",
  },
  {
    id: "growth_goal",
    question: "What's your growth goal and timeframe?",
    inputType: "text",
    placeholder: "e.g. 100 → 500 followers in 3 months",
  },
  {
    id: "secondary_metric",
    question: "Any secondary metric you're tracking?",
    inputType: "text",
    placeholder: "e.g. impressions, link clicks, replies per post",
    optional: true,
  },
]

// Pre-fill with JP Automations data — max growth config
const PREFILL_DATA: Record<string, unknown> = {
  name: "JP Automations",
  niche: "AI automation for service businesses",
  audience_description:
    "UK service businesses doing £15k+/month who want to scale without hiring. Overwhelmed by manual processes, inconsistent lead flow, and spending too much time on admin instead of growth.",
  tone: ["witty", "raw/honest", "educational"],
  writing_style: "short punchy sentences",
  hook_style: "bold claim",
  post_length_preference: "medium",
  hashtag_preference: false,
  cta_preference: "reply with your thoughts",
  banned_words: "hustle, grind, 10x, guru",
  current_followers: 500,
  growth_goal: "500 → 5000 followers in 6 months",
  secondary_metric: "impressions, replies per post, profile visits",
}

export default function XOnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [checkingProfile, setCheckingProfile] = useState(true)

  // Redirect if already onboarded
  useEffect(() => {
    if (!user) return
    fetch("/api/x-profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          router.replace("/dashboard/social-engine/x")
        } else {
          setCheckingProfile(false)
        }
      })
      .catch(() => setCheckingProfile(false))
  }, [user, router])

  const handleComplete = async (answers: Record<string, unknown>) => {
    setSaving(true)
    setError("")

    // Parse banned_words from comma-separated string to array
    const bannedWordsRaw = answers.banned_words as string
    const bannedWords = bannedWordsRaw
      ? bannedWordsRaw.split(",").map((w: string) => w.trim()).filter(Boolean)
      : []

    // Parse tone from array to comma-separated string
    const tone = Array.isArray(answers.tone)
      ? (answers.tone as string[]).join(", ")
      : answers.tone

    const payload = {
      name: answers.name,
      niche: answers.niche,
      audience_description: answers.audience_description,
      tone,
      writing_style: answers.writing_style,
      hook_style: answers.hook_style,
      post_length_preference: answers.post_length_preference,
      hashtag_preference: answers.hashtag_preference,
      banned_words: bannedWords,
      cta_preference: answers.cta_preference,
      current_followers: answers.current_followers || 0,
      growth_goal: answers.growth_goal,
      growth_timeframe: answers.growth_goal,
      secondary_metric: answers.secondary_metric || "",
    }

    try {
      const res = await fetch("/api/x-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push("/dashboard/social-engine/x/research")
      } else {
        const body = await res.json().catch(() => ({}))
        setError(body.error || `Failed to save profile (${res.status})`)
        setSaving(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — check your connection")
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-500">Please sign in to continue.</p>
      </div>
    )
  }

  if (checkingProfile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    )
  }

  if (saving) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white font-medium">Saving your X profile...</p>
          <p className="text-gray-500 text-sm">Setting up your content engine.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
          <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-sm font-medium text-gray-300">Profile Setup</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Let&apos;s set up your X profile
        </h1>
        <p className="text-gray-500">
          Answer a few questions so we can generate content that sounds like you.
        </p>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-3 text-red-500 hover:text-red-300 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <ConversationalQA
        questions={ONBOARDING_QUESTIONS}
        onComplete={handleComplete}
        prefillData={PREFILL_DATA}
        finalButtonLabel="Save Profile"
      />
    </div>
  )
}
