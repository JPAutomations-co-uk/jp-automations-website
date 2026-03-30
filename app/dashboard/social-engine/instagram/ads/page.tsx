"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import { createClient } from "@/app/lib/supabase/client"
import {
  CAROUSEL_TEMPLATES,
  SINGLE_TEMPLATES,
  TEMPLATE_INFO,
  type BrandVars,
  type SlideData,
  type SingleCopyData,
  type CarouselTemplate,
  type SingleTemplate,
  type TemplateName,
} from "@/app/lib/ad-templates"
import { renderAdToImage, downloadBlob, downloadAllSlides } from "@/app/lib/ad-renderer"

type AdType = "carousel" | "single"
type Dimensions = "1080x1080" | "1080x1350" | "1080x1920"
type Platform = "instagram" | "facebook" | "linkedin"
type PageTab = "generate" | "history"

interface GenerationResult {
  copy: {
    type: AdType
    template: string
    slides?: SlideData[]
    headline?: string
    subheadline?: string
    body?: string
    cta?: string
    primary_text?: string
    hashtags?: string
  }
  brand: BrandVars
  dimensions: { width: number; height: number }
  htmlStrings: string[]
}

interface HistoryAsset {
  id: string
  created_at: string
  prompt: string
  meta: {
    ad_creative: boolean
    copy: GenerationResult["copy"]
    brand: BrandVars
    dimensions: string
  }
}

const TOKEN_COSTS: Record<AdType, number> = {
  carousel: 15,
  single: 8,
}

const DIMENSIONS_OPTIONS: { value: Dimensions; label: string; desc: string }[] = [
  { value: "1080x1080", label: "1:1", desc: "Square" },
  { value: "1080x1350", label: "4:5", desc: "Portrait" },
  { value: "1080x1920", label: "9:16", desc: "Story" },
]

const TESTIMONIAL_TEMPLATES = ["testimonial", "social_proof"]

function buildHtmlStrings(
  copy: GenerationResult["copy"],
  brand: BrandVars,
  width: number,
  height: number
): string[] {
  if (copy.type === "carousel" && copy.slides) {
    const templateFn = CAROUSEL_TEMPLATES[copy.template as CarouselTemplate]
    if (!templateFn) return []
    return copy.slides.map((slide, i) =>
      templateFn(brand, slide, i + 1, copy.slides!.length, width, height)
    )
  } else {
    const templateFn = SINGLE_TEMPLATES[copy.template as SingleTemplate]
    if (!templateFn) return []
    const singleCopy: SingleCopyData = {
      headline: copy.headline || "",
      subheadline: copy.subheadline || "",
      body: copy.body || "",
      cta: copy.cta || "Learn More",
    }
    return [templateFn(brand, singleCopy, width, height)]
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function AdCreativesPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  // Form state
  const [adType, setAdType] = useState<AdType>("carousel")
  const [template, setTemplate] = useState<TemplateName>("hook_problem_cta")
  const [topic, setTopic] = useState("")
  const [dimensions, setDimensions] = useState<Dimensions>("1080x1080")

  // Phase A: Brief fields
  const [offer, setOffer] = useState("")
  const [painPoint, setPainPoint] = useState("")
  const [ctaText, setCtaText] = useState("Book a Free Call")
  const [platform, setPlatform] = useState<Platform>("instagram")
  const [testimonialQuote, setTestimonialQuote] = useState("")

  // Generation state
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [selectedSlide, setSelectedSlide] = useState<number | null>(null)
  const [downloading, setDownloading] = useState(false)

  // Phase B: Editable copy
  const [editedSlides, setEditedSlides] = useState<SlideData[]>([])
  const [editedSingle, setEditedSingle] = useState<SingleCopyData | null>(null)
  const [editingSlide, setEditingSlide] = useState(0)

  // Phase C: Per-slide regen
  const [slideRegenLoading, setSlideRegenLoading] = useState<Record<number, boolean>>({})

  // Phase D: History
  const [pageTab, setPageTab] = useState<PageTab>("generate")
  const [history, setHistory] = useState<HistoryAsset[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const previewRefs = useRef<(HTMLIFrameElement | null)[]>([])

  useEffect(() => {
    if (adType === "carousel") {
      setTemplate("hook_problem_cta")
    } else {
      setTemplate("hero_offer")
    }
  }, [adType])

  // Phase D: Load history when tab opens
  useEffect(() => {
    if (pageTab !== "history" || !user || history.length > 0) return
    setHistoryLoading(true)
    const supabase = createClient()
    supabase
      .from("generated_assets")
      .select("id, created_at, prompt, meta")
      .contains("meta", { ad_creative: true })
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setHistory((data as HistoryAsset[]) || [])
        setHistoryLoading(false)
      })
      .catch(() => setHistoryLoading(false))
  }, [pageTab, user, history.length])

  const filteredTemplates = Object.entries(TEMPLATE_INFO).filter(
    ([, info]) => info.type === adType
  )

  // Group single templates by category for the picker UI
  const groupedSingleTemplates = filteredTemplates.reduce<Record<string, [string, typeof TEMPLATE_INFO[TemplateName]][]>>(
    (acc, [key, info]) => {
      const cat = (info as { category?: string }).category || "Other"
      if (!acc[cat]) acc[cat] = []
      acc[cat].push([key, info])
      return acc
    },
    {}
  )
  const CATEGORY_ORDER = ["Classic", "Text & Brand", "Brand Forward", "Conversion", "Photo + Text", "Social Proof"]

  const showTestimonialField = TESTIMONIAL_TEMPLATES.includes(template)

  // Phase D: Load a past creative from history
  function loadFromHistory(asset: HistoryAsset) {
    const { copy, brand, dimensions: dimStr } = asset.meta
    const [width, height] = dimStr.split("x").map(Number)
    const htmlStrings = buildHtmlStrings(copy, brand, width, height)
    setResult({ copy, brand, dimensions: { width, height }, htmlStrings })
    if (copy.slides) {
      setEditedSlides(copy.slides)
      setEditedSingle(null)
    } else {
      setEditedSingle({
        headline: copy.headline || "",
        subheadline: copy.subheadline || "",
        body: copy.body || "",
        cta: copy.cta || "Learn More",
      })
      setEditedSlides([])
    }
    setEditingSlide(0)
    setPageTab("generate")
  }

  // Phase B: Rebuild one slide's HTML locally (no API call)
  function updateSlideHtml(index: number, updated: Partial<SlideData>) {
    if (!result) return
    const newSlides = [...editedSlides]
    newSlides[index] = { ...newSlides[index], ...updated }
    setEditedSlides(newSlides)
    const templateFn = CAROUSEL_TEMPLATES[result.copy.template as CarouselTemplate]
    if (!templateFn) return
    const newHtml = templateFn(
      result.brand,
      newSlides[index],
      index + 1,
      newSlides.length,
      result.dimensions.width,
      result.dimensions.height
    )
    setResult(prev => prev ? {
      ...prev,
      htmlStrings: prev.htmlStrings.map((h, i2) => i2 === index ? newHtml : h),
    } : prev)
  }

  function updateSingleHtml(updated: Partial<SingleCopyData>) {
    if (!result || !editedSingle) return
    const newSingle = { ...editedSingle, ...updated }
    setEditedSingle(newSingle)
    const templateFn = SINGLE_TEMPLATES[result.copy.template as SingleTemplate]
    if (!templateFn) return
    const newHtml = templateFn(result.brand, newSingle, result.dimensions.width, result.dimensions.height)
    setResult(prev => prev ? { ...prev, htmlStrings: [newHtml] } : prev)
  }

  // Phase C: Regenerate one slide via API (2 tokens)
  async function regenSlide(index: number) {
    if (!result) return
    setSlideRegenLoading(prev => ({ ...prev, [index]: true }))
    try {
      const res = await fetch("/api/generate/ad-creative/slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: result.copy.template,
          slide_num: index + 1,
          total_slides: result.htmlStrings.length,
          topic,
          offer,
          pain_point: painPoint,
          cta_text: ctaText,
          platform,
          brand_context: `${result.brand.businessName}, ${result.brand.industry}`,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Slide regen failed")
        return
      }
      updateSlideHtml(index, data.slide)
      refreshBalance()
    } catch {
      setError("Slide regen failed. Try again.")
    } finally {
      setSlideRegenLoading(prev => ({ ...prev, [index]: false }))
    }
  }

  // Phase A + generate handler
  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }
    if (!user) {
      router.push("/login?redirect=/dashboard/social-engine/instagram/ads")
      return
    }
    const cost = TOKEN_COSTS[adType]
    if (tokenBalance < cost) {
      setError(`Insufficient tokens. You need ${cost} but have ${tokenBalance}.`)
      return
    }

    setGenerating(true)
    setError("")
    setResult(null)
    setEditedSlides([])
    setEditedSingle(null)

    try {
      const res = await fetch("/api/generate/ad-creative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: adType,
          template,
          topic: topic.trim(),
          dimensions,
          offer,
          pain_point: painPoint,
          cta_text: ctaText,
          platform,
          testimonial_quote: testimonialQuote,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Generation failed")
        return
      }

      const [width, height] = dimensions.split("x").map(Number)
      const htmlStrings = buildHtmlStrings(data.copy, data.brand, width, height)
      setResult({ copy: data.copy, brand: data.brand, dimensions: data.dimensions, htmlStrings })

      // Seed editable copy state (Phase B)
      if (data.copy.slides) {
        setEditedSlides(data.copy.slides)
        setEditedSingle(null)
      } else {
        setEditedSingle({
          headline: data.copy.headline || "",
          subheadline: data.copy.subheadline || "",
          body: data.copy.body || "",
          cta: data.copy.cta || "Learn More",
        })
        setEditedSlides([])
      }
      setEditingSlide(0)
      refreshBalance()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setGenerating(false)
    }
  }, [topic, adType, template, dimensions, offer, painPoint, ctaText, platform, testimonialQuote, user, tokenBalance, refreshBalance, router])

  const handleDownloadSlide = useCallback(async (index: number) => {
    if (!result) return
    setDownloading(true)
    try {
      const blob = await renderAdToImage(result.htmlStrings[index], result.dimensions.width, result.dimensions.height)
      const name = result.copy.type === "carousel"
        ? `${result.copy.template}_slide_${index + 1}.png`
        : `${result.copy.template}.png`
      await downloadBlob(blob, name)
    } catch (err) {
      console.error("Download failed:", err)
      setError("Download failed. Try again.")
    } finally {
      setDownloading(false)
    }
  }, [result])

  const handleDownloadAll = useCallback(async () => {
    if (!result) return
    setDownloading(true)
    try {
      await downloadAllSlides(result.htmlStrings, result.dimensions.width, result.dimensions.height, result.copy.template)
    } catch (err) {
      console.error("Download all failed:", err)
      setError("Download failed. Try again.")
    } finally {
      setDownloading(false)
    }
  }, [result])

  return (
    <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">Instagram Content Engine</span>
            </div>

            {/* Engine Tab Navigation */}
            <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6 max-w-2xl">
              <a href="/dashboard/social-engine/instagram" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Generate</a>
              <a href="/dashboard/social-engine/instagram/captions" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Captions</a>
              <span className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">Ads</span>
              <a href="/dashboard/social-engine/instagram/reels" className="flex-1 py-2.5 px-2 text-sm font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Reels</a>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Ad Creatives</h1>
            <p className="text-gray-500 mb-6">Generate pixel-perfect carousel and single-image ads with AI backgrounds and branded copy.</p>

            {/* Phase D: Generate | History sub-tabs */}
            <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl max-w-xs">
              <button
                onClick={() => setPageTab("generate")}
                className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all ${pageTab === "generate" ? "bg-white/[0.08] text-white" : "text-gray-500 hover:text-gray-300"}`}
              >
                Generate
              </button>
              <button
                onClick={() => setPageTab("history")}
                className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all ${pageTab === "history" ? "bg-white/[0.08] text-white" : "text-gray-500 hover:text-gray-300"}`}
              >
                History
              </button>
            </div>
          </div>

          {/* ── HISTORY TAB ── */}
          {pageTab === "history" && (
            <div>
              {historyLoading ? (
                <div className="flex items-center justify-center py-24">
                  <Spinner className="w-8 h-8 text-teal-400" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-24">
                  <p className="text-gray-500 font-medium mb-1">No history yet</p>
                  <p className="text-gray-600 text-sm">Generate your first ad creative to see it here.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((asset) => {
                    const info = TEMPLATE_INFO[asset.meta.copy?.template as TemplateName]
                    return (
                      <div key={asset.id} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-3">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 mb-2">
                            <span className="text-xs font-semibold text-teal-400 capitalize">{asset.meta.copy?.type}</span>
                          </div>
                          <p className="text-sm font-semibold text-white leading-snug">{info?.label || asset.meta.copy?.template}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{info?.description}</p>
                        </div>
                        {asset.prompt && (
                          <p className="text-sm text-gray-400 line-clamp-2 italic">&ldquo;{asset.prompt}&rdquo;</p>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
                          <span className="text-xs text-gray-600">{timeAgo(asset.created_at)}</span>
                          <button
                            onClick={() => loadFromHistory(asset)}
                            className="text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                          >
                            Load →
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── GENERATE TAB ── */}
          {pageTab === "generate" && (
            <div className="grid lg:grid-cols-[400px_1fr] gap-8">

              {/* Left Panel — Controls */}
              <div className="space-y-6">

                {/* Ad Type */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">Ad Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setAdType("carousel")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${adType === "carousel" ? "border-teal-400/50 bg-teal-400/10 text-teal-400" : "border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-white/20"}`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                      </svg>
                      <span className="text-sm font-semibold">Carousel</span>
                      <span className="text-xs opacity-60">{TOKEN_COSTS.carousel} tokens</span>
                    </button>
                    <button
                      onClick={() => setAdType("single")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${adType === "single" ? "border-teal-400/50 bg-teal-400/10 text-teal-400" : "border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-white/20"}`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                      </svg>
                      <span className="text-sm font-semibold">Single Image</span>
                      <span className="text-xs opacity-60">{TOKEN_COSTS.single} tokens</span>
                    </button>
                  </div>
                </div>

                {/* Template */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Template
                    {adType === "single" && (
                      <span className="ml-2 text-xs font-normal text-gray-600">{filteredTemplates.length} templates</span>
                    )}
                  </label>
                  {adType === "carousel" ? (
                    <div className="space-y-2">
                      {filteredTemplates.map(([key, info]) => (
                        <button
                          key={key}
                          onClick={() => setTemplate(key as TemplateName)}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${template === key ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"}`}
                        >
                          <div className={`text-sm font-semibold ${template === key ? "text-teal-400" : "text-white"}`}>{info.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{info.description}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
                      {CATEGORY_ORDER.filter(cat => groupedSingleTemplates[cat]).map(cat => (
                        <div key={cat}>
                          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">{cat}</p>
                          <div className="space-y-1.5">
                            {groupedSingleTemplates[cat].map(([key, info]) => (
                              <button
                                key={key}
                                onClick={() => setTemplate(key as TemplateName)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${template === key ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"}`}
                              >
                                <div className={`text-sm font-semibold ${template === key ? "text-teal-400" : "text-white"}`}>{info.label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{info.description}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Topic + Phase A Brief Fields */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Topic / Description</label>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none"
                      placeholder="Why service businesses are switching to AI automation..."
                    />
                  </div>

                  <div className="border-t border-white/[0.06] pt-4 space-y-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Brief Details</p>

                    {/* Platform toggle */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">Platform</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["instagram", "facebook", "linkedin"] as Platform[]).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPlatform(p)}
                            className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all ${platform === p ? "border-teal-400/50 bg-teal-400/10 text-teal-400" : "border-white/[0.08] text-gray-500 hover:border-white/20"}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Offer */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Offer / Lead Magnet <span className="text-gray-600">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={offer}
                        onChange={(e) => setOffer(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-400/50 transition-all"
                        placeholder="e.g. Free 30-min AI audit, 50% off first month"
                      />
                    </div>

                    {/* Pain Point */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Key Pain Point <span className="text-gray-600">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={painPoint}
                        onChange={(e) => setPainPoint(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-400/50 transition-all"
                        placeholder="e.g. Drowning in repetitive admin tasks"
                      />
                    </div>

                    {/* CTA Text */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">CTA Text</label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-400/50 transition-all"
                        placeholder="Book a Free Call"
                      />
                    </div>

                    {/* Testimonial Quote (conditional) */}
                    {showTestimonialField && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          Customer Quote <span className="text-gray-600">(optional)</span>
                        </label>
                        <textarea
                          value={testimonialQuote}
                          onChange={(e) => setTestimonialQuote(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-400/50 transition-all resize-none"
                          placeholder="Paste a real client quote for authenticity..."
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Dimensions */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">Dimensions</label>
                  <div className="grid grid-cols-3 gap-2">
                    {DIMENSIONS_OPTIONS.map((dim) => (
                      <button
                        key={dim.value}
                        onClick={() => setDimensions(dim.value)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${dimensions === dim.value ? "border-teal-400/50 bg-teal-400/10 text-teal-400" : "border-white/[0.08] text-gray-500 hover:border-white/20"}`}
                      >
                        <span className="text-sm font-semibold">{dim.label}</span>
                        <span className="text-[10px] opacity-60">{dim.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={generating || !topic.trim()}
                  className="w-full py-4 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3"
                >
                  {generating ? (
                    <>
                      <Spinner />
                      Generating copy...
                    </>
                  ) : (
                    <>
                      Generate {adType === "carousel" ? "Carousel" : "Image"}
                      <span className="text-black/60 text-sm">({TOKEN_COSTS[adType]} tokens)</span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
              </div>

              {/* Right Panel — Results */}
              <div className="min-h-[400px]">
                {!result && !generating ? (
                  <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
                    <div className="text-center px-8 py-16">
                      <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium mb-1">No creatives yet</p>
                      <p className="text-gray-600 text-sm">Pick a template, fill in the brief, and generate.</p>
                    </div>
                  </div>
                ) : generating ? (
                  <div className="h-full flex items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                    <div className="text-center px-8 py-16">
                      <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-4">
                        <Spinner className="w-7 h-7 text-teal-400" />
                      </div>
                      <p className="text-white font-medium mb-1">Generating with Claude + Flux</p>
                      <p className="text-gray-500 text-sm">Writing copy &amp; rendering background... 15–30 seconds.</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-6">

                    {/* Results Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-white">
                        {result.copy.type === "carousel" ? `Carousel — ${result.htmlStrings.length} slides` : "Generated Ad"}
                      </h2>
                      {result.htmlStrings.length > 1 && (
                        <button
                          onClick={handleDownloadAll}
                          disabled={downloading}
                          className="text-sm text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          {downloading ? "Downloading..." : "Download All"}
                        </button>
                      )}
                    </div>

                    {/* Preview Grid */}
                    <div className={`grid gap-4 ${result.copy.type === "carousel" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-md"}`}>
                      {result.htmlStrings.map((html, i) => (
                        <div
                          key={i}
                          className="group relative rounded-xl overflow-hidden border border-white/[0.08] bg-black/40 cursor-pointer"
                          onClick={() => setSelectedSlide(i)}
                        >
                          {/* Scaled preview iframe */}
                          <div className="relative w-full" style={{ paddingBottom: `${(result.dimensions.height / result.dimensions.width) * 100}%` }}>
                            <iframe
                              ref={(el) => { previewRefs.current[i] = el }}
                              srcDoc={html}
                              className="absolute inset-0 w-full h-full pointer-events-none"
                              style={{
                                transform: `scale(${1 / (result.dimensions.width / 300)})`,
                                transformOrigin: "top left",
                                width: `${result.dimensions.width}px`,
                                height: `${result.dimensions.height}px`,
                              }}
                              sandbox="allow-same-origin"
                            />
                          </div>

                          {/* Hover overlay — Phase C regen + download */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                            {result.copy.type === "carousel" && (
                              <span className="text-xs text-white/80 font-medium">Slide {i + 1}</span>
                            )}
                            <div className="ml-auto flex items-center gap-1.5">
                              {/* Phase C: Regen button */}
                              {result.copy.type === "carousel" && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); regenSlide(i) }}
                                  disabled={slideRegenLoading[i] || downloading}
                                  title="Regenerate this slide (2 tokens)"
                                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
                                >
                                  {slideRegenLoading[i] ? (
                                    <Spinner className="w-4 h-4 text-white" />
                                  ) : (
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                  )}
                                </button>
                              )}
                              {/* Download button */}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDownloadSlide(i) }}
                                disabled={downloading}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
                              >
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Phase B: Edit Copy Panel — Carousel */}
                    {result.copy.type === "carousel" && editedSlides.length > 0 && (
                      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                        <h3 className="text-sm font-semibold text-white mb-4">Edit Copy</h3>

                        {/* Slide selector tabs */}
                        <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
                          {editedSlides.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setEditingSlide(i)}
                              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${editingSlide === i ? "bg-teal-400/10 text-teal-400 border border-teal-400/30" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}
                            >
                              Slide {i + 1}
                            </button>
                          ))}
                        </div>

                        {/* Fields for active slide */}
                        {editedSlides[editingSlide] && (() => {
                          const slide = editedSlides[editingSlide]
                          const set = (field: Partial<SlideData>) => updateSlideHtml(editingSlide, field)
                          return (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Headline</label>
                                <input
                                  type="text"
                                  value={slide.headline}
                                  onChange={(e) => set({ headline: e.target.value })}
                                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-teal-400/50 transition-all"
                                />
                              </div>
                              {slide.body !== undefined && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Body</label>
                                  <textarea
                                    value={slide.body}
                                    onChange={(e) => set({ body: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-teal-400/50 transition-all resize-none"
                                  />
                                </div>
                              )}
                              {slide.quote !== undefined && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Quote</label>
                                  <textarea
                                    value={slide.quote}
                                    onChange={(e) => set({ quote: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-teal-400/50 transition-all resize-none"
                                  />
                                </div>
                              )}
                              {slide.author !== undefined && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Author</label>
                                  <input
                                    type="text"
                                    value={slide.author}
                                    onChange={(e) => set({ author: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-teal-400/50 transition-all"
                                  />
                                </div>
                              )}
                              {slide.cta !== undefined && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1.5">CTA</label>
                                  <input
                                    type="text"
                                    value={slide.cta}
                                    onChange={(e) => set({ cta: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-teal-400/50 transition-all"
                                  />
                                </div>
                              )}
                              <p className="text-xs text-gray-600">Changes update the preview instantly.</p>
                            </div>
                          )
                        })()}
                      </div>
                    )}

                    {/* Phase B: Edit Copy Panel — Single */}
                    {result.copy.type === "single" && editedSingle && (
                      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                        <h3 className="text-sm font-semibold text-white mb-4">Edit Copy</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Headline</label>
                            <input
                              type="text"
                              value={editedSingle.headline}
                              onChange={(e) => updateSingleHtml({ headline: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-teal-400/50 transition-all"
                            />
                          </div>
                          {editedSingle.subheadline !== undefined && (
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5">Subheadline</label>
                              <input
                                type="text"
                                value={editedSingle.subheadline}
                                onChange={(e) => updateSingleHtml({ subheadline: e.target.value })}
                                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-teal-400/50 transition-all"
                              />
                            </div>
                          )}
                          {editedSingle.body !== undefined && editedSingle.body !== "" && (
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5">Body</label>
                              <textarea
                                value={editedSingle.body}
                                onChange={(e) => updateSingleHtml({ body: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-teal-400/50 transition-all resize-none"
                              />
                            </div>
                          )}
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">CTA</label>
                            <input
                              type="text"
                              value={editedSingle.cta}
                              onChange={(e) => updateSingleHtml({ cta: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-teal-400/50 transition-all"
                            />
                          </div>
                          <p className="text-xs text-gray-600">Changes update the preview instantly.</p>
                        </div>
                      </div>
                    )}

                    {/* Caption / Primary Text */}
                    {result.copy.primary_text && (
                      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-gray-400">Caption Text</label>
                          <button
                            onClick={() => {
                              const text = `${result.copy.primary_text || ""}\n\n${result.copy.hashtags || ""}`
                              navigator.clipboard.writeText(text)
                            }}
                            className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{result.copy.primary_text}</p>
                        {result.copy.hashtags && (
                          <p className="text-gray-500 text-sm mt-3">{result.copy.hashtags}</p>
                        )}
                      </div>
                    )}

                  </div>
                ) : null}
              </div>
            </div>
          )}

      {/* Lightbox */}
      {selectedSlide !== null && result && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-8"
          onClick={() => setSelectedSlide(null)}
        >
          <button onClick={() => setSelectedSlide(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative max-w-2xl w-full">
            <div className="relative w-full" style={{ paddingBottom: `${(result.dimensions.height / result.dimensions.width) * 100}%` }}>
              <iframe
                srcDoc={result.htmlStrings[selectedSlide]}
                className="absolute inset-0 w-full h-full border border-white/10 rounded-xl"
                style={{
                  transform: `scale(${1 / (result.dimensions.width / 600)})`,
                  transformOrigin: "top left",
                  width: `${result.dimensions.width}px`,
                  height: `${result.dimensions.height}px`,
                }}
                sandbox="allow-same-origin"
              />
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleDownloadSlide(selectedSlide) }}
            disabled={downloading}
            className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-400 text-black font-semibold hover:bg-teal-300 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {downloading ? "Downloading..." : "Download PNG"}
          </button>

          {/* Slide navigation */}
          {result.htmlStrings.length > 1 && (
            <>
              {selectedSlide > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedSlide(selectedSlide - 1) }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {selectedSlide < result.htmlStrings.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedSlide(selectedSlide + 1) }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
