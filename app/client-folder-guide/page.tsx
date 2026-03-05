'use client'

export default function ClientFolderGuidePage() {
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
          <span className="text-gray-400 text-xs">The AI Client Folder</span>
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
            <p className="text-teal-600 text-xs tracking-[0.3em] uppercase font-semibold mb-6">
              JP Automations — Free Guide
            </p>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              The AI<br />Client Folder
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-6">
              One brief per client. AI generates your proposal, invoice, contract, and CRM entry — all formatted, all ready to send.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 mb-8 max-w-md">
              <p className="text-gray-700 text-sm font-semibold mb-1">Before you start:</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Setup takes <strong className="text-gray-700">30 minutes once</strong>. Every new deal after that takes <strong className="text-gray-700">under 5 minutes</strong>.
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

          {/* What you need */}
          <div className="mb-16">
            <p className="text-gray-700 font-semibold text-base mb-4">What you need (all free):</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <ToolCard name="Claude.ai" use="Generates all documents" note="Free plan works" />
              <ToolCard name="Google Docs" use="Finished proposals & invoices" note="Free" />
              <ToolCard name="Notion" use="CRM — track every client" note="Free plan" />
              <ToolCard name="Any text editor" use="Fill in the brief" note="Notepad, TextEdit, VS Code" />
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Claude.ai free tier handles everything in this guide. If you want longer documents or faster generation, Claude Pro is £18/month — but it&apos;s not required to start.
            </p>
          </div>

          {/* How it works */}
          <div className="mb-16 pb-16 border-b border-gray-100">
            <p className="text-gray-700 font-semibold text-base mb-4">How the system works:</p>
            <div className="space-y-2">
              <FlowStep n={1} label="New deal agreed → open a new client folder" />
              <FlowArrow />
              <FlowStep n={2} label="Fill in brief.md — takes 5 minutes" />
              <FlowArrow />
              <FlowStep n={3} label="Paste brief + proposal prompt into Claude → copy output to Google Docs → send" />
              <FlowArrow />
              <FlowStep n={4} label="Paste brief + invoice prompt → format → send" />
              <FlowArrow />
              <FlowStep n={5} label="Paste brief + contract prompt → both parties sign in Google Docs" />
              <FlowArrow />
              <FlowStep n={6} label="Paste brief + CRM prompt → paste into Notion → done" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mt-5">
              The brief is the key. You fill it in once and it powers everything else. No reformatting, no rewriting, no starting from scratch.
            </p>
          </div>

          {/* Step 1: Folder structure */}
          <Section number="01" title="Set Up Your Folder Structure" subtitle="5 minutes — do this once">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Create this structure on your computer, in Google Drive, or in Notion. The exact location doesn&apos;t matter — what matters is that every client gets their own folder and every document lives in it.
            </p>

            <div className="bg-gray-900 rounded-xl px-6 py-5 mb-6 font-mono text-sm">
              <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">Folder structure</p>
              <div className="space-y-1">
                <p className="text-teal-400">📁 Clients/</p>
                <p className="text-gray-400 pl-6">📁 _Templates/</p>
                <p className="text-gray-300 pl-12">📄 brief-template.md</p>
                <p className="text-gray-500 pl-6 mt-2 text-xs italic">← copy this for each new client</p>
                <p className="text-teal-300 pl-6 mt-3">📁 [Client Name — YYYY-MM-DD]/</p>
                <p className="text-gray-300 pl-12">📄 brief.md</p>
                <p className="text-gray-300 pl-12">📄 proposal.md</p>
                <p className="text-gray-300 pl-12">📄 invoice.md</p>
                <p className="text-gray-300 pl-12">📄 contract.md</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">
              When a new client signs, duplicate the <strong className="text-gray-700">_Templates</strong> folder, rename it with the client name and today&apos;s date, and you&apos;re ready.
            </p>
          </Section>

          {/* Step 2: The Brief */}
          <Section number="02" title="The Client Brief Template" subtitle="Fill this in once — it powers every document">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              This is the core of the system. Every prompt you&apos;ll use in the steps below references this brief. Take 5 minutes to fill it in properly after your sales call — the better the brief, the better every document.
            </p>
            <p className="text-gray-700 font-semibold text-sm mb-3">Copy this as your <code className="text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded text-xs">brief-template.md</code>:</p>

            <CodeBlock>{`# Client Brief — [Client Name]

Date:
Filled in by:

---

## Contact Details

Full name:
Company name:
Industry / niche:
Website:
Email:
Phone:

---

## Project Scope

Service(s) requested:

Project description (what they want done):

Timeline / deadline:

Budget discussed: £

How they found you:

---

## Discovery Call Notes

Main pain points they described:

Their goals (what success looks like to them):

Any objections or concerns raised:

Red flags or things to watch:

---

## Agreed Terms

Service agreed:
Price agreed: £
Payment structure: (e.g. 50% upfront, 50% on completion)
Start date:
Estimated delivery:

Key deliverables:
1.
2.
3.

---

## Additional Notes`}</CodeBlock>

            <p className="text-gray-500 text-sm leading-relaxed mt-5">
              Save this as <code className="text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded text-xs">brief-template.md</code> in your <strong className="text-gray-700">_Templates</strong> folder. Duplicate it for each new client and fill it in fresh.
            </p>
          </Section>

          {/* Step 3: Proposal */}
          <Section number="03" title="Generate a Proposal" subtitle="Paste your brief + this prompt into Claude → done">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Once the brief is filled in, open <strong className="text-gray-700">claude.ai</strong>, start a new conversation, and paste the prompt below followed by your full brief. Claude will output a complete, client-ready proposal.
            </p>

            <PromptBox title="Proposal Prompt — copy this exactly">
              {`You are a professional proposal writer for a UK service business. I'm going to give you a client brief and you need to generate a complete, client-ready proposal document.

Here is the client brief:

[PASTE YOUR FULL BRIEF HERE]

Generate a proposal with these exact sections:

1. Executive Summary — 2–3 sentences. What we'll do and the single most important outcome for them.
2. The Challenge — Restate their problem using the exact language from the brief. Don't paraphrase. Make them feel understood.
3. Our Approach — Step-by-step how we'll solve it. Be specific. Use numbered steps.
4. Deliverables — Bullet list. Each item should be specific and measurable, not vague.
5. Timeline — Week-by-week breakdown from start date to delivery.
6. Investment — Agreed price, payment structure, what's included, what's excluded.
7. Why Us — 2–3 sentences. Confident, not salesy. Reference a relevant result if possible.
8. Next Steps — One clear action. "Reply to this email to confirm" or "Sign the contract at the link below."

Tone rules:
- Direct and confident — no corporate filler
- Write like a person, not a company
- No phrases like "we are pleased to", "leveraging", "synergy", or "best-in-class"
- Short sentences. Active voice.

Format: Clean sections with bold headings. Ready to paste into Google Docs.`}
            </PromptBox>

            <div className="mt-6 space-y-3">
              <Step n={1}>Paste the prompt into Claude, replace <strong>[PASTE YOUR FULL BRIEF HERE]</strong> with your actual brief</Step>
              <Step n={2}>Copy Claude&apos;s output</Step>
              <Step n={3}>Open Google Docs → New document → Paste → light formatting if needed → send to client</Step>
              <Step n={4}>Save the output as <code className="text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded text-xs">proposal.md</code> in the client&apos;s folder</Step>
            </div>
          </Section>

          {/* Step 4: Invoice */}
          <Section number="04" title="Generate an Invoice" subtitle="Formatted, line-itemed, VAT-ready">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Same process as the proposal — paste the prompt and your brief into Claude. The invoice will be structured with line items, VAT (if applicable), payment terms, and bank details placeholders.
            </p>

            <PromptBox title="Invoice Prompt — copy this exactly">
              {`Generate a professional invoice based on this client brief. Format it ready to paste into Google Docs.

Here is the client brief:

[PASTE YOUR FULL BRIEF HERE]

Structure the invoice like this:

HEADER
- Title: INVOICE
- Invoice number: [INV-001] — I'll update this manually
- Date issued: [today's date]
- Payment due: 30 days from issue date (or match brief terms)

FROM (my details — use placeholders I'll fill in)
- Business name: [YOUR BUSINESS NAME]
- Address: [YOUR ADDRESS]
- Email: [YOUR EMAIL]
- Phone: [YOUR PHONE]
- VAT number (if applicable): [VAT NUMBER]

TO (pull from brief)
- Client name
- Company
- Email

LINE ITEMS
Break the agreed service into 2–4 clear line items. Each should have:
- Description (what it is, written for the client to understand)
- Quantity
- Unit price
- Line total

After line items:
- Subtotal
- VAT at 20% (if the brief mentions VAT, otherwise mark as "N/A — not VAT registered")
- Total due: £[AMOUNT]

PAYMENT DETAILS
- Payment method: Bank transfer
- Sort code: [SORT CODE]
- Account number: [ACCOUNT NUMBER]
- Reference: [CLIENT NAME] — INV-001

FOOTER
- Payment terms as per agreed brief
- One short professional thank-you line

Format: clean table layout in markdown. No filler.`}
            </PromptBox>

            <div className="mt-6 space-y-3">
              <Step n={1}>Paste the prompt + brief into Claude</Step>
              <Step n={2}>Copy output → paste into Google Docs</Step>
              <Step n={3}>Fill in your own details (business name, bank details, VAT number)</Step>
              <Step n={4}>Update the invoice number sequentially (INV-001, INV-002, etc.)</Step>
              <Step n={5}>Download as PDF → send</Step>
            </div>
          </Section>

          {/* Step 5: Contract */}
          <Section number="05" title="Generate a Service Contract" subtitle="Plain English, legally sound, UK-ready">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              This generates a complete service agreement in plain English. It covers everything a proper contract needs — payment terms, deliverables, IP ownership, confidentiality, termination — without the legal jargon that makes clients hesitant to sign.
            </p>

            <PromptBox title="Contract Prompt — copy this exactly">
              {`Generate a plain-English service agreement for a UK service business based on this client brief. It should be legally sound but written so a non-lawyer can read and sign it without hesitation.

Here is the client brief:

[PASTE YOUR FULL BRIEF HERE]

Include these sections in this order:

1. Parties
   Who this agreement is between. Pull names/companies from the brief.

2. Services
   Exactly what is being delivered — pull directly from the deliverables in the brief. Be specific.

3. Timeline
   Start date and delivery date from the brief.

4. Payment Terms
   Amount, payment structure (e.g. 50% upfront), due dates, and a late payment clause:
   "Invoices unpaid after 30 days accrue interest at 8% above the Bank of England base rate, as permitted under the Late Payment of Commercial Debts Act 1998."

5. Revisions
   2 rounds of revisions included. Additional revisions charged at [£X/hour — leave as placeholder].

6. Intellectual Property
   Client owns all final deliverables upon receipt of full payment. Supplier retains ownership until full payment is received.

7. Confidentiality
   Both parties agree not to disclose confidential information shared during the project.

8. Limitation of Liability
   Total liability capped at the value of this contract.

9. Termination
   Either party may terminate with 14 days written notice. Work completed to date is billable. Deposits are non-refundable.

10. Governing Law
    This agreement is governed by the laws of England and Wales.

11. Signatures
    Signature line, printed name, date — for both parties.

Tone: professional and clear. No Latin, no legalese, no 200-word sentences.
Format: numbered sections, ready to paste into Google Docs.`}
            </PromptBox>

            <div className="mt-6 space-y-3">
              <Step n={1}>Paste the prompt + brief into Claude</Step>
              <Step n={2}>Copy output → paste into Google Docs</Step>
              <Step n={3}>Add your business details where indicated</Step>
              <Step n={4}>Share the Google Doc with the client → they add their signature → you add yours</Step>
            </div>

            <CalloutBox title="Tip — get signatures faster:">
              <p className="text-gray-600 text-sm leading-relaxed">
                Share the Google Doc with the client and ask them to type their name + date in the signature field. For a legally stronger signature, use <strong>DocuSign</strong> (free for 3 documents/month) or <strong>Signaturely</strong>. Both integrate with Google Docs.
              </p>
            </CalloutBox>
          </Section>

          {/* Step 6: CRM */}
          <Section number="06" title="Update Your CRM in Notion" subtitle="Every deal tracked — without the admin">
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Notion is your CRM. Free, flexible, and it takes 10 minutes to set up. Here&apos;s how to build the database and then auto-populate it from your brief every time.
            </p>

            <p className="text-gray-700 font-semibold text-sm mb-3">Set up your Notion CRM database (do this once):</p>
            <ol className="space-y-3 mb-8">
              <Step n={1}>Open <strong>notion.so</strong> → New page → select <strong>Table</strong></Step>
              <Step n={2}>Name it <strong>Client CRM</strong></Step>
              <Step n={3}>Add these columns: <em>Client Name, Company, Industry, Email, Phone, Status, Source, Service, Value (£), Payment Status, Start Date, Delivery Date, Deliverables, Notes, Follow-up Date, Tags</em></Step>
              <Step n={4}>Set <strong>Status</strong> as a Select field with options: Lead, Proposal Sent, Active, Completed, Lost</Step>
              <Step n={5}>Set <strong>Payment Status</strong> as Select: Deposit Pending, Deposit Paid, Final Invoice Sent, Paid in Full</Step>
            </ol>

            <PromptBox title="CRM Entry Prompt — copy this exactly">
              {`Based on this client brief, generate a structured CRM entry I can paste into Notion.

Here is the client brief:

[PASTE YOUR FULL BRIEF HERE]

Format the output as a clean list of field: value pairs, using exactly these field names:

Client Name:
Company:
Industry:
Email:
Phone:
Status: Active
Source: [how they found us — pull from brief]
Service:
Value: £[agreed price]
Payment Status: [Deposit Pending / Paid in Full — infer from brief context]
Start Date:
Delivery Date:
Deliverables: [bullet list — pull from brief]
Notes: [2–3 sentences — summarise their main pain points, goals, and anything important to remember]
Follow-up Date: [2 weeks after start date]
Tags: [industry], [service type]

Keep it factual. No interpretation beyond what's in the brief. This is a reference document.`}
            </PromptBox>

            <div className="mt-6 space-y-3">
              <Step n={1}>Paste the prompt + brief into Claude</Step>
              <Step n={2}>Copy the output</Step>
              <Step n={3}>Open your Notion CRM → New row → fill in each field from Claude&apos;s output</Step>
              <Step n={4}>Update the Status and Payment Status manually as the project progresses</Step>
            </div>
          </Section>

          {/* Workflow summary */}
          <div className="mb-16 pb-16 border-b border-gray-100">
            <p className="text-gray-700 font-semibold text-base mb-4">Your complete workflow for every new deal:</p>
            <div className="space-y-3">
              <SummaryItem n={1} text="Deal agreed → duplicate _Templates folder → rename it [Client Name — Date]" />
              <SummaryItem n={2} text="Fill in brief.md — 5 minutes while the call is fresh" />
              <SummaryItem n={3} text="Proposal prompt + brief into Claude → paste output into Google Docs → send to client" />
              <SummaryItem n={4} text="Invoice prompt + brief into Claude → add your bank details → send as PDF" />
              <SummaryItem n={5} text="Contract prompt + brief into Claude → share Google Doc → both parties sign" />
              <SummaryItem n={6} text="CRM prompt + brief into Claude → paste fields into Notion → project live" />
            </div>
            <p className="text-teal-600 font-semibold text-sm mt-6">
              One brief. Four documents. Every client, every time.
            </p>
          </div>

          {/* Bonus: Advanced */}
          <div className="mb-16 pb-16 border-b border-gray-100">
            <p className="text-gray-700 font-semibold text-base mb-2">Once you&apos;ve run this 5+ times:</p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              At this point you know what outputs you like and what you&apos;d tweak. Here&apos;s how to make the system even faster:
            </p>
            <div className="space-y-4">
              <AdvancedTip
                title="Save your prompts as Claude Projects"
                detail="In Claude.ai, create a Project called 'Client Documents'. Add all four prompts as instructions. Now you just paste the brief — no copying prompts each time."
              />
              <AdvancedTip
                title="Automate the CRM update with Make"
                detail="Connect Tally (your intake form) to Notion via Make. When a client fills in the intake form, their details appear in your CRM automatically — no Claude prompt needed for the basic fields."
              />
              <AdvancedTip
                title="Use Google Docs templates"
                detail="Once you&apos;ve formatted a proposal and invoice you&apos;re happy with, save them as Google Docs templates. Paste Claude&apos;s output in and the formatting is already done."
              />
              <AdvancedTip
                title="Add an e-signature tool"
                detail="Connect Google Docs to Signaturely or DocuSign. Send the contract link, get a signed PDF back, save it in the client folder. The whole sign-off process takes under 3 minutes."
              />
            </div>
          </div>

          {/* Closing */}
          <div className="mt-4 pt-12 border-t border-gray-100 text-center">
            <p className="text-gray-700 font-semibold text-lg mb-3">
              The folder pays for itself on the first deal.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-10">
              Most service businesses spend 3–5 hours on admin for every new client. Proposal, invoice, contract, CRM — it adds up. This gets it under 30 minutes. Run it for a month and you&apos;ll never go back.
            </p>
            <div className="inline-block bg-gray-50 border border-gray-100 rounded-2xl px-8 py-6">
              <p className="text-gray-500 text-sm mb-3">Want this fully automated and connected for your business?</p>
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

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl px-6 py-5">
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

function AdvancedTip({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border border-gray-100 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <span className="text-teal-500 font-bold text-sm mt-0.5 shrink-0">→</span>
        <div>
          <p className="text-gray-900 font-semibold text-sm mb-1">{title}</p>
          <p className="text-gray-500 text-sm leading-relaxed">{detail}</p>
        </div>
      </div>
    </div>
  )
}
