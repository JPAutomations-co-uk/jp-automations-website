"use client"

import { useRouter } from "next/navigation"
import { useOnboarding } from "@/app/components/OnboardingFormContext"
import FormStepLayout from "@/app/components/FormStepLayout"

const INDUSTRIES = [
  "Architecture & Interior Design",
  "Real Estate",
  "Construction & Trades",
  "Health & Fitness",
  "Beauty & Wellness",
  "Food & Hospitality",
  "E-commerce & Retail",
  "Professional Services",
  "Education & Coaching",
  "Tech & SaaS",
  "Creative Agency",
  "Marketing & Media",
  "Finance & Accounting",
  "Legal Services",
  "Other",
]

export default function OnboardingStep2() {
  const router = useRouter()
  const { data, updateField } = useOnboarding()

  const isValid =
    data.industry.trim().length > 0 &&
    data.targetAudience.trim().length > 0

  return (
    <FormStepLayout
      title="Your market"
      subtitle="Help us understand who you serve — this shapes every piece of content we create."
      step={2}
      totalSteps={6}
    >
      <div className="space-y-5 max-w-md mx-auto text-left">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Industry / Niche</label>
          <select
            value={data.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all appearance-none"
          >
            <option value="" className="bg-gray-900">Select your industry</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry} className="bg-gray-900">
                {industry}
              </option>
            ))}
          </select>
        </div>

        {data.industry === "Other" && (
          <input
            type="text"
            placeholder="Describe your industry"
            onChange={(e) => updateField("industry", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
          />
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-2">Who do you help?</label>
          <textarea
            placeholder="e.g. Service business owners who want to grow online but don't have time to create content consistently"
            value={data.targetAudience}
            onChange={(e) => updateField("targetAudience", e.target.value)}
            rows={4}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
          />
          <p className="text-xs text-gray-600 mt-1.5">Who they are, what they struggle with, what they want to achieve.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/onboarding/step-1")}
            className="w-1/3 py-5 rounded-xl font-semibold bg-white/[0.06] text-gray-400 border border-white/10 hover:border-white/20 transition-all"
          >
            ← Back
          </button>
          <button
            disabled={!isValid}
            onClick={() => router.push("/onboarding/step-3")}
            className={`w-2/3 py-5 rounded-xl font-semibold transition-all ${
              isValid
                ? "bg-teal-400 text-black hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </FormStepLayout>
  )
}
