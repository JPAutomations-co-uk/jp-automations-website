"use client"

import { useRouter } from "next/navigation"
import { useOnboarding } from "@/app/components/OnboardingFormContext"
import FormStepLayout from "@/app/components/FormStepLayout"

const TONES = [
  { value: "Direct", desc: "Sharp, no fluff" },
  { value: "Casual", desc: "Friendly, relatable" },
  { value: "Bold", desc: "Provocative takes" },
  { value: "Witty", desc: "Clever, punchy" },
  { value: "Educational", desc: "Clear, authoritative" },
  { value: "Inspirational", desc: "Motivational" },
  { value: "Story", desc: "Narrative, personal" },
  { value: "Professional", desc: "Polished, credible" },
]

export default function OnboardingStep4() {
  const router = useRouter()
  const { data, updateField } = useOnboarding()

  const isValid = data.tone.length > 0

  return (
    <FormStepLayout
      title="Your voice"
      subtitle="How should your content sound? Pick the tone that feels most like you — you can always change it later."
      step={4}
      totalSteps={5}
    >
      <div className="space-y-6 max-w-md mx-auto text-left">
        <div>
          <label className="block text-sm text-gray-400 mb-3">Tone of voice</label>
          <div className="grid grid-cols-2 gap-2.5">
            {TONES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => updateField("tone", t.value)}
                className={`flex flex-col text-left px-4 py-3.5 rounded-xl border transition-all ${
                  data.tone === t.value
                    ? "border-teal-400 bg-teal-400/10"
                    : "border-white/10 bg-black/40 hover:border-teal-400/50"
                }`}
              >
                <span className={`text-sm font-semibold ${data.tone === t.value ? "text-teal-400" : "text-white"}`}>
                  {t.value}
                </span>
                <span className="text-xs text-gray-600 mt-0.5">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Voice sample <span className="text-gray-600 font-normal">(optional but powerful)</span>
          </label>
          <p className="text-xs text-gray-600 mb-2">Paste a few sentences you&apos;ve written — captions, emails, anything. We&apos;ll match your exact style.</p>
          <textarea
            placeholder="e.g. Most businesses overthink content. They spend hours crafting the perfect post when they should just be talking to their audience like a human. Here's what I tell every client..."
            value={data.voiceSample}
            onChange={(e) => updateField("voiceSample", e.target.value)}
            rows={4}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none text-sm leading-relaxed"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/onboarding/step-3")}
            className="w-1/3 py-5 rounded-xl font-semibold bg-white/[0.06] text-gray-400 border border-white/10 hover:border-white/20 transition-all"
          >
            ← Back
          </button>
          <button
            disabled={!isValid}
            onClick={() => router.push("/onboarding/step-5")}
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
