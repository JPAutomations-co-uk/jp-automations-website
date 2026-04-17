"use client"

import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "AI Receptionist for Electricians: How It Works, What It Costs",
  description:
    "An AI receptionist answers every call, qualifies the job, and books it into your diary. Here's how it works for UK electricians and what it actually costs.",
  author: { "@type": "Person", name: "JP", url: "https://www.jpautomations.co.uk", sameAs: "https://www.linkedin.com/in/james-harvey-0583b2370/" },
  publisher: { "@type": "Organization", name: "JP Automations", logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" } },
  datePublished: "2026-04-07",
  dateModified: "2026-04-07",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.jpautomations.co.uk/blog/ai-receptionist-electricians-uk" },
  keywords: ["AI receptionist electricians UK", "AI phone answering electricians", "virtual receptionist electrician", "automated call handling electricians"],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does an AI receptionist cost for an electrician?",
      acceptedAnswer: { "@type": "Answer", text: "Most AI receptionist services cost £50-150 per month for a typical electrical business, including per-minute call charges. Compare this to a human answering service at £200-400/month or a full-time receptionist at £20-25k per year." },
    },
    {
      "@type": "Question",
      name: "Can an AI receptionist handle emergency electrical calls?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The AI can be programmed to detect emergency keywords (burning smell, sparking, no power, water near electrics) and immediately escalate — calling you directly, sending an urgent SMS, or routing to an on-call number. Non-urgent calls get standard handling." },
    },
    {
      "@type": "Question",
      name: "Does an AI receptionist know about electrical regulations?",
      acceptedAnswer: { "@type": "Answer", text: "The AI can be trained on your specific services and basic trade knowledge. It won't give electrical advice, but it can ask the right questions: Is it a domestic or commercial property? Do you need an EICR? Is it a new installation or a repair? This qualifies the job properly before you call back." },
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
          <p className="text-sm text-gray-400 mb-4">Published 7 April 2026</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-teal-400">AI Receptionist</span> for Electricians: How It Works, What It Costs
          </h1>
        </header>

        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            You&apos;re halfway through a consumer unit upgrade. Both hands are occupied. Your phone rings. It&apos;s a potential customer with a rewire job — worth £3,000 to you. You can&apos;t answer. They call the next electrician on Google. That one picks up. Job gone.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            This is happening to electricians across the UK, every single day. You can&apos;t stop mid-job to answer calls — especially when you&apos;re working with electrics. So you either lose the work or you pay someone to answer for you.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            An AI receptionist is the third option. It answers every call, has a proper conversation, captures what the caller needs, qualifies the job, and books it into your diary. All while you&apos;re focused on the job in front of you.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            Here&apos;s exactly how it works and what it costs.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What an AI Receptionist Actually Does</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            It&apos;s not a voicemail. It&apos;s not a call centre reading from a script. It&apos;s an AI voice agent that answers your phone and handles the call like a competent receptionist would — just one that works 24/7 and never calls in sick.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Here&apos;s what a typical call sounds like:
          </p>
          <div className="border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-gray-400 text-sm leading-relaxed">
              <strong className="text-white">AI:</strong> &quot;Hi, thanks for calling Cooper Electrical. I&apos;m the virtual assistant. How can I help?&quot;<br /><br />
              <strong className="text-white">Caller:</strong> &quot;Yeah, I need someone to come and have a look at my fuse board. It keeps tripping.&quot;<br /><br />
              <strong className="text-white">AI:</strong> &quot;No problem. Is it tripping on one specific circuit or the whole board?&quot;<br /><br />
              <strong className="text-white">Caller:</strong> &quot;Just the one for the kitchen.&quot;<br /><br />
              <strong className="text-white">AI:</strong> &quot;Got it. I can get someone to call you back today to arrange a visit. Can I take your name and the best number to reach you? And what&apos;s the postcode for the property?&quot;<br /><br />
              <strong className="text-white">Caller:</strong> &quot;It&apos;s Mike, 07700 900456. Postcode is B15 2TT.&quot;<br /><br />
              <strong className="text-white">AI:</strong> &quot;Perfect, Mike. I&apos;ll pass this to the team and someone will call you back within the hour. Is there anything else I can help with?&quot;
            </p>
          </div>
          <p className="text-gray-400 leading-relaxed">
            You get an SMS within seconds: &quot;New lead — Mike, 07700 900456, B15 2TT, kitchen circuit tripping on fuse board. Wants a visit.&quot; When you&apos;re off the job, you call Mike back. Lead captured. No lead lost.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works, Step by Step</h2>
          <div className="space-y-4 mb-6">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">1. Call forwarding kicks in</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                When you don&apos;t answer within 3-4 rings, your phone automatically forwards to the AI. This uses standard call forwarding built into every phone — no apps, no special equipment. You set it once and forget about it.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">2. AI answers in your business name</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                &quot;Thanks for calling Cooper Electrical&quot; — not a generic greeting. The AI uses your business name, follows your script, and sounds natural. Modern AI voices handle accents, background noise, and conversational detours without breaking.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">3. Qualifying questions</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The AI asks the right questions for an electrical business: What&apos;s the issue? Domestic or commercial? Is it a new installation, repair, or inspection? What&apos;s the postcode? This means when you call back, you already know exactly what the job is and whether it&apos;s worth your time.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">4. Emergency detection</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                This is critical for electricians. If the caller mentions a burning smell, sparking, exposed wires, or water near electrics, the AI flags it as urgent and escalates immediately — ringing your mobile, sending an urgent SMS, or routing to your emergency number. Non-emergencies get standard handling.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">5. Booking or callback</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Depending on your setup, the AI either books a site visit directly into your calendar (&quot;I can see we have Friday afternoon available — would 2pm work?&quot;) or promises a callback and sends you the details. Either way, the lead is captured and the customer feels looked after.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">6. Summary sent to you</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Instant SMS or email with everything: name, number, postcode, job description, urgency level, and any appointment booked. You review it when you&apos;re ready. No scrambling, no forgotten details.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What It Costs (The Honest Breakdown)</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Let&apos;s compare the three options properly:
          </p>
          <div className="space-y-4 mb-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-semibold">Full-time receptionist</p>
                <p className="text-red-400 font-bold">£20-25k/year</p>
              </div>
              <p className="text-gray-400 text-sm">Works 9-5, Mon-Fri. No evenings, no weekends. Takes holidays. Calls in sick. Needs training. Good option if you&apos;re turning over £250k+ and need someone in the office full-time.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-semibold">Human answering service</p>
                <p className="text-yellow-400 font-bold">£200-400/month</p>
              </div>
              <p className="text-gray-400 text-sm">Call centre staff read a script. Callers often wait on hold. Limited qualification — they take a message, that&apos;s it. Per-call charges add up. No trade knowledge.</p>
            </div>
            <div className="bg-teal-400/5 border border-teal-400/20 rounded-xl p-5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-teal-400 font-semibold">AI receptionist</p>
                <p className="text-teal-400 font-bold">£50-150/month</p>
              </div>
              <p className="text-gray-400 text-sm">Answers instantly, 24/7. Qualifies the job. Handles emergencies. Books appointments. Sends you summaries. No hold music, no scripts, no sick days. Costs less per month than one missed job.</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            For a typical electrical business getting 20-40 calls per month, an AI receptionist costs around £50-150 total. If it captures even one extra job per month (which it will — easily), it&apos;s paid for itself multiple times over.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What About Emergencies?</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            This is the question every electrician asks, and rightly so. Electrical emergencies are serious — a burning smell or sparking can mean a fire risk. You can&apos;t have an AI telling someone to &quot;wait for a callback tomorrow.&quot;
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            A properly set up AI receptionist handles emergencies differently from normal calls:
          </p>
          <div className="space-y-2 mb-6">
            {[
              "Detects emergency keywords: burning smell, sparking, no power, water near electrics, exposed wires",
              "Immediately advises the caller to switch off at the mains if safe to do so",
              "Escalates to your emergency number — rings you directly, not just an SMS",
              "If you don't answer the emergency escalation, routes to a backup number",
              "Logs the emergency with full details and timestamp",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-teal-400">&#10003;</span>
                <p className="text-gray-400 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 leading-relaxed">
            The AI isn&apos;t giving electrical advice. It&apos;s doing what any good receptionist would do: recognising urgency, providing basic safety guidance, and making sure you know about it immediately.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">NICEIC, NAPIT, and Looking Professional</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            If you&apos;re NICEIC or NAPIT registered, you&apos;ve already invested in credibility. Customers looking for a registered electrician expect a professional operation. When they call and get voicemail, it undermines that.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            An AI receptionist that answers immediately, uses your business name, asks intelligent questions, and books appointments? That matches the professional image your accreditation promises. The customer thinks they&apos;re dealing with a well-run operation — because they are.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The AI can even mention your accreditations: &quot;Cooper Electrical is NICEIC approved and we provide certificates for all work carried out.&quot; Small touch, big impact on customer confidence.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Making It Part of Your Full System</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            An AI receptionist is most powerful when it&apos;s connected to everything else. The phone call is just the entry point. What happens next matters just as much:
          </p>
          <div className="space-y-2 mb-6">
            {[
              "Call captured → lead added to your pipeline automatically",
              "Automated follow-up SMS if you haven't called back within an hour",
              "Quote sent → automated follow-up sequence if no response",
              "Job completed → automated invoice via Xero or QuickBooks",
              "Invoice paid → automated review request via WhatsApp",
              "12 months later → automated EICR reminder sent to the customer",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-teal-400">&#8594;</span>
                <p className="text-gray-400 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 leading-relaxed">
            That&apos;s not science fiction. That&apos;s what{" "}
            <Link href="/ai-automation-for-electricians-uk" className="text-teal-400 hover:underline">AI automation for electricians</Link>{" "}
            actually looks like in practice. Every step handled. Nothing falls through the cracks.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">How much does an AI receptionist cost?</p>
              <p className="text-gray-400 text-sm leading-relaxed">£50-150 per month for a typical electrical business. Compare that to £200-400/month for a human answering service or £20-25k/year for a receptionist. The AI pays for itself with one extra job per month.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Can it handle emergency calls properly?</p>
              <p className="text-gray-400 text-sm leading-relaxed">Yes. It detects emergency keywords, advises switching off at the mains, and escalates to your mobile or emergency number immediately. Non-urgent calls get standard handling.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Does it know about electrical work?</p>
              <p className="text-gray-400 text-sm leading-relaxed">It&apos;s trained on your specific services and can ask the right qualifying questions — domestic or commercial, type of work, urgency. It won&apos;t give electrical advice, but it qualifies the job properly so you know exactly what you&apos;re calling back about.</p>
            </div>
          </div>
        </section>

        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Every missed call is a missed job. An AI receptionist doesn&apos;t replace you — it catches the calls you physically can&apos;t take because you&apos;re doing your actual job. The lead gets captured, emergencies get escalated, and you call back when you&apos;re ready.
          </p>
          <p className="text-gray-400 leading-relaxed">
            For £50-150 a month — less than the cost of one lost rewire job — you never miss a lead again. That&apos;s the maths. It&apos;s that simple.
          </p>
        </section>

        <section className="mb-20 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8 text-center">
          <p className="text-white font-semibold text-lg mb-2">Want an AI receptionist for your electrical business?</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            Book a free systems audit. I&apos;ll show you how many leads you&apos;re losing from missed calls and exactly how an AI receptionist would work for your setup.
          </p>
          <Link href="/audit" className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition">Book a Free Audit &rarr;</Link>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">&larr; Back to Blog</Link>
          <Link href="/ai-automation-for-electricians-uk" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">AI Automation for Electricians &rarr;</Link>
          <Link href="/blog/ai-phone-answering-uk-tradespeople" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: AI Phone Answering for Trades &rarr;</Link>
        </div>
      </article>
    </main>
  )
}
