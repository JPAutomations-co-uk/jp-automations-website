import Image from "next/image"
import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "AI Phone Answering for UK Tradespeople: Never Miss Another Lead",
  description: "UK tradespeople miss 40-60% of inbound calls because they're on a job. AI phone answering handles calls, books appointments, and captures leads — 24/7.",
  author: { "@type": "Person", name: "JP", url: "https://www.jpautomations.co.uk", sameAs: "https://www.linkedin.com/in/james-harvey-0583b2370/" },
  publisher: { "@type": "Organization", name: "JP Automations", logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" } },
  datePublished: "2026-03-30",
  dateModified: "2026-03-30",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.jpautomations.co.uk/blog/ai-phone-answering-uk-tradespeople" },
  keywords: ["AI phone answering UK", "AI receptionist tradespeople", "never miss a call tradesman", "automated call handling UK", "AI voicemail service business"],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does AI phone answering work for a trade business?",
      acceptedAnswer: { "@type": "Answer", text: "When you can't answer a call, it forwards to the AI agent. The AI answers in your business name, asks what the caller needs, captures their details (name, number, job description), and either books an appointment directly or sends you a summary via SMS/email. The caller speaks to a natural-sounding AI voice — most don't realise it's not human." },
    },
    {
      "@type": "Question",
      name: "How much does AI phone answering cost?",
      acceptedAnswer: { "@type": "Answer", text: "Most services charge £30-100/month plus per-minute fees of £0.05-0.15. For a trade business receiving 20-50 calls per month, expect £50-150 total. Compare that to the cost of a missed job (£200-2,000+) and the ROI is immediate." },
    },
    {
      "@type": "Question",
      name: "Will clients know they're talking to AI?",
      acceptedAnswer: { "@type": "Answer", text: "Modern AI voice agents sound remarkably natural. Some callers won't notice. Others will but won't care — they'd rather leave details with an AI than get voicemail. The key is transparency: the best implementations say 'Hi, this is the virtual assistant for [business name]' so there's no deception." },
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

        <div className="mb-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <Image src="/blog/ai-phone-answering-uk-tradespeople.jpg" alt="AI phone answering for UK tradespeople" width={1200} height={750} priority className="w-full aspect-[16/10] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>

        <header className="mb-12">
          <p className="text-sm text-gray-400 mb-4">Published 30 March 2026</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-teal-400">AI Phone Answering</span> for UK Tradespeople: Never Miss Another Lead
          </h1>
        </header>

        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            A homeowner needs a roofer. They search Google, find three options, and call the first one. No answer — the roofer is on a scaffold. They call the second. Voicemail. They call the third. Someone picks up, asks a few questions, and books a site visit.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            That third roofer didn&apos;t get the job because they were better. They got it because they answered the phone. Studies show that 85% of callers who reach voicemail will not call back. They call the next business on the list.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            For a trade business doing £20-40k per month, each missed call represents £200-2,000 in lost revenue. Miss five calls a week and you&apos;re leaving £50-100k per year on the table. AI phone answering eliminates this problem entirely.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What AI Phone Answering Actually Is</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            AI phone answering is not a voicemail system. It&apos;s not a call centre. It&apos;s an AI voice agent that answers your phone when you can&apos;t, has a natural conversation with the caller, and captures their details — all in real time.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Here&apos;s what a typical call looks like:
          </p>
          <div className="border border-white/10 rounded-2xl p-6 mb-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              <strong className="text-white">AI:</strong> &quot;Hi, thanks for calling Smith Roofing. I&apos;m the virtual assistant. How can I help you today?&quot;<br /><br />
              <strong className="text-white">Caller:</strong> &quot;Yeah, I&apos;ve got a leak in my roof and need someone to come have a look.&quot;<br /><br />
              <strong className="text-white">AI:</strong> &quot;I&apos;m sorry to hear that. I can get someone to call you back today to arrange a visit. Can I take your name and the best number to reach you?&quot;<br /><br />
              <strong className="text-white">Caller:</strong> &quot;It&apos;s Sarah, 07700 900123.&quot;<br /><br />
              <strong className="text-white">AI:</strong> &quot;Got it, Sarah. I&apos;ll pass this to the team and someone will call you back within the hour. Is there anything else I can help with?&quot;
            </p>
          </div>
          <p className="text-gray-400 leading-relaxed">
            You get an SMS immediately with the caller&apos;s details and a summary of what they need. The lead is captured. You call them back when you&apos;re off the roof. No lead lost.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works Technically</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Call forwarding</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                When you don&apos;t answer within 3-4 rings (or you&apos;re set to &quot;busy&quot;), your phone automatically forwards to the AI agent&apos;s number. This uses standard call forwarding — no app needed, works with any phone.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">AI conversation</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The AI agent answers in your business name with a script you control. It uses speech-to-text to understand the caller, processes the intent, and responds naturally. Modern AI voice agents handle accents, background noise, and conversational tangents.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Lead capture</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The AI extracts: caller name, phone number, what they need, urgency level, and property details if relevant. This gets sent to you via SMS, email, or directly into your CRM or Google Sheet.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Optional: direct booking</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Some setups allow the AI to book appointments directly into your calendar. &quot;I can see we have availability on Thursday afternoon or Friday morning — which works better for you?&quot; The site visit is booked before you even know about the call.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Real Cost of Missed Calls</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            For a trade business, each missed call has a quantifiable cost:
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">85%</p>
              <p className="text-gray-400 text-xs mt-1">of callers won&apos;t call back after voicemail</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">5-10</p>
              <p className="text-gray-400 text-xs mt-1">calls missed per week (avg UK tradesperson)</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">£200-2k</p>
              <p className="text-gray-400 text-xs mt-1">average job value per missed call</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">£50-100k</p>
              <p className="text-gray-400 text-xs mt-1">potential annual revenue lost</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            An AI phone answering service at £50-150/month is one of the highest-ROI investments a trade business can make. Even if it only captures one additional job per month, it&apos;s paid for itself several times over.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">UK Providers Worth Considering</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The AI phone answering market is growing fast. Here are the main approaches for UK tradespeople:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
            <li><strong>Dedicated AI receptionist services</strong> — purpose-built for SMBs, typically £30-100/month. Simple setup, limited customisation.</li>
            <li><strong>VoIP + AI integration</strong> — connect a VoIP service (like Vonage or Twilio) to an AI voice agent. More flexible but requires technical setup.</li>
            <li><strong>Custom-built solution</strong> — an automation agency builds you a bespoke AI phone agent integrated with your CRM, booking system, and follow-up automation. Highest upfront cost, best long-term ROI.</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            The right choice depends on your volume and technical comfort. For most tradespeople doing 20-50 calls per month, a dedicated service is the fastest path to results. For businesses at scale, a custom integration delivers more value.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Making It Part of a Bigger System</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            AI phone answering works best when it&apos;s connected to the rest of your{" "}
            <Link href="/ai-automation-for-service-businesses" className="text-teal-400 hover:underline">automation system</Link>. The phone capture feeds into the same pipeline as your website enquiries, WhatsApp messages, and social media DMs.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Lead comes in via phone → AI captures details → lead added to your pipeline → automated{" "}
            <Link href="/blog/automate-client-follow-up-uk-service-businesses" className="text-teal-400 hover:underline">follow-up sequence</Link>{" "}
            triggers → you call back when ready → quote sent → automated follow-up → job booked → invoice sent →{" "}
            <Link href="/blog/automate-google-reviews-uk-trades" className="text-teal-400 hover:underline">review requested</Link>. Every step connected. No leads falling through cracks.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">How does AI phone answering work?</p>
              <p className="text-gray-400 text-sm leading-relaxed">When you can&apos;t answer, calls forward to the AI. It answers in your business name, captures caller details and what they need, and sends you a summary via SMS/email. Most callers don&apos;t realise it&apos;s AI.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">How much does it cost?</p>
              <p className="text-gray-400 text-sm leading-relaxed">£50-150/month for a trade business receiving 20-50 calls. Compare that to the cost of one missed job and the ROI is immediate.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Will clients know they&apos;re talking to AI?</p>
              <p className="text-gray-400 text-sm leading-relaxed">Modern AI voice agents sound natural. The best implementations are transparent — &quot;Hi, I&apos;m the virtual assistant for [business name]&quot; — and most callers prefer speaking to an AI over reaching voicemail.</p>
            </div>
          </div>
        </section>

        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Every missed call is a missed job. AI phone answering doesn&apos;t replace you — it catches the calls you physically can&apos;t take. The lead gets captured. You call back when you&apos;re ready. No more voicemails that never get returned.
          </p>
          <p className="text-gray-400 leading-relaxed">
            For £50-150 per month, you stop leaving £50-100k per year on the table. That&apos;s not a cost. It&apos;s the most obvious ROI in your business.
          </p>
        </section>

        <section className="mb-20 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8 text-center">
          <p className="text-white font-semibold text-lg mb-2">Want AI phone answering integrated into your business?</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            We build AI phone systems for UK tradespeople — connected to your CRM, booking calendar, and follow-up automation. Never miss a lead again.
          </p>
          <Link href="/book-call" className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition">Book a Free Call &rarr;</Link>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">&larr; Back to Blog</Link>
          <Link href="/blog/lead-generation-automation-uk-service-businesses" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: Automated Lead Generation &rarr;</Link>
          <Link href="/blog/ai-automation-roofing-companies-uk" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: AI Automation for Roofers &rarr;</Link>
        </div>
      </article>
    </main>
  )
}
