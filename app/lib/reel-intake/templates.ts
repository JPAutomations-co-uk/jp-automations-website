/* ------------------------------------------------------------------ */
/*  Visual template loader for the Smart Form intake                  */
/*  Template data inlined to avoid importing from outside app/.       */
/* ------------------------------------------------------------------ */

import type { VisualTemplate, TemplateListItem } from "./types"

const darkLuxury: VisualTemplate = {
  id: "dark_luxury",
  name: "Dark Luxury",
  description: "Moody, premium aesthetic with deep backgrounds and warm metallic accent lighting. Best for high-end architecture, luxury interiors, and premium services.",
  flux_style_prefix: "dark luxury aesthetic, moody premium atmosphere, editorial sophistication, high-end architectural photography, cinematic depth",
  flux_negative_prompt: "bright white backgrounds, casual, low quality, busy clutter, overexposed, cartoon, illustration, 3D render, watermark, amateur photography, harsh flash, cheap materials",
  color_description: "deep charcoal and near-black tones, warm gold and amber accents, rich shadow depth",
  lighting_style: "warm directional spotlighting, dramatic Rembrandt-style side lighting, deep shadow pools, golden accent highlights",
  slide_layouts: {
    hook: { composition: "extreme close-up of premium material texture or dramatic wide reveal of a luxury space", text_position: "center", note: "high-contrast single focal point, designed to stop the scroll" },
    content: { composition: "architectural three-quarter view with dramatic depth, leading lines toward the subject", text_position: "bottom", note: "show context, environment, and premium detail" },
    cta: { composition: "minimal, clean luxury scene — single object or empty premium space", text_position: "center", note: "warm and inviting, lower contrast than hook slide" },
  },
  text_overlay: { hook_font_size: 90, content_font_size: 64, text_color: [255, 255, 255], box_color: [0, 0, 0, 160], box_style: "pill", accent_color: [201, 169, 110], slide_number_color: [201, 169, 110] },
}

const cleanMinimal: VisualTemplate = {
  id: "clean_minimal",
  name: "Clean Minimal",
  description: "Crisp white editorial aesthetic with extensive negative space. Best for Scandinavian-inspired design, boutique studios, and clean modern architecture.",
  flux_style_prefix: "clean minimalist aesthetic, extensive negative space, editorial white photography, Scandinavian design influence, restrained sophistication",
  flux_negative_prompt: "dark moody backgrounds, clutter, busy patterns, dramatic shadows, garish colours, illustration, 3D render, watermark, oversaturated, low quality",
  color_description: "bright whites and off-whites, soft warm neutrals, single muted accent tone, generous empty space",
  lighting_style: "soft diffused natural light, north-facing window light, even ambient illumination, minimal harsh shadows",
  slide_layouts: {
    hook: { composition: "wide minimal scene with single focal element, hero shot with generous breathing room", text_position: "top", note: "simplicity is the hook — let the white space do the work" },
    content: { composition: "clean flat lay or architectural elevation-style view, symmetrical or rule-of-thirds", text_position: "bottom", note: "show detail without visual noise" },
    cta: { composition: "product or space shot against clean white background, ultra-minimal", text_position: "center", note: "completely uncluttered, all focus on the CTA text" },
  },
  text_overlay: { hook_font_size: 80, content_font_size: 60, text_color: [20, 20, 20], box_color: [255, 255, 255, 180], box_style: "pill", accent_color: [80, 80, 80], slide_number_color: [150, 150, 150] },
}

const boldEditorial: VisualTemplate = {
  id: "bold_editorial",
  name: "Bold Editorial",
  description: "High-contrast graphic aesthetic with punchy typography energy. Best for agencies, bold modern brands, and content that needs to stop the scroll aggressively.",
  flux_style_prefix: "bold editorial photography, high-contrast graphic composition, strong geometry, design-forward architectural photography, magazine cover energy",
  flux_negative_prompt: "soft pastel tones, low contrast, muddy colours, cluttered backgrounds, casual snapshot, illustration, 3D render, watermark, flat lighting, boring composition",
  color_description: "bold high-contrast palette, strong black and white with a single vivid accent colour, graphic punch",
  lighting_style: "hard directional light, strong shadows, high contrast split lighting, graphic chiaroscuro effect",
  slide_layouts: {
    hook: { composition: "extreme angle shot, strong diagonal leading lines, graphic compression of space", text_position: "center", note: "aggressive, scroll-stopping composition — think magazine cover" },
    content: { composition: "bold symmetrical or asymmetrical geometry, architectural abstraction", text_position: "bottom", note: "strong visual hierarchy, clear subject vs background separation" },
    cta: { composition: "bold single-subject shot with strong negative space for text", text_position: "center", note: "graphic and clean — text should feel designed, not added" },
  },
  text_overlay: { hook_font_size: 96, content_font_size: 68, text_color: [255, 255, 255], box_color: [15, 15, 15, 200], box_style: "square", accent_color: [255, 60, 40], slide_number_color: [255, 60, 40] },
}

const warmNatural: VisualTemplate = {
  id: "warm_natural",
  name: "Warm Natural",
  description: "Earthy, biophilic aesthetic with natural textures and organic warmth. Best for sustainable architecture, biophilic design, wellness brands, and nature-connected businesses.",
  flux_style_prefix: "warm natural aesthetic, biophilic design photography, organic earthy warmth, natural textures and materials, lifestyle editorial photography",
  flux_negative_prompt: "harsh artificial lighting, cold blue tones, sterile corporate environment, clutter, illustration, 3D render, watermark, neon colours, industrial cold aesthetics, low quality",
  color_description: "warm terracotta, oak wood tones, sage green, warm off-white, natural linen — earth palette",
  lighting_style: "warm golden hour sunlight, soft diffused window light, dappled natural shadow, organic ambient warmth",
  slide_layouts: {
    hook: { composition: "immersive nature-integrated space, lush greenery as primary visual element, human connection to nature", text_position: "bottom", note: "let nature be the hero — breathtaking organic composition" },
    content: { composition: "close-up of natural material texture or mid-shot showing biophilic design detail", text_position: "bottom", note: "tactile, warm, inviting — the viewer should want to touch it" },
    cta: { composition: "warm, cosy lifestyle scene — a space that feels like home", text_position: "center", note: "emotionally warm and welcoming, lowest intensity slide" },
  },
  text_overlay: { hook_font_size: 84, content_font_size: 62, text_color: [255, 252, 245], box_color: [60, 40, 20, 150], box_style: "pill", accent_color: [180, 110, 60], slide_number_color: [180, 130, 80] },
}

const urbanIndustrial: VisualTemplate = {
  id: "urban_industrial",
  name: "Urban Industrial",
  description: "Raw concrete, steel and dramatic light aesthetic. Best for urban architecture, commercial fit-outs, loft conversions, and brands with an edge.",
  flux_style_prefix: "urban industrial aesthetic, raw concrete and exposed steel, dramatic architectural photography, brutalist grandeur, urban grit with design sophistication",
  flux_negative_prompt: "soft pastels, rustic countryside, cosy warmth, floral patterns, illustration, 3D render, watermark, cheerful bright colours, cheap materials, suburban mundane",
  color_description: "raw concrete grey, weathered steel, deep shadow blacks, amber tungsten accent light on cold surfaces",
  lighting_style: "dramatic tungsten spotlighting in dark spaces, shafts of daylight through industrial openings, stark contrast between lit and shadow zones",
  slide_layouts: {
    hook: { composition: "vast industrial space with single vanishing point perspective, human scale dwarfed by architecture", text_position: "center", note: "overwhelming scale is the hook — the viewer should feel the weight of the space" },
    content: { composition: "close-up of raw material detail — concrete texture, weld joints, rusted metal, structural elements", text_position: "bottom", note: "tactile and gritty, show the honest beauty of industrial materials" },
    cta: { composition: "dramatic but warmer industrial scene — same aesthetic, slightly more accessible and human", text_position: "center", note: "pull back slightly from the intensity to invite action" },
  },
  text_overlay: { hook_font_size: 88, content_font_size: 64, text_color: [240, 235, 225], box_color: [20, 20, 20, 170], box_style: "square", accent_color: [200, 130, 50], slide_number_color: [160, 100, 40] },
}

const brightPlayful: VisualTemplate = {
  id: "bright_playful",
  name: "Bright Playful",
  description: "Vibrant, high-energy aesthetic with bold colour and expressive composition. Best for residential design, consumer-facing brands, lifestyle content, and younger audiences.",
  flux_style_prefix: "bright vibrant aesthetic, joyful high-energy photography, playful bold colour, lifestyle editorial with personality, optimistic modern design photography",
  flux_negative_prompt: "dark moody tones, gloomy shadows, cold corporate sterility, muted desaturated colours, serious heavy atmosphere, illustration, 3D render, watermark, low quality, boring neutral backgrounds",
  color_description: "vibrant saturated colours, bold accent hues, bright whites, energetic colour combinations",
  lighting_style: "bright even daylight, colourful bounced fill light, cheerful open shade, sun-drenched warmth",
  slide_layouts: {
    hook: { composition: "vibrant lifestyle moment, joyful human interaction with a designed space, colour explosion", text_position: "top", note: "optimism and energy — the viewer should smile involuntarily" },
    content: { composition: "colourful flat lay or bright architectural detail with playful composition, off-centre energy", text_position: "bottom", note: "variety of angles, fun and approachable, never stiff" },
    cta: { composition: "friendly, bright, open scene — inviting the viewer in", text_position: "center", note: "fun and energetic but with a clear visual CTA focus" },
  },
  text_overlay: { hook_font_size: 88, content_font_size: 64, text_color: [255, 255, 255], box_color: [30, 80, 200, 180], box_style: "pill", accent_color: [255, 200, 0], slide_number_color: [255, 200, 0] },
}

export const TEMPLATES: Record<string, VisualTemplate> = {
  dark_luxury: darkLuxury,
  clean_minimal: cleanMinimal,
  bold_editorial: boldEditorial,
  warm_natural: warmNatural,
  urban_industrial: urbanIndustrial,
  bright_playful: brightPlayful,
}

/** Flat list for the template picker UI */
export const TEMPLATE_LIST: TemplateListItem[] = [
  { id: "dark_luxury", name: "Dark Luxury", description: "Moody, premium — warm gold on deep charcoal", accentColor: "#C9A96E" },
  { id: "clean_minimal", name: "Clean Minimal", description: "Crisp white editorial, Scandinavian feel", accentColor: "#505050" },
  { id: "bold_editorial", name: "Bold Editorial", description: "High-contrast, graphic, magazine energy", accentColor: "#FF4444" },
  { id: "warm_natural", name: "Warm Natural", description: "Earthy, biophilic — terracotta and oak", accentColor: "#B46E3C" },
  { id: "urban_industrial", name: "Urban Industrial", description: "Concrete, steel, dramatic tungsten light", accentColor: "#7A8A9A" },
  { id: "bright_playful", name: "Bright Playful", description: "Vibrant, energetic, joyful colour", accentColor: "#FF9F43" },
]

export function getTemplate(id: string): VisualTemplate | null {
  return TEMPLATES[id] ?? null
}
