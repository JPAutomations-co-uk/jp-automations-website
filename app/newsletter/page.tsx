'use client'

import { useState } from 'react'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'x' }),
      })

      if (!res.ok) throw new Error()
      setStatus('success')

      if (typeof window !== 'undefined') {
        window.gtag?.('event', 'newsletter_subscribe')
        window.fbq?.('track', 'Lead')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="relative min-h-screen bg-[#0B0F14] flex items-center justify-center overflow-hidden px-6 py-24">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.06),transparent_70%)]" />

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 w-full max-w-xl text-center">

        {/* Eyebrow */}
        <p className="text-teal-400 text-xs tracking-[0.3em] uppercase mb-6 font-medium">
          Free Weekly Newsletter — JP Automations
        </p>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-5">
          The AI<br />
          <span className="text-teal-400">Edge</span>
        </h1>

        {/* Subheadline */}
        <p className="text-gray-400 text-[17px] leading-[1.7] mb-10 max-w-md mx-auto">
          Every week I break down one AI automation system you can plug straight into your service business — save time, cut costs, and grow without adding headcount.
        </p>

        {/* What you get */}
        <div className="text-left bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-5 mb-10 space-y-3">
          <p className="text-white text-sm font-semibold mb-1">Every issue includes:</p>
          {[
            'One system you can implement that week — step by step',
            'The exact tools, prompts, and workflows behind it',
            'Real results from service businesses already using it',
            'No fluff, no theory — just what works',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="text-teal-400 mt-0.5 shrink-0">&#10003;</span>
              <span className="text-gray-300 text-sm">{item}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        {status === 'success' ? (
          <div className="bg-teal-400/10 border border-teal-400/30 rounded-2xl px-8 py-8">
            <p className="text-teal-400 text-lg font-semibold mb-2">You&apos;re in.</p>
            <p className="text-gray-400 text-sm">
              Check your inbox — your first email is on its way to{' '}
              <span className="text-white">{email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {status === 'loading' ? 'Subscribing...' : 'Subscribe for Free →'}
            </button>
            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">
                Something went wrong — try again or email jp@jpautomations.co.uk
              </p>
            )}
            <p className="text-gray-600 text-xs text-center pt-1">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </main>
  )
}
