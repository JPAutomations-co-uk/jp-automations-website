import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Is AI Replacing Tradesmen? No — But It's Replacing Their Admin",
  description: "AI isn't coming for your job. It's coming for the invoicing, the quoting, the follow-ups, and the paperwork you do at 9pm. Here's what that actually means.",
  author: { "@type": "Organization", name: "JP Automations", url: "https://www.jpautomations.co.uk" },
  publisher: { "@type": "Organization", name: "JP Automations", logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" } },
  datePublished: "2026-04-17",
  dateModified: "2026-04-17",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.jpautomations.co.uk/blog/is-ai-replacing-tradesmen" },
  keywords: ["AI replacing tradesmen", "AI for tradespeople", "AI automation trades UK", "will AI replace plumbers", "AI for builders"],
}

export default function Page() {
  return (
    <main className="bg-black text-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="relative max-w-4xl mx-auto px-6 py-24">
        <div className="mb-10">
          <Link href="/blog" className="text-sm text-gray-400 hover:text-teal-400 transition">&larr; Back to all articles</Link>
        </div>

        <header className="mb-12">
          <p className="text-sm text-gray-400 mb-4">Published 17 April 2026</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Is AI Replacing Tradesmen? <span className="text-teal-400">No</span> — But It&apos;s Replacing Their Admin
          </h1>
        </header>

        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            Every few months, another headline pops up: &quot;AI is coming for your job.&quot; If you&apos;re a plumber, electrician, roofer, or builder, you might&apos;ve glanced at one and thought &quot;good luck fitting a boiler, mate.&quot;
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            And you&apos;d be right. No AI is turning up to a customer&apos;s house with a van full of tools, assessing a dodgy fuse board, or laying tiles in a bathroom. That&apos;s your job. That&apos;s safe.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            But here&apos;s the bit most tradespeople haven&apos;t clocked yet: while AI can&apos;t do your trade, it can absolutely do the other half of your day. The invoicing. The quote follow-ups. The review requests. The scheduling. The lead chasing. All the stuff you&apos;re doing at 9pm on the sofa when you should be watching telly.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            That&apos;s what&apos;s actually changing. Not the craft — the admin.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Let&apos;s Address the Fear Head-On</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The fear is understandable. You see AI writing essays, generating images, having conversations that sound human. If it can do all that, why not plumbing?
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Because physical trades require something AI fundamentally cannot do: work in the real world. AI lives in computers. It processes text, images, and data. It cannot physically interact with pipes, wires, bricks, or timber. It can&apos;t assess a situation by feel, by smell, by the sound a boiler makes when something&apos;s not right.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Robots exist, sure. But a robot that can navigate a cramped loft space, identify a fault in a 30-year-old heating system, and fix it — while chatting to the homeowner about where to park — is decades away at minimum. And even then, it would cost more than hiring you.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The trades are one of the most AI-proof career paths in existence. The demand for skilled tradespeople is going up, not down. There are 49,000 fewer plumbers in the UK than a decade ago, and boilers aren&apos;t fixing themselves. Your skills are getting more valuable, not less.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What AI Actually Does for Trades</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Right, so if AI isn&apos;t replacing your craft, what is it actually doing? The boring stuff. The stuff that eats your evenings and weekends. The stuff that isn&apos;t why you got into the trade but somehow takes up half your time.
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Answering calls when you&apos;re on a job</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI phone agents pick up when you can&apos;t, capture the caller&apos;s details, and text you a summary. No more missed leads because you were elbow-deep in pipework. We covered this in detail in our{" "}
                <Link href="/blog/ai-phone-answering-uk-tradespeople" className="text-teal-400 hover:underline">AI phone answering guide</Link>.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Sending invoices automatically</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Job marked as complete? Invoice goes out the same day. No more &quot;I&apos;ll do it tonight&quot; followed by forgetting for a week. Automated{" "}
                <Link href="/blog/automate-quoting-invoicing-uk-trades" className="text-teal-400 hover:underline">quoting and invoicing</Link> means you get paid faster.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Following up on quotes</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                You send a quote. Silence. Most tradespeople never follow up. AI sends a polite nudge after 3 days, another after 7, and a final &quot;is this still something you need?&quot; after 14. Conversion rates double.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Chasing late payments</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Nobody likes chasing money. AI sends payment reminders via SMS and email on a schedule. Polite, persistent, and it never forgets. Our{" "}
                <Link href="/blog/invoice-case-study" className="text-teal-400 hover:underline">invoice automation case study</Link> shows how one roofer recovered £2,995 this way.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Requesting Google reviews</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                After every job, an{" "}
                <Link href="/blog/automate-google-reviews-uk-trades" className="text-teal-400 hover:underline">automated review request</Link> goes out. Customers are most likely to leave a review within 24 hours of job completion. AI catches that window every time.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Booking and scheduling</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI can manage your calendar, suggest available slots to customers, and book jobs without you needing to check your diary. No more double-bookings or forgotten site visits.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What This Looks Like Per Trade</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Every trade has slightly different admin pain points. Here&apos;s what AI handles for each:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <p className="text-white font-semibold mb-2">Plumbers</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Emergency call triage, Gas Safe compliance reminders, boiler service follow-ups, seasonal marketing (autumn heating checks). <Link href="/ai-automation-for-plumbers-uk" className="text-teal-400 hover:underline">Full breakdown &rarr;</Link>
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <p className="text-white font-semibold mb-2">Electricians</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                EICR certificate tracking, test due reminders for commercial clients, quote follow-ups on rewires, NICEIC documentation. <Link href="/ai-automation-for-electricians-uk" className="text-teal-400 hover:underline">Full breakdown &rarr;</Link>
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <p className="text-white font-semibold mb-2">Roofers</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Weather-triggered outreach (storm follow-up), guarantee tracking, annual inspection reminders, invoice automation on larger jobs. <Link href="/ai-automation-for-roofers-uk" className="text-teal-400 hover:underline">Full breakdown &rarr;</Link>
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <p className="text-white font-semibold mb-2">Builders</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Stage-based invoicing, project update messages to clients, subcontractor scheduling, material order reminders, snag list management. <Link href="/ai-automation-for-builders-uk" className="text-teal-400 hover:underline">Full breakdown &rarr;</Link>
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <p className="text-white font-semibold mb-2">Landscapers</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Seasonal service reminders (spring clean-up, autumn maintenance), recurring job scheduling, before/after photo collection for marketing. <Link href="/ai-automation-for-landscapers-uk" className="text-teal-400 hover:underline">Full breakdown &rarr;</Link>
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <p className="text-white font-semibold mb-2">All Trades</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Lead capture, quote generation, follow-ups, invoicing, payment chasing, review requests, email/WhatsApp communication. The admin backbone.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Why the Human Work Stays Human</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            There&apos;s a reason a customer hires you and not the bloke down the road who&apos;s £20 cheaper. Trust. Experience. The fact that you turned up on time, explained what was wrong without talking down to them, and fixed it properly.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            AI cannot replicate any of that. It can&apos;t look at a damp patch and know from experience that it&apos;s not the roof — it&apos;s condensation from a missing vent. It can&apos;t reassure a nervous homeowner that the ceiling crack is cosmetic, not structural. It can&apos;t make a judgement call about whether to patch a repair or replace the whole unit.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            The trade skills — diagnostics, problem-solving, physical work, customer relationships — are deeply human. They require being present, using all your senses, drawing on years of on-the-job experience. That&apos;s not automatable.
          </p>
          <p className="text-gray-400 leading-relaxed">
            What is automatable is everything around that core work. The before and after. The admin wrapper. And honestly? Getting rid of that wrapper is what lets you do more of the work you actually enjoy.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What Actually Changes</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Here&apos;s the shift that&apos;s already happening. The tradespeople who adopt AI for their admin are gaining a genuine competitive advantage:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">They respond faster.</strong> AI captures leads instantly. First to respond wins the job 78% of the time.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">They get paid faster.</strong> Automated invoicing means no more 30-day waits for a payment that should have taken 7.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">They get more reviews.</strong> Consistent review requests build their Google profile and bring in more leads.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">They win more quotes.</strong> Follow-up sequences convert leads that would have ghosted.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">They finish work at 5pm.</strong> No more evening admin sessions. The system handles it.</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed mt-6">
            The trades aren&apos;t being replaced. But the tradespeople who ignore AI for their admin will increasingly lose work to the ones who don&apos;t. Not because they&apos;re worse at the job — but because they&apos;re slower to respond, slower to follow up, and harder to do business with.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Trades AI Won&apos;t Touch</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Just to put this to bed completely, here&apos;s a non-exhaustive list of things AI will never do in the trades:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "Diagnose a fault on site",
              "Navigate a cramped loft or crawl space",
              "Read a customer's body language",
              "Make a judgement call under pressure",
              "Physically install, repair, or build anything",
              "Adapt when nothing goes to plan (which is every job)",
              "Drive between jobs in Birmingham traffic",
              "Have a brew with the customer and earn their trust",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-lg px-4 py-3">
                <span className="text-red-400 text-sm">&#10005;</span>
                <p className="text-gray-400 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 leading-relaxed mt-6">
            Your job is safe. Your 9pm admin sessions? Those are what&apos;s on the chopping block. And good riddance.
          </p>
        </section>

        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            AI isn&apos;t replacing tradesmen. It&apos;s replacing the worst part of being a tradesman — the paperwork, the chasing, the admin that nobody got into the trade to do. The ones who embrace it get their evenings back and grow their business. The ones who ignore it keep doing everything manually and wonder why the competition always seems one step ahead.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Your hands do the work. Let AI do the rest.
          </p>
        </section>

        <section className="mb-20 bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            See what AI can take off your plate
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Book a free audit and I&apos;ll show you exactly which parts of your admin can be automated — and how much time you&apos;ll get back.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-medium rounded-xl hover:bg-teal-300 transition"
          >
            Get Your Free Audit &rarr;
          </Link>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">&larr; Back to Blog</Link>
          <Link href="/blog/essential-business-systems" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: 3 Essential Business Systems &rarr;</Link>
          <Link href="/ai-automation-for-service-businesses" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">AI Automation for Service Businesses &rarr;</Link>
        </div>
      </article>
    </main>
  )
}
