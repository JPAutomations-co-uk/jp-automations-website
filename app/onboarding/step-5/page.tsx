"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/app/components/OnboardingFormContext"
import FormStepLayout from "@/app/components/FormStepLayout"

const PILLAR_SUGGESTIONS = [
  "Behind the scenes",
  "Tips & education",
  "Client results",
  "Product showcase",
  "Industry trends",
  "Personal brand",
  "Testimonials",
  "How-to guides",
  "Inspiration",
  "News & updates",
]

export default function OnboardingStep5() {
  const router = useRouter()
  const { data, updateField } = useOnboarding()
  const [pillarInput, setPillarInput] = useState("")

  const togglePillar = (pillar: string) => {
    const current = data.contentPillars
    if (current.includes(pillar)) {
      updateField("contentPillars", current.filter((p) => p !== pillar))
    } else if (current.length < 5) {
      updateField("contentPillars", [...current, pillar])
    }
  }

  const addCustomPillar = () => {
    const trimmed = pillarInput.trim()
    if (trimmed && data.contentPillars.length < 5 && !data.contentPillars.includes(trimmed)) {
      updateField("contentPillars", [...data.contentPillars, trimmed])
      setPillarInput("")
    }
  }

  // At least 1 social handle or content pillars set = valid (everything is optional here)
  const isValid = true

  return (
    <FormStepLayout
      title="Social & proof"
      subtitle="Almost done. Add your handles and any results you can share — used to make content feel specific and credible."
      step={5}
      totalSteps={6}
    >
      <div className="space-y-6 max-w-md mx-auto text-left">
        {/* Social handles */}
        <div>
          <label className="block text-sm text-gray-400 mb-3">Social handles <span className="text-gray-600 font-normal">(all optional)</span></label>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus-within:border-teal-400 transition-all">
              <svg className="w-4 h-4 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
              <input
                type="text"
                placeholder="@yourhandle"
                value={data.instagramHandle}
                onChange={(e) => updateField("instagramHandle", e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-600 focus:outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus-within:border-teal-400 transition-all">
              <svg className="w-4 h-4 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <input
                type="text"
                placeholder="@yourhandle"
                value={data.xHandle}
                onChange={(e) => updateField("xHandle", e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-600 focus:outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus-within:border-teal-400 transition-all">
              <svg className="w-4 h-4 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <input
                type="text"
                placeholder="linkedin.com/in/yourname"
                value={data.linkedinHandle}
                onChange={(e) => updateField("linkedinHandle", e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-600 focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Proof points */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Key results <span className="text-gray-600 font-normal">(optional)</span></label>
          <p className="text-xs text-gray-600 mb-2">Wins, stats, or testimonials you can reference in content.</p>
          <textarea
            placeholder="e.g. Helped 20+ service businesses grow their Instagram from 0 to 5K followers. Average client sees 3x more enquiries in 60 days. 4.9★ from 40+ reviews."
            value={data.proofPoints}
            onChange={(e) => updateField("proofPoints", e.target.value)}
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none text-sm leading-relaxed"
          />
        </div>

        {/* Content pillars */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Content pillars <span className="text-gray-600 font-normal">(pick 2–5, optional)</span>
            {data.contentPillars.length > 0 && (
              <span className="text-teal-400 ml-2">{data.contentPillars.length}/5</span>
            )}
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PILLAR_SUGGESTIONS.map((pillar) => (
              <button
                key={pillar}
                type="button"
                onClick={() => togglePillar(pillar)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  data.contentPillars.includes(pillar)
                    ? "bg-teal-400 text-black"
                    : "bg-white/[0.04] border border-white/10 text-gray-500 hover:border-teal-400/50 hover:text-gray-300"
                }`}
              >
                {pillar}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom pillar"
              value={pillarInput}
              onChange={(e) => setPillarInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomPillar()}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
            />
            <button
              type="button"
              onClick={addCustomPillar}
              className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-gray-400 hover:text-white transition-all text-sm"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/onboarding/step-4")}
            className="w-1/3 py-5 rounded-xl font-semibold bg-white/[0.06] text-gray-400 border border-white/10 hover:border-white/20 transition-all"
          >
            ← Back
          </button>
          <button
            disabled={!isValid}
            onClick={() => router.push("/onboarding/step-6")}
            className="w-2/3 py-5 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all"
          >
            Next →
          </button>
        </div>
      </div>
    </FormStepLayout>
  )
}
