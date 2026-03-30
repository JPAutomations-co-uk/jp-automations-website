import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import { getProfileContext } from "@/app/lib/profile-context"
import {
  getUserFeedbackContext,
  INSTAGRAM_ALGORITHM_INTELLIGENCE,
  INSTAGRAM_HOOK_FORMULAS,
  INSTAGRAM_FORMATTING_RULES,
  INSTAGRAM_AUTHORITY_PATTERNS,
  INSTAGRAM_SUPPRESSED,
} from "@/app/lib/instagram-master-prompt"

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

function buildSystemPrompt(profileContext: string, feedbackConstraints: string): string {
  return `You are an Instagram SEO caption specialist and ghostwriter. Write AS this person — 1st person, their voice, their personality. You ARE them.

Two users = fundamentally different outputs. Match voice, cadence, word choice & personality exactly. Never blend. Never generic.

═══ CONTEXT ═══
${profileContext}

═══ VOICE ═══
Copy examples = your writing bible. Match sentence length, structure, punctuation & word choice.
Voice sample = replicate cadence & personality.
Standard: user reads output & thinks "I wrote that."

═══ SEO EXPERTISE ═══
- Embed searchable keywords naturally in captions so posts appear in Instagram keyword search results.
- Target terms people actually type into Instagram search for each niche.
- Keyword placement in first 3 lines is critical for both the algorithm and the reader.
- Caption length 150-300 words for optimal SEO performance.

═══ OFFERS & PROOF ═══
Weave USP, proof points & offers naturally when relevant. Reference specific numbers & results. Never hard-sell — Instagram audiences punish overt pitching.

═══ AUDIENCE ═══
Write for their specific audience. Match sophistication. Use their industry's language. Address their pain points and aspirations.

${INSTAGRAM_ALGORITHM_INTELLIGENCE}
${INSTAGRAM_HOOK_FORMULAS}
${INSTAGRAM_FORMATTING_RULES}
${INSTAGRAM_AUTHORITY_PATTERNS}
${INSTAGRAM_SUPPRESSED}
${feedbackConstraints}
Output valid JSON only. No markdown fences. No text outside JSON.`
}

function buildSinglePrompt(
  content: string,
  goal: string,
  framework: string,
): string {
  return `Write a full SEO-optimised Instagram caption for this content:

═══ CONTENT ═══
${content}

═══ GOAL ═══
Primary goal: ${goal}
${GOAL_CTA_MAP[goal] || ""}

═══ FRAMEWORK ═══
${FRAMEWORK_DESCRIPTIONS[framework] || FRAMEWORK_DESCRIPTIONS["auto"]}

═══ RULES ═══
1. The hook (first line) MUST stop the scroll — use a hook from the PROVEN INSTAGRAM HOOK FORMULAS. No generic openers.
2. First line must work within ~125 characters (before "...more" truncation).
3. The body must deliver genuine value while embedding 3-5 searchable SEO keywords naturally (terms people would actually type into Instagram search in their niche).
4. The CTA must be specific to the goal: ${GOAL_CTA_MAP[goal] || "Include a clear call to action"}
5. Include 3-5 hashtags mixing broad discovery tags (500K-2M posts) with niche-specific tags (10K-100K posts). At end only.
6. Caption length: 150-300 words for optimal SEO performance.
7. SEO score (0-100) based on: keyword density, keyword placement in first 3 lines, hashtag relevance, overall searchability.
8. Provide 2-3 specific, actionable SEO improvement tips.
9. Write like a practitioner sharing field notes, not a marketer writing copy.
10. Sound human — inject specific numbers, personal observations, imperfect phrasing. Never AI-detectable.

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

═══ RULES ═══
1. Each hook MUST use a different hook formula from PROVEN INSTAGRAM HOOK FORMULAS — never repeat.
2. Each body must embed 3-5 searchable SEO keywords naturally.
3. Each CTA must target the goal: ${GOAL_CTA_MAP[goal] || "Include a clear call to action"}
4. 3-5 hashtags per caption mixing broad and niche tags.
5. Caption length: 150-300 words each.
6. SEO score (0-100) per caption.
7. 2-3 SEO tips per caption.
8. Each caption must be UNIQUE — different hooks, different angles, different keywords.
9. Write like a practitioner sharing field notes — specific, human, not marketing copy.

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

    // Rate limiting
    const actorId = resolveRequestActorId({
      userId: user.id,
      forwardedFor: request.headers.get("x-forwarded-for"),
      fallback: "caption",
    })
    const rate = checkRateLimit(`generate-caption:${actorId}`, {
      max: 15,
      windowMs: 60_000,
    })
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please retry shortly." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      )
    }

    const body = await request.json()
    const { mode, content, batchContent, goal, framework } = body

    if (!mode || !["single", "batch"].includes(mode)) {
      return NextResponse.json(
        { error: "mode must be 'single' or 'batch'" },
        { status: 400 }
      )
    }

    if (!goal || !VALID_GOALS.includes(goal)) {
      return NextResponse.json(
        { error: "Invalid goal" },
        { status: 400 }
      )
    }

    const safeFramework = VALID_FRAMEWORKS.includes(framework)
      ? framework
      : "auto"

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

    // Check balance before generation
    const admin = createAdminClient()
    const { data: balanceRow } = await admin
      .from("token_balances")
      .select("balance")
      .eq("user_id", user.id)
      .single()
    const balance = (balanceRow as { balance?: number } | null)?.balance ?? 0
    if (balance < tokenCost) {
      return NextResponse.json(
        { error: "Insufficient tokens", balance_needed: tokenCost, current_balance: balance },
        { status: 402 }
      )
    }

    // Fetch profile context + feedback in parallel
    const [{ contextBlock }, feedbackConstraints] = await Promise.all([
      getProfileContext(user.id, "instagram"),
      getUserFeedbackContext(user.id),
    ])

    const systemPrompt = buildSystemPrompt(contextBlock, feedbackConstraints)
    const userPrompt =
      mode === "single"
        ? buildSinglePrompt(safeContent, goal, safeFramework)
        : buildBatchPrompt(batchItems, goal, safeFramework)

    const maxTokens = mode === "single" ? 2000 : Math.min(batchItems.length * 1500, 8000)

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      temperature: 0.7,
      system: systemPrompt,
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

    // Debit tokens after successful generation
    const { data: newBalance, error: debitError } = await admin.rpc(
      "debit_tokens",
      {
        p_user_id: user.id,
        p_amount: tokenCost,
        p_type: "feature_use",
        p_description:
          mode === "single"
            ? `Generated SEO caption: "${safeContent.slice(0, 60)}"`
            : `Generated ${batchItems.length} SEO captions`,
      } as never
    )

    if (debitError) {
      const msg = String(debitError.message || debitError)
      if (msg.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Insufficient tokens", balance_needed: tokenCost },
          { status: 402 }
        )
      }
      throw debitError
    }

    return NextResponse.json({
      captions,
      balance: newBalance,
      deducted: tokenCost,
    })
  } catch (error) {
    console.error("Caption generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate caption" },
      { status: 500 }
    )
  }
}
