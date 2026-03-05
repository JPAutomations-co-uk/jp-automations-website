'use client'

import { useState } from 'react'

const PROMPT = `Role and objective
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
- Black: main body text, primary definitions, primary equations.
- Blue: examples, secondary derivations, alternative paths, side calculations, optional notes.
- Red: emphasis only, corrections, warnings, key takeaways. Use sparingly.
- Green: structural elements (boxes, arrows, grouping braces, section separators) and positive relationships.

Rules to prevent arbitrary color mixing
- Within a single logical block, avoid arbitrary mixing. Keep it primarily black plus at most one helper color.
- Do not alternate colors line-by-line for decoration.
- Red is never used for long paragraphs — limited to short phrases, circles, underlines, or a single concise takeaway line.
- Black remains dominant overall; other colors are accents with clear purpose.

Diagram and annotation rules
- Arrows: straight, curved, double-headed, dashed — used only to clarify relationships.
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
- Do not add unrelated content beyond the inputs, except subtle generic erased remnants and minimal connective labels.
- No watermarks, logos, captions, borders, mockups.

Output requirement
Generate one photorealistic iPhone-style classroom photo of a professor's whiteboard that encodes the user's provided content using all rules above.

HOW TO USE
Paste this entire prompt as the system prompt in Grok, Nano Banana, or any image model that accepts system prompts. Then in your user message, write the content you want on the whiteboard — any topic, any framework, any breakdown. The model handles the rest.`

export default function PromptPage() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Top bar */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-[#0B0F14] border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-teal-400 text-xs tracking-widest uppercase font-medium">JP Automations</span>
          <span className="text-white/20">·</span>
          <span className="text-gray-400 text-xs">The Whiteboard Image Prompt</span>
        </div>
        <button
          onClick={handleCopy}
          className="px-5 py-2 bg-teal-400 text-black text-xs font-semibold rounded-lg hover:bg-teal-300 transition"
        >
          {copied ? 'Copied ✓' : 'Copy Prompt →'}
        </button>
      </div>

      <div className="min-h-screen bg-[#0B0F14] pt-16">
        <div className="max-w-3xl mx-auto px-8 py-16">

          {/* Header */}
          <div className="mb-12 pb-10 border-b border-white/10">
            <p className="text-teal-400 text-xs tracking-[0.3em] uppercase font-semibold mb-5">
              JP Automations — Free Resource
            </p>
            <h1 className="text-4xl font-extrabold text-white leading-[1.1] mb-4">
              The Whiteboard Image Prompt
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-xl">
              Paste this as a system prompt in Grok, Nano Banana, or any image model. Then describe your content in the user message — the model handles the rest.
            </p>
          </div>

          {/* How to use */}
          <div className="mb-10 bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-5">
            <p className="text-white text-sm font-semibold mb-3">How to use it</p>
            <div className="space-y-3">
              {[
                'Copy the full prompt below using the button above',
                'Paste it as the system prompt in your image model',
                'In your user message, write the content you want on the board',
                'Run — the model generates a photorealistic whiteboard photo',
              ].map((step, i) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-400/20 text-teal-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-gray-300 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The prompt */}
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white text-sm font-semibold">The Full Prompt</p>
              <button
                onClick={handleCopy}
                className="no-print text-teal-400 text-xs hover:text-teal-300 transition font-medium"
              >
                {copied ? 'Copied ✓' : 'Copy →'}
              </button>
            </div>
            <pre className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-gray-300 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">
              {PROMPT}
            </pre>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 pt-10 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm mb-2">Want your business automated end to end?</p>
            <a
              href="/book-call"
              className="inline-flex items-center gap-1 px-6 py-3 border border-teal-400/40 text-teal-400 text-sm rounded-xl hover:bg-teal-400/10 transition"
            >
              Book a Call →
            </a>
          </div>

        </div>
      </div>
    </>
  )
}
