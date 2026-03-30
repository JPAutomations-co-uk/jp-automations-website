"use client"

import { useRouter } from "next/navigation"
import { useOnboarding } from "@/app/components/OnboardingFormContext"
import FormStepLayout from "@/app/components/FormStepLayout"

const USE_CASE_OPTIONS = [
  { value: "business", label: "I run a business / freelance", desc: "Generate content to grow your business" },
  { value: "creator", label: "I'm an influencer / creator", desc: "Build your personal brand & audience" },
  { value: "career", label: "Level up my career", desc: "Stand out for future opportunities" },
]

export default function OnboardingStep1() {
  const router = useRouter()
  const { data, updateField } = useOnboarding()

  const isValid =
    data.useCase.trim().length > 0 &&
    data.businessName.trim().length > 0 &&
    data.location.trim().length > 0

  return (
    <FormStepLayout
      title="Your business"
      subtitle="Tell us the basics — we'll use this as the foundation for everything we generate."
      step={1}
      totalSteps={6}
    >
      <div className="space-y-4 max-w-md mx-auto">
        <div className="text-left">
          <label className="block text-sm text-gray-400 mb-2">What are you using the social media engine for?</label>
          <div className="grid grid-cols-1 gap-2">
            {USE_CASE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField("useCase", opt.value)}
                className={`flex flex-col text-left px-4 py-3.5 rounded-xl border transition-all ${
                  data.useCase === opt.value
                    ? "border-teal-400 bg-teal-400/10"
                    : "border-white/10 bg-black/40 hover:border-teal-400/50"
                }`}
              >
                <span className={`text-sm font-semibold ${data.useCase === opt.value ? "text-teal-400" : "text-white"}`}>
                  {opt.label}
                </span>
                <span className="text-xs text-gray-600 mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder={data.useCase === "career" ? "Your name" : "Business name"}
          value={data.businessName}
          onChange={(e) => updateField("businessName", e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
        />

        <input
          type="url"
          placeholder="Website URL (optional)"
          value={data.websiteUrl}
          onChange={(e) => updateField("websiteUrl", e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
        />

        <input
          type="text"
          placeholder="Location (e.g. London, UK)"
          value={data.location}
          onChange={(e) => updateField("location", e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
        />

        <button
          disabled={!isValid}
          onClick={() => router.push("/onboarding/step-2")}
          className={`w-full py-5 rounded-xl font-semibold transition-all ${
            isValid
              ? "bg-teal-400 text-black hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next →
        </button>

        <button
          onClick={() => router.push("/onboarding")}
          className="w-full text-sm text-gray-600 hover:text-gray-400 transition-colors py-2"
        >
          ← Back
        </button>
      </div>
    </FormStepLayout>
  )
}
