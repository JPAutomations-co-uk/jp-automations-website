import Image from "next/image"
import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "AI Automation for Roofing Companies in the UK",
  description:
    "How UK roofing contractors are using AI automation for quoting, scheduling, invoicing, and client management — without hiring more office staff.",
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
  datePublished: "2026-03-19",
  dateModified: "2026-03-19",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.jpautomations.co.uk/blog/ai-automation-roofing-companies-uk",
  },
  keywords: [
    "AI automation roofing companies UK",
    "roofing CRM UK",
    "automate roofing business",
    "roofing contractor automation",
    "AI for roofers UK",
    "roofing job management software",
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What's the first thing a roofing company should automate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lead acknowledgement. An automated reply to every enquiry within 2 minutes — confirming you received it and setting expectations. This alone prevents the majority of lost leads, costs almost nothing to set up, and doesn't require any new software.",
      },
    },
    {
      "@type": "Question",
      name: "How much does automation cost for a roofing business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A basic automation stack (email sequences, SMS reminders, invoice chasing) costs £50-150/month in software. A bespoke system built by an automation agency is typically £3,000-8,000 one-off with minimal ongoing costs. Most roofing businesses see ROI within 60-90 days through recovered revenue and reduced admin.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to replace my existing tools to automate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Good automation connects the tools you already use — Xero, Google Sheets, your phone, email. The goal is to wire them together so data flows automatically, not to replace everything with one expensive platform.",
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
          <Link href="/blog" className="text-sm text-gray-400 hover:text-teal-400 transition">
            &larr; Back to all articles
          </Link>
        </div>

        {/* Hero */}
        <div className="mb-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <Image
              src="/blog/ai-automation-roofing-companies-uk.jpg"
              alt="AI automation for roofing companies in the UK"
              width={1200}
              height={750}
              priority
              className="w-full aspect-[16/10] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>

        {/* Title */}
        <header className="mb-12">
          <p className="text-sm text-gray-400 mb-4">Published 19 March 2026</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-teal-400">AI Automation</span> for Roofing Companies in the UK
          </h1>
        </header>

        {/* Intro */}
        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            Running a roofing company in the UK means juggling enquiries, site visits, quotes, materials, scheduling, invoicing, and chasing payments — often while you&apos;re physically on a roof.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            Most roofing contractors hire office staff to manage admin. But admin staff don&apos;t scale well — they get overwhelmed during busy periods, and you&apos;re still paying them during quiet ones. The processes themselves are the problem. They&apos;re manual, repetitive, and disconnected.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            AI automation fixes the processes, not the headcount. Here&apos;s what that looks like for a UK roofing business — and the order to do it in.
          </p>
        </section>

        {/* Section 1 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            The Admin Problem in Roofing
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            A typical roofing contractor doing £20-40k per month has these admin processes running every single week:
          </p>
          <div className="space-y-4 mb-6">
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">Enquiry handling</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Calls, emails, website forms, Facebook messages. Each one needs acknowledging, qualifying, and responding to — ideally within hours, realistically within days.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">Quoting</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Site visit, measurements, materials calculation, labour costing, writing up the quote, sending it, following up when they don&apos;t respond. Each quote takes 1-3 hours including travel.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">Scheduling</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Coordinating crew availability, weather windows, material deliveries, and client access. Usually managed through a combination of WhatsApp groups and memory.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">Invoicing and payment chasing</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Creating invoices, sending them, following up at 7 days, 14 days, 30 days. The average UK trade business has £3,000-8,000 outstanding at any given time because chasing payments falls off during busy periods.
              </p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Each of these processes is repetitive, time-sensitive, and follows a predictable pattern. That&apos;s exactly what automation is built for.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            What to Automate First (And What to Leave)
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            The biggest mistake roofing companies make is trying to automate everything at once. Start with the processes that have the highest impact and lowest complexity:
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Priority 1: Lead acknowledgement</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automated reply to every enquiry within 2 minutes. Confirms receipt, sets expectations, links to your portfolio. This alone stops the majority of lead loss. One afternoon to set up.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Priority 2: Invoice chasing</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automated reminders at 7, 14, and 30 days after invoice. Connects to Xero, QuickBooks, or even a Google Sheet. We built this for a roofing contractor who{" "}
                <Link href="/blog/invoice-case-study" className="text-teal-400 hover:underline">
                  recovered £2,995 in the first month
                </Link>.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Priority 3: Review collection</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automated SMS after every completed job asking for a Google review.{" "}
                <Link href="/blog/automate-google-reviews-uk-trades" className="text-teal-400 hover:underline">
                  Full system breakdown here
                </Link>. Reviews compound your local SEO ranking — more reviews means more calls.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Priority 4: Quote follow-up</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automated sequence after sending a quote: value email at day 2, check-in at day 5, final follow-up at day 10. Recovers quotes that would otherwise go cold because you got busy.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Priority 5: Client updates</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automated SMS to the client before the job (confirming date and crew arrival time) and after (confirming completion, attaching photos). Eliminates &quot;when are you coming?&quot; calls.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            The Numbers: What Automation Saves a Roofing Business
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            For a roofing contractor doing 8-15 jobs per month, automation typically delivers:
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">15-25</p>
              <p className="text-gray-400 text-xs mt-1">hours saved per week</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">£2-5k</p>
              <p className="text-gray-400 text-xs mt-1">recovered per month from late invoices</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">3x</p>
              <p className="text-gray-400 text-xs mt-1">more Google reviews per month</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">90%</p>
              <p className="text-gray-400 text-xs mt-1">of quotes followed up (vs ~30% manually)</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            These aren&apos;t theoretical. They&apos;re based on what we&apos;ve seen building{" "}
            <Link href="/ai-automation-for-service-businesses" className="text-teal-400 hover:underline">
              AI automation systems for UK service businesses
            </Link>. The exact numbers vary by business size, but the pattern is consistent.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            What Not to Automate
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Not everything should be automated. In roofing specifically, these things work better with a human touch:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
            <li><strong>The site visit itself</strong> — clients expect to meet you in person before a big roofing job</li>
            <li><strong>Complex quoting</strong> — materials, labour, and access vary too much for templated quotes on large jobs</li>
            <li><strong>Complaint handling</strong> — automated responses to complaints feel dismissive. Handle these personally</li>
            <li><strong>Relationship building</strong> — the post-job &quot;thanks, anything else you need?&quot; call still matters for referrals</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            The goal isn&apos;t to remove the human from your business. It&apos;s to remove the human from the repetitive, low-value tasks so you can focus on the high-value ones — winning work and delivering quality.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            How It All Connects
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The real power of automation isn&apos;t individual tools — it&apos;s connecting them into a single system. Here&apos;s what a fully automated roofing business looks like:
          </p>
          <div className="border border-white/10 rounded-2xl p-6 mb-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              <strong className="text-white">Enquiry comes in</strong> → auto-acknowledged in 2 minutes → lead added to pipeline → site visit booked via calendar link → quote sent after visit → automated follow-up at day 2, 5, 10 → job accepted → client gets pre-job SMS → job completed → invoice sent via Xero → auto-chase at 7, 14, 30 days → review request sent 4 hours after completion → review collected → client added to annual maintenance reminder list.
            </p>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Every step that doesn&apos;t require your judgement happens automatically. You only appear at two points: the site visit and the actual roofing work. Everything else runs without you.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">What should a roofing company automate first?</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Lead acknowledgement. An automated reply within 2 minutes to every enquiry — confirming receipt and setting expectations. Costs almost nothing. Prevents the majority of lost leads.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">How much does automation cost for a roofing business?</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                A basic stack costs £50-150/month in software. A bespoke system built by an agency is typically £3,000-8,000 one-off. Most see ROI within 60-90 days through recovered revenue and reduced admin.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Do I need to replace my existing tools?</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                No. Good automation connects what you already use — Xero, Google Sheets, your phone, email. The goal is wiring them together so data flows automatically.
              </p>
            </div>
          </div>
        </section>

        {/* Closing callout */}
        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Roofing is one of the most automatable trades in the UK. The admin is repetitive, the processes are predictable, and the cost of doing it manually — in lost leads, late invoices, and missed reviews — is enormous.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Start with the highest-impact automations first. Build them in order. Within 90 days, your business runs differently.
          </p>
        </section>

        {/* CTA */}
        <section className="mb-20 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8 text-center">
          <p className="text-white font-semibold text-lg mb-2">
            Want this built for your roofing business?
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            We design and build complete automation systems for UK roofing contractors — from first enquiry to five-star review, running without you.
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
            href="/blog/invoice-case-study"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm"
          >
            Read: Invoice Automation Case Study &rarr;
          </Link>
          <Link
            href="/blog/automate-google-reviews-uk-trades"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm"
          >
            Read: Automate Google Reviews &rarr;
          </Link>
        </div>

      </article>
    </main>
  )
}
