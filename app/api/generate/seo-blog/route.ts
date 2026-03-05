import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

const TOKEN_COSTS: Record<string, number> = { "800": 20, "1200": 30, "2000": 40 }
const VALID_WORD_COUNTS = ["800", "1200", "2000"]
const VALID_GOALS = ["rank", "questions", "expertise", "enquiries"]

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
  return `You are an expert SEO content writer specialising in local service businesses in the UK. You write blog posts that rank on Google for local service keywords like "emergency plumber Bristol" or "roof repairs Manchester".

Your expertise includes:
- **Local SEO**: How Google ranks local service pages, the importance of location + service keyword combinations, and how to signal relevance for a specific geography.
- **Search intent**: Distinguishing informational ("how to fix a leaky tap"), commercial ("best plumbers in Bristol"), and transactional ("emergency plumber Bristol") intent — and writing the right content for each.
- **On-page SEO**: Optimal keyword placement (title, H1, first paragraph, H2s, meta description), keyword density (1-2% primary, LSI keywords throughout), and structure signals Google rewards.
- **Featured snippets**: Structuring FAQ sections and step-by-step content to capture People Also Ask boxes.
- **Helpful Content**: Writing genuinely useful, expert content that serves the reader first — not thin, keyword-stuffed filler. Google's Helpful Content algorithm rewards depth and experience.
- **UK English**: Always writing in British English (e.g., "colour", "neighbour", "whilst", "kerb", "authorise").

You write as if you are the service business owner — sharing genuine expertise, referencing real scenarios, and speaking directly to local homeowners or businesses.

You ALWAYS respond with valid JSON only. No markdown fences, no explanation outside the JSON object.`
}

function buildBlogPrompt(
  keyword: string,
  location: string,
  businessName: string,
  businessType: string,
  targetAudience: string,
  wordCount: string,
  goal: string,
  websiteUrl: string,
  toneExample: string,
  specificTopic: string
): string {
  const goalInstructions: Record<string, string> = {
    rank: "Optimise purely for ranking. Perfect keyword placement, comprehensive coverage of the topic, structured for featured snippets. Beat whatever is currently ranking by being more thorough and useful.",
    questions: "Answer every question people are Googling about this service. Target People Also Ask boxes. Write clear, concise answers (2-3 sentences) that Google can extract directly. The FAQ section is critical.",
    expertise: "Establish the business as the definitive local expert. Share technical knowledge, real-world experience, and insights that only someone who has done this work for years would know. This builds trust and E-E-A-T signals.",
    enquiries: "Balance SEO with persuasion. Include subtle social proof, address common objections, and make the reader feel confident about choosing this business. The CTA should be natural and compelling — not pushy.",
  }

  const wcNum = parseInt(wordCount)
  const depth = wcNum === 800
    ? "A focused, high-value article covering the core topic clearly and concisely. 3-4 main sections."
    : wcNum === 1200
    ? "A well-rounded article with good depth. 4-5 main sections with some H3 subsections."
    : "A comprehensive pillar article that is the most thorough resource on the topic. 5-6 main sections, H3 subsections, step-by-step breakdowns, and detailed FAQs."

  const toneSection = toneExample
    ? `\n═══ TONE & VOICE ═══\nThe business has provided a writing sample below. Analyse and match this voice precisely — same sentence rhythm, vocabulary level, use of technical vs plain language, personality, and warmth. Do not copy the content, only the style.\n\n"${toneExample}"\n`
    : ""

  const topicSection = specificTopic
    ? `\n═══ SPECIFIC ANGLE / QUESTION TO COVER ═══\nThe business specifically wants the article to address: "${specificTopic}"\nMake sure this angle is woven naturally into the article — ideally addressed in one of the main H2 sections or prominently in the introduction.\n`
    : ""

  return `Write a complete, publish-ready SEO blog post for a local UK service business.

═══ BUSINESS DETAILS ═══
Business Name: ${businessName || "the business"}
Business Type: ${businessType || "service business"}
Location: ${location || "UK"}
Target Audience: ${targetAudience || "local homeowners and businesses"}
Website: ${websiteUrl || "their website"}

═══ SEO TARGET ═══
Primary Keyword: ${keyword}
Location: ${location || "UK"}

═══ CONTENT GOAL ═══
${goalInstructions[goal] || goalInstructions.rank}

═══ DEPTH & STRUCTURE ═══
Word count: Approximately ${wcNum} words (body content only)
${depth}
Language: British English throughout
Tone: Professional but approachable — written as the knowledgeable local business owner
${toneSection}${topicSection}
═══ SEO RULES ═══
1. **H1 Title**: Contains the exact primary keyword naturally. Compelling enough to click. Under 60 characters.
2. **Meta description**: Contains keyword, compelling to click, 140-155 characters exactly.
3. **Opening paragraph** (first 150 words):
   - Hook addressing the reader's immediate pain or question
   - Include primary keyword in the first 100 words
   - Mention ${location || "the local area"} naturally
   - Preview what the article covers
4. **Body**:
   - Use ## for H2 sections, ### for H3 subsections
   - Include primary keyword naturally 2-3 more times across the article
   - Weave in 6-8 secondary/LSI keywords (related terms, synonyms, entity terms people actually search)
   - Vary sentence length — short for emphasis, longer for explanation
   - Use bullet points and numbered lists for scannability
   - Include at least one step-by-step section (targets featured snippets)
5. **Location signals**: Mention ${location || "the service area"} 3-5 times naturally throughout the article
6. **FAQ section** (at the end of content):
   - H2: "Frequently Asked Questions"
   - 5 questions that match real Google searches for this service + location
   - Each answer: 2-3 sentences, written to be featured snippet-ready
   - Format as ### for each question
7. **Conclusion**: Summary of key points + natural CTA referencing the business name and encouraging contact

═══ INTERNAL LINKING ═══
Suggest 3 natural internal link opportunities within the content:
- The anchor text to use
- What page type it should link to (e.g., "main ${businessType} service page", "contact page", "specific service page")

═══ RESPONSE FORMAT ═══
Respond with this exact JSON structure (no markdown, no code fences):
{
  "title": "The H1 title — must contain primary keyword",
  "slug": "url-friendly-slug-with-keyword-and-location",
  "meta_title": "SEO meta title under 60 chars with keyword",
  "meta_description": "Compelling meta description 140-155 chars with keyword naturally included",
  "reading_time": "X min read",
  "target_keyword": "${keyword}",
  "secondary_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "content": "Full markdown article body starting from the opening paragraph (NOT the H1 — that is the title field above). Use ## for H2, ### for H3. Use **bold** for emphasis. Include the FAQ section at the end of this field.",
  "faq": [
    {"question": "Question one?", "answer": "Answer in 2-3 sentences."},
    {"question": "Question two?", "answer": "Answer in 2-3 sentences."},
    {"question": "Question three?", "answer": "Answer in 2-3 sentences."},
    {"question": "Question four?", "answer": "Answer in 2-3 sentences."},
    {"question": "Question five?", "answer": "Answer in 2-3 sentences."}
  ],
  "internal_link_suggestions": [
    "Link anchor: '[anchor text]' in [where in article] → links to [page type]",
    "Link anchor: '[anchor text]' in [where in article] → links to [page type]",
    "Link anchor: '[anchor text]' in [where in article] → links to [page type]"
  ],
  "cta_text": "The closing CTA paragraph (1-2 sentences)"
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
    const { keyword, location, businessName, businessType, targetAudience, websiteUrl, wordCount, goal, toneExample, specificTopic } = body

    // Validate required fields
    if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
      return NextResponse.json({ error: "Target keyword is required" }, { status: 400 })
    }

    if (!wordCount || !VALID_WORD_COUNTS.includes(String(wordCount))) {
      return NextResponse.json({ error: "wordCount must be 800, 1200, or 2000" }, { status: 400 })
    }

    if (!goal || !VALID_GOALS.includes(String(goal))) {
      return NextResponse.json({ error: "Invalid goal" }, { status: 400 })
    }

    // Sanitise all inputs
    const safeKeyword = sanitise(keyword, 150)
    const safeLocation = sanitise(location, 100)
    const safeBusinessName = sanitise(businessName, 100)
    const safeBusinessType = sanitise(businessType, 100)
    const safeTargetAudience = sanitise(targetAudience, 300)
    const safeWebsiteUrl = sanitise(websiteUrl, 200)
    const safeToneExample = typeof toneExample === "string" ? toneExample.slice(0, 1500).trim() : ""
    const safeSpecificTopic = sanitise(specificTopic, 300)
    const safeWordCount = String(wordCount)
    const safeGoal = String(goal)

    const tokenCost = TOKEN_COSTS[safeWordCount]

    // Fetch profile for any missing context
    const { data: profileRaw } = await supabase
      .from("profiles")
      .select("business_name, industry, target_audience, location")
      .eq("id", user.id)
      .single()

    const profile = profileRaw as {
      business_name?: string | null
      industry?: string | null
      target_audience?: string | null
      location?: string | null
    } | null

    const finalBusinessName = safeBusinessName || sanitise(profile?.business_name, 100) || ""
    const finalBusinessType = safeBusinessType || sanitise(profile?.industry, 100) || ""
    const finalTargetAudience = safeTargetAudience || sanitise(profile?.target_audience, 300) || ""
    const finalLocation = safeLocation || sanitise(profile?.location, 100) || "UK"

    // Generate blog with Claude
    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: safeWordCount === "2000" ? 8000 : safeWordCount === "1200" ? 6000 : 4000,
      system: buildSystemPrompt(),
      messages: [
        {
          role: "user",
          content: buildBlogPrompt(
            safeKeyword,
            finalLocation,
            finalBusinessName,
            finalBusinessType,
            finalTargetAudience,
            safeWordCount,
            safeGoal,
            safeWebsiteUrl,
            safeToneExample,
            safeSpecificTopic
          ),
        },
      ],
    })

    const responseText = message.content[0].type === "text" ? message.content[0].text : ""
    const blog = safeJsonParse(responseText)

    if (!blog || typeof blog !== "object") {
      console.error("Failed to parse blog response:", responseText.slice(0, 500))
      return NextResponse.json({ error: "Failed to parse generated blog" }, { status: 500 })
    }

    const blogObj = blog as Record<string, unknown>
    if (!blogObj.title || !blogObj.content) {
      return NextResponse.json({ error: "AI returned an unexpected response format" }, { status: 500 })
    }

    // Deduct tokens after successful generation
    const admin = createAdminClient()
    try {
      const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
        p_user_id: user.id,
        p_amount: tokenCost,
        p_type: "feature_use",
        p_description: `Generated SEO blog: "${safeKeyword}"`,
      })

      if (debitError) throw debitError

      // Persist to Supabase (graceful — don't fail the request if table doesn't exist yet)
      let blogId: string | null = null
      try {
        const { data: saved, error: saveError } = await supabase
          .from("seo_blogs")
          .insert({
            user_id: user.id,
            target_keyword: safeKeyword,
            location: finalLocation,
            title: blogObj.title as string,
            meta_description: blogObj.meta_description as string,
            content: blogObj.content as string,
            word_count: parseInt(safeWordCount),
            secondary_keywords: blogObj.secondary_keywords as string[],
          })
          .select("id")
          .single()

        if (!saveError && saved) blogId = saved.id
      } catch (persistErr) {
        console.warn("Could not persist blog (table may not exist yet):", persistErr)
      }

      return NextResponse.json({
        blog,
        blogId,
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
    console.error("SEO blog generation error:", error)
    return NextResponse.json({ error: "Failed to generate blog" }, { status: 500 })
  }
}
