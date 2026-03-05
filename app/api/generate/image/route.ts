import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { Database } from "@/types/supabase"

const FEATURE_KEY = "single_image"
const TOKEN_COST = 5

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

    const { prompt, aspectRatio = "1:1" } = await request.json()

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Validate aspect ratio
    const validRatios = ["1:1", "4:5", "9:16", "16:9"]
    if (!validRatios.includes(aspectRatio)) {
      return NextResponse.json(
        { error: "Invalid aspect ratio", valid: validRatios },
        { status: 400 }
      )
    }

    // Deduct tokens first
    const admin = createAdminClient()
    try {
      const { data: newBalance, error: debitError } = await admin.rpc(
        "debit_tokens",
        {
          p_user_id: user.id,
          p_amount: TOKEN_COST,
          p_type: "feature_use",
          p_description: `Generated single image`,
        }
      )

      if (debitError) throw debitError

      // Generate image with Flux Pro
      const output = await getReplicate().run("black-forest-labs/flux-1.1-pro", {
        input: {
          prompt: prompt.trim(),
          aspect_ratio: aspectRatio,
          output_format: "webp",
          output_quality: 90,
          safety_tolerance: 2,
          prompt_upsampling: true,
        },
      })

      // output is a URL string for this model
      const imageUrl = typeof output === "string" ? output : String(output)

      // --- PERSISTENCE START ---
      const { data: assetData, error: assetError } = await supabase
        .from("generated_assets")
        .insert({
          user_id: user.id,
          asset_type: "image",
          url: imageUrl,
          prompt: prompt.trim(),
          meta: { aspect_ratio: aspectRatio },
        })
        .select()
        .single()

      if (assetError) {
        console.error("Failed to save generated asset:", assetError)
      }
      // --- PERSISTENCE END ---

      return NextResponse.json({
        imageUrl,
        assetId: assetData?.id,
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
    console.error("Image generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    )
  }
}
