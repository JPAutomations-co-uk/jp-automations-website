import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const NEWS_ITEMS = [
  "Claude Sonnet 4.5: Anthropic released extended thinking with streaming support, allowing reasoning chains to be surfaced in real-time",
  "GPT-4o: OpenAI shipped significant improvements to instruction following accuracy, especially for long-form structured output tasks",
  "Gemini 2.0 Flash: Google updated image understanding with better multi-object reasoning and text extraction from photos",
  "Sora: OpenAI added new aspect ratio controls (9:16, 1:1, 16:9) and storyboard mode for scene-by-scene video generation",
  "GitHub Copilot Agent Mode: Microsoft announced general availability of autonomous coding agents that can run tests, fix bugs, and open PRs",
  "Midjourney v7: New detail control sliders allow fine-tuning of texture, sharpness, and noise in generated images",
  "Runway Gen-3 Alpha Turbo: 3x speed improvement to video generation with comparable quality to the standard model",
  "ElevenVoices: ElevenLabs launched multilingual V3 model with native support for 32 languages including regional accents",
  "NotebookLM: Google raised the source limit from 20 to 50 documents per notebook and added audio overview length controls",
]

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

function sanitise(value: string | null | undefined, maxLen = 300): string {
  if (!value) return ""
  return String(value).replace(/[\n\r]/g, " ").slice(0, maxLen).trim()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const role = sanitise(body.role, 50)
    const context = sanitise(body.context, 300)

    if (!role || !context) {
      return NextResponse.json({ error: "role and context are required" }, { status: 400 })
    }

    const newsItems = NEWS_ITEMS.map((item, i) => `${i + 1}. ${item}`).join("\n")

    const anthropic = getAnthropic()
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system:
        "You are an AI news filter. You read AI releases and identify only what matters for the user's specific work context. Be specific, brief, and genuinely useful. Never hallucinate tools or releases not listed.",
      messages: [
        {
          role: "user",
          content: `My work context:
- Role: ${role}
- Daily work and tools: ${context}

From the following AI news items this week, identify ONLY the releases that directly impact my workflow. For each relevant item, explain in 2 sentences why it matters and what I should specifically test. Ignore everything that has no bearing on my work.

Return ONLY valid JSON in this exact structure (no markdown fences, no explanation):
{
  "what_dropped": ["brief bullet 1", "brief bullet 2", "brief bullet 3"],
  "relevant": [{ "item": "tool/release name", "why": "2 sentence explanation", "test": "specific action to take" }],
  "test_this_week": "one concrete action sentence",
  "safely_ignore": ["item 1", "item 2", "item 3"]
}

News items this week:
${newsItems}`,
        },
      ],
    })

    const raw = message.content[0].type === "text" ? message.content[0].text : ""
    const parsed = safeJsonParse(raw)

    if (!parsed || typeof parsed !== "object") {
      return NextResponse.json({ error: "Failed to parse response" }, { status: 500 })
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error("[ai-news-filter]", err)
    return NextResponse.json({ error: "Failed to generate brief" }, { status: 500 })
  }
}
