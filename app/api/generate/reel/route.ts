import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

const FEATURE_KEY = "reel"
const TOKEN_COST = 15
const SLIDE_COUNT = 7

const getReplicate = () => new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { topic, vibeMotion = false } = await request.json()

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const prompts = generateReelSlidePrompts(topic.trim())

    const admin = createAdminClient()
    try {
      const { data: newBalance, error: debitError } = await admin.rpc(
        "debit_tokens",
        {
          p_user_id: user.id,
          p_amount: TOKEN_COST,
          p_type: "feature_use",
          p_description: `Generated reel: ${topic.trim().slice(0, 50)}`,
        }
      )

      if (debitError) throw debitError

      // Generate all slides in parallel at 9:16 (reel/story format)
      const slidePromises = prompts.map((prompt) =>
        getReplicate().run("black-forest-labs/flux-1.1-pro", {
          input: {
            prompt,
            aspect_ratio: "9:16",
            output_format: "webp",
            output_quality: 90,
            safety_tolerance: 2,
            prompt_upsampling: true,
          },
        })
      )

      const results = await Promise.allSettled(slidePromises)

      const slides = results.map((result, i) => {
        if (result.status === "fulfilled") {
          const url = typeof result.value === "string"
            ? result.value
            : String(result.value)
          return { index: i, imageUrl: url, status: "success" as const }
        }
        return { index: i, imageUrl: null, status: "failed" as const }
      })

      const successCount = slides.filter((s) => s.status === "success").length
      const validSlides = slides.filter((s) => s.status === "success" && s.imageUrl)

      let assetId = null
      if (validSlides.length > 0) {
        const { data: assetData, error: assetError } = await supabase
          .from("generated_assets")
          .insert({
            user_id: user.id,
            asset_type: "reel",
            url: validSlides[0].imageUrl!,
            prompt: topic.trim(),
            meta: {
              topic: topic.trim(),
              slide_count: validSlides.length,
              vibe_motion: vibeMotion,
              slides: validSlides,
            },
          })
          .select()
          .single()

        if (assetError) {
          console.error("Failed to save reel asset:", assetError)
        } else {
          assetId = assetData.id
        }
      }

      return NextResponse.json({
        slides,
        topic: topic.trim(),
        vibeMotion,
        totalSlides: SLIDE_COUNT,
        successCount,
        assetId,
        balance: newBalance,
        deducted: TOKEN_COST,
        feature: FEATURE_KEY,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Insufficient tokens", balance_needed: TOKEN_COST },
          { status: 402 }
        )
      }
      throw err
    }
  } catch (error) {
    console.error("Reel generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate reel" },
      { status: 500 }
    )
  }
}

function generateReelSlidePrompts(topic: string): string[] {
  return [
    // Slide 1 — Hook (bold, attention-grabbing)
    `Bold hook slide for Instagram reel about ${topic}: dramatic eye-catching composition, strong contrast, cinematic lighting, vertical 9:16 portrait format, professional photography, scroll-stopping visual`,
    // Slide 2 — Problem / Context
    `Context slide for Instagram reel about ${topic}: authentic real-world scene, natural lighting, editorial photography style, vertical portrait format, relatable everyday setting`,
    // Slide 3 — Key Point 1
    `Educational point slide for Instagram reel about ${topic}: clean minimal composition, modern aesthetic, professional photography, vertical portrait format, warm soft lighting`,
    // Slide 4 — Key Point 2
    `Detail reveal slide for Instagram reel about ${topic}: close-up focused composition, beautiful textures and details, macro photography style, vertical portrait format, studio lighting`,
    // Slide 5 — Key Point 3
    `Lifestyle integration slide for Instagram reel about ${topic}: aspirational scene with natural environment, people in context, golden hour lighting, editorial style, vertical portrait format`,
    // Slide 6 — Social proof / result
    `Results and transformation slide for Instagram reel about ${topic}: before-after concept, dramatic improvement visualization, professional photography, vertical portrait format, compelling visual storytelling`,
    // Slide 7 — CTA
    `Call-to-action slide for Instagram reel about ${topic}: hero shot with strong visual impact, aspirational composition, cinematic dramatic lighting, vertical portrait format, premium brand aesthetic`,
  ]
}
