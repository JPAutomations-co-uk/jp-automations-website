"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"

type ContentType = "single_image" | "carousel"

interface GeneratedImage {
  imageUrl: string
  index?: number
}

const ASPECT_RATIOS = [
  { value: "1:1", label: "1:1", desc: "Square" },
  { value: "4:5", label: "4:5", desc: "Portrait" },
  { value: "9:16", label: "9:16", desc: "Story/Reel" },
  { value: "16:9", label: "16:9", desc: "Landscape" },
]

const TOKEN_COSTS: Record<ContentType, number> = {
  single_image: 5,
  carousel: 10,
}

export default function InstagramAppPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  const [contentType, setContentType] = useState<ContentType>("single_image")
  const [prompt, setPrompt] = useState("")
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    if (!user) {
      router.push(`/login?redirect=/dashboard/instagram`)
      return
    }

    const cost = TOKEN_COSTS[contentType]
    if (tokenBalance < cost) {
      setError(`Insufficient tokens. You need ${cost} tokens but have ${tokenBalance}.`)
      return
    }

    setGenerating(true)
    setError("")
    setImages([])

    try {
      if (contentType === "single_image") {
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

        setImages([{ imageUrl: data.imageUrl }])
        refreshBalance()
      } else {
        const res = await fetch("/api/generate/carousel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: prompt.trim() }),
        })
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Generation failed")
          return
        }

        const successful = data.slides
          .filter((s: { status: string; imageUrl: string | null }) => s.status === "success" && s.imageUrl)
          .map((s: { imageUrl: string; index: number }) => ({
            imageUrl: s.imageUrl,
            index: s.index,
          }))

        setImages(successful)
        refreshBalance()

        if (data.successCount < data.totalSlides) {
          setError(`${data.successCount}/${data.totalSlides} slides generated successfully. Some failed.`)
        }
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setGenerating(false)
    }
  }, [prompt, contentType, aspectRatio, user, tokenBalance, refreshBalance, router])

  const handleDownload = async (url: string, filename: string) => {
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
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 border-b border-white/5 bg-black/20 backdrop-blur-sm">
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
              <a href="/login?redirect=/dashboard/instagram" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all hover:scale-105">
                Sign In
              </a>
            )}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-50 p-2 text-white focus:outline-none"
          >
            <div className="w-8 h-6 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <a href="/" className="text-4xl font-bold text-gray-300 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <AppsMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
          {user ? (
            <>
              <div className="flex items-center gap-2 mt-4">
                <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                </svg>
                <span className="text-lg font-semibold text-teal-400">{tokenBalance} tokens</span>
              </div>
              <a href="/dashboard/settings" className="text-lg text-gray-500 hover:text-teal-400 transition-colors mt-2" onClick={() => setIsMobileMenuOpen(false)}>Settings</a>
            </>
          ) : (
            <a href="/login?redirect=/dashboard/instagram" className="text-4xl font-bold text-teal-400 hover:text-teal-300 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign In</a>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Back Link */}
          <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors mb-8 group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Apps
          </a>

          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">Instagram Content Engine</span>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6 max-w-2xl">
              <span className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">
                Generate
              </span>
              <a href="/dashboard/instagram/planner" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Plan
              </a>
              <a href="/dashboard/instagram/captions" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Captions
              </a>
              <a href="/dashboard/instagram/ads" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Ads
              </a>
              <a href="/dashboard/instagram/reels" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">
                Reels
              </a>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Generate Content</h1>
            <p className="text-gray-500">Create scroll-stopping images and carousels with AI.</p>
          </div>

          <div className="grid lg:grid-cols-[400px_1fr] gap-8">

            {/* Left Panel — Controls */}
            <div className="space-y-6">

              {/* Content Type */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">Content Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setContentType("single_image")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      contentType === "single_image"
                        ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                        : "border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                    <span className="text-sm font-semibold">Single Image</span>
                    <span className="text-xs opacity-60">{TOKEN_COSTS.single_image} tokens</span>
                  </button>
                  <button
                    onClick={() => setContentType("carousel")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      contentType === "carousel"
                        ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                        : "border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                    </svg>
                    <span className="text-sm font-semibold">Carousel</span>
                    <span className="text-xs opacity-60">{TOKEN_COSTS.carousel} tokens</span>
                  </button>
                </div>
              </div>

              {/* Prompt */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  {contentType === "single_image" ? "Image Prompt" : "Carousel Topic"}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none"
                  placeholder={
                    contentType === "single_image"
                      ? "A modern minimalist house with floor-to-ceiling windows, surrounded by a zen garden, golden hour lighting..."
                      : "Modern kitchen renovation ideas for 2025..."
                  }
                />
                <p className="text-xs text-gray-600 mt-2">
                  {contentType === "single_image"
                    ? "Describe the image you want. Be specific about style, lighting, and composition."
                    : "Enter a topic and we'll generate 7 carousel slides with varied angles."}
                </p>
              </div>

              {/* Aspect Ratio (single image only) */}
              {contentType === "single_image" && (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">Aspect Ratio</label>
                  <div className="grid grid-cols-4 gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio.value}
                        onClick={() => setAspectRatio(ratio.value)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                          aspectRatio === ratio.value
                            ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                            : "border-white/[0.08] text-gray-500 hover:border-white/20"
                        }`}
                      >
                        <span className="text-sm font-semibold">{ratio.label}</span>
                        <span className="text-[10px] opacity-60">{ratio.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate Button */}
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
                    {contentType === "carousel" ? "Generating 7 slides..." : "Generating..."}
                  </>
                ) : (
                  <>
                    Generate {contentType === "single_image" ? "Image" : "Carousel"}
                    <span className="text-black/60 text-sm">({TOKEN_COSTS[contentType]} tokens)</span>
                  </>
                )}
              </button>

              {/* Error */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Right Panel — Results */}
            <div className="min-h-[400px]">
              {images.length === 0 && !generating ? (
                <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
                  <div className="text-center px-8 py-16">
                    <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium mb-1">No content yet</p>
                    <p className="text-gray-600 text-sm">Enter a prompt and hit generate to create content.</p>
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
                    <p className="text-gray-500 text-sm">
                      {contentType === "carousel"
                        ? "Creating 7 carousel slides... This may take 30-60 seconds."
                        : "Creating your image... This may take 10-20 seconds."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Results Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                      {contentType === "carousel" ? `Carousel — ${images.length} slides` : "Generated Image"}
                    </h2>
                    {images.length > 1 && (
                      <button
                        onClick={() => {
                          images.forEach((img, i) => {
                            setTimeout(() => handleDownload(img.imageUrl, `slide-${i + 1}.webp`), i * 500)
                          })
                        }}
                        className="text-sm text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download All
                      </button>
                    )}
                  </div>

                  {/* Image Grid */}
                  <div className={`grid gap-4 ${
                    contentType === "carousel"
                      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      : "grid-cols-1 max-w-lg"
                  }`}>
                    {images.map((img, i) => (
                      <div key={i} className="group relative rounded-xl overflow-hidden border border-white/[0.08] bg-black/40">
                        <img
                          src={img.imageUrl}
                          alt={`Generated ${contentType === "carousel" ? `slide ${i + 1}` : "image"}`}
                          className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImage(img.imageUrl)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                          {contentType === "carousel" && (
                            <span className="text-xs text-white/80 font-medium">Slide {i + 1}</span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(img.imageUrl, `${contentType === "carousel" ? `slide-${i + 1}` : "image"}.webp`)
                            }}
                            className="ml-auto p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
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
            onClick={(e) => {
              e.stopPropagation()
              handleDownload(selectedImage, "image.webp")
            }}
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
