import Link from "next/link"

export default function Page() {
  return (
    <article
      className="max-w-[720px] mx-auto px-5 md:px-[var(--gutter)]"
      style={{ paddingTop: "clamp(100px, 12vw, 160px)", paddingBottom: "var(--section-pad-y)" }}
    >
      <header className="mb-10 md:mb-14">
        <span className="text-[11px] tracking-[.15em] uppercase block mb-4" style={{ fontFamily: "var(--font-body)", color: "var(--accent-primary)" }}>
          AI Tools for Trades
        </span>
        <h1 className="text-[clamp(28px,5vw,48px)] leading-[1] tracking-[-0.02em] uppercase mb-5" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}>
          BEST AI AUTOMATION TOOLS FOR TRADESMEN UK [2026]
        </h1>
        <p className="text-sm leading-[1.8]" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
          There&apos;s a lot of noise in the AI space right now. Every second company is claiming they&apos;ll &ldquo;transform your business with AI.&rdquo; Most of it is rubbish. Here&apos;s what actually works for UK tradespeople in 2026 — and what&apos;s just a chatbot with a marketing budget.
        </p>
      </header>

      <div className="prose-custom" style={{ fontFamily: "var(--font-body)" }}>
        <h2>The Categories That Actually Matter</h2>
        <p>
          Before looking at individual tools, you need to know what&apos;s worth automating. Based on working with roofers, plumbers, electricians, builders, and landscapers across the UK, these are the six areas where AI has proven, measurable ROI:
        </p>
        <ol>
          <li><strong>Call handling</strong> — answering the phone when you can&apos;t</li>
          <li><strong>Invoicing &amp; payment chasing</strong> — getting paid without chasing</li>
          <li><strong>Quote follow-up</strong> — making sure quotes don&apos;t die in inboxes</li>
          <li><strong>Compliance &amp; certificates</strong> — electricians and gas engineers specifically</li>
          <li><strong>Review collection</strong> — building your Google profile automatically</li>
          <li><strong>Job costing</strong> — knowing what a job actually costs you, not what you think it costs</li>
        </ol>
        <p>
          If a tool doesn&apos;t address at least one of these, it&apos;s probably not worth your time.
        </p>

        <h2>Call Handling: AI Answering Services</h2>
        <p>
          This is the single biggest revenue leak for most trades. <Link href="/blog/stop-losing-jobs-missed-calls-trades">UK tradespeople lose an average of £24,000/year from missed calls</Link>. 62% of inbound calls go unanswered. 85% of those callers won&apos;t try again.
        </p>
        <p><strong>What&apos;s available:</strong></p>
        <ul>
          <li><strong>Moneypenny</strong> — human answering service, UK-based. Reliable but expensive (£200-500/month). They&apos;re real people, not AI.</li>
          <li><strong>ARROW (aiphonecalls.co.uk)</strong> — UK-specific AI receptionist for trades. From around £50/month.</li>
          <li><strong>Norango.ai</strong> — AI receptionist with Google Calendar integration. £69.95/month base.</li>
          <li><strong>Fonio.ai</strong> — AI call assistant specifically marketed to tradespeople.</li>
          <li><strong>Custom build</strong> — bespoke AI call handler integrated with your existing diary and CRM. Higher setup cost, but fits your business exactly.</li>
        </ul>
        <p>
          <strong>The verdict:</strong> If you&apos;re a <Link href="/ai-automation-for-plumbers-uk">plumber missing calls during boiler season</Link> or a <Link href="/ai-automation-for-roofers-uk">roofer three storeys up</Link>, this is the first thing to fix. The ROI is immediate — one emergency callout pays for months of the service.
        </p>

        <h2>Invoicing &amp; Payment Chasing</h2>
        <p>
          81% of UK tradespeople are owed money right now. The average outstanding amount is £6,210. The construction industry waits an average of 38 days to get paid — and that&apos;s before you count the ones who never pay at all.
        </p>
        <p><strong>What&apos;s available:</strong></p>
        <ul>
          <li><strong>Xero + Chaser</strong> — accounting software plus automated chasing. Good for basic reminders. Doesn&apos;t understand trade workflows.</li>
          <li><strong>Tradify</strong> — job-to-invoice workflow. Popular with UK trades. Basic follow-up.</li>
          <li><strong>Powered Now</strong> — UK-focused, good for sole traders. Claims to be the &ldquo;UK&apos;s #1 for trades.&rdquo;</li>
          <li><strong>Custom AI pipeline</strong> — invoice fires automatically on job completion, escalating reminders at 7/14/21 days, Late Payment Act notices built in. <Link href="/blog/get-paid-6-days-not-34-roofers">One roofer went from 34-day to 6-day payment times</Link>.</li>
        </ul>
        <p>
          <strong>The verdict:</strong> Off-the-shelf tools handle the basics. But if you want same-day invoicing triggered by job completion with intelligent escalation, you need something custom.
        </p>

        <h2>Quote Follow-Up</h2>
        <p>
          Most tradespeople send a quote and hope. The data says 68% of quotes are never followed up. A single follow-up within 48 hours doubles your conversion rate. Two follow-ups triples it.
        </p>
        <p><strong>What&apos;s available:</strong></p>
        <ul>
          <li><strong>Jobber</strong> — has quote tracking and basic follow-up reminders. Claims to save 7+ hours/week.</li>
          <li><strong>ServiceM8</strong> — quote-to-job workflow with some follow-up. iOS-focused.</li>
          <li><strong>Custom AI follow-up</strong> — <Link href="/blog/automated-follow-up-trades-guide">automated multi-step sequences</Link> at days 3, 7, 14 with different messaging each time. Handles objections via text. You only step in when they&apos;re ready to book.</li>
        </ul>
        <p>
          <strong>The verdict:</strong> Basic CRM tools remind you to follow up. AI systems do the following up for you — including handling common objections like &ldquo;bit expensive&rdquo; or &ldquo;not yet.&rdquo;
        </p>

        <h2>Compliance &amp; Certificates (Electricians &amp; Gas Engineers)</h2>
        <p>
          This one&apos;s specific to <Link href="/ai-automation-for-electricians-uk">electricians</Link> and gas engineers. Every notifiable job needs an EIC or Minor Works Certificate, building control notification, and proper test result documentation. It&apos;s a compliance burden no other trade has to deal with.
        </p>
        <p><strong>What&apos;s available:</strong></p>
        <ul>
          <li><strong>iCertifi</strong> — established digital cert tool. Offline-capable, cloud sync.</li>
          <li><strong>Tradecert</strong> — supports all NICEIC/NAPIT cert types.</li>
          <li><strong>TestFast</strong> — claims 85% time reduction on EICRs. Beta stage.</li>
          <li><strong>Custom AI engine</strong> — OCR reads test results from photos, auto-populates certificate fields, validates against BS 7671, submits to building control. One electrician <Link href="/blog/ai-receptionist-electricians-uk">cut admin from 8 hours to 30 minutes per week</Link>.</li>
        </ul>
        <p>
          <strong>The verdict:</strong> Existing tools are digital form-fillers. None use AI to read your test results, auto-classify observations, or submit notifications automatically. That&apos;s the gap.
        </p>

        <h2>Review Collection</h2>
        <p>
          Google reviews directly impact your local search ranking. Businesses with 9+ recent reviews generate 52% more revenue than average. A one-star increase boosts revenue 5-9%. Yet most tradespeople ask for reviews occasionally or never.
        </p>
        <p><strong>What&apos;s available:</strong></p>
        <ul>
          <li><strong>NiceJob / Birdeye / Podium</strong> — review automation platforms. Expensive for sole traders (£100-300/month).</li>
          <li><strong>Jobber</strong> — has a basic review request feature built in.</li>
          <li><strong>Custom automation</strong> — review request SMS sent automatically 24 hours after job completion with a one-tap Google link. Follow-up if no review in 5 days. Costs almost nothing to run.</li>
        </ul>
        <p>
          <strong>The verdict:</strong> You don&apos;t need expensive review software. A simple automated SMS after every job does 90% of the work.
        </p>

        <h2>Job Costing (Builders &amp; Contractors)</h2>
        <p>
          Average UK construction net margin: 2-4%. 69% of projects exceed their budget. If you don&apos;t know what a job is costing you in real time, you&apos;re guessing — and the guess is usually wrong.
        </p>
        <p><strong>What&apos;s available:</strong></p>
        <ul>
          <li><strong>Tradify / Fergus</strong> — basic job costing within job management. Manual input.</li>
          <li><strong>Procore</strong> — enterprise-grade. £15-50k implementation. Overkill for small builders.</li>
          <li><strong>Custom AI costing</strong> — <Link href="/ai-automation-for-builders-uk">live dashboard tracking labour, materials, and margin</Link> in real time. Weekly P&L per job. Budget alerts before you&apos;ve blown the margin. One builder&apos;s margins went from 8% to 16%.</li>
        </ul>

        <h2>When to Go Custom vs Off-the-Shelf</h2>
        <p>
          <strong>Off-the-shelf works when:</strong> You have one clear problem (just invoicing, just scheduling), you&apos;re a sole trader with simple workflows, and you&apos;re happy learning new software.
        </p>
        <p>
          <strong>Custom works when:</strong> Your problems are connected (invoicing is late because quoting is slow because you&apos;re missing calls because you&apos;re doing admin at 9pm), you have a team of 2+, and you want systems that fit around how you already work — not the other way round.
        </p>
        <p>
          Most trades businesses I work with have tried Tradify or Jobber and found it solves 40% of the problem. The other 60% — the call handling, the follow-up, the compliance, the stuff that eats your evenings — needs something built around your specific business.
        </p>

        <h2>The Bottom Line</h2>
        <p>
          The best AI tool for your business depends entirely on what&apos;s actually costing you the most. For a plumber, it&apos;s probably missed calls. For an electrician, it&apos;s compliance admin. For a builder, it&apos;s margin visibility. For a landscaper, it&apos;s the winter revenue crash.
        </p>
        <p>
          If you&apos;re not sure where to start, <Link href="/audit">book a free 15-minute audit</Link>. I&apos;ll look at how your business runs and tell you exactly which problem to fix first — and whether off-the-shelf or custom is the right call for you.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-14 md:mt-20 p-6 md:p-10 border border-[var(--border)] text-center" style={{ borderRadius: 2, background: "var(--bg-card)" }}>
        <h3 className="text-[clamp(20px,3vw,32px)] uppercase mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text-primary)" }}>
          NOT SURE WHERE TO START?
        </h3>
        <p className="text-[13px] leading-[1.75] max-w-[400px] mx-auto mb-6" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,.5)" }}>
          15 minutes. I&apos;ll tell you which problem to fix first and whether you need custom or off-the-shelf.
        </p>
        <Link href="/audit" className="btn-primary text-[13px] px-8 py-4">
          GET YOUR FREE AUDIT →
        </Link>
      </div>
    </article>
  )
}
