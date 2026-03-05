"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useOnboarding } from "@/app/components/OnboardingFormContext"

const WHAT_WE_COLLECT = [
  { icon: "🏢", label: "Your business & location" },
  { icon: "🎯", label: "Who you serve & what they need" },
  { icon: "💼", label: "Your offers & what makes you different" },
  { icon: "🎙️", label: "Your tone of voice" },
  { icon: "📊", label: "Your results & social handles" },
]

function OnboardingWelcomeInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updateFields } = useOnboarding()

  // Capture Stripe session ID from checkout redirect
  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (sessionId) {
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((session) => {
          if (session.customerId) {
            updateFields({
              stripeCustomerId: session.customerId,
              tier: session.tier || "",
              billingCycle: session.billingCycle || "",
              email: session.email || "",
            })
          }
        })
        .catch(console.error)
    }
  }, [searchParams, updateFields])

  return (
    <main className="relative min-h-screen bg-[#0B0F14] flex items-center justify-center px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.06),transparent_70%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />

      <section className="relative z-10 w-full max-w-2xl text-center">
        {/* Logo mark */}
        <div className="w-16 h-16 rounded-2xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-8">
          <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Let&apos;s set up your profile
        </h1>
        <p className="text-gray-400 text-lg mb-3">
          Takes about 3 minutes. Every answer makes your AI content sharper.
        </p>
        <p className="text-gray-600 text-sm mb-10">
          The more context we have, the more your content sounds like <span className="text-gray-400">you</span> — not a generic AI.
        </p>

        {/* What we collect */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-8 text-left">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">What we&apos;ll set up</p>
          <div className="space-y-3">
            {WHAT_WE_COLLECT.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-gray-300">{item.label}</span>
                <svg className="w-3.5 h-3.5 text-teal-400 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push("/onboarding/step-1")}
          className="w-full py-5 rounded-xl font-semibold text-black bg-teal-400 hover:bg-teal-300 transition-all hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:scale-[1.02] text-lg"
        >
          Set up my profile →
        </button>

        <p className="text-xs text-gray-600 mt-4">You can update any of this later in Settings.</p>
      </section>
    </main>
  )
}

export default function OnboardingWelcome() {
  return (
    <Suspense>
      <OnboardingWelcomeInner />
    </Suspense>
  )
}
