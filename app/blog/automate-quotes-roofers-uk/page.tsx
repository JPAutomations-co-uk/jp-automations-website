"use client"

import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How a Roofer Automated Quotes and Saved 12 Hours a Week",
  description:
    "A Birmingham roofer was spending 12 hours a week on quoting and follow-ups. Here's how he automated the entire process and won more jobs.",
  author: { "@type": "Organization", name: "JP Automations", url: "https://www.jpautomations.co.uk" },
  publisher: { "@type": "Organization", name: "JP Automations", logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" } },
  datePublished: "2026-04-10",
  dateModified: "2026-04-10",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.jpautomations.co.uk/blog/automate-quotes-roofers-uk" },
  keywords: ["automate quotes roofers UK", "roofing quote automation", "automated quoting trades UK", "roofer automation case study"],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can roofers automate their quoting process?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. While complex bespoke quotes still need your expertise, the process around quoting — generating the document, sending it, following up, chasing decisions — can be almost entirely automated. Most roofers save 8-15 hours per week on quote admin alone." },
    },
    {
      "@type": "Question",
      name: "How does automated quoting work for roofing companies?",
      acceptedAnswer: { "@type": "Answer", text: "After a site visit, you enter the job details (measurements, materials, scope) into a simple form. The system generates a professional PDF quote, sends it to the customer via email and WhatsApp, and triggers automated follow-ups at 2 days, 5 days, and 10 days if no response. You focus on the work, the system handles the paperwork." },
    },
    {
      "@type": "Question",
      name: "Does automating quotes actually help win more jobs?",
      acceptedAnswer: { "@type": "Answer", text: "In this case study, the roofer's conversion rate went from 35% to 52% — primarily because quotes were sent same-day instead of days later, and automated follow-ups caught leads that would have gone cold. Faster quotes and consistent follow-up directly translate to more booked jobs." },
    },
  ],
}

export default function Page() {
  return (
    <main className="bg-black text-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="relative max-w-4xl mx-auto px-6 py-24">
        <div className="mb-10">
          <Link href="/blog" className="text-sm text-gray-400 hover:text-teal-400 transition">&larr; Back to all articles</Link>
        </div>

        <header className="mb-12">
          <p className="text-sm text-gray-400 mb-4">Published 10 April 2026</p>
          <p className="text-teal-400 text-sm font-medium tracking-wide uppercase mb-4">
            Case Study — Roofing Contractor, Birmingham
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            How a Roofer <span className="text-teal-400">Automated Quotes</span> and Saved 12 Hours a Week
          </h1>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
          {[
            { value: "12hrs", label: "Saved per week" },
            { value: "35→52%", label: "Conversion rate" },
            { value: "Same day", label: "Quote turnaround" },
            { value: "£0", label: "New tools needed" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-2xl md:text-3xl font-bold text-teal-400">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <section className="mb-16">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">The Background</h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Dan runs a roofing company in Birmingham. Three-man team, been going seven years. Good reputation, steady work, 4.8 stars on Google. The kind of business that should be running itself by now.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            It wasn&apos;t. Because every evening, after a full day on the tools, Dan was sitting at his kitchen table for two to three hours doing quotes. Measuring up from his notes, working out materials, typing up quote documents in Word, emailing them out, then trying to remember to follow up three days later.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            Twelve hours a week, minimum. On admin that earned him nothing directly.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">The Problem</h2>
          <p className="text-2xl md:text-3xl font-medium leading-snug mb-8">
            Good at roofing. Drowning in paperwork.<br />
            <span className="text-gray-500">And losing jobs because of it.</span>
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">&#10005;</span>
              <p className="text-gray-400 text-sm"><strong className="text-white">Quotes took 2-3 days to send.</strong> Dan would do a site visit on Monday, but the quote wouldn&apos;t go out until Wednesday or Thursday. By then, the customer had received quotes from two other roofers.</p>
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">&#10005;</span>
              <p className="text-gray-400 text-sm"><strong className="text-white">Follow-ups didn&apos;t happen.</strong> He&apos;d send a quote and then forget to follow up. Or he&apos;d mean to follow up on Friday and then a job would overrun. At least 30% of his quotes got zero follow-up.</p>
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">&#10005;</span>
              <p className="text-gray-400 text-sm"><strong className="text-white">Every quote was built from scratch.</strong> Different format each time. No templates. Copying and pasting from old quotes, changing numbers, hoping he hadn&apos;t left in the wrong customer name.</p>
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">&#10005;</span>
              <p className="text-gray-400 text-sm"><strong className="text-white">No idea what was outstanding.</strong> How many quotes were waiting for a response? Which ones needed chasing? No clue. Everything was in his head or scattered across email threads.</p>
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">&#10005;</span>
              <p className="text-gray-400 text-sm"><strong className="text-white">12 hours a week on admin.</strong> That&apos;s a day and a half. Every week. Time he could have spent on a paid job, or better yet, at home with his family.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">The Constraint</h2>
          <p className="text-2xl md:text-3xl font-medium leading-snug mb-6">
            Dan didn&apos;t need a new CRM.<br />
            <span className="text-gray-500">He needed less admin, not more software.</span>
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            He&apos;d tried a couple of quoting tools before. They all had the same problem: they added another thing to learn, another app to check, another dashboard to log into. Within a month he was back to Word documents.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The solution had to work around how Dan already worked. No new tools. No behaviour change. No dashboards. Just: do the site visit, enter the numbers, and the system handles the rest.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">What We Built</h2>
          <p className="text-2xl md:text-3xl font-medium leading-snug mb-8">
            A quoting system that runs itself.<br />
            <span className="text-gray-500">Built on top of tools he already used.</span>
          </p>
          <div className="space-y-4 mb-6">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 1: Site visit form</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                After a site visit, Dan fills in a simple form on his phone. Takes 3 minutes. Job type, measurements, materials needed, any special requirements, customer details. That&apos;s it. He does it in the van before driving to the next job.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 2: Quote generated automatically</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The system takes his inputs, calculates material costs from his price list, adds labour, applies his markup, and generates a professional branded PDF quote. Same format every time. No copying and pasting. No wrong customer names. Done in seconds.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 3: Sent same day</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The quote is emailed to the customer and sent via WhatsApp within minutes of Dan submitting the form. Same-day turnaround, every time. No more waiting until he &quot;gets round to it&quot; in the evening.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 4: Automated follow-ups</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                If the customer hasn&apos;t responded after 2 days, they get a friendly follow-up: &quot;Hi Sarah, just checking you received the quote for the ridge tiles. Happy to chat if you&apos;ve got any questions.&quot; Another at 5 days. Final one at 10 days. All personalised, all automated.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 5: Pipeline tracking</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every quote sits in a simple pipeline: Sent → Followed Up → Accepted/Declined. Dan can glance at it and see exactly what&apos;s outstanding, what&apos;s been won, and what&apos;s gone cold. No more guessing.
              </p>
            </div>
          </div>
          <p className="text-white font-medium">
            Total time Dan spends on quoting now: about 15 minutes per quote. Down from 45-60 minutes.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">The Results</h2>
          <p className="text-2xl md:text-3xl font-medium leading-snug mb-8">
            Same business. Same team.<br />
            <span className="text-gray-500">Completely different numbers.</span>
          </p>
          <div className="grid md:grid-cols-2 gap-3 mb-6">
            {[
              "12 hours per week saved on quote admin",
              "Quotes sent same day (previously 2-3 days)",
              "Conversion rate: 35% → 52%",
              "Zero quotes missed for follow-up",
              "Full visibility on pipeline at all times",
              "Evenings back with the family",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-teal-400/5 border border-teal-400/10 rounded-lg px-4 py-3">
                <span className="text-teal-400 text-sm">&#10003;</span>
                <p className="text-white text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
          <div className="bg-teal-400/5 border border-teal-400/20 rounded-xl p-6">
            <p className="text-teal-400 font-bold text-lg mb-2">The big one: 35% → 52% conversion rate.</p>
            <p className="text-gray-400 text-sm">That&apos;s not because the quotes were cheaper or the work was better. It&apos;s because the quotes arrived faster and the follow-ups actually happened. Speed and persistence win jobs. Always have, always will.</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Faster Quotes Win More Jobs</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Here&apos;s the psychology. When a homeowner gets three quotes, they almost always go with the first one that arrives — unless there&apos;s a big price difference. Why?
          </p>
          <div className="space-y-2 mb-6">
            {[
              "First quote sets the anchor — everything else is compared to it",
              "Speed signals professionalism. If you're fast on the quote, you'll be fast on the job",
              "Customers want the decision made. The longer they wait, the more anxious they get",
              "By the time the third quote arrives, they've often already booked someone",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-teal-400">&#8594;</span>
                <p className="text-gray-400 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 leading-relaxed">
            Dan went from sending quotes 2-3 days late (dead last in the race) to same-day delivery (usually first). That alone explains most of the conversion rate jump.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Follow-Up Effect</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The other half of the improvement came from follow-ups. Before automation, Dan followed up on maybe 70% of quotes. The other 30% just... disappeared. He&apos;d forget, or he&apos;d assume they&apos;d gone elsewhere.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            With automated follow-ups, 100% of quotes get chased. And the results speak for themselves:
          </p>
          <div className="space-y-2 mb-6">
            {[
              "22% of accepted quotes came after the first follow-up (day 2)",
              "11% came after the second follow-up (day 5)",
              "4% came after the third follow-up (day 10)",
              "That's 37% of won jobs that would have been lost without follow-up",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-teal-400">&#10003;</span>
                <p className="text-gray-400 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 leading-relaxed">
            More than a third of Dan&apos;s booked jobs now come from{" "}
            <Link href="/blog/automate-client-follow-up-uk-service-businesses" className="text-teal-400 hover:underline">automated follow-ups</Link>{" "}
            — messages he never has to write or remember to send. They just happen.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What Other Roofers Can Learn From This</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Dan&apos;s situation isn&apos;t unique. Every roofer in the country deals with the same quoting headache. Here&apos;s what it comes down to:
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Speed wins jobs</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The roofer who quotes first almost always wins. Same-day quoting isn&apos;t a luxury — it&apos;s a competitive advantage. If your quotes take 3 days and your competitor&apos;s take 3 hours, you&apos;re losing before you&apos;ve even started.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Follow-up is where money hides</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                A third of Dan&apos;s jobs come from follow-ups. If you&apos;re not following up on every quote, you&apos;re leaving a third of your potential revenue on the table. Automation makes it happen without you lifting a finger.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Time is the real win</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                12 hours a week is 624 hours a year. That&apos;s 78 working days. Dan got his evenings back. He sees his kids before bedtime again. The money is great, but the time? That&apos;s the real win.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">You don&apos;t need to change how you work</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Dan didn&apos;t learn a new CRM. He didn&apos;t change his process. He fills in a 3-minute form after a site visit — that&apos;s the only difference. Everything else is automated around him. If the system requires a behaviour change, it won&apos;t stick.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Can this work for other trades, not just roofing?</p>
              <p className="text-gray-400 text-sm leading-relaxed">Absolutely. The same system works for any trade that quotes regularly —{" "}
                <Link href="/ai-automation-for-electricians-uk" className="text-teal-400 hover:underline">electricians</Link>,{" "}
                <Link href="/ai-automation-for-plumbers-uk" className="text-teal-400 hover:underline">plumbers</Link>,{" "}
                <Link href="/ai-automation-for-builders-uk" className="text-teal-400 hover:underline">builders</Link>,{" "}
                <Link href="/ai-automation-for-landscapers-uk" className="text-teal-400 hover:underline">landscapers</Link>. The quoting template changes, the automation doesn&apos;t.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">How long does it take to set up?</p>
              <p className="text-gray-400 text-sm leading-relaxed">Typically 1-2 weeks from start to finish. That includes building your quote templates, setting up the automation, and training you on the 3-minute form. After that, it runs itself.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">What if my quotes are complex and vary a lot?</p>
              <p className="text-gray-400 text-sm leading-relaxed">The system handles line items, optional extras, and different job types. For truly bespoke quotes, you can still customise the generated document before it goes out. But 80% of quotes follow the same structure — and that 80% is what gets automated.</p>
            </div>
          </div>
        </section>

        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-xl font-bold mb-3">Who This Is For</h2>
          <p className="text-gray-400">
            Roofers and trade businesses doing 10+ quotes per month who are sick of spending evenings on paperwork. If you&apos;re good at the work but the admin is killing you, this is what we built for Dan — and we can build it for you.
          </p>
        </section>

        <section className="mb-20 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8 text-center">
          <p className="text-white font-semibold text-lg mb-2">Want this for your roofing business?</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            Book a free systems audit. I&apos;ll show you where your time is going and how to get it back. Same approach, tailored to your business.
          </p>
          <Link href="/audit" className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition">Book a Free Audit &rarr;</Link>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">&larr; Back to Blog</Link>
          <Link href="/ai-automation-for-roofers-uk" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">AI Automation for Roofers &rarr;</Link>
          <Link href="/blog/invoice-case-study" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: Invoice Automation Case Study &rarr;</Link>
          <Link href="/blog/automate-quoting-invoicing-uk-trades" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: Automate Quoting &amp; Invoicing &rarr;</Link>
        </div>
      </article>
    </main>
  )
}
