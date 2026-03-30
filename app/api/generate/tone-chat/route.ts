import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const TONE_SYSTEM_PROMPT = `You are a tone-of-voice analyst for a social media content tool. Your job is to interview the user through a short conversation to deeply understand their unique writing voice, then produce a structured tone profile.

## Conversation flow
1. First, ask for examples of copy they've written (captions, ads, emails, tweets).
2. Then ask them to describe their tone in their own words.
3. Ask 1-3 follow-up questions to clarify specifics: formality level, humor style, sentence structure preferences, vocabulary choices, emotional register, industry jargon usage.
4. When you have enough clarity (usually after 3-6 total user messages), produce the final profile.

## Rules
- Ask ONE question at a time. Keep questions concise and conversational.
- Be warm and encouraging — make them feel understood, not interrogated.
- Pay close attention to HOW they write their answers, not just what they say — their own messages are data points about their tone.
- When you're ready to produce the profile, generate a demo X (Twitter) post that showcases the tone. Make it feel authentic and topical to what they do.

## Response format
You MUST respond with valid JSON only. No markdown, no backticks, no explanation outside the JSON.

When asking a question:
{"type": "question", "content": "Your question here"}

When producing the final profile:
{"type": "profile", "profile": {"summary": "One-line summary of their tone", "attributes": ["3-6 adjectives"], "doList": ["3-5 things to do when writing in their voice"], "dontList": ["3-5 things to avoid"], "vocabulary": "Brief description of word choice patterns", "sentenceStyle": "Brief description of sentence structure", "systemPrompt": "A reusable instruction paragraph that could be prepended to any LLM prompt to reproduce this exact tone of voice. Be specific and detailed."}, "demoPost": "A realistic X/Twitter post (under 280 chars) written perfectly in their tone"}`

function safeJsonParse(text: string): unknown | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```\s*$/m, "")
    .trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null
  try {
    return JSON.parse(jsonMatch[0])
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const actorId = resolveRequestActorId({
    userId: user.id,
    forwardedFor: request.headers.get("x-forwarded-for"),
  })
  const rate = checkRateLimit(`tone-chat:${actorId}`, { max: 30, windowMs: 60_000 })
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }

  try {
    const body = await request.json()
    const messages = body.messages as { role: string; content: string }[]

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 })
    }

    const response = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: TONE_SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    })

    const raw = response.content[0]?.type === "text" ? response.content[0].text : ""
    const parsed = safeJsonParse(raw)

    if (parsed) {
      return NextResponse.json(parsed)
    }

    // Fallback: treat raw text as a question
    return NextResponse.json({ type: "question", content: raw.trim() })
  } catch (err) {
    console.error("Tone chat error:", err)
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}
