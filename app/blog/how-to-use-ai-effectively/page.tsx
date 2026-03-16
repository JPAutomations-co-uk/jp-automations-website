import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Actually Use AI — 99% of People Are Doing This Wrong",
  description:
    "Most people get average results from AI because they prompt it wrong. Learn the four-layer prompt framework, iteration techniques, and model selection strategies for better LLM outputs.",
  author: {
    "@type": "Organization",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
  publisher: {
    "@type": "Organization",
    name: "JP Automations",
    logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" },
  },
  datePublished: "2026-03-07",
  dateModified: "2026-03-07",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.jpautomations.co.uk/blog/how-to-use-ai-effectively",
  },
  keywords: [
    "how to use AI effectively",
    "AI prompting guide",
    "LLM tips",
    "ChatGPT prompting",
    "Claude prompting",
    "prompt engineering",
    "better AI outputs",
    "how to write AI prompts",
    "AI for business",
    "LLM best practices",
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why are my AI outputs generic and unhelpful?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vague prompts produce vague outputs. Most people type a question without giving the AI a role, context, or specific task requirements. Use the four-layer prompt framework: assign a role, provide context, define the task clearly, and specify the output format.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best way to prompt ChatGPT or Claude?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use a four-layer prompt: (1) Role — tell the model who to be, (2) Context — explain your project and constraints, (3) Task — be specific about what you want, (4) Output format — tell it how to respond. Then iterate on the output instead of accepting the first response.",
      },
    },
    {
      "@type": "Question",
      name: "Which AI model should I use for different tasks?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use Claude for long documents, nuanced writing, and careful reasoning. Use Claude or Gemini for coding and technical tasks. Use Grok for real-time information and social data. Use Perplexity for research and synthesis. Use LLaMA for on-premise or privacy-critical applications.",
      },
    },
    {
      "@type": "Question",
      name: "How many times should I iterate on an AI output?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The first output is always a draft. Most exceptional AI outputs come after two to three rounds of feedback. Tell the model what is working, what is not, and why. People who get the best results are not using better models — they are iterating more.",
      },
    },
  ],
}

export default function Page() {
  return (
    <main className="bg-black text-white min-h-screen">
      <article className="relative max-w-3xl mx-auto px-6 py-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Back to blog */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="text-sm text-gray-400 hover:text-teal-400 transition"
          >
            &larr; Back to all articles
          </Link>
        </div>

        {/* Header */}
        <div className="mb-16">
          <p className="text-sm text-gray-400 mb-2">7 March 2026</p>
          <p className="text-teal-400 text-sm font-medium tracking-wide uppercase mb-4">
            AI &amp; Prompting Guide
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6">
            How to Actually Use AI &mdash;{" "}
            <span className="text-teal-400">
              99% of People Are Doing This Wrong
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            Most people get average results from AI and assume the models are
            overhyped. The problem isn&apos;t the model. It&apos;s how you&apos;re
            using it.
          </p>
        </div>

        {/* Article Body */}
        <div className="space-y-16 text-gray-300 leading-relaxed">

          {/* Intro */}
          <section>
            <p className="text-lg text-gray-400">
              I want to start with something honest.
            </p>
            <p className="text-lg text-gray-400 mt-4">
              When I first started using AI, my outputs were average. I thought
              the models were impressive but overhyped. Useful for basic stuff,
              unreliable for anything that mattered.
            </p>
            <p className="text-lg text-gray-400 mt-4">
              Then I realised the problem wasn&apos;t the model. It was purely me.
            </p>
            <p className="text-lg text-gray-400 mt-4">
              Here&apos;s what I was doing wrong, and what changed everything for me.
            </p>
          </section>

          {/* --- THE MISTAKES --- */}
          <section>
            <h2 className="text-3xl font-bold mb-2">
              The Mistakes <span className="text-gray-500">(And Why They&apos;re Killing Your Results)</span>
            </h2>
          </section>

          {/* Mistake 1 */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              Treating AI like a search engine
            </h3>
            <p className="text-gray-400 leading-relaxed">
              This is the most common one and it gradually ruins everything.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              People type a question, read the first answer, and move on.
              That&apos;s not how this works.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              <strong className="text-white">LLMs aren&apos;t databases. They&apos;re reasoning engines.</strong> A
              search engine finds existing information. An LLM synthesises,
              builds, and creates &mdash; but only if you engage with it like
              that.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              The mental model shift: stop asking questions. Start giving briefs.
            </p>
          </section>

          {/* Mistake 2 */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              Vague inputs, vague outputs
            </h3>
            <p className="text-gray-400 leading-relaxed">
              &ldquo;Write me some marketing copy.&rdquo;
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              Copy for what? For who? What tone? What outcome? What platform?
              What length?
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              The model doesn&apos;t know. So it guesses. And its guess is the most
              average, safest, most generic interpretation of what you could
              possibly mean.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              <strong className="text-white">Every vague prompt produces a vague output.</strong> Not because the
              model is bad, because you didn&apos;t give it the information it
              needed to be good.
            </p>
          </section>

          {/* Mistake 3 */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              Accepting the first output
            </h3>
            <p className="text-gray-400 leading-relaxed">
              This one is almost universal.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              Most people read the first response, decide it&apos;s good enough, and
              move on. Or they decide it&apos;s not good enough and give up.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              Neither is the right move.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              <strong className="text-white">The first output is a draft. That&apos;s it.</strong> Your job is to
              respond to it &mdash; tell the model what&apos;s working, what isn&apos;t,
              what needs to change, and why. The model gets dramatically better
              after one or two rounds of iteration.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              People who get exceptional AI outputs aren&apos;t using better models.
              They&apos;re iterating more.
            </p>
          </section>

          {/* Mistake 4 */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              No context, no memory
            </h3>
            <p className="text-gray-400 leading-relaxed">
              LLMs have little-to-no memory between conversations. Every new
              chat, you&apos;re starting from zero.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              Most people open a chat, type a request with no background, get a
              mediocre answer, and wonder why it doesn&apos;t understand their
              project.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              <strong className="text-white">It doesn&apos;t understand your project because you never explained
              it.</strong>
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              Before asking anything complex, give the model what it needs: what
              you&apos;re building, who it&apos;s for, what stack you&apos;re using, what
              constraints matter, what you&apos;ve already tried. Two minutes of
              context saves twenty minutes of back-and-forth.
            </p>
          </section>

          {/* Mistake 5 */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              One model for everything
            </h3>
            <p className="text-gray-400 leading-relaxed">
              There isn&apos;t a best model. There&apos;s a best model for each type of
              task.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              Using ChatGPT for everything because it&apos;s familiar is like using a
              hammer for every job because you own a hammer. It works. It&apos;s
              rarely optimal.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              The people getting the most out of AI are switching models based on
              the task, and they know which model excels at what.
            </p>
          </section>

          {/* Mistake 6 */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              Asking multiple things in one prompt
            </h3>
            <p className="text-gray-400 leading-relaxed">
              &ldquo;Review my code, suggest improvements, rewrite it, and explain
              what you changed.&rdquo;
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              That&apos;s four tasks. The model will attempt all four simultaneously
              and do each one worse than if you&apos;d asked for them separately.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              <strong className="text-white">One prompt. One task. Then iterate.</strong>
            </p>
          </section>

          {/* --- HOW TO LEVEL UP --- */}
          <section className="border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold mb-2">
              How to <span className="text-teal-400">Level Up</span>
            </h2>
          </section>

          {/* Technique 1 */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              The four-layer prompt
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Every strong prompt has four parts. Most people write one.
            </p>
            <div className="space-y-4">
              {[
                {
                  label: "Role",
                  desc: "tell the model who to be.",
                  example:
                    "\"You are a senior Next.js developer with deep experience in API design.\"",
                },
                {
                  label: "Context",
                  desc: "tell it what it needs to know.",
                  example:
                    "\"I'm building a webhook handler for a SaaS product. Stack is TypeScript, Next.js 15, deployed on Vercel.\"",
                },
                {
                  label: "Task",
                  desc: "be specific about what you want.",
                  example:
                    "\"Write an API route that validates the incoming signature, deduplicates events using a Redis key, and returns 200 immediately before processing.\"",
                },
                {
                  label: "Output format",
                  desc: "tell it how to respond.",
                  example:
                    "\"Return the complete file only. No explanation unless the logic is non-obvious.\"",
                },
              ].map((layer) => (
                <div
                  key={layer.label}
                  className="bg-white/[0.02] border border-white/5 rounded-lg px-5 py-4"
                >
                  <p className="text-white font-medium mb-1">
                    <span className="text-teal-400">{layer.label}</span>{" "}
                    &mdash; {layer.desc}
                  </p>
                  <p className="text-gray-500 text-sm font-mono">
                    {layer.example}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed mt-6">
              That&apos;s it. Four layers. The difference between a prompt that gets
              something usable and one that gets something you&apos;d never actually
              use.
            </p>
          </section>

          {/* Technique 2 */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              Make it think before it answers
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              For anything requiring real reasoning &mdash; architecture
              decisions, debugging, strategy &mdash; don&apos;t ask for the answer
              straight away. Ask it to think through the problem first.
            </p>

            <div className="space-y-4">
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg px-5 py-4">
                <p className="text-red-400 text-xs font-mono uppercase tracking-wider mb-2">
                  Bad
                </p>
                <p className="text-gray-400 text-sm">
                  &ldquo;What&apos;s the best way to structure a multi-tenant
                  database?&rdquo;
                </p>
              </div>
              <div className="bg-teal-400/5 border border-teal-400/20 rounded-lg px-5 py-4">
                <p className="text-teal-400 text-xs font-mono uppercase tracking-wider mb-2">
                  Good
                </p>
                <p className="text-gray-400 text-sm">
                  &ldquo;Before answering, think through the tradeoffs between
                  shared schema, schema-per-tenant, and database-per-tenant.
                  Consider that I have 500&ndash;2000 tenants, data isolation is a
                  legal requirement, and I&apos;m on PostgreSQL. Then give me a
                  recommendation with your reasoning.&rdquo;
                </p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed mt-6">
              The second prompt forces the model through the logic before
              landing on a conclusion. The output is specific, reasoned, and
              actually applicable to your situation &mdash; not a generic answer
              that could apply to anyone.
            </p>
          </section>

          {/* Technique 3 */}
          <section>
            <h3 className="text-2xl font-bold mb-4">Show, don&apos;t tell</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              If you want a specific style, tone, or format &mdash; show an
              example.
            </p>
            <div className="bg-white/[0.02] border border-white/5 rounded-lg px-5 py-4">
              <p className="text-gray-400 text-sm font-mono leading-relaxed">
                &ldquo;Rewrite this in a direct, conversational tone. Short
                sentences, no corporate language. Example: &apos;We leverage
                cutting-edge AI to optimise workflows&apos; &rarr; &apos;We build AI that
                removes the manual work from your business.&apos; Now rewrite
                this: [your text]&rdquo;
              </p>
            </div>
            <p className="text-gray-400 leading-relaxed mt-4">
              <strong className="text-white">One example beats a paragraph of style instructions.</strong> The
              model is a pattern matcher. Give it the pattern.
            </p>
          </section>

          {/* Technique 4 */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              Use system prompts for anything you use repeatedly
            </h3>
            <p className="text-gray-400 leading-relaxed">
              If you&apos;re using AI for the same type of task regularly &mdash;
              writing, coding, research, client work &mdash; stop re-explaining
              yourself every time.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              Set up a system prompt that tells the model everything it needs to
              know about how you work. Your stack, your style, your rules, your
              constraints. Paste it at the start of every relevant conversation.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              In tools like Cursor, Antigravity, or Claude Projects, you can
              save this permanently. You configure it once and the model behaves
              consistently every time without being briefed.
            </p>
          </section>

          {/* Technique 5 */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              Iterate like it&apos;s a conversation
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              The best prompts are rarely written in one go. They evolve.
            </p>
            <div className="space-y-3">
              <div className="bg-white/[0.02] border border-white/5 rounded-lg px-5 py-3">
                <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-1">
                  After the first output
                </p>
                <p className="text-gray-400 text-sm">
                  &ldquo;Good. Now make the tone more direct &mdash; the second
                  paragraph reads too formally. Cut it by half.&rdquo;
                </p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-lg px-5 py-3">
                <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-1">
                  After the second
                </p>
                <p className="text-gray-400 text-sm">
                  &ldquo;Better. The third section still isn&apos;t landing. The
                  point I&apos;m making is [X]. Try again with that framing.&rdquo;
                </p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mt-4">
              This is how you get from &ldquo;decent&rdquo; to &ldquo;exactly what I
              needed.&rdquo; It&apos;s not a different model. It&apos;s a different mindset.
            </p>
          </section>

          {/* Technique 6 */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              Pick the right model for the job
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Here&apos;s how I think about it:
            </p>
            <div className="space-y-3">
              {[
                {
                  task: "Long documents, nuanced writing, careful reasoning",
                  model: "Claude",
                  why: "It holds context better and is less likely to make things up confidently.",
                },
                {
                  task: "Coding, building, technical tasks",
                  model: "Claude or Gemini",
                  why: "Antigravity and Cursor both leverage this well.",
                },
                {
                  task: "Real-time information, social data",
                  model: "Grok",
                  why: "It has live access to X data.",
                },
                {
                  task: "Research and synthesis",
                  model: "Perplexity",
                  why: "Built for this specific use case.",
                },
                {
                  task: "On-premise or privacy-critical",
                  model: "LLaMA",
                  why: "Open source, self-hostable, no data leaving your infrastructure.",
                },
              ].map((row) => (
                <div
                  key={row.model}
                  className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-lg px-5 py-3"
                >
                  <span className="text-teal-400 mt-0.5">&rarr;</span>
                  <div>
                    <span className="text-white font-medium">{row.task}</span>
                    <span className="text-gray-400">
                      {" "}&mdash; {row.model}. {row.why}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed mt-6">
              Stop defaulting to one model. The right tool for the right job is
              still the right principle.
            </p>
          </section>

          {/* Closing */}
          <section>
            <h3 className="text-2xl font-bold mb-4">
              Treat it like a smart collaborator, not a magic button
            </h3>
            <p className="text-gray-400 leading-relaxed">
              This is the mindset shift that changes everything.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              The people getting the most out of LLMs aren&apos;t treating them like
              a vending machine &mdash; put in a request, get out an answer.
              They&apos;re treating them like a capable collaborator who needs a good
              brief, responds to feedback, and gets better the more clearly you
              communicate.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              You wouldn&apos;t hand a brief to a new employee that said &ldquo;write
              some content&rdquo; and walk away. You&apos;d explain the project, the
              audience, the goal, the format you need, and check back in once
              they&apos;d had a go.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              Apply that same logic to AI. The model is only as useful as the
              quality of your direction.
            </p>
          </section>

          {/* TL;DR */}
          <section className="border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold text-white mb-6">TL;DR</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Most people blame the model when the output is bad. The model is
              rarely the problem.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              <strong className="text-white">Vague in, vague out. Every time.</strong>
            </p>
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {[
                "Give it a role. Give it context.",
                "Be specific about the task.",
                "Tell it how to respond.",
                "Iterate on the output.",
                "Use the right model for the job.",
                "Treat it like a collaborator, not a button.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 bg-teal-400/5 border border-teal-400/10 rounded-lg px-4 py-3"
                >
                  <span className="text-teal-400 text-sm mt-0.5">&check;</span>
                  <p className="text-gray-300 text-sm">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed">
              The gap between people who think AI is overhyped and people who
              can&apos;t imagine working without it isn&apos;t the tools they&apos;re using.
            </p>
            <p className="text-white font-medium mt-4">
              It&apos;s how they&apos;re using them.
            </p>
          </section>
        </div>

        {/* CTA */}
        <section className="mt-20 bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Want AI systems built for your business?
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            We build AI-powered automation systems for service businesses &mdash;
            the kind that save 25+ hours a week and recover revenue you didn&apos;t
            know you were losing.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-medium rounded-xl hover:bg-teal-300 transition"
          >
            Book a Free Audit
          </Link>
        </section>

        {/* Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl text-sm hover:border-teal-400 hover:text-teal-400 transition"
          >
            &larr; All Articles
          </Link>
          <Link
            href="/blog/setup-your-ide-properly"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl text-sm hover:border-teal-400 hover:text-teal-400 transition"
          >
            Read: Setting Up Your IDE Properly &rarr;
          </Link>
          <Link
            href="/blog/business-process-automation-uk-service-businesses"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl text-sm hover:border-teal-400 hover:text-teal-400 transition"
          >
            Read: 5 Processes to Automate &rarr;
          </Link>
        </div>
      </article>
    </main>
  )
}
