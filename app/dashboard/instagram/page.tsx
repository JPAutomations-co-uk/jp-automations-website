"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import UserMenu from "@/app/components/UserMenu"
import { AppsDropdown, AppsMobileLinks } from "@/app/components/AppsDropdown"
import { createClient as createBrowserSupabaseClient } from "@/app/lib/supabase/client"
import PlannerPanel from "./PlannerPanel"

/* ── Types ── */
type ContentType = "single_image" | "carousel" | "caption" | "reel_script" | "post_copy" | "edit" | "plan"
type CaptionGoal = "engagement" | "leads" | "authority" | "saves" | "shares" | "traffic"
type CaptionFramework = "auto" | "pas" | "hook_story_lesson" | "myth_vs_reality" | "step_by_step" | "hot_take"
type HookStyle = "bold_claim" | "question" | "statistic" | "controversial" | "story"
type PostFormat = "reel" | "carousel" | "image" | "story"
type ToneOption = "casual" | "educational" | "inspirational" | "provocative"

interface GeneratedImage { imageUrl: string; index?: number }
interface GeneratedCaption {
  hook: string; body: string; cta: string
  hashtags: string[]; keywords: string[]; full_caption: string
  seo_score: number; seo_tips: string[]
}
interface GeneratedReelSlide {
  slide: number; type: string
  on_screen_text: string; visual_summary: string; scene_description: string
}
interface GeneratedPostCopyVariation {
  style: string; hook: string; body: string; cta: string
  full_caption: string; hashtags?: string[]
}
type EditJobStatus = "queued" | "processing" | "completed" | "failed"
interface EditJob {
  jobId: string; status: EditJobStatus; progress: number
  logs: string; outputUrl: string | null; error: string | null
}
type UploadSpec = { bucket: string; assetKey: string; token: string }
type ChunkManifest = {
  type: "chunked-asset-v1"; originalName: string; originalMimeType: string
  originalSizeBytes: number; chunkSizeBytes: number; partAssetKeys: string[]
}
const EDIT_TOKEN_COST = 2
function inferMimeType(file: File): string {
  if (file.type) return file.type
  const ext = file.name.split(".").pop()?.toLowerCase()
  const map: Record<string, string> = { mp4: "video/mp4", mov: "video/quicktime", webm: "video/webm", avi: "video/x-msvideo", mkv: "video/x-matroska", m4v: "video/mp4" }
  return map[ext || ""] || "application/octet-stream"
}
const SUPABASE_MAX_OBJECT_BYTES = 50 * 1024 * 1024
const CHUNK_UPLOAD_BYTES = 45 * 1024 * 1024

/* ── Visual Templates ── */
interface Template {
  id: string; name: string; description: string; accentColor: string
  fluxPrefix: string; lightingStyle: string
}

const TEMPLATES: Template[] = [
  { id: "dark_luxury", name: "Dark Luxury", description: "Moody, premium — warm gold on deep charcoal", accentColor: "#C9A96E",
    fluxPrefix: "dark luxury aesthetic, moody premium atmosphere, editorial sophistication, high-end architectural photography, cinematic depth",
    lightingStyle: "warm directional spotlighting, dramatic Rembrandt-style side lighting, deep shadow pools, golden accent highlights" },
  { id: "clean_minimal", name: "Clean Minimal", description: "Crisp white editorial, Scandinavian feel", accentColor: "#505050",
    fluxPrefix: "clean minimalist aesthetic, extensive negative space, editorial white photography, Scandinavian design influence, restrained sophistication",
    lightingStyle: "soft diffused natural light, north-facing window light, even ambient illumination, minimal harsh shadows" },
  { id: "bold_editorial", name: "Bold Editorial", description: "High-contrast, graphic, magazine energy", accentColor: "#FF4444",
    fluxPrefix: "bold editorial photography, high-contrast graphic composition, strong geometry, design-forward architectural photography, magazine cover energy",
    lightingStyle: "hard directional light, strong shadows, high contrast split lighting, graphic chiaroscuro effect" },
  { id: "warm_natural", name: "Warm Natural", description: "Earthy, biophilic — terracotta and oak", accentColor: "#B46E3C",
    fluxPrefix: "warm natural aesthetic, biophilic design photography, organic earthy warmth, natural textures and materials, lifestyle editorial photography",
    lightingStyle: "warm golden hour sunlight, soft diffused window light, dappled natural shadow, organic ambient warmth" },
  { id: "urban_industrial", name: "Urban Industrial", description: "Concrete, steel, dramatic tungsten light", accentColor: "#7A8A9A",
    fluxPrefix: "urban industrial aesthetic, raw concrete and exposed steel, dramatic architectural photography, brutalist grandeur, urban grit with design sophistication",
    lightingStyle: "dramatic tungsten spotlighting in dark spaces, shafts of daylight through industrial openings, stark contrast between lit and shadow zones" },
  { id: "bright_playful", name: "Bright Playful", description: "Vibrant, energetic, joyful colour", accentColor: "#FF9F43",
    fluxPrefix: "bright vibrant aesthetic, joyful high-energy photography, playful bold colour, lifestyle editorial with personality, optimistic modern design photography",
    lightingStyle: "bright even daylight, colourful bounced fill light, cheerful open shade, sun-drenched warmth" },
]

/* ── Constants ── */
const ASPECT_RATIOS = [
  { value: "1:1", label: "1:1", desc: "Square" },
  { value: "4:5", label: "4:5", desc: "Portrait" },
  { value: "9:16", label: "9:16", desc: "Story" },
  { value: "16:9", label: "16:9", desc: "Wide" },
]

const MOODS = ["Dramatic", "Warm", "Clean", "Moody", "Energetic", "Natural", "Elegant", "Bold"]

const CAROUSEL_GOALS = [
  { id: "educate", label: "Educate", desc: "Teach your audience something valuable" },
  { id: "promote", label: "Promote", desc: "Showcase a service or product" },
  { id: "inspire", label: "Inspire", desc: "Aspirational, portfolio-style" },
  { id: "showcase", label: "Showcase", desc: "Before/after or project highlights" },
]

const CAPTION_GOALS: { value: CaptionGoal; label: string }[] = [
  { value: "engagement", label: "Engagement" },
  { value: "leads", label: "Leads" },
  { value: "authority", label: "Authority" },
  { value: "saves", label: "Saves" },
  { value: "shares", label: "Shares" },
  { value: "traffic", label: "Traffic" },
]

const CAPTION_FRAMEWORKS: { value: CaptionFramework; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "pas", label: "PAS" },
  { value: "hook_story_lesson", label: "Hook\u2192Story" },
  { value: "myth_vs_reality", label: "Myth vs Reality" },
  { value: "step_by_step", label: "Step-by-Step" },
  { value: "hot_take", label: "Hot Take" },
]

const HOOK_STYLES: { value: HookStyle; label: string }[] = [
  { value: "bold_claim", label: "Bold Claim" },
  { value: "question", label: "Question" },
  { value: "statistic", label: "Statistic" },
  { value: "controversial", label: "Controversial" },
  { value: "story", label: "Story" },
]

const SLIDE_COUNTS = [
  { value: 5, label: "5 slides", desc: "Quick & punchy" },
  { value: 7, label: "7 slides", desc: "Standard reel" },
  { value: 10, label: "10 slides", desc: "Deep dive" },
]

const POST_FORMATS: { value: PostFormat; label: string }[] = [
  { value: "reel", label: "Reel" },
  { value: "carousel", label: "Carousel" },
  { value: "image", label: "Image" },
  { value: "story", label: "Story" },
]

const TONE_OPTIONS: { value: ToneOption; label: string }[] = [
  { value: "casual", label: "Casual" },
  { value: "educational", label: "Educational" },
  { value: "inspirational", label: "Inspirational" },
  { value: "provocative", label: "Provocative" },
]

const CONTENT_TYPES = [
  { id: "single_image" as ContentType, label: "Image", tokens: 5,
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg> },
  { id: "carousel" as ContentType, label: "Carousel", tokens: 10,
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" /></svg> },
  { id: "caption" as ContentType, label: "Caption", tokens: 5,
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg> },
  { id: "reel_script" as ContentType, label: "Reel Script", tokens: 8,
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v12.75c0 .621-.504 1.125-1.125 1.125m-17.25 0h14.25" /></svg> },
  { id: "post_copy" as ContentType, label: "Post Copy", tokens: 5,
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg> },
  { id: "edit" as ContentType, label: "Edit", tokens: 2,
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg> },
  { id: "plan" as ContentType, label: "Plan", tokens: 25,
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg> },
]

const NAV_ITEMS = [
  { label: "Generate", href: "/dashboard/instagram", active: true },
  { label: "Captions", href: "/dashboard/instagram/captions" },
  { label: "Ads", href: "/dashboard/instagram/ads" },
  { label: "Reels", href: "/dashboard/instagram/reels" },
]

/* ── Prompt Assembly ── */

function buildImagePrompt(subject: string, scene: string, mood: string, template: Template | null): string {
  const parts: string[] = []
  if (template) parts.push(template.fluxPrefix)
  parts.push(subject.trim())
  if (scene.trim()) parts.push(scene.trim())
  if (mood) parts.push(`${mood.toLowerCase()} atmosphere`)
  if (template) parts.push(template.lightingStyle)
  parts.push("professional photography, photorealistic, high resolution")
  return parts.join(", ")
}

function buildCarouselPrompts(topic: string, industry: string, goal: string, template: Template | null): string[] {
  const style = template?.fluxPrefix ?? "professional editorial photography"
  const lighting = template?.lightingStyle ?? "natural lighting, professional photography"
  const ctx = industry ? ` for ${industry}` : ""

  const goalAngles: Record<string, string[]> = {
    educate: [
      `Cover slide: bold, eye-catching photography of ${topic}${ctx}, ${lighting}, 4:5 portrait`,
      `Educational infographic-style scene about ${topic}${ctx}: clean composition, ${lighting}`,
      `Step-by-step concept for ${topic}${ctx}: clear instructional layout, ${lighting}`,
      `Key insight about ${topic}${ctx}: close-up detail showing important element, ${lighting}`,
      `Common mistake related to ${topic}${ctx}: contrasting good vs bad approach, ${lighting}`,
      `Expert tip about ${topic}${ctx}: behind-the-scenes professional context, ${lighting}`,
      `Summary and call-to-action for ${topic}${ctx}: clean aspirational hero shot, ${lighting}`,
    ],
    promote: [
      `Cover slide: stunning hero photography of ${topic}${ctx}, premium quality, ${lighting}, 4:5 portrait`,
      `Key benefit of ${topic}${ctx}: showing transformation or result, ${lighting}`,
      `Social proof concept for ${topic}${ctx}: testimonial-worthy scene, warm and trustworthy, ${lighting}`,
      `Feature highlight of ${topic}${ctx}: detailed close-up of standout quality, ${lighting}`,
      `Process overview of ${topic}${ctx}: behind-the-scenes professional workflow, ${lighting}`,
      `Value comparison for ${topic}${ctx}: premium positioning, side-by-side quality, ${lighting}`,
      `Call-to-action for ${topic}${ctx}: aspirational lifestyle shot showing end result, ${lighting}`,
    ],
    inspire: [
      `Cover slide: breathtaking aspirational photography of ${topic}${ctx}, dramatic composition, ${lighting}, 4:5 portrait`,
      `Portfolio showcase of ${topic}${ctx}: stunning finished result from wide angle, ${lighting}`,
      `Detailed craftsmanship in ${topic}${ctx}: extreme close-up of premium materials and finishes, ${lighting}`,
      `Lifestyle moment with ${topic}${ctx}: people enjoying the end result, golden hour, ${lighting}`,
      `Architectural detail of ${topic}${ctx}: design-forward perspective, leading lines, ${lighting}`,
      `Atmosphere and mood in ${topic}${ctx}: environmental wide shot capturing the full experience, ${lighting}`,
      `Vision statement for ${topic}${ctx}: dramatic final hero shot, cinematic composition, ${lighting}`,
    ],
    showcase: [
      `Cover slide: striking before-and-after reveal of ${topic}${ctx}, dramatic comparison, ${lighting}, 4:5 portrait`,
      `Before state of ${topic}${ctx}: honest documentation of starting condition, natural light`,
      `During transformation of ${topic}${ctx}: action shot showing work in progress, ${lighting}`,
      `Key detail improvement in ${topic}${ctx}: close-up comparing old vs new quality, ${lighting}`,
      `After state wide shot of ${topic}${ctx}: stunning completed result, full room reveal, ${lighting}`,
      `After state detail of ${topic}${ctx}: close-up of finest finishing touches, ${lighting}`,
      `Final hero shot of ${topic}${ctx}: the completed transformation in its best light, ${lighting}`,
    ],
  }

  const angles = goalAngles[goal] ?? goalAngles.educate
  return angles.map((angle) => `${style}, ${angle}`)
}

/* ── Component ── */

export default function InstagramAppPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()

  const [contentType, setContentType] = useState<ContentType>("single_image")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const [subject, setSubject] = useState("")
  const [scene, setScene] = useState("")
  const [mood, setMood] = useState("")
  const [aspectRatio, setAspectRatio] = useState("1:1")

  const [topic, setTopic] = useState("")
  const [industry, setIndustry] = useState("")
  const [carouselGoal, setCarouselGoal] = useState("educate")

  const [captionStep, setCaptionStep] = useState<1 | 2 | 3>(1)
  const [captionHasScript, setCaptionHasScript] = useState<boolean | null>(null)
  const [captionContent, setCaptionContent] = useState("")
  const [captionHasKeywords, setCaptionHasKeywords] = useState<boolean | null>(null)
  const [captionKeywords, setCaptionKeywords] = useState("")
  const [captionGoal, setCaptionGoal] = useState<CaptionGoal>("engagement")
  const [captionFramework, setCaptionFramework] = useState<CaptionFramework>("auto")
  const [captions, setCaptions] = useState<GeneratedCaption[]>([])
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  // Reel Script state
  const [reelStep, setReelStep] = useState<1 | 2 | 3 | 4>(1)
  const [reelTopic, setReelTopic] = useState("")
  const [reelSlideCount, setReelSlideCount] = useState<5 | 7 | 10>(7)
  const [reelHookStyle, setReelHookStyle] = useState<HookStyle>("bold_claim")
  const [reelAudience, setReelAudience] = useState("")
  const [reelTakeaway, setReelTakeaway] = useState("")
  const [reelSlides, setReelSlides] = useState<GeneratedReelSlide[]>([])

  // Post Copy state
  const [copyStep, setCopyStep] = useState<1 | 2 | 3 | 4>(1)
  const [copyHasScript, setCopyHasScript] = useState<boolean | null>(null)
  const [copyContent, setCopyContent] = useState("")
  const [copyFormat, setCopyFormat] = useState<PostFormat>("reel")
  const [copyTones, setCopyTones] = useState<ToneOption[]>(["casual", "educational", "inspirational"])
  const [copyIncludeHashtags, setCopyIncludeHashtags] = useState<boolean | null>(null)
  const [copyBrandTerms, setCopyBrandTerms] = useState("")
  const [copyVariations, setCopyVariations] = useState<GeneratedPostCopyVariation[]>([])

  // Edit state
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null)
  const [editIsDragging, setEditIsDragging] = useState(false)
  const [editUseVad, setEditUseVad] = useState(true)
  const [editSpeed, setEditSpeed] = useState(1.0)
  const [editUploading, setEditUploading] = useState(false)
  const [editJob, setEditJob] = useState<EditJob | null>(null)

  const supabase = useMemo(() => createBrowserSupabaseClient(), [])
  const editFileInputRef = useRef<HTMLInputElement>(null)
  const editPollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const subjectRef = useRef<HTMLInputElement>(null)
  const topicRef = useRef<HTMLInputElement>(null)
  const captionTextRef = useRef<HTMLTextAreaElement>(null)
  const reelTopicRef = useRef<HTMLTextAreaElement>(null)
  const copyTextRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!generating) { setElapsed(0); return }
    const t = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(t)
  }, [generating])

  // Edit: cleanup polling on unmount
  const stopEditPolling = useCallback(() => {
    if (editPollRef.current) { clearInterval(editPollRef.current); editPollRef.current = null }
  }, [])
  useEffect(() => () => stopEditPolling(), [stopEditPolling])

  // Edit: upload helpers
  const requestUploadUrl = useCallback(async (filename: string, mimeType: string): Promise<UploadSpec> => {
    const res = await fetch("/api/media/upload-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename, mimeType: mimeType || "application/octet-stream" }) })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(String(data.error || "Failed to create upload URL"))
    return { bucket: String(data.bucket || ""), assetKey: String(data.assetKey || ""), token: String(data.token || "") }
  }, [])

  const uploadBlobToSignedUrl = useCallback(async (spec: UploadSpec, payload: Blob): Promise<void> => {
    const storage = supabase.storage.from(spec.bucket) as any
    const { error: uploadErr } = await storage.uploadToSignedUrl(spec.assetKey, spec.token, payload)
    if (uploadErr) {
      const msg = String(uploadErr.message || uploadErr || "Upload failed")
      throw new Error(msg.includes("exceeded the maximum allowed size") ? "File or chunk exceeded 50MB limit. Try a shorter video." : msg)
    }
  }, [supabase])

  const uploadAsset = useCallback(async (file: File): Promise<string> => {
    const mime = inferMimeType(file)
    if (file.size <= SUPABASE_MAX_OBJECT_BYTES) {
      const spec = await requestUploadUrl(file.name, mime)
      await uploadBlobToSignedUrl(spec, file)
      return spec.assetKey
    }
    const chunkCount = Math.ceil(file.size / CHUNK_UPLOAD_BYTES)
    const partAssetKeys: string[] = []
    for (let i = 0; i < chunkCount; i++) {
      const start = i * CHUNK_UPLOAD_BYTES
      const partBlob = file.slice(start, Math.min(file.size, start + CHUNK_UPLOAD_BYTES), "application/octet-stream")
      const partSpec = await requestUploadUrl(`${file.name}.part-${String(i + 1).padStart(4, "0")}-of-${String(chunkCount).padStart(4, "0")}.bin`, "application/octet-stream")
      await uploadBlobToSignedUrl(partSpec, partBlob)
      partAssetKeys.push(partSpec.assetKey)
    }
    const manifest: ChunkManifest = { type: "chunked-asset-v1", originalName: file.name, originalMimeType: mime, originalSizeBytes: file.size, chunkSizeBytes: CHUNK_UPLOAD_BYTES, partAssetKeys }
    const manifestSpec = await requestUploadUrl(`${file.name}.chunks.json`, "application/json")
    await uploadBlobToSignedUrl(manifestSpec, new Blob([JSON.stringify(manifest)], { type: "application/json" }))
    return manifestSpec.assetKey
  }, [requestUploadUrl, uploadBlobToSignedUrl])

  // Edit: job polling
  const pollEditJob = useCallback(async (jobId: string) => {
    try {
      const res = await fetch(`/api/generate/reel-edit/${jobId}`, { cache: "no-store" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(String(data.error || "Failed to fetch job status.")); stopEditPolling(); return }
      const status = String(data.status || "queued") as EditJobStatus
      setEditJob({ jobId, status, progress: Number(data.progress || 0), logs: String(data.logs || ""), outputUrl: data.outputUrl ? String(data.outputUrl) : null, error: data.error ? String(data.error) : null })
      if (status === "completed" || status === "failed") { stopEditPolling(); await refreshBalance() }
    } catch { setError("Failed to poll job status."); stopEditPolling() }
  }, [refreshBalance, stopEditPolling])

  const startEditPolling = useCallback((jobId: string) => {
    stopEditPolling()
    void pollEditJob(jobId)
    editPollRef.current = setInterval(() => void pollEditJob(jobId), 2500)
  }, [pollEditJob, stopEditPolling])

  // Edit: file handlers
  const handleEditFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    const mime = inferMimeType(file)
    if (!mime.startsWith("video/")) { setError("Please upload a video file."); return }
    setEditVideoFile(file); setError(""); setEditJob(null)
  }, [])

  const handleEditDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setEditIsDragging(false); handleEditFileSelect(e.dataTransfer.files) }, [handleEditFileSelect])

  // Edit: submit handler
  const handleEditSubmit = useCallback(async () => {
    if (!editVideoFile) { setError("Please upload a video file."); return }
    if (!user) { router.push("/login?redirect=/dashboard/instagram"); return }
    if (tokenBalance < EDIT_TOKEN_COST) { setError(`Insufficient tokens. You need ${EDIT_TOKEN_COST} but have ${tokenBalance}.`); return }

    setError(""); setEditJob(null); setEditUploading(true); setGenerating(true)
    try {
      const videoAssetKey = await uploadAsset(editVideoFile)
      setEditUploading(false)
      const res = await fetch("/api/generate/reel-edit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "basic",
          input: { clipAssetKeys: [], singleVideoAssetKey: videoAssetKey, audioAssetKey: null },
          options: { durationSec: 300, speed: editSpeed, vad: editUseVad, beatSync: false, transitionStyle: "crossfade", motionPack: "minimal", captionMode: "none", captionAssetKey: null, stylePreset: "clean", ctaText: null },
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(String(data.error || "Failed to start edit job.")); return }
      const jobId = String(data.jobId || "")
      if (!jobId) { setError("Job created but no job ID returned."); return }
      setEditJob({ jobId, status: "queued", progress: 0, logs: "Queued", outputUrl: null, error: null })
      startEditPolling(jobId)
      await refreshBalance()
    } catch (err) { setError(err instanceof Error ? err.message : "Upload or job creation failed") }
    finally { setEditUploading(false); setGenerating(false) }
  }, [editVideoFile, user, tokenBalance, editSpeed, editUseVad, uploadAsset, startEditPolling, refreshBalance, router])

  const handleEditDownload = useCallback(async (url: string, filename: string) => {
    try { const res = await fetch(url); const blob = await res.blob(); const blobUrl = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = blobUrl; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(blobUrl) }
    catch { window.open(url, "_blank") }
  }, [])

  const editFileSizeMB = editVideoFile ? editVideoFile.size / (1024 * 1024) : 0
  const editFileMins = Math.max(1, Math.ceil((editFileSizeMB / 50 + editFileSizeMB / 30) / 60))
  const editFileEstimate = editVideoFile ? (editFileMins <= 1 ? "~1 min" : "~" + editFileMins + " mins") : ""
  const cost = contentType === "single_image" ? 5 : contentType === "carousel" ? 10 : contentType === "reel_script" ? 8 : contentType === "post_copy" ? 5 : contentType === "edit" ? EDIT_TOKEN_COST : 5
  const isFormValid =
    contentType === "single_image" ? subject.trim().length > 0
    : contentType === "carousel" ? topic.trim().length > 0
    : contentType === "reel_script" ? reelTopic.trim().length > 0 && reelStep === 4
    : contentType === "post_copy" ? copyContent.trim().length > 0 && copyStep === 4
    : contentType === "edit" ? editVideoFile !== null
    : captionContent.trim().length > 0 && captionStep === 3

  const captionStepValid = useMemo(() => {
    switch (captionStep) {
      case 1: return captionHasScript !== null && captionContent.trim().length > 0
      case 2: return captionHasKeywords !== null && (captionHasKeywords === false || captionKeywords.trim().length > 0)
      case 3: return true
      default: return false
    }
  }, [captionStep, captionHasScript, captionContent, captionHasKeywords, captionKeywords])

  const reelStepValid = useMemo(() => {
    switch (reelStep) {
      case 1: return reelTopic.trim().length > 0
      case 2: return true
      case 3: return true
      case 4: return true
      default: return false
    }
  }, [reelStep, reelTopic])

  const copyStepValid = useMemo(() => {
    switch (copyStep) {
      case 1: return copyHasScript !== null && copyContent.trim().length > 0
      case 2: return copyTones.length > 0
      case 3: return copyIncludeHashtags !== null
      case 4: return true
      default: return false
    }
  }, [copyStep, copyHasScript, copyContent, copyTones, copyIncludeHashtags])

  const handleGenerate = useCallback(async () => {
    if (contentType === "edit") { handleEditSubmit(); return }
    if (!isFormValid) return
    if (!user) { router.push("/login?redirect=/dashboard/instagram"); return }
    if (tokenBalance < cost) { setError(`Not enough tokens. You need ${cost} but have ${tokenBalance}.`); return }

    setGenerating(true)
    setError("")
    setImages([])
    setCaptions([])
    setReelSlides([])
    setCopyVariations([])
    setCopiedIdx(null)

    try {
      if (contentType === "single_image") {
        const prompt = buildImagePrompt(subject, scene, mood, selectedTemplate)
        const res = await fetch("/api/generate/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, aspectRatio }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || "Generation failed"); return }
        setImages([{ imageUrl: data.imageUrl }])
        refreshBalance()
      } else if (contentType === "carousel") {
        const slidePrompts = buildCarouselPrompts(topic, industry, carouselGoal, selectedTemplate)
        const res = await fetch("/api/generate/carousel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: topic.trim(), slidePrompts }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || "Generation failed"); return }
        const successful = data.slides
          .filter((s: { status: string; imageUrl: string | null }) => s.status === "success" && s.imageUrl)
          .map((s: { imageUrl: string; index: number }) => ({ imageUrl: s.imageUrl, index: s.index }))
        setImages(successful)
        refreshBalance()
        if (data.successCount < data.totalSlides) {
          setError(`${data.successCount}/${data.totalSlides} slides generated. Some failed.`)
        }
      } else if (contentType === "reel_script") {
        const res = await fetch("/api/generate/reel-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: reelTopic.trim(),
            slideCount: reelSlideCount,
            hookStyle: reelHookStyle,
            audience: reelAudience.trim() || undefined,
            takeaway: reelTakeaway.trim() || undefined,
          }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || "Generation failed"); return }
        setReelSlides(Array.isArray(data.slides) ? data.slides : [])
        refreshBalance()
      } else if (contentType === "post_copy") {
        const res = await fetch("/api/generate/post-copy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: copyContent.trim(),
            postFormat: copyFormat,
            tones: copyTones,
            includeHashtags: copyIncludeHashtags === true,
            brandTerms: copyBrandTerms.trim() || undefined,
          }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || "Generation failed"); return }
        setCopyVariations(Array.isArray(data.variations) ? data.variations : [])
        refreshBalance()
      } else {
        const wizardContent = captionHasKeywords && captionKeywords.trim()
          ? `${captionContent.trim()}\n\nTarget SEO keywords: ${captionKeywords.trim()}`
          : captionContent.trim()
        const res = await fetch("/api/generate/caption", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "single", content: wizardContent, goal: captionGoal, framework: captionFramework }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || "Generation failed"); return }
        setCaptions(Array.isArray(data.captions) ? data.captions : [data.captions])
        refreshBalance()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setGenerating(false)
    }
  }, [isFormValid, user, tokenBalance, cost, contentType, subject, scene, mood, selectedTemplate, aspectRatio, topic, industry, carouselGoal, captionContent, captionHasKeywords, captionKeywords, captionGoal, captionFramework, reelTopic, reelSlideCount, reelHookStyle, reelAudience, reelTakeaway, copyContent, copyFormat, copyTones, copyIncludeHashtags, copyBrandTerms, refreshBalance, router, handleEditSubmit])

  const handleDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = blobUrl; a.download = filename
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(blobUrl)
    } catch { window.open(url, "_blank") }
  }

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    } catch { setError("Failed to copy to clipboard.") }
  }

  const resetForm = () => {
    setImages([]); setCaptions([]); setReelSlides([]); setCopyVariations([]); setError("")
    setSubject(""); setScene(""); setMood("")
    setTopic(""); setIndustry("")
    setCaptionContent(""); setCaptionStep(1); setCaptionHasScript(null)
    setCaptionHasKeywords(null); setCaptionKeywords("")
    setReelTopic(""); setReelStep(1); setReelSlideCount(7)
    setReelHookStyle("bold_claim"); setReelAudience(""); setReelTakeaway("")
    setCopyContent(""); setCopyStep(1); setCopyHasScript(null)
    setCopyFormat("reel"); setCopyTones(["casual", "educational", "inspirational"])
    setCopyIncludeHashtags(null); setCopyBrandTerms("")
    setEditVideoFile(null); setEditJob(null); stopEditPolling()
    setTimeout(() => {
      if (contentType === "single_image") subjectRef.current?.focus()
      else if (contentType === "carousel") topicRef.current?.focus()
      else if (contentType === "reel_script") reelTopicRef.current?.focus()
    }, 100)
  }

  const hasResults = images.length > 0 || captions.length > 0 || reelSlides.length > 0 || copyVariations.length > 0 || (editJob?.status === "completed" && editJob.outputUrl !== null)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[family-name:var(--font-geist-sans)]">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="relative z-50">
              <img src="/logo.png" alt="JP Automations" className="h-12 md:h-14 w-auto hover:opacity-80 transition-opacity" />
            </a>
            <div className="hidden md:block h-6 w-px bg-white/10" />
            <div className="hidden md:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl">
              {NAV_ITEMS.map((item) => (
                <a key={item.label} href={item.href} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${item.active ? "bg-white/[0.08] text-white" : "text-gray-500 hover:text-gray-300"}`}>{item.label}</a>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <AppsDropdown />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg">
                  <svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" /></svg>
                  <span className="text-sm font-semibold text-teal-400 tabular-nums">{tokenBalance}</span>
                </div>
                <UserMenu />
              </>
            ) : (
              <a href="/login?redirect=/dashboard/instagram" className="px-4 py-2 text-sm font-semibold bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-all">Sign In</a>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden relative z-50 p-2 text-white">
            <div className="w-7 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-full h-0.5 bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-6 text-center">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.href} className={`text-3xl font-bold transition-colors ${item.active ? "text-teal-400" : "text-gray-300 hover:text-teal-400"}`} onClick={() => setIsMobileMenuOpen(false)}>{item.label}</a>
          ))}
          <div className="w-12 h-px bg-white/10 my-2" />
          <a href="/dashboard" className="text-lg text-gray-500 hover:text-teal-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>All Apps</a>
          <AppsMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
          {user ? (
            <div className="flex items-center gap-2 mt-2">
              <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" /></svg>
              <span className="text-lg font-semibold text-teal-400">{tokenBalance} tokens</span>
            </div>
          ) : (
            <a href="/login?redirect=/dashboard/instagram" className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign In</a>
          )}
        </div>
      </div>

      {/* ── Main ── */}
      <main className="relative z-10 pt-28 md:pt-32 pb-32 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">

          <div className="mb-8">
            <a href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-teal-400 transition-colors mb-4 group">
              <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              All Apps
            </a>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Instagram Studio</h1>
          </div>

          {/* Content Type Strip */}
          <div className="flex gap-3 mb-6 overflow-x-auto scrollbar-hide pb-1">
            {CONTENT_TYPES.map((ct) => (
              <button key={ct.id} onClick={() => setContentType(ct.id)}
                className={`group shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-xl border transition-all duration-200 ${contentType === ct.id ? "border-teal-400/40 bg-teal-400/[0.08] text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.08)]" : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:border-white/[0.12] hover:text-gray-300"}`}>
                {ct.icon}
                <span className="text-sm font-semibold">{ct.label}</span>
                <span className={`text-xs font-mono ${contentType === ct.id ? "text-teal-400/60" : "text-gray-600"}`}>{ct.tokens}</span>
              </button>
            ))}
          </div>

          {/* ── Plan Mode ── */}
          {contentType === "plan" && <PlannerPanel />}

          {/* ── Form Card ── */}
          {contentType !== "plan" && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">

            {/* Template bar — image/carousel only */}
            {(contentType === "single_image" || contentType === "carousel") && (
              <div className="flex items-center justify-between px-5 md:px-6 py-3.5 border-b border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" /></svg>
                  <span className="text-sm text-gray-500">Style</span>
                </div>
                <button onClick={() => setShowTemplatePicker(true)} className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all text-sm">
                  {selectedTemplate ? (
                    <><div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTemplate.accentColor }} /><span className="text-white font-medium">{selectedTemplate.name}</span></>
                  ) : (
                    <span className="text-gray-500">Choose template</span>
                  )}
                  <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                </button>
              </div>
            )}

            {/* Form fields */}
            <div className="p-5 md:p-6 space-y-5">
              {contentType === "single_image" ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Subject *</label>
                    <input ref={subjectRef} type="text" value={subject} onChange={(e) => { setSubject(e.target.value); setError("") }} disabled={generating}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-all disabled:opacity-50"
                      placeholder="A modern minimalist house with floor-to-ceiling windows" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Scene / Setting</label>
                    <input type="text" value={scene} onChange={(e) => setScene(e.target.value)} disabled={generating}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-all disabled:opacity-50"
                      placeholder="Surrounded by a zen garden at golden hour" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Mood</label>
                    <div className="flex flex-wrap gap-2">
                      {MOODS.map((m) => (
                        <button key={m} onClick={() => setMood(mood === m ? "" : m)} disabled={generating}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${mood === m ? "border-teal-400/40 bg-teal-400/10 text-teal-400" : "border-white/[0.06] text-gray-500 hover:border-white/[0.12] hover:text-gray-300"}`}>{m}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Aspect Ratio</label>
                    <div className="flex gap-2">
                      {ASPECT_RATIOS.map((r) => (
                        <button key={r.value} onClick={() => setAspectRatio(r.value)} disabled={generating}
                          className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-lg border transition-all ${aspectRatio === r.value ? "border-teal-400/40 bg-teal-400/10 text-teal-400" : "border-white/[0.06] text-gray-500 hover:border-white/[0.12]"}`}>
                          <span className="text-sm font-semibold">{r.label}</span>
                          <span className="text-[10px] opacity-60">{r.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : contentType === "carousel" ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Topic *</label>
                    <input ref={topicRef} type="text" value={topic} onChange={(e) => { setTopic(e.target.value); setError("") }} disabled={generating}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-all disabled:opacity-50"
                      placeholder="Modern kitchen renovation ideas" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Industry / Niche</label>
                    <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} disabled={generating}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-all disabled:opacity-50"
                      placeholder="Interior design, real estate, construction..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Goal</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CAROUSEL_GOALS.map((g) => (
                        <button key={g.id} onClick={() => setCarouselGoal(g.id)} disabled={generating}
                          className={`text-left px-4 py-3 rounded-xl border transition-all ${carouselGoal === g.id ? "border-teal-400/40 bg-teal-400/[0.08]" : "border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12]"}`}>
                          <span className={`text-sm font-semibold block ${carouselGoal === g.id ? "text-teal-400" : "text-gray-300"}`}>{g.label}</span>
                          <span className="text-[11px] text-gray-600 leading-tight">{g.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : contentType === "edit" ? (
                <div className="space-y-5">
                  {/* Video upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Video File *</label>
                    {!editVideoFile ? (
                      <div
                        onDrop={handleEditDrop}
                        onDragOver={(e) => { e.preventDefault(); setEditIsDragging(true) }}
                        onDragLeave={(e) => { e.preventDefault(); setEditIsDragging(false) }}
                        onClick={() => editFileInputRef.current?.click()}
                        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all py-10 ${editIsDragging ? "border-teal-400/50 bg-teal-400/5" : "border-white/[0.1] bg-white/[0.01] hover:border-white/20"}`}
                      >
                        <input ref={editFileInputRef} type="file" accept="video/*" onChange={(e) => handleEditFileSelect(e.target.files)} className="hidden" />
                        <svg className={`w-8 h-8 mb-2 ${editIsDragging ? "text-teal-400" : "text-gray-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                        <p className="text-sm text-gray-400">{editIsDragging ? "Drop here" : "Click or drag video"}</p>
                        <p className="text-[10px] text-gray-600 mt-1">MP4, MOV, WebM</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                        <svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{editVideoFile.name}</p>
                          <p className="text-[10px] text-gray-600">{editFileSizeMB.toFixed(1)} MB · Est. {editFileEstimate}</p>
                        </div>
                        <button onClick={() => { setEditVideoFile(null); setError("") }} className="text-xs text-gray-500 hover:text-white transition-colors">Remove</button>
                      </div>
                    )}
                  </div>

                  {/* VAD toggle */}
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.01]">
                    <div>
                      <p className="text-sm font-medium text-white">Cut Silences</p>
                      <p className="text-[10px] text-gray-600">Auto-detect and remove silent sections</p>
                    </div>
                    <button onClick={() => setEditUseVad(!editUseVad)} className={`relative w-10 h-5 rounded-full transition-all ${editUseVad ? "bg-teal-400" : "bg-white/10"}`}>
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${editUseVad ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>

                  {/* Speed slider */}
                  <div className="px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-white">Speed</p>
                      <span className="text-xs font-mono text-teal-400">{editSpeed.toFixed(1)}x</span>
                    </div>
                    <input type="range" min={0.5} max={2.0} step={0.1} value={editSpeed} onChange={(e) => setEditSpeed(Number(e.target.value))} className="w-full accent-teal-400" />
                    <div className="flex justify-between mt-0.5">
                      <span className="text-[9px] text-gray-700">0.5x</span>
                      <span className="text-[9px] text-gray-700">1x</span>
                      <span className="text-[9px] text-gray-700">2x</span>
                    </div>
                  </div>
                </div>
              ) : contentType === "reel_script" ? (
                <>
                  {/* Reel Script Step indicator */}
                  <div className="flex items-center gap-2 mb-2">
                    {([{ n: 1 as const, label: "Topic" }, { n: 2 as const, label: "Format" }, { n: 3 as const, label: "Audience" }, { n: 4 as const, label: "Generate" }]).map(({ n, label }) => (
                      <div key={n} className="flex items-center gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            n < reelStep ? "bg-teal-400 text-black"
                            : n === reelStep ? "bg-teal-400/20 border border-teal-400 text-teal-400"
                            : "bg-white/[0.04] border border-white/[0.08] text-gray-600"
                          }`}>
                            {n < reelStep ? (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                            ) : n}
                          </div>
                          <span className={`text-[10px] font-medium ${n === reelStep ? "text-teal-400" : "text-gray-600"}`}>{label}</span>
                        </div>
                        {n < 4 && <div className={`w-8 h-0.5 mb-4 ${n < reelStep ? "bg-teal-400" : "bg-white/[0.08]"}`} />}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Topic */}
                  {reelStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">What&apos;s your reel about?</p>
                        <p className="text-xs text-gray-500">Describe the topic, idea, or message for your reel script.</p>
                      </div>
                      <textarea ref={reelTopicRef} value={reelTopic} onChange={(e) => { setReelTopic(e.target.value); setError("") }}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-all resize-none"
                        placeholder="e.g. 5 signs your home needs rewiring, why smart homes save money, behind the scenes of a kitchen renovation..." />
                      <button onClick={() => setReelStep(2)} disabled={!reelStepValid}
                        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${!reelStepValid ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-teal-400 text-black hover:bg-teal-300"}`}>
                        Next
                      </button>
                    </div>
                  )}

                  {/* Step 2: Format */}
                  {reelStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">How many slides?</p>
                        <p className="text-xs text-gray-500">Each slide gets on-screen text, a visual summary, and a detailed scene description.</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {SLIDE_COUNTS.map((s) => (
                          <button key={s.value} onClick={() => setReelSlideCount(s.value as 5 | 7 | 10)}
                            className={`flex flex-col items-center gap-0.5 py-3 rounded-xl border transition-all ${reelSlideCount === s.value ? "border-teal-400/40 bg-teal-400/10 text-teal-400" : "border-white/[0.06] text-gray-500 hover:border-white/[0.12]"}`}>
                            <span className="text-sm font-semibold">{s.label}</span>
                            <span className="text-[10px] opacity-60">{s.desc}</span>
                          </button>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white mb-2">Hook style</p>
                        <div className="flex flex-wrap gap-1.5">
                          {HOOK_STYLES.map((h) => (
                            <button key={h.value} onClick={() => setReelHookStyle(h.value)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${reelHookStyle === h.value ? "border-teal-400/40 bg-teal-400/10 text-teal-400" : "border-white/[0.08] bg-white/[0.02] text-gray-500 hover:border-white/20 hover:text-gray-300"}`}>{h.label}</button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setReelStep(1)}
                          className="w-1/3 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 border border-white/[0.08] hover:border-white/20 transition-all">Back</button>
                        <button onClick={() => setReelStep(3)}
                          className="w-2/3 py-3 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all">Next</button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Audience */}
                  {reelStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Who is this for?</p>
                        <p className="text-xs text-gray-500">Optional — helps tailor language and examples. Leave blank to use your profile defaults.</p>
                      </div>
                      <textarea value={reelAudience} onChange={(e) => setReelAudience(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-all resize-none"
                        placeholder="e.g. homeowners aged 30-50 in the UK looking to renovate..." />
                      <div>
                        <p className="text-sm font-semibold text-white mb-2">Key takeaway</p>
                        <input type="text" value={reelTakeaway} onChange={(e) => setReelTakeaway(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-all"
                          placeholder="What should the viewer walk away knowing?" />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setReelStep(2)}
                          className="w-1/3 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 border border-white/[0.08] hover:border-white/20 transition-all">Back</button>
                        <button onClick={() => setReelStep(4)}
                          className="w-2/3 py-3 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all">Next</button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Generate */}
                  {reelStep === 4 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Ready to generate</p>
                        <p className="text-xs text-gray-500">Review your inputs, then generate your reel script.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06]">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-600 uppercase tracking-wider">Topic</p>
                            <p className="text-sm text-gray-300 truncate">{reelTopic}</p>
                          </div>
                          <button onClick={() => setReelStep(1)} className="text-xs text-gray-600 hover:text-teal-400 transition-colors shrink-0">Edit</button>
                        </div>
                        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06]">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-600 uppercase tracking-wider">Format</p>
                            <p className="text-sm text-gray-300">{reelSlideCount} slides &middot; {HOOK_STYLES.find(h => h.value === reelHookStyle)?.label} hook</p>
                          </div>
                          <button onClick={() => setReelStep(2)} className="text-xs text-gray-600 hover:text-teal-400 transition-colors shrink-0">Edit</button>
                        </div>
                        {(reelAudience.trim() || reelTakeaway.trim()) && (
                          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06]">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-gray-600 uppercase tracking-wider">Audience & Takeaway</p>
                              <p className="text-sm text-gray-300 truncate">{reelAudience.trim() || "Default"}{reelTakeaway.trim() ? ` · ${reelTakeaway}` : ""}</p>
                            </div>
                            <button onClick={() => setReelStep(3)} className="text-xs text-gray-600 hover:text-teal-400 transition-colors shrink-0">Edit</button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setReelStep(3)}
                          className="w-1/3 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 border border-white/[0.08] hover:border-white/20 transition-all">Back</button>
                        <button onClick={handleGenerate} disabled={generating || !isFormValid}
                          className="w-2/3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                          {generating ? (
                            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating</>
                          ) : (
                            <>Generate <span className="text-black/50 font-mono text-xs">8</span></>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : contentType === "post_copy" ? (
                <>
                  {/* Post Copy Step indicator */}
                  <div className="flex items-center gap-2 mb-2">
                    {([{ n: 1 as const, label: "Content" }, { n: 2 as const, label: "Tone" }, { n: 3 as const, label: "Options" }, { n: 4 as const, label: "Generate" }]).map(({ n, label }) => (
                      <div key={n} className="flex items-center gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            n < copyStep ? "bg-teal-400 text-black"
                            : n === copyStep ? "bg-teal-400/20 border border-teal-400 text-teal-400"
                            : "bg-white/[0.04] border border-white/[0.08] text-gray-600"
                          }`}>
                            {n < copyStep ? (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                            ) : n}
                          </div>
                          <span className={`text-[10px] font-medium ${n === copyStep ? "text-teal-400" : "text-gray-600"}`}>{label}</span>
                        </div>
                        {n < 4 && <div className={`w-8 h-0.5 mb-4 ${n < copyStep ? "bg-teal-400" : "bg-white/[0.08]"}`} />}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Content */}
                  {copyStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Do you have the full script?</p>
                        <p className="text-xs text-gray-500">Paste your script for spot-on copy, or describe the post if you don&apos;t have one yet.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { setCopyHasScript(true); setTimeout(() => copyTextRef.current?.focus(), 100) }}
                          className={`text-left p-4 rounded-xl border transition-all ${copyHasScript === true ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}>
                          <p className={`text-sm font-semibold ${copyHasScript === true ? "text-teal-400" : "text-white"}`}>Yes, I have it</p>
                          <p className="text-xs text-gray-500 mt-1">Paste your full script or spoken content</p>
                        </button>
                        <button onClick={() => { setCopyHasScript(false); setTimeout(() => copyTextRef.current?.focus(), 100) }}
                          className={`text-left p-4 rounded-xl border transition-all ${copyHasScript === false ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}>
                          <p className={`text-sm font-semibold ${copyHasScript === false ? "text-teal-400" : "text-white"}`}>No, just an idea</p>
                          <p className="text-xs text-gray-500 mt-1">Describe the topic or angle of your post</p>
                        </button>
                      </div>
                      {copyHasScript !== null && (
                        <textarea ref={copyTextRef} value={copyContent} onChange={(e) => { setCopyContent(e.target.value); setError("") }}
                          rows={copyHasScript ? 6 : 3}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-all resize-none"
                          placeholder={copyHasScript ? "Paste your full script or spoken content here..." : "Describe what your post is about — reel topic, carousel idea, content angle..."} />
                      )}
                      <button onClick={() => setCopyStep(2)} disabled={!copyStepValid}
                        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${!copyStepValid ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-teal-400 text-black hover:bg-teal-300"}`}>
                        Next
                      </button>
                    </div>
                  )}

                  {/* Step 2: Format & Tone */}
                  {copyStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-white mb-2">Post format</p>
                        <div className="flex flex-wrap gap-1.5">
                          {POST_FORMATS.map((f) => (
                            <button key={f.value} onClick={() => setCopyFormat(f.value)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${copyFormat === f.value ? "border-teal-400/40 bg-teal-400/10 text-teal-400" : "border-white/[0.08] bg-white/[0.02] text-gray-500 hover:border-white/20 hover:text-gray-300"}`}>{f.label}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Tone variations</p>
                        <p className="text-xs text-gray-500 mb-2">Select 1 or more tones — you&apos;ll get a unique caption for each.</p>
                        <div className="flex flex-wrap gap-1.5">
                          {TONE_OPTIONS.map((t) => {
                            const isSelected = copyTones.includes(t.value)
                            return (
                              <button key={t.value} onClick={() => {
                                if (isSelected && copyTones.length > 1) setCopyTones(copyTones.filter(v => v !== t.value))
                                else if (!isSelected) setCopyTones([...copyTones, t.value])
                              }}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${isSelected ? "border-teal-400/40 bg-teal-400/10 text-teal-400" : "border-white/[0.08] bg-white/[0.02] text-gray-500 hover:border-white/20 hover:text-gray-300"}`}>{t.label}</button>
                            )
                          })}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setCopyStep(1)}
                          className="w-1/3 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 border border-white/[0.08] hover:border-white/20 transition-all">Back</button>
                        <button onClick={() => setCopyStep(3)} disabled={!copyStepValid}
                          className={`w-2/3 py-3 rounded-xl text-sm font-semibold transition-all ${!copyStepValid ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-teal-400 text-black hover:bg-teal-300"}`}>Next</button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Options */}
                  {copyStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Include hashtags?</p>
                        <p className="text-xs text-gray-500">8-12 hashtags per caption mixing broad and niche tags.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setCopyIncludeHashtags(true)}
                          className={`text-left p-4 rounded-xl border transition-all ${copyIncludeHashtags === true ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}>
                          <p className={`text-sm font-semibold ${copyIncludeHashtags === true ? "text-teal-400" : "text-white"}`}>Yes, include them</p>
                          <p className="text-xs text-gray-500 mt-1">Broad + niche hashtags for discovery</p>
                        </button>
                        <button onClick={() => setCopyIncludeHashtags(false)}
                          className={`text-left p-4 rounded-xl border transition-all ${copyIncludeHashtags === false ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}>
                          <p className={`text-sm font-semibold ${copyIncludeHashtags === false ? "text-teal-400" : "text-white"}`}>No hashtags</p>
                          <p className="text-xs text-gray-500 mt-1">Clean caption, no tags</p>
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white mb-2">Brand terms <span className="text-gray-600 font-normal">(optional)</span></p>
                        <input type="text" value={copyBrandTerms} onChange={(e) => setCopyBrandTerms(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-all"
                          placeholder="Words or phrases to weave in naturally..." />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setCopyStep(2)}
                          className="w-1/3 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 border border-white/[0.08] hover:border-white/20 transition-all">Back</button>
                        <button onClick={() => setCopyStep(4)} disabled={!copyStepValid}
                          className={`w-2/3 py-3 rounded-xl text-sm font-semibold transition-all ${!copyStepValid ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-teal-400 text-black hover:bg-teal-300"}`}>Next</button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Generate */}
                  {copyStep === 4 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Ready to generate</p>
                        <p className="text-xs text-gray-500">Review your inputs, then generate {copyTones.length} caption variation{copyTones.length > 1 ? "s" : ""}.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06]">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-600 uppercase tracking-wider">{copyHasScript ? "Script" : "Topic"}</p>
                            <p className="text-sm text-gray-300 truncate">{copyContent}</p>
                          </div>
                          <button onClick={() => setCopyStep(1)} className="text-xs text-gray-600 hover:text-teal-400 transition-colors shrink-0">Edit</button>
                        </div>
                        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06]">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-600 uppercase tracking-wider">Format & Tone</p>
                            <p className="text-sm text-gray-300">{POST_FORMATS.find(f => f.value === copyFormat)?.label} &middot; {copyTones.map(t => TONE_OPTIONS.find(o => o.value === t)?.label).join(", ")}</p>
                          </div>
                          <button onClick={() => setCopyStep(2)} className="text-xs text-gray-600 hover:text-teal-400 transition-colors shrink-0">Edit</button>
                        </div>
                        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06]">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-600 uppercase tracking-wider">Options</p>
                            <p className="text-sm text-gray-300">{copyIncludeHashtags ? "With hashtags" : "No hashtags"}{copyBrandTerms.trim() ? ` · Brand terms: ${copyBrandTerms}` : ""}</p>
                          </div>
                          <button onClick={() => setCopyStep(3)} className="text-xs text-gray-600 hover:text-teal-400 transition-colors shrink-0">Edit</button>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setCopyStep(3)}
                          className="w-1/3 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 border border-white/[0.08] hover:border-white/20 transition-all">Back</button>
                        <button onClick={handleGenerate} disabled={generating || !isFormValid}
                          className="w-2/3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                          {generating ? (
                            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating</>
                          ) : (
                            <>Generate <span className="text-black/50 font-mono text-xs">5</span></>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : contentType === "caption" ? (
                <>
                  {/* Caption Step indicator */}
                  <div className="flex items-center gap-2 mb-2">
                    {([{ n: 1 as const, label: "Script" }, { n: 2 as const, label: "Keywords" }, { n: 3 as const, label: "Generate" }]).map(({ n, label }) => (
                      <div key={n} className="flex items-center gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            n < captionStep ? "bg-teal-400 text-black"
                            : n === captionStep ? "bg-teal-400/20 border border-teal-400 text-teal-400"
                            : "bg-white/[0.04] border border-white/[0.08] text-gray-600"
                          }`}>
                            {n < captionStep ? (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                            ) : n}
                          </div>
                          <span className={`text-[10px] font-medium ${n === captionStep ? "text-teal-400" : "text-gray-600"}`}>{label}</span>
                        </div>
                        {n < 3 && <div className={`w-12 h-0.5 mb-4 ${n < captionStep ? "bg-teal-400" : "bg-white/[0.08]"}`} />}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Script */}
                  {captionStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Do you have the full script?</p>
                        <p className="text-xs text-gray-500">Paste your script for a spot-on caption, or describe the post if you don&apos;t have one yet.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { setCaptionHasScript(true); setTimeout(() => captionTextRef.current?.focus(), 100) }}
                          className={`text-left p-4 rounded-xl border transition-all ${captionHasScript === true ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}>
                          <p className={`text-sm font-semibold ${captionHasScript === true ? "text-teal-400" : "text-white"}`}>Yes, I have it</p>
                          <p className="text-xs text-gray-500 mt-1">Paste your full script or spoken content</p>
                        </button>
                        <button onClick={() => { setCaptionHasScript(false); setTimeout(() => captionTextRef.current?.focus(), 100) }}
                          className={`text-left p-4 rounded-xl border transition-all ${captionHasScript === false ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}>
                          <p className={`text-sm font-semibold ${captionHasScript === false ? "text-teal-400" : "text-white"}`}>No, just an idea</p>
                          <p className="text-xs text-gray-500 mt-1">Describe the topic or angle of your post</p>
                        </button>
                      </div>
                      {captionHasScript !== null && (
                        <textarea ref={captionTextRef} value={captionContent} onChange={(e) => { setCaptionContent(e.target.value); setError("") }}
                          rows={captionHasScript ? 6 : 3}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-all resize-none"
                          placeholder={captionHasScript ? "Paste your full script or spoken content here..." : "Describe what your post is about — reel topic, carousel idea, content angle..."} />
                      )}
                      <button onClick={() => setCaptionStep(2)} disabled={!captionStepValid}
                        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${!captionStepValid ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-teal-400 text-black hover:bg-teal-300"}`}>
                        Next
                      </button>
                    </div>
                  )}

                  {/* Step 2: Keywords */}
                  {captionStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Do you have specific keywords to rank for?</p>
                        <p className="text-xs text-gray-500">Instagram search rewards captions with intentional SEO terms.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setCaptionHasKeywords(true)}
                          className={`text-left p-4 rounded-xl border transition-all ${captionHasKeywords === true ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}>
                          <p className={`text-sm font-semibold ${captionHasKeywords === true ? "text-teal-400" : "text-white"}`}>Yes, I have some</p>
                          <p className="text-xs text-gray-500 mt-1">I&apos;ll provide specific terms to target</p>
                        </button>
                        <button onClick={() => { setCaptionHasKeywords(false); setCaptionKeywords("") }}
                          className={`text-left p-4 rounded-xl border transition-all ${captionHasKeywords === false ? "border-teal-400/50 bg-teal-400/10" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"}`}>
                          <p className={`text-sm font-semibold ${captionHasKeywords === false ? "text-teal-400" : "text-white"}`}>No, pick for me</p>
                          <p className="text-xs text-gray-500 mt-1">AI picks keywords based on your content</p>
                        </button>
                      </div>
                      {captionHasKeywords === true && (
                        <input type="text" value={captionKeywords} onChange={(e) => setCaptionKeywords(e.target.value)} autoFocus
                          placeholder="e.g. home automation, smart home UK, AI for business..."
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-all" />
                      )}
                      <div className="flex gap-3">
                        <button onClick={() => setCaptionStep(1)}
                          className="w-1/3 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 border border-white/[0.08] hover:border-white/20 transition-all">Back</button>
                        <button onClick={() => setCaptionStep(3)} disabled={!captionStepValid}
                          className={`w-2/3 py-3 rounded-xl text-sm font-semibold transition-all ${!captionStepValid ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-teal-400 text-black hover:bg-teal-300"}`}>Next</button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Generate */}
                  {captionStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Ready to generate</p>
                        <p className="text-xs text-gray-500">Review your inputs, pick a goal and framework, then generate.</p>
                      </div>

                      {/* Summary */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06]">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-600 uppercase tracking-wider">{captionHasScript ? "Script" : "Topic"}</p>
                            <p className="text-sm text-gray-300 truncate">{captionContent}</p>
                          </div>
                          <button onClick={() => setCaptionStep(1)} className="text-xs text-gray-600 hover:text-teal-400 transition-colors shrink-0">Edit</button>
                        </div>
                        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06]">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-600 uppercase tracking-wider">Keywords</p>
                            <p className="text-sm text-gray-300">{captionHasKeywords && captionKeywords.trim() ? captionKeywords : "AI will pick relevant keywords"}</p>
                          </div>
                          <button onClick={() => setCaptionStep(2)} className="text-xs text-gray-600 hover:text-teal-400 transition-colors shrink-0">Edit</button>
                        </div>
                      </div>

                      {/* Goal */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Goal</label>
                        <div className="flex flex-wrap gap-1.5">
                          {CAPTION_GOALS.map((g) => (
                            <button key={g.value} onClick={() => setCaptionGoal(g.value)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${captionGoal === g.value ? "border-teal-400/40 bg-teal-400/10 text-teal-400" : "border-white/[0.08] bg-white/[0.02] text-gray-500 hover:border-white/20 hover:text-gray-300"}`}>{g.label}</button>
                          ))}
                        </div>
                      </div>

                      {/* Framework */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Framework</label>
                        <div className="flex flex-wrap gap-1.5">
                          {CAPTION_FRAMEWORKS.map((f) => (
                            <button key={f.value} onClick={() => setCaptionFramework(f.value)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${captionFramework === f.value ? "border-teal-400/40 bg-teal-400/10 text-teal-400" : "border-white/[0.08] bg-white/[0.02] text-gray-500 hover:border-white/20 hover:text-gray-300"}`}>{f.label}</button>
                          ))}
                        </div>
                      </div>

                      {/* Back + Generate */}
                      <div className="flex gap-3">
                        <button onClick={() => setCaptionStep(2)}
                          className="w-1/3 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 border border-white/[0.08] hover:border-white/20 transition-all">Back</button>
                        <button onClick={handleGenerate} disabled={generating || !isFormValid}
                          className="w-2/3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                          {generating ? (
                            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating</>
                          ) : (
                            <>Generate <span className="text-black/50 font-mono text-xs">5</span></>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Generate bar — image/carousel/edit (caption has its own in step 3) */}
            {contentType !== "caption" && (
              <div className="flex items-center justify-between px-5 md:px-6 py-3.5 border-t border-white/[0.04] bg-white/[0.01]">
                <div className="text-xs text-gray-600">
                  {contentType === "carousel" ? "7 slides at 4:5" : contentType === "edit" ? (editUseVad ? "VAD silence removal" : "Speed adjustment only") : `${aspectRatio} format`}
                  {contentType !== "edit" && selectedTemplate && <span> &middot; {selectedTemplate.name}</span>}
                </div>
                <button onClick={handleGenerate} disabled={generating || !isFormValid}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  {generating ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{editUploading ? "Uploading..." : contentType === "edit" ? "Processing..." : "Generating"}</>
                  ) : (
                    <>{contentType === "edit" ? "Edit Video" : "Generate"} <span className="text-black/50 font-mono text-xs">{cost}</span></>
                  )}
                </button>
              </div>
            )}
          </div>
          )}

          {contentType !== "plan" && error && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
              {error}
            </div>
          )}

          {/* ── Canvas ── */}
          {contentType !== "plan" && (
          <div className="mt-8">
            {generating && (
              <div className="flex flex-col items-center justify-center py-20 md:py-24">
                <div className="relative w-20 h-20 mb-8">
                  <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="38" fill="none" stroke="rgb(45 212 191)" strokeWidth="2" strokeDasharray="238.76" strokeDashoffset="238.76" strokeLinecap="round" className="animate-[dash_2s_ease-in-out_infinite]" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-mono text-teal-400 tabular-nums">{elapsed}s</span></div>
                </div>
                <p className="text-white font-semibold mb-1">{contentType === "caption" ? "Writing your caption" : contentType === "edit" ? (editUploading ? "Uploading video" : "Queueing edit job") : "Rendering with Flux Pro"}</p>
                <p className="text-sm text-gray-600">{contentType === "carousel" ? "Creating 7 carousel slides..." : contentType === "caption" ? "Crafting an SEO-optimised caption..." : contentType === "edit" ? (editUploading ? "Estimated total time: " + editFileEstimate : "Your video will be processed in the cloud...") : "Creating your image..."}</p>
              </div>
            )}

            {images.length > 0 && !generating && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <h2 className="text-sm font-semibold text-gray-300">{contentType === "carousel" ? `${images.length} slides` : "1 image"} generated</h2>
                </div>
                {contentType === "single_image" ? (
                  <div className="max-w-xl">
                    <div className="group relative rounded-2xl overflow-hidden border border-white/[0.06] bg-black/40 hover:border-white/[0.12] transition-all">
                      <img src={images[0].imageUrl} alt="Generated image" className="w-full h-auto cursor-pointer" onClick={() => setSelectedImage(images[0].imageUrl)} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                    {images.map((img, i) => (
                      <div key={i} className="group relative shrink-0 w-56 md:w-64 rounded-2xl overflow-hidden border border-white/[0.06] bg-black/40 hover:border-white/[0.12] transition-all snap-start">
                        <img src={img.imageUrl} alt={`Slide ${i + 1}`} className="w-full h-auto cursor-pointer" onClick={() => setSelectedImage(img.imageUrl)} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                          <span className="text-xs font-mono text-white/70">Slide {i + 1}</span>
                        </div>
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                          <span className="text-[10px] font-mono text-white/60">{i + 1}/{images.length}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {captions.length > 0 && !generating && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <h2 className="text-sm font-semibold text-gray-300">{captions.length} caption{captions.length > 1 ? "s" : ""} generated</h2>
                </div>
                {captions.map((cap, i) => (
                  <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    <div className="p-5 md:p-6">
                      <p className="text-white whitespace-pre-wrap text-[15px] leading-relaxed">{cap.full_caption}</p>
                      {cap.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {cap.hashtags.map((h, hi) => (
                            <span key={hi} className="text-xs text-teal-400/70 bg-teal-400/[0.06] px-2 py-0.5 rounded-md">#{h.replace(/^#/, "")}</span>
                          ))}
                        </div>
                      )}
                      {cap.seo_score > 0 && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.04]">
                          <div className="flex items-center gap-1.5">
                            <div className="w-8 h-1.5 rounded-full bg-white/[0.06] overflow-hidden"><div className="h-full rounded-full bg-teal-400" style={{ width: `${cap.seo_score}%` }} /></div>
                            <span className="text-xs font-mono text-gray-500">SEO {cap.seo_score}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-end px-5 md:px-6 py-3 border-t border-white/[0.04]">
                      <button onClick={() => handleCopy(cap.full_caption, i)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all">
                        {copiedIdx === i ? (
                          <><svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>Copied</>
                        ) : (
                          <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>Copy</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit job progress & results */}
            {editJob && !generating && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-2 h-2 rounded-full ${editJob.status === "completed" ? "bg-green-400" : editJob.status === "failed" ? "bg-red-400" : "bg-teal-400 animate-pulse"}`} />
                  <h2 className="text-sm font-semibold text-gray-300">
                    {editJob.status === "completed" ? "Edit complete" : editJob.status === "failed" ? "Edit failed" : "Processing video..."}
                  </h2>
                  <span className="text-xs text-gray-600 font-mono">{editJob.jobId.slice(0, 8)}</span>
                </div>

                {(editJob.status === "queued" || editJob.status === "processing") && (
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-2">
                      <div className="h-full bg-teal-400 transition-all duration-500" style={{ width: `${Math.max(2, Math.min(100, editJob.progress))}%` }} />
                    </div>
                    <p className="text-xs text-gray-600">{Math.round(editJob.progress)}% complete</p>
                  </div>
                )}

                {editJob.error && (
                  <div className="px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm">{editJob.error}</div>
                )}

                {editJob.outputUrl && (
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    <video src={editJob.outputUrl} controls className="w-full bg-black" />
                    <div className="flex items-center justify-end px-5 py-3 border-t border-white/[0.04]">
                      <button onClick={() => handleEditDownload(editJob.outputUrl as string, `edited-${editJob.jobId.slice(0, 8)}.mp4`)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-teal-400 hover:bg-teal-400/10 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        Download
                      </button>
                    </div>
                  </div>
                )}

                {editJob.logs && (
                  <details className="text-xs text-gray-400">
                    <summary className="cursor-pointer hover:text-gray-200 transition-colors">View logs</summary>
                    <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-black/40 border border-white/[0.06] p-3 text-[11px] leading-relaxed text-gray-500">{editJob.logs}</pre>
                  </details>
                )}
              </div>
            )}
          </div>
          )}
        </div>
      </main>

      {/* ── Floating Action Bar ── */}
      {contentType !== "plan" && hasResults && !generating && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/[0.08] bg-[#141414]/90 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            {images.length > 0 && (
              <>
                <button onClick={() => { if (images.length === 1) handleDownload(images[0].imageUrl, "image.webp"); else images.forEach((img, i) => { setTimeout(() => handleDownload(img.imageUrl, `slide-${i + 1}.webp`), i * 500) }) }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/[0.08] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  {images.length > 1 ? "Download All" : "Download"}
                </button>
                <div className="w-px h-5 bg-white/[0.08]" />
              </>
            )}
            {captions.length > 0 && (
              <>
                <button onClick={() => handleCopy(captions[0].full_caption, 0)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/[0.08] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>
                  Copy
                </button>
                <div className="w-px h-5 bg-white/[0.08]" />
              </>
            )}
            {editJob?.outputUrl && (
              <>
                <button onClick={() => handleEditDownload(editJob.outputUrl as string, `edited-${editJob.jobId.slice(0, 8)}.mp4`)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/[0.08] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  Download
                </button>
                <div className="w-px h-5 bg-white/[0.08]" />
              </>
            )}
            <button onClick={handleGenerate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg>
              Regenerate
            </button>
            <div className="w-px h-5 bg-white/[0.08]" />
            <button onClick={resetForm} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              New
            </button>
          </div>
        </div>
      )}

      {/* ── Template Picker ── */}
      {showTemplatePicker && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6" onClick={() => setShowTemplatePicker(false)}>
          <div className="w-full max-w-2xl bg-[#111] border border-white/[0.08] rounded-t-3xl md:rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div>
                <h3 className="text-lg font-bold text-white">Visual Style</h3>
                <p className="text-xs text-gray-600 mt-0.5">Sets lighting, colour palette, and mood for your content</p>
              </div>
              <button onClick={() => setShowTemplatePicker(false)} className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
              {TEMPLATES.map((t) => {
                const isSelected = selectedTemplate?.id === t.id
                return (
                  <button key={t.id} onClick={() => { setSelectedTemplate(t); setShowTemplatePicker(false) }}
                    className={`group relative flex flex-col rounded-xl border overflow-hidden transition-all text-left ${isSelected ? "border-teal-400/50 ring-1 ring-teal-400/20" : "border-white/[0.06] hover:border-white/[0.15]"}`}>
                    <div className="h-20 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${t.accentColor}22, ${t.accentColor}08)` }}>
                      <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 rounded-full" style={{ backgroundColor: t.accentColor, opacity: 0.7 }} /></div>
                      <div className="absolute bottom-2 left-2 flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: t.accentColor }} />
                        <div className="w-2.5 h-2.5 rounded-full border border-white/10 bg-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full border border-white/10 bg-black/30" />
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-400 flex items-center justify-center">
                          <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-3 bg-white/[0.02]">
                      <span className="text-sm font-semibold text-white block mb-0.5">{t.name}</span>
                      <span className="text-[11px] text-gray-500 leading-snug line-clamp-2">{t.description}</span>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="px-4 md:px-6 pb-4 md:pb-6">
              <button onClick={() => { setSelectedTemplate(null); setShowTemplatePicker(false) }}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${!selectedTemplate ? "border-white/[0.15] bg-white/[0.06] text-white" : "border-white/[0.06] text-gray-500 hover:border-white/[0.12] hover:text-gray-300"}`}>
                No template — use defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6 md:p-12" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={selectedImage} alt="Full size preview" className="max-w-full max-h-full rounded-2xl" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); handleDownload(selectedImage, "image.webp") }}
            className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-400 text-black font-semibold text-sm hover:bg-teal-300 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Download
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes dash { 0% { stroke-dashoffset: 238.76; } 50% { stroke-dashoffset: 59.69; } 100% { stroke-dashoffset: 238.76; } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
