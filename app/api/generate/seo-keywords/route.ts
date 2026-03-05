import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

const TOKEN_COST = 5

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

function buildKeywordsPrompt(
  service: string,
  location: string,
  services?: string,
  audience?: string
): string {
  const contextLines: string[] = []
  if (services) contextLines.push(`Specific services they offer: ${services}`)
  if (audience) contextLines.push(`Their typical customers: ${audience}`)
  const contextBlock = contextLines.length > 0 ? `\n${contextLines.join("\n")}\n` : ""

  const servicesInstruction = services
    ? `- Generate keywords around their SPECIFIC services (${services}) — not just the broad trade name. Target sub-service keywords like "boiler power flush ${location}" rather than generic "${service} ${location}".`
    : `- Cover the most common sub-services a ${service} offers and generate keywords around those specific jobs, not just the trade name.`

  const audienceInstruction = audience
    ? `- Frame informational and commercial keywords around what "${audience}" actually search for. Different audiences search differently — a landlord searches for "landlord gas safety certificate ${location}", not "boiler check ${location}". Reflect that specificity.`
    : `- Think about the most common customer types for a ${service} and frame keywords around their specific searches.`

  return `Generate 12 blog keyword ideas for a local UK ${service} business based in ${location}.
${contextBlock}
Think like someone in ${location} who needs this service right now. What would they actually type into Google?

Cover these search types:
1. **Transactional** (3-4 keywords): Ready to hire — be specific to their actual services and location. Avoid generic "${service} ${location}" if you know specific services — use those instead.
2. **Commercial investigation** (3-4 keywords): Comparing options or researching before deciding — pricing queries, best-in-area searches, how-to-choose guides.
3. **Informational** (4-5 keywords): Problem-solving searches. These should be specific to real problems their customers face — the actual question someone Googles before ringing a ${service}. Not generic "how to fix a thing" but the specific pain point.

Additional instructions:
${servicesInstruction}
${audienceInstruction}
- Use natural language people actually type (not formal jargon or technical terms)
- Include ${location} in the transactional and commercial keywords
- The "angle" field should explain exactly what the blog must cover to rank for that keyword and satisfy the searcher's intent — be specific

Respond with this exact JSON (no markdown, no code fences):
{
  "keywords": [
    {
      "keyword": "the search phrase",
      "intent": "Transactional" | "Commercial" | "Informational",
      "difficulty": "Low" | "Medium" | "High",
      "angle": "One sentence: what the blog should cover to rank for this keyword and satisfy the searcher's intent"
    }
  ]
}`
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
    const { service, location, services, audience } = body

    if (!service || typeof service !== "string" || !service.trim()) {
      return NextResponse.json({ error: "Service type is required" }, { status: 400 })
    }

    if (!location || typeof location !== "string" || !location.trim()) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 })
    }

    const safeService = String(service).slice(0, 100).trim()
    const safeLocation = String(location).slice(0, 100).trim()
    const safeServices = services && typeof services === "string" ? String(services).slice(0, 300).trim() : ""
    const safeAudience = audience && typeof audience === "string" ? String(audience).slice(0, 200).trim() : ""

    // Use Haiku for speed and cost efficiency on keyword research
    const message = await getAnthropic().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: buildKeywordsPrompt(safeService, safeLocation, safeServices || undefined, safeAudience || undefined),
        },
      ],
    })

    const responseText = message.content[0].type === "text" ? message.content[0].text : ""
    const parsed = safeJsonParse(responseText)

    if (!parsed || typeof parsed !== "object") {
      console.error("Failed to parse keywords response:", responseText.slice(0, 300))
      return NextResponse.json({ error: "Failed to generate keyword ideas" }, { status: 500 })
    }

    const result = parsed as Record<string, unknown>
    if (!Array.isArray(result.keywords)) {
      return NextResponse.json({ error: "AI returned unexpected format" }, { status: 500 })
    }

    // Deduct tokens after successful generation
    const admin = createAdminClient()
    try {
      const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
        p_user_id: user.id,
        p_amount: TOKEN_COST,
        p_type: "feature_use",
        p_description: `Keyword research: ${safeService} in ${safeLocation}`,
      })

      if (debitError) throw debitError

      return NextResponse.json({
        keywords: result.keywords,
        balance: newBalance,
        deducted: TOKEN_COST,
      })
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
    console.error("Keyword research error:", error)
    return NextResponse.json({ error: "Failed to generate keywords" }, { status: 500 })
  }
}
