import Image from "next/image"
import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "From Quote to Paid: How UK Tradesmen Are Automating the Entire Job Lifecycle",
  description: "The full job lifecycle automated — from enquiry to quote to invoice to payment. How UK tradespeople eliminate admin between jobs.",
  author: { "@type": "Person", name: "JP", url: "https://www.jpautomations.co.uk", sameAs: "https://www.linkedin.com/in/james-harvey-0583b2370/" },
  publisher: { "@type": "Organization", name: "JP Automations", logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" } },
  datePublished: "2026-04-02",
  dateModified: "2026-04-02",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.jpautomations.co.uk/blog/automate-quoting-invoicing-uk-trades" },
  keywords: ["automate quoting UK trades", "invoice automation tradesman", "quote to cash automation", "job lifecycle automation", "trade business admin automation"],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I automate quoting for complex jobs?",
      acceptedAnswer: { "@type": "Answer", text: "Partially. For standard jobs with predictable scope (boiler service, gutter clean, standard re-roof), templated quotes with variable pricing work well. For complex, bespoke jobs, automation handles the template and calculations — you add the custom elements. The follow-up after sending the quote is fully automatable regardless of complexity." },
    },
    {
      "@type": "Question",
      name: "What's the best invoicing tool for UK tradespeople?",
      acceptedAnswer: { "@type": "Answer", text: "Xero and QuickBooks are the most popular for UK trades because they handle VAT, CIS deductions, and MTD compliance. Both have APIs that integrate with automation platforms. FreeAgent is a good alternative for sole traders. The key is choosing one that connects to your other tools — the invoicing tool itself matters less than the automation around it." },
    },
    {
      "@type": "Question",
      name: "How much revenue do tradespeople lose to late invoices?",
      acceptedAnswer: { "@type": "Answer", text: "The average UK trade business has £3,000-8,000 outstanding at any given time. Automated payment reminders at 7, 14, and 30 days typically recover 60-80% of overdue invoices that would otherwise require manual chasing or write-off." },
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
            <Image src="/blog/automate-quoting-invoicing-uk-trades.jpg" alt="Automate quoting and invoicing for UK trades" width={1200} height={750} priority className="w-full aspect-[16/10] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>

        <header className="mb-12">
          <p className="text-sm text-gray-400 mb-4">Published 2 April 2026</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            From Quote to Paid: How UK Tradesmen Are{" "}
            <span className="text-teal-400">Automating the Entire Job Lifecycle</span>
          </h1>
        </header>

        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            The job itself takes a day. The admin around it takes a week.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            Enquiry comes in. You respond (eventually). Arrange a site visit. Measure up. Calculate materials and labour. Write the quote. Send it. Chase when they don&apos;t respond. They accept. Book the job. Order materials. Do the work. Write the invoice. Send it. Chase payment at 7 days. Chase again at 14. Maybe a third time at 30.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            Every step between &quot;enquiry&quot; and &quot;paid&quot; is admin. And most of it follows the same pattern every single time. That pattern is what makes it automatable.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The 6 Stages of the Job Lifecycle</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Every trade job — from a boiler service to a full re-roof — follows the same lifecycle. Here&apos;s each stage and what can be automated within it.
          </p>
          <div className="space-y-6">
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">1. Enquiry → Acknowledgement</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                <strong>Manual version:</strong> You read the enquiry at 9pm and reply from your sofa.<br />
                <strong>Automated version:</strong> Within 2 minutes of the enquiry, the lead gets a personalised response confirming receipt, setting expectations, and sharing your portfolio. 24/7. No action from you.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">2. Site Visit → Quote</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                <strong>Manual version:</strong> You measure up, go home, open Excel, calculate materials, type it up, email it.<br />
                <strong>Automated version:</strong> A quote template with variable fields (dimensions, materials, labour rate) auto-calculates the total. You input the specifics on site, hit send. The client gets a professional branded PDF in minutes, not days.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">3. Quote → Follow-Up</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                <strong>Manual version:</strong> You forget to follow up. The quote expires. The client went with someone who chased.<br />
                <strong>Automated version:</strong> Day 2: value email with a relevant case study. Day 5: friendly check-in. Day 10: final follow-up with a soft deadline. 90% of quotes get followed up (vs ~30% manually).
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">4. Job Booking → Client Updates</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                <strong>Manual version:</strong> You text the client the day before. Sometimes you forget. They call asking when you&apos;re arriving.<br />
                <strong>Automated version:</strong> Booking confirmation sent immediately. Reminder 24 hours before with arrival time and crew details. Post-job completion message with photos. Zero &quot;when are you coming?&quot; calls.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">5. Job Complete → Invoice + Payment</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                <strong>Manual version:</strong> You write the invoice in Xero three days later. Payment terms are 14 days. You chase manually at 21 days. Money arrives at 35 days — if at all.<br />
                <strong>Automated version:</strong> Invoice generated and sent within hours of completion. Payment link included. Automated reminders at 7, 14, and 30 days. We built this for a roofing contractor who{" "}
                <Link href="/blog/invoice-case-study" className="text-teal-400 hover:underline">recovered £2,995 in month one</Link>.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">6. Payment → Review + Repeat</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                <strong>Manual version:</strong> You don&apos;t ask for a review. You forget about the client until they call again (if they do).<br />
                <strong>Automated version:</strong>{" "}
                <Link href="/blog/automate-google-reviews-uk-trades" className="text-teal-400 hover:underline">Review request sent 4 hours after completion</Link>. Client added to annual service reminder list. 12 months later, they get a message: &quot;Hi [name], it&apos;s been a year since we did your roof. Want us to do an inspection?&quot;
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Automating One Stage Isn&apos;t Enough</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Most tradespeople who try automation pick one thing — usually invoicing or appointment reminders. That&apos;s better than nothing, but the real value comes from connecting the stages.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            When the quote acceptance automatically triggers job scheduling, which triggers the client confirmation, which triggers the invoice on completion, which triggers the payment chase, which triggers the review request — you have a system. Information flows from one stage to the next without anyone re-entering it, forwarding it, or remembering to do it.
          </p>
          <p className="text-gray-400 leading-relaxed">
            That&apos;s the difference between &quot;using a few tools&quot; and &quot;having{" "}
            <Link href="/ai-automation-for-service-businesses" className="text-teal-400 hover:underline">a system that runs your business</Link>.&quot;
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Tools That Make It Work</h2>
          <p className="text-gray-400 leading-relaxed mb-4">A typical automation stack for a UK trade business:</p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>Invoicing:</strong> Xero or QuickBooks (handles VAT, CIS, MTD compliance)</li>
            <li><strong>Quoting:</strong> YourTradebase, Tradify, or a custom Google Sheets template</li>
            <li><strong>Scheduling:</strong> Google Calendar or Calendly for booking</li>
            <li><strong>Communication:</strong> SMS via Twilio or WhatsApp Business API</li>
            <li><strong>Automation glue:</strong> Make or n8n to wire everything together</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            You don&apos;t need to replace your existing tools. Good automation connects what you already use. The goal is data flowing between them automatically — not buying one more subscription.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Can I automate quoting for complex jobs?</p>
              <p className="text-gray-400 text-sm leading-relaxed">Partially. Standard jobs work great with templated quotes. For complex jobs, automation handles the template and calculations — you add custom elements. The follow-up after sending is fully automatable regardless.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">What&apos;s the best invoicing tool for UK trades?</p>
              <p className="text-gray-400 text-sm leading-relaxed">Xero and QuickBooks are most popular — they handle VAT, CIS, and MTD. Both integrate with automation platforms. The tool matters less than the automation around it.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">How much revenue do tradespeople lose to late invoices?</p>
              <p className="text-gray-400 text-sm leading-relaxed">The average UK trade business has £3,000-8,000 outstanding at any time. Automated reminders at 7, 14, and 30 days recover 60-80% of overdue invoices.</p>
            </div>
          </div>
        </section>

        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The job lifecycle for a trade business is the same every time. Enquiry, quote, job, invoice, payment, review. Automating this end-to-end doesn&apos;t just save time — it eliminates the revenue leaks hiding between each stage.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Build the system once. Every job flows through it. You focus on the work. The admin handles itself.
          </p>
        </section>

        <section className="mb-20 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8 text-center">
          <p className="text-white font-semibold text-lg mb-2">Want the full lifecycle automated for your business?</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            We build end-to-end automation systems for UK trade businesses — from first enquiry to five-star review, everything connected and running without you.
          </p>
          <Link href="/book-call" className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition">Book a Free Call &rarr;</Link>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">&larr; Back to Blog</Link>
          <Link href="/blog/invoice-case-study" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: Invoice Automation Case Study &rarr;</Link>
          <Link href="/blog/business-process-automation-uk-service-businesses" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: 5 Processes to Automate &rarr;</Link>
        </div>
      </article>
    </main>
  )
}
