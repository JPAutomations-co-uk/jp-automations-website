import Image from "next/image"
import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How UK Builders Are Automating CIS and Job Costing",
  description:
    "UK builders and general contractors are using AI to track job margins in real time and eliminate CIS admin. Here's how it works and what it costs.",
  author: {
    "@type": "Organization",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
  publisher: {
    "@type": "Organization",
    name: "JP Automations",
    logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" },
  },
  datePublished: "2026-04-30",
  dateModified: "2026-04-30",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.jpautomations.co.uk/blog/cis-job-costing-automation-builders-uk",
  },
  keywords: [
    "CIS automation builders UK",
    "job costing automation UK",
    "CIS deductions software UK",
    "builders admin automation",
    "AI for construction UK",
    "subcontractor CIS UK",
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can CIS deductions be calculated automatically?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Once your subcontractor details and payment schedule are set up in the system, CIS deductions are calculated automatically per subcontractor per pay period. Monthly returns are pre-compiled and ready for submission to HMRC — no manual calculation required.",
      },
    },
    {
      "@type": "Question",
      name: "What does job costing automation actually track?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Labour hours against estimate, materials spend against budget, and overall job margin in real time. The system alerts you when a job starts overspending — before it's too late to adjust the scope, not after the job's done and the margin is already gone.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to switch software to use this?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The automation is built on top of your existing tools — Xero, Tradify, Buildertrend, or whatever you currently use. No new platforms to learn, no data migration.",
      },
    },
  ],
}

export default function BlogPost() {
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
        <div className="mb-10 text-sm text-gray-400">
          <span>Published 30 April 2026</span>
        </div>

        <div className="mb-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <Image
              src="/blog/cis-job-costing-automation-builders-uk.jpg"
              alt="CIS and job costing automation for UK builders"
              width={1200}
              height={750}
              priority
              className="w-full aspect-[16/10] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            How UK Builders Are Automating{" "}
            <span className="text-teal-400">CIS and Job Costing</span>
          </h1>
        </header>

        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            Most builders quote a job, do the work, and find out the margin when the accountant does the end-of-year figures.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            By then, it's too late to do anything about it.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            A Bristol general contractor we worked with quoted a kitchen extension at £22,000. Five weeks later, the job was done. The profit was £900. Materials ran over, a subbie needed an extra day, and nobody noticed until it was too late to adjust.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            This is the norm, not the exception. And CIS makes it worse — calculating deductions for multiple subbies across multiple jobs, every month, is hours of admin that most builders do at 9pm the night before the 19th.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            Here&apos;s how builders are fixing both problems with automation.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            The Two Problems Builders Don&apos;t Talk About
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Every builder JP speaks to has some version of these two issues:
          </p>
          <h3 className="text-xl font-semibold mb-3 text-white">Problem 1: No real-time job visibility</h3>
          <p className="text-gray-400 leading-relaxed mb-4">
            You quote a job. Materials get ordered. Labour happens. But unless someone is manually tallying costs as they go, you have no idea if the job is profitable until it&apos;s complete.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Most builders find out a job went wrong when the invoice goes to the client and the numbers don&apos;t add up. At that point, the only options are absorb the loss or have an uncomfortable conversation.
          </p>
          <h3 className="text-xl font-semibold mb-3 text-white">Problem 2: CIS is a monthly nightmare</h3>
          <p className="text-gray-400 leading-relaxed mb-4">
            The Construction Industry Scheme is straightforward in principle. In practice, calculating deductions across multiple subbies, tracking their verification statuses, compiling the monthly return, and filing on time — every month — is a genuine time sink.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Most builders either pay their accountant to do it (expensive), do it themselves (time-consuming), or do it wrong and get penalties from HMRC (costly).
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            What Job Costing Automation Actually Does
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            A job costing system tracks three things against your original quote, in real time:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Labour hours (from timesheets or job updates)</li>
            <li>Materials spend (from supplier invoices or purchase orders)</li>
            <li>Subcontractor costs (from agreed rates + actual time)</li>
          </ul>
          <p className="text-gray-400 leading-relaxed mb-4">
            When any of these starts to drift from the quote, the system flags it. Not at the end of the job — when it&apos;s happening.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            For the Bristol contractor we mentioned: within two quarters of running job costing, he identified two jobs running at 4% margin early enough to have a scope conversation with the client. Average margin went from 8% to 16%.
          </p>
          <p className="text-gray-400 leading-relaxed">
            That&apos;s not a small difference. On a £500k/year business, that&apos;s £40,000 more profit — from the same jobs, the same team, the same workload.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            How CIS Automation Works
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            CIS automation connects to your payroll or payment records and handles everything after you confirm a payment:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Pulls the subcontractor&apos;s verification status from HMRC (20% or 30% deduction rate)</li>
            <li>Calculates the deduction on the labour element of each payment</li>
            <li>Generates a payment statement for the subbie (clear, professional, on time)</li>
            <li>Adds it to the monthly return automatically</li>
            <li>Pre-compiles the return for submission on the 19th</li>
          </ul>
          <p className="text-gray-400 leading-relaxed mb-4">
            The result: no manual calculation. No spreadsheet. No panic on the 19th. No HMRC penalties.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The Bristol contractor went from treating the 19th as a stressful deadline to a non-event. His subbies started preferring to work with him over other contractors — because they always got clear, on-time payment statements. He ended up getting first pick of the best tradespeople in the area.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            What This Looks Like in Practice
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Here&apos;s a typical day for a builder running these systems:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-3 mb-6">
            <li>Morning: dashboard shows three active jobs with current spend vs budget. One is at 78% of budget with 60% of work done — fine. One is at 92% of budget with 70% done — worth a look.</li>
            <li>Materials invoice arrives from a supplier: auto-matched to the correct job, spend updated.</li>
            <li>Subbie completes two days on a job: hours logged, CIS calculation queued.</li>
            <li>End of the month: CIS return is pre-compiled. Review it in 10 minutes, submit.</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            No spreadsheets. No mental load. No surprises at the end of a job.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Who This Is For
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Job costing + CIS automation is most valuable for:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>General contractors running 2+ simultaneous jobs</li>
            <li>Builders with 2+ regular subcontractors on CIS</li>
            <li>Anyone who&apos;s had an HMRC penalty or a near-miss on CIS</li>
            <li>Businesses where the owner is doing CIS calculations manually</li>
            <li>Contractors who genuinely don&apos;t know their margin until the job is done</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            If you run one job at a time with no subbies, the ROI is lower. But if you match any of the above, the time saved and margin recovered pays for itself within the first couple of months.
          </p>
        </section>

        <section className="mb-16 border-l-2 border-teal-400 pl-6">
          <h2 className="text-3xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Builders make money by doing good work. They lose money by not tracking what the good work actually costs until it&apos;s too late to do anything about it.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Job costing automation gives you visibility while a job is running. CIS automation removes the monthly admin burden entirely. Together, they&apos;re the two systems that make a building business feel like it&apos;s actually under control.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The Bristol contractor put it simply: &ldquo;I finally feel like I&apos;m running a business, not just doing jobs.&rdquo;
          </p>
        </section>

        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can CIS deductions be calculated automatically?</h3>
              <p className="text-gray-400 leading-relaxed">Yes. Once your subcontractor details and payment schedule are set up, CIS deductions are calculated automatically per subcontractor per pay period. Monthly returns are pre-compiled and ready for submission to HMRC — no manual calculation required.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What does job costing automation actually track?</h3>
              <p className="text-gray-400 leading-relaxed">Labour hours against estimate, materials spend against budget, and overall job margin in real time. The system alerts you when a job starts overspending — before it&apos;s too late to adjust the scope, not after the job&apos;s done and the margin is already gone.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do I need to switch software to use this?</h3>
              <p className="text-gray-400 leading-relaxed">No. The automation is built on top of your existing tools — Xero, Tradify, Buildertrend, or whatever you currently use. No new platforms to learn, no data migration.</p>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-3">Want to See What This Looks Like for Your Business?</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Book a free audit call. We&apos;ll map your current job costing and CIS process, identify exactly where the leaks are, and show you what a connected system would look like for your setup.
          </p>
          <Link
            href="/book-call"
            className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition"
          >
            Book a Free Call &rarr;
          </Link>
        </section>

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
            href="/ai-automation-for-builders-uk"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm"
          >
            AI Automation for Builders &rarr;
          </Link>
        </div>
      </article>
    </main>
  )
}
