import { Metadata } from "next"
import Link from "next/link"

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Automation for UK Service Businesses",
  description:
    "Bespoke AI automation systems for UK service businesses doing £15k+/month. Remove admin, automate follow-up, and scale without becoming the bottleneck.",
  provider: {
    "@type": "Organization",
    name: "JP Automations",
    url: "https://www.jpautomations.co.uk",
  },
  areaServed: {
    "@type": "Country",
    name: "United Kingdom",
  },
  serviceType: "AI Automation Consulting",
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is AI automation expensive to implement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Costs vary depending on complexity, but automation is typically far cheaper than hiring additional staff to manage admin and operations. Most clients recover the investment within the first quarter.",
      },
    },
    {
      "@type": "Question",
      name: "Will automation replace my team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Automation removes repetitive admin and coordination work so your team can focus on higher-value tasks.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to change my tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not necessarily. Most automation systems integrate with the tools you already use.",
      },
    },
    {
      "@type": "Question",
      name: "Is this suitable for small service businesses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. In fact, smaller teams often benefit the most because automation removes early-stage bottlenecks before growth becomes painful.",
      },
    },
  ],
}

export const metadata: Metadata = {
  title: { absolute: "AI Automation for UK Service Businesses | JP Automations" },
  description:
    "Bespoke AI automation systems for UK service businesses doing £15k+/month. Remove admin, automate client follow-up, and scale without becoming the bottleneck. ROI within 90 days.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/ai-automation-for-service-businesses",
  },
  openGraph: {
    title: "AI Automation for UK Service Businesses | JP Automations",
    description:
      "We build AI automation systems that remove admin, handle follow-up, and scale UK service businesses — without the owner becoming the bottleneck.",
    url: "https://www.jpautomations.co.uk/ai-automation-for-service-businesses",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+UK+Service+Businesses&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "AI Automation for Service Businesses — JP Automations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for UK Service Businesses | JP Automations",
    description:
      "Bespoke AI automation systems for UK service businesses. Remove admin, automate follow-up, scale without the bottleneck.",
    images: ["https://www.jpautomations.co.uk/api/og?title=AI+Automation+for+UK+Service+Businesses&subtitle=JP+Automations"],
  },
}

export default function Page() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        AI Automation for Service Businesses
      </h1>

      <p className="text-lg text-gray-400 leading-relaxed mb-12">
        This page explains how <strong>AI automation systems</strong> help service
        and trade businesses streamline operations, reduce admin, and scale
        without relying on constant owner involvement.
      </p>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4">
          Why Service Businesses Struggle to Scale
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Most service businesses don’t fail because of a lack of demand. They
          struggle because growth increases operational pressure, admin, and
          decision-making — all of which usually fall back on the owner.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Without structured systems in place, every new enquiry, job, or hire
          adds complexity. This creates a bottleneck where the business can only
          grow as fast as the owner can keep up.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4">
          What an AI Automation System Actually Does
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          An AI automation system connects the core functions of your business so
          work flows automatically without constant manual input.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Instead of relying on people to remember, chase, update, and move
          information between tools, automation ensures enquiries are handled,
          tasks are triggered, updates are logged, and follow-ups happen
          consistently — whether you’re available or not.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4">
          Core Systems We Automate
        </h2>
        <ul className="space-y-3 text-gray-400 leading-relaxed">
          <li>• Lead capture, qualification, and follow-up</li>
          <li>• Booking and scheduling workflows</li>
          <li>• CRM updates and customer communication</li>
          <li>• Internal task assignment and notifications</li>
          <li>• Quoting, onboarding, and job handover processes</li>
          <li>• Reporting and operational visibility</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4">
          How Our Automation Process Works
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Every automation system is built around how your business already
          operates — not around generic software templates.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          We start by mapping your workflows, identifying friction points, and
          removing unnecessary steps. Only then do we introduce automation to
          support the process.
        </p>
        <p className="text-gray-400 leading-relaxed">
          The result is a connected system that reduces manual work, increases
          consistency, and gives you visibility without micromanagement.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4">
          Who This Is Best For
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          AI automation is most effective for service and trade businesses that
          already have demand but lack scalable systems.
        </p>
        <ul className="space-y-3 text-gray-400 leading-relaxed">
          <li>• Business owners acting as the operational bottleneck</li>
          <li>• Teams relying on manual admin and memory</li>
          <li>• Businesses struggling to follow up consistently</li>
          <li>• Owners who want control without day-to-day involvement</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6 text-gray-400 leading-relaxed">
          <p>
            <strong>Is AI automation expensive to implement?</strong><br />
            Costs vary depending on complexity, but automation is typically far
            cheaper than hiring additional staff to manage admin and operations.
          </p>

          <p>
            <strong>Will automation replace my team?</strong><br />
            No. Automation removes repetitive admin and coordination work so your
            team can focus on higher-value tasks.
          </p>

          <p>
            <strong>Do I need to change my tools?</strong><br />
            Not necessarily. Most automation systems integrate with the tools
            you already use.
          </p>

          <p>
            <strong>Is this suitable for small service businesses?</strong><br />
            Yes. In fact, smaller teams often benefit the most because automation
            removes early-stage bottlenecks before growth becomes painful.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-10 text-center">
        <p className="text-white font-semibold text-xl mb-3">
          Ready to remove yourself from the day-to-day?
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
          Book a free audit call. We&apos;ll map your current workflows, identify the highest-leverage automation opportunities, and tell you exactly what we&apos;d build — no obligation.
        </p>
        <Link
          href="/book-call"
          className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition"
        >
          Book a Free Audit Call →
        </Link>
      </section>

      {/* Internal links */}
      <section className="mt-16">
        <p className="text-gray-500 text-sm mb-4">Further reading</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/blog/automate-client-follow-up-uk-service-businesses"
            className="text-teal-400 hover:underline text-sm"
          >
            How to Automate Client Follow-Up Without a CRM →
          </Link>
          <Link
            href="/blog/biggest-automation-mistakes-service-businesses"
            className="text-teal-400 hover:underline text-sm"
          >
            The Biggest Automation Mistakes Service Businesses Make →
          </Link>
          <Link
            href="/blog/essential-business-systems"
            className="text-teal-400 hover:underline text-sm"
          >
            The 3 Systems Every Scalable Business Needs →
          </Link>
        </div>
      </section>
    </main>
  )
}
