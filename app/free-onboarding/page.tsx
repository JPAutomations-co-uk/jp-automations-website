'use client'

import { useState } from 'react'

export default function FreeOnboardingPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/lead-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })

      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="relative min-h-screen bg-[#0B0F14] flex items-center justify-center overflow-hidden px-6 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.06),transparent_70%)]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 w-full max-w-xl text-center">

        <p className="text-teal-400 text-xs tracking-[0.3em] uppercase mb-6 font-medium">
          Free Resource — JP Automations
        </p>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-5">
          The 10-Minute<br />
          <span className="text-teal-400">Onboarding System</span>
        </h1>

        <p className="text-gray-400 text-[17px] leading-[1.7] mb-4 max-w-md mx-auto">
          The exact step-by-step system to onboard every new client in under 10 minutes — no back-and-forth emails, no chasing documents, no manual follow-up.
        </p>

        <p className="text-gray-500 text-sm mb-10 max-w-sm mx-auto">
          Setup takes 2–3 hours once. Every client after that takes under 10 minutes.
        </p>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-5 mb-10 text-left">
          <p className="text-white text-sm font-semibold mb-3">What&apos;s inside:</p>
          <div className="space-y-3">
            {[
              'The exact tools to use — all free to start',
              'Step-by-step setup instructions any beginner can follow',
              'The intake form questions every service business needs',
              'Copy-paste email prompts for your welcome sequence',
              'How to connect everything so it runs automatically',
              'A Notion client portal template to look professional from day one',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-teal-400 mt-0.5 shrink-0">✓</span>
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {status === 'success' ? (
          <div className="bg-teal-400/10 border border-teal-400/30 rounded-2xl px-8 py-8">
            <p className="text-teal-400 text-lg font-semibold mb-2">It&apos;s on its way.</p>
            <p className="text-gray-400 text-sm">
              Check your inbox — the guide is heading to <span className="text-white">{email}</span> now.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-5 py-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-teal-400/50 transition"
            />
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-5 py-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-teal-400/50 transition"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {status === 'loading' ? 'Sending...' : 'Send Me the System →'}
            </button>
            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">Something went wrong — try again or email jp@jpautomations.co.uk</p>
            )}
            <p className="text-gray-600 text-xs text-center pt-1">No spam. Unsubscribe anytime.</p>
          </form>
        )}
      </div>
    </main>
  )
}
