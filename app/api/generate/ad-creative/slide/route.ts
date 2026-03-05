import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const SLIDE_REGEN_COST = 2

const PLATFORM_TONE: Record<string, string> = {
  instagram: "punchy, scroll-stopping, visual-first — hooks that stop the feed",
  facebook: "conversational and direct — clear value proposition, approachable",
  linkedin: "B2B professional — authority-focused, data and outcomes, no slang",
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const {
    template,
    slide_num,
    total_slides,
    topic,
    offer = "",
    pain_point = "",
    cta_text = "Book a Free Call",
    platform = "instagram",
    brand_context = "",
  } = body

  if (!template || !slide_num || !topic) {
    return NextResponse.json({ error: "Missing required fields: template, slide_num, topic" }, { status: 400 })
  }

  const admin = createAdminClient()

  // Deduct tokens first
  const { data: newBalance, error: tokenError } = await admin.rpc("debit_tokens", {
    p_user_id: user.id,
    p_amount: SLIDE_REGEN_COST,
    p_type: "feature_use",
    p_description: "Regenerated ad slide",
  })

  if (tokenError) {
    const msg = (tokenError as { message?: string }).message || ""
    if (msg.includes("Insufficient")) {
      return NextResponse.json({ error: "Insufficient tokens", balance_needed: SLIDE_REGEN_COST }, { status: 402 })
    }
    console.error("Token error:", tokenError)
    return NextResponse.json({ error: "Failed to deduct tokens" }, { status: 500 })
  }

  const platformTone = PLATFORM_TONE[platform] || PLATFORM_TONE.instagram

  const prompt = `You are writing copy for a single slide in a "${template.replace(/_/g, " ")}" ad carousel.

CONTEXT:
- Business: ${brand_context || "Not specified"}
- Topic: ${topic}
- This is slide ${slide_num} of ${total_slides}
- Platform: ${platform} — ${platformTone}
- Offer/lead magnet: ${offer || "None"}
- Key pain point: ${pain_point || "Not specified"}
- CTA button text: "${cta_text}"

Write fresh, compelling copy for slide ${slide_num}. The content should fit logically in a ${total_slides}-slide sequence about the topic.

Return ONLY valid JSON with no markdown fences:
{
  "headline": "...",
  "body": "...",
  "cta": "${cta_text}"
}

Rules:
- Headline: max 8 words, punchy and specific
- Body: max 2 short sentences, specific to the topic
- Do not use placeholders or generic filler`

  try {
    const anthropic = new Anthropic()
    const message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    })

    const rawText = message.content[0].type === "text" ? message.content[0].text : ""
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid response from Claude" }, { status: 500 })
    }

    const slide = JSON.parse(jsonMatch[0])
    return NextResponse.json({ slide, balance: newBalance })
  } catch (err) {
    console.error("Slide regen error:", err)
    return NextResponse.json({ error: "Failed to generate slide" }, { status: 500 })
  }
}
