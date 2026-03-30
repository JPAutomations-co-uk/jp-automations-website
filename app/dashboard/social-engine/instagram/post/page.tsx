"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import ConversationalQA, { type Question } from "@/app/components/chat/ConversationalQA"
import FeedbackButtons from "@/app/components/FeedbackButtons"

// ─── Questions ──────────────────────────────────────────────────────────────

const BASE_QUESTIONS: Question[] = [
  {
    id: "topic",
    question: "What's this post about?",
    inputType: "textarea",
    placeholder: "e.g. 5 mistakes service businesses make on Instagram...",
  },
  {
    id: "format",
    question: "What format?",
    inputType: "single-select",
    options: [
      { label: "Auto (AI picks)", value: "auto" },
      { label: "Carousel", value: "carousel" },
      { label: "Reel script", value: "reel_script" },
      { label: "Single image caption", value: "single" },
    ],
  },
]

const CAROUSEL_DENSITY_QUESTION: Question = {
  id: "density",
  question: "How much copy per slide?",
  inputType: "single-select",
  options: [
    { label: "Minimal (headline only)", value: "minimal" },
    { label: "Standard (headline + 1 sentence)", value: "standard" },
    { label: "Detailed (headline + 2-3 sentences)", value: "detailed" },
  ],
}

const CAROUSEL_SLIDES_QUESTION: Question = {
  id: "slideCount",
  question: "How many slides?",
  inputType: "single-select",
  options: [
    { label: "5 slides", value: "5" },
    { label: "7 slides (recommended)", value: "7" },
    { label: "10 slides", value: "10" },
  ],
}

const REEL_DURATION_QUESTION: Question = {
  id: "duration",
  question: "How long should the reel be?",
  inputType: "single-select",
  options: [
    { label: "Short (15-30s)", value: "short" },
    { label: "Medium (30-60s)", value: "medium" },
    { label: "Long (60-90s)", value: "long" },
  ],
}

const REEL_HOOK_QUESTION: Question = {
  id: "hookStyle",
  question: "How should the reel open?",
  inputType: "single-select",
  options: [
    { label: "Bold claim", value: "bold_claim" },
    { label: "Question", value: "question" },
    { label: "Surprising stat", value: "statistic" },
    { label: "Hot take", value: "controversial" },
    { label: "Personal story", value: "story" },
  ],
}

const REMAINING_QUESTIONS: Question[] = [
  {
    id: "goal",
    question: "What's the goal?",
    inputType: "single-select",
    options: [
      { label: "Saves & shares", value: "saves" },
      { label: "Comments & engagement", value: "engagement" },
      { label: "Followers", value: "followers" },
      { label: "DMs & leads", value: "leads" },
    ],
  },
  {
    id: "angle",
    question: "What angle fits?",
    inputType: "single-select",
    options: [
      { label: "Educational", value: "educational" },
      { label: "Behind the scenes", value: "bts" },
      { label: "Transformation / before-after", value: "transformation" },
      { label: "Hot take", value: "hot_take" },
    ],
  },
  {
    id: "specifics",
    question: "Any stats, quotes, or details to include?",
    inputType: "textarea",
    placeholder: "e.g. 73% of small businesses don't post consistently...",
    optional: true,
  },
]

// ─── Types ──────────────────────────────────────────────────────────────────

interface PostVariant {
  caption: string
  hook: string
  cta: string
  hashtags: string[]
  format_notes: string
  why_it_works: string
  writing_score: number
  writing_tips: string[]
}

interface CarouselSlide {
  slide: number
  type: "cover" | "content" | "cta"
  eyebrow?: string
  heading: string
  subheading?: string
  body?: string
  design_note?: string
}

interface CarouselResult {
  slides: CarouselSlide[]
  caption: string
  caption_hook: string
  why_it_works: string
  save_trigger: string
}

interface ReelSlide {
  slide: number
  type: string
  on_screen_text: string
  voiceover: string
  voiceover_duration?: string
  visual_summary: string
  scene_description: string
  retention_note: string
}

interface ReelResult {
  slides: ReelSlide[]
  total_duration: string
  total_words: number
  speaking_pace: string
  caption: string
  caption_hook: string
  why_it_works: string
}

type ResultType = "caption" | "carousel" | "reel"

// ─── Helpers ────────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-400 bg-green-400/10" : score >= 60 ? "text-yellow-400 bg-yellow-400/10" : "text-red-400 bg-red-400/10"
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded ${color}`}>
      {score}/100
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="text-xs text-gray-500 hover:text-teal-400 transition-colors flex items-center gap-1"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}

// ─── Result Renderers ───────────────────────────────────────────────────────

function CaptionResults({ posts, onStartOver }: { posts: PostVariant[]; onStartOver: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">3 Caption Variants</h2>
        <button onClick={onStartOver} className="text-xs text-gray-500 hover:text-teal-400 transition-colors">
          Start Over
        </button>
      </div>
      {posts.map((post, i) => (
        <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-teal-400/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Variant {i + 1}</span>
            <div className="flex items-center gap-3">
              <ScoreBadge score={post.writing_score} />
              <CopyButton text={post.caption} />
            </div>
          </div>
          <div className="mb-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400/70 mb-1">Hook (visible before &quot;...more&quot;)</p>
            <p className="text-white text-sm">{post.hook}</p>
          </div>
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap mb-3">{post.caption}</p>
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.hashtags.map((tag, j) => (
                <span key={j} className="text-xs text-teal-400/70 bg-teal-400/5 px-2 py-0.5 rounded">#{tag}</span>
              ))}
            </div>
          )}
          <div className="border-t border-white/[0.06] pt-3 space-y-1.5">
            <p className="text-xs text-gray-600"><span className="text-gray-500">Why it works:</span> {post.why_it_works}</p>
            <p className="text-xs text-gray-600"><span className="text-gray-500">CTA:</span> {post.cta}</p>
            {post.format_notes && <p className="text-xs text-gray-600"><span className="text-gray-500">Format notes:</span> {post.format_notes}</p>}
          </div>
          {post.writing_tips && post.writing_tips.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/[0.04]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Writing tips</p>
              <ul className="space-y-1">
                {post.writing_tips.map((tip, j) => (
                  <li key={j} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-teal-400/50 mt-0.5">-</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-white/[0.04]">
            <FeedbackButtons contentType="instagram_post" contentSnapshot={{ post }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function CarouselResults({ result, onStartOver }: { result: CarouselResult; onStartOver: () => void }) {
  const allText = result.slides.map((s) => {
    const parts = [s.eyebrow, s.heading, s.subheading, s.body].filter(Boolean)
    return `Slide ${s.slide} (${s.type}):\n${parts.join("\n")}`
  }).join("\n\n")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Carousel Script ({result.slides.length} slides)</h2>
        <div className="flex items-center gap-3">
          <CopyButton text={allText} />
          <button onClick={onStartOver} className="text-xs text-gray-500 hover:text-teal-400 transition-colors">Start Over</button>
        </div>
      </div>

      {/* Slides */}
      <div className="space-y-3">
        {result.slides.map((slide) => (
          <div key={slide.slide} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-teal-400/20 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                slide.type === "cover" ? "text-purple-400 bg-purple-400/10" :
                slide.type === "cta" ? "text-orange-400 bg-orange-400/10" :
                "text-teal-400 bg-teal-400/10"
              }`}>
                {slide.type === "cover" ? "Cover" : slide.type === "cta" ? "CTA" : `Slide ${slide.slide}`}
              </span>
            </div>

            {slide.eyebrow && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">{slide.eyebrow}</p>
            )}
            <h3 className="text-white font-semibold text-lg mb-1">{slide.heading}</h3>
            {slide.subheading && <p className="text-gray-400 text-sm mb-2">{slide.subheading}</p>}
            {slide.body && <p className="text-gray-300 text-sm leading-relaxed">{slide.body}</p>}
            {slide.design_note && (
              <p className="text-xs text-gray-600 mt-3 pt-2 border-t border-white/[0.04]">
                <span className="text-gray-500">Design:</span> {slide.design_note}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Caption */}
      {result.caption && (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Caption</span>
            <CopyButton text={result.caption} />
          </div>
          {result.caption_hook && (
            <div className="mb-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400/70 mb-1">Hook</p>
              <p className="text-white text-sm">{result.caption_hook}</p>
            </div>
          )}
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{result.caption}</p>
        </div>
      )}

      {/* Meta */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-1.5">
        {result.why_it_works && <p className="text-xs text-gray-600"><span className="text-gray-500">Why it works:</span> {result.why_it_works}</p>}
        {result.save_trigger && <p className="text-xs text-gray-600"><span className="text-gray-500">Save trigger:</span> {result.save_trigger}</p>}
      </div>

      <div className="mt-3">
        <FeedbackButtons contentType="instagram_carousel" contentSnapshot={{ carousel: result }} />
      </div>
    </div>
  )
}

function ReelResults({ result, onStartOver }: { result: ReelResult; onStartOver: () => void }) {
  const allVoiceover = result.slides.map((s) => s.voiceover).join("\n\n")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Reel Script ({result.slides.length} slides)</h2>
        <div className="flex items-center gap-3">
          <CopyButton text={allVoiceover} />
          <button onClick={onStartOver} className="text-xs text-gray-500 hover:text-teal-400 transition-colors">Start Over</button>
        </div>
      </div>

      {/* Duration badge */}
      <div className="flex flex-wrap gap-2">
        {result.total_duration && (
          <span className="text-xs text-teal-400 bg-teal-400/10 px-2.5 py-1 rounded-lg">
            {result.total_duration}s
          </span>
        )}
        {result.total_words && (
          <span className="text-xs text-gray-400 bg-white/[0.04] px-2.5 py-1 rounded-lg">
            {result.total_words} words
          </span>
        )}
        {result.speaking_pace && (
          <span className="text-xs text-gray-400 bg-white/[0.04] px-2.5 py-1 rounded-lg">
            {result.speaking_pace} wpm
          </span>
        )}
      </div>

      {/* Slides */}
      <div className="space-y-3">
        {result.slides.map((slide) => (
          <div key={slide.slide} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-teal-400/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                slide.type === "hook" ? "text-purple-400 bg-purple-400/10" :
                slide.type === "cta" ? "text-orange-400 bg-orange-400/10" :
                "text-teal-400 bg-teal-400/10"
              }`}>
                {slide.type === "hook" ? "Hook" : slide.type === "cta" ? "CTA" : `Slide ${slide.slide}`}
              </span>
              {slide.voiceover_duration && (
                <span className="text-xs text-gray-600">{slide.voiceover_duration}s</span>
              )}
            </div>

            <div className="mb-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400/70 mb-1">On-screen text</p>
              <p className="text-white text-sm font-medium">{slide.on_screen_text}</p>
            </div>

            <div className="mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Voiceover</p>
              <p className="text-gray-300 text-sm leading-relaxed">{slide.voiceover}</p>
            </div>

            {slide.visual_summary && (
              <p className="text-xs text-gray-600 mb-1">
                <span className="text-gray-500">Visual:</span> {slide.visual_summary}
              </p>
            )}
            {slide.retention_note && (
              <p className="text-xs text-gray-600">
                <span className="text-gray-500">Retention:</span> {slide.retention_note}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Caption */}
      {result.caption && (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Caption</span>
            <CopyButton text={result.caption} />
          </div>
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{result.caption}</p>
        </div>
      )}

      {result.why_it_works && (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-xs text-gray-600"><span className="text-gray-500">Why it works:</span> {result.why_it_works}</p>
        </div>
      )}

      <div className="mt-3">
        <FeedbackButtons contentType="instagram_reel" contentSnapshot={{ reel: result }} />
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function InstagramPostPage() {
  const { user, tokenBalance, refreshBalance } = useAuth()
  const router = useRouter()
  const [phase, setPhase] = useState<"questions" | "generating" | "results">("questions")
  const [resultType, setResultType] = useState<ResultType>("caption")
  const [captionPosts, setCaptionPosts] = useState<PostVariant[]>([])
  const [carouselResult, setCarouselResult] = useState<CarouselResult | null>(null)
  const [reelResult, setReelResult] = useState<ReelResult | null>(null)
  const [error, setError] = useState("")
  const [prefillData, setPrefillData] = useState<Record<string, unknown>>({})
  const [selectedFormat, setSelectedFormat] = useState<string>("auto")

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/instagram-profile")
        if (res.ok) {
          const data = await res.json()
          const profile = data.profile
          if (profile) {
            const prefill: Record<string, unknown> = {}
            if (profile.content_format === "carousel-heavy") prefill.format = "carousel"
            if (profile.content_format === "reels-focused") prefill.format = "reel_script"
            if (profile.hook_style === "bold claim") prefill.angle = "hot_take"
            if (profile.hook_style === "personal story") prefill.angle = "bts"
            if (profile.hook_style === "transformation") prefill.angle = "transformation"
            if (Object.keys(prefill).length > 0) setPrefillData(prefill)
          }
        }
      } catch { /* non-critical */ }
    }
    fetchProfile()
  }, [])

  // Build dynamic question list based on selected format
  const questions = useMemo(() => {
    const qs = [...BASE_QUESTIONS]

    if (selectedFormat === "carousel") {
      qs.push(CAROUSEL_DENSITY_QUESTION, CAROUSEL_SLIDES_QUESTION)
    } else if (selectedFormat === "reel_script") {
      qs.push(REEL_DURATION_QUESTION, REEL_HOOK_QUESTION)
    }

    qs.push(...REMAINING_QUESTIONS)
    return qs
  }, [selectedFormat])

  const handleComplete = useCallback(
    async (answers: Record<string, unknown>) => {
      if (!user) {
        router.push("/login?redirect=/dashboard/social-engine/instagram/post")
        return
      }

      const format = answers.format as string || "auto"
      const tokenCost = format === "carousel" ? 5 : format === "reel_script" ? 8 : 3

      if (tokenBalance < tokenCost) {
        setError(`Insufficient tokens. You need ${tokenCost} tokens.`)
        return
      }

      setPhase("generating")
      setError("")

      try {
        let res: Response

        if (format === "carousel") {
          // Route to carousel-script API
          res = await fetch("/api/generate/carousel-script", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic: answers.topic,
              slideCount: parseInt(answers.slideCount as string) || 7,
              density: answers.density || "standard",
              goal: answers.goal,
              angle: answers.angle,
              specifics: answers.specifics || "",
            }),
          })

          const data = await res.json()
          if (!res.ok) {
            setError(data.error || "Generation failed")
            setPhase("questions")
            return
          }

          setCarouselResult(data as CarouselResult)
          setResultType("carousel")
        } else if (format === "reel_script") {
          // Route to reel-script API
          res = await fetch("/api/generate/reel-script", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic: answers.topic,
              duration: answers.duration || "medium",
              hookStyle: answers.hookStyle || "bold_claim",
              goal: answers.goal,
            }),
          })

          const data = await res.json()
          if (!res.ok) {
            setError(data.error || "Generation failed")
            setPhase("questions")
            return
          }

          setReelResult(data as ReelResult)
          setResultType("reel")
        } else {
          // Route to instagram-post API (captions)
          res = await fetch("/api/generate/instagram-post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic: answers.topic,
              format: answers.format,
              goal: answers.goal,
              angle: answers.angle,
              specifics: answers.specifics || "",
            }),
          })

          const data = await res.json()
          if (!res.ok) {
            setError(data.error || "Generation failed")
            setPhase("questions")
            return
          }

          setCaptionPosts(data.posts || [])
          setResultType("caption")
        }

        setPhase("results")
        refreshBalance()
      } catch {
        setError("Something went wrong. Please try again.")
        setPhase("questions")
      }
    },
    [user, tokenBalance, refreshBalance, router]
  )

  const handleStartOver = () => {
    setPhase("questions")
    setCaptionPosts([])
    setCarouselResult(null)
    setReelResult(null)
    setError("")
    setSelectedFormat("auto")
  }

  // Track format selection to dynamically add questions
  // ConversationalQA calls onComplete with all answers, but we need to know the format
  // BEFORE the user reaches the format-specific questions. We use a wrapper.
  const handleCompleteWithFormatTracking = useCallback(
    (answers: Record<string, unknown>) => {
      handleComplete(answers)
    },
    [handleComplete]
  )

  const tokenCost = selectedFormat === "carousel" ? 5 : selectedFormat === "reel_script" ? 8 : 3

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <a
            href="/dashboard/social-engine/instagram"
            className="text-gray-500 hover:text-teal-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Instagram Post</h1>
          <span className="text-xs text-gray-500 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
            {tokenCost} tokens
          </span>
        </div>
        <p className="text-gray-500">
          {selectedFormat === "carousel"
            ? "Generate a carousel script with eyebrow, heading & body copy for each slide."
            : selectedFormat === "reel_script"
            ? "Generate a reel script with on-screen text, voiceover & visual direction."
            : "Answer a few questions and we'll generate content optimised for reach."}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Format selector (shown before ConversationalQA to determine question flow) */}
      {phase === "questions" && (
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2">Format</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Auto", value: "auto" },
              { label: "Carousel", value: "carousel" },
              { label: "Reel Script", value: "reel_script" },
              { label: "Caption", value: "single" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedFormat(opt.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  selectedFormat === opt.value
                    ? "border-teal-400/50 bg-teal-400/10 text-teal-400"
                    : "border-white/[0.1] bg-white/[0.03] text-gray-400 hover:border-white/20"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Q&A Phase */}
      {phase === "questions" && (
        <ConversationalQA
          key={selectedFormat}
          questions={questions}
          onComplete={handleCompleteWithFormatTracking}
          finalButtonLabel={
            selectedFormat === "carousel" ? "Generate Carousel" :
            selectedFormat === "reel_script" ? "Generate Reel Script" :
            "Generate 3 Captions"
          }
          prefillData={{ ...prefillData, format: selectedFormat }}
        />
      )}

      {/* Generating */}
      {phase === "generating" && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-teal-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-white font-medium mb-1">
            {selectedFormat === "carousel" ? "Writing carousel script..." :
             selectedFormat === "reel_script" ? "Writing reel script..." :
             "Writing 3 caption variants..."}
          </p>
          <p className="text-gray-500 text-sm">This takes about 10-20 seconds.</p>
        </div>
      )}

      {/* Results */}
      {phase === "results" && resultType === "caption" && captionPosts.length > 0 && (
        <CaptionResults posts={captionPosts} onStartOver={handleStartOver} />
      )}
      {phase === "results" && resultType === "carousel" && carouselResult && (
        <CarouselResults result={carouselResult} onStartOver={handleStartOver} />
      )}
      {phase === "results" && resultType === "reel" && reelResult && (
        <ReelResults result={reelResult} onStartOver={handleStartOver} />
      )}
    </div>
  )
}
