"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/app/components/OnboardingFormContext"

export default function OnboardingComplete() {
  const router = useRouter()
  const { data } = useOnboarding()
  const [saving, setSaving] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function saveProfile() {
      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            use_case: data.useCase,
            business_name: data.businessName,
            website_url: data.websiteUrl,
            location: data.location,
            industry: data.industry,
            target_audience: data.targetAudience,
            offers: data.offers,
            usp: data.usp,
            primary_cta: data.primaryCta,
            tone: data.tone,
            voice_sample: data.voiceSample,
            instagram_handle: data.instagramHandle,
            x_handle: data.xHandle,
            linkedin_handle: data.linkedinHandle,
            proof_points: data.proofPoints,
            goals: data.goals,
            desired_outcomes: data.desiredOutcomes,
            onboarding_complete: true,
          }),
        })

        if (!res.ok) {
          const body = await res.json()
          throw new Error(body.error || "Failed to save profile")
        }

        // Save platform profiles
        for (const platform of data.selectedPlatforms) {
          const pp = data.platformProfiles[platform]
          if (!pp) continue

          // Merge global copy examples (from step 4) with any platform-specific ones
          const globalExamples = [data.voiceSample, data.copyExample2, data.copyExample3]
            .filter((s) => s.trim())
          const copyExamples = globalExamples.length > 0 ? globalExamples : pp.copyExamples

          // Build style_description with writing rhythm + banned words
          const bannedWordsList = data.bannedWords
            ? data.bannedWords.split(",").map((w: string) => w.trim()).filter(Boolean)
            : []
          const styleDescription = JSON.stringify({
            writing_style: data.writingRhythm || "mixed",
            voice_traits: data.voiceTraits ?? [],
            banned_words: bannedWordsList,
          })

          await fetch("/api/platform-profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              platform,
              tone: data.tone,
              copy_examples: copyExamples,
              example_image_urls: pp.exampleImageUrls,
              goals: pp.goals,
              primary_cta: pp.cta,
              posting_frequency: pp.frequency,
              style_description: styleDescription,
            }),
          })
        }

        // Save X content profile
        const bannedWords = data.xBannedWords
          ? data.xBannedWords.split(",").map((w: string) => w.trim()).filter(Boolean)
          : []

        await fetch("/api/x-profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.businessName,
            niche: data.industry,
            audience_description: data.targetAudience,
            tone: data.tone,
            writing_style: data.xWritingStyle,
            hook_style: data.xHookStyle,
            post_length_preference: data.xPostLengthPreference,
            hashtag_preference: data.xHashtagPreference,
            banned_words: bannedWords,
            cta_preference: data.xCtaPreference,
            current_followers: parseInt(data.xCurrentFollowers, 10) || 0,
            growth_goal: data.xGrowthGoal,
            growth_timeframe: data.xGrowthGoal,
            secondary_metric: data.xSecondaryMetric,
          }),
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setSaving(false)
      }
    }

    saveProfile()
  }, [data])

  if (saving) {
    return (
      <main className="relative min-h-screen bg-[#0B0F14] flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-white font-semibold">Saving your profile...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="relative min-h-screen bg-[#0B0F14] flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => { setError(""); setSaving(true); }}
            className="px-6 py-3 rounded-xl bg-teal-400 text-black font-semibold hover:bg-teal-300 transition-all"
          >
            Try again
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-[#0B0F14] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.08),transparent_70%)]" />

      <section className="relative z-10 w-full max-w-lg text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          You&apos;re all set
        </h1>
        <p className="text-gray-400 text-lg mb-2">
          Your profile is saved. Every app is now powered by your business context.
        </p>
        <p className="text-gray-600 text-sm mb-10">
          You can update any of this at any time in <span className="text-gray-400">Settings</span>.
        </p>

        {/* Profile summary */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-8 text-left space-y-2.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What we saved</p>
          {[
            { label: "Business", value: data.businessName },
            { label: "Industry", value: data.industry },
            { label: "Tone", value: data.tone },
            { label: "Offers", value: data.offers ? "✓ Added" : "—" },
            { label: "USP", value: data.usp ? "✓ Added" : "—" },
            { label: "Goal", value: data.goals || "—" },
            { label: "Proof points", value: data.proofPoints ? "✓ Added" : "—" },
            { label: "Platforms", value: data.selectedPlatforms.length > 0 ? data.selectedPlatforms.map(p => p === "x" ? "X" : p.charAt(0).toUpperCase() + p.slice(1)).join(", ") : "—" },
            { label: "X writing style", value: data.xWritingStyle || "—" },
            { label: "X hook style", value: data.xHookStyle || "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-xs text-gray-500">{label}</span>
              <span className="text-xs text-gray-300 text-right truncate max-w-[200px]">{value || "—"}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-5 rounded-xl font-semibold text-black bg-teal-400 hover:bg-teal-300 transition-all hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:scale-[1.02] text-lg mb-3"
        >
          Go to my dashboard →
        </button>

        <button
          onClick={() => router.push("/dashboard/settings")}
          className="w-full py-3 rounded-xl text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Edit profile in Settings
        </button>
      </section>
    </main>
  )
}
