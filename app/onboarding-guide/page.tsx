'use client'

export default function OnboardingGuidePage() {
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
          <span className="text-gray-400 text-xs">The 10-Minute Onboarding System</span>
        </div>
        <button
          onClick={() => window.print()}
          className="px-5 py-2 bg-teal-400 text-black text-xs font-semibold rounded-lg hover:bg-teal-300 transition"
        >
          Download PDF →
        </button>
      </div>

      {/* Guide content */}
      <div className="print-page min-h-screen bg-white pt-16">
        <div className="max-w-3xl mx-auto px-8 py-16">

          {/* Cover */}
          <div className="mb-20 pb-16 border-b border-gray-100">
            <p className="text-teal-600 text-xs tracking-[0.3em] uppercase font-semibold mb-6">
              JP Automations — Free Guide
            </p>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              The 10-Minute<br />Onboarding System
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-6">
              How to build a fully automated client onboarding system — from intake to welcome email to client portal — using free tools, in one afternoon.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 mb-8 max-w-md">
              <p className="text-gray-700 text-sm font-semibold mb-1">Before you start:</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Setup takes <strong className="text-gray-700">2–3 hours once</strong>. Every client after that takes <strong className="text-gray-700">under 10 minutes</strong>.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">JP</div>
              <div>
                <p className="text-gray-900 text-sm font-semibold">JP Automations</p>
                <p className="text-gray-400 text-xs">jpautomations.co.uk</p>
              </div>
            </div>
          </div>

          {/* Tools overview */}
          <div className="mb-16">
            <p className="text-gray-700 font-semibold text-base mb-4">What you'll need (all free):</p>
            <div className="grid grid-cols-2 gap-3">
              <ToolCard name="Tally.so" use="Intake form" note="Free plan" />
              <ToolCard name="Calendly" use="Appointment booking" note="Free plan" />
              <ToolCard name="Brevo" use="Email automation" note="Free up to 300/day" />
              <ToolCard name="Notion" use="Client portal" note="Free plan" />
            </div>
            <p className="text-gray-400 text-xs mt-4 leading-relaxed">
              You don't need to pay for any of these. The free tiers are more than enough to run this system for your first 50+ clients.
            </p>
          </div>

          {/* How it works */}
          <div className="mb-16 pb-16 border-b border-gray-100">
            <p className="text-gray-700 font-semibold text-base mb-4">How the system works end-to-end:</p>
            <div className="space-y-2">
              <FlowStep n={1} label="New client books via Calendly" />
              <FlowArrow />
              <FlowStep n={2} label="They fill in your Tally intake form" />
              <FlowArrow />
              <FlowStep n={3} label="Tally → Brevo: welcome email sent automatically" />
              <FlowArrow />
              <FlowStep n={4} label="Brevo sends reminder email 24 hours before kick-off" />
              <FlowArrow />
              <FlowStep n={5} label="Client receives link to their Notion portal" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mt-5">
              Once it's built, your only job is to send the intake form link when a new client pays. Everything else runs on its own.
            </p>
          </div>

          {/* Step 1 */}
          <Section number="01" title="Build Your Tally Intake Form" subtitle="20 minutes — captures everything you need before the first call">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              This form collects all the information you need from a new client before the kick-off call. No more back-and-forth emails asking for basic details.
            </p>

            <p className="text-gray-700 font-semibold text-sm mb-3">Sign up and create your form:</p>
            <ol className="space-y-3 mb-6">
              <Step n={1}>Go to <strong>tally.so</strong> and create a free account</Step>
              <Step n={2}>Click <strong>New form</strong> → choose a blank template</Step>
              <Step n={3}>Give it a name like "New Client Intake — [Your Business Name]"</Step>
              <Step n={4}>Use the prompt below to generate your questions with AI</Step>
            </ol>

            <PromptBox title="Prompt — Generate intake form questions">
              {`I run a [type of service business]. I need an intake form for new clients that collects everything I need before our first kick-off call.

The form should:
- Feel professional but conversational (not corporate)
- Cover: their business overview, their goals for working with me, key challenges, any important deadlines, preferred communication style, and anything I should know before we start
- Be no longer than 10–12 questions
- Use short-answer and paragraph fields (no dropdowns unless necessary)

Write me the exact questions I should add to the form, with a brief instruction note for each one so the client knows what level of detail to give.`}
            </PromptBox>

            <p className="text-gray-500 text-sm leading-relaxed mt-5">
              Once you have your questions, add them one by one in Tally. Use the "Long answer" field type for most responses — you want clients to give you enough detail, not just tick boxes.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mt-3">
              When you're done, copy the form's share link. You'll send this to every new client after they've paid.
            </p>
          </Section>

          {/* Step 2 */}
          <Section number="02" title="Set Up Calendly" subtitle="15 minutes — so clients book directly into your calendar">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Calendly handles booking, confirmations, and reminders automatically. You'll use it specifically for your kick-off call slot.
            </p>

            <ol className="space-y-3 mb-6">
              <Step n={1}>Go to <strong>calendly.com</strong> and create a free account</Step>
              <Step n={2}>Connect your Google or Outlook calendar</Step>
              <Step n={3}>Create a new event type — call it "Kick-Off Call" — and set your preferred duration (typically 60 minutes)</Step>
              <Step n={4}>Set your availability — block out any times you don't want bookings</Step>
              <Step n={5}>Customise the confirmation email using the prompt below</Step>
            </ol>

            <PromptBox title="Prompt — Kick-off call confirmation email">
              {`Write a confirmation email that goes out automatically when a client books their kick-off call via Calendly.

Tone: warm, confident, and professional — not corporate or generic. It should feel like it came from a real person who's excited to get started.

Include:
- A brief welcome message confirming the booking
- A reminder to complete the intake form before the call (with a placeholder [INTAKE_FORM_LINK])
- One sentence on what to expect from the call
- Your name and sign-off

Keep it under 150 words.`}
            </PromptBox>

            <p className="text-gray-500 text-sm leading-relaxed mt-5">
              Paste the email copy into Calendly under <strong>Event Settings → Notifications → Confirmation email</strong>. Replace the placeholder with your actual Tally form link.
            </p>
          </Section>

          {/* Step 3 */}
          <Section number="03" title="Set Up Your Welcome Email Sequence in Brevo" subtitle="45 minutes — two automated emails that run without you">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Brevo is your email automation engine. You'll set up two emails: a welcome email sent immediately when a new client submits the intake form, and a reminder email sent 24 hours before the kick-off call.
            </p>

            <ol className="space-y-3 mb-8">
              <Step n={1}>Go to <strong>brevo.com</strong> and create a free account</Step>
              <Step n={2}>Go to <strong>Contacts → Lists</strong> → create a list called "Active Clients"</Step>
              <Step n={3}>Go to <strong>Automations</strong> → create a new workflow</Step>
              <Step n={4}>Set the trigger to: <em>Contact added to list "Active Clients"</em></Step>
              <Step n={5}>Add Email 1 immediately (0 delay) — use the prompt below to write the copy</Step>
              <Step n={6}>Add a 24-hour delay, then Email 2 — use the prompt below</Step>
            </ol>

            <PromptBox title="Prompt — Email 1: Welcome email (sent immediately)">
              {`Write a welcome email sent automatically as soon as a new client submits their intake form.

Context: They've already paid and booked their kick-off call. This email confirms we're ready to go.

Tone: direct, warm, confident — no fluff or corporate language.

Include:
- Acknowledge they've submitted the form
- Confirm the kick-off call is in the diary
- Let them know what to bring / prepare (mindset: be ready to think through goals, not just answer questions)
- A link to their Notion client portal (placeholder: [NOTION_PORTAL_LINK])
- Sign off personally

Keep it under 200 words. Subject line included.`}
            </PromptBox>

            <div className="mt-6">
              <PromptBox title="Prompt — Email 2: Pre-call reminder (sent 24 hours before kick-off)">
                {`Write a pre-call reminder email sent 24 hours before the kick-off call.

Tone: brief, practical, human — not a generic calendar reminder.

Include:
- A short "see you tomorrow" opener
- Reminder of the call time (use placeholder: [CALL_TIME])
- Two or three things to have ready for the call (their intake form answers, any relevant documents, a clear goal for what they want to get out of the session)
- The call link or dial-in details (placeholder: [CALL_LINK])
- Short, confident sign-off

Keep it under 150 words. Subject line included.`}
              </PromptBox>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mt-5">
              Once both emails are written, paste them into the Brevo workflow editor. Set Email 1 to send immediately on trigger, and Email 2 to send 24 hours after Email 1.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mt-3">
              Don't forget to activate the workflow once it's set up. It won't run until it's live.
            </p>
          </Section>

          {/* Step 4 */}
          <Section number="04" title="Connect Tally to Brevo" subtitle="30 minutes — the link that makes everything automatic">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              This is the connection that makes the whole system work. When a client submits your Tally form, they automatically get added to your Brevo list — and the welcome email sequence fires straight away.
            </p>

            <p className="text-gray-700 font-semibold text-sm mb-3">Using Tally's native Brevo integration:</p>
            <ol className="space-y-3 mb-6">
              <Step n={1}>In Tally, open your intake form and go to <strong>Integrations</strong></Step>
              <Step n={2}>Find <strong>Brevo</strong> in the list and click Connect</Step>
              <Step n={3}>Log in to your Brevo account when prompted to authorise the connection</Step>
              <Step n={4}>Map the form fields: connect the email field to Brevo's email field, and the name field to Brevo's first name / last name fields</Step>
              <Step n={5}>Under <strong>List</strong>, select "Active Clients" — the list you created in Step 3</Step>
              <Step n={6}>Save the integration and submit a test entry using a dummy email to confirm it works</Step>
            </ol>

            <CalloutBox title="Test it before going live:">
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                Submit your own intake form using a personal email address. Within a minute, you should:
              </p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>→ See the contact appear in your Brevo "Active Clients" list</li>
                <li>→ Receive the welcome email in your inbox</li>
              </ul>
              <p className="text-gray-500 text-xs mt-3">
                If the email doesn't arrive, check your Brevo workflow is activated and the list trigger is correctly set.
              </p>
            </CalloutBox>
          </Section>

          {/* Step 5 */}
          <Section number="05" title="Build a Notion Client Portal (Optional)" subtitle="45 minutes — a home base for every client, branded and ready to go">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              This is optional but worth doing if you want to look like you've been running this for years. A Notion portal gives each client a single place to find everything: project updates, resources, links, and next steps.
            </p>

            <ol className="space-y-3 mb-6">
              <Step n={1}>Go to <strong>notion.so</strong> and create a free account</Step>
              <Step n={2}>Create a new page — this will be your master portal template</Step>
              <Step n={3}>Use the prompt below to generate the welcome page copy</Step>
              <Step n={4}>Add sections for: Project Overview, Key Dates, Resources, and Next Steps</Step>
              <Step n={5}>When a new client starts, duplicate the template and personalise the details</Step>
              <Step n={6}>Share the page publicly (Share → Publish to web) and paste the link into your Brevo welcome email</Step>
            </ol>

            <PromptBox title="Prompt — Notion portal welcome page copy">
              {`Write the welcome page copy for a client portal in Notion.

Context: This is the first thing a new client sees when they open their portal. It should make them feel like they're in good hands from day one.

Tone: professional, clear, and reassuring — not overly formal. Feels like a well-run agency, not a freelancer.

Include:
- A short welcome message (2–3 sentences)
- What this portal is for and how to use it
- Where to go if they have a question (e.g., email or a dedicated Slack/WhatsApp channel — use placeholder [CONTACT_METHOD])
- A note on how you'll keep this updated as the project progresses

Keep it under 150 words. Write it as body copy only — no headings needed, as I'll add those in Notion.`}
            </PromptBox>

            <p className="text-gray-500 text-sm leading-relaxed mt-5">
              You only need to build this template once. Every new client gets a duplicate — just update the name, project details, and kick-off date.
            </p>
          </Section>

          {/* Final workflow summary */}
          <div className="mb-16 pb-16 border-b border-gray-100">
            <p className="text-gray-700 font-semibold text-base mb-4">Your complete workflow, once it's live:</p>
            <div className="space-y-3">
              <SummaryItem n={1} text="Client pays and books a kick-off call via Calendly — confirmation email fires automatically" />
              <SummaryItem n={2} text="You send them the Tally intake form link (the only manual step)" />
              <SummaryItem n={3} text="Client fills in the form — welcome email fires automatically via Brevo" />
              <SummaryItem n={4} text="Brevo sends a reminder email 24 hours before the kick-off call" />
              <SummaryItem n={5} text="You arrive at the call with everything you need. They arrive prepared." />
            </div>
            <p className="text-teal-600 font-semibold text-sm mt-6">
              Total manual effort per client: one link. That's it.
            </p>
          </div>

          {/* Closing */}
          <div className="mt-4 pt-12 border-t border-gray-100 text-center">
            <p className="text-gray-700 font-semibold text-lg mb-3">
              The system is simple because it's meant to be.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-10">
              The businesses that win aren't the ones with the most complex workflows. They're the ones that nailed the basics and made them run without thinking. This is yours.
            </p>
            <div className="inline-block bg-gray-50 border border-gray-100 rounded-2xl px-8 py-6">
              <p className="text-gray-500 text-sm mb-3">Want this built and connected for you?</p>
              <p className="text-gray-900 font-semibold text-base mb-1">JP Automations</p>
              <p className="text-teal-600 text-sm">jpautomations.co.uk/book-call</p>
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
    <div className="bg-gray-50 border border-gray-100 rounded-xl px-6 py-5 mt-6">
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

function PromptBox({ title, children }: { title: string; children: string }) {
  return (
    <div className="border border-teal-100 bg-teal-50/30 rounded-xl px-6 py-5">
      <p className="text-teal-700 text-xs font-semibold uppercase tracking-wider mb-3">{title}</p>
      <pre className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap font-mono">{children}</pre>
    </div>
  )
}

function ToolCard({ name, use, note }: { name: string; use: string; note: string }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <p className="text-gray-900 font-semibold text-sm mb-1">{name}</p>
      <p className="text-gray-500 text-xs mb-1">{use}</p>
      <p className="text-teal-600 text-xs font-medium">{note}</p>
    </div>
  )
}

function FlowStep({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
      <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{n}</span>
      <p className="text-gray-700 text-sm">{label}</p>
    </div>
  )
}

function FlowArrow() {
  return (
    <div className="flex justify-start pl-6">
      <span className="text-teal-300 text-lg">↓</span>
    </div>
  )
}

function SummaryItem({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{n}</span>
      <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
    </div>
  )
}
