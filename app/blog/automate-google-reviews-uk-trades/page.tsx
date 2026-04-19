import Image from "next/image"
import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Automate Google Reviews for Your Trade Business",
  description:
    "Automated review collection for UK tradespeople. The 3-step system to get 5-star Google reviews on autopilot — without awkward asking or chasing clients.",
  author: {
    "@type": "Organization",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
  publisher: {
    "@type": "Organization",
    name: "JP Automations",
    logo: {
      "@type": "ImageObject",
      url: "https://www.jpautomations.co.uk/logo.png",
    },
  },
  datePublished: "2026-03-16",
  dateModified: "2026-03-16",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.jpautomations.co.uk/blog/automate-google-reviews-uk-trades",
  },
  keywords: [
    "automate Google reviews UK",
    "Google review automation trades",
    "get more Google reviews tradesman",
    "automated review requests UK",
    "5-star reviews autopilot",
    "review collection automation service business",
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I automate Google review requests without breaking Google's guidelines?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Google allows businesses to ask customers for reviews. What's prohibited is gating (only asking happy customers), incentivising reviews with discounts, or posting fake reviews. An automated system that sends a review link to every completed job is fully compliant.",
      },
    },
    {
      "@type": "Question",
      name: "What's the best time to send a review request after a job?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Between 1 and 4 hours after job completion. The client still remembers the experience, they've had time to inspect the work, and they're likely still near their phone. Sending the same day consistently outperforms next-day or weekly batch requests.",
      },
    },
    {
      "@type": "Question",
      name: "How many reviews does a trade business need to rank well on Google?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For local search (Google Maps), most trade businesses need 20-50 reviews with a 4.5+ average to appear competitively. Beyond 50 reviews, recency and frequency matter more than total count — Google favours businesses that receive reviews consistently rather than in bursts.",
      },
    },
    {
      "@type": "Question",
      name: "Should I use SMS or email for review requests?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SMS consistently outperforms email for trade businesses, with open rates of 95%+ vs 20-30% for email. Most tradespeople's clients prefer text communication. The ideal approach is SMS first, with an email follow-up 48 hours later for non-responders.",
      },
    },
  ],
}

export default function Page() {
  return (
    <main className="bg-black text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="relative max-w-4xl mx-auto px-6 py-24">

        {/* Back */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="text-sm text-gray-400 hover:text-teal-400 transition"
          >
            &larr; Back to all articles
          </Link>
        </div>

        {/* Blog Hero Image */}
        <div className="mb-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <Image
              src="/blog/automate-google-reviews-uk-trades.jpg"
              alt="How to automate Google reviews for UK trade businesses"
              width={1200}
              height={750}
              priority
              className="w-full aspect-[16/10] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>

        {/* Title + date */}
        <header className="mb-12">
          <p className="text-sm text-gray-400 mb-4">Published 16 March 2026</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            How to{" "}
            <span className="text-teal-400">Automate Google Reviews</span>{" "}
            for Your Trade Business
          </h1>
        </header>

        {/* Intro */}
        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            You do great work. Your clients are happy. But your Google Business Profile has 11 reviews — and three of them are from 2023.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            Meanwhile, the competitor down the road has 87 reviews, a 4.8-star average, and gets the call every time someone searches &quot;roofer near me&quot; or &quot;plumber in Manchester.&quot;
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            The difference isn&apos;t quality of work. It&apos;s a system. They have one for collecting reviews. You don&apos;t. That&apos;s the only gap — and it&apos;s one of the easiest things to automate in a trade business.
          </p>
        </section>

        {/* Section 1 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Why Reviews Matter More Than You Think
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Google reviews aren&apos;t just social proof. They directly affect where you rank in local search results. Google&apos;s local algorithm weighs three things: relevance, distance, and prominence. Reviews are the biggest factor in prominence.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            That means a plumber with 60 genuine reviews will consistently outrank a plumber with 8 reviews — even if the second one is closer to the searcher. More reviews, higher ranking, more calls. It compounds.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Beyond ranking, reviews affect conversion. 93% of consumers say online reviews influence their purchasing decisions. For trade services — where trust is everything — a strong review profile is the difference between getting the call and being scrolled past.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Why Most Tradespeople Don&apos;t Get Enough Reviews
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            It&apos;s not that clients don&apos;t want to leave a review. Most are perfectly happy to. The problem is nobody asks them — or by the time someone does, the moment has passed.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            The typical pattern: you finish a job, the client says thanks, you move to the next job. A week later you think &quot;I should ask for a review.&quot; But now it feels awkward. So you don&apos;t.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Multiply that by 200 jobs a year and you&apos;re leaving hundreds of potential reviews on the table. Not because people wouldn&apos;t leave them — but because the process depends entirely on you remembering.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            The 3-Step Review Automation System
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            A review automation system for a trade business has three components. Each one is simple on its own. Together, they turn every completed job into a potential 5-star review — without you doing anything.
          </p>

          <div className="space-y-6">
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">1. Trigger — detect when a job is complete</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                This is the starting point. When you mark a job as complete in your scheduling tool, send a final invoice, or update a spreadsheet — that event triggers the review request. The key is connecting something you already do to the automation. No extra steps for you.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">2. Request — send a personalised message with your review link</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Between 1 and 4 hours after the job, the system sends an SMS (or WhatsApp) to the client. Not a generic message — a personalised one that mentions their name and the work done. One tap takes them directly to your Google review page. SMS gets 95%+ open rates. Email gets 20-30%.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">3. Follow-up — one gentle nudge if they don&apos;t respond</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                If no review appears within 48 hours, one follow-up message goes out. Short, friendly, no pressure. Something like: &quot;Hi [name], just wanted to check you were happy with the work. If you have 30 seconds, a quick Google review would mean the world.&quot; This single follow-up typically doubles your response rate.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Timing Is Everything
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The number one factor in review collection isn&apos;t the message — it&apos;s the timing. Send the request too early and the client hasn&apos;t had time to appreciate the work. Send it a week later and they&apos;ve moved on mentally.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            The sweet spot is 1-4 hours after completion. The client has inspected the work, they&apos;re satisfied, and your business is still top of mind. Automating this timing is why the system works — it&apos;s impossible to be this consistent manually.
          </p>
          <p className="text-gray-400 leading-relaxed">
            For emergency services (burst pipes, roof leaks), sending a review request 24 hours later performs better. The client has had time to recover from the stress and can give a more thoughtful review.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            What the Message Should Say
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Keep it short. The review request message should take less than 10 seconds to read. Here&apos;s a template that consistently converts:
          </p>
          <div className="border-l-2 border-teal-400 pl-5 mb-6">
            <p className="text-gray-300 text-sm leading-relaxed italic">
              &quot;Hi [first name], thanks for choosing [your business]. If you were happy with the work, we&apos;d really appreciate a quick Google review — it helps other people find us. Takes 30 seconds: [link]&quot;
            </p>
          </div>
          <p className="text-gray-400 leading-relaxed mb-4">
            Three things make this work: personalisation (their name), a reason (helps other people), and low commitment (30 seconds). The direct link is critical — don&apos;t make them search for your business on Google.
          </p>
          <p className="text-gray-400 leading-relaxed">
            You can find your direct review link in Google Business Profile under &quot;Ask for reviews.&quot; Use a URL shortener to keep the SMS clean.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Staying Within Google&apos;s Guidelines
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Google is clear about what&apos;s allowed and what isn&apos;t. You can ask every customer for a review. What you cannot do:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
            <li><strong>Review gating</strong> — only sending the link to customers you think will leave a positive review</li>
            <li><strong>Incentivising</strong> — offering discounts, freebies, or rewards in exchange for reviews</li>
            <li><strong>Fake reviews</strong> — writing reviews yourself or paying for them</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            An automated system that sends the same review request to every completed job is fully compliant. In fact, it&apos;s better than manual asking — because a human is more likely to subconsciously gate by only asking clients they think will be positive.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            The Tools You Need
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            A basic review automation system uses three things:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>A job completion trigger (your existing scheduling or invoicing tool)</li>
            <li>An SMS sending service (Twilio, TextMagic, or WhatsApp Business API)</li>
            <li>An automation connector (Make, n8n, or Zapier to wire them together)</li>
          </ul>
          <p className="text-gray-400 leading-relaxed mb-4">
            Total cost: £20-50 per month depending on volume. For a business doing 30+ jobs a month, the ROI is immediate — each new review compounds your local ranking, which drives more calls, which drives more reviews.
          </p>
          <p className="text-gray-400 leading-relaxed">
            If you don&apos;t have a job management tool, even a simple Google Sheet updated at the end of each day can serve as the trigger. The automation checks for new entries and sends the review requests.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Handling Negative Reviews
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            One concern tradespeople have: &quot;What if the automation sends a review request to an unhappy client?&quot;
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            First — if you&apos;re doing good work, the vast majority of reviews will be positive. A few negative ones actually help. A profile with only 5-star reviews looks suspicious. A 4.7 average with a few honest criticisms looks authentic.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Second — responding professionally to negative reviews is more powerful than the review itself. A calm, helpful response shows prospective clients that you care about service quality. Many prospects actively look for how businesses handle complaints before making a decision.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Can I automate review requests without breaking Google&apos;s guidelines?</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yes. Google allows asking for reviews. What&apos;s prohibited is gating (only asking happy customers), incentivising, or posting fake reviews. An automated request sent to every completed job is fully compliant.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">What&apos;s the best time to send a review request?</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Between 1 and 4 hours after job completion. The client still remembers the experience and is likely near their phone. Same-day requests consistently outperform next-day or weekly batches.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">How many reviews do I need to rank well locally?</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Most trade businesses need 20-50 reviews with a 4.5+ average to appear competitively in local search. Beyond 50, recency and frequency matter more than total count.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Should I use SMS or email?</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                SMS. Open rates are 95%+ compared to 20-30% for email. Most trade clients prefer text communication. Ideal approach: SMS first, email follow-up 48 hours later for non-responders.
              </p>
            </div>
          </div>
        </section>

        {/* Closing callout */}
        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Google reviews are the highest-leverage marketing asset for a trade business. Every review improves your local ranking, builds trust with prospects, and makes the next call more likely. But relying on yourself to remember to ask — after every single job — will never work at scale.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Automate it once. Let the system collect reviews on every job, every week, whether you&apos;re on site or on holiday. Within three months, your review profile will look completely different.
          </p>
        </section>

        {/* CTA */}
        <section className="mb-20 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8 text-center">
          <p className="text-white font-semibold text-lg mb-2">
            Want this built for your business?
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            We build automated review collection systems for UK trade businesses — from job completion trigger to 5-star review, running on autopilot.
          </p>
          <Link
            href="/book-call"
            className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition"
          >
            Book a Free Call &rarr;
          </Link>
        </section>

        {/* Internal links */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm"
          >
            &larr; Back to Blog
          </Link>
          <Link
            href="/blog/automate-client-follow-up-uk-service-businesses"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm"
          >
            Read: Automate Client Follow-Up &rarr;
          </Link>
          <Link
            href="/blog/invoice-case-study"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm"
          >
            Read: Invoice Automation Case Study &rarr;
          </Link>
          <Link
            href="/ai-automation-for-roofers-uk"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm"
          >
            AI Automation for Roofers &rarr;
          </Link>
        </div>

      </article>
    </main>
  )
}
