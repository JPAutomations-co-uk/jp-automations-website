import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Real Cost of Missed Calls for Plumbers (And How to Fix It)",
  description: "UK plumbers miss 62% of inbound calls. At £180 per emergency callout, that's thousands walking to competitors every month. Here's the fix.",
  author: { "@type": "Organization", name: "JP Automations", url: "https://www.jpautomations.co.uk" },
  publisher: { "@type": "Organization", name: "JP Automations", logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" } },
  datePublished: "2026-04-14",
  dateModified: "2026-04-14",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.jpautomations.co.uk/blog/real-cost-missed-calls-plumbers" },
  keywords: ["missed calls plumbers UK", "plumber losing customers", "AI call handling plumber", "plumber missed calls cost", "AI phone answering plumber"],
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
          <p className="text-sm text-gray-400 mb-4">Published 14 April 2026</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            The Real Cost of <span className="text-teal-400">Missed Calls</span> for Plumbers (And How to Fix It)
          </h1>
        </header>

        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            You&apos;re elbow-deep under a kitchen sink. Your phone buzzes in your pocket. You can&apos;t answer it. Twenty minutes later, you check — missed call, no voicemail. You ring back. No answer. That lead is gone. They&apos;ve already called the next plumber on Google and booked them instead.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            Sound familiar? You&apos;re not alone. Research from BrightLocal and industry call-tracking data shows that UK tradespeople — plumbers especially — miss somewhere around 62% of inbound calls during working hours. Not because they don&apos;t care. Because they&apos;re doing the actual work.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            Here&apos;s the thing most plumbers don&apos;t sit down and calculate: what those missed calls actually cost in hard cash. Once you do the maths, it&apos;s enough to make you put the wrench down.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Numbers That Should Keep You Up at Night</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Let&apos;s break this down properly. The average emergency plumbing callout in the UK sits around £180. Routine jobs — boiler services, bathroom fits, radiator replacements — range from £150 to £2,000+.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">62%</p>
              <p className="text-gray-400 text-xs mt-1">of inbound calls missed during working hours</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">£180</p>
              <p className="text-gray-400 text-xs mt-1">average emergency callout value</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">85%</p>
              <p className="text-gray-400 text-xs mt-1">of callers won&apos;t leave a voicemail</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">£4,300+</p>
              <p className="text-gray-400 text-xs mt-1">potential monthly revenue lost</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            If you&apos;re getting 40 inbound calls a month (fairly typical for a plumber with decent Google visibility), and you&apos;re missing 62% of them, that&apos;s roughly 25 missed calls. At an average job value of £180, that&apos;s £4,500 a month walking straight to your competitors. Over a year, you&apos;re looking at over £50,000 in lost revenue.
          </p>
          <p className="text-gray-400 leading-relaxed mt-4">
            And that&apos;s being conservative. If even a handful of those were boiler installations or bathroom refits, the real number is significantly higher.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Emergency vs Routine: Why Timing Matters</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Not all missed calls are created equal. The emergency calls — burst pipes, no hot water, leaks coming through the ceiling — those are the ones that cost you the most when you miss them. Why? Because the customer isn&apos;t going to wait.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            When someone&apos;s got water pouring through their kitchen ceiling, they&apos;re calling plumber after plumber until someone picks up. They don&apos;t leave voicemails. They don&apos;t &quot;try again later.&quot; They need someone now.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Routine enquiries — &quot;I need a boiler service next month&quot; — are more forgiving. But even there, studies show the first business to respond wins the job 78% of the time. If you call back three hours later, someone else has already booked it.
          </p>
          <div className="border-l-2 border-teal-400 pl-5 my-8">
            <p className="text-white font-semibold mb-2">The 5-minute rule</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Leads contacted within 5 minutes are 21x more likely to convert than leads contacted after 30 minutes. For plumbers, that window is even tighter on emergencies. If you can&apos;t answer within the first ring, you need something that can.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Seasonal Crunch: October to March</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Every plumber knows the pattern. October hits, the temperature drops, and your phone doesn&apos;t stop ringing. Boiler breakdowns. Frozen pipes. Heating systems failing. This is peak season — and it&apos;s exactly when you&apos;re busiest and least able to answer your phone.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            The cruel irony: the months where you get the most calls are the months where you miss the most calls. You&apos;re running between jobs, hands are cold, you&apos;re in a customer&apos;s loft space — and your phone keeps buzzing in the van.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Between October and March, call volumes for plumbers can spike 40-60% above the summer average. If you&apos;re already missing 62% of calls in a quiet month, imagine what that number looks like in January when Mrs. Henderson&apos;s boiler packs in at 7am and six other people ring with the same problem before lunch.
          </p>
          <p className="text-gray-400 leading-relaxed">
            This is where the missed call problem goes from annoying to genuinely expensive. You could be turning away your most profitable months without even knowing it.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What Actually Happens When You Miss a Call</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Let&apos;s trace the journey of a missed call, because it&apos;s worse than you think:
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">The customer calls you</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                They found you on Google, Checkatrade, or got a recommendation. They&apos;re ready to book. This is a warm lead — they&apos;ve already decided they need a plumber and they chose you.
              </p>
            </div>
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">No answer. Voicemail kicks in.</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                85% of callers hang up without leaving a message. They don&apos;t know you. They don&apos;t trust a voicemail to get a callback. They just move on.
              </p>
            </div>
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">They call the next plumber on the list</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Google gave them 10 options. You were number 3. Number 4 picks up. Job booked within 2 minutes.
              </p>
            </div>
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">You call back 2 hours later</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                &quot;Oh, I&apos;ve already sorted it, thanks.&quot; That&apos;s if they even answer your callback. Most don&apos;t recognise the number and ignore it.
              </p>
            </div>
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">You never knew the lead existed</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                No voicemail, no name, no details. Just a missed call notification that you glance at between jobs and forget about. The revenue disappears silently.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Fix: AI Call Handling</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The solution isn&apos;t hiring a receptionist at £25k a year. It&apos;s not asking your missus to answer calls (she&apos;s got her own job). And it&apos;s definitely not trying to answer your phone while you&apos;re soldering a joint — that&apos;s how you end up with a flood and a dropped call.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            AI call handling works like this: when you can&apos;t answer, the call forwards to an AI agent. It picks up, speaks naturally, asks what the caller needs, captures their name, number, and job details, and sends you a text with everything. The caller feels heard. You get the lead. Nobody goes to voicemail.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            For plumbers specifically, you can train the AI to ask the right questions: &quot;Is this an emergency or can it wait a day or two?&quot; &quot;Is there active water damage?&quot; &quot;What&apos;s your postcode?&quot; This means when you check your phone between jobs, you&apos;ve got a prioritised list of leads with all the info you need to call back and book.
          </p>
          <div className="border border-white/10 rounded-2xl p-6 mb-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              <strong className="text-white">AI:</strong> &quot;Hi, thanks for calling Dave&apos;s Plumbing. I&apos;m the virtual assistant. How can I help?&quot;<br /><br />
              <strong className="text-white">Caller:</strong> &quot;Yeah, my boiler&apos;s stopped working and I&apos;ve got no hot water.&quot;<br /><br />
              <strong className="text-white">AI:</strong> &quot;I&apos;m sorry to hear that. I&apos;ll get Dave to call you back as soon as possible. Can I take your name and number?&quot;<br /><br />
              <strong className="text-white">Caller:</strong> &quot;It&apos;s Mike, 07700 123456.&quot;<br /><br />
              <strong className="text-white">AI:</strong> &quot;Thanks Mike. And your postcode so Dave can plan his route?&quot;<br /><br />
              <strong className="text-white">Caller:</strong> &quot;B15 2TT.&quot;<br /><br />
              <strong className="text-white">AI:</strong> &quot;Got it. I&apos;ve flagged this as urgent and Dave will call you back shortly. Is there anything else?&quot;
            </p>
          </div>
          <p className="text-gray-400 leading-relaxed">
            You get a text: &quot;URGENT — Mike, 07700 123456, B15 2TT, boiler not working, no hot water.&quot; You call Mike back in 10 minutes. Job booked. That&apos;s £180 that would have gone to the plumber down the road.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Beyond Just Answering Calls</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The smart plumbers don&apos;t stop at call handling. They connect it to the rest of their system. The AI captures the lead, it goes into a{" "}
            <Link href="/blog/automate-client-follow-up-uk-service-businesses" className="text-teal-400 hover:underline">follow-up sequence</Link>, the quote gets sent automatically, and when the job&apos;s done, a{" "}
            <Link href="/blog/automate-google-reviews-uk-trades" className="text-teal-400 hover:underline">review request</Link> goes out without you lifting a finger.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            That&apos;s the difference between a plumber who&apos;s always chasing work and one who&apos;s always booked out. It&apos;s not about being a better plumber. It&apos;s about having a better system.
          </p>
          <p className="text-gray-400 leading-relaxed">
            If you want to see what a full{" "}
            <Link href="/ai-automation-for-plumbers-uk" className="text-teal-400 hover:underline">AI automation system looks like for plumbers</Link>, we&apos;ve put together a detailed breakdown of every process you can automate — from the first missed call to the five-star review.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What This Looks Like in Practice</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            One plumber we worked with in the West Midlands was getting about 45 inbound calls a month. He reckoned he was answering maybe 15-20 of them. The rest? Missed while he was on jobs, driving, or just not quick enough to grab the phone with wet hands.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            After setting up AI call handling, every single call got answered. Within the first month, he booked 8 additional jobs he would have otherwise missed. At an average of £200 per job, that&apos;s £1,600 in revenue from a system that costs a fraction of that to run.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The real win wasn&apos;t just the money. It was the stress. He stopped worrying about missed calls. Stopped checking his phone between every pipe joint. Started actually focusing on the work knowing that every lead was being captured in the background.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The ROI Breakdown</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Let&apos;s do the simple maths:
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400">AI call handling: £50-150/month</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400">Average job value for a plumber: £180-300</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400">Jobs needed to break even: 1 per month</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400">Realistic additional jobs captured: 5-10 per month</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            That&apos;s a 10-20x return on investment. Every month. It&apos;s not even close. There is no marketing channel, no advertising spend, no SEO strategy that gives you a 10x return as reliably as simply answering your phone.
          </p>
        </section>

        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-2xl font-bold mb-4">Stop Paying Your Competitors</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Every missed call is a payment to whoever picks up instead of you. You spent money on your van signage, your Google listing, your Checkatrade profile — all to generate those calls. Then you miss them and hand the job to someone who didn&apos;t spend a penny on marketing.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Fix the leak in your business before you fix the next one under someone&apos;s sink. It&apos;s the highest-ROI move you&apos;ll make this year.
          </p>
        </section>

        <section className="mb-20 bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Find out what missed calls are costing you
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Book a free audit. I&apos;ll show you exactly how many leads you&apos;re losing and what it takes to capture every one of them.
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
          <Link href="/ai-automation-for-plumbers-uk" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">AI Automation for Plumbers &rarr;</Link>
          <Link href="/blog/ai-phone-answering-uk-tradespeople" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: AI Phone Answering for Trades &rarr;</Link>
        </div>
      </article>
    </main>
  )
}
