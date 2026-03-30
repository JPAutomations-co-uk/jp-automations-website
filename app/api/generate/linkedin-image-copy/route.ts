import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

const TOKEN_COST = 1
const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Per-style instructions for structuring the copy
const STYLE_FORMAT_INSTRUCTIONS: Record<string, string> = {
  whiteboard:
    "Format as 3–6 clear sections, each with a short heading (2–4 words) and 1–3 bullet points. Remove the hook and CTA — keep only the core educational content. Use plain language.",
  dark_stat_card:
    "Extract the single most powerful number or stat from the post. Format as exactly 3 lines:\nLine 1: The number or stat (e.g. '73%' or '£40k in 90 days')\nLine 2: One supporting line of context or implication (under 12 words)\nLine 3: Short source label if present, otherwise omit this line entirely.",
  napkin_sketch:
    "Convert to 5–8 short rough fragments or phrases that capture the key ideas. Each fragment under 6 words. Include 1–2 directional phrases like 'leads to...' or 'starts with...' where relevant. No full sentences.",
  blueprint:
    "Break into clear components, steps, or layers. Format as labelled nodes: COMPONENT_NAME: brief description (under 8 words). Include INPUT/OUTPUT or TRIGGER/RESULT labels where relevant. 3–8 nodes total.",
  terminal:
    "Format as annotated code-style lines (5–10 lines). Use # for insight comments and VARIABLE_NAME='value' for key outcomes. No full sentences — use fragments, abbreviations, and shorthand.",
  sticky_board:
    "Break into 4–8 sticky-note phrases. Each phrase under 8 words, one key idea per line. List them as plain lines — no bullet points, no formatting.",
  newspaper:
    "Format as:\nHEADLINE: [single most powerful sentence from the post — bold, punchy]\nDECK: [one supporting sentence, under 20 words]\nOPENING: [2–3 sentences expanding on the headline, using content from the post]",
  cinematic:
    "Extract the single most powerful sentence from the post. Output only that one sentence — nothing else. It must be punchy, standalone, and memorable out of context.",
  split_screen:
    "Format as two labelled sections:\nBEFORE:\n- [state 1, under 8 words]\n- [state 2, under 8 words]\n- [state 3, under 8 words]\nAFTER:\n- [result 1, under 8 words]\n- [result 2, under 8 words]\n- [result 3, under 8 words]\nUse 3–5 items per side.",
  quote_card:
    "Extract the single most quotable line from the post. Output only that one sentence. It must be complete, standalone, and memorable out of context.",
  a1_paper:
    "Organise the full content as structured notes. Use clear headings, sub-points, and numbered steps where relevant. Preserve all key ideas. Format as you would for a mind map, cheat sheet, or step-by-step on a large sheet of paper.",
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { postContent, styleId } = body

    if (!postContent || typeof postContent !== "string" || !postContent.trim()) {
      return NextResponse.json({ error: "postContent is required" }, { status: 400 })
    }

    const safeContent = String(postContent).slice(0, 3000).trim()
    const safeStyle =
      styleId && typeof styleId === "string" && STYLE_FORMAT_INSTRUCTIONS[styleId]
        ? styleId
        : "whiteboard"

    const formatInstruction = STYLE_FORMAT_INSTRUCTIONS[safeStyle]

    const systemPrompt = `You are a content formatter. You extract and restructure information from a LinkedIn post into the exact format required for a specific image style.

Rules:
- Only use information already present in the post — do not add new facts, statistics, or claims
- Output the formatted content only — no introduction, no explanation, no commentary
- Follow the format specification exactly`

    const userPrompt = `Post content:
${safeContent}

---

Format this content for the following image style:

${formatInstruction}

Output the formatted content only — nothing else.`

    const message = await getAnthropic().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    })

    const copy = message.content[0]?.type === "text" ? message.content[0].text.trim() : ""

    if (!copy) {
      return NextResponse.json({ error: "Failed to generate image copy" }, { status: 500 })
    }

    const admin = createAdminClient()
    try {
      const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
        p_user_id: user.id,
        p_amount: TOKEN_COST,
        p_type: "feature_use",
        p_description: "Generated LinkedIn image copy",
      } as never)

      if (debitError) throw debitError

      return NextResponse.json({ copy, balance: newBalance, deducted: TOKEN_COST })
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err)
      if (errMessage.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Insufficient tokens", balance_needed: TOKEN_COST },
          { status: 402 }
        )
      }
      throw err
    }
  } catch (error) {
    console.error("LinkedIn image copy generation error:", error)
    return NextResponse.json({ error: "Failed to generate image copy" }, { status: 500 })
  }
}
