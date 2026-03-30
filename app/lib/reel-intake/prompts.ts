/* ------------------------------------------------------------------ */
/*  Claude prompt builders for the Smart Form reel intake              */
/* ------------------------------------------------------------------ */

import type { VisualTemplate, InputMode } from "./types"

/* ================================================================== */
/*  ANALYZE — returns tailored questions based on images / topic       */
/* ================================================================== */

export function buildAnalyzePrompt(
  topic: string,
  inputMode: InputMode,
  hasImages: boolean,
  template?: VisualTemplate | null,
): string {
  const templateList = `
Available visual templates:
- dark_luxury — Moody, deep charcoal with warm gold accents. Best for luxury architecture, premium interiors.
- clean_minimal — Crisp white, editorial. Best for Scandinavian design, boutique studios.
- bold_editorial — High-contrast, graphic, magazine energy. Best for agencies, modern brands.
- warm_natural — Earthy, terracotta and oak. Best for biophilic design, wellness, sustainability.
- urban_industrial — Concrete, steel, dramatic tungsten. Best for urban architecture, loft conversions.
- bright_playful — Vibrant, energetic. Best for residential, lifestyle, younger audiences.`

  const selectedTemplateLine = template
    ? `\nThe user already selected the "${template.name}" template (${template.id}).`
    : ""

  if (hasImages && inputMode === "own_images") {
    return `You are an Instagram reel creative director. The user has uploaded their own photos that they want turned into an Instagram reel. Analyse the photos and generate tailored questions.

TOPIC: "${topic || "(derive from images)"}"
INPUT MODE: The user wants their own photos animated into a video reel.${selectedTemplateLine}
${templateList}

YOUR TASKS:
1. Analyse ALL uploaded images — describe the visual style, mood, dominant colours, composition patterns, subject matter, and quality level.
2. Infer which visual template best matches these images (from the list above).
3. Generate 5-8 tailored questions to help you create the perfect reel. Questions must be SPECIFIC to what you see in the images and the topic — not generic.

QUESTION DESIGN RULES:
- Each question: { id (snake_case), label (short), description (one sentence), type ("select" | "text" | "textarea" | "toggle") }
- For "select": include options array [{ value, label }] and a "recommended" field with your AI pick.
- For "text"/"textarea": include "placeholder" and optionally "prefilled" if you can infer a good default.
- Always include these core questions (adapt the options to what you see):
  1. mood (select) — emotional tone, options tailored to the images
  2. story_angle (select) — tips list / transformation / behind the scenes / case study / myth bust
  3. slide_count (select) — options: 5, 7, 9
  4. hook_angle (text) — what makes someone stop scrolling
  5. cta (text) — call to action text
- Add 2-3 MORE questions specific to the images (e.g. "strongest_hook_image" asking which photo is most dramatic, "key_message" for the overall takeaway, "avoid" for things to leave out).
- Maximum 8 questions total.

Return ONLY valid JSON — no markdown fences:
{
  "imageAnalysis": "2-4 sentence analysis of the uploaded photos",
  "inferredTemplate": "template_id",
  "inferredMood": "1-3 mood words",
  "questions": [ ... ]
}`
  }

  if (hasImages && inputMode === "ai_images") {
    return `You are an Instagram reel creative director. The user has uploaded REFERENCE images for style direction — they want AI-generated images inspired by this aesthetic.

TOPIC: "${topic}"
INPUT MODE: AI-generated images. The uploaded photos are for style reference only, not to be used directly.${selectedTemplateLine}
${templateList}

YOUR TASKS:
1. Analyse the reference images — describe the visual style, mood, colour palette, composition patterns, and aesthetic they represent.
2. Infer which visual template best matches this aesthetic.
3. Generate 5-8 tailored questions to create the perfect AI-generated reel.

QUESTION DESIGN RULES:
- Same rules as above (id, label, description, type, options, recommended, prefilled, placeholder).
- Always include: mood, story_angle, slide_count, hook_angle, cta.
- Add 2-3 questions specific to the aesthetic/topic (e.g. "visual_elements" for specific objects to include, "avoid" for things to leave out, "shot_type" for camera angle preferences).
- Maximum 8 questions.

Return ONLY valid JSON:
{
  "imageAnalysis": "2-4 sentence analysis of the reference aesthetic",
  "inferredTemplate": "template_id",
  "inferredMood": "1-3 mood words",
  "questions": [ ... ]
}`
  }

  // No images — topic only
  return `You are an Instagram reel creative director. Generate tailored questions to create the perfect reel based on the topic.

TOPIC: "${topic}"
INPUT MODE: ${inputMode === "own_images" ? "User will provide their own photos (not yet uploaded)" : "AI-generated images"}${selectedTemplateLine}
${templateList}

Generate 5-8 tailored questions. Questions should be specific to the topic, not generic.

QUESTION DESIGN RULES:
- Each question: { id, label, description, type, options?, recommended?, prefilled?, placeholder? }
- Always include: mood (select), story_angle (select), slide_count (select: 5/7/9), hook_angle (text), cta (text)
- Add 2-3 topic-specific questions.
- Maximum 8 questions.
${!template ? "\n- Include a template (select) question with all 6 options and your recommendation for this topic." : ""}

Return ONLY valid JSON:
{
  "questions": [ ... ]${!template ? ',\n  "inferredTemplate": "your_recommended_template_id"' : ""}
}`
}


/* ================================================================== */
/*  BRIEF — generates per-slide creative brief from answers            */
/* ================================================================== */

export function buildBriefPrompt(
  topic: string,
  template: VisualTemplate,
  answers: Record<string, string>,
  inputMode: InputMode,
  imageAnalysis?: string,
  photoFilenames?: string[],
): string {
  const numSlides = Math.min(12, Math.max(3, parseInt(answers.slide_count || "7", 10) || 7))
  const layouts = template.slide_layouts

  const answersBlock = Object.entries(answers)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n")

  const templateBlock = `
VISUAL TEMPLATE: ${template.name} (${template.id})
Style: ${template.flux_style_prefix}
Lighting: ${template.lighting_style}
Colours: ${template.color_description}
Negative: ${template.flux_negative_prompt}
Hook layout: ${layouts.hook.composition} — ${layouts.hook.note}
Content layout: ${layouts.content.composition} — ${layouts.content.note}
CTA layout: ${layouts.cta.composition} — ${layouts.cta.note}`

  const imageAnalysisBlock = imageAnalysis
    ? `\nIMAGE ANALYSIS:\n${imageAnalysis}`
    : ""

  if (inputMode === "own_images" && photoFilenames?.length) {
    return `You are an Instagram reel creative director creating a frame-by-frame reel plan from the user's own photos.

TOPIC: "${topic}"
${templateBlock}
${imageAnalysisBlock}

USER'S CREATIVE ANSWERS:
${answersBlock}

UPLOADED PHOTOS (in order): ${photoFilenames.join(", ")}
NUMBER OF SLIDES: ${numSlides}

Create a ${numSlides}-slide reel brief. Each slide uses one of the uploaded photos as its source, animated by Higgsfield into a 5-second cinematic video clip.

SLIDE STRUCTURE:
- Slide 1 (hook): Most dramatic photo. Highest visual impact. On-screen text = scroll-stopping hook (max 8 words).
- Slides 2 to ${numSlides - 2} (content): Each covers one point. Vary camera movements.
- Slide ${numSlides - 1} (proof): Result/overview shot.
- Slide ${numSlides} (cta): Warmest, most accessible photo. Clear CTA text.

PER-SLIDE FIELDS:
- source_image: exact filename from the list. Repeat best images if more slides than photos.
- camera_movement: e.g. "Slow dolly-in", "Gentle pan right", "Static with subtle zoom"
- higgsfield_prompt: 5-15 words max. Format: "Camera move. Lighting. Scene detail." Example: "Slow dolly-in. Warm ambient light. Luxury interior."
- on_screen_text: punchy text overlay (hook = max 8 words, content = numbered point, cta = direct call to action)
- visual_summary: one sentence describing what the viewer sees

RULES:
- Never repeat the same camera movement on consecutive slides.
- Vary intensity: hook = most dramatic, content = informative, cta = warm.
- The user's answers dictate mood, angle, and messaging.

Return ONLY valid JSON:
{
  "brief": {
    "topic": "${topic}",
    "template": "${template.id}",
    "mood": "inferred mood words",
    "inputMode": "own_images",
    "slides": [
      {
        "slide": 1,
        "type": "hook",
        "source_image": "filename.jpg",
        "camera_movement": "Slow dolly-in",
        "higgsfield_prompt": "Slow dolly-in. Warm rim light. Luxury interior.",
        "on_screen_text": "Bold hook line",
        "visual_summary": "What the viewer sees"
      }
    ]
  }
}`
  }

  // AI-generated images mode
  return `You are an Instagram reel creative director and Flux Pro prompt engineer creating a ${numSlides}-slide reel brief.

TOPIC: "${topic}"
${templateBlock}
${imageAnalysisBlock}

USER'S CREATIVE ANSWERS:
${answersBlock}

BRAND STYLE PREFIX (prepend to every Flux prompt): ${template.flux_style_prefix}
NEGATIVE PROMPT BASE: ${template.flux_negative_prompt}
FORMAT NOTE (end every Flux prompt with): vertical portrait composition, 9:16 format

Create a ${numSlides}-slide brief with per-slide Flux Pro image generation prompts.

SLIDE STRUCTURE:
- Slide 1 (hook): Highest visual drama. Scroll-stopping composition.
- Slides 2 to ${numSlides - 2} (content): Each illustrates one specific point. Vary compositions.
- Slide ${numSlides - 1} (proof): Result/summary/social proof shot.
- Slide ${numSlides} (cta): Warm, accessible. Invites action.

FLUX PROMPT RULES (CRITICAL):
1. Start with the brand style prefix.
2. Then a SPECIFIC scene description (not "modern office" but "glass-walled corner office overlooking city skyline at dusk, single architect bent over blueprints under warm pendant lamp").
3. Include template lighting style in every prompt.
4. End every prompt with "vertical portrait composition, 9:16 format".
5. 40-70 words per prompt. Be vivid and precise.
6. Vary shots: hook = extreme close-up or dramatic wide, content = mix of angles, cta = simple clean.
7. Do NOT include text in the Flux prompt — text overlays are added separately.

Return ONLY valid JSON:
{
  "brief": {
    "topic": "${topic}",
    "template": "${template.id}",
    "mood": "inferred mood",
    "inputMode": "ai_images",
    "slides": [
      {
        "slide": 1,
        "type": "hook",
        "on_screen_text": "Bold hook (max 8 words)",
        "visual_summary": "What the viewer sees",
        "flux_prompt": "Full Flux Pro prompt 40-70 words...",
        "flux_negative": "Full negative prompt for this slide"
      }
    ]
  }
}`
}
