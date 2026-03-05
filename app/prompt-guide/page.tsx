'use client'

export default function PromptGuidePage() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-page { background: white !important; color: black !important; }
        }
      `}</style>

      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-[#0B0F14] border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-teal-400 text-xs tracking-widest uppercase font-medium">JP Automations</span>
          <span className="text-white/20">·</span>
          <span className="text-gray-400 text-xs">The Prompt Engineering Guide</span>
        </div>
        <button
          onClick={() => window.print()}
          className="px-5 py-2 bg-teal-400 text-black text-xs font-semibold rounded-lg hover:bg-teal-300 transition"
        >
          Download PDF →
        </button>
      </div>

      <div className="print-page min-h-screen bg-white pt-16">
        <div className="max-w-3xl mx-auto px-8 py-16">

          {/* Cover */}
          <div className="mb-20 pb-16 border-b border-gray-100">
            <p className="text-teal-600 text-xs tracking-[0.3em] uppercase font-semibold mb-6">JP Automations — Free Resource</p>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              The Prompt<br />Engineering Guide
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-8">
              The best idea wins — but only if you know how to present it. This is everything you need to write prompts that AI fully understands and executes on.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">JP</div>
              <div>
                <p className="text-gray-900 text-sm font-semibold">JP Automations</p>
                <p className="text-gray-400 text-xs">jpautomations.co.uk</p>
              </div>
            </div>
          </div>

          {/* Intro */}
          <div className="mb-16">
            <p className="text-gray-500 text-base leading-relaxed mb-4">
              Most people use AI like a search engine. They type a vague question, get a mediocre answer, and conclude the tool isn&apos;t that impressive.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-4">
              The problem isn&apos;t the model. It&apos;s the prompt.
            </p>
            <p className="text-gray-700 font-medium text-base leading-relaxed">
              Prompt engineering isn&apos;t about tricks or hacks. It&apos;s about understanding how AI processes information and giving it exactly what it needs to produce something worth using. Once you understand the structure, the quality difference is immediate.
            </p>
          </div>

          {/* Section 1 */}
          <GuideSection number="01" title="The Anatomy of a High-Performance Prompt">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Every strong prompt has four layers. Most people write one, maybe two. The gap between an average output and an exceptional one usually comes down to whichever layers are missing.
            </p>
            <div className="space-y-4">
              <Layer letter="1" label="Role" color="teal">
                Who you want the AI to be. Not a decoration — it genuinely shifts how the model frames its response.
                <CodeBlock>{`You are a senior software engineer specialising in Node.js and distributed systems.`}</CodeBlock>
              </Layer>
              <Layer letter="2" label="Context" color="blue">
                What the AI needs to know about the situation. Background, constraints, relevant history.
                <CodeBlock>{`I'm building a webhook receiver for a SaaS product. It needs to handle high volume with idempotency. The stack is Next.js 15 with TypeScript.`}</CodeBlock>
              </Layer>
              <Layer letter="3" label="Task" color="gray">
                What you actually want done. Be specific. Vague tasks produce vague outputs.
                <CodeBlock>{`Write an API route that receives webhook events, validates the signature, deduplicates using a Redis key, and returns a 200 immediately before processing.`}</CodeBlock>
              </Layer>
              <Layer letter="4" label="Output Format" color="orange">
                How you want the response structured. Without this, the AI decides — and it often decides wrong.
                <CodeBlock>{`Return the complete route.ts file only. No explanation. TypeScript, no inline comments unless the logic is non-obvious.`}</CodeBlock>
              </Layer>
            </div>
            <Callout>
              A prompt with all four layers is not longer — it&apos;s more precise. Precision is what collapses the gap between what you asked for and what you get.
            </Callout>
          </GuideSection>

          {/* Section 2 */}
          <GuideSection number="02" title="Chain of Thought — Make AI Reason, Not Just Respond">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              For complex tasks, don&apos;t ask for the answer immediately. Ask the AI to think through the problem first, then produce the output. This is called chain of thought prompting and it measurably improves accuracy on anything requiring multi-step reasoning.
            </p>
            <p className="text-gray-700 font-medium text-sm mb-3">Without chain of thought:</p>
            <CodeBlock>{`What&apos;s the best database architecture for a multi-tenant SaaS?`}</CodeBlock>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 mt-2">You get a generic answer that could apply to any project.</p>

            <p className="text-gray-700 font-medium text-sm mb-3">With chain of thought:</p>
            <CodeBlock>{`I'm building a multi-tenant SaaS. Before recommending an architecture, think through: the tradeoffs between shared schema, schema-per-tenant, and database-per-tenant. Consider my constraints: expected tenant count is 500-2000, data isolation is a legal requirement, and I'm on PostgreSQL. Then give me a recommendation with reasoning.`}</CodeBlock>
            <p className="text-gray-500 text-sm leading-relaxed mt-2">Now the model walks through the tradeoffs before landing on an answer. The output is specific, reasoned, and defensible.</p>

            <Callout>
              Add &quot;think step by step before answering&quot; to any prompt where accuracy matters more than speed. It costs a few extra seconds. It eliminates most hallucinations.
            </Callout>
          </GuideSection>

          {/* Section 3 */}
          <GuideSection number="03" title="Few-Shot Examples — Show, Don't Tell">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              The fastest way to improve output quality is to show the AI an example of exactly what you want. One good example beats a paragraph of instructions.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-4">
              This works because AI models are pattern matchers at their core. Give them a pattern, they follow it.
            </p>
            <p className="text-gray-700 font-medium text-sm mb-3">Example — rewriting copy in a specific tone:</p>
            <CodeBlock>{`Rewrite the following in a direct, conversational tone. No corporate language. Short sentences.

Example input: "We leverage cutting-edge AI technology to optimise operational workflows."
Example output: "We build AI that removes the manual work from your business."

Now rewrite this: "Our platform facilitates seamless integration across diverse enterprise ecosystems."`}</CodeBlock>
            <p className="text-gray-500 text-sm leading-relaxed mt-3">The model now has a target. It knows exactly what &quot;direct and conversational&quot; means in your context — not in the abstract.</p>
            <Callout>
              Two or three examples consistently outperform detailed instructions for style, format, and tone. When words fail to describe what you want, show it instead.
            </Callout>
          </GuideSection>

          {/* Section 4 */}
          <GuideSection number="04" title="The Most Common Mistakes">
            <div className="space-y-6">
              <Mistake
                mistake="Being vague about the task"
                fix="Describe the exact output you want, including format, length, and what to exclude."
                bad={`Help me with my landing page copy.`}
                good={`Write a headline and three-sentence subheadline for a landing page targeting UK recruitment agencies. The headline should create urgency. No jargon. Under 12 words.`}
              />
              <Mistake
                mistake="No output format specified"
                fix="Always state how you want the response structured — bullet points, JSON, code only, numbered steps, etc."
                bad={`Explain how Redis works.`}
                good={`Explain how Redis works. Format: three bullet points max. Assume I know what a database is but have never used an in-memory store.`}
              />
              <Mistake
                mistake="Asking multiple questions in one prompt"
                fix="One prompt, one task. Split complex requests into sequential prompts."
                bad={`Review my code, suggest improvements, rewrite it, and explain what you changed.`}
                good={`Review this code and list issues by severity. Stop there — don't rewrite anything yet.`}
              />
              <Mistake
                mistake="Not iterating"
                fix="The first output is a draft. Tell the model what to adjust and why."
                bad={`[Accepts the first output and moves on]`}
                good={`Good. Now make the tone more direct — the third paragraph reads like a press release. Cut it by half.`}
              />
              <Mistake
                mistake="Forgetting the model has no memory between sessions"
                fix="Re-establish context at the start of every new conversation. Don't assume it remembers anything."
                bad={`Continue from where we left off.`}
                good={`I'm building [project]. Last session we finished [X]. Today I need [Y]. Here's the relevant code: [paste].`}
              />
            </div>
          </GuideSection>

          {/* Section 5 */}
          <GuideSection number="05" title="Copy-Paste Templates">
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              These are ready-to-use prompt structures for the most common use cases. Replace the brackets with your specifics.
            </p>

            <TemplateBlock title="Coding — build something">
              {`You are a [language/framework] expert.

Context: [describe the project, stack, and any relevant constraints]

Task: Build [specific thing]. It must [requirement 1], [requirement 2], and handle [edge case].

Output: Return the complete file only. TypeScript. No explanation unless the logic is non-obvious.`}
            </TemplateBlock>

            <TemplateBlock title="Coding — review and improve">
              {`You are a senior engineer doing a code review.

Review this code for: correctness, performance, security, and readability.

Return issues as a numbered list, ordered by severity. For each issue: describe the problem, explain why it matters, and show the fix.

[paste code]`}
            </TemplateBlock>

            <TemplateBlock title="Writing — rewrite in a specific tone">
              {`Rewrite the following in a [tone] style. Rules: [rule 1], [rule 2], [rule 3].

Example input: [paste example]
Example output: [paste what you want it to look like]

Now rewrite this: [paste your actual content]`}
            </TemplateBlock>

            <TemplateBlock title="Research — structured analysis">
              {`You are a [domain] expert.

Research question: [specific question]

Before answering, think through: [consideration 1], [consideration 2], [consideration 3].

Then give me: a direct answer, the key supporting evidence, and the main counterarguments. Format as three clearly labelled sections.`}
            </TemplateBlock>

            <TemplateBlock title="Automation — workflow design">
              {`You are an automation architect.

Context: [describe the business and its current process]
Problem: [what is manual, slow, or broken]
Constraints: [tools available, budget, technical limitations]

Design an automation workflow that solves this. Walk through it step by step. For each step: what triggers it, what it does, what it passes to the next step. End with the expected outcome and any failure cases to handle.`}
            </TemplateBlock>

            <TemplateBlock title="System prompt — configure an AI assistant">
              {`You are [role]. You are working on [project description].

Tech stack: [list]
Code style rules:
- [rule 1]
- [rule 2]
- [rule 3]

Never: [what to avoid]
Always: [what to include]

When I ask a question, answer directly and concisely. When I ask you to build something, return the complete implementation without asking clarifying questions unless something is genuinely ambiguous.`}
            </TemplateBlock>
          </GuideSection>

          {/* Final */}
          <div className="mt-20 pt-12 border-t border-gray-100 text-center">
            <p className="text-gray-700 font-semibold text-lg mb-3">
              The model isn&apos;t the bottleneck. The prompt is.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-10">
              Every framework in this guide compounds. Use all four layers, show examples, chain your reasoning, iterate on the output. The quality difference from a vague prompt to a structured one isn&apos;t marginal — it&apos;s the difference between a tool that occasionally helps and one that produces work worth shipping.
            </p>
            <div className="inline-block bg-gray-50 border border-gray-100 rounded-2xl px-8 py-6">
              <p className="text-gray-500 text-sm mb-3">Want your business automated end to end?</p>
              <p className="text-gray-900 font-semibold text-base mb-1">JP Automations</p>
              <p className="text-teal-600 text-sm">jpautomations.co.uk</p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

function GuideSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-16 pb-16 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-4 mb-6">
        <span className="text-teal-500 font-mono text-xs font-bold mt-1 shrink-0">{number}</span>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Layer({ letter, label, color, children }: { letter: string; label: string; color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    teal: 'bg-teal-50 border-teal-200 text-teal-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  }
  return (
    <div className={`border rounded-xl p-5 ${colors[color]}`}>
      <p className="font-semibold text-sm mb-2">{letter}. {label}</p>
      <div className="text-sm leading-relaxed opacity-80">{children}</div>
    </div>
  )
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-gray-900 text-gray-100 rounded-xl px-5 py-4 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono mt-3">
      {children}
    </pre>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 pl-4 border-l-4 border-teal-400 bg-teal-50 rounded-r-xl px-5 py-4">
      <p className="text-teal-800 text-sm leading-relaxed font-medium">{children}</p>
    </div>
  )
}

function Mistake({ mistake, fix, bad, good }: { mistake: string; fix: string; bad: string; good: string }) {
  return (
    <div className="border border-gray-100 rounded-xl p-6">
      <p className="text-gray-900 font-semibold text-sm mb-1">{mistake}</p>
      <p className="text-gray-400 text-xs mb-4">{fix}</p>
      <div className="space-y-3">
        <div>
          <p className="text-red-500 text-xs font-semibold mb-1">✗ Weak</p>
          <pre className="bg-red-50 text-red-800 rounded-lg px-4 py-3 text-xs font-mono whitespace-pre-wrap">{bad}</pre>
        </div>
        <div>
          <p className="text-teal-600 text-xs font-semibold mb-1">✓ Strong</p>
          <pre className="bg-teal-50 text-teal-800 rounded-lg px-4 py-3 text-xs font-mono whitespace-pre-wrap">{good}</pre>
        </div>
      </div>
    </div>
  )
}

function TemplateBlock({ title, children }: { title: string; children: string }) {
  return (
    <div className="mb-6">
      <p className="text-gray-700 font-semibold text-sm mb-2">{title}</p>
      <pre className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-gray-600 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">
        {children}
      </pre>
    </div>
  )
}
