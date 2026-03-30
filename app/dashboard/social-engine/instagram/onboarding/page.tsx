"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import ConversationalQA, { type Question } from "@/app/components/chat/ConversationalQA"

const PREFILL_DATA: Record<string, unknown> = {
  name: "JP Automations",
  handle: "@jpautomations",
  niche: "AI automation for service businesses",
  audience_description:
    "UK service business owners doing £15k+/month who want to scale without hiring. Overwhelmed by manual processes, inconsistent lead flow, and spending too much time on admin instead of growth.",
  tone: ["educational", "raw/honest", "witty"],
  writing_style: "short punchy lines",
  content_format: "mixed",
  hook_style: "bold claim",
  caption_length: "medium",
  hashtag_strategy: "3-5 niche",
  cta_preference: "DM me",
  visual_aesthetic: "bold_editorial",
  proof_points:
    "Built 50+ automations for service businesses. Clients save 15-20 hours/week. £2.4M revenue generated through automated funnels. 97% client retention rate.",
  copy_examples: "",
  voice_sample: "",
  style_reference: "",
  speaking_style: "fast_energetic",
  banned_words: "hustle, grind, 10x, guru",
  current_followers: 500,
  growth_goal: "500 → 10K followers in 6 months, more DM leads",
}

const ONBOARDING_QUESTIONS: Question[] = [
  // ─── Identity ───
  {
    id: "name",
    question: "What's your name or brand name?",
    inputType: "text",
    placeholder: "e.g. JP Automations or @jpautomations",
  },
  {
    id: "handle",
    question: "What's your Instagram handle?",
    inputType: "text",
    placeholder: "e.g. @jpautomations",
  },
  {
    id: "niche",
    question: "What's your niche or industry?",
    inputType: "text",
    placeholder: "e.g. AI automation, interior design, personal training",
  },
  {
    id: "audience_description",
    question: "Describe your target audience in a sentence or two.",
    inputType: "textarea",
    placeholder:
      "e.g. UK service business owners doing £15k+/month who want to scale without hiring",
  },

  // ─── Voice & Tone ───
  {
    id: "tone",
    question: "How would you describe your tone? Pick all that apply.",
    inputType: "multi-select",
    options: [
      { label: "Educational", value: "educational" },
      { label: "Conversational", value: "conversational" },
      { label: "Inspirational", value: "inspirational" },
      { label: "Bold / Opinionated", value: "bold" },
      { label: "Witty", value: "witty" },
      { label: "Professional", value: "professional" },
      { label: "Raw / Honest", value: "raw/honest" },
      { label: "Calm / Minimal", value: "calm" },
    ],
  },
  {
    id: "writing_style",
    question: "How do you naturally write captions?",
    inputType: "single-select",
    options: [
      { label: "Short punchy lines", value: "short punchy lines" },
      { label: "Storytelling / narrative", value: "storytelling and narrative" },
      { label: "Step-by-step / listicles", value: "step-by-step listicles" },
      { label: "Mix of everything", value: "mix of everything" },
    ],
  },

  // ─── Proof & Authority ───
  {
    id: "proof_points",
    question:
      "What are your strongest proof points? Specific numbers, results, or achievements.",
    inputType: "textarea",
    placeholder:
      "e.g. Built 50+ automations for service businesses. Clients save 15-20 hours/week. £2.4M revenue generated.",
  },

  // ─── Voice Samples (high-impact for prompt quality) ───
  {
    id: "copy_examples",
    question:
      "Paste 2-3 real captions you've written that sound like you. These train the AI on your exact voice.",
    inputType: "textarea",
    placeholder:
      "Paste your best captions here, separated by --- between each one. The more examples, the more accurate the output.",
    optional: true,
  },
  {
    id: "voice_sample",
    question:
      "How do you naturally speak or write? Paste a paragraph of how you'd explain your work to a friend.",
    inputType: "textarea",
    placeholder:
      "e.g. Look, most businesses waste hours on stuff that should take minutes. I build systems that handle the boring stuff so you can focus on growing...",
    optional: true,
  },
  {
    id: "style_reference",
    question:
      "Is there someone whose Instagram style you admire? Paste one of their captions as a reference.",
    inputType: "textarea",
    placeholder:
      "Paste a caption from a creator whose writing style you want to emulate. We'll analyse it and match that energy.",
    optional: true,
  },

  // ─── Content Preferences ───
  {
    id: "content_format",
    question: "What format do you post most?",
    inputType: "single-select",
    options: [
      { label: "Carousels", value: "carousel-heavy" },
      { label: "Reels", value: "reels-focused" },
      { label: "Single images", value: "single-images" },
      { label: "Mix of everything", value: "mixed" },
    ],
  },
  {
    id: "hook_style",
    question: "What kind of hooks grab your audience?",
    inputType: "single-select",
    options: [
      { label: "Bold claim / hot take", value: "bold claim" },
      { label: "Specific numbers / stats", value: "specific numbers" },
      { label: "Personal story", value: "personal story" },
      { label: "Question / curiosity gap", value: "curiosity gap" },
      { label: "Before / after transformation", value: "transformation" },
    ],
  },
  {
    id: "caption_length",
    question: "How long are your captions typically?",
    inputType: "single-select",
    options: [
      { label: "Short (under 300 chars)", value: "short" },
      { label: "Medium (300–800 chars)", value: "medium" },
      { label: "Long (800+ chars)", value: "long" },
      { label: "No preference", value: "no preference" },
    ],
  },

  // ─── Reel-Specific ───
  {
    id: "speaking_style",
    question: "How do you speak in reels / on camera?",
    inputType: "single-select",
    options: [
      { label: "Fast & energetic", value: "fast_energetic" },
      { label: "Calm & measured", value: "calm_measured" },
      { label: "Story-driven & conversational", value: "story_driven" },
      { label: "Data-driven & structured", value: "data_driven" },
    ],
  },

  // ─── Strategy ───
  {
    id: "hashtag_strategy",
    question: "How do you use hashtags?",
    inputType: "single-select",
    options: [
      { label: "3–5 niche-specific", value: "3-5 niche" },
      { label: "8–12 mixed broad + niche", value: "8-12 mixed" },
      { label: "None", value: "none" },
      { label: "No preference", value: "no preference" },
    ],
  },
  {
    id: "cta_preference",
    question: "What's your main CTA style?",
    inputType: "single-select",
    options: [
      { label: "Save this for later", value: "save this" },
      { label: "Comment / start a discussion", value: "comment below" },
      { label: "DM me [keyword]", value: "DM me" },
      { label: "Link in bio", value: "link in bio" },
      { label: "Follow for more", value: "follow for more" },
      { label: "Share with someone", value: "share with someone" },
    ],
  },
  {
    id: "visual_aesthetic",
    question: "What visual aesthetic fits your brand?",
    inputType: "single-select",
    options: [
      { label: "Dark luxury / moody", value: "dark_luxury" },
      { label: "Clean minimal / Scandinavian", value: "clean_minimal" },
      { label: "Bold editorial / high contrast", value: "bold_editorial" },
      { label: "Warm natural / earthy", value: "warm_natural" },
      { label: "Bright playful / vibrant", value: "bright_playful" },
      { label: "No preference", value: "no preference" },
    ],
  },
  {
    id: "banned_words",
    question: "Any words, topics, or phrases to always avoid?",
    inputType: "text",
    placeholder: "e.g. hustle, grind, game-changer — separate with commas",
    optional: true,
  },
  {
    id: "current_followers",
    question: "How many followers do you have right now?",
    inputType: "number",
    placeholder: "e.g. 2500",
  },
  {
    id: "growth_goal",
    question: "What's your growth goal and timeframe?",
    inputType: "text",
    placeholder: "e.g. 2.5K → 10K followers in 6 months, more DM leads",
  },
]

export default function InstagramOnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [checkingProfile, setCheckingProfile] = useState(true)
  const [prefill, setPrefill] = useState<Record<string, unknown>>(PREFILL_DATA)
  const [isEditing, setIsEditing] = useState(false)

  // Load existing profile data as prefill, or use defaults
  useEffect(() => {
    if (!user) return
    fetch("/api/instagram-profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setIsEditing(true)
          const p = data.profile
          setPrefill({
            name: p.name || PREFILL_DATA.name,
            handle: p.handle || PREFILL_DATA.handle,
            niche: p.niche || PREFILL_DATA.niche,
            audience_description:
              p.audience_description || PREFILL_DATA.audience_description,
            tone: p.tone
              ? Array.isArray(p.tone)
                ? p.tone
                : [p.tone]
              : PREFILL_DATA.tone,
            writing_style: p.writing_style || PREFILL_DATA.writing_style,
            content_format: p.content_format || PREFILL_DATA.content_format,
            hook_style: p.hook_style || PREFILL_DATA.hook_style,
            caption_length: p.caption_length || PREFILL_DATA.caption_length,
            hashtag_strategy:
              p.hashtag_strategy || PREFILL_DATA.hashtag_strategy,
            cta_preference: p.cta_preference || PREFILL_DATA.cta_preference,
            visual_aesthetic:
              p.visual_aesthetic || PREFILL_DATA.visual_aesthetic,
            proof_points: p.proof_points || PREFILL_DATA.proof_points,
            copy_examples: Array.isArray(p.copy_examples)
              ? p.copy_examples.join("\n---\n")
              : p.copy_examples || "",
            voice_sample: p.voice_sample || "",
            style_reference: p.style_reference || "",
            speaking_style: p.speaking_style || PREFILL_DATA.speaking_style,
            banned_words: Array.isArray(p.banned_words)
              ? p.banned_words.join(", ")
              : p.banned_words || PREFILL_DATA.banned_words,
            current_followers:
              p.current_followers || PREFILL_DATA.current_followers,
            growth_goal: p.growth_goal || PREFILL_DATA.growth_goal,
          })
        }
        setCheckingProfile(false)
      })
      .catch(() => setCheckingProfile(false))
  }, [user])

  const handleComplete = async (answers: Record<string, unknown>) => {
    setSaving(true)
    setError("")

    // Parse copy_examples from --- separated string to array
    const copyRaw = answers.copy_examples as string
    const copyExamples = copyRaw
      ? copyRaw
          .split("---")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : []

    const payload = {
      ...answers,
      copy_examples: copyExamples,
    }

    try {
      const res = await fetch("/api/instagram-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push("/dashboard/social-engine/instagram")
      } else {
        const body = await res.json().catch(() => ({}))
        setError(body.error || `Failed to save profile (${res.status})`)
        setSaving(false)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error — check your connection"
      )
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
          <p className="text-white font-medium">Saving your Instagram profile...</p>
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
          <svg
            className="w-4 h-4 text-teal-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-300">Profile Setup</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {isEditing
            ? "Edit your Instagram profile"
            : "Let\u0027s set up your Instagram profile"}
        </h1>
        <p className="text-gray-500">
          {isEditing
            ? "Update your preferences and we\u0027ll adapt all future content to match."
            : "Answer a few questions so we can generate content that sounds like you and reaches the right audience."}
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
        finalButtonLabel={isEditing ? "Update Profile" : "Save Profile"}
        prefillData={prefill}
      />
    </div>
  )
}
