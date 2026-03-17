import { Metadata } from "next"
import Link from "next/link"

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Agency London — AI Automation Services",
  description:
    "JP Automations is an AI agency serving London service businesses. Bespoke automation systems for lead generation, invoicing, CRM, and operations — built remotely, deployed fast.",
  provider: {
    "@type": "ProfessionalService",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
  areaServed: {
    "@type": "City",
    name: "London",
  },
  serviceType: "AI Automation Agency",
  offers: {
    "@type": "Offer",
    description: "Bespoke AI automation systems for London service businesses",
    areaServed: { "@type": "City", name: "London" },
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does an AI agency cost in London?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI automation systems for London service businesses typically start from a few thousand pounds for core systems covering lead handling, invoicing, and follow-up. Unlike London agencies with high overheads that charge premium retainers, JP Automations works remotely and passes that saving on to you. Most London clients see full ROI within 90 days through recovered revenue and reclaimed admin time.",
      },
    },
    {
      "@type": "Question",
      name: "What AI agencies are based in London?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There are many AI agencies operating in London, from large enterprise consultancies to small boutique firms. JP Automations serves London businesses remotely, which means you get specialist AI automation for service businesses without paying for a Shoreditch office. We focus exclusively on service businesses and trades — lead generation, invoicing, CRM, and operations automation.",
      },
    },
    {
      "@type": "Question",
      name: "Can a London AI agency help my trade business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Trade businesses in London face unique pressures — high competition, clients who expect instant responses, and premium pricing that demands a professional client experience. AI automation handles your lead capture, quoting, invoicing, and follow-up so you can focus on delivering the work. JP Automations has built systems for construction, cleaning, property management, and other London trades.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to meet my AI agency in person in London?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All of our work is done remotely via video calls, screen shares, and digital collaboration tools. London businesses get exactly the same service, turnaround, and results as any other UK client. Remote delivery also means lower overheads and better pricing for you — without sacrificing quality or communication.",
      },
    },
  ],
}

export const metadata: Metadata = {
  title: {
    absolute:
      "AI Agency London — AI Automation for London Service Businesses | JP Automations",
  },
  description:
    "JP Automations is an AI agency serving London service businesses. Lead generation, invoicing, CRM, and operations automated with AI. ROI within 90 days. All work delivered remotely.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-agency-london",
  },
  openGraph: {
    title:
      "AI Agency London — AI Automation for London Service Businesses | JP Automations",
    description:
      "AI agency serving London service businesses. Bespoke automation for lead gen, invoicing, CRM &amp; operations. &pound;10k+ recovered in month one. 25+ hours reclaimed per week.",
    url: "https://www.jpautomations.co.uk/ai-agency-london",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=AI+Agency+London&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "AI Agency London — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agency London — AI Automation for London Service Businesses",
    description:
      "JP Automations: AI agency serving London service businesses. Lead gen, invoicing, CRM — all automated with AI.",
    images: [
      "https://www.jpautomations.co.uk/api/og?title=AI+Agency+London&subtitle=JP+Automations",
    ],
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
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-teal-400 transition"
        >
          &larr; Home
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-16">
        <p className="text-teal-400 text-xs tracking-[0.25em] uppercase mb-4 font-medium">
          AI Agency London
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          AI Agency in London
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
          JP Automations is an{" "}
          <strong className="text-white">AI agency serving London service businesses</strong>.
          We build bespoke automation systems that handle your lead generation, invoicing,
          client follow-up, and day-to-day operations — so you can run your London business
          without drowning in admin. Every system is built remotely and deployed digitally,
          which means you get specialist automation at a fraction of what a central London
          agency would charge.
        </p>
      </div>

      {/* London-specific challenges */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Why London Service Businesses Need AI Automation
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Running a service business in London is a different game. The competition is
          fierce — there are dozens of businesses offering the same service within a few
          miles of you. Clients expect instant responses to enquiries because they have
          alternatives a phone call away. And London&apos;s premium pricing means your
          client experience needs to match the price tag, from the first touchpoint through
          to the final invoice.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          The problem is that most London service businesses still run on manual processes.
          Leads come in by phone and get scribbled on a notepad. Quotes go out days late.
          Invoices sit unsent for weeks. Follow-up happens when someone remembers —
          which, during a busy week in London, is rarely.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          This is the gap AI automation fills. Instead of hiring another admin person at
          London salaries, you build systems that handle these tasks automatically —
          faster, more consistently, and without sick days or notice periods.
        </p>
        <div className="space-y-4 mt-8">
          <div className="border-l-2 border-teal-400 pl-5">
            <p className="text-white font-semibold mb-1">
              High competition, tight response windows
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              London customers expect a response within minutes, not hours. If you take
              too long, they&apos;ve already contacted three competitors. Automated lead
              capture and instant acknowledgement keeps you in the running every time.
            </p>
          </div>
          <div className="border-l-2 border-teal-400 pl-5">
            <p className="text-white font-semibold mb-1">
              Premium pricing demands a premium experience
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              London clients pay more and expect more. A professional, automated client
              journey — from the initial enquiry confirmation to the post-job review
              request — builds the trust that justifies your pricing.
            </p>
          </div>
          <div className="border-l-2 border-teal-400 pl-5">
            <p className="text-white font-semibold mb-1">
              High overheads mean every pound counts
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              With London operating costs being what they are, a missed invoice or a
              lost lead hits harder. Automation makes sure every enquiry is followed up
              and every invoice is chased — so revenue doesn&apos;t leak through the
              cracks.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">
          AI Automation Services for London Businesses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Lead Generation &amp; Capture
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every enquiry from your website, Google, social media, or phone is captured
              instantly, acknowledged within minutes, and followed up automatically. In a
              city where speed wins the job, this alone can transform your conversion rate.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Invoice &amp; Payment Automation
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Invoices sent the day work completes — not two weeks later when you finally
              get round to it. Automated reminders at 7, 14, and 30 days chase payment
              without you lifting a finger. One client recovered &pound;10,000 in
              outstanding invoices within their first month.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              CRM &amp; Job Management
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Track every job from enquiry to completion. Clients receive automatic updates.
              Your team gets clear assignments. You get a real-time view of your pipeline
              without chasing anyone for a status update.
            </p>
          </div>
          <div className="border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Client Follow-Up &amp; Reviews
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Automated Google review requests after every completed job. Re-engagement
              sequences for past clients who haven&apos;t booked in a while. In London&apos;s
              competitive market, a strong review profile is often the deciding factor.
            </p>
          </div>
        </div>
      </section>

      {/* Industries in London */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Industries We Serve Across London
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          We work with service businesses across every London borough — from established
          firms in the City and Westminster to growing businesses in Croydon, Bromley,
          Ealing, and the outer boroughs. Whether you&apos;re serving residential clients
          in South London or managing commercial contracts across the Greater London area,
          the automation is built around how your business operates.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            "Construction &amp; building contractors",
            "Property management &amp; lettings",
            "Commercial &amp; residential cleaning",
            "Consulting &amp; professional services",
            "Electrical contractors &amp; plumbers",
            "Roofing &amp; exterior specialists",
            "Landscaping &amp; garden maintenance",
            "Personal trainers &amp; fitness studios",
            "HVAC &amp; heating engineers",
            "Pest control &amp; specialist trades",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 text-gray-400"
            >
              <span className="text-teal-400 flex-shrink-0">&rarr;</span>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </div>
          ))}
        </div>
        <p className="text-gray-400 leading-relaxed">
          We serve businesses in every part of London — including Central London,
          North London, South London, East London, and West London. From Hackney to
          Hammersmith, Camden to Canary Wharf, and everywhere across the Greater London
          area.
        </p>
      </section>

      {/* Remote delivery note */}
      <section className="mb-16 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8">
        <h2 className="text-2xl font-bold mb-4">
          London Service, Without the London Price Tag
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          While we serve London businesses, all of our work is delivered remotely. There is
          no flashy Shoreditch office adding &pound;50k a year to your invoice. Instead, you
          get a focused, founder-led AI agency that puts every penny into building systems
          that actually work — not into WeWork memberships.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Remote delivery means a London business gets exactly the same service, the same
          turnaround time, and the same results as any other UK business. Communication
          happens over video calls, screen shares, and async updates. Systems are deployed
          digitally. There is zero geographic limitation on what we can build for you.
        </p>
      </section>

      {/* Stats */}
      <section className="mb-16 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">
          Results From Our AI Automation Systems
        </h2>
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

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          How We Work With London Businesses
        </h2>
        <p className="text-gray-400 leading-relaxed mb-8">
          Our process is straightforward. Four steps from first call to a fully operational
          automation system running your London business behind the scenes.
        </p>
        <div className="space-y-6">
          {[
            {
              step: "01",
              title: "Free Workflow Audit",
              body: "We get on a call and map out how your business currently operates — where leads come from, how you quote, how you invoice, where follow-up falls through the cracks. No sales pitch, just a clear picture of what automation can do for your specific London business.",
            },
            {
              step: "02",
              title: "System Design",
              body: "We design the complete automation architecture around your workflows. Every trigger, action, and handover is mapped out and agreed before a single line is built. You see exactly what you are getting before we start.",
            },
            {
              step: "03",
              title: "Build &amp; Deploy",
              body: "Your automation systems are built, tested, and deployed within 30 days. The entire build happens alongside your normal operations — no disruption, no downtime, no awkward transition period.",
            },
            {
              step: "04",
              title: "Handover &amp; Training",
              body: "Full documentation and a walkthrough so you understand every part of your system. After handover, you own it completely. No ongoing retainers, no lock-in, no dependency on us to keep the lights on.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-400/10 border border-teal-400/30 flex items-center justify-center text-teal-400 font-bold text-xs">
                {item.step}
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p
                  className="text-gray-400 leading-relaxed text-sm"
                  dangerouslySetInnerHTML={{ __html: item.body }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {[
            {
              q: "How much does an AI agency cost in London?",
              a: "AI automation systems for London service businesses typically start from a few thousand pounds for core systems covering lead handling, invoicing, and follow-up. Because we work remotely, you avoid the inflated rates that come with London office overheads. Most clients see full ROI within 90 days through recovered revenue and hours reclaimed from manual admin.",
            },
            {
              q: "What AI agencies are based in London?",
              a: "London has a range of AI agencies, from large enterprise consultancies charging six-figure retainers to smaller boutique firms. JP Automations serves London businesses remotely, which means you get specialist AI automation built specifically for service businesses — lead generation, invoicing, CRM, and operations — without paying for a Shoreditch postcode.",
            },
            {
              q: "Can a London AI agency help my trade business?",
              a: "Absolutely. Trade businesses in London face unique pressures: high competition, clients who expect instant responses, and premium pricing that demands a polished client experience. AI automation handles your lead capture, quoting, invoicing, and follow-up so you can focus on delivering the work. We have built systems for construction, cleaning, property management, and other London trades.",
            },
            {
              q: "Do I need to meet my AI agency in person in London?",
              a: "No. All of our work is delivered remotely via video calls, screen shares, and digital collaboration. London businesses get exactly the same service, turnaround, and results as any other UK client. Remote delivery keeps our overheads low and your pricing competitive — without sacrificing quality or communication.",
            },
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
          Ready to automate your London business?
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
          Book a free audit call. We&apos;ll map your workflows, identify the
          highest-impact automations, and show you exactly what we&apos;d build for
          your London service business — no obligation.
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
          <Link
            href="/ai-agency-uk"
            className="text-teal-400 hover:underline text-sm"
          >
            AI Agency UK &rarr;
          </Link>
          <Link
            href="/ai-automation-for-service-businesses"
            className="text-teal-400 hover:underline text-sm"
          >
            AI Automation for Service Businesses &rarr;
          </Link>
          <Link
            href="/blog/invoice-case-study"
            className="text-teal-400 hover:underline text-sm"
          >
            Case Study: &pound;10k Recovered in Month One &rarr;
          </Link>
          <Link
            href="/blog/business-process-automation-uk-service-businesses"
            className="text-teal-400 hover:underline text-sm"
          >
            Business Process Automation for UK Service Businesses &rarr;
          </Link>
        </div>
      </section>
    </main>
  )
}
