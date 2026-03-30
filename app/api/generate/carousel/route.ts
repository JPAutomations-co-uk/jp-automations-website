import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { Database } from "@/types/supabase"

const FEATURE_KEY = "carousel"
const TOKEN_COST = 10
const SLIDE_COUNT = 7

const getReplicate = () => new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { topic, slidePrompts } = await request.json()

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // If custom slide prompts provided, validate them
    const prompts: string[] = slidePrompts && Array.isArray(slidePrompts)
      ? slidePrompts.slice(0, SLIDE_COUNT)
      : generateSlidePrompts(topic.trim())

    // Deduct tokens first
    const admin = createAdminClient()
    try {
      const { data: newBalance, error: debitError } = await admin.rpc(
        "debit_tokens",
        {
          p_user_id: user.id,
          p_amount: TOKEN_COST,
          p_type: "feature_use",
          p_description: `Generated carousel: ${topic.trim().slice(0, 50)}`,
        }
      )

      if (debitError) throw debitError

      // Generate all slides in parallel
      const slidePromises = prompts.map((prompt) =>
        getReplicate().run("black-forest-labs/flux-1.1-pro", {
          input: {
            prompt,
            aspect_ratio: "4:5",
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

      // --- PERSISTENCE START ---
      let assetId = null
      if (validSlides.length > 0) {
        // We save the carousel as a single asset, using the first slide as the main URL
        // and storing all slide URLs in metadata
        const mainUrl = validSlides[0].imageUrl!

        const { data: assetData, error: assetError } = await supabase
          .from("generated_assets")
          .insert({
            user_id: user.id,
            asset_type: "carousel",
            url: mainUrl,
            prompt: topic.trim(),
            meta: {
              topic: topic.trim(),
              slide_count: validSlides.length,
              slides: validSlides
            },
          })
          .select()
          .single()

        if (assetError) {
          console.error("Failed to save carousel asset:", assetError)
        } else {
          assetId = assetData.id
        }
      }
      // --- PERSISTENCE END ---

      return NextResponse.json({
        slides,
        topic: topic.trim(),
        totalSlides: prompts.length,
        successCount,
        assetId,
        balance: newBalance,
        deducted: TOKEN_COST,
        feature: FEATURE_KEY,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error("Carousel generation inner error:", message, err)
      if (message.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Insufficient tokens", balance_needed: TOKEN_COST },
          { status: 402 }
        )
      }
      return NextResponse.json(
        { error: `Carousel generation failed: ${message}` },
        { status: 500 }
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Carousel generation error:", message, error)
    return NextResponse.json(
      { error: `Failed to generate carousel: ${message}` },
      { status: 500 }
    )
  }
}

function generateSlidePrompts(topic: string): string[] {
  const angles = [
    `Cover slide: bold, eye-catching architectural photography of ${topic}, dramatic lighting, professional real estate photography style, 4:5 portrait`,
    `Educational slide about ${topic}: clean modern architecture detail shot, minimalist composition, warm natural lighting, editorial photography`,
    `Before and after concept for ${topic}: split composition showing transformation, architectural renovation, professional photography`,
    `Technical detail of ${topic}: close-up architectural detail, textures and materials, macro photography style, soft natural light`,
    `Lifestyle context for ${topic}: modern architecture in natural setting, people enjoying space, warm golden hour lighting, editorial style`,
    `Data visualization concept for ${topic}: clean modern interior with geometric patterns, minimalist design, professional photography`,
    `Call-to-action slide for ${topic}: stunning architectural hero shot, dramatic perspective, professional real estate photography, aspirational`,
  ]
  return angles
}
