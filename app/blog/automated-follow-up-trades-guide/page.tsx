import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Automated Follow-Up for Trades: The Step-by-Step Guide",
  description: "80% of sales happen after the 5th contact. Most tradespeople stop after 1. Here's how to automate follow-ups that actually get responses.",
  author: { "@type": "Person", name: "JP", url: "https://www.jpautomations.co.uk", sameAs: "https://www.linkedin.com/in/james-harvey-0583b2370/" },
  publisher: { "@type": "Organization", name: "JP Automations", logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" } },
  datePublished: "2026-04-21",
  dateModified: "2026-04-21",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.jpautomations.co.uk/blog/automated-follow-up-trades-guide" },
  keywords: ["automated follow-up tradesmen", "quote follow-up trades", "follow-up sequence trades UK", "tradesman follow-up automation", "quote chasing automation"],
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
          <p className="text-sm text-gray-400 mb-4">Published 21 April 2026</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-teal-400">Automated Follow-Up</span> for Trades: The Step-by-Step Guide
          </h1>
        </header>

        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            You go to a site visit. Measure up. Spend 45 minutes working out materials and labour. Write up a quote on the drive home. Send it over. Then... nothing. Radio silence.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            A week later you think, &quot;I should probably chase that up.&quot; But you&apos;re busy. You&apos;ve got three other jobs on. The moment passes. The customer goes with someone who did follow up — or they just forgot they even asked for a quote.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            Here&apos;s the stat that should stop you in your tracks: 80% of sales happen after the 5th contact. But 44% of salespeople — and almost all tradespeople — give up after just one attempt. You&apos;re not losing work because your prices are wrong. You&apos;re losing it because you&apos;re not following up.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What Most Tradespeople Actually Do</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Let&apos;s be honest about the current process for most trades:
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">1</span>
              <p className="text-gray-400 text-sm">Send the quote</p>
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">2</span>
              <p className="text-gray-400 text-sm">Hope for the best</p>
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">3</span>
              <p className="text-gray-400 text-sm">Maybe send one &quot;just checking in&quot; text a week later</p>
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
              <span className="text-red-400 text-sm">4</span>
              <p className="text-gray-400 text-sm">Assume they&apos;re not interested and move on</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            That&apos;s not a follow-up system. That&apos;s leaving money on the table and calling it &quot;they must have gone with someone cheaper.&quot; Maybe they did. Or maybe they just forgot to reply, got busy, and by the time they circled back, they couldn&apos;t find your quote.
          </p>
          <p className="text-gray-400 leading-relaxed mt-4">
            People are busy. They asked three plumbers for a quote. Life happened. The one who followed up is the one who got the job. It&apos;s that simple.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Follow-Up Actually Works</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Following up isn&apos;t pestering. Done right, it&apos;s professional. It shows you&apos;re organised, reliable, and actually want the work. The numbers back this up:
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">80%</p>
              <p className="text-gray-400 text-xs mt-1">of sales need 5+ contacts to close</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">44%</p>
              <p className="text-gray-400 text-xs mt-1">give up after just 1 follow-up</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">78%</p>
              <p className="text-gray-400 text-xs mt-1">of jobs go to the first responder</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">2x</p>
              <p className="text-gray-400 text-xs mt-1">conversion rate with consistent follow-up</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Most tradespeople think following up more than once makes them look desperate. It doesn&apos;t. It makes them look professional. The customer is comparing you to two other tradespeople who sent a quote and then vanished. You&apos;re the one who actually seems like they want the job.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Ideal Follow-Up Sequence</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Here&apos;s a follow-up sequence that works for trades. It&apos;s not aggressive. It&apos;s not salesy. It&apos;s just consistent — and that&apos;s what most tradespeople are missing.
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Day 1 — Send the quote + confirmation</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Send the quote by email or WhatsApp. Then send a short text: &quot;Hi [name], just sent the quote over for the [job]. Any questions, give me a shout. Cheers, [your name].&quot; This confirms delivery and puts your name in their phone.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Day 3 — Gentle check-in</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                &quot;Hi [name], just checking you got the quote alright. Happy to pop back if you want to go over anything. No rush.&quot; Short, casual, no pressure. Most people appreciate the reminder — they meant to reply and forgot.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Day 7 — Add value</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                &quot;Hi [name], thought I&apos;d mention — I&apos;ve got availability in the next couple of weeks if you wanted to get this sorted before [relevant timing, e.g., winter / the school holidays / the rain picks up]. Let me know.&quot; This creates gentle urgency without being pushy.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Day 14 — Direct question</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                &quot;Hi [name], just circling back on the quote for the [job]. Are you still looking to go ahead with this, or has the plan changed? Either way, no worries — just want to keep my diary up to date.&quot; This gives them permission to say no, which paradoxically makes them more likely to say yes.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Day 30 — Final follow-up</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                &quot;Hi [name], last one from me on this! If you&apos;ve gone with someone else, no hard feelings. If you still need it done, I&apos;ve got space coming up. Just let me know. Cheers.&quot; You&apos;d be amazed how many people reply to this one. They feel guilty about not responding and this gives them an easy way back in.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What to Say (And What Not to Say)</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The messages above work because they follow a few simple rules:
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&#10003;</span>
              <p className="text-gray-400"><strong className="text-white">Be casual.</strong> Write like you talk. &quot;Just checking in&quot; beats &quot;I am writing to follow up on our previous correspondence.&quot;</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&#10003;</span>
              <p className="text-gray-400"><strong className="text-white">Be short.</strong> 2-3 sentences max. Nobody wants to read a novel from their plumber.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&#10003;</span>
              <p className="text-gray-400"><strong className="text-white">Reference the specific job.</strong> &quot;The bathroom refit&quot; not &quot;the quote I sent.&quot; Shows you remember them.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&#10003;</span>
              <p className="text-gray-400"><strong className="text-white">Give them an easy out.</strong> &quot;No worries either way&quot; removes pressure and makes people more likely to engage.</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed mb-4">What not to do:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-red-400">&#10005;</span>
              <p className="text-gray-400"><strong className="text-white">Don&apos;t discount.</strong> &quot;I can knock 10% off if you book this week&quot; trains customers to wait for discounts. Your price is your price.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-red-400">&#10005;</span>
              <p className="text-gray-400"><strong className="text-white">Don&apos;t guilt-trip.</strong> &quot;I spent an hour on that quote&quot; — true, but saying it out loud loses the job.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-red-400">&#10005;</span>
              <p className="text-gray-400"><strong className="text-white">Don&apos;t follow up daily.</strong> That&apos;s pestering. Space it out. The sequence above is calibrated to feel helpful, not annoying.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">How to Automate It</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Here&apos;s where it gets good. Everything above — the full 5-touch sequence — can run automatically. You don&apos;t have to remember. You don&apos;t have to write a single text. You don&apos;t have to keep a spreadsheet of who you need to chase.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            There are a few ways to set this up, from simple to sophisticated:
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Level 1: CRM with built-in sequences</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tools like GoHighLevel, HubSpot, or Jobber let you set up automated text/email sequences when a quote is sent. You create the messages once, set the timing, and the system handles it from there. Good starting point if you already use a CRM.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Level 2: WhatsApp + automation tool</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Most customers prefer WhatsApp over email. Tools like{" "}
                <Link href="/blog/whatsapp-automation-uk-service-businesses" className="text-teal-400 hover:underline">WhatsApp automation</Link> platforms can trigger follow-up messages based on when you sent the quote. Higher open rates than email (98% vs 20%).
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Level 3: Custom automation system</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                A bespoke system that connects your quoting tool, CRM, WhatsApp, email, and SMS into one pipeline. Quote goes out &rarr; follow-up sequence starts automatically &rarr; when the customer replies &quot;yes,&quot; the system stops the sequence and triggers the next step (booking, deposit invoice, etc.). This is what we build at{" "}
                <Link href="/ai-automation-for-service-businesses" className="text-teal-400 hover:underline">JP Automations</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Results You Can Expect</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Tradespeople who implement a proper follow-up sequence consistently see:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">20-40% more quotes converted</strong> — leads that would have ghosted now come back</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">Less time chasing</strong> — the system does it, you focus on earning</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">Better customer perception</strong> — you look organised and professional</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">Predictable pipeline</strong> — you know what&apos;s coming in, not just what you hope for</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed mt-6">
            Think about it this way: if you send 20 quotes a month and convert 5, that&apos;s a 25% conversion rate. Add a follow-up sequence and move that to 35%? That&apos;s 2 extra jobs a month. At £500 average, that&apos;s £12,000 extra a year from sending automated texts. Not bad for something that runs in the background while you&apos;re on the tools.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Common Objections (And Why They&apos;re Wrong)</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">&quot;I don&apos;t want to seem desperate&quot;</p>
              <p className="text-gray-400 text-sm leading-relaxed">Following up 5 times over 30 days isn&apos;t desperate — it&apos;s how every successful business operates. The customer won&apos;t remember your follow-ups. They&apos;ll remember that you were the one who was easy to work with.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">&quot;If they want the job done, they&apos;ll get back to me&quot;</p>
              <p className="text-gray-400 text-sm leading-relaxed">They might. Or they might get busy, lose your quote, and call the next plumber on Google instead. People have short attention spans. The person who stays top of mind wins.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">&quot;I don&apos;t have time to chase quotes&quot;</p>
              <p className="text-gray-400 text-sm leading-relaxed">That&apos;s exactly the point. You automate it. Set it up once and it runs forever. Zero time investment after the initial setup.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Connecting Follow-Up to the Bigger Picture</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Follow-up is just one piece of the puzzle. The best-run trade businesses have a full pipeline:
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            <Link href="/blog/lead-generation-automation-uk-service-businesses" className="text-teal-400 hover:underline">Lead comes in</Link> &rarr; AI captures details &rarr; you quote &rarr; automated follow-up &rarr; job booked &rarr;{" "}
            <Link href="/blog/automate-quoting-invoicing-uk-trades" className="text-teal-400 hover:underline">invoice sent automatically</Link> &rarr; payment chased automatically &rarr;{" "}
            <Link href="/blog/automate-google-reviews-uk-trades" className="text-teal-400 hover:underline">review requested</Link>. Each step feeds the next. Nothing falls through the cracks.
          </p>
          <p className="text-gray-400 leading-relaxed">
            If you&apos;re only going to automate one thing, start with follow-up. It&apos;s the easiest to set up and the one with the most immediate impact on revenue. Then build from there.
          </p>
        </section>

        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            You&apos;re already doing the hard work — the site visits, the measuring up, the quoting. The follow-up is the easy bit, and it&apos;s the bit most tradespeople skip. Automate it. Set up the sequence once. Let it run.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The difference between a tradesperson who&apos;s always booked out and one who&apos;s always chasing work usually isn&apos;t skill or price. It&apos;s follow-up.
          </p>
        </section>

        <section className="mb-20 bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Want follow-up running on autopilot?
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Book a free audit and I&apos;ll map out your entire follow-up sequence — what to say, when to say it, and how to automate the whole thing.
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
          <Link href="/blog/automate-client-follow-up-uk-service-businesses" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: Automate Client Follow-Up &rarr;</Link>
          <Link href="/blog/automate-quoting-invoicing-uk-trades" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: Automate Quoting &amp; Invoicing &rarr;</Link>
        </div>
      </article>
    </main>
  )
}
