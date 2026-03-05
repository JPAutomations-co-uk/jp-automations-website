'use client'

export default function BlueprintPage() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-page { background: white !important; color: black !important; }
        }
      `}</style>

      {/* Download bar */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-[#0B0F14] border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-teal-400 text-xs tracking-widest uppercase font-medium">JP Automations</span>
          <span className="text-white/20">·</span>
          <span className="text-gray-400 text-xs">The Automation Blueprint</span>
        </div>
        <button
          onClick={() => window.print()}
          className="px-5 py-2 bg-teal-400 text-black text-xs font-semibold rounded-lg hover:bg-teal-300 transition"
        >
          Download PDF →
        </button>
      </div>

      {/* Blueprint content */}
      <div className="print-page min-h-screen bg-white pt-16">
        <div className="max-w-3xl mx-auto px-8 py-16">

          {/* Cover */}
          <div className="mb-20 pb-16 border-b border-gray-100">
            <p className="text-teal-600 text-xs tracking-[0.3em] uppercase font-semibold mb-6">
              JP Automations — Free Resource
            </p>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              The Automation<br />Blueprint
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
              How to find, build, and scale the right automation for any business — without touching a single tool until the problem is fully understood.
            </p>
            <div className="mt-10 flex items-center gap-4">
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
              Most businesses automate the wrong thing first.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-4">
              They chase the flashiest workflow, the most technical solution, or whatever they saw on YouTube — without ever stopping to ask: does this actually solve our biggest problem?
            </p>
            <p className="text-gray-700 text-base leading-relaxed font-medium">
              This blueprint is the framework I use with every client. It's not about tools. It's about finding the right problem, then building something that doesn't just fix it today — but gets stronger as the business grows.
            </p>
          </div>

          {/* Step 1 */}
          <Section number="01" title="The Automation Audit" subtitle="30 minutes — before you touch any tool">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Before touching any tool, you need a clear picture of how the business actually runs.
            </p>
            <CalloutBox title="Ask these questions:">
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>→ Where does time get wasted every week, without fail?</li>
                <li>→ What tasks are being done manually that happen more than 3× a week?</li>
                <li>→ Where do things fall through the cracks? (leads not followed up, invoices sent late, no-shows not rescheduled)</li>
                <li>→ What would break first if the business doubled in size tomorrow?</li>
              </ul>
            </CalloutBox>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 mt-6 font-medium">How to run it in 30 minutes:</p>
            <ol className="space-y-3">
              <Step n={1}>Talk to the owner or operator for 20 minutes — not about automation, about their day</Step>
              <Step n={2}>Map every recurring task they mention onto a simple list</Step>
              <Step n={3}>Mark each one: <em>High frequency? High impact if fixed? Currently manual?</em></Step>
              <Step n={4}>Anything that scores three out of three is your starting point</Step>
            </ol>
          </Section>

          {/* Step 2 */}
          <Section number="02" title="The Reddit Research Method" subtitle="For validating pain points before you pitch anything">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              If you don't have direct access yet, or want to validate what you're hearing — go where people complain honestly.
            </p>
            <CalloutBox title="Where to look:">
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>→ Reddit — search the niche + "problems", "frustrations", "what I hate about"</li>
                <li>→ Google Reviews of competitors (1–3 star reviews are gold)</li>
                <li>→ Facebook Groups in the niche</li>
                <li>→ Trustpilot, G2, Capterra for software they use</li>
              </ul>
            </CalloutBox>
            <p className="text-gray-700 font-medium text-sm mt-6 mb-3">What you're looking for:</p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Not one-off complaints. Patterns. The same frustration appearing across different people, different businesses, different platforms — that's a real problem worth solving.
            </p>
            <p className="text-gray-700 font-medium text-sm mb-3">Real examples of what this surfaces:</p>
            <div className="space-y-3">
              <Quote niche="Trades businesses">"I spend half my Sunday chasing invoices"</Quote>
              <Quote niche="Recruitment agencies">"Following up with candidates manually is killing us"</Quote>
              <Quote niche="E-commerce">"We lose customers at checkout and have no idea why"</Quote>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mt-5 italic">
              Write down the exact language people use. That becomes your messaging when you pitch the solution.
            </p>
          </Section>

          {/* Step 3 */}
          <Section number="03" title="The Two Rules" subtitle="Run every potential solution through these before building anything">
            <div className="mb-8">
              <RuleBlock letter="A" title="It must scale with growth">
                <p className="text-gray-500 text-sm leading-relaxed mb-3">
                  The automation should get more valuable as the business grows — not become a bottleneck.
                </p>
                <p className="text-gray-600 text-sm font-medium mb-3">Ask: <em>If this business 5x'd in 12 months, would this workflow hold up or fall apart?</em></p>
                <div className="space-y-2">
                  <p className="text-sm"><span className="text-teal-600 font-semibold">Pass:</span> <span className="text-gray-500">Automated lead follow-up via email — works at any volume</span></p>
                  <p className="text-sm"><span className="text-red-500 font-semibold">Fail:</span> <span className="text-gray-500">A spreadsheet with conditional formatting someone manually updates — breaks immediately at scale</span></p>
                </div>
              </RuleBlock>
            </div>
            <div>
              <RuleBlock letter="B" title="It must only ever move the needle in one direction">
                <p className="text-gray-500 text-sm leading-relaxed mb-3">
                  There are workflows that sometimes help and sometimes create friction. Avoid them. You want automations where the outcome is always positive — no edge cases where it backfires.
                </p>
                <div className="space-y-2">
                  <p className="text-sm"><span className="text-teal-600 font-semibold">Pass:</span> <span className="text-gray-500">Sending an appointment reminder 24 hours before — always reduces no-shows</span></p>
                  <p className="text-sm"><span className="text-red-500 font-semibold">Fail:</span> <span className="text-gray-500">Auto-replying to every inbound email with a generic response — occasionally sends the wrong message at the wrong moment</span></p>
                </div>
              </RuleBlock>
            </div>
          </Section>

          {/* Step 4 */}
          <Section number="04" title="Workflows That Always Work" subtitle="Category-level automations that hold up across almost every service business">
            <div className="space-y-6">
              <WorkflowCard
                title="Lead Follow-Up Sequences"
                why="Most leads don't convert on first contact. Most businesses follow up once, maybe twice. The automation closes the gap."
                scales
              />
              <WorkflowCard
                title="Appointment & Booking Automation"
                why="No-shows are expensive. Confirmation and reminder sequences cut them significantly — with zero downside."
                scales
              />
              <WorkflowCard
                title="Invoice & Payment Chasing"
                why="Chasing invoices manually is one of the most time-consuming admin tasks in any service business. Automate the reminders entirely."
                scales
              />
              <WorkflowCard
                title="Review Collection"
                why="Happy customers rarely leave reviews unprompted. An automated nudge at the right moment changes that — and compounds over time."
                scales
              />
              <WorkflowCard
                title="Lead Enrichment & Qualification"
                why="When a new lead comes in, automatically pull data about them and score them before anyone picks up the phone. Saves the sales team from bad-fit calls."
                scales
              />
            </div>
          </Section>

          {/* Step 5 */}
          <Section number="05" title="Where to Start" subtitle="Not sure which automation to build first? Run through this in order">
            <div className="space-y-4">
              <DecisionStep
                n={1}
                question="Is there a revenue leak?"
                detail="Leads not being followed up, invoices unpaid, customers not returning?"
                action="Start here. Fix the leak before building anything new."
              />
              <DecisionStep
                n={2}
                question="Is there a time drain?"
                detail="Something being done manually, repeatedly, by a human who shouldn't be doing it?"
                action="Automate this second. Free up capacity before scaling."
              />
              <DecisionStep
                n={3}
                question="Is there a growth bottleneck?"
                detail="Something that works fine now but would break if the business doubled?"
                action="Build this third. Future-proof the foundation."
              />
              <DecisionStep
                n={4}
                question="Is there a customer experience gap?"
                detail="Slow response times, missed follow-ups, inconsistent communication?"
                action="Automate this fourth. Consistency compounds over time."
              />
            </div>
            <p className="text-teal-600 font-semibold text-sm mt-6">Start with number one. Always.</p>
          </Section>

          {/* Closing */}
          <div className="mt-20 pt-12 border-t border-gray-100 text-center">
            <p className="text-gray-700 font-semibold text-lg mb-3">
              The best automation isn't the most impressive one.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-10">
              It's the one that solves the most painful, recurring problem — and keeps solving it better as the business grows. Most people skip straight to tools. The ones who win spend more time on the problem.
            </p>
            <div className="inline-block bg-gray-50 border border-gray-100 rounded-2xl px-8 py-6">
              <p className="text-gray-500 text-sm mb-3">Want this built for your business?</p>
              <p className="text-gray-900 font-semibold text-base mb-1">JP Automations</p>
              <p className="text-teal-600 text-sm">jpautomations.co.uk</p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

function Section({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mb-16 pb-16 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-4 mb-6">
        <span className="text-teal-500 font-mono text-xs font-bold mt-1 shrink-0">{number}</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h2>
          <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function CalloutBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl px-6 py-5">
      <p className="text-gray-700 text-sm font-semibold mb-3">{title}</p>
      {children}
    </div>
  )
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 text-teal-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{n}</span>
      <p className="text-gray-500 text-sm leading-relaxed">{children}</p>
    </div>
  )
}

function Quote({ niche, children }: { niche: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 pl-4 border-l-2 border-teal-200">
      <div>
        <p className="text-gray-400 text-xs font-medium mb-1">{niche}</p>
        <p className="text-gray-600 text-sm italic">"{children}"</p>
      </div>
    </div>
  )
}

function RuleBlock({ letter, title, children }: { letter: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-100 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-8 rounded-lg bg-teal-500 text-white text-sm font-bold flex items-center justify-center">{letter}</span>
        <h3 className="text-gray-900 font-semibold text-base">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function WorkflowCard({ title, why, scales }: { title: string; why: string; scales: boolean }) {
  return (
    <div className="border border-gray-100 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="text-gray-900 font-semibold text-sm">{title}</h3>
        {scales && <span className="text-teal-600 text-xs font-medium bg-teal-50 px-2 py-1 rounded-full shrink-0">Scales ✓</span>}
      </div>
      <p className="text-gray-500 text-sm leading-relaxed">{why}</p>
    </div>
  )
}

function DecisionStep({ n, question, detail, action }: { n: number; question: string; detail: string; action: string }) {
  return (
    <div className="flex items-start gap-4 p-5 border border-gray-100 rounded-xl">
      <span className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{n}</span>
      <div>
        <p className="text-gray-900 font-semibold text-sm mb-1">{question}</p>
        <p className="text-gray-400 text-xs mb-2">{detail}</p>
        <p className="text-teal-600 text-xs font-medium">{action}</p>
      </div>
    </div>
  )
}
