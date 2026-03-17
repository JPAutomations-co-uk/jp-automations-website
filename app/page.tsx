import Link from "next/link"
import HomeClient from "./HomeClient"

export default function Home() {
  return (
    <HomeClient>
      <section className="relative z-10 bg-black text-white py-20 md:py-28 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">

          {/* --- What We Build --- */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              AI Automation Systems That Run Your Business
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              We build bespoke automation infrastructure for UK service businesses
              doing &pound;15k+/month. Every system is designed to remove you from the
              day-to-day and recover time and revenue you&apos;re currently losing.
            </p>
            <div className="mt-8">
              <Link
                href="/ai-automation-for-service-businesses"
                className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors"
              >
                See exactly how it works
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* --- Services Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white mb-3">Lead Generation &amp; Enquiry Handling</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every enquiry answered instantly, qualified automatically, and booked
                into your calendar &mdash; even at 11pm on a Sunday. No more leads going
                cold while you&apos;re on a job.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white mb-3">Automated Quoting &amp; Follow-Up</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Quotes sent within minutes of enquiry. Follow-ups handled
                automatically. Accepted quotes arrive in your inbox without you
                chasing a single one.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white mb-3">Invoice &amp; Payment Automation</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Invoices sent the moment a job is done, with polite reminders
                chasing for you. One client recovered &pound;10k in outstanding payments
                within 30 days.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white mb-3">CRM &amp; Client Management</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every lead tracked in one place with automatic follow-ups. Nothing
                falls through the cracks, even when you&apos;re flat out on site.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white mb-3">Client Onboarding Systems</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                New clients onboarded in under 10 minutes. Contracts, welcome
                emails, access setup, and project kickoff &mdash; all handled without
                lifting a finger.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white mb-3">AI Content &amp; Marketing Tools</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Generate SEO blog posts, Instagram content, LinkedIn posts, and
                email campaigns with AI. Built specifically for service business owners.
              </p>
            </div>
          </div>

          {/* --- Social Proof --- */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-5">
              Real Results From UK Service Businesses
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              25+ hours reclaimed per week. &pound;10k+ recovered in month one. 5x
              sales increases. Systems live in 30 days with ROI within 90.
            </p>
            <Link
              href="/more"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-teal-400 text-black rounded-xl font-bold text-sm hover:bg-teal-300 transition-all"
            >
              View Case Studies
              <span>&rarr;</span>
            </Link>
          </div>

          {/* --- From the Blog --- */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center">
              Guides &amp; Case Studies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/blog/business-process-automation-uk-service-businesses" className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-teal-400/30 transition-colors">
                <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">5 Processes Every UK Service Business Should Automate</h3>
                <p className="text-gray-500 text-xs leading-relaxed">The five processes quietly draining time and revenue every week.</p>
              </Link>
              <Link href="/blog/automate-client-follow-up-uk-service-businesses" className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-teal-400/30 transition-colors">
                <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">How to Automate Client Follow-Up Without a CRM</h3>
                <p className="text-gray-500 text-xs leading-relaxed">Why most service businesses lose leads and how to fix it automatically.</p>
              </Link>
              <Link href="/blog/invoice-case-study" className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-teal-400/30 transition-colors">
                <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">Case Study: 25 Hours &amp; &pound;10k Recovered</h3>
                <p className="text-gray-500 text-xs leading-relaxed">How invoicing automation transformed a roofing contractor&apos;s cash flow.</p>
              </Link>
              <Link href="/blog/email-marketing-uk-service-businesses" className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-teal-400/30 transition-colors">
                <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">Email Marketing for UK Service Businesses</h3>
                <p className="text-gray-500 text-xs leading-relaxed">Automate email campaigns that convert enquiries into paying clients.</p>
              </Link>
            </div>
            <div className="text-center mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors text-sm"
              >
                View all blog posts
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* --- UK AI Agency --- */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-5 text-center">
              A UK AI Agency Built for Service Businesses
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed mb-4 text-center">
              JP Automations is a UK-based AI agency that specialises in building
              automation systems for service businesses and tradespeople. Unlike generic
              automation tools, every system we build is designed around how your
              specific business operates.
            </p>
            <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8 text-center">
              We work with roofing contractors, cleaning companies, electricians, plumbers,
              landscapers, property managers, personal trainers, and professional service
              firms across the United Kingdom. From lead capture to invoicing, from client
              follow-up to review collection &mdash; we automate the operational work that
              stops you scaling.
            </p>
            <div className="text-center">
              <Link
                href="/ai-agency-uk"
                className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors"
              >
                Learn about our AI agency services
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* --- Industries --- */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center">
              Industries We Automate
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                "Roofing Contractors",
                "Cleaning Companies",
                "Electricians & Plumbers",
                "Landscaping & Garden Care",
                "Property Management",
                "Building & Construction",
                "Personal Trainers",
                "Professional Services",
              ].map((industry) => (
                <div key={industry} className="text-center text-gray-400 text-sm bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3">
                  {industry}
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm text-center max-w-2xl mx-auto">
              If your business has repeatable processes and you&apos;re spending 10+ hours
              a week on admin, we can automate it. The industry doesn&apos;t matter &mdash;
              the operational pattern does.
            </p>
          </div>

          {/* --- Locations --- */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-5 text-center">
              AI Automation Across the UK
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto leading-relaxed mb-8">
              We serve service businesses across every region of the United Kingdom.
              All systems are built remotely and deployed digitally.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/ai-agency-london" className="text-sm text-gray-400 hover:text-teal-400 border border-white/10 rounded-lg px-4 py-2 transition-colors">London</Link>
              <Link href="/ai-agency-manchester" className="text-sm text-gray-400 hover:text-teal-400 border border-white/10 rounded-lg px-4 py-2 transition-colors">Manchester</Link>
              <Link href="/ai-agency-birmingham" className="text-sm text-gray-400 hover:text-teal-400 border border-white/10 rounded-lg px-4 py-2 transition-colors">Birmingham</Link>
              <Link href="/ai-agency-leeds" className="text-sm text-gray-400 hover:text-teal-400 border border-white/10 rounded-lg px-4 py-2 transition-colors">Leeds</Link>
            </div>
          </div>

          {/* --- Free Resources CTA --- */}
          <div className="rounded-2xl border border-teal-400/20 bg-teal-400/[0.03] p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Free Automation Resources
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto leading-relaxed mb-6">
              Guides, templates, and tools to help you start automating your service
              business today. No sign-up required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/free-resources"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-teal-400 text-black rounded-xl font-bold text-sm hover:bg-teal-300 transition-all"
              >
                Browse Free Resources
                <span>&rarr;</span>
              </Link>
              <Link
                href="/ai-automation-for-service-businesses"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-teal-400/45 text-teal-300 rounded-xl font-bold text-sm hover:bg-teal-400/10 transition-all"
              >
                How AI Automation Works
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </HomeClient>
  )
}
