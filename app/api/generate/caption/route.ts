import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

const TOKEN_COST_SINGLE = 5
const TOKEN_COST_BATCH_PER_ITEM = 3
const MAX_BATCH_ITEMS = 20

const VALID_GOALS = [
  "engagement",
  "leads",
  "authority",
  "saves",
  "shares",
  "traffic",
]
const VALID_FRAMEWORKS = [
  "auto",
  "pas",
  "hook_story_lesson",
  "myth_vs_reality",
  "step_by_step",
  "hot_take",
]

const GOAL_CTA_MAP: Record<string, string> = {
  engagement:
    "End with a question or debate prompt that demands a comment (e.g. 'Which one are you? Drop a 1 or 2 below')",
  leads:
    "Drive DMs with a specific offer (e.g. 'DM me AUTOMATE and I'll send you the free checklist')",
  authority:
    "End with a credibility statement and invite to follow for more expert insights",
  saves:
    "End with 'Save this for later' framing and promise of ongoing value (e.g. 'Bookmark this — you'll need it when...')",
  shares:
    "End with 'Tag someone who...' or 'Send this to a mate who...' to trigger shares",
  traffic:
    "End with a clear link-in-bio CTA with urgency (e.g. 'Link in bio — only open until Friday')",
}

const FRAMEWORK_DESCRIPTIONS: Record<string, string> = {
  auto: "Choose the best caption framework for this content and goal. Pick from: PAS, Hook→Story→Lesson, Myth vs Reality, Step-by-Step, or Hot Take→Evidence.",
  pas: "Use the PAS framework: Problem (identify the pain) → Agitate (twist the knife) → Solution (present the answer).",
  hook_story_lesson:
    "Use the Hook→Story→Lesson framework: Open with a bold hook, tell a short relatable story, extract a clear lesson or takeaway.",
  myth_vs_reality:
    "Use the Myth vs Reality framework: State a common misconception, then reveal the surprising truth with evidence.",
  step_by_step:
    "Use the Step-by-Step framework: Present numbered, actionable steps the reader can follow immediately.",
  hot_take:
    "Use the Hot Take→Evidence framework: Lead with a bold, slightly controversial opinion, then back it up with specific proof or examples.",
}

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function sanitiseProfileField(value: string | null | undefined, maxLen = 200): string {
  if (!value) return ""
  return String(value).replace(/[\n\r]/g, " ").slice(0, maxLen).trim()
}

function safeJsonParse(text: string): unknown | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/, "")
    .replace(/\s*```\s*$/, "")
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
  return `You are an Instagram SEO caption specialist. You write captions that are optimised for Instagram's keyword search algorithm while being engaging and on-brand.

Your expertise includes:
- **Instagram SEO**: embedding searchable keywords naturally in captions so posts appear in Instagram keyword search results. You know which terms people actually type into Instagram search for each niche.
- **Hook writing**: crafting first lines that stop the scroll — pattern interrupts, curiosity gaps, bold claims, specific numbers, controversial takes.
- **Caption frameworks**: PAS (Problem→Agitate→Solution), Hook→Story→Lesson, Myth vs Reality, Step-by-Step, Hot Take→Evidence.
- **Hashtag strategy**: mixing broad discovery tags (500K-2M posts) with niche-specific tags (10K-100K posts) for maximum discoverability.
- **CTA psychology**: writing calls-to-action that drive the desired behaviour — comments, saves, shares, DMs, or link clicks.
- **Caption length optimisation**: Instagram SEO favours captions of 150-300 words. The first 3 lines are critical for both the algorithm and the reader.

You ALWAYS respond with valid JSON only. No markdown fences, no explanation outside the JSON object.`
}

function buildSinglePrompt(
  content: string,
  goal: string,
  framework: string,
  profile: {
    business_name?: string | null
    industry?: string | null
    target_audience?: string | null
    brand_voice?: string | null
    tone?: string | null
    location?: string | null
    instagram_handle?: string | null
  }
): string {
  return `Write a full SEO-optimised Instagram caption for this content:

═══ CONTENT ═══
${content}

═══ GOAL ═══
Primary goal: ${goal}
${GOAL_CTA_MAP[goal] || ""}

═══ FRAMEWORK ═══
${FRAMEWORK_DESCRIPTIONS[framework] || FRAMEWORK_DESCRIPTIONS["auto"]}

═══ BRAND CONTEXT ═══
Business: ${sanitiseProfileField(profile.business_name) || "Not specified"}
Industry: ${sanitiseProfileField(profile.industry) || "General"}
Target Audience: ${sanitiseProfileField(profile.target_audience, 500) || "General audience"}
Brand Voice: ${sanitiseProfileField(profile.brand_voice) || "Professional"}
Tone: ${sanitiseProfileField(profile.tone) || "Friendly"}
Location: ${sanitiseProfileField(profile.location) || "UK"}
Instagram: ${sanitiseProfileField(profile.instagram_handle) ? `@${sanitiseProfileField(profile.instagram_handle)}` : "Not specified"}

═══ RULES ═══
1. The hook (first line) MUST stop the scroll — use a pattern interrupt, curiosity gap, bold claim, or specific number. No generic openers.
2. The body must deliver genuine value while embedding 3-5 searchable SEO keywords naturally (terms people would actually type into Instagram search in the ${sanitiseProfileField(profile.industry) || "business"} niche).
3. The CTA must be specific to the goal: ${GOAL_CTA_MAP[goal] || "Include a clear call to action"}
4. Include 8-12 hashtags mixing broad discovery tags (500K-2M posts) with niche-specific tags (10K-100K posts).
5. Caption length: 150-300 words for optimal SEO performance.
6. SEO score (0-100) based on: keyword density, keyword placement in first 3 lines, hashtag relevance, overall searchability.
7. Provide 2-3 specific, actionable SEO improvement tips.

═══ RESPONSE FORMAT ═══
Respond with this exact JSON structure (no markdown, no code fences):
{
  "hook": "The scroll-stopping first line of the caption",
  "body": "The main caption body (use \\n for line breaks)",
  "cta": "The call-to-action line",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "full_caption": "The complete caption ready to paste: hook + body + cta + two line breaks + hashtags joined by spaces",
  "seo_score": 85,
  "seo_tips": ["Specific tip 1", "Specific tip 2", "Specific tip 3"]
}`
}

function buildBatchPrompt(
  items: string[],
  goal: string,
  framework: string,
  profile: {
    business_name?: string | null
    industry?: string | null
    target_audience?: string | null
    brand_voice?: string | null
    tone?: string | null
    location?: string | null
    instagram_handle?: string | null
  }
): string {
  const numberedItems = items
    .map((item, i) => `${i + 1}. ${item}`)
    .join("\n")

  return `Write SEO-optimised Instagram captions for each of these ${items.length} content ideas:

═══ CONTENT IDEAS ═══
${numberedItems}

═══ GOAL (applies to all) ═══
Primary goal: ${goal}
${GOAL_CTA_MAP[goal] || ""}

═══ FRAMEWORK ═══
${FRAMEWORK_DESCRIPTIONS[framework] || FRAMEWORK_DESCRIPTIONS["auto"]}

═══ BRAND CONTEXT ═══
Business: ${sanitiseProfileField(profile.business_name) || "Not specified"}
Industry: ${sanitiseProfileField(profile.industry) || "General"}
Target Audience: ${sanitiseProfileField(profile.target_audience, 500) || "General audience"}
Brand Voice: ${sanitiseProfileField(profile.brand_voice) || "Professional"}
Tone: ${sanitiseProfileField(profile.tone) || "Friendly"}
Location: ${sanitiseProfileField(profile.location) || "UK"}
Instagram: ${sanitiseProfileField(profile.instagram_handle) ? `@${sanitiseProfileField(profile.instagram_handle)}` : "Not specified"}

═══ RULES ═══
1. Each hook MUST stop the scroll — pattern interrupts, curiosity gaps, bold claims, specific numbers.
2. Each body must embed 3-5 searchable SEO keywords naturally.
3. Each CTA must target the goal: ${GOAL_CTA_MAP[goal] || "Include a clear call to action"}
4. 8-12 hashtags per caption mixing broad and niche tags.
5. Caption length: 150-300 words each.
6. SEO score (0-100) per caption.
7. 2-3 SEO tips per caption.
8. Each caption must be UNIQUE — different hooks, different angles, different keywords.

═══ RESPONSE FORMAT ═══
Respond with this exact JSON structure (no markdown, no code fences):
{
  "captions": [
    {
      "input_index": 0,
      "input_summary": "First ~50 characters of the input...",
      "hook": "The scroll-stopping first line",
      "body": "The main caption body (use \\n for line breaks)",
      "cta": "The call-to-action line",
      "hashtags": ["hashtag1", "hashtag2"],
      "keywords": ["keyword1", "keyword2"],
      "full_caption": "Complete caption ready to paste",
      "seo_score": 85,
      "seo_tips": ["Tip 1", "Tip 2"]
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
    const { mode, content, batchContent, goal, framework } = body

    // Validate mode
    if (!mode || !["single", "batch"].includes(mode)) {
      return NextResponse.json(
        { error: "mode must be 'single' or 'batch'" },
        { status: 400 }
      )
    }

    // Validate goal
    if (!goal || !VALID_GOALS.includes(goal)) {
      return NextResponse.json(
        { error: "Invalid goal" },
        { status: 400 }
      )
    }

    // Validate framework
    const safeFramework = VALID_FRAMEWORKS.includes(framework)
      ? framework
      : "auto"

    // Validate and sanitise content
    let safeContent = ""
    let batchItems: string[] = []
    let tokenCost = 0

    if (mode === "single") {
      if (!content || typeof content !== "string" || !content.trim()) {
        return NextResponse.json(
          { error: "Content description is required" },
          { status: 400 }
        )
      }
      safeContent = String(content).slice(0, 2000).trim()
      tokenCost = TOKEN_COST_SINGLE
    } else {
      if (!batchContent || typeof batchContent !== "string" || !batchContent.trim()) {
        return NextResponse.json(
          { error: "Batch content is required" },
          { status: 400 }
        )
      }
      batchItems = parseBatchInput(batchContent)
        .slice(0, MAX_BATCH_ITEMS)
        .map((item) => item.slice(0, 500))
        .filter((item) => item.length > 0)

      if (batchItems.length === 0) {
        return NextResponse.json(
          { error: "No valid content items found" },
          { status: 400 }
        )
      }
      tokenCost = batchItems.length * TOKEN_COST_BATCH_PER_ITEM
    }

    // Fetch profile for brand context
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "business_name, industry, target_audience, brand_voice, tone, location, instagram_handle"
      )
      .eq("id", user.id)
      .single()

    // Debit tokens
    // Call Claude FIRST, then debit tokens only on success
    const userPrompt =
      mode === "single"
        ? buildSinglePrompt(safeContent, goal, safeFramework, profile || {})
        : buildBatchPrompt(batchItems, goal, safeFramework, profile || {})

    const maxTokens = mode === "single" ? 2000 : Math.min(batchItems.length * 1500, 8000)

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: maxTokens,
      system: buildSystemPrompt(),
      messages: [{ role: "user", content: userPrompt }],
    })

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : ""

    const parsed = safeJsonParse(responseText)
    if (!parsed || typeof parsed !== "object") {
      console.error(
        "Failed to parse caption response:",
        responseText.slice(0, 500)
      )
      return NextResponse.json(
        { error: "Failed to parse generated caption" },
        { status: 500 }
      )
    }

    // Validate response shape
    let captions: unknown[]
    if (mode === "single") {
      const obj = parsed as Record<string, unknown>
      if (!obj.hook || !obj.body) {
        return NextResponse.json(
          { error: "AI returned an unexpected response format" },
          { status: 500 }
        )
      }
      captions = [obj]
    } else {
      const obj = parsed as Record<string, unknown>
      if (!Array.isArray(obj.captions)) {
        return NextResponse.json(
          { error: "AI returned an unexpected response format" },
          { status: 500 }
        )
      }
      captions = obj.captions
    }

    // Debit tokens AFTER successful generation
    const admin = createAdminClient()
    try {
      const { data: newBalance, error: debitError } = await admin.rpc(
        "debit_tokens",
        {
          p_user_id: user.id,
          p_amount: tokenCost,
          p_type: "feature_use",
          p_description:
            mode === "single"
              ? "Generated SEO caption"
              : `Generated ${batchItems.length} SEO captions`,
        }
      )

      if (debitError) throw debitError

      return NextResponse.json({
        captions,
        balance: newBalance,
        deducted: tokenCost,
      })
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
    console.error("Caption generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate caption" },
      { status: 500 }
    )
  }
}
