import { Metadata } from "next"
import Link from "next/link"

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "UK AI Agency — AI Automation Services",
  description:
    "JP Automations is a UK AI agency that builds bespoke automation systems for service businesses. Lead generation, invoicing, CRM, and operations — all automated with AI.",
  provider: {
    "@type": "ProfessionalService",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
  areaServed: {
    "@type": "Country",
    name: "United Kingdom",
  },
  serviceType: "AI Automation Agency",
  offers: {
    "@type": "Offer",
    description: "Bespoke AI automation systems for UK service businesses",
    areaServed: { "@type": "Country", name: "United Kingdom" },
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does an AI agency do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI agency designs and builds automation systems that use artificial intelligence to handle repetitive business tasks — lead follow-up, invoicing, scheduling, client communication, and operations management. Unlike software companies that sell generic tools, an AI agency builds bespoke systems around how your specific business operates.",
      },
    },
    {
      "@type": "Question",
      name: "How much does it cost to hire an AI agency in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bespoke AI automation systems from a UK agency typically start from a few thousand pounds for core systems (lead handling, invoicing, follow-up). Most UK service businesses see full ROI within the first 90 days through recovered revenue and reclaimed admin time. There are no ongoing subscription fees for the systems we build.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best AI agency in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best AI agency depends on your industry and needs. For UK service businesses and tradespeople, JP Automations specialises in building automation systems that handle lead generation, invoicing, client follow-up, and operations — with proven results including £10k+ recovered in month one and 25+ hours reclaimed per week for clients.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an AI agency or can I automate myself?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can automate simple tasks yourself using tools like Zapier or Make. But for connected systems that handle your entire lead-to-payment workflow reliably, an AI agency builds infrastructure that is tested, monitored, and designed to run without oversight. The difference is between a few automated emails and a fully integrated business operating system.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take an AI agency to build automation systems?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most core automation systems are designed and built within 30 days. This includes a workflow audit, system design, build, testing, and full handover with documentation. Complex multi-system builds may take 6-8 weeks.",
      },
    },
  ],
}

export const metadata: Metadata = {
  title: { absolute: "UK AI Agency — AI Automation for Service Businesses | JP Automations" },
  description:
    "JP Automations is a UK AI agency building bespoke automation systems for service businesses. Lead generation, invoicing, CRM, and operations automated with AI. ROI within 90 days.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-agency-uk",
  },
  openGraph: {
    title: "UK AI Agency — AI Automation for Service Businesses | JP Automations",
    description:
      "JP Automations is a UK-based AI agency that builds automation systems for service businesses. £10k+ recovered in month one. 25+ hours reclaimed per week.",
    url: "https://www.jpautomations.co.uk/ai-agency-uk",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=UK+AI+Agency&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "UK AI Agency — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK AI Agency — AI Automation for Service Businesses",
    description:
      "JP Automations: UK AI agency building bespoke automation for service businesses. Lead gen, invoicing, CRM — all automated.",
    images: ["https://www.jpautomations.co.uk/api/og?title=UK+AI+Agency&subtitle=JP+Automations"],
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
          UK AI Agency
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          UK AI Agency for Service Businesses
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
          JP Automations is a <strong className="text-white">UK-based AI agency</strong> that
          builds bespoke automation systems for service businesses. We design, build, and
          deploy AI-powered infrastructure that handles your lead generation, invoicing,
          client follow-up, and operations — so you can stop being the bottleneck in your
          own business.
        </p>
      </div>

      {/* What We Do */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          What We Do as a UK AI Agency
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Most AI agencies sell generic chatbots or off-the-shelf software integrations. We
          take a different approach. Every system we build is designed around how your
          business actually operates — your enquiry flow, your job delivery process, your
          invoicing cycle, your follow-up gaps.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          As a specialist UK AI agency for service businesses, we focus exclusively on the
          operational problems that cost service business owners the most time and money:
          missed leads, late invoices, inconsistent follow-up, and manual admin that scales
          linearly with revenue.
        </p>
        <p className="text-gray-400 leading-relaxed">
          The result is automation infrastructure that runs your business operations in the
          background — consistently, without gaps, regardless of how busy you get. Our
          clients typically reclaim 25+ hours per week and see full return on investment
          within 90 days.
        </p>
      </section>

      {/* Services */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">
          AI Automation Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Lead Generation Automation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every enquiry captured, acknowledged within minutes, qualified automatically,
              and followed up until they book or say no. No more leads going cold because
              you were on a job.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Invoice &amp; Payment Automation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Invoices sent the day work completes. Payment reminders at 7, 14, and 30 days.
              One client recovered &pound;10,000 in outstanding invoices within their first
              month.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">CRM &amp; Operations Systems</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Jobs move through your pipeline automatically. Clients receive updates. Your
              team gets assignments. You get visibility — without chasing anyone for status.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Client Follow-Up &amp; Reviews</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Automated review requests after every job. Re-engagement sequences for dormant
              clients. Referral prompts at the right moment. Your reputation grows on autopilot.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">WhatsApp &amp; Email Automation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Client communication handled across WhatsApp, email, and SMS — all triggered
              at the right time, written in your voice, and logged in one place.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">AI Phone Answering</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Never miss a call again. AI-powered phone systems that answer enquiries,
              qualify leads, and book jobs — even when you are on site or out of hours.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose a UK AI Agency */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Why Choose a UK-Based AI Agency
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Working with a UK AI agency means your automation systems are built by people who
          understand UK service businesses, UK consumer expectations, GDPR compliance, and
          the tools your industry actually uses — Xero, WhatsApp Business, Google Business
          Profile, Stripe, and the rest.
        </p>
        <div className="space-y-4 mt-6">
          <div className="border-l-2 border-teal-400 pl-5">
            <p className="text-white font-semibold mb-1">UK business context</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              We understand how UK trades and service businesses operate — the enquiry
              patterns, the payment cycles, the customer expectations. Systems are built
              around UK business realities, not generic templates.
            </p>
          </div>
          <div className="border-l-2 border-teal-400 pl-5">
            <p className="text-white font-semibold mb-1">GDPR compliant by default</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every system we build is designed with UK GDPR in mind. Data is processed
              lawfully, stored securely, and your clients retain full control over their data.
            </p>
          </div>
          <div className="border-l-2 border-teal-400 pl-5">
            <p className="text-white font-semibold mb-1">Same timezone, real support</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              No offshore teams or delayed responses. Direct communication, UK working
              hours, and a founder-led agency that takes ownership of every build.
            </p>
          </div>
          <div className="border-l-2 border-teal-400 pl-5">
            <p className="text-white font-semibold mb-1">Proven UK results</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our case studies come from UK businesses like yours. &pound;10k recovered in
              month one. 25+ hours reclaimed weekly. 5x sales increases. Real numbers from
              real UK service businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Industries We Serve Across the UK
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          As a UK AI agency, we work with service businesses across every major trade and
          professional service sector:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            "Roofing contractors and flat roof specialists",
            "Cleaning and commercial cleaning companies",
            "Electrical contractors and plumbers",
            "Landscaping and garden maintenance",
            "Property maintenance and management",
            "Building contractors and construction",
            "Personal trainers and fitness businesses",
            "Pest control and specialist trade services",
            "Consulting and professional service firms",
            "HVAC and heating engineers",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-gray-400">
              <span className="text-teal-400 flex-shrink-0">→</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-400 leading-relaxed">
          We serve businesses across the entire UK — including{" "}
          <Link href="/ai-agency-london" className="text-teal-400 hover:underline">London</Link>,{" "}
          <Link href="/ai-agency-manchester" className="text-teal-400 hover:underline">Manchester</Link>,{" "}
          <Link href="/ai-agency-birmingham" className="text-teal-400 hover:underline">Birmingham</Link>,{" "}
          <Link href="/ai-agency-leeds" className="text-teal-400 hover:underline">Leeds</Link>,
          and everywhere in between. All systems are built remotely and deployed digitally.
        </p>
      </section>

      {/* Results */}
      <section className="mb-16 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Results From Our AI Automation Systems</h2>
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
        <Link
          href="/blog/invoice-case-study"
          className="inline-flex items-center gap-2 text-teal-400 font-semibold hover:underline text-sm"
        >
          Read the full case study →
        </Link>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">How We Work</h2>
        <div className="space-y-6">
          {[
            { step: "01", title: "Free Audit Call", body: "We map your current workflows and identify the highest-leverage automation opportunities. No obligation, no sales pitch — just a clear picture of what is possible." },
            { step: "02", title: "System Design", body: "We design the complete automation architecture around your business. Every trigger, action, and handover is defined before we build anything." },
            { step: "03", title: "Build & Deploy", body: "Systems are built, tested, and deployed within 30 days. The build happens alongside your normal operations — zero disruption." },
            { step: "04", title: "Handover & Training", body: "Full documentation and training. After handover, you own the system completely. No ongoing dependency, no lock-in." },
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

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {[
            { q: "What does an AI agency do?", a: "An AI agency designs and builds automation systems that use artificial intelligence to handle repetitive business tasks — lead follow-up, invoicing, scheduling, client communication, and operations management. Unlike software companies that sell generic tools, an AI agency builds bespoke systems around how your specific business operates." },
            { q: "How much does it cost to hire an AI agency in the UK?", a: "Bespoke AI automation systems typically start from a few thousand pounds for core systems (lead handling, invoicing, follow-up). Most UK service businesses see full ROI within the first 90 days through recovered revenue and reclaimed admin time." },
            { q: "What is the best AI agency in the UK for service businesses?", a: "For UK service businesses and tradespeople, JP Automations specialises in building automation systems that handle lead generation, invoicing, client follow-up, and operations — with proven results including £10k+ recovered in month one and 25+ hours reclaimed per week." },
            { q: "Do I need an AI agency or can I automate myself?", a: "You can automate simple tasks yourself using tools like Zapier or Make. But for connected systems that handle your entire lead-to-payment workflow reliably, an AI agency builds infrastructure that is tested, monitored, and designed to run without oversight." },
            { q: "How long does it take to build automation systems?", a: "Most core automation systems are designed and built within 30 days. This includes a workflow audit, system design, build, testing, and full handover with documentation." },
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
          Ready to work with a UK AI agency?
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
          Book a free audit call. We&apos;ll map your workflows, identify the highest-impact
          automations, and show you exactly what we&apos;d build — no obligation.
        </p>
        <Link
          href="/book-call"
          className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition"
        >
          Book a Free Audit Call →
        </Link>
      </section>

      {/* Internal links */}
      <section>
        <p className="text-gray-500 text-sm mb-4">Learn more</p>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <Link href="/ai-automation-for-service-businesses" className="text-teal-400 hover:underline text-sm">
            AI Automation for Service Businesses →
          </Link>
          <Link href="/blog/invoice-case-study" className="text-teal-400 hover:underline text-sm">
            Case Study: £10k Recovered in Month One →
          </Link>
          <Link href="/blog/business-process-automation-uk-service-businesses" className="text-teal-400 hover:underline text-sm">
            5 Processes to Automate First →
          </Link>
          <Link href="/blog/automate-client-follow-up-uk-service-businesses" className="text-teal-400 hover:underline text-sm">
            How to Automate Client Follow-Up →
          </Link>
          <Link href="/blog/ai-automation-roofing-companies-uk" className="text-teal-400 hover:underline text-sm">
            AI Automation for Roofing Companies →
          </Link>
        </div>
      </section>
    </main>
  )
}
