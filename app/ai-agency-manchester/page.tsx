import { Metadata } from "next"
import Link from "next/link"

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Agency Manchester — AI Automation for Manchester Businesses",
  description:
    "JP Automations is an AI agency serving Manchester businesses. We build bespoke automation systems for service businesses across Greater Manchester and the North West — lead generation, invoicing, CRM, and operations.",
  provider: {
    "@type": "ProfessionalService",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
  areaServed: {
    "@type": "City",
    name: "Manchester",
  },
  serviceType: "AI Automation Agency",
  offers: {
    "@type": "Offer",
    description: "Bespoke AI automation systems for Manchester service businesses",
    areaServed: { "@type": "City", name: "Manchester" },
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is there an AI agency in Manchester I can work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JP Automations serves Manchester businesses remotely, building bespoke AI automation systems for service companies across Greater Manchester. Because all systems are built and deployed digitally, you get the same hands-on service as a local agency without geographical limitations. We work with Manchester trades, cleaning companies, property firms, and professional services.",
      },
    },
    {
      "@type": "Question",
      name: "How much does AI automation cost for a Manchester business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI automation systems for Manchester service businesses typically start from a few thousand pounds for core workflows like lead handling, invoicing, and follow-up. Most clients see full ROI within 90 days through recovered revenue and reclaimed admin time. There are no ongoing subscription fees — you own the system outright.",
      },
    },
    {
      "@type": "Question",
      name: "What industries in Manchester benefit most from AI automation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Manchester's strongest sectors for AI automation include construction and trades, commercial cleaning, property management, electrical and plumbing contractors, and professional consultancies. Any service business in Greater Manchester that relies on lead follow-up, invoicing, and client communication will see significant gains from automation.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly can AI automation systems be built for my Manchester business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most core automation systems are designed and deployed within 30 days. This covers a full workflow audit, system design, build, testing, and handover with documentation. Everything is done remotely, so there is no disruption to your daily operations in Manchester.",
      },
    },
  ],
}

export const metadata: Metadata = {
  title: { absolute: "AI Agency Manchester — AI Automation for Manchester Businesses | JP Automations" },
  description:
    "AI agency serving Manchester businesses. JP Automations builds bespoke AI automation systems for service companies across Greater Manchester — lead generation, invoicing, CRM, follow-up. ROI within 90 days.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-agency-manchester",
  },
  openGraph: {
    title: "AI Agency Manchester — AI Automation for Manchester Businesses | JP Automations",
    description:
      "JP Automations is an AI agency serving Manchester businesses. Bespoke automation for lead generation, invoicing, CRM, and operations. 25+ hours reclaimed per week.",
    url: "https://www.jpautomations.co.uk/ai-agency-manchester",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=AI+Agency+Manchester&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "AI Agency Manchester — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agency Manchester — AI Automation for Manchester Businesses",
    description:
      "JP Automations: AI agency for Manchester service businesses. Lead gen, invoicing, CRM — all automated with AI.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Agency+Manchester&subtitle=JP+Automations"],
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
          AI Agency Manchester
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          AI Agency in Manchester
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
          Manchester is one of the UK&apos;s fastest-growing business cities — home to thousands
          of service companies competing for leads, juggling operations, and losing hours to admin
          every week. JP Automations is an{" "}
          <strong className="text-white">AI agency serving Manchester businesses</strong>,
          building bespoke automation systems that handle your lead generation, invoicing, client
          follow-up, and day-to-day operations so you can focus on the work that actually grows
          your business.
        </p>
      </div>

      {/* Manchester Business Context */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Why Manchester Businesses Need AI Automation
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Manchester sits at the heart of the Northern Powerhouse. The city and its surrounding
          boroughs — Salford, Stockport, Bolton, Oldham, Trafford — form one of the largest
          metropolitan economies outside London. Greater Manchester is home to over 120,000
          businesses, and the service sector drives a significant portion of that activity. From
          construction firms working across the North West to cleaning companies managing dozens of
          commercial contracts, the demand for reliable, scalable operations has never been higher.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          But scale creates problems. More leads means more follow-up to manage. More jobs means
          more invoices to chase. More clients means more communication to stay on top of. Most
          Manchester service businesses hit a ceiling — not because they lack demand, but because
          their admin and operations can&apos;t keep pace with growth.
        </p>
        <p className="text-gray-400 leading-relaxed">
          That&apos;s the gap AI automation fills. Instead of hiring more admin staff or accepting
          missed revenue, you deploy systems that handle the repetitive work automatically —
          every lead followed up, every invoice sent on time, every client kept in the loop. We
          work remotely with Manchester businesses to design and deploy these systems without
          disrupting your day-to-day operations.
        </p>
      </section>

      {/* Services */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">
          AI Automation Services for Manchester
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Lead Generation Automation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Manchester is a competitive market. Every missed enquiry is revenue handed to a
              competitor. Our systems capture every lead, send an instant acknowledgement, qualify
              them automatically, and follow up persistently until they book or decline.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Invoice &amp; Payment Automation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Invoices sent the same day work completes. Automated reminders at 7, 14, and 30
              days. No more chasing payments while you&apos;re on site. One client recovered
              &pound;10,000 in overdue invoices within their first month of using the system.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">CRM &amp; Job Pipeline</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Jobs progress through your pipeline automatically. Clients receive status updates
              without you lifting a finger. Your team gets assignments and deadlines. You get a
              clear view of every active job across Greater Manchester.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Client Follow-Up &amp; Reviews</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Automated review requests after every completed job. Re-engagement sequences for
              past clients. Referral prompts timed perfectly. Your Google reviews and reputation
              grow consistently without manual effort.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">WhatsApp &amp; Email Automation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Client communication handled across WhatsApp, email, and SMS — all triggered at the
              right moment, written in your tone of voice, and logged in a single place. No more
              scattered messages across three different apps.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">AI Phone Answering</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Never miss a call while you&apos;re on a job in Salford or stuck in traffic on the
              M60. AI-powered phone systems answer enquiries, qualify leads, and book jobs around
              the clock — even outside business hours.
            </p>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Manchester &amp; North West Industries We Work With
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          Greater Manchester&apos;s economy is built on service businesses. Whether you operate in
          the city centre or across the wider North West region, our automation systems are
          designed for the industries that drive this area:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            "Construction firms and building contractors",
            "Commercial and residential cleaning companies",
            "Property management and lettings agencies",
            "Electrical contractors and electricians",
            "Plumbing and heating engineers",
            "Landscaping and grounds maintenance",
            "Consulting and professional service firms",
            "Roofing and specialist trade contractors",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-gray-400">
              <span className="text-teal-400 flex-shrink-0">&rarr;</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-400 leading-relaxed">
          Manchester&apos;s construction sector alone is one of the largest in the North West,
          with major regeneration projects fuelling demand for reliable trade services. If your
          business handles enquiries, quotes, jobs, and invoices — we can automate the operational
          layer that sits underneath all of it.
        </p>
      </section>

      {/* Results */}
      <section className="mb-16 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Results Our Clients See</h2>
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
          These numbers come from real UK service businesses — the same types of companies
          operating across Manchester and the North West every day. When your lead follow-up,
          invoicing, and client communication run automatically, the impact compounds fast.
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
        <h2 className="text-3xl font-bold mb-6">How We Work With Manchester Businesses</h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          We work remotely with businesses across Greater Manchester. Every system is built,
          tested, and deployed digitally — no need for site visits or in-person meetings. Here is
          the process:
        </p>
        <div className="space-y-6">
          {[
            { step: "01", title: "Free Audit Call", body: "We map your current workflows — how leads come in, how jobs progress, how invoices go out, where follow-up falls through. You get a clear picture of the highest-impact automation opportunities for your Manchester business." },
            { step: "02", title: "System Design", body: "We design the complete automation architecture around your specific operations. Every trigger, action, and handover is documented before we build anything. You approve the blueprint." },
            { step: "03", title: "Build & Deploy", body: "Systems are built, tested, and deployed within 30 days. The entire build happens alongside your normal operations — zero disruption to your team or your clients." },
            { step: "04", title: "Handover & Training", body: "Full documentation and training so your team knows exactly how everything works. After handover, you own the system completely. No lock-in contracts, no ongoing dependency." },
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
            { q: "Is there an AI agency in Manchester I can work with?", a: "JP Automations serves Manchester businesses remotely, building bespoke AI automation systems for service companies across Greater Manchester. Because everything is built and deployed digitally, you get the same dedicated service as a local agency without geographical limitations." },
            { q: "How much does AI automation cost for a Manchester business?", a: "Bespoke AI automation systems typically start from a few thousand pounds for core workflows like lead handling, invoicing, and follow-up. Most Manchester service businesses see full ROI within 90 days through recovered revenue and time saved on admin." },
            { q: "What industries in Manchester benefit most from AI automation?", a: "Manchester\u2019s strongest sectors for automation include construction and trades, commercial cleaning, property management, electrical and plumbing contractors, and professional consultancies. Any service business that depends on lead follow-up, invoicing, and client communication will see significant returns." },
            { q: "How quickly can you build automation systems for my business?", a: "Most core systems are designed and deployed within 30 days. This includes a full workflow audit, system design, build, testing, and handover with documentation. Everything is done remotely, so there is zero disruption to your daily operations." },
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
          Ready to automate your Manchester business?
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
