"use client"

import { useRouter } from "next/navigation"
import { useOnboarding } from "@/app/components/OnboardingFormContext"
import FormStepLayout from "@/app/components/FormStepLayout"

export default function OnboardingStep3() {
  const router = useRouter()
  const { data, updateField } = useOnboarding()

  const isValid =
    data.offers.trim().length > 0 &&
    data.usp.trim().length > 0

  return (
    <FormStepLayout
      title="Your offers"
      subtitle="What you sell and what makes you the obvious choice. This goes into every prompt we send."
      step={3}
      totalSteps={5}
    >
      <div className="space-y-6 max-w-md mx-auto text-left">
        <div>
          <label className="block text-sm text-gray-400 mb-1">What do you offer?</label>
          <p className="text-xs text-gray-600 mb-2">Your main service or product, who it&apos;s for, and what they get.</p>
          <textarea
            placeholder="e.g. I run a social media content service for service businesses. £997/month. Clients get a full month of content — captions, reels scripts, and carousels — planned and written for them each week."
            value={data.offers}
            onChange={(e) => updateField("offers", e.target.value)}
            rows={5}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none text-sm leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">What makes you different?</label>
          <p className="text-xs text-gray-600 mb-2">Your USP — why someone should choose you over anyone else.</p>
          <textarea
            placeholder="e.g. Unlike generic agencies, I specialise only in service businesses and use AI to cut production time — so clients get premium content at a third of the cost."
            value={data.usp}
            onChange={(e) => updateField("usp", e.target.value)}
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none text-sm leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">What should people do? <span className="text-gray-600 font-normal">(optional)</span></label>
          <input
            type="text"
            placeholder="e.g. Book a free call, DM me 'content', Visit my website"
            value={data.primaryCta}
            onChange={(e) => updateField("primaryCta", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-sm"
          />
          <p className="text-xs text-gray-600 mt-1.5">This becomes the default CTA across your generated content.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/onboarding/step-2")}
            className="w-1/3 py-5 rounded-xl font-semibold bg-white/[0.06] text-gray-400 border border-white/10 hover:border-white/20 transition-all"
          >
            ← Back
          </button>
          <button
            disabled={!isValid}
            onClick={() => router.push("/onboarding/step-4")}
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
