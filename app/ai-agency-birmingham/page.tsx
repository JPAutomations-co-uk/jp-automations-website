import { Metadata } from "next"
import Link from "next/link"

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Agency Birmingham — AI Automation for Birmingham Businesses",
  description:
    "JP Automations is an AI agency serving Birmingham and the West Midlands. We build bespoke automation systems for service businesses — lead generation, invoicing, CRM, follow-up, and operations.",
  provider: {
    "@type": "ProfessionalService",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
  areaServed: {
    "@type": "City",
    name: "Birmingham",
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "West Midlands",
    },
  },
  serviceType: "AI Automation Agency",
  offers: {
    "@type": "Offer",
    description: "Bespoke AI automation systems for Birmingham service businesses",
    areaServed: { "@type": "City", name: "Birmingham" },
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is there an AI automation agency in Birmingham?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JP Automations serves Birmingham and the wider West Midlands remotely. We build bespoke AI automation systems for service businesses — lead generation, invoicing, CRM, client follow-up, and operations. All systems are designed, built, and deployed digitally, so you get the same hands-on service regardless of your location in Birmingham or the surrounding area.",
      },
    },
    {
      "@type": "Question",
      name: "How much does AI automation cost for a Birmingham business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI automation systems for Birmingham businesses typically start from a few thousand pounds for core workflows like lead handling, invoicing, and follow-up. Most service businesses in Birmingham and the West Midlands see full ROI within 90 days through recovered revenue and reclaimed admin hours. There are no ongoing subscription fees.",
      },
    },
    {
      "@type": "Question",
      name: "What industries in Birmingham benefit most from AI automation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Birmingham's strongest sectors for AI automation include construction and trades, property management, professional services, cleaning companies, and manufacturing-adjacent service businesses. Any Birmingham business that relies on lead follow-up, quoting, invoicing, and client communication will see immediate returns from automation.",
      },
    },
  ],
}

export const metadata: Metadata = {
  title: { absolute: "AI Agency Birmingham \u2014 AI Automation for Birmingham Businesses | JP Automations" },
  description:
    "AI agency Birmingham: JP Automations builds bespoke AI automation systems for Birmingham and West Midlands service businesses. Lead generation, invoicing, CRM, and operations automated. ROI within 90 days.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-agency-birmingham",
  },
  openGraph: {
    title: "AI Agency Birmingham \u2014 AI Automation for Birmingham Businesses | JP Automations",
    description:
      "JP Automations is an AI agency serving Birmingham and the West Midlands. Bespoke automation for service businesses. \u00A310k+ recovered in month one. 25+ hours reclaimed per week.",
    url: "https://www.jpautomations.co.uk/ai-agency-birmingham",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=AI+Agency+Birmingham&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "AI Agency Birmingham \u2014 JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agency Birmingham \u2014 AI Automation for Birmingham Businesses",
    description:
      "JP Automations: AI agency serving Birmingham. Bespoke automation for service businesses \u2014 lead gen, invoicing, CRM, and operations.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Agency+Birmingham&subtitle=JP+Automations"],
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
          AI Agency Birmingham
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          AI Agency in Birmingham
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
          JP Automations is an <strong className="text-white">AI agency serving Birmingham</strong> and
          the wider West Midlands. We build bespoke automation systems for service businesses &mdash;
          handling your lead generation, invoicing, client follow-up, and daily operations so you can
          focus on delivering great work instead of drowning in admin.
        </p>
      </div>

      {/* Birmingham Context */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Why Birmingham Businesses Need AI Automation
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Birmingham is the UK&apos;s second city and the commercial heart of the West Midlands. With a
          strong heritage in manufacturing, engineering, and trade, the city has evolved into a thriving
          hub for service businesses, professional firms, and a rapidly growing construction sector. From
          Digbeth to Edgbaston, Solihull to Sutton Coldfield, thousands of service businesses compete for
          the same local customers every day.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          That competition means the margin for error is razor-thin. A missed enquiry goes to the next
          company on Google. An invoice sent three weeks late becomes an invoice that never gets paid. A
          client who finishes a job and never hears from you again takes their next project to someone
          who stays in touch.
        </p>
        <p className="text-gray-400 leading-relaxed">
          AI automation fixes these gaps systematically. Instead of relying on you or your team to
          remember every follow-up, chase every payment, and respond to every lead within minutes,
          automation handles it all in the background &mdash; consistently and without oversight. For
          Birmingham service businesses operating across the West Midlands, that consistency is the
          difference between steady growth and constant firefighting.
        </p>
      </section>

      {/* Services */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">
          AI Automation Services for Birmingham Businesses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Lead Generation &amp; Capture</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every enquiry from your website, Google Business Profile, or phone is captured instantly,
              acknowledged within minutes, and followed up automatically until they book or decline.
              No more leads slipping through because you were on a job in Erdington.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Invoice &amp; Payment Automation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Invoices generated and sent the day work completes. Automated reminders at 7, 14, and
              30 days chase outstanding payments for you. One client recovered &pound;10,000 in unpaid
              invoices within their first month on the system.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">CRM &amp; Job Pipeline</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Jobs move through your pipeline automatically from enquiry to completion. Clients receive
              status updates without you lifting a finger. Your team gets assignments and reminders.
              You get a clear overview of every active job.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Client Follow-Up &amp; Reviews</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Automated review requests after every completed job build your Google reputation on
              autopilot. Re-engagement sequences bring dormant clients back. Referral prompts go out
              at the perfect moment to generate word-of-mouth.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">WhatsApp &amp; Email Sequences</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Reach your clients on the channels they actually use. Automated WhatsApp messages, email
              sequences, and SMS notifications &mdash; all triggered at the right time, written in
              your tone, and logged centrally.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">AI Phone Answering</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Never miss a call from a potential Birmingham customer again. AI-powered phone answering
              qualifies leads, captures details, and books appointments &mdash; even when you&apos;re
              on site or it&apos;s outside working hours.
            </p>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Birmingham &amp; West Midlands Industries We Work With
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          Birmingham&apos;s economy is built on a diverse mix of industries, and the wider West Midlands
          &mdash; including Wolverhampton, Coventry, Walsall, and Dudley &mdash; adds further depth.
          We build automation systems for service businesses across all of these sectors:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            "Construction firms and building contractors",
            "Plumbers, electricians, and heating engineers",
            "Property management and lettings agencies",
            "Commercial and domestic cleaning companies",
            "Roofing contractors and damp specialists",
            "Landscaping and grounds maintenance",
            "Accountants and professional service firms",
            "Pest control and specialist trade services",
            "Fitness studios and personal trainers",
            "IT support and managed service providers",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-gray-400">
              <span className="text-teal-400 flex-shrink-0">&rarr;</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-400 leading-relaxed">
          Whether you operate from a Birmingham city centre office or serve customers across the
          entire West Midlands region, our systems are built remotely and deployed digitally &mdash;
          so location is never a barrier.
        </p>
      </section>

      {/* Stats */}
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
        <Link
          href="/blog/invoice-case-study"
          className="inline-flex items-center gap-2 text-teal-400 font-semibold hover:underline text-sm"
        >
          Read the full case study &rarr;
        </Link>
      </section>

      {/* How We Work */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">How We Work With Birmingham Businesses</h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          We deliver everything remotely, so you get the same quality of service whether you&apos;re
          based in the Jewellery Quarter or out in Solihull. Here&apos;s how every engagement works:
        </p>
        <div className="space-y-6">
          {[
            { step: "01", title: "Free Audit Call", body: "We map your current workflows and identify where time, money, and leads are falling through the cracks. No obligation, no hard sell \u2014 just a clear picture of what automation can do for your business." },
            { step: "02", title: "System Design", body: "We design the complete automation architecture around how your Birmingham business actually operates. Every trigger, action, and handover is planned and agreed before any building starts." },
            { step: "03", title: "Build & Deploy", body: "Your systems are built, tested, and deployed within 30 days. The build runs alongside your normal operations with zero disruption to your team or your customers." },
            { step: "04", title: "Handover & Training", body: "Full documentation and training so your team knows exactly how everything works. After handover, you own the system completely \u2014 no lock-in contracts, no ongoing dependency." },
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
            { q: "Is there an AI automation agency in Birmingham?", a: "JP Automations serves Birmingham and the wider West Midlands remotely. We build bespoke AI automation systems for service businesses \u2014 lead generation, invoicing, CRM, client follow-up, and operations. All systems are designed, built, and deployed digitally, so you get the same hands-on service regardless of your location in Birmingham or the surrounding area." },
            { q: "How much does AI automation cost for a Birmingham business?", a: "Bespoke AI automation systems typically start from a few thousand pounds for core workflows like lead handling, invoicing, and follow-up. Most service businesses in Birmingham and the West Midlands see full ROI within 90 days through recovered revenue and reclaimed admin hours. There are no ongoing subscription fees for the systems we build." },
            { q: "What industries in Birmingham benefit most from AI automation?", a: "Birmingham\u2019s strongest sectors for AI automation include construction and trades, property management, professional services, cleaning companies, and manufacturing-adjacent service businesses. Any Birmingham business that relies on lead follow-up, quoting, invoicing, and client communication will see immediate returns from automation." },
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
          Ready to automate your Birmingham business?
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
          Book a free audit call. We&apos;ll map your workflows, identify the highest-impact
          automations, and show you exactly what we&apos;d build &mdash; no obligation.
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
