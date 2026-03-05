import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

const TOKEN_COST_SINGLE = 3
const TOKEN_COST_BATCH_PER_ITEM = 2
const MAX_BATCH_ITEMS = 20

const VALID_GOALS = ["engagement", "leads", "authority", "shares"]
const VALID_FORMATS = ["auto", "text_post", "story", "step_by_step", "bold_claim", "hot_take"]

const GOAL_CTA_MAP: Record<string, string> = {
  engagement:
    "End with an open question that invites genuine comments and discussion (e.g. 'What's your take? Drop it in the comments')",
  leads:
    "Drive DMs or profile visits with a specific offer (e.g. 'DM me [WORD] and I'll send you...' or 'Link in bio to book a call')",
  authority:
    "End with a credibility statement and soft invitation to follow for more expert insights",
  shares:
    "End with 'Tag someone who needs to read this' or 'Reshare this if you agree' to trigger shares",
}

const FORMAT_DESCRIPTIONS: Record<string, string> = {
  auto: "Choose the best LinkedIn post format for this content and goal. Consider which structure will perform best for the given topic.",
  text_post:
    "Write a personal, direct, conversational text post. Use 4-8 short paragraphs separated by blank lines. No images needed — let the words do the work.",
  story:
    "Use the Hook→Story→Lesson format: Start with a bold hook, tell a short personal story (2-4 paragraphs), then extract a clear lesson or takeaway. End with a CTA.",
  step_by_step:
    "Write a numbered step-by-step post: Bold hook, then 4-8 numbered actionable steps (one sentence each), then a CTA. Great for educational content that gets saved.",
  bold_claim:
    "Lead with a bold, slightly counterintuitive claim that stops the scroll. Back it up with evidence, data, or a personal story. End with a question or CTA.",
  hot_take:
    "Take a strong, possibly contrarian position on an industry topic. Back it up with your experience and reasoning. Invite debate in the comments.",
}

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function sanitiseField(value: string | null | undefined, maxLen = 200): string {
  if (!value) return ""
  return String(value).replace(/[\n\r]/g, " ").slice(0, maxLen).trim()
}

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

function buildSystemPrompt(): string {
  return `You are a LinkedIn content specialist. You write posts that perform exceptionally well on LinkedIn — authentic, high-value, and structured for maximum dwell time and engagement.

Your expertise includes:
- **LinkedIn hooks**: Writing the first 2-3 lines (before "see more", ~210 characters) that force people to click. You use pattern interrupts, surprising stats, vulnerable moments, or counterintuitive claims. Never start with "I" or the business name.
- **LinkedIn formatting**: Short paragraphs (1-3 sentences) separated by blank lines. Easy to skim, impossible to stop reading.
- **Voice**: Personal, direct, human. You ruthlessly avoid corporate buzzwords, passive voice, and generic statements.
- **CTAs**: Specific and natural — not forced. You ask genuine questions or make specific offers.
- **Hashtag strategy**: 3-5 relevant hashtags at the very end. Never embedded in the post body. Never more than 5.
- **Post formats**: You master text posts, personal stories, step-by-step breakdowns, bold claims, and hot takes.

You ALWAYS respond with valid JSON only. No markdown fences, no explanation outside the JSON object.`
}

function buildSinglePrompt(
  content: string,
  goal: string,
  format: string,
  profile: {
    business_name?: string | null
    industry?: string | null
    target_audience?: string | null
    brand_voice?: string | null
    tone?: string | null
    location?: string | null
  }
): string {
  return `Write a high-performing LinkedIn post for this content:

═══ CONTENT ═══
${content}

═══ GOAL ═══
Primary goal: ${goal}
${GOAL_CTA_MAP[goal] || ""}

═══ FORMAT ═══
${FORMAT_DESCRIPTIONS[format] || FORMAT_DESCRIPTIONS["auto"]}

═══ BRAND CONTEXT ═══
Business: ${sanitiseField(profile.business_name) || "Not specified"}
Industry: ${sanitiseField(profile.industry) || "General"}
Target Audience: ${sanitiseField(profile.target_audience, 500) || "Business professionals"}
Brand Voice: ${sanitiseField(profile.brand_voice) || "Professional"}
Tone: ${sanitiseField(profile.tone) || "Authoritative but approachable"}
Location: ${sanitiseField(profile.location) || "UK"}

═══ LINKEDIN RULES ═══
1. The hook (first 2-3 lines, max ~210 characters) determines if people click "see more". Use: specific numbers, personal vulnerability, counterintuitive takes, or bold statements.
2. Never start with "I" or the business name as the very first word. Start mid-story or with the most interesting part.
3. Use short paragraphs (1-3 sentences) separated by \\n\\n. LinkedIn readers skim — make it easy.
4. Avoid corporate buzzwords: "synergy", "leverage", "paradigm", "circle back", "game-changer", "disruptive".
5. CTA must be specific and natural: ${GOAL_CTA_MAP[goal] || "Include a clear call to action"}
6. 3-5 hashtags at the very end, NEVER embedded in the body.
7. Total post: 150-2000 characters. Ideal length: 300-800 for most formats, 800-1500 for story/long-form.
8. Writing score (0-100): hook strength + readability + authenticity + CTA clarity.

═══ RESPONSE FORMAT ═══
Respond with this exact JSON (no markdown, no code fences):
{
  "hook": "The first 2-3 lines that appear before 'see more' (max ~210 characters)",
  "body": "The main body with \\n\\n for paragraph breaks",
  "cta": "The call-to-action line",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "full_post": "Complete post ready to paste: hook + \\n\\n + body + \\n\\n + cta + \\n\\n + hashtags joined by spaces",
  "writing_score": 85,
  "writing_tips": ["Specific improvement tip 1", "Specific improvement tip 2"]
}`
}

function buildBatchPrompt(
  items: string[],
  goal: string,
  format: string,
  profile: {
    business_name?: string | null
    industry?: string | null
    target_audience?: string | null
    brand_voice?: string | null
    tone?: string | null
    location?: string | null
  }
): string {
  const numberedItems = items.map((item, i) => `${i + 1}. ${item}`).join("\n")

  return `Write high-performing LinkedIn posts for each of these ${items.length} content ideas:

═══ CONTENT IDEAS ═══
${numberedItems}

═══ GOAL (applies to all) ═══
Primary goal: ${goal}
${GOAL_CTA_MAP[goal] || ""}

═══ FORMAT ═══
${FORMAT_DESCRIPTIONS[format] || FORMAT_DESCRIPTIONS["auto"]}

═══ BRAND CONTEXT ═══
Business: ${sanitiseField(profile.business_name) || "Not specified"}
Industry: ${sanitiseField(profile.industry) || "General"}
Target Audience: ${sanitiseField(profile.target_audience, 500) || "Business professionals"}
Brand Voice: ${sanitiseField(profile.brand_voice) || "Professional"}
Tone: ${sanitiseField(profile.tone) || "Authoritative but approachable"}
Location: ${sanitiseField(profile.location) || "UK"}

═══ LINKEDIN RULES ═══
1. Each hook (max ~210 characters) must stop the scroll — pattern interrupts, specific numbers, personal vulnerability.
2. Never start any post with "I" or the business name as the very first word.
3. Short paragraphs separated by \\n\\n throughout.
4. Avoid all corporate buzzwords.
5. Each CTA must be specific: ${GOAL_CTA_MAP[goal] || "Clear call to action"}
6. 3-5 hashtags per post at the very end only.
7. Each post MUST be UNIQUE — different hooks, angles, formats, and approaches.
8. Writing score (0-100) per post.

═══ RESPONSE FORMAT ═══
Respond with this exact JSON (no markdown, no code fences):
{
  "posts": [
    {
      "input_index": 0,
      "input_summary": "First ~50 characters of the input...",
      "hook": "The first 2-3 lines before see more",
      "body": "Main body with \\n\\n paragraph breaks",
      "cta": "Call to action",
      "hashtags": ["hashtag1", "hashtag2"],
      "full_post": "Complete post ready to paste",
      "writing_score": 85,
      "writing_tips": ["Tip 1", "Tip 2"]
    }
  ]
}`
}

function parseBatchInput(raw: string): string[] {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean)
  return lines.map((line) => line.replace(/^\d+[\.\)\-]\s*/, ""))
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
    const { mode, content, batchContent, goal, format } = body

    if (!mode || !["single", "batch"].includes(mode)) {
      return NextResponse.json({ error: "mode must be 'single' or 'batch'" }, { status: 400 })
    }

    if (!goal || !VALID_GOALS.includes(goal)) {
      return NextResponse.json({ error: "Invalid goal" }, { status: 400 })
    }

    const safeFormat = VALID_FORMATS.includes(format) ? format : "auto"

    let safeContent = ""
    let batchItems: string[] = []
    let tokenCost = 0

    if (mode === "single") {
      if (!content || typeof content !== "string" || !content.trim()) {
        return NextResponse.json({ error: "Content description is required" }, { status: 400 })
      }
      safeContent = String(content).slice(0, 2000).trim()
      tokenCost = TOKEN_COST_SINGLE
    } else {
      if (!batchContent || typeof batchContent !== "string" || !batchContent.trim()) {
        return NextResponse.json({ error: "Batch content is required" }, { status: 400 })
      }
      batchItems = parseBatchInput(batchContent)
        .slice(0, MAX_BATCH_ITEMS)
        .map((item) => item.slice(0, 500))
        .filter((item) => item.length > 0)

      if (batchItems.length === 0) {
        return NextResponse.json({ error: "No valid content items found" }, { status: 400 })
      }
      tokenCost = batchItems.length * TOKEN_COST_BATCH_PER_ITEM
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("business_name, industry, target_audience, brand_voice, tone, location")
      .eq("id", user.id)
      .single()

    const userPrompt =
      mode === "single"
        ? buildSinglePrompt(safeContent, goal, safeFormat, profile || {})
        : buildBatchPrompt(batchItems, goal, safeFormat, profile || {})

    const maxTokens = mode === "single" ? 2000 : Math.min(batchItems.length * 1500, 8000)

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system: buildSystemPrompt(),
      messages: [{ role: "user", content: userPrompt }],
    })

    const responseText = message.content[0]?.type === "text" ? message.content[0].text : ""
    const parsed = safeJsonParse(responseText)

    if (!parsed || typeof parsed !== "object") {
      return NextResponse.json({ error: "Failed to parse generated post" }, { status: 500 })
    }

    let posts: unknown[]
    if (mode === "single") {
      const obj = parsed as Record<string, unknown>
      if (!obj.hook || !obj.body) {
        return NextResponse.json({ error: "AI returned an unexpected response format" }, { status: 500 })
      }
      posts = [obj]
    } else {
      const obj = parsed as Record<string, unknown>
      if (!Array.isArray(obj.posts)) {
        return NextResponse.json({ error: "AI returned an unexpected response format" }, { status: 500 })
      }
      posts = obj.posts
    }

    const admin = createAdminClient()
    try {
      const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
        p_user_id: user.id,
        p_amount: tokenCost,
        p_type: "feature_use",
        p_description:
          mode === "single"
            ? "Generated LinkedIn post"
            : `Generated ${batchItems.length} LinkedIn posts`,
      } as never)

      if (debitError) throw debitError

      return NextResponse.json({ posts, balance: newBalance, deducted: tokenCost })
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err)
      if (errMessage.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Insufficient tokens", balance_needed: tokenCost },
          { status: 402 }
        )
      }
      throw err
    }
  } catch (error) {
    console.error("LinkedIn post generation error:", error)
    return NextResponse.json({ error: "Failed to generate post" }, { status: 500 })
  }
}
