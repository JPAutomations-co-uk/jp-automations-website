import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

const TOKEN_COST = 25
const VALID_TIMEFRAMES = ["3", "6", "12"]
const VALID_GOALS = ["local", "competitor", "leads", "authority"]
const VALID_WEBSITE_STATUS = ["none", "new", "some", "established"]

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

function sanitise(value: string | null | undefined, maxLen = 200): string {
  if (!value) return ""
  return String(value).replace(/[\n\r]/g, " ").slice(0, maxLen).trim()
}

function buildSystemPrompt(): string {
  return `You are a senior SEO strategist specialising in local service businesses in the UK. You create practical, results-focused SEO roadmaps — not generic checklists, but tailored plans that reflect real-world local SEO timelines and what actually moves the needle.

Your expertise:
- **Realistic timelines**: Local SEO takes time. You're honest — most businesses see initial traction in 3-4 months, meaningful results in 6-9 months, and strong rankings in 9-18 months for competitive keywords. You never overpromise.
- **Priority order**: You always put foundation before content — a fast, mobile-friendly site with correct technical basics converts content investment into rankings. A great blog on a broken site is wasted effort.
- **Google Business Profile**: For local service businesses, GBP is often the highest-ROI action, outperforming blog content for local pack visibility. You weight this heavily in early phases.
- **Content sequencing**: Low-competition informational keywords first to build domain authority, then commercial keywords as the site gains trust.
- **Industry-specific backlinks**: You know what real UK local backlinks look like — trade directories (Checkatrade, TrustATrader, Rated People), local business directories, trade associations, local press, council supplier lists.
- **UK market knowledge**: You understand UK search behaviour, UK trade industries, and UK local SEO specifically.

You give honest, blunt, practical advice — including what NOT to do and clear priority rankings. You tell businesses the truth about timelines even when it's not what they want to hear.

You ALWAYS respond with valid JSON only. No markdown fences, no explanation outside the JSON object.`
}

function buildPlannerPrompt(
  businessType: string,
  location: string,
  goal: string,
  timeframe: string,
  websiteStatus: string,
  services: string
): string {
  const goalMap: Record<string, string> = {
    local: "Get found for local service searches in their area — appearing in Google Maps pack and organic results when potential customers search for their service in their location.",
    competitor: "Overtake specific local competitors who currently outrank them. Capture market share from businesses currently dominating local search.",
    leads: "Drive more enquiry calls and form submissions from Google. Optimise for conversion, not just rankings — traffic that actually turns into booked jobs.",
    authority: "Become the recognised local expert in their trade. Build a reputation online that reflects their real-world expertise and differentiates them from cheaper competitors.",
  }

  const statusMap: Record<string, string> = {
    none: "No website yet — starting from scratch. Domain authority: 0. This business has zero online presence.",
    new: "New website launched recently, no blog content yet. Domain authority likely 0-5. Pages exist but no topical authority established.",
    some: "Existing website with some content (maybe 1-5 blog posts, basic service pages). Small but existing domain authority.",
    established: "Established website with decent content. Has been around for 2+ years, some domain authority. Looking to accelerate growth.",
  }

  const phaseCount = timeframe === "3" ? 2 : timeframe === "6" ? 3 : 4
  const monthsPerPhase = Math.round(parseInt(timeframe) / phaseCount)

  return `Create a comprehensive ${timeframe}-month local SEO plan for this UK service business.

═══ BUSINESS ═══
Business Type: ${businessType}
Location: ${location}
Main Goal: ${goalMap[goal] || goalMap.local}
Services Offered: ${services || "General " + businessType + " services"}

═══ CURRENT SITUATION ═══
${statusMap[websiteStatus] || statusMap.new}

═══ PLAN REQUIREMENTS ═══
Create exactly ${phaseCount} phases, each covering approximately ${monthsPerPhase} month(s).
Phase 1 MUST focus on foundations (technical SEO, GBP, quick wins) before heavy content investment.
Blog topics should be sequenced from low-competition informational → medium-competition commercial → higher-competition transactional.
Each phase's blog topics should be realistic for a ${statusMap[websiteStatus]} site.

Be specific to ${businessType} in ${location} — not generic. Blog topic titles should include the location and be the actual keywords someone would search.

═══ BEYOND CONTENT ═══
Include specific, actionable steps for:
- Technical SEO (specific checks for a ${businessType} website)
- Google Business Profile (specific to ${businessType} — what categories, what posts, what to ask for in reviews)
- Local citations (name the actual UK directories relevant for a ${businessType})
- Backlinks (name specific sources: trade associations, directories like Checkatrade/TrustATrader, local press opportunities for a ${businessType})

═══ QUICK WINS ═══
List 5-6 things they can do in the first week that will have an impact — prioritised by ROI, not effort.

═══ TIMELINE REALITY CHECK ═══
Write a short, honest paragraph about what to realistically expect and when. Be specific: "By month X you should see Y." Don't soften it — business owners need to know the truth to set client/investor expectations.

═══ RESPONSE FORMAT ═══
Respond with this exact JSON structure (no markdown, no code fences):
{
  "overview": "2-3 sentence strategy overview explaining the approach and why it suits this specific situation",
  "publishingFrequency": "e.g. '1-2 posts per month in phase 1, increasing to 2-3 per month by phase 2'",
  "phases": [
    {
      "phase": 1,
      "title": "Descriptive phase title",
      "months": "Month 1-${monthsPerPhase}",
      "objective": "What this phase achieves and why it comes first",
      "blogTopics": [
        {
          "title": "Full blog post title as it would appear on the page",
          "keyword": "exact search phrase to target",
          "priority": "High",
          "intent": "Informational"
        }
      ],
      "otherActions": [
        "Specific action 1",
        "Specific action 2",
        "Specific action 3"
      ]
    }
  ],
  "beyondContent": {
    "technical": [
      "Specific technical SEO action 1",
      "Specific technical SEO action 2",
      "Specific technical SEO action 3",
      "Specific technical SEO action 4"
    ],
    "googleBusiness": [
      "Specific GBP action 1",
      "Specific GBP action 2",
      "Specific GBP action 3",
      "Specific GBP action 4"
    ],
    "citations": [
      "Name the specific UK directory and what to do",
      "Name the specific UK directory and what to do",
      "Name the specific UK directory and what to do",
      "Name the specific UK directory and what to do"
    ],
    "backlinks": [
      "Specific backlink source and how to get it",
      "Specific backlink source and how to get it",
      "Specific backlink source and how to get it",
      "Specific backlink source and how to get it"
    ]
  },
  "quickWins": [
    "Quick win 1 (highest ROI first)",
    "Quick win 2",
    "Quick win 3",
    "Quick win 4",
    "Quick win 5"
  ],
  "timelineExpectations": "Honest, specific 2-3 sentence paragraph. Include specific month milestones: 'By month X..., by month Y...'"
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
    const { businessType, location, goal, timeframe, websiteStatus, services } = body

    if (!businessType || typeof businessType !== "string" || !businessType.trim()) {
      return NextResponse.json({ error: "Business type is required" }, { status: 400 })
    }

    if (!location || typeof location !== "string" || !location.trim()) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 })
    }

    if (!goal || !VALID_GOALS.includes(String(goal))) {
      return NextResponse.json({ error: "Invalid goal" }, { status: 400 })
    }

    if (!timeframe || !VALID_TIMEFRAMES.includes(String(timeframe))) {
      return NextResponse.json({ error: "timeframe must be 3, 6, or 12" }, { status: 400 })
    }

    if (!websiteStatus || !VALID_WEBSITE_STATUS.includes(String(websiteStatus))) {
      return NextResponse.json({ error: "Invalid website status" }, { status: 400 })
    }

    const safeBusinessType = sanitise(businessType, 100)
    const safeLocation = sanitise(location, 100)
    const safeGoal = String(goal)
    const safeTimeframe = String(timeframe)
    const safeWebsiteStatus = String(websiteStatus)
    const safeServices = typeof services === "string" ? services.slice(0, 500).trim() : ""

    // Generate plan with Claude
    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 6000,
      system: buildSystemPrompt(),
      messages: [
        {
          role: "user",
          content: buildPlannerPrompt(
            safeBusinessType,
            safeLocation,
            safeGoal,
            safeTimeframe,
            safeWebsiteStatus,
            safeServices
          ),
        },
      ],
    })

    const responseText = message.content[0].type === "text" ? message.content[0].text : ""
    const plan = safeJsonParse(responseText)

    if (!plan || typeof plan !== "object") {
      console.error("Failed to parse planner response:", responseText.slice(0, 500))
      return NextResponse.json({ error: "Failed to parse SEO plan" }, { status: 500 })
    }

    const planObj = plan as Record<string, unknown>
    if (!planObj.phases || !Array.isArray(planObj.phases)) {
      return NextResponse.json({ error: "AI returned unexpected response format" }, { status: 500 })
    }

    // Deduct tokens after successful generation
    const admin = createAdminClient()
    try {
      const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
        p_user_id: user.id,
        p_amount: TOKEN_COST,
        p_type: "feature_use",
        p_description: `SEO plan: ${safeBusinessType} in ${safeLocation} (${safeTimeframe} months)`,
      })

      if (debitError) throw debitError

      return NextResponse.json({ plan, balance: newBalance, deducted: TOKEN_COST })
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
    console.error("SEO planner error:", error)
    return NextResponse.json({ error: "Failed to generate SEO plan" }, { status: 500 })
  }
}
