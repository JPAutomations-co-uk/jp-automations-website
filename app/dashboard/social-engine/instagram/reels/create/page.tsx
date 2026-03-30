"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { createClient as createBrowserSupabaseClient } from "@/app/lib/supabase/client"
import { TEMPLATE_LIST as RAW_TEMPLATE_LIST } from "@/app/lib/reel-intake/templates"
import type { IntakeQuestion, CreativeBrief, InputMode } from "@/app/lib/reel-intake/types"

/* ================================================================== */
/*  Types (page-specific only)                                         */
/* ================================================================== */

type Phase = "input" | "questions" | "preview" | "generating"

type GeneratedSlide = {
  imageUrl: string
  index: number
}

type ReelJobState = {
  jobId: string
  status: "queued" | "processing" | "completed" | "failed"
  progress: number
  logs: string
  outputUrl: string | null
  error: string | null
}

type UploadSpec = {
  bucket: string
  assetKey: string
  token: string
}

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const AI_TOKEN_COST = 15
const LUXURY_TOKEN_COST = 25
const SUPABASE_MAX_OBJECT_BYTES = 50 * 1024 * 1024

const TEMPLATE_LIST = RAW_TEMPLATE_LIST.map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  accent: t.accentColor,
}))

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function SlideTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    hook: "bg-red-500/10 text-red-400 border-red-500/20",
    content: "bg-teal-400/10 text-teal-400 border-teal-400/20",
    proof: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    cta: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  }
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors[type] || colors.content}`}>
      {type}
    </span>
  )
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export default function CreateReelPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])

  // Phase
  const [phase, setPhase] = useState<Phase>("input")

  // Phase 1: Input
  const [inputMode, setInputMode] = useState<InputMode>("own_images")
  const [topic, setTopic] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState("")

  // Phase 2: Questions
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null)
  const [inferredTemplate, setInferredTemplate] = useState<string | null>(null)
  const [inferredMood, setInferredMood] = useState<string | null>(null)
  const [questions, setQuestions] = useState<IntakeQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [generatingBrief, setGeneratingBrief] = useState(false)
  const [briefError, setBriefError] = useState("")

  // Phase 3: Preview
  const [brief, setBrief] = useState<CreativeBrief | null>(null)

  // Phase 4: Generating
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState("")
  const [aiSlides, setAiSlides] = useState<GeneratedSlide[]>([])
  const [luxuryJob, setLuxuryJob] = useState<ReelJobState | null>(null)
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Supabase asset keys for uploaded images
  const [imageAssetKeys, setImageAssetKeys] = useState<string[]>([])

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tokenCost = inputMode === "own_images" ? LUXURY_TOKEN_COST : AI_TOKEN_COST

  // ---- Image preview management ----
  useEffect(() => {
    const urls = imageFiles.map((f) => URL.createObjectURL(f))
    setImagePreviews(urls)
    return () => urls.forEach(URL.revokeObjectURL)
  }, [imageFiles])

  // ---- Upload helpers (same pattern as existing reels page) ----
  const requestUploadUrl = useCallback(async (filename: string, mimeType: string): Promise<UploadSpec> => {
    const res = await fetch("/api/media/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, mimeType: mimeType || "application/octet-stream" }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(String(data.error || "Failed to create upload URL"))
    return { bucket: String(data.bucket || ""), assetKey: String(data.assetKey || ""), token: String(data.token || "") }
  }, [])

  const uploadBlobToSignedUrl = useCallback(
    async (spec: UploadSpec, payload: Blob): Promise<void> => {
      const { error } = await (supabase.storage.from(spec.bucket) as any).uploadToSignedUrl(spec.assetKey, spec.token, payload)
      if (error) throw new Error(String(error.message || error || "Upload failed"))
    },
    [supabase],
  )

  const uploadAsset = useCallback(
    async (file: File): Promise<string> => {
      if (file.size > SUPABASE_MAX_OBJECT_BYTES) {
        throw new Error(`File ${file.name} exceeds 50MB limit`)
      }
      const spec = await requestUploadUrl(file.name, file.type || "application/octet-stream")
      await uploadBlobToSignedUrl(spec, file)
      return spec.assetKey
    },
    [requestUploadUrl, uploadBlobToSignedUrl],
  )

  // ---- Polling for luxury reel job ----
  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearTimeout(pollRef.current)
      pollRef.current = null
    }
  }, [])

  useEffect(() => () => stopPolling(), [stopPolling])

  const pollJob = useCallback(async (jobId: string) => {
    try {
      const res = await fetch(`/api/generate/reel-edit/${jobId}`, { cache: "no-store" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setGenerateError(String(data.error || "Failed to fetch job status."))
        stopPolling()
        return
      }
      const status = String(data.status || "queued") as ReelJobState["status"]
      setLuxuryJob({
        jobId,
        status,
        progress: Number(data.progress || 0),
        logs: String(data.logs || ""),
        outputUrl: data.outputUrl ? String(data.outputUrl) : null,
        error: data.error ? String(data.error) : null,
      })
      if (status === "completed" || status === "failed") {
        stopPolling()
        await refreshBalance()
      }
    } catch {
      setGenerateError("Failed to poll job status.")
      stopPolling()
    }
  }, [refreshBalance, stopPolling])

  const startPolling = useCallback((jobId: string) => {
    stopPolling()
    const tick = async () => {
      await pollJob(jobId)
      pollRef.current = setTimeout(tick, 2500)
    }
    void tick()
  }, [pollJob, stopPolling])

  // ---- Handle download ----
  const handleDownload = useCallback(async (url: string, filename: string) => {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error("Download failed")
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
  }, [])

  // ---- Phase 1 → 2: Analyze ----
  const handleAnalyze = useCallback(async () => {
    if (!topic.trim() && imageFiles.length === 0) {
      setAnalyzeError("Enter a topic or upload images")
      return
    }
    if (!user) {
      router.push("/login?redirect=/dashboard/social-engine/instagram/reels/create")
      return
    }

    setAnalyzing(true)
    setAnalyzeError("")

    try {
      // Upload images if needed
      let assetKeys = imageAssetKeys
      if (imageFiles.length > 0 && imageAssetKeys.length === 0) {
        const keys: string[] = []
        for (const file of imageFiles) {
          const key = await uploadAsset(file)
          keys.push(key)
        }
        assetKeys = keys
        setImageAssetKeys(keys)
      }

      const res = await fetch("/api/generate/reel/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze",
          topic: topic.trim(),
          imageAssetKeys: assetKeys.length > 0 ? assetKeys : undefined,
          template: selectedTemplate || undefined,
          inputMode,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setAnalyzeError(String(data.error || "Analysis failed"))
        return
      }

      setImageAnalysis(data.imageAnalysis || null)
      setInferredTemplate(data.inferredTemplate || null)
      setInferredMood(data.inferredMood || null)
      setQuestions(Array.isArray(data.questions) ? data.questions : [])

      // Pre-fill answers from recommended/prefilled values
      const prefilled: Record<string, string> = {}
      for (const q of data.questions || []) {
        if (q.prefilled) prefilled[q.id] = q.prefilled
        else if (q.recommended) prefilled[q.id] = q.recommended
      }
      setAnswers(prefilled)
      setPhase("questions")
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : "Analysis failed")
    } finally {
      setAnalyzing(false)
    }
  }, [topic, imageFiles, imageAssetKeys, selectedTemplate, inputMode, user, router, uploadAsset])

  // ---- Phase 2 → 3: Generate Brief ----
  const handleGenerateBrief = useCallback(async () => {
    setGeneratingBrief(true)
    setBriefError("")

    try {
      const res = await fetch("/api/generate/reel/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "brief",
          topic: topic.trim(),
          imageAssetKeys: imageAssetKeys.length > 0 ? imageAssetKeys : undefined,
          template: selectedTemplate || inferredTemplate || undefined,
          inferredTemplate,
          inputMode,
          answers,
          imageAnalysis,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setBriefError(String(data.error || "Brief generation failed"))
        return
      }

      setBrief(data.brief)
      setPhase("preview")
    } catch (e) {
      setBriefError(e instanceof Error ? e.message : "Brief generation failed")
    } finally {
      setGeneratingBrief(false)
    }
  }, [topic, imageAssetKeys, selectedTemplate, inferredTemplate, inputMode, answers, imageAnalysis])

  // ---- Phase 3 → 4: Generate ----
  const handleGenerate = useCallback(async () => {
    if (!brief) return
    if (!user) {
      router.push("/login?redirect=/dashboard/social-engine/instagram/reels/create")
      return
    }
    if (tokenBalance < tokenCost) {
      setGenerateError(`Insufficient tokens. Need ${tokenCost}, have ${tokenBalance}.`)
      return
    }

    setGenerating(true)
    setGenerateError("")
    setPhase("generating")

    try {
      if (brief.inputMode === "own_images") {
        // Convert brief slides to luxury reel frame plan format
        const framePlan = {
          reel_concept: {
            title: brief.topic,
            hook_angle: brief.slides[0]?.on_screen_text || "",
            content_structure: `${brief.slides.length}-slide reel`,
            cta: brief.slides[brief.slides.length - 1]?.on_screen_text || "Follow for more",
          },
          style_analysis: {
            palette: brief.template,
            mood: brief.mood,
            subject: brief.topic,
            quality_level: "premium",
          },
          frame_plan: brief.slides.map((s) => ({
            slide: s.slide,
            type: s.type,
            source_image: s.source_image || "",
            camera_movement: s.camera_movement || "Slow dolly-in",
            higgsfield_prompt: s.higgsfield_prompt || `${s.camera_movement || "Slow dolly-in"}. Warm ambient light.`,
            on_screen_text: s.on_screen_text,
            visual_summary: s.visual_summary,
          })),
        }

        const res = await fetch("/api/generate/luxury-reel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            framePlan,
            photoAssetKeys: imageAssetKeys,
            template: brief.template,
          }),
        })
        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          setGenerateError(String(data.error || "Failed to start reel generation"))
          setPhase("preview")
          return
        }

        const jobId = String(data.jobId || "")
        if (jobId) {
          setLuxuryJob({ jobId, status: "queued", progress: 0, logs: "Queued", outputUrl: null, error: null })
          startPolling(jobId)
        }
        await refreshBalance()
      } else {
        // AI images — call Flux Pro via existing reel endpoint
        const res = await fetch("/api/generate/reel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: brief.topic,
            vibeMotion: true,
            brief: { slides: brief.slides },
          }),
        })
        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          setGenerateError(String(data.error || "Generation failed"))
          setPhase("preview")
          return
        }

        const successful = (Array.isArray(data.slides) ? data.slides : [])
          .filter((s: { status?: string; imageUrl?: string }) => s.status === "success" && s.imageUrl)
          .map((s: { imageUrl: string; index: number }) => ({ imageUrl: s.imageUrl, index: s.index }))
        setAiSlides(successful)
        await refreshBalance()
      }
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : "Generation failed")
      setPhase("preview")
    } finally {
      setGenerating(false)
    }
  }, [brief, user, tokenBalance, tokenCost, imageAssetKeys, router, startPolling, refreshBalance])

  // ---- Remove image ----
  const removeImage = useCallback((index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImageAssetKeys([]) // force re-upload
  }, [])

  // ---- File drop handler ----
  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/")).slice(0, 12)
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files].slice(0, 12))
      setImageAssetKeys([])
    }
  }, [])

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

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
            <a href="/dashboard" className="px-5 py-2.5 text-sm font-semibold border border-teal-400/40 text-teal-400 rounded-lg hover:bg-teal-400/10 transition-all">My Apps</a>
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-lg">
                  <span className="text-sm font-semibold text-teal-400">{tokenBalance}</span>
                  <span className="text-xs text-gray-500">tokens</span>
                </div>
                <UserMenu />
              </>
            ) : (
              <a href="/login?redirect=/dashboard/social-engine/instagram/reels/create" className="px-5 py-2.5 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all">Sign In</a>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-white">
            <div className="w-8 h-6 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 bg-[#050505]/95 z-40 flex items-center justify-center transition-all ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <a href="/" className="text-4xl font-bold text-gray-300 hover:text-teal-400" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="/dashboard" className="text-4xl font-bold text-gray-300 hover:text-teal-400" onClick={() => setIsMobileMenuOpen(false)}>My Apps</a>
        </div>
      </div>

      <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Back link */}
          <a href="/dashboard/social-engine/instagram/reels" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Reels
          </a>

          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">Smart Reel Creator</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create a Reel</h1>
            <p className="text-gray-500">Upload your images or describe what you want — AI builds the perfect reel.</p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {["Input", "Questions", "Preview", "Generate"].map((label, i) => {
              const phaseIndex = ["input", "questions", "preview", "generating"].indexOf(phase)
              const isActive = i === phaseIndex
              const isDone = i < phaseIndex
              return (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isActive ? "bg-teal-400 text-black" : isDone ? "bg-teal-400/20 text-teal-400" : "bg-white/[0.06] text-gray-600"}`}>
                    {isDone ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${isActive ? "text-white" : isDone ? "text-teal-400/60" : "text-gray-600"}`}>{label}</span>
                  {i < 3 && <div className={`flex-1 h-px ${isDone ? "bg-teal-400/30" : "bg-white/[0.06]"}`} />}
                </div>
              )
            })}
          </div>

          {/* ============================================================ */}
          {/*  PHASE 1: INPUT                                               */}
          {/* ============================================================ */}
          {phase === "input" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Mode toggle */}
              <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <button
                  onClick={() => setInputMode("own_images")}
                  className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${inputMode === "own_images" ? "bg-teal-400/10 text-teal-400 border border-teal-400/20" : "text-gray-500 hover:text-gray-300"}`}
                >
                  My Images
                </button>
                <button
                  onClick={() => setInputMode("ai_images")}
                  className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${inputMode === "ai_images" ? "bg-teal-400/10 text-teal-400 border border-teal-400/20" : "text-gray-500 hover:text-gray-300"}`}
                >
                  AI-Generated
                </button>
              </div>

              {/* Image upload */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    {inputMode === "own_images" ? "Upload Your Photos" : "Reference Images (optional)"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {inputMode === "own_images"
                      ? "These will be animated into video clips for your reel."
                      : "Drop inspiration images so AI can match the style."}
                  </p>
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/[0.1] hover:border-teal-400/30 rounded-xl p-8 text-center cursor-pointer transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []).slice(0, 12)
                      if (files.length > 0) {
                        setImageFiles((prev) => [...prev, ...files].slice(0, 12))
                        setImageAssetKeys([])
                      }
                      e.target.value = ""
                    }}
                  />
                  <svg className="w-8 h-8 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                  <p className="text-sm text-gray-400 mb-1">Drop images here or click to browse</p>
                  <p className="text-xs text-gray-600">JPG, PNG, WebP — up to 12 images</p>
                </div>

                {/* Thumbnails */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {imagePreviews.map((url, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-white/[0.08] aspect-square">
                        <img src={url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => { e.stopPropagation(); removeImage(i) }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          x
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-center py-0.5">
                          <span className="text-[10px] text-white/80">{i + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Topic */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  {inputMode === "own_images" ? "Topic / Description (optional)" : "Reel Topic"}
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 resize-none transition-all"
                  placeholder={inputMode === "own_images" ? "e.g. 5 reasons to redesign your office..." : "e.g. Modern kitchen renovation ideas for 2025..."}
                />
              </div>

              {/* Template picker */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">Visual Template</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TEMPLATE_LIST.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(selectedTemplate === t.id ? null : t.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${selectedTemplate === t.id ? "border-teal-400/40 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accent }} />
                        <span className="text-sm font-semibold text-white">{t.name}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight">{t.description}</p>
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className={`text-left p-3 rounded-xl border transition-all ${selectedTemplate === null ? "border-teal-400/40 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-purple-400" />
                      <span className="text-sm font-semibold text-white">Let AI Decide</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight">Best template inferred from your images</p>
                  </button>
                </div>
              </div>

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={analyzing || (!topic.trim() && imageFiles.length === 0)}
                className="w-full py-4 rounded-xl font-semibold bg-white/[0.06] border border-white/[0.1] text-white hover:bg-white/[0.1] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {analyzing ? (
                  <>
                    <Spinner />
                    {imageAssetKeys.length === 0 && imageFiles.length > 0 ? "Uploading images..." : "Analysing with Claude..."}
                  </>
                ) : (
                  <>Analyse & Build Questions (free)</>
                )}
              </button>

              {analyzeError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{analyzeError}</div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/*  PHASE 2: QUESTIONS                                           */}
          {/* ============================================================ */}
          {phase === "questions" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Image analysis card */}
              {imageAnalysis && (
                <div className="bg-teal-400/5 border border-teal-400/20 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-teal-300 mb-1">Image Analysis</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{imageAnalysis}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {inferredTemplate && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400">
                            Template: {TEMPLATE_LIST.find((t) => t.id === inferredTemplate)?.name || inferredTemplate}
                          </span>
                        )}
                        {inferredMood && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                            Mood: {inferredMood}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic questions */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Customise Your Reel</h2>
                  <p className="text-sm text-gray-500">AI-tailored questions based on your input. Adjust as needed.</p>
                </div>

                {questions.map((q) => (
                  <div key={q.id}>
                    <label className="block text-sm font-medium text-white mb-1">{q.label}</label>
                    <p className="text-xs text-gray-500 mb-3">{q.description}</p>

                    {q.type === "select" && q.options && (
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                            className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                              answers[q.id] === opt.value
                                ? "border-teal-400/40 bg-teal-400/10 text-teal-400"
                                : "border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-gray-300"
                            }`}
                          >
                            {opt.label}
                            {q.recommended === opt.value && answers[q.id] !== opt.value && (
                              <span className="ml-1.5 text-[10px] text-teal-400/60">AI pick</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === "text" && (
                      <input
                        value={answers[q.id] || ""}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder={q.placeholder}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 text-sm transition-all"
                      />
                    )}

                    {q.type === "textarea" && (
                      <textarea
                        value={answers[q.id] || ""}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder={q.placeholder}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 text-sm resize-none transition-all"
                      />
                    )}

                    {q.type === "toggle" && (
                      <button
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: prev[q.id] === "true" ? "false" : "true" }))}
                        className={`relative w-11 h-6 rounded-full transition-all ${answers[q.id] === "true" ? "bg-teal-400" : "bg-white/10"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${answers[q.id] === "true" ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setPhase("input")}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-400 border border-white/[0.08] hover:bg-white/[0.04] transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateBrief}
                  disabled={generatingBrief}
                  className="flex-1 py-3 rounded-xl font-semibold bg-white/[0.06] border border-white/[0.1] text-white hover:bg-white/[0.1] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {generatingBrief ? <><Spinner /> Building creative brief...</> : "Generate Preview (free)"}
                </button>
              </div>

              {briefError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{briefError}</div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/*  PHASE 3: PREVIEW                                             */}
          {/* ============================================================ */}
          {phase === "preview" && brief && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Brief header */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="text-lg font-bold text-white">Reel Preview</h2>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${brief.inputMode === "own_images" ? "bg-amber-400/10 border-amber-400/20 text-amber-300" : "bg-teal-400/10 border-teal-400/20 text-teal-400"}`}>
                    {brief.inputMode === "own_images" ? "Your Photos + Higgsfield" : "AI-Generated + Flux Pro"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>Topic: <span className="text-gray-300">{brief.topic}</span></span>
                  <span>·</span>
                  <span>Template: <span className="text-gray-300">{TEMPLATE_LIST.find((t) => t.id === brief.template)?.name || brief.template}</span></span>
                  <span>·</span>
                  <span>Mood: <span className="text-gray-300">{brief.mood}</span></span>
                  <span>·</span>
                  <span>{brief.slides.length} slides</span>
                </div>
              </div>

              {/* Slide cards */}
              <div className="space-y-3">
                {brief.slides.map((slide) => (
                  <div key={slide.slide} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-teal-400">{slide.slide}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <SlideTypeBadge type={slide.type} />
                          {slide.camera_movement && (
                            <span className="text-[11px] text-gray-600">{slide.camera_movement}</span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white mb-1">&ldquo;{slide.on_screen_text}&rdquo;</p>
                        <p className="text-xs text-gray-500">{slide.visual_summary}</p>
                        {slide.source_image && (
                          <p className="text-[11px] text-gray-600 mt-1">Source: {slide.source_image}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost + actions */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">Cost</span>
                <span className="text-sm font-semibold text-white">{tokenCost} tokens</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPhase("questions")}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-400 border border-white/[0.08] hover:bg-white/[0.04] transition-all"
                >
                  Modify
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                    brief.inputMode === "own_images"
                      ? "bg-amber-400 text-black hover:bg-amber-300"
                      : "bg-teal-400 text-black hover:bg-teal-300"
                  }`}
                >
                  {generating ? <><Spinner className="w-4 h-4" /> Starting generation...</> : `Approve & Generate (${tokenCost} tokens)`}
                </button>
              </div>

              {generateError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{generateError}</div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/*  PHASE 4: GENERATING                                          */}
          {/* ============================================================ */}
          {phase === "generating" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Luxury reel job progress */}
              {luxuryJob && (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-amber-300 font-semibold">Job {luxuryJob.jobId.slice(0, 8)}...</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{luxuryJob.status}</p>
                  </div>

                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-amber-400 transition-all" style={{ width: `${Math.max(0, Math.min(100, luxuryJob.progress))}%` }} />
                  </div>
                  <p className="text-xs text-gray-400">Progress: {Math.round(luxuryJob.progress)}%</p>

                  {luxuryJob.status === "processing" && luxuryJob.progress < 78 && (
                    <p className="text-xs text-gray-500">Animating clips with Higgsfield AI — typically 5-15 minutes.</p>
                  )}

                  {luxuryJob.error && <p className="text-xs text-red-400">{luxuryJob.error}</p>}

                  {luxuryJob.outputUrl && (
                    <div className="space-y-3">
                      <video src={luxuryJob.outputUrl} controls className="w-full rounded-xl border border-white/[0.08] bg-black" />
                      <div className="flex gap-3">
                        <a href={luxuryJob.outputUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-300 hover:text-amber-200">Open</a>
                        <button onClick={() => handleDownload(luxuryJob.outputUrl!, `smart-reel-${luxuryJob.jobId}.mp4`)} className="text-sm text-amber-300 hover:text-amber-200">Download</button>
                      </div>
                    </div>
                  )}

                  {luxuryJob.logs && (
                    <details className="text-xs text-gray-300">
                      <summary className="cursor-pointer text-gray-400 hover:text-gray-200">View logs</summary>
                      <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-black/40 border border-white/[0.06] p-3 text-[11px] leading-relaxed">{luxuryJob.logs}</pre>
                    </details>
                  )}
                </div>
              )}

              {/* AI images result */}
              {aiSlides.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">Generated Frames — {aiSlides.length} slides</h2>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {aiSlides.map((slide, i) => (
                      <div key={i} className="group relative rounded-xl overflow-hidden border border-white/[0.08] bg-black/40">
                        <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                          <img src={slide.imageUrl} alt={`Frame ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                          <span className="text-xs text-white/80 font-medium">Frame {i + 1}</span>
                          <button
                            onClick={() => handleDownload(slide.imageUrl, `smart-reel-frame-${i + 1}.webp`)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
                          >
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading state (no job yet, no slides yet) */}
              {!luxuryJob && aiSlides.length === 0 && (
                <div className="flex items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] py-20">
                  <div className="text-center">
                    <Spinner className="w-8 h-8 text-teal-400 mx-auto mb-4" />
                    <p className="text-white font-medium mb-1">Starting generation...</p>
                    <p className="text-sm text-gray-500">This may take a moment.</p>
                  </div>
                </div>
              )}

              {generateError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{generateError}</div>
              )}

              {/* Back to start */}
              <button
                onClick={() => { setPhase("input"); setAiSlides([]); setLuxuryJob(null); setGenerateError(""); stopPolling() }}
                className="text-sm text-gray-500 hover:text-teal-400 transition-colors"
              >
                Create another reel
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
