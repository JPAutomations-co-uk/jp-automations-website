import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

import { createAdminClient } from "@/app/lib/supabase/admin"
import { createClient } from "@/app/lib/supabase/server"

export const runtime = "nodejs"
export const maxDuration = 120 // Claude Vision can take a while with many images

const BUCKET = String(process.env.REEL_MEDIA_BUCKET || "reel-media")
const TEMPLATES = ["dark_luxury", "clean_minimal", "bold_editorial", "warm_natural", "urban_industrial", "bright_playful"]

function getAnthropicClient() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error("ANTHROPIC_API_KEY not configured")
  return new Anthropic({ apiKey: key })
}

/**
 * POST /api/generate/luxury-reel/analyse
 *
 * Phase 1 of the luxury reel flow: analyse uploaded client photos with Claude Vision
 * and return a frame-by-frame plan for user review.
 *
 * Body: { photoAssetKeys: string[], topic?: string, template?: string, slides?: number }
 * Returns: { framePlan: FramePlanJson }
 *
 * No token deduction — analysis is free. Tokens deducted on generation.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const admin = createAdminClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    if (!body || !Array.isArray(body.photoAssetKeys) || body.photoAssetKeys.length === 0) {
      return NextResponse.json({ error: "photoAssetKeys array is required" }, { status: 400 })
    }

    const photoAssetKeys = (body.photoAssetKeys as unknown[])
      .map((k) => String(k || "").trim())
      .filter(Boolean)
      .slice(0, 12) // max 12 photos

    const topic = body.topic ? String(body.topic).trim() : null
    const template = TEMPLATES.includes(String(body.template || "")) ? String(body.template) : null
    const numSlides = Math.min(Math.max(Number(body.slides || 7), 3), 10)

    // Download each photo from Supabase storage and encode as base64
    const imageContentBlocks: Anthropic.ImageBlockParam[] = []
    const photoNames: string[] = []

    for (const assetKey of photoAssetKeys) {
      const { data, error } = await admin.storage.from(BUCKET).download(assetKey)
      if (error || !data) {
        console.warn(`Failed to download photo ${assetKey}: ${error?.message}`)
        continue
      }

      const bytes = Buffer.from(await data.arrayBuffer())
      const b64 = bytes.toString("base64")
      const ext = assetKey.split(".").pop()?.toLowerCase() || "jpg"
      const mediaType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg"
      const filename = assetKey.split("/").pop() || assetKey

      imageContentBlocks.push({
        type: "image",
        source: { type: "base64", media_type: mediaType as Anthropic.Base64ImageSource["media_type"], data: b64 },
      })
      photoNames.push(filename)
    }

    if (imageContentBlocks.length === 0) {
      return NextResponse.json({ error: "Could not load any of the uploaded photos" }, { status: 400 })
    }

    const templateContext = template
      ? `\nVISUAL TEMPLATE: ${template.replace(/_/g, " ")} (use this style for text overlays)`
      : ""

    const topicLine = topic
      ? `Reel topic requested: "${topic}"`
      : "Derive the best reel topic and hook angle from the images above."

    const systemPrompt = `You are a luxury Instagram reel director. You receive a set of real client photos and produce a cinematic frame-by-frame reel plan.

${topicLine}${templateContext}
Photo filenames in order: ${photoNames.join(", ")}
NUMBER OF SLIDES: ${numSlides}

Your output must be a single JSON object with this exact structure:
{
  "reel_concept": {
    "title": "Short reel title",
    "hook_angle": "What makes someone stop scrolling",
    "content_structure": "One sentence on what the content covers",
    "cta": "Call to action text"
  },
  "style_analysis": {
    "palette": "Dominant colours observed",
    "mood": "1-3 mood words",
    "subject": "What is depicted in the photos",
    "quality_level": "luxury / premium / standard"
  },
  "frame_plan": [
    {
      "slide": 1,
      "type": "hook",
      "source_image": "filename.jpg",
      "camera_movement": "Slow dolly-in",
      "higgsfield_prompt": "Slow dolly-in. Warm rim light. Luxury interior.",
      "on_screen_text": "Hook line — max 8 words, stops the scroll",
      "visual_summary": "One sentence: what the viewer sees"
    }
  ]
}

FRAME PLAN RULES:
- slide 1 (hook): Most dramatic image. Highest visual impact. Short punchy text (≤8 words).
- slides 2 to ${numSlides - 2} (content): Each covers one specific point. Vary camera moves.
- slide ${numSlides - 1} (proof): Broader result or overview shot.
- slide ${numSlides} (cta): Warmest, most accessible image. Clear, direct CTA text.
- source_image: use the exact filename from the list above. Repeat best images if more slides than photos, or use "ai_generated" for extra frames.
- higgsfield_prompt: 5-15 words max. Format: "Camera move. Lighting. Scene detail." Examples: "Slow dolly-in. Warm ambient light." | "Gentle pan right. Soft natural light."
- Vary camera movements — never repeat the same move consecutively.
- on_screen_text for content slides: numbered points e.g. "1. Open plan is dead"

Return ONLY the JSON object. No markdown fences, no explanation.`

    const anthropic = getAnthropicClient()

    const contentBlocks: Anthropic.MessageParam["content"] = [
      ...imageContentBlocks,
      { type: "text", text: systemPrompt },
    ]

    const response = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: contentBlocks }],
    })

    const rawText = (response.content[0] as Anthropic.TextBlock).text.trim()
    const cleaned = rawText.startsWith("```") ? rawText.split("\n").slice(1, -1).join("\n") : rawText
    const framePlan = JSON.parse(cleaned) as Record<string, unknown>

    // Basic sanity check
    if (!Array.isArray((framePlan as { frame_plan?: unknown }).frame_plan)) {
      return NextResponse.json({ error: "Claude returned an invalid frame plan structure" }, { status: 500 })
    }

    return NextResponse.json({ framePlan, photoCount: imageContentBlocks.length })
  } catch (error) {
    console.error("Luxury reel analyse error:", error)
    const message = error instanceof Error ? error.message : "Analysis failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
