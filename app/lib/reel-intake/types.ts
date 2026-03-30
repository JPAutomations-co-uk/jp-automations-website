/* ------------------------------------------------------------------ */
/*  Shared types for the Smart Form AI Reel Intake                    */
/* ------------------------------------------------------------------ */

// ---- Dynamic question schema returned by Claude ----

export type IntakeQuestionType = "select" | "text" | "textarea" | "toggle"

export type IntakeQuestionOption = {
  value: string
  label: string
  description?: string
}

export type IntakeQuestion = {
  id: string
  label: string
  description: string
  type: IntakeQuestionType
  options?: IntakeQuestionOption[]
  recommended?: string
  prefilled?: string
  placeholder?: string
}

// ---- Input mode ----

export type InputMode = "own_images" | "ai_images"

// ---- Analyze (step 1) ----

export type AnalyzeRequest = {
  action: "analyze"
  topic: string
  imageAssetKeys?: string[]
  template?: string
  inputMode: InputMode
}

export type AnalyzeResponse = {
  imageAnalysis?: string
  inferredTemplate?: string
  inferredMood?: string
  questions: IntakeQuestion[]
  inputMode: InputMode
}

// ---- Brief (step 2) ----

export type BriefRequest = {
  action: "brief"
  topic: string
  imageAssetKeys?: string[]
  template?: string
  inputMode: InputMode
  answers: Record<string, string>
}

export type BriefSlide = {
  slide: number
  type: "hook" | "content" | "proof" | "cta"
  on_screen_text: string
  visual_summary: string
  // Own-images mode
  source_image?: string
  higgsfield_prompt?: string
  camera_movement?: string
  // AI-images mode
  flux_prompt?: string
  flux_negative?: string
}

export type CreativeBrief = {
  topic: string
  template: string
  mood: string
  inputMode: InputMode
  slides: BriefSlide[]
}

export type BriefResponse = {
  brief: CreativeBrief
}

// ---- Generate (step 3) ----

export type GenerateRequest = {
  action: "generate"
  brief: CreativeBrief
  imageAssetKeys?: string[]
}

// ---- Visual template (matches the JSON files) ----

export type SlideLayout = {
  composition: string
  text_position: string
  note: string
}

export type VisualTemplate = {
  id: string
  name: string
  description: string
  flux_style_prefix: string
  flux_negative_prompt: string
  color_description: string
  lighting_style: string
  slide_layouts: {
    hook: SlideLayout
    content: SlideLayout
    cta: SlideLayout
  }
  text_overlay: {
    hook_font_size: number
    content_font_size: number
    text_color: number[]
    box_color: number[]
    box_style: string
    accent_color: number[]
    slide_number_color: number[]
  }
}

export type TemplateListItem = {
  id: string
  name: string
  description: string
  accentColor: string
}
