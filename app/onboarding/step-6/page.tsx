"use client"

import { useRouter } from "next/navigation"
import { useOnboarding } from "@/app/components/OnboardingFormContext"
import FormStepLayout from "@/app/components/FormStepLayout"

const PLATFORMS = [
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    desc: "Professional networking, thought leadership, B2B",
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    desc: "Visual content, reels, stories, community",
  },
  {
    value: "x",
    label: "X (Twitter)",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    desc: "Short-form, threads, real-time engagement",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    desc: "Long-form video, shorts, tutorials",
  },
]

export default function OnboardingStep6() {
  const router = useRouter()
  const { data, updateField } = useOnboarding()

  const togglePlatform = (platform: string) => {
    const current = data.selectedPlatforms
    if (current.includes(platform)) {
      updateField("selectedPlatforms", current.filter((p) => p !== platform))
    } else {
      updateField("selectedPlatforms", [...current, platform])
    }
  }

  const isValid = data.selectedPlatforms.length > 0

  return (
    <FormStepLayout
      title="Your platforms"
      subtitle="Which platforms do you create content for? We'll guide you through setup the first time you use each one."
      step={6}
      totalSteps={6}
    >
      <div className="space-y-6 max-w-md mx-auto text-left">
        <div className="grid grid-cols-1 gap-3">
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => togglePlatform(p.value)}
              className={`flex items-center gap-4 text-left px-5 py-4 rounded-xl border transition-all ${
                data.selectedPlatforms.includes(p.value)
                  ? "border-teal-400 bg-teal-400/10"
                  : "border-white/10 bg-black/40 hover:border-teal-400/50"
              }`}
            >
              <div className={`shrink-0 ${data.selectedPlatforms.includes(p.value) ? "text-teal-400" : "text-gray-500"}`}>
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-semibold block ${data.selectedPlatforms.includes(p.value) ? "text-teal-400" : "text-white"}`}>
                  {p.label}
                </span>
                <span className="text-xs text-gray-600">{p.desc}</span>
              </div>
              {data.selectedPlatforms.includes(p.value) && (
                <svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {data.selectedPlatforms.length > 0 && (
          <p className="text-xs text-gray-500 text-center">
            {data.selectedPlatforms.length} platform{data.selectedPlatforms.length !== 1 ? "s" : ""} selected
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/onboarding/step-5")}
            className="w-1/3 py-5 rounded-xl font-semibold bg-white/[0.06] text-gray-400 border border-white/10 hover:border-white/20 transition-all"
          >
            &larr; Back
          </button>
          <button
            disabled={!isValid}
            onClick={() => router.push("/onboarding/complete")}
            className={`w-2/3 py-5 rounded-xl font-semibold transition-all ${
              isValid
                ? "bg-teal-400 text-black hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </FormStepLayout>
  )
}
