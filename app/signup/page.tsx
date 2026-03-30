"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"

function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [staySignedIn, setStaySignedIn] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"
  const safeRedirectPath = redirect.startsWith("/") ? redirect : "/dashboard"

  const supabase = createClient()

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "")
  const emailRedirectBase = configuredSiteUrl || window.location.origin
  // New signups always go to onboarding first — auth callback will check if it's already done
  const emailRedirectTo = `${emailRedirectBase}/auth/callback?next=${encodeURIComponent("/onboarding")}`

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setNotice("")
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (!staySignedIn) {
      router.push(`/login${safeRedirectPath !== "/dashboard" ? `?redirect=${encodeURIComponent(safeRedirectPath)}` : ""}`)
      return
    }

    if (data.session) {
      // New signup — go straight to onboarding
      router.push("/onboarding")
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!signInError) {
      // New signup — go straight to onboarding
      router.push("/onboarding")
      return
    }

    if (/confirm/i.test(signInError.message)) {
      setNotice(
        "Account created. Email confirmation is required before first login. Check your inbox to continue."
      )
      setLoading(false)
      return
    }

    setError(signInError.message)
    setLoading(false)
  }

  return (
    <main className="bg-black min-h-screen text-white flex items-center justify-center px-6 font-sans relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)" }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-teal-900/20 via-black/50 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/">
            <img src="/logo.png" alt="JP Automations" className="h-16 w-auto mx-auto mb-6 hover:opacity-80 transition-opacity" />
          </a>
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-500 text-sm">Get started with AI-powered content</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
          {notice && (
            <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
              {notice}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all"
                placeholder="Min. 6 characters"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={staySignedIn}
                onChange={(e) => setStaySignedIn(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-teal-400 focus:ring-teal-400/50"
              />
              Stay signed in on this device
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <a href={`/login${safeRedirectPath !== "/dashboard" ? `?redirect=${encodeURIComponent(safeRedirectPath)}` : ""}`} className="text-teal-400 hover:text-teal-300 transition-colors">
            Sign in
          </a>
        </p>
      </div>
    </main>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
