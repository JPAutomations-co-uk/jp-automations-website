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
      name: "What is AI automation for service businesses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI automation for service businesses means building connected systems that handle repetitive admin, communication, and operational tasks automatically — so enquiries are followed up, invoices are sent, jobs are scheduled, and clients are onboarded without the owner doing it manually each time.",
      },
    },
    {
      "@type": "Question",
      name: "How much does AI automation cost for a UK service business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Costs vary based on complexity and scope. Most bespoke automation systems start from a few thousand pounds and typically recover their investment within the first quarter through time saved and revenue recovered from previously missed follow-ups and invoices.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to build an automation system?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most core automation systems are live within 30 days. Complex multi-system builds can take 6–8 weeks. The audit and design phase is typically one week, followed by build, testing, and training.",
      },
    },
    {
      "@type": "Question",
      name: "Will automation work with the tools I already use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In most cases, yes. Automation systems can connect with WhatsApp, email, Google Sheets, Airtable, Notion, Xero, Stripe, Calendly, and most CRMs. We build around your existing stack rather than forcing you to switch tools.",
      },
    },
    {
      "@type": "Question",
      name: "Will automation replace my team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Automation removes repetitive admin and coordination work so your team can focus on higher-value tasks. Most clients find their team becomes more effective after automation, not redundant.",
      },
    },
    {
      "@type": "Question",
      name: "Is AI automation suitable for tradespeople and contractors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Tradespeople and contractors are among the biggest beneficiaries of automation. Missed follow-ups, slow invoicing, and manual scheduling are exactly the problems automation solves. One roofing contractor we worked with recovered £10k in outstanding invoices and reclaimed 25 hours a week within 30 days.",
      },
    },
    {
      "@type": "Question",
      name: "Is AI automation GDPR compliant for UK businesses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, when built correctly. All systems are designed with UK GDPR in mind — data is processed lawfully, stored securely, and clients retain full control over their data. We do not use customer data for any purpose outside the automation system.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if something breaks?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Automation systems are monitored with error alerts built in. Most issues are caught before they affect operations. We provide full documentation and support so you're never dependent on us to keep the system running.",
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

      {/* Hero */}
      <div className="mb-16">
        <p className="text-teal-400 text-xs tracking-[0.25em] uppercase mb-4 font-medium">
          JP Automations
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          AI Automation for UK Service Businesses
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
          This page explains how <strong className="text-white">AI automation systems</strong> help UK
          service and trade businesses remove admin, streamline operations, and scale — without the
          owner becoming the bottleneck at every stage of growth.
        </p>
      </div>

      {/* The Real Cost Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          The Real Cost of Running a Service Business Without Automation
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Most service business owners are brilliant at what they do. A roofing contractor who runs
          perfect jobs. A cleaning company with spotless reviews. A property maintenance firm with
          a full diary. The work is there. The problem is everything around it.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Every day, time that should go toward growth goes into following up leads who went quiet,
          chasing invoices that are weeks overdue, manually scheduling jobs, answering the same
          WhatsApp messages from clients, and rebuilding context that should have been stored
          automatically.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          The numbers are rarely visible on a spreadsheet, but they accumulate fast. A missed
          follow-up that would have converted to a £3,000 job. An invoice that sat unpaid for
          six weeks because no one chased it. A client who left for a competitor simply because
          they got a faster response.
        </p>
        <p className="text-gray-400 leading-relaxed">
          This is not a people problem. It is a systems problem. And systems can be fixed.
        </p>
      </section>

      {/* Why They Struggle */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Why Service Businesses Struggle to Scale
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Service businesses do not struggle to scale because of a lack of demand. They struggle
          because growth increases operational pressure without a corresponding increase in
          capacity. And that pressure, in most cases, lands on the owner.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          When a business is small, the owner handles everything. They remember which leads
          need chasing. They know which invoices are outstanding. They keep the operation running
          through personal effort and constant availability.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          This works — until it does not. As soon as the diary fills up, the team grows, or
          demand increases beyond a certain threshold, the owner cannot keep up. Leads fall through.
          Clients feel ignored. Admin piles up. Standards slip. And the business that looked like
          it was growing starts to feel like it is breaking.
        </p>
        <p className="text-gray-400 leading-relaxed">
          The solution is not to work harder. It is to build infrastructure that carries operational
          load without depending on a person to drive every step manually.
        </p>
      </section>

      {/* What Automation Does */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          What AI Automation Actually Looks Like in Practice
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          The phrase &ldquo;AI automation&rdquo; gets used loosely, so it is worth being specific about
          what it means for a service business in practice.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          When a new enquiry comes in through your website, WhatsApp, or an ad — it is automatically
          captured, qualified, and logged. A response is sent immediately. If the lead does not
          reply, a follow-up goes out at 24 and 72 hours without anyone lifting a finger.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          When a job is booked, the client receives a confirmation automatically. The job is logged
          in your system. The relevant team member receives a notification. Any required documents
          are generated and sent.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          When work is completed, the invoice is raised and sent on the same day. A payment reminder
          follows at seven days if it remains unpaid. A review request goes out 48 hours after the
          job. And the client enters a follow-up sequence for repeat or referral work.
        </p>
        <p className="text-gray-400 leading-relaxed">
          None of this requires the owner to be available, to remember, or to manually trigger each
          step. It runs in the background — consistently, without gaps — regardless of how busy
          the business gets.
        </p>
      </section>

      {/* Three Core Systems */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          The Three Core Systems Every Service Business Should Automate
        </h2>
        <p className="text-gray-400 leading-relaxed mb-8">
          Most service businesses benefit most from automating three interconnected systems. Each
          one addresses a specific point where manual operations break down under pressure.
        </p>

        <div className="space-y-10">
          <div className="border-l-2 border-teal-400 pl-6">
            <h3 className="text-2xl font-bold mb-3 text-white">
              1. The Lead-to-Booking System
            </h3>
            <p className="text-gray-400 leading-relaxed mb-3">
              Enquiries arrive from multiple sources — website forms, WhatsApp, Facebook Ads,
              Google Business Profile, referrals. Without a system, they land in different places
              and require someone to manually qualify, respond, and progress each one.
            </p>
            <p className="text-gray-400 leading-relaxed mb-3">
              An automated lead-to-booking system captures every enquiry into one place, sends
              an immediate response, qualifies the lead automatically, and routes them toward
              booking without requiring the owner to be involved in every exchange.
            </p>
            <p className="text-gray-400 leading-relaxed">
              For trade businesses specifically, this is where the most revenue is lost. A lead
              who does not hear back within an hour is likely to book with the next contractor
              who responds. Automation closes that gap entirely.
            </p>
          </div>

          <div className="border-l-2 border-teal-400 pl-6">
            <h3 className="text-2xl font-bold mb-3 text-white">
              2. The Delivery and Operations System
            </h3>
            <p className="text-gray-400 leading-relaxed mb-3">
              Once a job is booked, most service businesses still rely on memory, message threads,
              and the owner&apos;s direct involvement to ensure it is delivered correctly.
            </p>
            <p className="text-gray-400 leading-relaxed mb-3">
              An automated operations system moves jobs through a defined workflow automatically.
              Confirmations are sent to clients. Tasks are assigned to the right team members.
              Progress is tracked without requiring manual updates. Handovers happen automatically
              at each stage.
            </p>
            <p className="text-gray-400 leading-relaxed">
              The result is a business where delivery is consistent regardless of how many jobs
              are running simultaneously — and where the owner has visibility without needing
              to ask for updates.
            </p>
          </div>

          <div className="border-l-2 border-teal-400 pl-6">
            <h3 className="text-2xl font-bold mb-3 text-white">
              3. The Follow-Up and Retention System
            </h3>
            <p className="text-gray-400 leading-relaxed mb-3">
              The most underutilised growth lever in most service businesses is existing clients.
              Repeat business, referrals, and reviews cost nothing to acquire — but only happen
              when the relationship is maintained consistently.
            </p>
            <p className="text-gray-400 leading-relaxed mb-3">
              An automated follow-up system sends payment reminders, requests reviews at the
              right moment, checks in with clients at intervals, and re-engages dormant contacts
              without any manual effort.
            </p>
            <p className="text-gray-400 leading-relaxed">
              For most service businesses, this single system — properly built — generates
              measurable additional revenue within the first 90 days.
            </p>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Which Types of Service Business Benefit Most
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          AI automation is most effective for businesses with repeatable processes and
          consistent demand. The following types of service business are among those
          that see the strongest results:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            "Roofing and flat roof contractors",
            "Cleaning and commercial cleaning companies",
            "Landscaping and garden maintenance",
            "Electrical and plumbing contractors",
            "Property maintenance and management",
            "Building and general construction",
            "Pest control and specialist services",
            "Consulting and professional services",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-gray-400">
              <span className="text-teal-400 flex-shrink-0">→</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-400 leading-relaxed">
          The common thread is not the industry — it is the operational pattern. High volume
          of enquiries, repeatable job types, consistent client communication needs, and an
          owner who is currently the central point of coordination.
        </p>
      </section>

      {/* Real Results */}
      <section className="mb-16 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8">
        <h2 className="text-2xl font-bold mb-4">What Results Actually Look Like</h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          One roofing contractor we worked with was spending 25+ hours a week on admin —
          chasing invoices, following up leads, and managing jobs manually across WhatsApp
          and email. Within 30 days of their automation system going live, that time dropped
          significantly. Outstanding invoices that had been sitting for weeks were recovered
          automatically. In month one, the system recovered over £10,000 in revenue that
          would otherwise have been written off.
        </p>
        <p className="text-gray-400 leading-relaxed mb-6">
          Results vary by business, but the pattern is consistent: the biggest gains come
          from eliminating the gap between work completed and money received, and from
          following up leads at a speed and consistency that manual effort cannot match.
        </p>
        <Link
          href="/blog/invoice-case-study"
          className="inline-flex items-center gap-2 text-teal-400 font-semibold hover:underline text-sm"
        >
          Read the full case study →
        </Link>
      </section>

      {/* Our Process */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          How We Build Automation Systems
        </h2>
        <p className="text-gray-400 leading-relaxed mb-8">
          Every system is built around how the business already operates — not around
          generic software templates or off-the-shelf tools. The process follows five stages:
        </p>

        <div className="space-y-6">
          {[
            {
              step: "01",
              title: "Workflow Audit",
              body: "We map every key process in the business — enquiry handling, job delivery, invoicing, client communication — and identify exactly where time is being lost and where the system is breaking down.",
            },
            {
              step: "02",
              title: "System Design",
              body: "Before building anything, we design the complete automation architecture. Every trigger, action, and handover is defined in advance so the build phase is clean and predictable.",
            },
            {
              step: "03",
              title: "Build and Integration",
              body: "We build the system using tools that integrate with your existing stack — or introduce new ones only where they create clear value. Most systems are live within 30 days.",
            },
            {
              step: "04",
              title: "Testing and Refinement",
              body: "Every automation is tested across real-world scenarios before going live. Edge cases are handled. Error alerts are built in. The system is designed to run without oversight.",
            },
            {
              step: "05",
              title: "Handover and Documentation",
              body: "You receive full documentation of how the system works. You are trained on it directly. After handover, you are not dependent on us to keep it running.",
            },
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

      {/* Tools */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Tools and Integrations</h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Automation systems work best when they connect with the tools a business already
          uses rather than forcing a complete change in how the team operates.
        </p>
        <p className="text-gray-400 leading-relaxed mb-6">
          Common integrations include:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            "WhatsApp Business",
            "Google Sheets / Airtable",
            "Xero / QuickBooks",
            "Stripe / GoCardless",
            "Calendly / TidyCal",
            "Notion / Trello",
            "Gmail / Outlook",
            "Slack / Teams",
            "Google Business Profile",
            "Typeform / Tally",
            "Zapier / Make",
            "Custom APIs",
          ].map((tool) => (
            <div key={tool} className="text-gray-400 text-sm bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2">
              {tool}
            </div>
          ))}
        </div>
        <p className="text-gray-400 leading-relaxed text-sm">
          If you use a tool not listed here, it can almost certainly be integrated — either
          natively or via API. The audit stage identifies exactly what is needed.
        </p>
      </section>

      {/* Misconceptions */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Common Misconceptions About AI Automation
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-white font-semibold mb-2">
              &ldquo;Automation is only for large businesses.&rdquo;
            </h3>
            <p className="text-gray-400 leading-relaxed">
              The opposite is often true. Smaller service businesses benefit the most because
              a single owner or small team is often managing operational volume that would
              require two or three additional hires without automation. The ROI is proportionally
              larger when the baseline is manual effort.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">
              &ldquo;I&rsquo;ll need to change all my tools.&rdquo;
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Rarely. Most automation systems are built around the tools the business already
              uses. The system connects them — it does not replace them. If a specific tool
              is creating more problems than it solves, we will identify that in the audit,
              but a full tool change is never a requirement.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">
              &ldquo;AI automation will make client communication feel robotic.&rdquo;
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Only if it is built badly. Automated messages should be written in the same
              voice as the business, triggered at the right moment, and designed to feel
              like personal communication. When done correctly, clients do not notice the
              automation — they just notice a faster, more consistent experience.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">
              &ldquo;Setting this up will take months and disrupt the business.&rdquo;
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Most core automation systems are live within 30 days. The build happens in
              parallel with normal operations — there is no downtime, no period where
              the business needs to stop to implement it.
            </p>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Who This Is Best For</h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          AI automation delivers the strongest results for service businesses that are already
          generating consistent revenue but are hitting operational ceilings. Specifically,
          businesses where:
        </p>
        <div className="space-y-3 mb-6">
          {[
            "The owner is involved in day-to-day operations and wants to step back",
            "Admin and follow-up are taking 10+ hours a week without clear ROI",
            "Leads are being lost because response times are too slow",
            "Invoices are regularly chased manually or going unpaid for weeks",
            "The business delivers great work but the client experience around it is inconsistent",
            "Growth feels limited by the owner&apos;s available time rather than demand",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 text-gray-400">
              <span className="text-teal-400 flex-shrink-0 mt-0.5">→</span>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </div>
          ))}
        </div>
        <p className="text-gray-400 leading-relaxed">
          If your business is still in early-stage validation or does not yet have consistent
          demand, automation will not solve the underlying problem. The right time to automate
          is when the processes are clear and the volume is there — not before.
        </p>
      </section>

      {/* FAQs */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>

        <div className="space-y-8">
          {[
            {
              q: "What is AI automation for service businesses?",
              a: "AI automation for service businesses means building connected systems that handle repetitive admin, communication, and operational tasks automatically — so enquiries are followed up, invoices are sent, jobs are scheduled, and clients are onboarded without the owner doing it manually each time.",
            },
            {
              q: "How much does AI automation cost for a UK service business?",
              a: "Costs vary based on complexity and scope. Most bespoke automation systems start from a few thousand pounds and typically recover their investment within the first quarter through time saved and revenue recovered from previously missed follow-ups and invoices.",
            },
            {
              q: "How long does it take to build an automation system?",
              a: "Most core automation systems are live within 30 days. Complex multi-system builds can take 6–8 weeks. The audit and design phase is typically one week, followed by build, testing, and training.",
            },
            {
              q: "Will automation work with the tools I already use?",
              a: "In most cases, yes. Automation systems can connect with WhatsApp, email, Google Sheets, Airtable, Notion, Xero, Stripe, Calendly, and most CRMs. We build around your existing stack rather than forcing you to switch tools.",
            },
            {
              q: "Will automation replace my team?",
              a: "No. Automation removes repetitive admin and coordination work so your team can focus on higher-value tasks. Most clients find their team becomes more effective after automation, not redundant.",
            },
            {
              q: "Is AI automation suitable for tradespeople and contractors?",
              a: "Yes. Tradespeople and contractors are among the biggest beneficiaries of automation. Missed follow-ups, slow invoicing, and manual scheduling are exactly the problems automation solves. One roofing contractor we worked with recovered £10k in outstanding invoices and reclaimed 25 hours a week within 30 days.",
            },
            {
              q: "Is AI automation GDPR compliant for UK businesses?",
              a: "Yes, when built correctly. All systems are designed with UK GDPR in mind — data is processed lawfully, stored securely, and clients retain full control over their data. We do not use customer data for any purpose outside the automation system.",
            },
            {
              q: "What happens if something breaks?",
              a: "Automation systems are monitored with error alerts built in. Most issues are caught before they affect operations. We provide full documentation and support so you are never dependent on us to keep the system running.",
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
      <section className="bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-10 text-center">
        <p className="text-white font-semibold text-xl mb-3">
          Ready to remove yourself from the day-to-day?
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
          Book a free audit call. We&apos;ll map your current workflows, identify the highest-leverage
          automation opportunities, and tell you exactly what we&apos;d build — no obligation.
        </p>
        <Link
          href="/book-call"
          className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition"
        >
          Book a Free Audit Call →
        </Link>
      </section>

      {/* Service pages */}
      <section className="mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-4">AI Automation by Location</h2>
        <p className="text-gray-400 text-sm mb-4">
          We serve service businesses across the entire United Kingdom. Learn more about our AI automation services in your area:
        </p>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <Link href="/ai-agency-uk" className="text-teal-400 hover:underline text-sm">UK AI Agency →</Link>
          <Link href="/ai-agency-london" className="text-teal-400 hover:underline text-sm">AI Agency London →</Link>
          <Link href="/ai-agency-manchester" className="text-teal-400 hover:underline text-sm">AI Agency Manchester →</Link>
          <Link href="/ai-agency-birmingham" className="text-teal-400 hover:underline text-sm">AI Agency Birmingham →</Link>
          <Link href="/ai-agency-leeds" className="text-teal-400 hover:underline text-sm">AI Agency Leeds →</Link>
        </div>
      </section>

      {/* Internal links */}
      <section>
        <p className="text-gray-500 text-sm mb-4">Further reading</p>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <Link href="/blog/automate-client-follow-up-uk-service-businesses" className="text-teal-400 hover:underline text-sm">
            How to Automate Client Follow-Up Without a CRM →
          </Link>
          <Link href="/blog/biggest-automation-mistakes-service-businesses" className="text-teal-400 hover:underline text-sm">
            The Biggest Automation Mistakes Service Businesses Make →
          </Link>
          <Link href="/blog/essential-business-systems" className="text-teal-400 hover:underline text-sm">
            The 3 Systems Every Scalable Business Needs →
          </Link>
          <Link href="/blog/invoice-case-study" className="text-teal-400 hover:underline text-sm">
            Case Study: 25 Hours Reclaimed, £10k Recovered →
          </Link>
          <Link href="/blog/business-process-automation-uk-service-businesses" className="text-teal-400 hover:underline text-sm">
            5 Business Processes to Automate →
          </Link>
          <Link href="/blog/email-marketing-uk-service-businesses" className="text-teal-400 hover:underline text-sm">
            Email Marketing for UK Service Businesses →
          </Link>
          <Link href="/blog/automate-google-reviews-uk-trades" className="text-teal-400 hover:underline text-sm">
            Automate Google Reviews for Trades →
          </Link>
          <Link href="/blog/ai-automation-roofing-companies-uk" className="text-teal-400 hover:underline text-sm">
            AI Automation for Roofing Companies →
          </Link>
          <Link href="/blog/whatsapp-automation-uk-service-businesses" className="text-teal-400 hover:underline text-sm">
            WhatsApp Automation for Service Businesses →
          </Link>
          <Link href="/blog/lead-generation-automation-uk-service-businesses" className="text-teal-400 hover:underline text-sm">
            Automated Lead Generation Systems →
          </Link>
        </div>
      </section>
    </main>
  )
}
