import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

import { createAdminClient } from "@/app/lib/supabase/admin"
import { createClient } from "@/app/lib/supabase/server"
import { buildAnalyzePrompt, buildBriefPrompt } from "@/app/lib/reel-intake/prompts"
import { TEMPLATES } from "@/app/lib/reel-intake/templates"
import type { InputMode } from "@/app/lib/reel-intake/types"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import { getProfileContext } from "@/app/lib/profile-context"

export const runtime = "nodejs"
export const maxDuration = 120

const BUCKET = String(process.env.REEL_MEDIA_BUCKET || "reel-media")
const VALID_INPUT_MODES: InputMode[] = ["own_images", "ai_images"]
const VALID_TEMPLATES = Object.keys(TEMPLATES)
const MAX_TOPIC_LENGTH = 500
const MAX_ANSWER_LENGTH = 500

function getAnthropicClient() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error("ANTHROPIC_API_KEY not configured")
  return new Anthropic({ apiKey: key })
}

function cleanJsonResponse(raw: string): string {
  return raw.trim().replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "")
}

function safeJsonParse(raw: string): { data: unknown; error: string | null } {
  try {
    return { data: JSON.parse(cleanJsonResponse(raw)), error: null }
  } catch {
    return { data: null, error: "AI returned invalid JSON — please retry" }
  }
}

/** Coerce values to string & truncate to prevent prompt injection */
function sanitizeAnswers(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const key = String(k).slice(0, 100)
    const val = String(v ?? "").replace(/^\n+/, "").slice(0, MAX_ANSWER_LENGTH)
    out[key] = val
  }
  return out
}

/**
 * POST /api/generate/reel/intake
 *
 * Two actions:
 *   action: "analyze" — Claude Vision analyses images + topic → returns tailored questions (free)
 *   action: "brief"   — Claude generates per-slide creative brief from answers (free)
 *
 * Generation is handled by existing endpoints:
 *   - Own images → POST /api/generate/luxury-reel (Higgsfield)
 *   - AI images  → POST /api/generate/reel (Flux Pro)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const actorId = resolveRequestActorId({ userId: user.id, forwardedFor: request.headers.get("x-forwarded-for") })
    const rate = checkRateLimit(`generate-reel-intake:${actorId}`, { max: 10, windowMs: 60_000 })
    if (!rate.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please retry shortly." }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } })
    }

    const body = await request.json().catch(() => null)
    if (!body || !body.action) {
      return NextResponse.json({ error: "action is required" }, { status: 400 })
    }

    // Fetch profile context for the user
    const { contextBlock } = await getProfileContext(user.id, "instagram")

    const action = String(body.action)

    if (action === "analyze") {
      return handleAnalyze(body, contextBlock)
    }
    if (action === "brief") {
      return handleBrief(body, contextBlock)
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  } catch (error) {
    console.error("Reel intake error:", error)
    return NextResponse.json({ error: "Intake request failed" }, { status: 500 })
  }
}

/* ================================================================== */
/*  ANALYZE — analyse images/topic, return tailored questions          */
/* ================================================================== */

async function handleAnalyze(body: Record<string, unknown>, profileContext: string) {
  const topic = String(body.topic || "").trim().slice(0, MAX_TOPIC_LENGTH)
  const inputMode = VALID_INPUT_MODES.includes(body.inputMode as InputMode)
    ? (body.inputMode as InputMode)
    : "own_images"

  const imageAssetKeys = (Array.isArray(body.imageAssetKeys) ? body.imageAssetKeys : [])
    .map((k: unknown) => String(k || "").trim())
    .filter(Boolean)
    .slice(0, 12)

  const templateId = VALID_TEMPLATES.includes(String(body.template || ""))
    ? String(body.template)
    : null
  const template = templateId ? TEMPLATES[templateId] : null

  if (!topic && imageAssetKeys.length === 0) {
    return NextResponse.json(
      { error: "Either a topic or images are required" },
      { status: 400 },
    )
  }

  const hasImages = imageAssetKeys.length > 0
  const promptText = buildAnalyzePrompt(topic, inputMode, hasImages, template)

  // Inject profile context so questions are tailored to the user's brand
  const systemPrompt = `You are an Instagram reel creative director. You create content that matches the creator's unique brand voice and aesthetic.

═══ CREATOR CONTEXT ═══
${profileContext}

Use this context to:
- Tailor question options to their niche and audience
- Pre-fill defaults that match their established style
- Suggest moods, angles, and CTAs aligned with their brand
- Reference their industry language in question labels`

  const anthropic = getAnthropicClient()
  let contentBlocks: Anthropic.MessageParam["content"]

  if (hasImages) {
    // Download images from Supabase and encode as base64 for Claude Vision
    const admin = createAdminClient()
    const imageBlocks: Anthropic.ImageBlockParam[] = []

    for (const assetKey of imageAssetKeys) {
      try {
        const { data, error } = await admin.storage.from(BUCKET).download(assetKey)
        if (error || !data) {
          console.warn(`Failed to download image ${assetKey}: ${error?.message}`)
          continue
        }
        const bytes = Buffer.from(await data.arrayBuffer())
        if (bytes.length > 20 * 1024 * 1024) {
          console.warn(`Skipping ${assetKey}: exceeds 20MB limit for Claude Vision`)
          continue
        }
        const ext = assetKey.split(".").pop()?.toLowerCase() || "jpg"
        const mediaType = ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : "image/jpeg"

        imageBlocks.push({
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType as Anthropic.Base64ImageSource["media_type"],
            data: bytes.toString("base64"),
          },
        })
      } catch (e) {
        console.warn(`Error processing image ${assetKey}:`, e)
      }
    }

    if (imageBlocks.length === 0 && !topic) {
      return NextResponse.json(
        { error: "Could not load any of the uploaded images and no topic provided" },
        { status: 400 },
      )
    }

    contentBlocks = [
      ...imageBlocks,
      { type: "text" as const, text: promptText },
    ]
  } else {
    contentBlocks = promptText
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: contentBlocks }],
  })

  const rawText = (response.content[0] as Anthropic.TextBlock).text.trim()
  const { data: parsed, error: parseError } = safeJsonParse(rawText)
  if (parseError || !parsed) {
    console.error("Analyze JSON parse failed. Raw:", rawText.slice(0, 500))
    return NextResponse.json({ error: parseError }, { status: 500 })
  }

  const result = parsed as Record<string, unknown>
  return NextResponse.json({
    imageAnalysis: result.imageAnalysis || null,
    inferredTemplate: result.inferredTemplate || null,
    inferredMood: result.inferredMood || null,
    questions: Array.isArray(result.questions) ? result.questions : [],
    inputMode,
  })
}

/* ================================================================== */
/*  BRIEF — generate per-slide creative brief from answers             */
/* ================================================================== */

async function handleBrief(body: Record<string, unknown>, profileContext: string) {
  const topic = String(body.topic || "").trim().slice(0, MAX_TOPIC_LENGTH)
  const inputMode = VALID_INPUT_MODES.includes(body.inputMode as InputMode)
    ? (body.inputMode as InputMode)
    : "own_images"

  const answers = sanitizeAnswers(body.answers)

  if (!topic) {
    return NextResponse.json({ error: "topic is required" }, { status: 400 })
  }
  if (Object.keys(answers).length === 0) {
    return NextResponse.json({ error: "answers are required" }, { status: 400 })
  }

  // Resolve template — from answers, body, or inferred
  const templateId = String(
    answers.template || body.template || body.inferredTemplate || "dark_luxury"
  )
  const template = TEMPLATES[templateId]
  if (!template) {
    return NextResponse.json({ error: `Unknown template: ${templateId}` }, { status: 400 })
  }

  const imageAssetKeys = (Array.isArray(body.imageAssetKeys) ? body.imageAssetKeys : [])
    .map((k: unknown) => String(k || "").trim())
    .filter(Boolean)
    .slice(0, 12)

  const imageAnalysis = body.imageAnalysis ? String(body.imageAnalysis).slice(0, 2000) : undefined

  // For own_images mode, extract photo filenames from asset keys
  const photoFilenames = imageAssetKeys.map(
    (k: string) => k.split("/").pop() || k
  )

  // Build prompt — include images for Vision-aware brief generation
  const promptText = buildBriefPrompt(
    topic,
    template,
    answers,
    inputMode,
    imageAnalysis,
    inputMode === "own_images" ? photoFilenames : undefined,
  )

  // Inject profile context so the brief matches the creator's brand voice
  const systemPrompt = `You are an Instagram reel creative director and content strategist. Create briefs that match the creator's unique brand, voice, and audience.

═══ CREATOR CONTEXT ═══
${profileContext}

Use this context to:
- Write on-screen text in their voice and tone
- Reference their offers, USP, and proof points when relevant
- Target their specific audience with appropriate language
- Align hook angles and CTAs with their content strategy
- Match visual style to their aesthetic preferences`

  const anthropic = getAnthropicClient()
  let contentBlocks: Anthropic.MessageParam["content"]

  if (imageAssetKeys.length > 0) {
    const admin = createAdminClient()
    const imageBlocks: Anthropic.ImageBlockParam[] = []

    for (const assetKey of imageAssetKeys) {
      try {
        const { data, error } = await admin.storage.from(BUCKET).download(assetKey)
        if (error || !data) continue
        const bytes = Buffer.from(await data.arrayBuffer())
        if (bytes.length > 20 * 1024 * 1024) continue
        const ext = assetKey.split(".").pop()?.toLowerCase() || "jpg"
        const mediaType = ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : "image/jpeg"

        imageBlocks.push({
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType as Anthropic.Base64ImageSource["media_type"],
            data: bytes.toString("base64"),
          },
        })
      } catch {
        // skip failed images
      }
    }

    contentBlocks = [
      ...imageBlocks,
      { type: "text" as const, text: promptText },
    ]
  } else {
    contentBlocks = promptText
  }

  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 6000,
    system: systemPrompt,
    messages: [{ role: "user", content: contentBlocks }],
  })

  const rawText = (response.content[0] as Anthropic.TextBlock).text.trim()
  const { data: parsed, error: parseError } = safeJsonParse(rawText)
  if (parseError || !parsed) {
    console.error("Brief JSON parse failed. Raw:", rawText.slice(0, 500))
    return NextResponse.json({ error: parseError }, { status: 500 })
  }

  const result = parsed as Record<string, unknown>
  const brief = (result.brief || result) as Record<string, unknown>
  if (!brief.slides || !Array.isArray(brief.slides)) {
    return NextResponse.json(
      { error: "AI returned an invalid brief structure — please retry" },
      { status: 500 },
    )
  }

  // Ensure inputMode is set
  brief.inputMode = inputMode
  brief.template = brief.template || templateId

  return NextResponse.json({ brief })
}
