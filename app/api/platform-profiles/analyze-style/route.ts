import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

const VALID_PLATFORMS = ["linkedin", "instagram", "x", "youtube"] as const

// POST — Analyze uploaded example images with Claude Vision to extract style description
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { platform, imageUrls } = await request.json()

    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json({ error: "Valid platform is required" }, { status: 400 })
    }

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: "At least one image URL is required" }, { status: 400 })
    }

    // Build image content blocks for Claude Vision
    const imageBlocks: Anthropic.ImageBlockParam[] = []

    const admin = createAdminClient()
    const bucket = "platform-examples"

    for (const url of imageUrls.slice(0, 5)) {

      // Extract the path from the URL (after the bucket name)
      const pathMatch = String(url).match(/platform-examples\/(.+)/)
      if (!pathMatch) continue

      const { data: fileData, error } = await admin.storage.from(bucket).download(pathMatch[1])
      if (error || !fileData) continue

      const buffer = Buffer.from(await fileData.arrayBuffer())
      const base64 = buffer.toString("base64")

      // Detect media type from URL
      const ext = String(url).split(".").pop()?.toLowerCase() || "png"
      const mediaTypeMap: Record<string, Anthropic.ImageBlockParam["source"]["media_type"]> = {
        jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
        gif: "image/gif", webp: "image/webp",
      }
      const mediaType = mediaTypeMap[ext] || "image/png"

      imageBlocks.push({
        type: "image",
        source: { type: "base64", media_type: mediaType, data: base64 },
      })
    }

    if (imageBlocks.length === 0) {
      return NextResponse.json({ error: "Could not process any images" }, { status: 422 })
    }

    // Analyze with Claude Vision
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: [
            ...imageBlocks,
            {
              type: "text",
              text: `Analyze these ${platform} post example screenshots. Extract a concise style guide (max 150 words) covering:
1. Visual style: colours, layout, typography, imagery choices
2. Copy style: sentence length, tone, formatting patterns, emoji usage
3. Content patterns: how they open posts, how they structure content, CTA style

Write in second person ("You use...") as if describing this person's established style back to them. Be specific and actionable — this will be fed into an AI to replicate their style.`,
            },
          ],
        },
      ],
    })

    const styleDescription = message.content[0]?.type === "text" ? message.content[0].text : ""

    if (!styleDescription) {
      return NextResponse.json({ error: "Failed to extract style description" }, { status: 500 })
    }

    // Save to platform profile
    await admin
      .from("platform_profiles")
      .update({ style_description: styleDescription, updated_at: new Date().toISOString() } as never)
      .eq("user_id", user.id)
      .eq("platform", platform)

    return NextResponse.json({ styleDescription })
  } catch (error) {
    console.error("Style analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze style" }, { status: 500 })
  }
}
