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

const VOICE_TRAITS = [
  { value: "Contrarian", desc: "Challenges mainstream thinking" },
  { value: "Data-backed", desc: "Uses numbers & research" },
  { value: "Authentic / vulnerable", desc: "Honest about failures" },
  { value: "Blunt / no-sugarcoating", desc: "Says it straight" },
  { value: "Humorous", desc: "Wit and lightness" },
  { value: "Energetic", desc: "High intensity, punchy" },
  { value: "Calm / measured", desc: "Steady and authoritative" },
  { value: "Storytelling-first", desc: "Leads with narrative" },
  { value: "Teaching-focused", desc: "Educates step by step" },
  { value: "Opinionated", desc: "Takes strong positions" },
  { value: "Understated", desc: "Let results do the talking" },
  { value: "Conversational", desc: "Like talking to a friend" },
  { value: "Subtle wit / dry humour", desc: "Dry asides, unexpected turns — used sparingly" },
]

const RHYTHMS = [
  {
    value: "Short & punchy",
    label: "Short & punchy",
    desc: "Short sentences. Fragments. One idea per line. Impact over elegance.",
    example: "Most founders get this wrong.\n\nThey post every day.\nThey optimise for likes.\nNothing converts.",
  },
  {
    value: "Long & flowing",
    label: "Long & flowing",
    desc: "Longer sentences with natural flow. Ideas build on each other.",
    example: "After three years of building businesses the hard way, I finally understood that the real bottleneck was never strategy — it was the systems holding everything together.",
  },
  {
    value: "Mixed",
    label: "Mixed",
    desc: "Short punchy lines for hooks and emphasis, longer for stories and context.",
    example: "Here's what nobody tells you about scaling a service business.\n\nThe work expands to fill the owner's time — not because the owner is inefficient, but because the systems don't exist yet to hold it.",
  },
]

export default function OnboardingStep4() {
  const router = useRouter()
  const { data, updateField } = useOnboarding()

  const toggleTrait = (trait: string) => {
    const current = data.voiceTraits ?? []
    updateField(
      "voiceTraits",
      current.includes(trait) ? current.filter((t) => t !== trait) : [...current, trait]
    )
  }

  const isValid = data.tone.length > 0

  return (
    <FormStepLayout
      title="Your voice"
      subtitle="Help us write content that sounds exactly like you. The more we know about how you write, the better the output."
      step={4}
      totalSteps={6}
    >
      <div className="space-y-8 max-w-md mx-auto text-left">

        {/* Tone */}
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

        {/* Voice traits */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Voice characteristics</label>
          <p className="text-xs text-gray-600 mb-3">Pick everything that sounds like you — the AI uses these to nail your personality.</p>
          <div className="flex flex-wrap gap-2">
            {VOICE_TRAITS.map((t) => {
              const selected = (data.voiceTraits ?? []).includes(t.value)
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleTrait(t.value)}
                  title={t.desc}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selected
                      ? "border-teal-400 bg-teal-400/10 text-teal-400"
                      : "border-white/10 bg-black/40 text-gray-400 hover:border-teal-400/40 hover:text-gray-200"
                  }`}
                >
                  {t.value}
                </button>
              )
            })}
          </div>
          {(data.voiceTraits ?? []).length > 0 && (
            <p className="text-xs text-teal-400/60 mt-2">{(data.voiceTraits ?? []).length} selected</p>
          )}
        </div>

        {/* Writing rhythm */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Writing rhythm</label>
          <p className="text-xs text-gray-600 mb-3">How do your sentences flow?</p>
          <div className="space-y-2">
            {RHYTHMS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => updateField("writingRhythm", r.value)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                  data.writingRhythm === r.value
                    ? "border-teal-400 bg-teal-400/10"
                    : "border-white/10 bg-black/40 hover:border-teal-400/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-semibold ${data.writingRhythm === r.value ? "text-teal-400" : "text-white"}`}>
                    {r.label}
                  </span>
                  <span className="text-xs text-gray-600">{r.desc}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{r.example}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Copy examples */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Your writing examples{" "}
            <span className="text-teal-400 font-normal text-xs">(most important)</span>
          </label>
          <p className="text-xs text-gray-600 mb-3">
            Paste real things you&apos;ve written — posts, emails, captions, messages. We&apos;ll analyse your exact style and replicate it. The more examples, the better.
          </p>
          <div className="space-y-3">
            <textarea
              placeholder="Example 1 — your most natural writing..."
              value={data.voiceSample}
              onChange={(e) => updateField("voiceSample", e.target.value)}
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none text-sm leading-relaxed"
            />
            <textarea
              placeholder="Example 2 — another piece (optional but powerful)..."
              value={data.copyExample2}
              onChange={(e) => updateField("copyExample2", e.target.value)}
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none text-sm leading-relaxed"
            />
            <textarea
              placeholder="Example 3 — optional..."
              value={data.copyExample3}
              onChange={(e) => updateField("copyExample3", e.target.value)}
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Banned words */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Words & phrases to avoid</label>
          <p className="text-xs text-gray-600 mb-2">Anything that doesn&apos;t sound like you — buzzwords, clichés, phrases you hate.</p>
          <input
            type="text"
            placeholder="e.g. synergy, hustle, game-changer, 10x, just, very..."
            value={data.bannedWords}
            onChange={(e) => updateField("bannedWords", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-sm"
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
