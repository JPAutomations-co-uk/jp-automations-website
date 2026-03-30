import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { getProfileContext } from "@/app/lib/profile-context"
import { buildMasterSystemPrompt, getUserFeedbackContext } from "@/app/lib/linkedin-master-prompt"

const TOKEN_COST = 1
const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function safeParseHooks(text: string): string[] | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```\s*$/m, "")
    .trim()
  const arrMatch = cleaned.match(/\[[\s\S]*\]/)
  if (!arrMatch) return null
  try {
    const parsed = JSON.parse(arrMatch[0])
    if (Array.isArray(parsed) && parsed.every((h) => typeof h === "string")) {
      return parsed
    }
    return null
  } catch {
    return null
  }
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
    const { topic, context } = body

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 })
    }

    const safeTopic = String(topic).slice(0, 500).trim()
    const safeContext = context ? String(context).slice(0, 500).trim() : ""

    const { contextBlock } = await getProfileContext(user.id, "linkedin")
    const feedbackConstraints = await getUserFeedbackContext(user.id)

    const userPrompt = `Generate exactly 10 diverse LinkedIn hooks for this topic.

TOPIC: ${safeTopic}${safeContext ? `\n\nADDITIONAL CONTEXT: ${safeContext}` : ""}

RULES:
- Each hook must use a DIFFERENT formula from the 21 hook formulas in your instructions
- Each hook is ~110–140 characters (stops at the mobile "see more" cutoff)
- Never start with "I" or a business name
- At least 3 hooks must include a specific number in the first 8 words
- Vary the emotional register: some bold/confrontational, some analytical, some personal/vulnerable, some curiosity-driven
- Every hook must sound like THIS specific person based on their voice — not a LinkedIn template
- No two hooks should use the same opener structure

Respond with valid JSON only — a plain array of 10 strings, no other keys, no markdown:
["hook 1", "hook 2", "hook 3", "hook 4", "hook 5", "hook 6", "hook 7", "hook 8", "hook 9", "hook 10"]`

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: buildMasterSystemPrompt(contextBlock, feedbackConstraints),
      messages: [{ role: "user", content: userPrompt }],
    })

    const responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
    const hooks = safeParseHooks(responseText)

    if (!hooks || hooks.length === 0) {
      return NextResponse.json({ error: "Failed to generate hooks" }, { status: 500 })
    }

    const admin = createAdminClient()
    try {
      const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
        p_user_id: user.id,
        p_amount: TOKEN_COST,
        p_type: "feature_use",
        p_description: "Generated 10 LinkedIn hooks",
      } as never)

      if (debitError) throw debitError

      return NextResponse.json({ hooks, balance: newBalance, deducted: TOKEN_COST })
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
    console.error("LinkedIn hooks generation error:", error)
    return NextResponse.json({ error: "Failed to generate hooks" }, { status: 500 })
  }
}
