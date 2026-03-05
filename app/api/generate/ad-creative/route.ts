import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import Replicate from "replicate"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { Database } from "@/types/supabase"

const TOKEN_COST_CAROUSEL = 15
const TOKEN_COST_SINGLE = 8

const VALID_CAROUSEL_TEMPLATES = [
  "hook_problem_cta", "listicle", "before_after", "testimonial", "educational",
] as const
const VALID_SINGLE_TEMPLATES = [
  // Classic
  "hero_offer", "social_proof", "product_feature",
  // Text & Brand
  "ig_bold_headline", "ig_offer_deal", "ig_stats_number", "ig_pain_point",
  "ig_bullet_benefits", "ig_guarantee", "ig_free_offer",
  // Brand Forward
  "ig_logo_hero", "ig_announcement", "ig_luxury_minimal", "ig_dark_premium",
  // Conversion
  "ig_strong_cta", "ig_countdown", "ig_contact",
  // Photo + Text
  "ig_photo_overlay", "ig_split_h", "ig_split_v", "ig_photo_frame",
  "ig_angled_split", "ig_circle_photo", "ig_corner_photo",
  // Social Proof
  "ig_testimonial", "ig_comparison", "ig_results", "ig_case_study",
] as const
const VALID_DIMENSIONS = ["1080x1080", "1080x1350", "1080x1920"] as const

// Carousel slide structures — ported from generate_ad_copy.py
const CAROUSEL_STRUCTURES: Record<string, { slide_count: number; slides: { type: string; instruction: string }[] }> = {
  hook_problem_cta: {
    slide_count: 5,
    slides: [
      { type: "hook", instruction: "Bold provocative question or statement that stops the scroll. Max 8 words." },
      { type: "problem", instruction: "First pain point the audience faces. Headline max 6 words, body 1-2 sentences." },
      { type: "problem", instruction: "Second pain point or consequence. Headline max 6 words, body 1-2 sentences." },
      { type: "solution", instruction: "How the brand solves it. Headline max 6 words, body 1-2 sentences." },
      { type: "cta", instruction: "Clear call to action with the offer. Headline is the CTA text, body is supporting urgency line." },
    ],
  },
  listicle: {
    slide_count: 6,
    slides: [
      { type: "hook", instruction: "Number + topic hook (e.g. '5 Ways to...'). Max 8 words." },
      { type: "list_item", instruction: "Tip #1 — concise, actionable. Headline max 6 words, body 1 sentence." },
      { type: "list_item", instruction: "Tip #2 — concise, actionable. Headline max 6 words, body 1 sentence." },
      { type: "list_item", instruction: "Tip #3 — concise, actionable. Headline max 6 words, body 1 sentence." },
      { type: "list_item", instruction: "Tip #4 — concise, actionable. Headline max 6 words, body 1 sentence." },
      { type: "cta", instruction: "CTA slide. Headline is the action, body is the offer or benefit." },
    ],
  },
  before_after: {
    slide_count: 5,
    slides: [
      { type: "hook", instruction: "Split 'Before vs After' hook. Bold, contrasting. Max 6 words." },
      { type: "before", instruction: "The painful 'before' state. Headline max 6 words, body describes the struggle." },
      { type: "bridge", instruction: "The transition moment ('Then we discovered...'). Headline max 6 words, body is the turning point." },
      { type: "after", instruction: "The transformed 'after' state. Headline max 6 words, body shows the result with specifics." },
      { type: "cta", instruction: "CTA with the transformation promise. Headline is the CTA, body is social proof or urgency." },
    ],
  },
  testimonial: {
    slide_count: 5,
    slides: [
      { type: "hook", instruction: "Most compelling quote excerpt in quotation marks. Max 12 words." },
      { type: "context", instruction: "Customer's situation/context before. Headline: customer name & title, body: their challenge." },
      { type: "challenge", instruction: "The specific problem they faced. Headline max 6 words, body: the impact." },
      { type: "result", instruction: "Key metric or outcome in massive headline (e.g. '327% increase'). Body: supporting detail." },
      { type: "cta", instruction: "'Want the same results?' CTA. Headline is the CTA, body is the offer." },
    ],
  },
  educational: {
    slide_count: 6,
    slides: [
      { type: "hook", instruction: "Framework/method name as hook (e.g. 'The ABC Framework'). Max 8 words." },
      { type: "step", instruction: "Step 1 of the framework. Headline: step name, body: brief explanation." },
      { type: "step", instruction: "Step 2 of the framework. Headline: step name, body: brief explanation." },
      { type: "step", instruction: "Step 3 of the framework. Headline: step name, body: brief explanation." },
      { type: "step", instruction: "Step 4 of the framework. Headline: step name, body: brief explanation." },
      { type: "cta", instruction: "'Ready to implement?' CTA. Headline is the CTA, body is the resource/offer." },
    ],
  },
}

const SINGLE_STRUCTURES: Record<string, { instruction: string }> = {
  // ── Classic ──
  hero_offer: {
    instruction: "Hero offer ad with bold headline (max 8 words), subheadline (max 15 words), and CTA button text (max 4 words).",
  },
  social_proof: {
    instruction: "Social proof ad with a customer quote (max 25 words), customer name + title, star rating (1-5), and a subtle CTA (max 4 words).",
  },
  product_feature: {
    instruction: "Product feature ad with feature headline (max 6 words), 3-4 bullet points (max 8 words each), and CTA button text (max 4 words).",
  },

  // ── Text & Brand ──
  ig_bold_headline: {
    instruction: "Bold brand statement ad. headline: bold statement/claim (max 7 words, uppercase). subheadline: supporting context (max 20 words). cta: CTA button text (max 4 words).",
  },
  ig_offer_deal: {
    instruction: "Price/discount offer ad. headline: the big offer or price (e.g. '50% OFF' or '£997'). subheadline: what they get + urgency (max 15 words). cta: CTA button (max 4 words).",
  },
  ig_stats_number: {
    instruction: "Social proof via statistic. headline: the impressive stat number/value (e.g. '500+' or '3x'). subheadline: what that stat represents (max 8 words). body: brief supporting context sentence (max 15 words). cta: not used.",
  },
  ig_pain_point: {
    instruction: "Problem-agitate ad. headline: a pain point question or statement that resonates (max 10 words). subheadline: amplify the problem/consequence (max 20 words). cta: call-to-action text (max 5 words).",
  },
  ig_bullet_benefits: {
    instruction: "Feature/benefit list ad. headline: main value proposition (max 8 words). body: exactly 3 bullet points separated by newlines, each max 8 words (no dashes or bullets, plain text). cta: CTA button (max 4 words).",
  },
  ig_guarantee: {
    instruction: "Trust/guarantee ad. headline: the guarantee statement (max 8 words). subheadline: what the guarantee covers in detail (max 20 words). cta: CTA button (max 4 words).",
  },
  ig_free_offer: {
    instruction: "Free lead magnet ad. headline: what they get for free (max 8 words). subheadline: benefit of the free thing (max 15 words). cta: CTA button (max 4 words).",
  },

  // ── Brand Forward ──
  ig_logo_hero: {
    instruction: "Brand awareness ad. headline: brand tagline or positioning statement (max 8 words). subheadline: one-line brand description (max 15 words). cta: CTA button (max 4 words).",
  },
  ig_announcement: {
    instruction: "Product/service launch announcement. headline: what is being introduced (max 6 words). subheadline: key benefit or differentiator (max 18 words). cta: CTA text (max 5 words).",
  },
  ig_luxury_minimal: {
    instruction: "Premium/editorial brand ad. headline: sophisticated brand statement (max 8 words, no shouting). subheadline: elegant supporting copy (max 20 words). cta: subtle CTA (max 4 words).",
  },
  ig_dark_premium: {
    instruction: "Luxury dark aesthetic ad. headline: bold premium statement (max 7 words). subheadline: supporting prestige copy (max 18 words). cta: minimal CTA (max 4 words).",
  },

  // ── Conversion ──
  ig_strong_cta: {
    instruction: "Conversion-focused ad. headline: strong attention-grabbing headline (max 7 words). subheadline: supporting value proposition (max 18 words). cta: the main call to action (max 5 words).",
  },
  ig_countdown: {
    instruction: "Urgency/limited time ad. headline: what the deal or offer is (max 8 words). subheadline: urgency reason or what they lose (max 15 words). cta: urgent CTA (max 4 words).",
  },
  ig_contact: {
    instruction: "Lead gen / booking ad. headline: result they want (max 8 words). subheadline: who it is for + reassurance (max 20 words). cta: contact CTA (max 4 words, e.g. 'Book Now').",
  },

  // ── Photo + Text ──
  ig_photo_overlay: {
    instruction: "Photo with overlay ad. headline: punchy bold statement (max 7 words). subheadline: supporting copy (max 18 words). cta: CTA button (max 4 words).",
  },
  ig_split_h: {
    instruction: "Horizontal split ad (photo top, copy bottom). headline: main message (max 7 words). subheadline: supporting detail (max 15 words). cta: CTA button (max 4 words).",
  },
  ig_split_v: {
    instruction: "Vertical split ad (photo left, copy right). headline: main message (max 7 words). subheadline: supporting detail (max 15 words). cta: CTA button (max 4 words).",
  },
  ig_photo_frame: {
    instruction: "Framed photo ad. headline: caption text (max 8 words). subheadline: not used. cta: CTA button (max 4 words).",
  },
  ig_angled_split: {
    instruction: "Diagonal split ad. headline: bold statement (max 7 words). subheadline: brief supporting copy (max 15 words). cta: CTA button (max 4 words).",
  },
  ig_circle_photo: {
    instruction: "Circle photo ad. headline: main message (max 7 words). subheadline: supporting detail (max 15 words). cta: CTA button (max 4 words).",
  },
  ig_corner_photo: {
    instruction: "Corner photo ad. headline: bold statement (max 7 words). subheadline: supporting copy (max 18 words). cta: CTA button (max 4 words).",
  },

  // ── Social Proof ──
  ig_testimonial: {
    instruction: "Customer testimonial ad. headline: the customer quote (max 25 words). subheadline: customer name (e.g. 'Sarah M.'). body: customer title or company (e.g. 'CEO, TechCorp'). cta: subtle CTA (max 4 words).",
  },
  ig_comparison: {
    instruction: "Us vs them comparison ad. headline: comparison title (max 8 words, e.g. 'Old Way vs New Way'). body: 6 items alternating without/with — lines 1,3,5 are WITHOUT items (negatives), lines 2,4,6 are WITH items (positives), each max 7 words, separated by newlines. cta: CTA (max 4 words).",
  },
  ig_results: {
    instruction: "Before/After results ad. headline: the BEFORE metric or state (e.g. '£2k/month' or '3 hours/day'). subheadline: the AFTER metric (e.g. '£15k/month' or '20 min/day'). body: brief context explaining the transformation (max 20 words). cta: CTA (max 4 words).",
  },
  ig_case_study: {
    instruction: "Case study ad. headline: client/situation title (max 8 words). body: exactly 3 lines separated by newlines — line 1: the problem (max 12 words), line 2: the solution (max 12 words), line 3: the result with specifics (max 12 words). cta: CTA (max 4 words).",
  },
}

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const getReplicate = () => new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

const ASPECT_MAP: Record<string, string> = {
  "1080x1080": "1:1",
  "1080x1350": "4:5",
  "1080x1920": "9:16",
}

const VISUAL_STYLE_MODIFIERS: Record<string, string> = {
  "Minimalist": "minimal clean composition, white space, simple, editorial",
  "Bold & Colorful": "vibrant colors, dynamic, energetic, bold composition",
  "Dark & Moody": "dramatic lighting, deep shadows, cinematic, moody atmosphere",
  "Light & Airy": "bright natural light, soft tones, airy, lifestyle photography",
  "Vintage": "warm film grain, retro tones, nostalgic, aged aesthetic",
  "Modern": "contemporary clean lines, modern editorial, professional photography",
}

const PLATFORM_CONTEXT: Record<string, string> = {
  instagram: "punchy and visual-first — hooks must stop the scroll; body copy is tight; hashtag-friendly",
  facebook: "conversational and direct — longer copy is acceptable; clear value proposition; strong CTA",
  linkedin: "B2B professional tone — authority-focused; data and outcomes; no slang",
}

function sanitise(value: string | null | undefined, maxLen = 200): string {
  if (!value) return ""
  return String(value).replace(/[\n\r]/g, " ").slice(0, maxLen).trim()
}

function safeJsonParse(text: string): unknown | null {
  const cleaned = text.replace(/^```(?:json)?\s*/, "").replace(/\s*```\s*$/, "").trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null
  try { return JSON.parse(jsonMatch[0]) } catch { return null }
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s, l]
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function computeAccentColor(primary: string): string {
  try {
    const [h, s, l] = hexToHsl(primary)
    return hslToHex((h + 180) % 360, Math.min(s + 0.2, 1), Math.min(l + 0.15, 0.65))
  } catch {
    return "#E94560"
  }
}

function validateHex(color: string | null | undefined, fallback: string): string {
  if (color && /^#[0-9a-fA-F]{3,6}$/.test(color)) return color
  return fallback
}

function buildBrandVars(profile: Record<string, string | null> | null) {
  const primary = validateHex(profile?.primary_color, "#1A1A2E")
  const secondary = validateHex(profile?.secondary_color, "#16213E")
  const accent = computeAccentColor(primary)

  return {
    primary_color: primary,
    secondary_color: secondary,
    accent_color: accent,
    text_light: "#FFFFFF",
    text_dark: primary,
    bg_color: "#F5F5F5",
    heading_font: "Inter",
    body_font: "Inter",
    brand_name: sanitise(profile?.business_name) || "Brand",
  }
}

interface AdBrief {
  topic: string
  brandName: string
  industry: string
  audience: string
  offer: string
  ctaText: string
  painPoint: string
  platform: string
  tone: string
  testimonialQuote: string
}

function platformLine(platform: string): string {
  return `PLATFORM: ${platform.charAt(0).toUpperCase() + platform.slice(1)} — ${PLATFORM_CONTEXT[platform] || PLATFORM_CONTEXT.instagram}`
}

function buildCarouselPrompt(template: string, brief: AdBrief): string {
  const structure = CAROUSEL_STRUCTURES[template] || CAROUSEL_STRUCTURES.hook_problem_cta
  const slidesDesc = structure.slides
    .map((s, i) => `  Slide ${i + 1} (${s.type}): ${s.instruction}`)
    .join("\n")

  return `Generate ad copy for a ${structure.slide_count}-slide carousel ad.

BRAND: ${brief.brandName}
INDUSTRY: ${brief.industry || "General"}
AUDIENCE: ${brief.audience || "General audience"}
TONE: ${brief.tone || "Professional"}
${platformLine(brief.platform)}

TOPIC: ${brief.topic}
OFFER / LEAD MAGNET: ${brief.offer || "None specified"}
KEY PAIN POINT: ${brief.painPoint || "Infer from topic"}
CTA BUTTON TEXT: Use exactly "${brief.ctaText}" on every CTA button
${brief.testimonialQuote ? `REAL CUSTOMER QUOTE TO USE: "${brief.testimonialQuote}" — work this into the copy authentically` : ""}

SLIDE STRUCTURE:
${slidesDesc}

RULES:
- Headlines must be SHORT and punchy (see max word counts above)
- Body text max 2 sentences per slide
- No emojis
- Use the exact CTA text specified above on CTA slides
- If a real customer quote is provided, use it verbatim (do not paraphrase)

Return ONLY valid JSON:
{
  "slides": [
    {"slide_num": 1, "type": "hook", "headline": "...", "body": "", "cta": ""},
    {"slide_num": 2, "type": "problem", "headline": "...", "body": "...", "cta": ""}
  ],
  "primary_text": "Caption text for the post (2-3 sentences with hook + value + CTA)",
  "hashtags": "#relevant #hashtags #here",
  "background_prompt": "photographic background scene for this ad (max 60 words, no text, no faces, describe environment/lighting/mood/objects only, editorial photography style)"
}`
}

function buildSinglePrompt(template: string, brief: AdBrief): string {
  const structure = SINGLE_STRUCTURES[template] || SINGLE_STRUCTURES.hero_offer

  return `Generate ad copy for a single-image ${template} ad.

BRAND: ${brief.brandName}
INDUSTRY: ${brief.industry || "General"}
AUDIENCE: ${brief.audience || "General audience"}
TONE: ${brief.tone || "Professional"}
${platformLine(brief.platform)}

TOPIC: ${brief.topic}
OFFER / LEAD MAGNET: ${brief.offer || "None specified"}
KEY PAIN POINT: ${brief.painPoint || "Infer from topic"}
CTA BUTTON TEXT: Use exactly "${brief.ctaText}"
${brief.testimonialQuote ? `REAL CUSTOMER QUOTE TO USE: "${brief.testimonialQuote}" — use this verbatim as the headline/quote` : ""}

AD TYPE: ${structure.instruction}

RULES:
- Be concise — this is a single image, not a carousel
- No emojis
- Use the exact CTA text specified above
- If a real customer quote is provided, use it verbatim

Return ONLY valid JSON:
{
  "headline": "Main headline text",
  "subheadline": "Supporting subheadline (if applicable)",
  "body": "Body text or bullet points (use \\n for line breaks between bullets)",
  "cta": "CTA button text",
  "primary_text": "Caption text for the post (2-3 sentences)",
  "hashtags": "#relevant #hashtags",
  "background_prompt": "photographic background scene for this ad (max 60 words, no text, no faces, describe environment/lighting/mood/objects only, editorial photography style)"
}`
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      type, template, topic, dimensions,
      offer: rawOffer = "",
      pain_point: rawPainPoint = "",
      cta_text: rawCtaText = "Book a Free Call",
      platform: rawPlatform = "instagram",
      testimonial_quote: rawTestimonialQuote = "",
    } = body

    // Validate type
    if (!type || !["carousel", "single"].includes(type)) {
      return NextResponse.json({ error: "type must be 'carousel' or 'single'" }, { status: 400 })
    }

    // Validate template
    const validTemplates = type === "carousel" ? VALID_CAROUSEL_TEMPLATES : VALID_SINGLE_TEMPLATES
    if (!template || !(validTemplates as readonly string[]).includes(template)) {
      return NextResponse.json(
        { error: "Invalid template", valid: [...validTemplates] },
        { status: 400 }
      )
    }

    // Validate topic
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }
    const safeTopic = topic.slice(0, 500).trim()

    // Validate dimensions
    const safeDimensions = VALID_DIMENSIONS.includes(dimensions) ? dimensions : "1080x1080"
    const [width, height] = safeDimensions.split("x").map(Number)

    // Token cost
    const tokenCost = type === "carousel" ? TOKEN_COST_CAROUSEL : TOKEN_COST_SINGLE

    // Fetch full profile for brand context
    const { data: profileData } = await supabase
      .from("profiles")
      .select("business_name, industry, target_audience, brand_voice, tone, visual_style, location, instagram_handle, website_url, primary_color, secondary_color")
      .eq("id", user.id)
      .single()

    const profile = profileData as {
      business_name?: string | null
      industry?: string | null
      target_audience?: string | null
      brand_voice?: string | null
      tone?: string | null
      visual_style?: string | null
      location?: string | null
      instagram_handle?: string | null
      website_url?: string | null
      primary_color?: string | null
      secondary_color?: string | null
    } | null

    // Build brand vars
    const brand = buildBrandVars(profile)

    // Sanitise brief fields
    const platform = ["instagram", "facebook", "linkedin"].includes(rawPlatform) ? rawPlatform : "instagram"
    const brief: AdBrief = {
      topic: safeTopic,
      brandName: sanitise(profile?.business_name) || "Brand",
      industry: sanitise(profile?.industry) || "",
      audience: sanitise(profile?.target_audience, 500) || "",
      offer: sanitise(rawOffer, 300),
      ctaText: sanitise(rawCtaText, 60) || "Book a Free Call",
      painPoint: sanitise(rawPainPoint, 200),
      platform,
      tone: sanitise(profile?.tone) || sanitise(profile?.brand_voice) || "Professional",
      testimonialQuote: sanitise(rawTestimonialQuote, 500),
    }

    const prompt = type === "carousel"
      ? buildCarouselPrompt(template, brief)
      : buildSinglePrompt(template, brief)

    // Call Claude
    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    })

    const responseText = message.content[0].type === "text" ? message.content[0].text : ""
    const parsed = safeJsonParse(responseText)

    if (!parsed || typeof parsed !== "object") {
      console.error("Failed to parse ad copy response:", responseText.slice(0, 500))
      return NextResponse.json({ error: "Failed to parse generated copy" }, { status: 500 })
    }

    // Validate response shape
    const copyData = parsed as Record<string, unknown>
    if (type === "carousel" && !Array.isArray(copyData.slides)) {
      return NextResponse.json({ error: "AI returned unexpected format (missing slides)" }, { status: 500 })
    }
    if (type === "single" && !copyData.headline) {
      return NextResponse.json({ error: "AI returned unexpected format (missing headline)" }, { status: 500 })
    }

    // Generate background image with Flux
    let backgroundImageUrl = ""
    const bgPromptRaw = typeof copyData.background_prompt === "string" ? copyData.background_prompt : ""
    if (bgPromptRaw) {
      try {
        const styleModifier = VISUAL_STYLE_MODIFIERS[profile?.visual_style ?? ""] ?? "professional editorial photography"
        const bgPrompt = `${bgPromptRaw}, ${styleModifier}`
        const bgOutput = await getReplicate().run("black-forest-labs/flux-1.1-pro", {
          input: {
            prompt: bgPrompt,
            aspect_ratio: ASPECT_MAP[safeDimensions] ?? "1:1",
            output_format: "webp",
            output_quality: 85,
            safety_tolerance: 2,
            prompt_upsampling: true,
          },
        })
        backgroundImageUrl = typeof bgOutput === "string" ? bgOutput : String(bgOutput)
      } catch (bgErr) {
        console.error("Background image generation failed, proceeding without:", bgErr)
      }
    }

    // Merge background URL into brand vars
    const brandWithBg = { ...brand, background_image_url: backgroundImageUrl }

    // Debit tokens AFTER successful generation
    const admin = createAdminClient()
    try {
      const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
        p_user_id: user.id,
        p_amount: tokenCost,
        p_type: "feature_use",
        p_description: `Generated ad creative: ${template} ${type}`,
      })

      if (debitError) throw debitError

      // Persist as generated asset
      const { data: assetData, error: assetError } = await supabase
        .from("generated_assets")
        .insert({
          user_id: user.id,
          asset_type: type === "carousel" ? "carousel" : "image",
          url: "",
          prompt: safeTopic,
          meta: {
            ad_creative: true,
            template,
            type,
            dimensions: safeDimensions,
            copy: copyData,
            brand: brandWithBg,
          },
        })
        .select()
        .single()

      if (assetError) {
        console.error("Failed to save ad creative asset:", assetError)
      }

      return NextResponse.json({
        copy: { ...copyData, type, template },
        brand: brandWithBg,
        dimensions: { width, height },
        assetId: assetData?.id ?? null,
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
    console.error("Ad creative generation error:", error)
    return NextResponse.json({ error: "Failed to generate ad creative" }, { status: 500 })
  }
}
