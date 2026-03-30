"use client"

import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Stop Losing Jobs When You're on the Tools",
  description:
    "UK tradespeople lose £24,000/year from missed calls. Here's how to make sure every enquiry gets handled — even when you can't pick up.",
  author: { "@type": "Organization", name: "JP Automations", url: "https://www.jpautomations.co.uk" },
  publisher: { "@type": "Organization", name: "JP Automations", logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" } },
  datePublished: "2026-03-28",
  dateModified: "2026-03-28",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.jpautomations.co.uk/blog/stop-losing-jobs-missed-calls-trades" },
  keywords: ["missed calls tradesmen UK", "losing jobs missed calls", "tradesman missed calls", "stop losing leads UK trades"],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many calls do UK tradespeople miss per week?",
      acceptedAnswer: { "@type": "Answer", text: "Research shows UK tradespeople miss 40-62% of inbound calls. For a busy tradesperson, that's 5-10 missed calls per week — each one a potential job worth £200-2,000+." },
    },
    {
      "@type": "Question",
      name: "How much money do tradespeople lose from missed calls?",
      acceptedAnswer: { "@type": "Answer", text: "With an average job value of £400-500 and 5+ missed calls per week, most tradespeople lose around £24,000 per year in revenue from calls they never answered. Some lose significantly more." },
    },
    {
      "@type": "Question",
      name: "What's better than an answering service for tradespeople?",
      acceptedAnswer: { "@type": "Answer", text: "AI phone answering handles calls instantly (no hold music), qualifies the job, captures all details, and can book appointments directly into your diary. It costs a fraction of a human answering service and works 24/7." },
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
          <p className="text-sm text-gray-400 mb-4">Published 28 March 2026</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            How to Stop <span className="text-teal-400">Losing Jobs</span> When You&apos;re on the Tools
          </h1>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
          {[
            { value: "62%", label: "Calls unanswered" },
            { value: "85%", label: "Won't call back" },
            { value: "£24k", label: "Lost per year" },
            { value: "5-10", label: "Missed calls/week" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-2xl md:text-3xl font-bold text-teal-400">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            Here&apos;s something that&apos;ll wind you up. Right now, while you&apos;re reading this, there&apos;s a homeowner somewhere in your area trying to ring a tradesperson. They&apos;ve got a job that needs doing. They&apos;ve found three options on Google. They call the first one.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            No answer. Bloke&apos;s up a ladder. Second one — voicemail. Third one picks up, takes the details, books a site visit. Job done.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            That third tradesperson didn&apos;t get the work because they were better. They got it because they answered the phone. And this isn&apos;t a one-off. It&apos;s happening every single day across every trade in the UK.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Numbers Are Brutal</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Let&apos;s not sugarcoat this. The data on missed calls in the trades is genuinely grim:
          </p>
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">&#10005;</span>
              <p className="text-gray-400 text-sm"><strong className="text-white">62% of calls to small trade businesses go unanswered.</strong> That&apos;s not a typo. Nearly two-thirds of people who ring you don&apos;t get through.</p>
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">&#10005;</span>
              <p className="text-gray-400 text-sm"><strong className="text-white">85% of callers who reach voicemail won&apos;t call back.</strong> They&apos;re not waiting around. They&apos;re already dialling the next number on the list.</p>
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">&#10005;</span>
              <p className="text-gray-400 text-sm"><strong className="text-white">The average UK tradesperson loses roughly £24,000 per year</strong> from missed calls alone. That&apos;s based on an average job value of £400-500 and just one missed call per day.</p>
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">&#10005;</span>
              <p className="text-gray-400 text-sm"><strong className="text-white">78% of customers hire the first business that responds.</strong> Speed isn&apos;t just a nice-to-have. It&apos;s the entire game.</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Think about that for a second. You&apos;re spending money on your van signage, your website, your Checkatrade profile, maybe even Google Ads — and then when someone actually picks up the phone, you can&apos;t answer because you&apos;re fitting a boiler or rewiring a kitchen.
          </p>
          <p className="text-gray-400 leading-relaxed mt-4">
            It&apos;s not your fault. You can&apos;t stop mid-job to answer the phone. But the result is the same: the lead goes to someone else.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Why &quot;I&apos;ll Call Them Back Later&quot; Doesn&apos;t Work</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Every tradesperson has the same plan: &quot;I&apos;ll check my missed calls at lunch and ring them back.&quot; Sounds reasonable. But here&apos;s what actually happens:
          </p>
          <div className="space-y-2 mb-6">
            {[
              "You finish the job at 4pm, knackered, and the last thing you want to do is make calls",
              "By the time you ring back, they've already booked someone else",
              "You forget half the missed calls because you were juggling three things at once",
              "The ones you do call back don't answer — now you're playing phone tag",
              "Weekend enquiries sit until Monday, by which point the job's gone",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-red-400">&#8594;</span>
                <p className="text-gray-400 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 leading-relaxed">
            The window for responding to a lead is tiny. Research from Harvard Business Review found that businesses who respond within five minutes are <strong className="text-white">21 times more likely</strong> to qualify the lead than those who wait 30 minutes. After an hour? Basically zero chance.
          </p>
          <p className="text-gray-400 leading-relaxed mt-4">
            And you&apos;re on a roof for eight hours. Five minutes isn&apos;t happening.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Solutions (And Why Most of Them Are Rubbish)</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Let&apos;s go through the options tradespeople typically try:
          </p>

          <div className="space-y-6">
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white font-semibold mb-2">Get the missus to answer</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The classic. Works for a bit, until she&apos;s got her own stuff to do. Not scalable, causes arguments, and she probably doesn&apos;t know the difference between a consumer unit upgrade and a rewire. Fair play to her, why would she?
              </p>
            </div>
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white font-semibold mb-2">Hire a receptionist</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                At £20-25k per year, this only makes sense if you&apos;re turning over serious money. And they still only work 9-5, Monday to Friday. Evenings and weekends — when a lot of homeowners actually ring — go unanswered.
              </p>
            </div>
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white font-semibold mb-2">Use an answering service</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Better than voicemail. But the person answering doesn&apos;t know your business, can&apos;t qualify the job, puts callers on hold while they read a script, and charges £1-2 per call. They take a message. That&apos;s it. You still have to call back.
              </p>
            </div>
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white font-semibold mb-2">Set up a fancy voicemail</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Remember what we said? 85% of people won&apos;t leave a voicemail. Doesn&apos;t matter how professional your greeting sounds. People want to speak to someone, not a machine.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What Actually Works</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            The answer is embarrassingly obvious once you see it: <strong className="text-white">something needs to answer the phone that isn&apos;t you, but acts like you.</strong>
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            That&apos;s what an{" "}
            <Link href="/blog/ai-phone-answering-uk-tradespeople" className="text-teal-400 hover:underline">AI phone agent</Link>{" "}
            does. When you can&apos;t pick up, the call forwards to an AI that:
          </p>
          <div className="space-y-2 mb-6">
            {[
              "Answers in your business name within two rings",
              "Has a natural conversation — not a robotic script",
              "Asks what the caller needs and captures all the details",
              "Qualifies the job (is it the right type of work? Right area?)",
              "Books a callback or appointment directly into your diary",
              "Sends you an SMS with the full summary instantly",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-teal-400">&#10003;</span>
                <p className="text-gray-400 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 leading-relaxed">
            The caller gets a proper response. You get the lead. Nobody falls through the cracks.
          </p>
          <p className="text-gray-400 leading-relaxed mt-4">
            And it costs a fraction of an answering service — typically £50-150 per month for a trade business. Compare that to the £24k you&apos;re losing from missed calls and the maths is a no-brainer.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">But It&apos;s Not Just About the Phone</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Phone calls are the biggest leak, but they&apos;re not the only one. Leads also slip through via:
          </p>
          <div className="space-y-2 mb-6">
            {[
              "Website enquiries that sit in your email for days",
              "WhatsApp messages you forget to reply to",
              "Checkatrade and MyBuilder leads that go cold because you didn't respond fast enough",
              "Facebook messages from people who saw your page",
              "Google Business Profile messages nobody checks",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-red-400">&#8594;</span>
                <p className="text-gray-400 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 leading-relaxed">
            The real fix isn&apos;t just answering the phone. It&apos;s building a system where <strong className="text-white">every enquiry, from every channel, gets a response within minutes</strong> — whether you&apos;re available or not. That&apos;s what{" "}
            <Link href="/ai-automation-for-service-businesses" className="text-teal-400 hover:underline">automation for service businesses</Link>{" "}
            actually means. Not replacing you. Just catching the stuff you physically can&apos;t get to.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Full Picture: What a Proper System Looks Like</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Here&apos;s what it looks like when it all works together:
          </p>
          <div className="space-y-2 mb-6">
            {[
              "Phone call comes in → AI answers, captures details, books callback",
              "Website form submitted → instant SMS acknowledgment + lead added to your pipeline",
              "WhatsApp message received → automated response within seconds",
              "Checkatrade lead arrives → instant personalised reply sent",
              "All leads feed into one central pipeline — nothing gets lost",
              "Automated follow-up if you haven't responded within an hour",
              "After the job: automated review request sent to the customer",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-teal-400">&#8594;</span>
                <p className="text-gray-400 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 leading-relaxed">
            You don&apos;t need to change how you work. You don&apos;t need to learn new software. The system works around you — you just focus on doing the job.
          </p>
          <p className="text-gray-400 leading-relaxed mt-4">
            Whether you&apos;re a{" "}
            <Link href="/ai-automation-for-roofers-uk" className="text-teal-400 hover:underline">roofer</Link>,{" "}
            <Link href="/ai-automation-for-electricians-uk" className="text-teal-400 hover:underline">electrician</Link>,{" "}
            <Link href="/ai-automation-for-plumbers-uk" className="text-teal-400 hover:underline">plumber</Link>, or{" "}
            <Link href="/ai-automation-for-builders-uk" className="text-teal-400 hover:underline">builder</Link>{" "}
            — the problem is the same and the solution is the same. Stop relying on yourself to catch every lead. Build a system that does it for you.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">How many calls do UK tradespeople actually miss?</p>
              <p className="text-gray-400 text-sm leading-relaxed">Research shows 40-62% of inbound calls go unanswered. For a busy tradesperson getting 10+ calls a day, that&apos;s 5-6 missed opportunities every single day.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">How much does it cost to set up?</p>
              <p className="text-gray-400 text-sm leading-relaxed">AI phone answering typically runs £50-150 per month. Compared to the £24k+ you&apos;re losing from missed calls, it pays for itself within the first week.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Will customers know it&apos;s AI?</p>
              <p className="text-gray-400 text-sm leading-relaxed">Modern AI voice agents sound natural. Most callers won&apos;t notice. And honestly? They&apos;d rather speak to an AI that captures their details than leave a voicemail that never gets returned.</p>
            </div>
          </div>
        </section>

        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            You&apos;re good at your trade. You don&apos;t need to be good at answering the phone too. Every missed call is money walking out the door to your competitor. The fix isn&apos;t working harder or checking your phone more — it&apos;s putting a system in place that handles it for you.
          </p>
          <p className="text-gray-400 leading-relaxed">
            £24,000 a year. That&apos;s a van. That&apos;s a holiday. That&apos;s a deposit. Don&apos;t leave it on the table.
          </p>
        </section>

        <section className="mb-20 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8 text-center">
          <p className="text-white font-semibold text-lg mb-2">Find out where your leads are leaking</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            Book a free systems audit. I&apos;ll show you exactly how many leads you&apos;re losing and what it would take to fix it. No sales pitch, just straight answers.
          </p>
          <Link href="/audit" className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition">Book a Free Audit &rarr;</Link>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">&larr; Back to Blog</Link>
          <Link href="/blog/ai-phone-answering-uk-tradespeople" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: AI Phone Answering for Trades &rarr;</Link>
          <Link href="/blog/automate-checkatrade-leads" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: Automate Checkatrade Leads &rarr;</Link>
        </div>
      </article>
    </main>
  )
}
