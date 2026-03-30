import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { getProfileContext } from "@/app/lib/profile-context"

const TOKEN_COST = 3

export async function POST(request: NextRequest) {
  try {
    // Auth
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check token balance
    const admin = createAdminClient()
    const { data: balance } = await admin
      .from("token_balances")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    if (!balance || balance.balance < TOKEN_COST) {
      return NextResponse.json(
        { error: `Insufficient tokens. Need ${TOKEN_COST} but have ${balance?.balance || 0}.` },
        { status: 402 }
      )
    }

    const { prompt, aspectRatio = "1:1" } = await request.json()

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Generate image with Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_IMAGE_MODEL || "gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      } as never,
    })

    // Fetch profile context for style-aware image generation
    const { profile, platformProfile } = await getProfileContext(user.id, "linkedin")
    const styleNotes = platformProfile?.style_description || ""
    const industry = profile.industry || ""

    let styleClause = "Style: clean, modern, corporate-friendly, subtle colours."
    if (styleNotes) {
      styleClause = `Visual style reference: ${styleNotes.slice(0, 300)}`
    } else if (industry) {
      styleClause = `Style: clean, modern, professional — suitable for the ${industry} industry. Subtle colours.`
    }

    const enhancedPrompt = `Generate a professional, high-quality image for a LinkedIn post. ${prompt}. ${styleClause} Aspect ratio: ${aspectRatio}. No text overlay or watermarks.`

    const result = await model.generateContent(enhancedPrompt)
    const response = result.response

    // Extract image from response
    let imageBase64 = ""
    let imageMimeType = "image/png"

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if ((part as { inlineData?: { data: string; mimeType: string } }).inlineData) {
          const inlineData = (part as { inlineData: { data: string; mimeType: string } }).inlineData
          imageBase64 = inlineData.data
          imageMimeType = inlineData.mimeType || "image/png"
          break
        }
      }
      if (imageBase64) break
    }

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No image was generated. Try a different prompt." },
        { status: 422 }
      )
    }

    // Debit tokens
    const { error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: TOKEN_COST,
      p_description: "LinkedIn image generation (Gemini)",
    })

    if (debitError) {
      console.error("Token debit error:", debitError)
      return NextResponse.json({ error: "Failed to debit tokens" }, { status: 500 })
    }

    // Return as data URL
    const imageUrl = `data:${imageMimeType};base64,${imageBase64}`

    return NextResponse.json({
      imageUrl,
      mimeType: imageMimeType,
      tokensCost: TOKEN_COST,
    })
  } catch (error) {
    console.error("Gemini image generation error:", error)
    return NextResponse.json(
      { error: "Image generation failed. Please try again." },
      { status: 500 }
    )
  }
}
