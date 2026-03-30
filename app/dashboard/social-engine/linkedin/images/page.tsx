"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import FeedbackButtons from "@/app/components/FeedbackButtons"

// ─── Types ───────────────────────────────────────────────────────────────────

interface CustomisationOption {
  id: string
  label: string
  type: "chips" | "toggle"
  options?: { value: string; label: string }[]
  default: string | boolean
  promptInstruction: (value: string | boolean) => string
}

export interface ImageStyle {
  id: string
  label: string
  description: string
  demoImage: string | null
  prompt: string
  customisations: CustomisationOption[]
}

// ─── Image Style Templates ────────────────────────────────────────────────────

export const IMAGE_STYLES: ImageStyle[] = [
  {
    id: "whiteboard",
    label: "Whiteboard",
    description: "Photorealistic professor's whiteboard — perfect for frameworks, data, and education posts",
    demoImage: null,
    customisations: [
      {
        id: "sections",
        label: "Sections",
        type: "chips",
        options: [
          { value: "3", label: "3 sections" },
          { value: "4", label: "4 sections" },
          { value: "5", label: "5 sections" },
          { value: "6", label: "6 sections" },
        ],
        default: "4",
        promptInstruction: (v) => `Organise the board into exactly ${v} logical sections.`,
      },
      {
        id: "emphasis",
        label: "Colour emphasis",
        type: "chips",
        options: [
          { value: "standard", label: "Standard" },
          { value: "blue-heavy", label: "More blue" },
          { value: "red-heavy", label: "More red" },
        ],
        default: "standard",
        promptInstruction: (v) =>
          v === "standard"
            ? ""
            : v === "blue-heavy"
            ? "Use blue marker more liberally — examples, alternatives, and side notes should all be in blue."
            : "Use red marker more liberally — underline key takeaways and circle critical terms in red.",
      },
      {
        id: "diagrams",
        label: "Hand-drawn diagrams",
        type: "toggle",
        default: true,
        promptInstruction: (v) =>
          v ? "" : "Do not include any diagrams, charts, or sketches — text and arrows only.",
      },
    ],
    prompt: `Role and objective

You generate a single photorealistic smartphone photograph of a real university professor's whiteboard in a classroom. The whiteboard content must encode the user's provided material (text, image, or text + image) as natural handwritten notes with diagrams and equations. The final image must look like it was captured on an iPhone 16 Pro, not a digital canvas, not a clean render.

Input modes

The user may provide:

1) Text only
   - Treat the text as the lecture content to be written on the board.

2) Image only
   - Treat the image as the source content to be transcribed onto the board.

3) Text + image
   - Combine both sources into one coherent board.

Precedence and conflicts

- Follow this precedence: explicit user instructions > text input > image input.
- If text and image conflict and the user did not clarify, follow precedence and do not merge conflicting details.
- If parts of an image are unreadable, do not guess exact wording or numbers. Represent as abbreviated fragments, light scribbles, or partially erased marks.

Content fidelity and non-invention

- Do not add new facts, names, dates, citations, numbers, or definitions not present in the inputs.
- Do not expand the content with extra explanations. Only reorganize for clarity in a typical lecture-note style.
- You may add minimal connective labels that do not change meaning (example: "thus", "note", "case 2") and sparse professor-style scrutiny marks (example: "units?", "assumption?", "citation?") when appropriate.

Internal workflow for consistency (two-pass)

Pass 1, Draft layout

- Parse the input into 3 to 6 logical blocks (each block is a heading plus its immediate bullets or derivation steps).
- Arrange blocks in a clear reading order (often 2 to 3 columns), leaving negative space.
- Decide where diagrams, equations, and summary callouts belong.
- Assign color roles using the strict color hierarchy rules below.

Pass 2, Critic and simplifier

- Remove visual bloat: excessive boxes, decorative arrows, deep bullet nesting, unnecessary repeated phrasing.
- Enforce legibility: realism artifacts must not overpower the current lecture content.
- Ensure the board looks academically plausible: a professor's hand, purposeful structure, restrained color use.
- Confirm all constraints: photo realism, no typed fonts, no UI elements, no watermarks, no private information.

Scene and composition

- Setting: real classroom implied; the frame is mostly the whiteboard.
- Camera viewpoint: handheld phone photo from standing height, slight natural angle, mild perspective distortion.
- Framing: 80 to 95 percent of the frame is the whiteboard; include a thin board frame or adjacent wall edge if it helps realism.
- Lighting: natural classroom light plus soft overhead. Mild glossy reflections on the board surface, controlled so writing stays readable.
- Add a subtle coffee mug shadow in one corner, soft edged and physically plausible.

Whiteboard surface realism

- Surface: glossy whiteboard with faint streaks, finger smudges, marker residue, and uneven wipe patterns.
- Eraser marks: visible wipe arcs and patchy cleaning across sections; some regions partially erased.
- Dust: subtle dusty residue and speckling in wiped zones or near the tray line, realistic and not excessive.
- Tray hint: optional faint residue band at the lower edge.

Board history and layering (lived-in realism)

- Include faint, generic remnants of previous lectures in erased areas: stray lines, partial arrows, indistinct symbols, very light mathematical fragments.
- Remnants must be non-semantic and non-identifying. No readable names, no contact info, no recognizable quotes.
- Layering rule: current writing is darker and sharper; older remnants are lighter, thinner, interrupted by wipe streaks.
- Place remnants mainly in margins and lower sections. Keep them subtle so they never compete with current content.

Handwriting and academic note style

- Handwriting: real professor style, slight inconsistency in letter size, occasional hurried strokes, natural spacing.
- Layout: structured but organic. Use headings, bullet points, numbered steps, and margin annotations.
- Include when relevant: hand-drawn diagrams, arrows, connectors, boxed definitions, flow charts, concept maps.
- Include when relevant: equations with realistic notation (fractions, subscripts, symbols).
- Include a few realistic corrections: small cross-outs, overwritten terms, brief side notes.
- Legibility: mostly readable but not perfectly uniform. Avoid uncanny perfection.

Color usage and visual hierarchy (strict academic convention)

Color usage must follow academic convention and be consistent:

- Black: main body text, primary definitions, primary equations.
- Blue: examples, secondary derivations, alternative paths, side calculations, optional notes.
- Red: emphasis only, corrections, warnings, key takeaways. Use sparingly to avoid visual noise.
- Green: structural elements (boxes, arrows, grouping braces, section separators) and positive relationships.

Rules to prevent arbitrary color mixing

- A logical block is a heading plus its immediate bullets or derivation steps.
- Within a single logical block, avoid arbitrary mixing. Keep it primarily black plus at most one helper color (blue or green).
- Do not alternate colors line-by-line for decoration.
- Red is never used for long paragraphs. Red is limited to short phrases, circles, underlines, or a single concise takeaway line.
- Green supports structure and relationships; it does not replace main prose.
- Black remains dominant overall; other colors are accents with clear purpose.

Diagram and annotation rules

- Arrows: straight, curved, double-headed, dashed, used only to clarify relationships.
- Grouping: boxes, brackets, underlines, circled terms used consistently.
- Quick sketches: small graphs, axes, block diagrams only if implied by the input.
- Line quality: hand drawn, slightly imperfect, natural wobble, occasional uneven thickness.

iPhone 16 Pro photo characteristics

- Photoreal smartphone capture look: subtle HDR, natural color balance, accurate whites, very light sharpening.
- Lens: mild wide-angle feel, slight barrel distortion acceptable but not extreme.
- Exposure: well exposed, slight highlight sheen, no blown-out whites.
- Noise: very subtle phone sensor noise in midtones and shadows.
- Focus: mostly sharp across the board with slight softness at extreme edges if the angle is steep.
- Avoid: studio lighting, overly clean surfaces, artificial bokeh blobs.

Hard constraints

- Must be a photograph of a whiteboard, not a flat graphic, not a screenshot, not a digital UI.
- No printed fonts, no computer-typed text, no perfect vector lines.
- Do not add unrelated content beyond the inputs, except subtle generic erased remnants and minimal connective labels that do not change meaning.
- No watermarks, logos, captions, borders, mockups.

Output requirement

Generate one photorealistic iPhone-style classroom photo of a professor's whiteboard that encodes the user's provided content (from text, image, or both) using all rules above.`,
  },
  {
    id: "dark_stat_card",
    label: "Dark Stat Card",
    description: "Bold typographic card — makes a single number or statement hit hard",
    demoImage: "/social-engine/stat-card.png",
    customisations: [
      {
        id: "accent",
        label: "Teal accent on",
        type: "chips",
        options: [
          { value: "number", label: "The number" },
          { value: "rule", label: "Thin rule" },
          { value: "chip", label: "Label chip" },
        ],
        default: "number",
        promptInstruction: (v) =>
          v === "number"
            ? "Apply the teal accent (#2dd4bf) to the hero number or stat itself."
            : v === "rule"
            ? "Apply the teal accent as a thin horizontal rule (1–2px) between the hero element and the supporting text."
            : "Apply the teal accent as a small label chip above the hero element.",
      },
      {
        id: "alignment",
        label: "Alignment",
        type: "chips",
        options: [
          { value: "centred", label: "Centred" },
          { value: "left", label: "Left-aligned" },
        ],
        default: "centred",
        promptInstruction: (v) =>
          `Text alignment: ${v}. ${v === "left" ? "Leave generous right margin." : ""}`,
      },
    ],
    prompt: `Role and objective

Generate a single high-resolution 1:1 square image of a premium dark typographic card for LinkedIn. The card features the user's key statistic, short statement, or insight as the dominant visual element. The aesthetic is confident, minimal, and authoritative — like a card a Forbes-listed founder would post.

Design rules

Background: near-black (#0a0a0a to #111111). No gradients, no photos, no textures heavier than a very faint grain.

Typography hierarchy:
- Primary element (the stat or main phrase): massive, bold, white — occupies 40–60% of the card's visual weight.
- Supporting text (context or subheading): small (roughly 14–18px equivalent), medium grey (#888888 to #aaaaaa), positioned below the primary element.
- Optional thin horizontal rule in teal (#2dd4bf) between primary and supporting text.

Font style: clean geometric sans-serif. No display fonts, no scripts, no decorative typefaces.

Layout: centred or left-aligned — choose based on which creates better tension. Leave generous whitespace. Nothing competes with the hero element.

Accent: one single teal (#2dd4bf) accent only — either in the primary number itself, a thin rule, or a small label chip. Never more than one teal element.

Hard constraints

- 1:1 square aspect ratio
- No photos, no illustrations, no icons, no gradients
- No logos, watermarks, or frames
- No more than 3 text elements total
- Background must be dark (#0a0a0a to #1a1a1a)

Output requirement

Generate one dark typographic card image based on the user's provided content, following all rules above. Extract the single most powerful number, phrase, or insight from the content and make it the hero.`,
  },
  {
    id: "napkin_sketch",
    label: "Napkin Sketch",
    description: "Photorealistic café napkin brainstorm — raw, human, and highly shareable",
    demoImage: "/social-engine/napkin.png",
    customisations: [
      {
        id: "layout",
        label: "Layout style",
        type: "chips",
        options: [
          { value: "scatter", label: "Scatter" },
          { value: "quadrants", label: "Quadrants" },
          { value: "numbered", label: "Numbered list" },
          { value: "funnel", label: "Funnel" },
        ],
        default: "scatter",
        promptInstruction: (v) =>
          v === "scatter"
            ? "Layout: free-form scatter — ideas placed organically around the napkin."
            : v === "quadrants"
            ? "Layout: divide the napkin into 4 rough quadrants, one concept per quadrant."
            : v === "numbered"
            ? "Layout: numbered list format — items stacked vertically with circled numbers."
            : "Layout: rough funnel diagram — wide at top narrowing to a point at the bottom.",
      },
      {
        id: "surface",
        label: "Surface",
        type: "chips",
        options: [
          { value: "desk", label: "Wood desk" },
          { value: "wall", label: "White wall" },
        ],
        default: "desk",
        promptInstruction: (v) =>
          v === "desk"
            ? "Surface: warm wooden café table with natural grain."
            : "Surface: plain off-white wall background.",
      },
    ],
    prompt: `Role and objective

Generate a single photorealistic overhead photograph of a white paper napkin on a wooden café table. The napkin contains handwritten notes, rough diagrams, and sketches that encode the user's content as a casual brainstorm. The image must look like a real smartphone photo taken in a coffee shop — not a digital illustration, not a flat graphic.

Scene and props

- Surface: warm-toned wooden table, slightly worn grain, natural café lighting from above.
- Napkin: slightly crumpled, one or two soft fold lines, minor creases. White or off-white paper.
- Pen marks: blue or black ballpoint pen. Slight ink variation — heavier where the pen paused, lighter on fast strokes.
- Coffee ring stain: one faint ring stain in a corner or edge of the napkin — physically plausible placement, semi-transparent.
- Optional: edge of a coffee cup or small espresso cup just inside the frame, slightly out of focus.

Napkin content (from user input)

- Encode the user's content as a rough brainstorm sketch: key phrases, arrows, simple boxes, numbered steps, rough flow diagrams.
- Handwriting style: casual, fast, slightly uneven — like a real person thinking on paper.
- Mix of small headings, bullet fragments, quick circled terms, connecting arrows.
- Avoid full sentences. Use fragments, abbreviations, and shorthand.
- Include 1–2 small rough diagrams or charts if the content implies them (e.g., a simple funnel, a 2x2 matrix, a rough bar chart).
- Keep the napkin 60–70% full — leave some white space as natural negative space.

Photography characteristics

- Shot from directly above (overhead flat lay), slight angle acceptable.
- Natural warm light, soft shadows around napkin edges.
- Very subtle phone sensor noise.
- Napkin is sharp; table slightly less so at edges.

Hard constraints

- Must look like a real photo, not a digital drawing or illustration.
- No printed fonts, no perfect digital lines, no UI elements.
- No watermarks, logos, or borders.
- Content on the napkin must only encode what the user provided — no invented facts or names.

Output requirement

Generate one photorealistic overhead café photo of a napkin brainstorm based on the user's provided content, following all rules above.`,
  },
  {
    id: "blueprint",
    label: "Blueprint",
    description: "Technical system architecture diagram — great for process and framework posts",
    demoImage: "/social-engine/blueprint.png",
    customisations: [
      {
        id: "diagram_type",
        label: "Diagram type",
        type: "chips",
        options: [
          { value: "process_flow", label: "Process flow" },
          { value: "architecture", label: "Architecture map" },
          { value: "layered_stack", label: "Layered stack" },
          { value: "matrix", label: "2D matrix" },
        ],
        default: "process_flow",
        promptInstruction: (v) => {
          const map: Record<string, string> = {
            process_flow: "Use a horizontal or vertical process flow diagram with directional arrows between steps.",
            architecture: "Use a system architecture map with nodes, connections, and annotated callouts.",
            layered_stack: "Use a layered stack diagram showing hierarchy from top to bottom, connected by arrows.",
            matrix: "Use a 2D grid matrix layout with labelled rows and columns.",
          }
          return map[v as string] || ""
        },
      },
    ],
    prompt: `Role and objective

Generate a single high-resolution image of a technical blueprint diagram. The content must encode the user's provided material as a professional system architecture, process flow, or structural diagram rendered in classic engineering blueprint style. This is for LinkedIn — it must look impressive, credible, and premium.

Visual style

- Background: deep navy or midnight blue (#0a1628 to #0d1f3c).
- Primary linework: bright cyan/white (#c8e6ff to #ffffff), weight varies by hierarchy.
- Secondary labels and annotations: slightly dimmer cyan (#7eb8d4).
- Grid: very faint rectangular grid overlay in #1a3050 — subtle, does not dominate.
- Accent highlight: single lines or key node labels in bright teal (#2dd4bf) to indicate the most important element.
- Font: monospace or technical sans-serif, all caps for headers, mixed case for labels. No cursive or display fonts.

Diagram structure (from user content)

- Parse the user's content into nodes, steps, or system components.
- Represent as one of: process flow, system architecture map, layered stack diagram, or 2D grid matrix — choose the format that best fits the content.
- Use boxes with rounded corners for components, directional arrows for flow, dashed lines for optional paths.
- Include brief technical labels inside or beside each node — concise, not full sentences.
- Add small annotation callouts for key properties (e.g., "INPUT", "OUTPUT", "TRIGGERS", "RESULT").
- If the content implies hierarchy, show it with vertical levels connected by arrows.

Composition

- Centred layout with equal margins on all sides.
- Clean, structured — nothing cramped.
- 2–4 columns or layers depending on content complexity.
- Title block at top: short title + thin ruled separator line.

Hard constraints

- Must look like a technical blueprint, not a presentation slide or infographic.
- No photos, no gradients heavier than a subtle vignette at edges.
- No logos, watermarks.
- No invented technical details beyond what the user provided.

Output requirement

Generate one professional engineering blueprint diagram based on the user's provided content.`,
  },
  {
    id: "terminal",
    label: "Terminal Output",
    description: "Dark code terminal — technical credibility, loved by tech and founder audiences",
    demoImage: "/social-engine/terminal.png",
    customisations: [
      {
        id: "format",
        label: "Terminal format",
        type: "chips",
        options: [
          { value: "script", label: "Annotated script" },
          { value: "cli", label: "CLI output" },
          { value: "docblock", label: "Docblock comment" },
        ],
        default: "script",
        promptInstruction: (v) => {
          const map: Record<string, string> = {
            script: "Use Option A — Annotated bash script format with variable assignments and echo statements.",
            cli: "Use Option B — CLI scan output format with $ prompt, > output lines, and ✓ conclusion.",
            docblock: "Use Option C — Docblock comment format with /** */ style and labelled fields.",
          }
          return map[v as string] || ""
        },
      },
    ],
    prompt: `Role and objective

Generate a single high-resolution image of a dark terminal or code editor window. The user's content is formatted inside the terminal as commented code, CLI output, or a short annotated script. The image must look like a real macOS Terminal or VS Code screenshot — not a drawn illustration.

Terminal window design

- Window chrome: macOS-style title bar with three traffic light dots (red, yellow, green) top-left. Title bar slightly lighter than the main background. Optional title text: "insight.sh" or similar neutral filename.
- Background: very dark (#0d0d0d to #1a1a1a) — almost black.
- Font: monospace (Fira Code, JetBrains Mono, or similar), 13–14px equivalent, normal weight.

Content formatting rules (from user input)

Format the user's content as one of the following — choose based on what fits best:

Option A — Annotated script:
  #!/bin/bash
  # ─────────────────────────────────────
  # [TITLE FROM CONTENT]
  # ─────────────────────────────────────
  # [Key insight 1 as comment]
  RESULT_1="[stat or phrase]"
  # [Key insight 2 as comment]
  RESULT_2="[stat or phrase]"
  echo "Output: $RESULT_1"
  echo "Conclusion: $RESULT_2"

Option B — CLI output:
  $ run --analysis
  > Scanning...
  > [Key point 1]
  > [Key point 2]
  > [Key point 3]
  ✓ Done. Result: [core insight]

Option C — Comments block:
  /**
   * [Title]
   * ─────────────────────
   * Problem:  [from content]
   * Root:     [from content]
   * Fix:      [from content]
   * Result:   [key outcome]
   */

Syntax highlighting colours

- Comments (#//): medium grey (#6a9955 or #608b4e)
- Strings ("..."): warm yellow (#ce9178)
- Keywords: soft blue (#569cd6)
- Variable names: light yellow-white (#dcdcaa)
- Output/echo text: white (#d4d4d4)
- Operators/symbols: light grey (#d4d4d4)
- Prompt symbol ($, >): bright teal (#2dd4bf)

Hard constraints

- Must look like a real terminal screenshot, not a flat graphic or illustration.
- No photos, no decorative elements beyond terminal UI chrome.
- No invented data, names, or technical claims beyond what the user provided.
- No watermarks, logos, or external borders.

Output requirement

Generate one photorealistic terminal/code editor window image based on the user's provided content, using the formatting rules and colour scheme above.`,
  },
  {
    id: "sticky_board",
    label: "Sticky Note Board",
    description: "Colourful sticky notes on a desk or wall — high energy, easy to scan",
    demoImage: "/social-engine/sticky-notes.png",
    customisations: [
      {
        id: "note_count",
        label: "Number of notes",
        type: "chips",
        options: [
          { value: "4", label: "4 notes" },
          { value: "5", label: "5 notes" },
          { value: "6", label: "6 notes" },
          { value: "7", label: "7 notes" },
          { value: "8", label: "8 notes" },
        ],
        default: "6",
        promptInstruction: (v) => `Use exactly ${v} sticky notes.`,
      },
      {
        id: "surface",
        label: "Surface",
        type: "chips",
        options: [
          { value: "desk", label: "Wood desk" },
          { value: "wall", label: "White wall" },
        ],
        default: "desk",
        promptInstruction: (v) =>
          v === "desk"
            ? "Surface: light natural wood desk with warm grain."
            : "Surface: plain off-white wall.",
      },
    ],
    prompt: `Role and objective

Generate a single high-resolution overhead photograph of multiple colourful sticky notes arranged on a light wooden desk surface or clean white wall. Each sticky note contains one key point from the user's content, handwritten in black marker. The image must look like a real smartphone photo — not a digital illustration.

Surface and scene

- Surface: either (a) light natural wood desk grain, warm tone, or (b) plain white/off-white wall.
- Lighting: bright, even, natural daylight or soft overhead light. No harsh shadows.
- Camera angle: slightly angled overhead (about 70–80 degrees from horizontal) to show the notes clearly while retaining a sense of depth.

Sticky note design

- Colours: use 3–5 distinct pastel sticky note colours — e.g., yellow, pink/coral, blue, green, purple. One colour per distinct idea cluster.
- Size: standard square sticky note (roughly 3×3 inches represented in frame).
- Arrangement: loose informal grid — some overlapping slightly, some at slight angles (±5–15 degrees). Not perfectly aligned, not chaotic.
- Handwriting: black marker, bold enough to be readable, slightly imperfect. One key phrase or short sentence per note — fragments, not full paragraphs.

Content encoding (from user input)

- Break the user's content into 4–8 distinct key points, one per sticky note.
- Write each as a short, punchy phrase (max 8 words per note).
- Group related notes by colour.
- Optional: one note in red/dark pink as a "headline" or "summary" note, slightly larger or centred.
- Optional: small simple arrow drawn between related notes.

Physical realism

- Slight curl on some note corners.
- Subtle adhesive edge slightly raised on one side per note.
- Very faint shadow from each note on the surface.
- Minor variation in pen pressure across notes.

Hard constraints

- Must look like a real photograph, not a flat digital graphic or illustration.
- No printed fonts, no perfect vector elements.
- No logos, watermarks, or captions.
- No invented content beyond what the user provided.

Output requirement

Generate one photorealistic overhead photo of sticky notes on a surface, encoding the user's content as described.`,
  },
  {
    id: "newspaper",
    label: "Newspaper Front Page",
    description: "Broadsheet front page — great for strong takes and contrarian angles",
    demoImage: "/social-engine/newspaper.png",
    customisations: [
      {
        id: "columns",
        label: "Columns",
        type: "chips",
        options: [
          { value: "2", label: "2 columns" },
          { value: "3", label: "3 columns" },
        ],
        default: "3",
        promptInstruction: (v) => `Use ${v} body columns below the headline.`,
      },
      {
        id: "secondary_story",
        label: "Secondary story at bottom",
        type: "toggle",
        default: true,
        promptInstruction: (v) =>
          v
            ? "Include a secondary story at the bottom of the page with a smaller headline and 1–2 lines of supporting text."
            : "No secondary story — use the full page for the main story only.",
      },
    ],
    prompt: `Role and objective

Generate a single high-resolution image styled as the front page of a classic broadsheet newspaper. The user's insight or main point is the headline story. The design must feel authentic — like a real newspaper from the 1970s–1990s — not a modern digital mockup.

Layout and typography

Masthead (top of page):
- Newspaper name: use a neutral fictional name like "THE SYSTEMS REPORT" or "THE OPERATOR'S DIGEST" in large bold serif type.
- Date line below masthead: fictional but plausible date + issue number + price (e.g., "Est. 2024  ·  No. 47  ·  £1.50").
- Thin ruled horizontal line separating masthead from content below.

Main headline:
- Extract the single most powerful sentence or claim from the user's content.
- Set in very large, bold serif type (similar to Times New Roman or Century Schoolbook).
- Spans full column width or 2/3 width if a secondary column exists.

Subheadline / deck:
- A supporting sentence (1–2 lines) in smaller bold serif.
- Directly below the main headline.

Body columns:
- 2–3 narrow columns of text below the headline area.
- Column 1: a short "article" opening paragraph (3–5 sentences) that expands on the headline using the user's content.
- Columns 2–3: can include placeholder-style supporting text (can be slightly blurred or indistinct for realism), or additional key points from the user's content as shorter paragraphs.
- Column rules (thin vertical lines) between columns.

Optional secondary story:
- Bottom of page: a smaller secondary headline with 1–2 lines of supporting text, related to a secondary point from the user's content.

Paper and print realism

- Colour: off-white newsprint (#f5f0e8 to #ede8d8) — slightly aged, not bright white.
- Ink: deep black, slight halftone grain on dense text areas.
- Very subtle paper texture: minor random grain, no heavy crumple.
- Print registration: very slight, occasional faint registration misalignment on a character or line — subtle, not distracting.
- Ink bleed: minimal ink spread on denser text blocks.

Hard constraints

- Must look like a real printed newspaper page, not a digital design mockup or web template.
- No digital UI elements, no modern sans-serif fonts throughout — serif only for body and headline.
- No photos unless the content explicitly describes a scene (in which case, use a rough halftone-style grayscale photo treatment).
- No logos, watermarks.
- No invented facts, figures, or names beyond what the user provided.

Output requirement

Generate one photorealistic newspaper front page image based on the user's provided content.`,
  },
  {
    id: "cinematic",
    label: "Cinematic Title Card",
    description: "Dark, dramatic typography — maximum impact for bold takes and provocative statements",
    demoImage: null,
    customisations: [
      {
        id: "atmosphere",
        label: "Atmosphere",
        type: "chips",
        options: [
          { value: "cold", label: "Cold / analytical" },
          { value: "warm", label: "Warm / bold" },
          { value: "neutral", label: "Clean / neutral" },
        ],
        default: "cold",
        promptInstruction: (v) => {
          const map: Record<string, string> = {
            cold: "Use Option A atmospheric treatment: very faint cool blue-grey fog at the upper corners only.",
            warm: "Use Option B atmospheric treatment: faint amber/dark orange ember glow from one lower corner.",
            neutral: "Use Option C atmospheric treatment: pure near-black with very subtle film grain only, no colour cast.",
          }
          return map[v as string] || ""
        },
      },
      {
        id: "font",
        label: "Font style",
        type: "chips",
        options: [
          { value: "sans", label: "Sans-serif (punchy)" },
          { value: "serif", label: "Serif (gravity)" },
        ],
        default: "sans",
        promptInstruction: (v) =>
          v === "sans"
            ? "Font: heavy geometric sans-serif (Neue Haas Grotesk Heavy or equivalent)."
            : "Font: elegant serif (Freight Display, Playfair Display, or equivalent).",
      },
      {
        id: "alignment",
        label: "Alignment",
        type: "chips",
        options: [
          { value: "centred", label: "Centred" },
          { value: "left", label: "Left-aligned" },
        ],
        default: "left",
        promptInstruction: (v) => `Text alignment: ${v}.`,
      },
    ],
    prompt: `Role and objective

Generate a single high-resolution cinematic image. The user's most powerful sentence or phrase is displayed as a dramatic typographic statement against a dark, atmospheric background. The aesthetic is film title card — bold, minimal, high contrast. No people, no stock photo scenes.

Visual style

Background: very deep black (#000000 to #0a0a0a) with one of the following subtle atmospheric treatments — choose based on content mood:
- Option A (cold/analytical): very faint cool blue-grey fog or gradient vignette at the edges, barely visible.
- Option B (warm/bold): faint amber or dark orange ember glow in one corner, as if from a distant fire source.
- Option C (clean/neutral): pure near-black with very subtle film grain only — no colour cast.

Typography:
- Primary text: the user's key statement. Large, centred, white. Weight: bold or heavy. Font: clean modern serif (like Freight Display or similar) OR strong geometric sans (like Neue Haas Grotesk Heavy). Choose based on tone — serif for gravitas, sans for punchy authority.
- Optional secondary text: a single supporting line above or below the primary statement, in much smaller, lighter, tracked-out caps (letter-spacing: wide). Colour: medium grey or faint teal (#2dd4bf at 60% opacity).
- No more than 2 text elements total.

Layout:
- Rule of thirds: primary text positioned slightly above or below centre — not perfectly centred vertically.
- Left-aligned or centred — choose based on which creates more tension.
- Wide margins, generous breathing room.
- Aspect ratio: 16:9 widescreen for maximum cinematic feel.

Film characteristics:
- Very subtle film grain texture over the entire image — natural, not excessive.
- Very slight vignette darkening at corners.
- No lens flare, no bokeh, no artificial lighting effects beyond the atmospheric treatment above.

Hard constraints

- No photos of people, places, or objects.
- No logos, watermarks, borders, or frames.
- No more than 2 text elements.
- Background must remain dark — the text must be the brightest element.
- No colour except the single atmospheric accent and optional teal secondary text.

Output requirement

Generate one cinematic dark typographic title card based on the user's most powerful line or insight from their provided content.`,
  },
  {
    id: "split_screen",
    label: "Before / After",
    description: "Split-screen contrast — shows transformation clearly, great for case study posts",
    demoImage: "/social-engine/before-after.png",
    customisations: [
      {
        id: "timestamps",
        label: "Show timestamps",
        type: "toggle",
        default: false,
        promptInstruction: (v) =>
          v
            ? 'Add very small timestamp labels below the panel labels: "Month 0" under BEFORE and "Month 3" under AFTER, in the same small tracked-out style.'
            : "",
      },
      {
        id: "divider",
        label: "Divider colour",
        type: "chips",
        options: [
          { value: "teal", label: "Teal" },
          { value: "white", label: "White" },
        ],
        default: "teal",
        promptInstruction: (v) => `Divider line colour: ${v === "teal" ? "#2dd4bf" : "#ffffff"}.`,
      },
    ],
    prompt: `Role and objective

Generate a single high-resolution 1:1 square image split into two vertical panels, showing a clear before/after contrast based on the user's content. The left panel represents the "before" state (problem, chaos, old way). The right panel represents the "after" state (result, clarity, new way). The image must be clean, modern, and immediately readable.

Panel design

Divider: a single thin vertical line (2–3px) in the centre. Colour: white or teal (#2dd4bf). Optional: a very subtle glow on the divider line.

Left panel (BEFORE):
- Background: dark grey (#1a1a1a to #222222) or desaturated dark navy.
- Atmosphere: slightly dimmer, cooler, slightly compressed.
- Label: "BEFORE" in small, tracked-out caps at the top, left-aligned. Colour: medium grey (#888888).
- Content: 3–5 short lines or fragments representing the "before" state from the user's content. Style: scattered, slightly disordered layout — items not perfectly aligned, some overlapping slightly, some crossed out. Colour: grey or off-white (#bbbbbb).
- Optional: a red or orange accent on the most painful "before" element (e.g., a subtle underline or faint highlight).

Right panel (AFTER):
- Background: slightly lighter dark (#111111 to #181818), with very faint warm glow at centre.
- Atmosphere: brighter, cleaner, more open.
- Label: "AFTER" in small tracked-out caps at top, left-aligned. Colour: teal (#2dd4bf).
- Content: 3–5 short lines or fragments representing the "after" state from the user's content. Style: clean, ordered, evenly spaced. Colour: white (#f0f0f0 to #ffffff).
- Optional: a teal checkmark (✓) or small teal bullet beside each "after" item.

Typography

- Font: clean geometric sans-serif. Bold for panel labels, regular for content items.
- Font size: consistent across both panels for the content items.
- No decorative fonts.

Hard constraints

- 1:1 square aspect ratio.
- No photos of people or scenes.
- No logos, watermarks.
- Content in both panels must come only from the user's provided material — do not invent examples.
- The before/after split must be semantically meaningful, not superficial.

Output requirement

Generate one clean before/after split-screen card based on the user's provided content. Extract the clearest before/after contrast from their material.`,
  },
  {
    id: "quote_card",
    label: "Premium Quote Card",
    description: "Luxury dark quote card — for your sharpest one-liners and contrarian takes",
    demoImage: "/social-engine/Quote-Card.png",
    customisations: [
      {
        id: "texture",
        label: "Background texture",
        type: "chips",
        options: [
          { value: "linen", label: "Linen grain" },
          { value: "matte", label: "Matte paper" },
          { value: "pure", label: "Pure black" },
        ],
        default: "matte",
        promptInstruction: (v) => {
          const map: Record<string, string> = {
            linen: "Use Option A background texture: very faint diagonal linen or fine woven fabric grain.",
            matte: "Use Option B background texture: subtle uniform noise grain like premium matte paper.",
            pure: "Use Option C background: pure near-black with barely perceptible radial vignette, no grain.",
          }
          return map[v as string] || ""
        },
      },
      {
        id: "font",
        label: "Font style",
        type: "chips",
        options: [
          { value: "serif", label: "Serif (elegant)" },
          { value: "sans", label: "Sans (bold)" },
        ],
        default: "serif",
        promptInstruction: (v) =>
          v === "serif"
            ? "Font: elegant serif (Freight Display, Garamond, or equivalent)."
            : "Font: heavy geometric sans-serif (Neue Haas Grotesk Heavy, Helvetica Neue Black, or equivalent).",
      },
    ],
    prompt: `Role and objective

Generate a single high-resolution 1:1 square image of a premium luxury quote card. The user's most powerful sentence is the centrepiece, displayed in elegant, confident typography on a dark, textured background. The feel is Monocle magazine meets Apple event slide — restrained, authoritative, premium.

Background

Base: very dark (#0d0d0d to #151515).
Texture: choose one of:
- Option A: very faint, almost invisible diagonal linen or fabric grain texture.
- Option B: subtle noise grain, like premium matte paper.
- Option C: pure near-black with a barely perceptible radial vignette from centre.

Border: a thin single-line rectangle border, inset from the card edges by about 4–5% of the card width. Colour: white at 12–18% opacity — barely visible, just hints at a frame.

Typography

Large quotation mark:
- A single oversized opening quotation mark ("or ❝) in the upper-left inside area of the card.
- Colour: teal (#2dd4bf) at 30–40% opacity — present but not dominant.
- Size: 3–4x the size of the body text.

Quote text:
- The user's most powerful sentence — the single sharpest line from their content.
- Large, centred or slightly left-of-centre.
- Colour: white (#f5f5f5).
- Font: elegant serif (like Freight Display, Garamond, or similar) OR strong modern sans at a heavy weight — choose based on tone.
- Max 2 lines. If the quote is longer, edit it to the most powerful fragment.

Attribution line:
- Below the quote, after a thin horizontal rule in teal (#2dd4bf) at 25% opacity.
- Optional: a very short context label (e.g., "On building systems" or "On scaling service businesses") in small, tracked-out grey caps (#666666).
- No personal names, no brand names, no URLs.

Hard constraints

- 1:1 square aspect ratio.
- No photos, no illustrations, no icons except the large decorative quotation mark.
- No logos, watermarks.
- Maximum 3 text elements: the large quote mark, the quote text, and one optional attribution/context label.
- Background must remain dark throughout.
- Teal accent used only for the quote mark opacity and the thin rule — never for body text.

Output requirement

Generate one premium dark quote card image using the single most powerful sentence from the user's provided content.`,
  },
  {
    id: "a1_paper",
    label: "A1 Paper",
    description: "Large sheet held to the floor by hands — mind maps, cheat sheets, step-by-steps",
    demoImage: "/social-engine/A1-Paper.png",
    customisations: [
      {
        id: "layout_format",
        label: "Layout format",
        type: "chips",
        options: [
          { value: "mind_map", label: "Mind map" },
          { value: "cheat_sheet", label: "Cheat sheet" },
          { value: "step_by_step", label: "Step-by-step" },
          { value: "hybrid", label: "Hybrid" },
        ],
        default: "mind_map",
        promptInstruction: (v) => {
          const map: Record<string, string> = {
            mind_map: "Use a mind map layout: central node with radiating branches and sub-branches.",
            cheat_sheet: "Use a cheat sheet layout: dense column grid with labelled sections.",
            step_by_step: "Use a step-by-step layout: numbered vertical or horizontal flow with annotations.",
            hybrid: "Use a hybrid layout combining elements of mind map, cheat sheet, and step-by-step as the content requires.",
          }
          return map[v as string] || ""
        },
      },
      {
        id: "surface",
        label: "Floor surface",
        type: "chips",
        options: [
          { value: "wood", label: "Wood floor" },
          { value: "concrete", label: "Concrete floor" },
        ],
        default: "wood",
        promptInstruction: (v) =>
          v === "wood"
            ? "Surface: warm-toned light wood floor, wide planks, natural grain."
            : "Surface: clean concrete floor, light grey, fine texture.",
      },
    ],
    prompt: `Role and objective

You generate a single photorealistic overhead photograph of a large A1 sheet of white paper laid flat on a wooden floor or concrete surface. One or two pairs of human hands are visible at the edges of the paper, holding it flat or anchoring its corners — as if someone just unrolled it and is keeping it in place while they study it. The paper is covered in handwritten content: a mind map, cheat sheet, step-by-step framework, or structured reference document. The final image must look like a real smartphone photograph taken from standing height looking straight down — not a digital illustration, not a flat graphic, not a rendered scene.

Input modes

The user may provide:

1) Text only
   - Treat the text as the full content to be laid out on the paper. Choose the most appropriate format (mind map, cheat sheet, numbered steps, or structured reference) based on the content's logic.

2) Image only
   - Read the image for its structure and key information. Translate onto the A1 paper in the most appropriate format.

3) Text + image
   - Combine both sources into one coherent paper layout.

Content fidelity and non-invention

- All content written on the paper must come directly from the user's input.
- You may reorganise, condense, and abbreviate into note-style language — but do not change meaning or add interpretive content.

Scene and composition

- Surface: either warm-toned light wood floor (wide planks, natural grain, slightly worn) or clean concrete floor (light grey, fine texture).
- Camera angle: directly overhead, 90 degrees from horizontal. The A1 paper fills 70–85% of the frame.
- Lighting: bright, natural — large window light from one side. Gentle shadow from hands and slight paper curl only.

Paper surface and physical realism

- Paper: bright white A1 sheet, slight warp from having been rolled or folded.
- Curl: corners not held by hands curl slightly upward.
- Crease lines: one or two faint fold lines where it was folded for carrying.

Hand placement and realism

- Hands: one or two pairs anchoring corners or edges. Relaxed, fingers slightly spread, pressing the paper flat.
- Only hands and wrists visible — no arms above the wrist.
- One hand may hold a pen near the paper edge.

Handwriting and content style

- Primary pen: black fine-liner. Main headings, central nodes, primary steps.
- Secondary pen: blue ballpoint. Sub-points, branch labels, annotations.
- Accent: red fine-liner used sparingly for circled key terms or starred priorities.
- Handwriting: fast, confident, slightly inconsistent. Mix of printed capitals for headings and natural lowercase for body.

Format-specific rules

Mind map: Central concept in a box/circle at centre. Primary branches radiate outward. Secondary branches from primary nodes — thinner lines, smaller text.

Cheat sheet: Content divided into clearly labelled sections with ruled separators. Dense 2–3 column layout.

Step-by-step: Steps numbered clearly with circled numbers. Each step has a short heading and 1–3 annotation lines. Connecting arrows between steps.

Photography characteristics

- Smartphone photo look: natural HDR, accurate white balance, very subtle sensor noise.
- No flash, no studio lighting. No artificial bokeh.

Hard constraints

- Must look like a real photograph, not an illustration or render.
- Hands must be present — at least one pair visible.
- Paper must look A1 scale — the hands establish this.
- No printed fonts — all content is handwritten.
- No logos, watermarks, or UI elements.

Output requirement

Generate one photorealistic overhead smartphone photograph of an A1 sheet of paper held flat by human hands on a floor surface, encoding the user's provided content as handwritten notes in the chosen layout format.`,
  },
]

// ─── Style-specific copy hints ────────────────────────────────────────────────

export const STYLE_COPY_HINTS: Record<string, string> = {
  whiteboard: "Works best with a framework or 3–6 clear sections. Trim the hook and CTA — keep the core content.",
  dark_stat_card: "Focus on one key stat or number. Ideal format: stat → supporting line → source (optional).",
  napkin_sketch: "Rough ideas or a simple process. Aim for 5–8 short fragments or phrases.",
  blueprint: "A process, system, or architecture. Steps, components, or layers work well.",
  terminal: "Technical steps, commands, or output. Keep to 5–10 lines.",
  sticky_board: "4–8 short sticky-note points. Each item under 8 words.",
  newspaper: "Headline + opening paragraph + supporting detail. Trim to the core story.",
  cinematic: "Extract your single most powerful sentence — one punchy line only.",
  split_screen: "List 3–5 'before' states and 3–5 'after' states. Each item under 8 words.",
  quote_card: "Extract your most quotable line. One sentence — make it memorable.",
  a1_paper: "Frameworks, mind maps, or step-by-step content. The full post content works well here.",
}

// ─── Inner component ──────────────────────────────────────────────────────────

type ImageStep = "setup" | "copy_review" | "result"

function LinkedInImagesInner() {
  const searchParams = useSearchParams()
  const [content, setContent] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<string>("whiteboard")
  const [customisationValues, setCustomisationValues] = useState<Record<string, Record<string, string | boolean>>>({})
  const [chatNotes, setChatNotes] = useState<string[]>([])
  const [chatInput, setChatInput] = useState("")
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [imageStep, setImageStep] = useState<ImageStep>("setup")
  const [imageCopy, setImageCopy] = useState("")
  const [backSource, setBackSource] = useState<string | null>(null)
  const [generatingAICopy, setGeneratingAICopy] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Pre-fill from URL params (linked from planner/write/saved)
  useEffect(() => {
    const paramContent = searchParams.get("content")
    if (paramContent) setContent(decodeURIComponent(paramContent))
    const paramStyle = searchParams.get("style")
    if (paramStyle && IMAGE_STYLES.find((s) => s.id === paramStyle)) setSelectedStyle(paramStyle)
    const paramBack = searchParams.get("back")
    if (paramBack) setBackSource(paramBack)
  }, [searchParams])

  const backUrl = backSource === "planner"
    ? "/dashboard/social-engine/linkedin/planner"
    : backSource === "write"
    ? "/dashboard/social-engine/linkedin/write"
    : backSource === "saved"
    ? "/dashboard/social-engine/linkedin/saved"
    : null

  // Initialise customisation defaults when style changes
  useEffect(() => {
    const style = IMAGE_STYLES.find((s) => s.id === selectedStyle)
    if (!style) return
    setCustomisationValues((prev) => {
      if (prev[selectedStyle]) return prev
      const defaults: Record<string, string | boolean> = {}
      style.customisations.forEach((c) => {
        defaults[c.id] = c.default
      })
      return { ...prev, [selectedStyle]: defaults }
    })
  }, [selectedStyle])

  const getCustomVal = (styleId: string, custId: string): string | boolean => {
    const style = IMAGE_STYLES.find((s) => s.id === styleId)
    const cust = style?.customisations.find((c) => c.id === custId)
    return customisationValues[styleId]?.[custId] ?? cust?.default ?? ""
  }

  const setCustomVal = (styleId: string, custId: string, value: string | boolean) => {
    setCustomisationValues((prev) => ({
      ...prev,
      [styleId]: { ...(prev[styleId] ?? {}), [custId]: value },
    }))
  }

  const buildInstructions = (): string => {
    const style = IMAGE_STYLES.find((s) => s.id === selectedStyle)
    if (!style) return ""
    const instructions: string[] = []
    style.customisations.forEach((c) => {
      const val = getCustomVal(selectedStyle, c.id)
      const instruction = c.promptInstruction(val)
      if (instruction) instructions.push(instruction)
    })
    chatNotes.forEach((note) => instructions.push(`Additional instruction: ${note}`))
    return instructions.length > 0 ? `\n\n---\n\nCustomisation instructions:\n${instructions.join("\n")}` : ""
  }

  // AI-generate structured image copy from post content
  const handleGenerateAICopy = async () => {
    if (!content.trim() || generatingAICopy) return
    setGeneratingAICopy(true)
    try {
      const res = await fetch("/api/generate/linkedin-image-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postContent: content, styleId: selectedStyle }),
      })
      const data = await res.json()
      if (res.ok && data.copy) {
        setImageCopy(data.copy)
      }
    } catch { /* ignore */ }
    setGeneratingAICopy(false)
  }

  // Step 1: Preview copy — pre-fills imageCopy from post content, shows edit step
  const handlePreviewCopy = () => {
    if (!content.trim()) return
    setImageCopy(content.trim())
    setImageStep("copy_review")
  }

  // Step 2: Generate final prompt using the curated imageCopy
  const handleGenerateFromCopy = () => {
    if (!imageCopy.trim()) return
    const style = IMAGE_STYLES.find((s) => s.id === selectedStyle)
    if (!style) return
    const fullPrompt = `${style.prompt}\n\n---\n\nContent to encode in the image:\n\n${imageCopy.trim()}${buildInstructions()}`
    setGeneratedPrompt(fullPrompt)
    setImageStep("result")
  }

  const handleAddChatNote = () => {
    const note = chatInput.trim()
    if (!note) return
    setChatNotes((prev) => [...prev, note])
    setChatInput("")
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
  }

  const handleCopy = async () => {
    if (!generatedPrompt) return
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  const handleReset = () => {
    setGeneratedPrompt(null)
    setChatNotes([])
    setChatInput("")
    setCopied(false)
    setImageStep("setup")
    setImageCopy("")
  }

  const handleRegenerateFromFeedback = (note: string) => {
    setChatNotes((prev) => [...prev, note])
    const style = IMAGE_STYLES.find((s) => s.id === selectedStyle)
    if (!style || !imageCopy.trim()) return
    const updatedNotes = [...chatNotes, note]
    const instructions: string[] = []
    style.customisations.forEach((c) => {
      const val = getCustomVal(selectedStyle, c.id)
      const instruction = c.promptInstruction(val)
      if (instruction) instructions.push(instruction)
    })
    updatedNotes.forEach((n) => instructions.push(`Additional instruction: ${n}`))
    const extraBlock = instructions.length > 0
      ? `\n\n---\n\nCustomisation instructions:\n${instructions.join("\n")}`
      : ""
    setGeneratedPrompt(`${style.prompt}\n\n---\n\nContent to encode in the image:\n\n${imageCopy.trim()}${extraBlock}`)
  }

  const currentStyle = IMAGE_STYLES.find((s) => s.id === selectedStyle)

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-300">LinkedIn Content Engine</span>
        </div>

        {/* Tab Nav */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6">
          <a href="/dashboard/social-engine/linkedin/write" className="flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Write</a>
          <a href="/dashboard/social-engine/linkedin/planner" className="flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Plan</a>
          <span className="flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg bg-teal-400/10 text-teal-400 border border-teal-400/20">Images</span>
          <a href="/dashboard/social-engine/linkedin/saved" className="flex-1 py-2.5 px-2 text-xs font-semibold text-center rounded-lg text-gray-500 hover:text-gray-300 transition-all">Saved</a>
        </div>

        {/* Back navigation */}
        {backUrl && (
          <a
            href={backUrl}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-4"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to {backSource === "planner" ? "Planner" : backSource === "write" ? "Write" : "Saved"}
          </a>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Image Prompts</h1>
        <p className="text-gray-500">Paste your post content, pick a style, customise, and get a ready-to-use prompt.</p>
      </div>

      {imageStep === "copy_review" && !generatedPrompt ? (
        /* ─── Copy Review Step ────────────────────────────────────────── */
        <div className="max-w-2xl space-y-6 animate-[fadeSlideIn_0.3s_ease-out]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Review image copy</h2>
              <p className="text-sm text-gray-500 mt-1">Edit the text that will appear in your image, then generate the prompt.</p>
            </div>
            <button onClick={() => setImageStep("setup")} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          {/* Style badge + hint */}
          <div className="flex items-start gap-3 p-4 bg-teal-400/5 border border-teal-400/20 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-teal-400 mb-0.5">{currentStyle?.label} style</p>
              <p className="text-xs text-gray-400 leading-relaxed">{STYLE_COPY_HINTS[selectedStyle] || "Edit the content to best suit this format."}</p>
            </div>
          </div>

          {/* Editable image copy */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-400">
                Image copy <span className="text-gray-600 font-normal">(what will appear in the image)</span>
              </label>
              <button
                onClick={handleGenerateAICopy}
                disabled={generatingAICopy || !content.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingAICopy ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            <textarea
              value={imageCopy}
              onChange={(e) => setImageCopy(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none text-sm leading-relaxed"
              placeholder="Edit the content that will go in the image..."
              autoFocus
            />
            <p className="text-xs text-gray-600 mt-2">{imageCopy.length} characters</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerateFromCopy}
              disabled={!imageCopy.trim()}
              className="px-6 py-3 text-sm font-bold rounded-xl bg-teal-400 text-black hover:bg-teal-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Prompt
            </button>
            <button
              onClick={() => setImageStep("setup")}
              className="px-5 py-3 text-sm font-semibold rounded-xl bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"
            >
              ← Edit Settings
            </button>
          </div>
        </div>
      ) : generatedPrompt ? (
        /* ─── Result View ─────────────────────────────────────────────── */
        <div className="space-y-6 animate-[fadeSlideIn_0.3s_ease-out]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-bold text-white">Your prompt is ready</p>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 uppercase tracking-wider">
                  {currentStyle?.label}
                </span>
                <span className="text-sm text-gray-500">style</span>
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all"
              >
                {copied ? "Copied!" : "Copy Prompt"}
              </button>
            </div>

            <div className="relative p-5 max-h-[500px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-[family-name:var(--font-geist-sans)]">
                {generatedPrompt}
              </pre>
            </div>
          </div>

          {/* Chat notes shown */}
          {chatNotes.length > 0 && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customisations applied</p>
              {chatNotes.map((note, i) => (
                <p key={i} className="text-xs text-gray-400">— {note}</p>
              ))}
            </div>
          )}

          {/* Feedback */}
          <div className="flex items-center gap-4">
            <FeedbackButtons
              contentType="linkedin_image_prompt"
              contentSnapshot={{ style: selectedStyle, content: content.slice(0, 200), prompt: generatedPrompt.slice(0, 500) }}
              onRegenerate={handleRegenerateFromFeedback}
            />
            <span className="text-xs text-gray-600">Rate this prompt</span>
          </div>

          {/* Instructions */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-3">
            <p className="text-sm font-semibold text-white">How to use</p>
            <ol className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                Copy the prompt above
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                Open <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Gemini</a> and paste it in
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                Download the generated image and post to LinkedIn
              </li>
            </ol>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleCopy}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-teal-400 text-black hover:bg-teal-300 transition-all"
            >
              {copied ? "Copied!" : "Copy Prompt"}
            </button>
            <a
              href="https://gemini.google.com/app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"
            >
              Open Gemini →
            </a>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white/[0.06] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"
            >
              New Prompt
            </button>
          </div>
        </div>
      ) : (
        /* ─── Input View ──────────────────────────────────────────────── */
        <div className="grid lg:grid-cols-[420px_1fr] gap-8">
          {/* Left: Controls */}
          <div className="space-y-5">
            {/* Content input */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-400 mb-3">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all resize-none text-sm leading-relaxed"
                placeholder="Paste your post content, key points, statistics, or any text you want turned into an image prompt..."
              />
              <p className="text-xs text-gray-600 mt-2">Paste the image idea from your post or planner output.</p>
            </div>

            {/* Customisation chips for selected style */}
            {currentStyle && currentStyle.customisations.length > 0 && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                <p className="text-sm font-medium text-gray-400">Customise — {currentStyle.label}</p>
                {currentStyle.customisations.map((cust) => (
                  <div key={cust.id}>
                    <p className="text-xs text-gray-500 mb-2">{cust.label}</p>
                    {cust.type === "chips" && cust.options ? (
                      <div className="flex flex-wrap gap-2">
                        {cust.options.map((opt) => {
                          const isSelected = getCustomVal(selectedStyle, cust.id) === opt.value
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setCustomVal(selectedStyle, cust.id, opt.value)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                                isSelected
                                  ? "bg-teal-400/10 border-teal-400/40 text-teal-400"
                                  : "bg-white/[0.03] border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20"
                              }`}
                            >
                              {opt.label}
                            </button>
                          )
                        })}
                      </div>
                    ) : cust.type === "toggle" ? (
                      <button
                        onClick={() => setCustomVal(selectedStyle, cust.id, !getCustomVal(selectedStyle, cust.id))}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          getCustomVal(selectedStyle, cust.id) ? "bg-teal-400" : "bg-white/[0.12]"
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          getCustomVal(selectedStyle, cust.id) ? "translate-x-4.5" : "translate-x-0.5"
                        }`} />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {/* Chat customisation box */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-3">
              <p className="text-sm font-medium text-gray-400">Anything else to customise?</p>
              {chatNotes.length > 0 && (
                <div className="space-y-1.5">
                  {chatNotes.map((note, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-teal-400 mt-0.5">→</span>
                      <span>{note}</span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddChatNote() }}
                  placeholder="e.g. Make the background warmer, use 5 sections..."
                  className="flex-1 px-3 py-2 text-xs bg-white/[0.04] border border-white/[0.08] rounded-lg text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-teal-400/40 transition-all"
                />
                <button
                  onClick={handleAddChatNote}
                  disabled={!chatInput.trim()}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-teal-400/10 border border-teal-400/20 text-teal-400 hover:bg-teal-400/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>

            <button
              onClick={handlePreviewCopy}
              disabled={!content.trim()}
              className="w-full py-4 rounded-xl font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3"
            >
              Preview & Generate →
            </button>
          </div>

          {/* Right: Style Selector */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Image Style</h2>
            <div className="space-y-3">
              {IMAGE_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`w-full text-left rounded-2xl border transition-all overflow-hidden ${
                    selectedStyle === style.id
                      ? "border-teal-400/50 bg-teal-400/5"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  {/* Demo image */}
                  {style.demoImage && (
                    <div className="w-full h-28 overflow-hidden bg-black/20">
                      <img
                        src={style.demoImage}
                        alt={`${style.label} example`}
                        className="w-full h-full object-cover object-top opacity-80"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                        selectedStyle === style.id ? "border-teal-400" : "border-gray-600"
                      }`}>
                        {selectedStyle === style.id && (
                          <div className="w-2 h-2 rounded-full bg-teal-400" />
                        )}
                      </div>
                      <span className={`text-sm font-semibold ${selectedStyle === style.id ? "text-teal-400" : "text-white"}`}>
                        {style.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 ml-7">{style.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LinkedInImagesPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto pt-16 text-center text-gray-500 text-sm">Loading...</div>}>
      <LinkedInImagesInner />
    </Suspense>
  )
}
