import { Metadata } from "next"
import Link from "next/link"

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Agency Leeds — AI Automation for Leeds Businesses",
  description:
    "JP Automations is an AI agency serving Leeds and Yorkshire. We build bespoke automation systems for service businesses — lead generation, invoicing, CRM, follow-up, and operations.",
  provider: {
    "@type": "ProfessionalService",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
  areaServed: {
    "@type": "City",
    name: "Leeds",
  },
  serviceType: "AI Automation Agency",
  offers: {
    "@type": "Offer",
    description: "Bespoke AI automation systems for Leeds and Yorkshire service businesses",
    areaServed: { "@type": "City", name: "Leeds" },
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is there an AI agency based in Leeds?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JP Automations serves Leeds businesses remotely with bespoke AI automation systems. We build lead generation, invoicing, CRM, and operations systems specifically designed for service businesses across Leeds and the wider Yorkshire region. All systems are built and deployed digitally, so you get the same hands-on service without geographical limitations.",
      },
    },
    {
      "@type": "Question",
      name: "How much does AI automation cost for a Leeds business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI automation systems for Leeds service businesses typically start from a few thousand pounds for core workflows like lead handling, invoicing, and follow-up. Most clients see full return on investment within 90 days through recovered revenue and reclaimed admin hours. There are no ongoing subscription fees for the systems we build.",
      },
    },
    {
      "@type": "Question",
      name: "What types of Leeds businesses benefit most from AI automation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Service businesses and trade companies across Leeds and Yorkshire see the biggest gains — construction firms, roofing contractors, cleaning companies, electrical and plumbing businesses, property managers, landscapers, and professional consultancies. Any business that relies on lead follow-up, invoicing, and client communication can reclaim 25+ hours per week with the right automation systems.",
      },
    },
  ],
}

export const metadata: Metadata = {
  title: { absolute: "AI Agency Leeds — AI Automation for Leeds Businesses | JP Automations" },
  description:
    "AI agency Leeds: JP Automations builds bespoke AI automation systems for service businesses across Leeds and Yorkshire. Lead generation, invoicing, CRM, and operations automated. ROI within 90 days.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-agency-leeds",
  },
  openGraph: {
    title: "AI Agency Leeds — AI Automation for Leeds Businesses | JP Automations",
    description:
      "JP Automations is an AI agency serving Leeds and Yorkshire. Bespoke automation systems for service businesses. £10k+ recovered in month one. 25+ hours reclaimed per week.",
    url: "https://www.jpautomations.co.uk/ai-agency-leeds",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=AI+Agency+Leeds&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "AI Agency Leeds — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agency Leeds — AI Automation for Leeds Businesses",
    description:
      "JP Automations: AI agency serving Leeds and Yorkshire. Bespoke automation for service businesses — lead gen, invoicing, CRM, and more.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Agency+Leeds&subtitle=JP+Automations"],
  },
}

export default function Page() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <div className="mb-10">
        <Link href="/" className="text-sm text-gray-400 hover:text-teal-400 transition">
          &larr; Home
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-16">
        <p className="text-teal-400 text-xs tracking-[0.25em] uppercase mb-4 font-medium">
          AI Agency Leeds
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          AI Agency in Leeds
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
          Leeds sits at the heart of Yorkshire&apos;s commercial landscape — a city built on
          professional services, financial firms, and a rapidly expanding digital economy. But
          behind every thriving Leeds business is an operation drowning in admin. JP Automations
          is an <strong className="text-white">AI agency serving Leeds</strong> that builds
          bespoke automation systems to take that operational weight off your shoulders entirely.
        </p>
      </div>

      {/* Why Leeds */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Why Leeds Businesses Need AI Automation
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Leeds is Yorkshire&apos;s business capital. The city&apos;s economy generates over
          &pound;29 billion annually, powered by a mix of professional services, construction,
          property, and a growing wave of trade businesses serving both the city and surrounding
          areas like Bradford, Wakefield, Harrogate, and Huddersfield.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          That growth creates a problem. More leads coming in means more quotes to send, more
          jobs to track, more invoices to chase. Leeds service businesses are competing in a
          region where speed of response wins the job. If you&apos;re taking three hours to
          reply to an enquiry because you&apos;re on site in Headingley or finishing a project
          in Roundhay, you&apos;re handing that job to a competitor who replied in five minutes.
        </p>
        <p className="text-gray-400 leading-relaxed">
          AI automation solves this at the infrastructure level. Instead of hiring more admin
          staff or trying to reply to messages between jobs, your systems handle the entire
          workflow — from first enquiry to final payment — without you touching a thing. That
          is what we build for Leeds businesses.
        </p>
      </section>

      {/* Services */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">
          AI Automation Services for Leeds Businesses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Lead Generation &amp; Capture</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every enquiry from your website, Google Business Profile, or social media is
              captured instantly, acknowledged within minutes, qualified by AI, and followed up
              persistently. No more leads going cold while you&apos;re across the city on a job.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Invoice &amp; Payment Automation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Invoices generated and sent the moment work completes. Automated reminders at 7,
              14, and 30 days. One of our clients recovered &pound;10,000 in overdue payments
              within the first month — money that had been sitting in unpaid invoices for weeks.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">CRM &amp; Job Pipeline</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              From enquiry to quote to job completion, your pipeline updates itself. Clients
              receive status updates automatically. Your team gets job assignments without
              chasing. You get a clear view of every active project without spreadsheets.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Follow-Up &amp; Review Sequences</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Automated Google review requests after every completed job. Re-engagement messages
              to previous clients. Referral prompts timed perfectly. Your online reputation
              compounds without you lifting a finger.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">WhatsApp &amp; Multi-Channel Comms</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Meet your Leeds clients where they are. WhatsApp, email, and SMS messages triggered
              at exactly the right time — confirmations, reminders, follow-ups — all in your
              voice, all logged in one place.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">AI Phone Answering</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              An AI receptionist that answers every call, qualifies enquiries, provides quotes,
              and books jobs directly into your calendar. Whether it&apos;s 7am or 9pm, no call
              goes unanswered and no opportunity slips through.
            </p>
          </div>
        </div>
      </section>

      {/* Leeds Industries */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Industries We Serve in Leeds &amp; Yorkshire
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          We work with service businesses and trade companies across Leeds, West Yorkshire, and
          the broader Yorkshire region. If your business runs on enquiries, quotes, jobs, and
          invoices, our systems are built for you:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            "Construction firms and building contractors",
            "Roofing contractors and flat roof specialists",
            "Commercial and domestic cleaning companies",
            "Property management and lettings agencies",
            "Electrical contractors and plumbing businesses",
            "Landscaping and grounds maintenance",
            "Consulting and professional service firms",
            "HVAC, heating engineers, and gas specialists",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-gray-400">
              <span className="text-teal-400 flex-shrink-0">&rarr;</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-400 leading-relaxed">
          Whether you operate in the city centre, out towards Otley, across to Pudsey, or
          anywhere in the wider Yorkshire region, our systems are built and deployed remotely.
          You get the same dedicated service regardless of location — every system is digital,
          every handover is thorough, and ongoing support works around your schedule.
        </p>
      </section>

      {/* Results */}
      <section className="mb-16 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Results Our AI Systems Deliver</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-teal-400">25+</p>
            <p className="text-gray-400 text-xs mt-1">hours saved per week</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-teal-400">&pound;10k+</p>
            <p className="text-gray-400 text-xs mt-1">recovered in month one</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-teal-400">30</p>
            <p className="text-gray-400 text-xs mt-1">days to go live</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-teal-400">90</p>
            <p className="text-gray-400 text-xs mt-1">day ROI guarantee</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          These numbers come from real UK service businesses — not projections. Our invoicing
          automation alone has recovered tens of thousands in unpaid invoices that business
          owners had written off as lost.
        </p>
        <Link
          href="/blog/invoice-case-study"
          className="inline-flex items-center gap-2 text-teal-400 font-semibold hover:underline text-sm"
        >
          Read the full case study &rarr;
        </Link>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">How We Work With Leeds Businesses</h2>
        <div className="space-y-6">
          {[
            { step: "01", title: "Free Audit Call", body: "We walk through your current operations and identify where time, money, and leads are leaking. This is a genuine audit, not a sales pitch. You will leave with a clear picture of what automation can do for your specific business." },
            { step: "02", title: "System Design", body: "We architect your complete automation system — every trigger, workflow, and integration mapped out before a single line is built. You approve the design so there are no surprises." },
            { step: "03", title: "Build & Deploy", body: "Your systems are built, tested against real scenarios, and deployed within 30 days. The entire build runs alongside your normal operations with zero disruption to your team or clients." },
            { step: "04", title: "Handover & Ownership", body: "Full documentation, video walkthroughs, and live training. After handover, you own every system outright. No monthly retainers, no lock-in contracts, no dependency on us to keep things running." },
          ].map((item) => (
            <div key={item.step} className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-400/10 border border-teal-400/30 flex items-center justify-center text-teal-400 font-bold text-xs">
                {item.step}
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Remote Delivery Note */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Serving Leeds Remotely, Without Compromise
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Every system we build is designed, built, and deployed digitally. That means Leeds
          businesses get the same dedicated, founder-led service as clients anywhere in the UK
          — no watered-down version, no outsourced support. Audit calls happen over video. Build
          progress is shared in real-time. Handovers include live walkthroughs and recorded
          documentation.
        </p>
        <p className="text-gray-400 leading-relaxed">
          The automation systems themselves are entirely cloud-based. They run 24/7 without
          any hardware, local servers, or IT setup on your end. Your team accesses everything
          through tools you already use — WhatsApp, email, Xero, Google Workspace — and the
          automations work silently in the background, handling the repetitive work that used to
          eat into your evenings and weekends.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {[
            { q: "Is there an AI agency based in Leeds?", a: "JP Automations serves Leeds businesses remotely with bespoke AI automation systems. We build lead generation, invoicing, CRM, and operations systems specifically designed for service businesses across Leeds and the wider Yorkshire region. All systems are built and deployed digitally, so you get the same hands-on service without geographical limitations." },
            { q: "How much does AI automation cost for a Leeds business?", a: "AI automation systems for Leeds service businesses typically start from a few thousand pounds for core workflows like lead handling, invoicing, and follow-up. Most clients see full return on investment within 90 days through recovered revenue and reclaimed admin hours. There are no ongoing subscription fees for the systems we build." },
            { q: "What types of Leeds businesses benefit most from AI automation?", a: "Service businesses and trade companies across Leeds and Yorkshire see the biggest gains — construction firms, roofing contractors, cleaning companies, electrical and plumbing businesses, property managers, landscapers, and professional consultancies. Any business that relies on lead follow-up, invoicing, and client communication can reclaim 25+ hours per week with the right automation systems." },
          ].map((item) => (
            <div key={item.q}>
              <h3 className="text-white font-semibold mb-2">{item.q}</h3>
              <p className="text-gray-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-10 text-center mb-16">
        <p className="text-white font-semibold text-xl mb-3">
          Ready to automate your Leeds business?
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
          Book a free audit call. We&apos;ll map your workflows, identify the automations that
          will save you the most time and money, and show you exactly what we&apos;d build —
          no obligation.
        </p>
        <Link
          href="/book-call"
          className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition"
        >
          Book a Free Audit Call &rarr;
        </Link>
      </section>

      {/* Internal links */}
      <section>
        <p className="text-gray-500 text-sm mb-4">Learn more</p>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <Link href="/ai-agency-uk" className="text-teal-400 hover:underline text-sm">
            AI Agency UK &rarr;
          </Link>
          <Link href="/ai-automation-for-service-businesses" className="text-teal-400 hover:underline text-sm">
            AI Automation for Service Businesses &rarr;
          </Link>
          <Link href="/blog/invoice-case-study" className="text-teal-400 hover:underline text-sm">
            Case Study: &pound;10k Recovered in Month One &rarr;
          </Link>
        </div>
      </section>
    </main>
  )
}
