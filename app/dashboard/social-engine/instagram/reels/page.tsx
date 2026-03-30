"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/app/components/AuthProvider"
import { createClient as createBrowserSupabaseClient } from "@/app/lib/supabase/client"

type ReelMode = "ai" | "edit" | "luxury"
type EditTier = "basic" | "pro"
type EditInputMode = "clips" | "video"
type TransitionStyle = "crossfade" | "wipe" | "slide" | "zoom" | "dissolve" | "random"
type MotionPack = "full" | "balanced" | "minimal"
type CaptionMode = "auto" | "srt" | "none"
type StylePreset = "clean" | "minimal" | "bold" | "dark"

type GeneratedSlide = {
  imageUrl: string
  index: number
}

type LuxuryFrameItem = {
  slide: number
  type: string
  source_image: string
  camera_movement: string
  higgsfield_prompt: string
  on_screen_text: string
  visual_summary: string
}

type LuxuryFramePlan = {
  reel_concept: {
    title: string
    hook_angle: string
    content_structure: string
    cta: string
  }
  style_analysis: {
    palette: string
    mood: string
    subject: string
    quality_level: string
  }
  frame_plan: LuxuryFrameItem[]
}

type ReelJobState = {
  jobId: string
  mode: EditTier
  status: "queued" | "processing" | "completed" | "failed"
  progress: number
  logs: string
  outputUrl: string | null
  thumbnailUrl: string | null
  error: string | null
}

type UploadSpec = {
  bucket: string
  assetKey: string
  token: string
}

const AI_TOKEN_COST = 15
const LUXURY_TOKEN_COST = 25
const LUXURY_TEMPLATES = [
  { value: "dark_luxury", label: "Dark Luxury" },
  { value: "clean_minimal", label: "Clean Minimal" },
  { value: "bold_editorial", label: "Bold Editorial" },
  { value: "warm_natural", label: "Warm Natural" },
  { value: "urban_industrial", label: "Urban Industrial" },
  { value: "bright_playful", label: "Bright Playful" },
]
const SUPABASE_MAX_OBJECT_BYTES = 50 * 1024 * 1024
const CHUNK_UPLOAD_BYTES = 45 * 1024 * 1024

type ChunkManifest = {
  type: "chunked-asset-v1"
  originalName: string
  originalMimeType: string
  originalSizeBytes: number
  chunkSizeBytes: number
  partAssetKeys: string[]
}

function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function ReelCostBadge({ tier }: { tier: EditTier }) {
  const cost = tier === "pro" ? 8 : 2
  return <span className="text-xs text-teal-400 font-semibold">{cost} tokens</span>
}

export default function ReelsPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])

  const [mode, setMode] = useState<ReelMode>("edit")

  // AI reel tab
  const [topic, setTopic] = useState("")
  const [vibeMotion, setVibeMotion] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [aiError, setAiError] = useState("")
  const [slides, setSlides] = useState<GeneratedSlide[]>([])
  const [selectedSlide, setSelectedSlide] = useState<string | null>(null)

  // Edit tab
  const [editTier, setEditTier] = useState<EditTier>("pro")
  const [inputMode, setInputMode] = useState<EditInputMode>("clips")

  const [clipFiles, setClipFiles] = useState<File[]>([])
  const [singleVideoFile, setSingleVideoFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [captionFile, setCaptionFile] = useState<File | null>(null)

  const [durationSec, setDurationSec] = useState(30)
  const [speed, setSpeed] = useState(1.1)
  const [useVad, setUseVad] = useState(true)
  const [beatSync, setBeatSync] = useState(true)
  const [transitionStyle, setTransitionStyle] = useState<TransitionStyle>("random")

  const [motionPack, setMotionPack] = useState<MotionPack>("full")
  const [captionMode, setCaptionMode] = useState<CaptionMode>("auto")
  const [stylePreset, setStylePreset] = useState<StylePreset>("clean")
  const [ctaText, setCtaText] = useState("Follow for more")

  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editError, setEditError] = useState("")
  const [job, setJob] = useState<ReelJobState | null>(null)

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Luxury reel tab
  const [luxuryPhotoFiles, setLuxuryPhotoFiles] = useState<File[]>([])
  const [luxuryTopic, setLuxuryTopic] = useState("")
  const [luxuryTemplate, setLuxuryTemplate] = useState("dark_luxury")
  const [luxuryAudioFile, setLuxuryAudioFile] = useState<File | null>(null)
  const [luxuryTransition, setLuxuryTransition] = useState("crossfade")
  const [luxuryPhotoAssetKeys, setLuxuryPhotoAssetKeys] = useState<string[]>([])
  const [luxuryFramePlan, setLuxuryFramePlan] = useState<LuxuryFramePlan | null>(null)
  const [luxuryAnalysing, setLuxuryAnalysing] = useState(false)
  const [luxuryUploading, setLuxuryUploading] = useState(false)
  const [luxuryGenerating, setLuxuryGenerating] = useState(false)
  const [luxuryError, setLuxuryError] = useState("")
  const [luxuryJob, setLuxuryJob] = useState<ReelJobState | null>(null)
  const luxuryPollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const editTokenCost = editTier === "pro" ? 8 : 2

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  const handleDownload = useCallback(async (url: string, filename: string) => {
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
  }, [])

  const requestUploadUrl = useCallback(async (filename: string, mimeType: string): Promise<UploadSpec> => {
    const res = await fetch("/api/media/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename,
        mimeType: mimeType || "application/octet-stream",
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(String(data.error || "Failed to create upload URL"))
    }

    return {
      bucket: String(data.bucket || ""),
      assetKey: String(data.assetKey || ""),
      token: String(data.token || ""),
    }
  }, [])

  const uploadBlobToSignedUrl = useCallback(
    async (spec: UploadSpec, payload: Blob): Promise<void> => {
      const storage = supabase.storage.from(spec.bucket) as any
      const { error } = await storage.uploadToSignedUrl(spec.assetKey, spec.token, payload)
      if (error) {
        const message = String(error.message || error || "Upload failed")
        if (message.includes("exceeded the maximum allowed size")) {
          throw new Error(
            "A file or chunk exceeded Supabase's 50MB object limit. Try shorter clips or retry."
          )
        }
        throw new Error(message)
      }
    },
    [supabase]
  )

  const uploadAsset = useCallback(
    async (file: File): Promise<string> => {
      if (file.size <= SUPABASE_MAX_OBJECT_BYTES) {
        const spec = await requestUploadUrl(file.name, file.type || "application/octet-stream")
        await uploadBlobToSignedUrl(spec, file)
        return spec.assetKey
      }

      const chunkCount = Math.ceil(file.size / CHUNK_UPLOAD_BYTES)
      const partAssetKeys: string[] = []

      for (let index = 0; index < chunkCount; index += 1) {
        const start = index * CHUNK_UPLOAD_BYTES
        const end = Math.min(file.size, start + CHUNK_UPLOAD_BYTES)
        const partBlob = file.slice(start, end, "application/octet-stream")
        const partName = `${file.name}.part-${String(index + 1).padStart(4, "0")}-of-${String(chunkCount).padStart(4, "0")}.bin`
        const partSpec = await requestUploadUrl(partName, "application/octet-stream")
        await uploadBlobToSignedUrl(partSpec, partBlob)
        partAssetKeys.push(partSpec.assetKey)
      }

      const manifest: ChunkManifest = {
        type: "chunked-asset-v1",
        originalName: file.name,
        originalMimeType: file.type || "application/octet-stream",
        originalSizeBytes: file.size,
        chunkSizeBytes: CHUNK_UPLOAD_BYTES,
        partAssetKeys,
      }

      const manifestName = `${file.name}.chunks.json`
      const manifestBlob = new Blob([JSON.stringify(manifest)], { type: "application/json" })
      const manifestSpec = await requestUploadUrl(manifestName, "application/json")
      await uploadBlobToSignedUrl(manifestSpec, manifestBlob)
      return manifestSpec.assetKey
    },
    [requestUploadUrl, uploadBlobToSignedUrl]
  )

  const pollJob = useCallback(
    async (jobId: string) => {
      try {
        const res = await fetch(`/api/generate/reel-edit/${jobId}`, { cache: "no-store" })
        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          setEditError(String(data.error || "Failed to fetch reel job status."))
          stopPolling()
          return
        }

        const status = String(data.status || "queued") as ReelJobState["status"]
        const nextJob: ReelJobState = {
          jobId,
          mode: (String(data.mode || "basic") as EditTier) || "basic",
          status,
          progress: Number(data.progress || 0),
          logs: String(data.logs || ""),
          outputUrl: data.outputUrl ? String(data.outputUrl) : null,
          thumbnailUrl: data.thumbnailUrl ? String(data.thumbnailUrl) : null,
          error: data.error ? String(data.error) : null,
        }

        setJob(nextJob)

        if (status === "completed" || status === "failed") {
          stopPolling()
          await refreshBalance()
        }
      } catch {
        setEditError("Failed to poll reel job status.")
        stopPolling()
      }
    },
    [refreshBalance, stopPolling]
  )

  const startPolling = useCallback(
    (jobId: string) => {
      stopPolling()
      void pollJob(jobId)
      pollRef.current = setInterval(() => {
        void pollJob(jobId)
      }, 2500)
    },
    [pollJob, stopPolling]
  )

  const stopLuxuryPolling = useCallback(() => {
    if (luxuryPollRef.current) {
      clearInterval(luxuryPollRef.current)
      luxuryPollRef.current = null
    }
  }, [])

  const pollLuxuryJob = useCallback(
    async (jobId: string) => {
      try {
        const res = await fetch(`/api/generate/reel-edit/${jobId}`, { cache: "no-store" })
        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          setLuxuryError(String(data.error || "Failed to fetch reel job status."))
          stopLuxuryPolling()
          return
        }

        const status = String(data.status || "queued") as ReelJobState["status"]
        setLuxuryJob({
          jobId,
          mode: "pro",
          status,
          progress: Number(data.progress || 0),
          logs: String(data.logs || ""),
          outputUrl: data.outputUrl ? String(data.outputUrl) : null,
          thumbnailUrl: data.thumbnailUrl ? String(data.thumbnailUrl) : null,
          error: data.error ? String(data.error) : null,
        })

        if (status === "completed" || status === "failed") {
          stopLuxuryPolling()
          await refreshBalance()
        }
      } catch {
        setLuxuryError("Failed to poll reel job status.")
        stopLuxuryPolling()
      }
    },
    [refreshBalance, stopLuxuryPolling]
  )

  const startLuxuryPolling = useCallback(
    (jobId: string) => {
      stopLuxuryPolling()
      void pollLuxuryJob(jobId)
      luxuryPollRef.current = setInterval(() => void pollLuxuryJob(jobId), 2500)
    },
    [pollLuxuryJob, stopLuxuryPolling]
  )

  useEffect(() => {
    return () => stopLuxuryPolling()
  }, [stopLuxuryPolling])

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setAiError("Please enter a topic")
      return
    }

    if (!user) {
      router.push("/login?redirect=/dashboard/social-engine/instagram/reels")
      return
    }

    if (tokenBalance < AI_TOKEN_COST) {
      setAiError(`Insufficient tokens. You need ${AI_TOKEN_COST} tokens but have ${tokenBalance}.`)
      return
    }

    setGenerating(true)
    setAiError("")
    setSlides([])

    try {
      const res = await fetch("/api/generate/reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), vibeMotion }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setAiError(String(data.error || "Generation failed"))
        return
      }

      const successful = (Array.isArray(data.slides) ? data.slides : [])
        .filter((s: { status?: string; imageUrl?: string | null }) => s.status === "success" && s.imageUrl)
        .map((s: { imageUrl: string; index: number }) => ({
          imageUrl: s.imageUrl,
          index: s.index,
        }))

      setSlides(successful)
      await refreshBalance()

      if (Number(data.successCount || 0) < Number(data.totalSlides || successful.length)) {
        setAiError(`${data.successCount}/${data.totalSlides} slides generated. Some failed — try regenerating.`)
      }
    } catch {
      setAiError("Something went wrong. Please try again.")
    } finally {
      setGenerating(false)
    }
  }, [topic, user, tokenBalance, vibeMotion, router, refreshBalance])

  const handleRunEdit = useCallback(async () => {
    if (!user) {
      router.push("/login?redirect=/dashboard/social-engine/instagram/reels")
      return
    }

    if (tokenBalance < editTokenCost) {
      setEditError(`Insufficient tokens. You need ${editTokenCost} tokens but have ${tokenBalance}.`)
      return
    }

    if (inputMode === "clips" && clipFiles.length === 0) {
      setEditError("Please upload at least one clip file.")
      return
    }

    if (inputMode === "video" && !singleVideoFile) {
      setEditError("Please upload a single video file.")
      return
    }

    if (beatSync && !audioFile) {
      setEditError("Beat sync requires an audio file.")
      return
    }

    if (editTier === "pro" && captionMode === "srt" && !captionFile) {
      setEditError("Caption mode SRT requires an .srt file upload.")
      return
    }

    setEditError("")
    setJob(null)
    setUploading(true)
    setEditing(true)

    try {
      const clipAssetKeys: string[] = []
      let singleVideoAssetKey: string | null = null
      let audioAssetKey: string | null = null
      let captionAssetKey: string | null = null

      if (inputMode === "clips") {
        for (const file of clipFiles) {
          const key = await uploadAsset(file)
          clipAssetKeys.push(key)
        }
      } else if (singleVideoFile) {
        singleVideoAssetKey = await uploadAsset(singleVideoFile)
      }

      if (audioFile) {
        audioAssetKey = await uploadAsset(audioFile)
      }

      if (editTier === "pro" && captionMode === "srt" && captionFile) {
        captionAssetKey = await uploadAsset(captionFile)
      }

      setUploading(false)

      const payload = {
        mode: editTier,
        input: {
          clipAssetKeys,
          singleVideoAssetKey,
          audioAssetKey,
        },
        options: {
          durationSec,
          speed,
          vad: useVad,
          beatSync,
          transitionStyle,
          motionPack,
          captionMode,
          captionAssetKey,
          stylePreset,
          ctaText: ctaText.trim() || null,
        },
      }

      const res = await fetch("/api/generate/reel-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setEditError(String(data.error || "Failed to start reel edit job."))
        return
      }

      const jobId = String(data.jobId || "")
      if (!jobId) {
        setEditError("Job created but no job ID was returned.")
        return
      }

      setJob({
        jobId,
        mode: editTier,
        status: "queued",
        progress: 0,
        logs: "Queued",
        outputUrl: null,
        thumbnailUrl: null,
        error: null,
      })

      startPolling(jobId)
      await refreshBalance()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload or job creation failed"
      setEditError(message)
    } finally {
      setUploading(false)
      setEditing(false)
    }
  }, [
    audioFile,
    beatSync,
    captionFile,
    captionMode,
    clipFiles,
    ctaText,
    durationSec,
    editTier,
    editTokenCost,
    inputMode,
    motionPack,
    refreshBalance,
    router,
    singleVideoFile,
    speed,
    startPolling,
    stylePreset,
    tokenBalance,
    transitionStyle,
    uploadAsset,
    useVad,
    user,
  ])

  const handleLuxuryAnalyse = useCallback(async () => {
    if (luxuryPhotoFiles.length === 0) {
      setLuxuryError("Please upload at least one photo.")
      return
    }
    if (!user) {
      router.push("/login?redirect=/dashboard/social-engine/instagram/reels")
      return
    }

    setLuxuryError("")
    setLuxuryFramePlan(null)
    setLuxuryJob(null)
    setLuxuryUploading(true)
    setLuxuryAnalysing(true)

    try {
      const assetKeys: string[] = []
      for (const file of luxuryPhotoFiles) {
        const key = await uploadAsset(file)
        assetKeys.push(key)
      }
      setLuxuryPhotoAssetKeys(assetKeys)
      setLuxuryUploading(false)

      const res = await fetch("/api/generate/luxury-reel/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoAssetKeys: assetKeys,
          topic: luxuryTopic.trim() || undefined,
          template: luxuryTemplate,
          slides: 7,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLuxuryError(String(data.error || "Analysis failed"))
        return
      }

      setLuxuryFramePlan(data.framePlan as LuxuryFramePlan)
    } catch (error) {
      setLuxuryError(error instanceof Error ? error.message : "Analysis failed")
    } finally {
      setLuxuryUploading(false)
      setLuxuryAnalysing(false)
    }
  }, [luxuryPhotoFiles, luxuryTopic, luxuryTemplate, user, router, uploadAsset])

  const handleLuxuryGenerate = useCallback(async () => {
    if (!luxuryFramePlan || luxuryPhotoAssetKeys.length === 0) return
    if (!user) {
      router.push("/login?redirect=/dashboard/social-engine/instagram/reels")
      return
    }
    if (tokenBalance < LUXURY_TOKEN_COST) {
      setLuxuryError(`Insufficient tokens. You need ${LUXURY_TOKEN_COST} but have ${tokenBalance}.`)
      return
    }

    setLuxuryError("")
    setLuxuryJob(null)
    setLuxuryGenerating(true)

    try {
      let audioAssetKey: string | null = null
      if (luxuryAudioFile) {
        audioAssetKey = await uploadAsset(luxuryAudioFile)
      }

      const res = await fetch("/api/generate/luxury-reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          framePlan: luxuryFramePlan,
          photoAssetKeys: luxuryPhotoAssetKeys,
          template: luxuryTemplate,
          audioAssetKey,
          transition: luxuryTransition,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLuxuryError(String(data.error || "Failed to start luxury reel job."))
        return
      }

      const jobId = String(data.jobId || "")
      if (!jobId) {
        setLuxuryError("Job created but no job ID was returned.")
        return
      }

      setLuxuryJob({
        jobId,
        mode: "pro",
        status: "queued",
        progress: 0,
        logs: "Queued",
        outputUrl: null,
        thumbnailUrl: null,
        error: null,
      })

      startLuxuryPolling(jobId)
      await refreshBalance()
    } catch (error) {
      setLuxuryError(error instanceof Error ? error.message : "Generation failed")
    } finally {
      setLuxuryGenerating(false)
    }
  }, [
    luxuryFramePlan,
    luxuryPhotoAssetKeys,
    luxuryTemplate,
    luxuryTransition,
    luxuryAudioFile,
    user,
    tokenBalance,
    uploadAsset,
    startLuxuryPolling,
    refreshBalance,
    router,
  ])

  return (
    <div className="max-w-3xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">Instagram Reel Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Reels</h1>
            <p className="text-gray-500">Create AI reel frames or produce full Basic/Pro reel edits with uploads, motion graphics, and async cloud jobs.</p>
          </div>

          <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl max-w-lg">
            <button
              onClick={() => setMode("edit")}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${mode === "edit" ? "bg-teal-400/10 text-teal-400 border border-teal-400/20" : "text-gray-500 hover:text-gray-300"}`}
            >
              Edit Clips
            </button>
            <button
              onClick={() => setMode("ai")}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${mode === "ai" ? "bg-teal-400/10 text-teal-400 border border-teal-400/20" : "text-gray-500 hover:text-gray-300"}`}
            >
              AI Frames
            </button>
            <button
              onClick={() => setMode("luxury")}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${mode === "luxury" ? "bg-amber-400/10 text-amber-300 border border-amber-400/20" : "text-gray-500 hover:text-gray-300"}`}
            >
              Luxury Reel
            </button>
          </div>

          {mode === "edit" && (
            <div className="space-y-6">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white">Reel Editor</h2>
                    <p className="text-sm text-gray-400">Upload clips and get a fully edited reel with async progress tracking.</p>
                  </div>
                  <ReelCostBadge tier={editTier} />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditTier("basic")}
                    className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                      editTier === "basic"
                        ? "border-teal-400/40 bg-teal-400/10 text-teal-400"
                        : "border-white/[0.08] text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Basic Edit (2 tokens)
                  </button>
                  <button
                    onClick={() => setEditTier("pro")}
                    className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                      editTier === "pro"
                        ? "border-teal-400/40 bg-teal-400/10 text-teal-400"
                        : "border-white/[0.08] text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Pro Reel Edit (8 tokens)
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setInputMode("clips")}
                    className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                      inputMode === "clips"
                        ? "border-teal-400/40 bg-teal-400/10 text-teal-400"
                        : "border-white/[0.08] text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Uploaded clips
                  </button>
                  <button
                    onClick={() => setInputMode("video")}
                    className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                      inputMode === "video"
                        ? "border-teal-400/40 bg-teal-400/10 text-teal-400"
                        : "border-white/[0.08] text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Single uploaded video
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {inputMode === "clips" ? (
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-500 mb-2">Clip uploads (multiple)</label>
                      <input
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={(e) => setClipFiles(Array.from(e.target.files || []))}
                        className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {clipFiles.length} clip(s) selected. Files above 50MB are auto-uploaded in chunks.
                      </p>
                    </div>
                  ) : (
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-500 mb-2">Single video upload</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setSingleVideoFile(e.target.files?.[0] || null)}
                        className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {singleVideoFile ? singleVideoFile.name : "No file selected"}.
                        {" "}Files above 50MB are auto-uploaded in chunks.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-gray-500 mb-2">Audio upload (optional)</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">{audioFile ? audioFile.name : "No file selected"}</p>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2">Transition style</label>
                    <select
                      value={transitionStyle}
                      onChange={(e) => setTransitionStyle(e.target.value as TransitionStyle)}
                      className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-white"
                    >
                      <option value="random">random</option>
                      <option value="crossfade">crossfade</option>
                      <option value="wipe">wipe</option>
                      <option value="slide">slide</option>
                      <option value="zoom">zoom</option>
                      <option value="dissolve">dissolve</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2">Speed</label>
                    <input
                      type="number"
                      min={0.5}
                      max={3}
                      step={0.05}
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value || 1.1))}
                      className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2">Duration (seconds)</label>
                    <input
                      type="number"
                      min={5}
                      max={300}
                      step={1}
                      value={durationSec}
                      onChange={(e) => setDurationSec(Number(e.target.value || 30))}
                      className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-white"
                    />
                  </div>

                  <label className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.01] px-3 py-2.5 text-xs text-gray-400">
                    VAD silence removal
                    <input type="checkbox" checked={useVad} onChange={(e) => setUseVad(e.target.checked)} className="h-4 w-4 accent-teal-400" />
                  </label>

                  <label className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.01] px-3 py-2.5 text-xs text-gray-400">
                    Beat sync
                    <input type="checkbox" checked={beatSync} onChange={(e) => setBeatSync(e.target.checked)} className="h-4 w-4 accent-teal-400" />
                  </label>
                </div>

                {editTier === "pro" && (
                  <div className="border-t border-white/[0.08] pt-5 grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Motion pack</label>
                      <select
                        value={motionPack}
                        onChange={(e) => setMotionPack(e.target.value as MotionPack)}
                        className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-white"
                      >
                        <option value="full">full</option>
                        <option value="balanced">balanced</option>
                        <option value="minimal">minimal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Style preset</label>
                      <select
                        value={stylePreset}
                        onChange={(e) => setStylePreset(e.target.value as StylePreset)}
                        className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-white"
                      >
                        <option value="clean">clean</option>
                        <option value="minimal">minimal</option>
                        <option value="bold">bold</option>
                        <option value="dark">dark</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Caption mode</label>
                      <select
                        value={captionMode}
                        onChange={(e) => setCaptionMode(e.target.value as CaptionMode)}
                        className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-white"
                      >
                        <option value="auto">auto transcribe</option>
                        <option value="srt">SRT file</option>
                        <option value="none">none</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-2">CTA text</label>
                      <input
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-white"
                        placeholder="Follow for more"
                      />
                    </div>

                    {captionMode === "srt" && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-gray-500 mb-2">Caption SRT upload</label>
                        <input
                          type="file"
                          accept=".srt,text/plain"
                          onChange={(e) => setCaptionFile(e.target.files?.[0] || null)}
                          className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-gray-200"
                        />
                        <p className="text-xs text-gray-500 mt-1">{captionFile ? captionFile.name : "No file selected"}</p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleRunEdit}
                  disabled={editing || uploading}
                  className="w-full py-3 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {editing || uploading ? (
                    <>
                      <Spinner className="w-4 h-4" />
                      {uploading ? "Uploading assets..." : "Queueing reel job..."}
                    </>
                  ) : (
                    <>Run {editTier === "pro" ? "Pro" : "Basic"} Reel Edit ({editTokenCost} tokens)</>
                  )}
                </button>

                {editError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {editError}
                  </div>
                )}
              </div>

              {job && (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-teal-300 font-semibold">Job {job.jobId.slice(0, 8)}...</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{job.status}</p>
                  </div>

                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-teal-400 transition-all" style={{ width: `${Math.max(0, Math.min(100, job.progress))}%` }} />
                  </div>

                  <p className="text-xs text-gray-400">Progress: {Math.round(job.progress)}%</p>

                  {job.error ? <p className="text-xs text-red-400">{job.error}</p> : null}

                  {job.outputUrl ? (
                    <div className="space-y-3">
                      <video
                        src={job.outputUrl}
                        controls
                        className="w-full rounded-xl border border-white/[0.08] bg-black"
                      />
                      <div className="flex gap-3">
                        <a
                          href={job.outputUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-teal-300 hover:text-teal-200"
                        >
                          Open output file
                        </a>
                        <button
                          onClick={() => handleDownload(job.outputUrl as string, `reel-${job.jobId}.mp4`)}
                          className="text-sm text-teal-300 hover:text-teal-200"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {job.logs ? (
                    <details className="text-xs text-gray-300">
                      <summary className="cursor-pointer text-gray-400 hover:text-gray-200">View job logs</summary>
                      <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-black/40 border border-white/[0.06] p-3 text-[11px] leading-relaxed">
                        {job.logs}
                      </pre>
                    </details>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {mode === "ai" && (
            <div className="grid lg:grid-cols-[380px_1fr] gap-8">
              <div className="space-y-5">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">Reel Topic</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50"
                    placeholder="5 office design trends for 2025..."
                  />
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Vibe Motion</p>
                      <p className="text-xs text-gray-500 mt-0.5">Ken Burns zoom/pan + dynamic transitions</p>
                    </div>
                    <button
                      onClick={() => setVibeMotion(!vibeMotion)}
                      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${vibeMotion ? "bg-teal-400" : "bg-white/10"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${vibeMotion ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-4 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Cost</span>
                  <span className="text-sm font-semibold text-white">{AI_TOKEN_COST} tokens</span>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating || !topic.trim()}
                  className="w-full py-4 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {generating ? (
                    <>
                      <Spinner />
                      Generating 7 frames...
                    </>
                  ) : (
                    <>Generate Reel Frames ({AI_TOKEN_COST} tokens)</>
                  )}
                </button>

                {aiError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {aiError}
                  </div>
                )}
              </div>

              <div className="min-h-[400px]">
                {slides.length === 0 && !generating ? (
                  <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
                    <div className="text-center px-8 py-16">
                      <p className="text-gray-500 font-medium mb-1">No frames yet</p>
                      <p className="text-gray-600 text-sm">Enter a topic and generate your reel frames.</p>
                    </div>
                  </div>
                ) : generating ? (
                  <div className="h-full flex items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                    <div className="text-center px-8 py-16">
                      <Spinner className="w-7 h-7 text-teal-400 mx-auto mb-4" />
                      <p className="text-white font-medium mb-1">Generating with Flux Pro</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {slides.map((slide, i) => (
                        <div key={i} className="group relative rounded-xl overflow-hidden border border-white/[0.08] bg-black/40 cursor-pointer" onClick={() => setSelectedSlide(slide.imageUrl)}>
                          <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                            <img src={slide.imageUrl} alt={`Reel frame ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                            <span className="text-xs text-white/80 font-medium">Frame {i + 1}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                void handleDownload(slide.imageUrl, `reel-frame-${i + 1}.webp`)
                              }}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
                            >
                              ⬇
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {mode === "luxury" && (
            <div className="space-y-6">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-white">Luxury Reel</h2>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 font-semibold">Higgsfield AI</span>
                    </div>
                    <p className="text-sm text-gray-400">Upload your client photos → AI builds a frame plan → Higgsfield animates each shot into a cinematic clip.</p>
                  </div>
                  <span className="text-xs text-amber-300 font-semibold">{LUXURY_TOKEN_COST} tokens</span>
                </div>

                {/* Step 1: Photo upload + options */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Step 1 — Upload Photos</p>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2">Client photos (up to 12 JPG/PNG)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => setLuxuryPhotoFiles(Array.from(e.target.files || []))}
                      className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">{luxuryPhotoFiles.length} photo(s) selected</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Reel topic (optional — AI derives from photos if blank)</label>
                      <input
                        value={luxuryTopic}
                        onChange={(e) => setLuxuryTopic(e.target.value)}
                        className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-white placeholder-gray-600"
                        placeholder="e.g. Why your office is losing talent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Visual template</label>
                      <select
                        value={luxuryTemplate}
                        onChange={(e) => setLuxuryTemplate(e.target.value)}
                        className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-white"
                      >
                        {LUXURY_TEMPLATES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleLuxuryAnalyse}
                    disabled={luxuryAnalysing || luxuryPhotoFiles.length === 0}
                    className="w-full py-3 rounded-xl font-semibold bg-white/[0.06] border border-white/[0.1] text-white hover:bg-white/[0.1] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {luxuryAnalysing ? (
                      <>
                        <Spinner className="w-4 h-4" />
                        {luxuryUploading ? "Uploading photos..." : "Analysing with Claude Vision..."}
                      </>
                    ) : (
                      "Analyse Photos → Get Frame Plan (free)"
                    )}
                  </button>
                </div>

                {luxuryError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {luxuryError}
                  </div>
                )}
              </div>

              {/* Step 2: Frame plan review */}
              {luxuryFramePlan && (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Step 2 — Review Frame Plan</p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Reel concept</p>
                        <p className="text-sm font-semibold text-white">{luxuryFramePlan.reel_concept.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{luxuryFramePlan.reel_concept.hook_angle}</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Style</p>
                        <p className="text-sm font-semibold text-white">{luxuryFramePlan.style_analysis.mood}</p>
                        <p className="text-xs text-gray-400 mt-1">{luxuryFramePlan.style_analysis.palette}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-5">
                      {luxuryFramePlan.frame_plan.map((frame) => (
                        <div key={frame.slide} className="flex gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                          <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-amber-300">{frame.slide}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs text-gray-500 uppercase">{frame.type}</span>
                              <span className="text-xs text-gray-600">·</span>
                              <span className="text-xs text-gray-500">{frame.camera_movement}</span>
                            </div>
                            <p className="text-sm text-white font-medium truncate">{frame.on_screen_text}</p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{frame.source_image}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Audio (optional)</label>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => setLuxuryAudioFile(e.target.files?.[0] || null)}
                          className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-gray-200"
                        />
                        <p className="text-xs text-gray-500 mt-1">{luxuryAudioFile ? luxuryAudioFile.name : "No file selected"}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Clip transition</label>
                        <select
                          value={luxuryTransition}
                          onChange={(e) => setLuxuryTransition(e.target.value)}
                          className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-sm text-white"
                        >
                          <option value="crossfade">crossfade</option>
                          <option value="wipe">wipe</option>
                          <option value="slide">slide</option>
                          <option value="zoom">zoom</option>
                          <option value="dissolve">dissolve</option>
                          <option value="random">random</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleLuxuryGenerate}
                      disabled={luxuryGenerating}
                      className="w-full py-3 rounded-xl font-semibold bg-amber-400 text-black hover:bg-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {luxuryGenerating ? (
                        <>
                          <Spinner className="w-4 h-4" />
                          Queueing luxury reel job...
                        </>
                      ) : (
                        <>Generate Luxury Reel ({LUXURY_TOKEN_COST} tokens)</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Job progress */}
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
                    <p className="text-xs text-gray-500">Animating clips with Higgsfield AI — this typically takes 5–15 minutes.</p>
                  )}

                  {luxuryJob.error ? <p className="text-xs text-red-400">{luxuryJob.error}</p> : null}

                  {luxuryJob.outputUrl ? (
                    <div className="space-y-3">
                      <video
                        src={luxuryJob.outputUrl}
                        controls
                        className="w-full rounded-xl border border-white/[0.08] bg-black"
                      />
                      <div className="flex gap-3">
                        <a href={luxuryJob.outputUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-300 hover:text-amber-200">
                          Open output file
                        </a>
                        <button
                          onClick={() => handleDownload(luxuryJob.outputUrl as string, `luxury-reel-${luxuryJob.jobId}.mp4`)}
                          className="text-sm text-amber-300 hover:text-amber-200"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {luxuryJob.logs ? (
                    <details className="text-xs text-gray-300">
                      <summary className="cursor-pointer text-gray-400 hover:text-gray-200">View job logs</summary>
                      <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-black/40 border border-white/[0.06] p-3 text-[11px] leading-relaxed">
                        {luxuryJob.logs}
                      </pre>
                    </details>
                  ) : null}
                </div>
              )}
            </div>
          )}

      {selectedSlide && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-8" onClick={() => setSelectedSlide(null)}>
          <button onClick={() => setSelectedSlide(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white">✕</button>
          <div className="relative max-h-full" style={{ aspectRatio: "9/16", maxHeight: "calc(100vh - 8rem)" }}>
            <img src={selectedSlide} alt="Reel frame full size" className="w-full h-full object-cover rounded-xl" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  )
}
