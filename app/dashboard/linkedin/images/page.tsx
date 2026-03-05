"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

const ASPECT_RATIOS = [
  { value: "1:1", label: "1:1", desc: "Square" },
  { value: "4:5", label: "4:5", desc: "Portrait" },
  { value: "16:9", label: "16:9", desc: "Landscape" },
]

const TOKEN_COST = 5

export default function LinkedInImagesPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  const [prompt, setPrompt] = useState("")
  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    if (!user) {
      router.push("/login?redirect=/dashboard/linkedin/images")
      return
    }

    if (tokenBalance < TOKEN_COST) {
      setError(`Insufficient tokens. You need ${TOKEN_COST} tokens but have ${tokenBalance}.`)
      return
    }

    setGenerating(true)
    setError("")
    setImageUrl(null)

    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), aspectRatio }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Generation failed")
        return
      }

      setImageUrl(data.imageUrl)
      refreshBalance()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setGenerating(false)
    }
  }, [prompt, aspectRatio, user, tokenBalance, refreshBalance, router])

  const handleDownload = async (url: string, filename = "linkedin-image.webp") => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch {
      window.open(url, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="relative z-50">
            <img src="/logo.png" alt="JP Automations" className="h-16 md:h-20 w-auto hover:opacity-80 transition-opacity" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Home</a>
            <a href="/blog" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Blog</a>
            <AppsDropdown />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-lg">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                  </svg>
                  <span className="text-sm font-semibold text-teal-400">{tokenBalance}</span>
                  <span className="text-xs text-gray-500">tokens</span>
                </div>
                <UserMenu />
              </>
            ) : (
              <a href="/login?redirect=/dashboard/linkedin/images" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all hover:scale-105">Sign In</a>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden relative z-50 p-2 text-white focus:outline-none">
            <div className="w-8 h-6 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <a href="/" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <AppsMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          <a href="/dashboard/linkedin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors mb-8 group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Write
          </a>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">LinkedIn Content Engine</span>
            </div>

            <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6 max-w-sm">
              <a href="/dashboard/linkedin" className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Write</a>
              <a href="/dashboard/linkedin/planner" className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Plan</a>
              <span className="flex-1 py-2.5 px-3 text-sm font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">Images</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Image Creator</h1>
            <p className="text-gray-500">Generate AI images for your LinkedIn posts — professional, brand-aligned, and ready to post.</p>
          </div>

          <div className="grid lg:grid-cols-[400px_1fr] gap-8">

            {/* Controls */}
            <div className="space-y-6">

              {/* Prompt */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">Image Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none"
                  placeholder="A professional workspace with a laptop, coffee, and a city skyline view — clean, modern, daylight..."
                />
                <p className="text-xs text-gray-600 mt-2">Describe the image. Be specific about style, lighting, and subject.</p>
              </div>

              {/* Aspect Ratio */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-3">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                        aspectRatio === ratio.value
                          ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                          : "border-white/[0.08] text-gray-500 hover:border-white/20"
                      }`}
                    >
                      <span className="text-sm font-bold">{ratio.label}</span>
                      <span className="text-[10px] opacity-60">{ratio.desc}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-3">16:9 (landscape) is the standard LinkedIn post image size.</p>
              </div>

              {/* Generate */}
              <button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                className="w-full py-4 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3"
              >
                {generating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Image
                    <span className="text-black/60 text-sm">({TOKEN_COST} tokens)</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
              )}
            </div>

            {/* Result */}
            <div className="min-h-[400px]">
              {!imageUrl && !generating ? (
                <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
                  <div className="text-center px-8 py-16">
                    <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium mb-1">No image yet</p>
                    <p className="text-gray-600 text-sm">Enter a prompt and hit generate.</p>
                  </div>
                </div>
              ) : generating ? (
                <div className="h-full flex items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <div className="text-center px-8 py-16">
                    <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                    <p className="text-white font-medium mb-1">Generating with Flux Pro</p>
                    <p className="text-gray-500 text-sm">Creating your LinkedIn image... 10–20 seconds.</p>
                  </div>
                </div>
              ) : imageUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Generated Image</h2>
                    <button
                      onClick={() => handleDownload(imageUrl)}
                      className="flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Download
                    </button>
                  </div>

                  <div className="group relative rounded-xl overflow-hidden border border-white/[0.08] bg-black/40">
                    <img
                      src={imageUrl}
                      alt="Generated LinkedIn image"
                      className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(imageUrl)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(imageUrl) }}
                        className="p-2.5 rounded-xl bg-teal-400 text-black font-semibold hover:bg-teal-300 transition-colors flex items-center gap-1.5 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => { setImageUrl(null); setError("") }}
                    className="text-sm text-gray-500 hover:text-teal-400 transition-colors"
                  >
                    Generate another →
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Full size preview"
            className="max-w-full max-h-full rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); handleDownload(selectedImage) }}
            className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-400 text-black font-semibold hover:bg-teal-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download
          </button>
        </div>
      )}
    </div>
  )
}
