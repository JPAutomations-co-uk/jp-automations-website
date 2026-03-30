import Image from "next/image"
import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Biggest Automation Mistakes Service Businesses Make",
  description:
    "Why most automation projects fail — and how UK service businesses should actually approach AI automation to save time and recover revenue.",
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
  datePublished: "2026-01-24",
  dateModified: "2026-01-24",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.jpautomations.co.uk/blog/biggest-automation-mistakes-service-businesses",
  },
  keywords: [
    "automation mistakes",
    "service business automation",
    "AI automation mistakes",
    "business automation UK",
  ],
}

export default function Page() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-24 text-white animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* Back to blog */}
      <div className="mb-10">
        <Link
          href="/blog"
          className="text-sm text-gray-400 hover:text-teal-400 transition"
        >
          ← Back to all articles
        </Link>
      </div>

     {/* Blog Hero Image */}
<div className="mb-16">
  <div className="relative overflow-hidden rounded-3xl border border-white/10">
    <Image
      src="/blog/automation-mistakes-service-businesses.webp"
      alt="The biggest automation mistakes service businesses make"
      width={1200}
      height={750}
      priority
      className="w-full aspect-[16/10] object-cover"
    />
    {/* Subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
  </div>
</div>


      {/* Title + date */}
      <header className="mb-12">
        <p className="text-sm text-gray-400 mb-4">
          Published January 24, 2026
        </p>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          The{" "}
          <span className="text-teal-400">
            Biggest Automation Mistakes
          </span>{" "}
          Service Businesses Make
        </h1>
      </header>

      {/* Intro */}
      <section className="mb-16">
        <p className="text-lg text-gray-400 leading-relaxed">
          Most automation projects don’t fail because the technology is bad,
          that’s simply not the case. They fail because service businesses try to
          automate broken processes.
        </p>

        <p className="text-lg text-gray-400 leading-relaxed mt-6">
          <strong>AI automation for service businesses</strong> only works when
          systems are designed around how work actually flows. Without that
          foundation, automation multiplies complexity, creates blind spots, and
          often increases the owner’s workload instead of reducing it.
        </p>

        <p className="text-lg text-gray-400 leading-relaxed mt-6">
          Below are the most common automation mistakes service businesses make,
          and what actually works instead.
        </p>
      </section>

      {/* Mistake 1 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4">
          Mistake #1: Automating Broken Processes
        </h2>

        <p className="text-gray-400 leading-relaxed mb-4">
          Most of the time, service businesses attempt automation before fully
          understanding their own operations.
        </p>

        <p className="text-gray-400 leading-relaxed mt-6">
          If enquiries, job handovers, scheduling, and follow-ups aren’t clearly
          defined, automation simply accelerates confusion. Tasks fire at the
          wrong time, messages go unanswered, and team members lose trust in the
          system.
        </p>

        <p className="text-gray-400 leading-relaxed mt-6">
        Automation should support a clean, intentional process — not replace one that doesn’t exist.
        </p>
      </section>

      {/* Mistake 2 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4">
          Mistake #2: Choosing Tools Before Designing the System
        </h2>

        <p className="text-gray-400 leading-relaxed">
        One of the most common automation mistakes is starting with software instead of structure.
        </p>
        <p className="text-gray-400 leading-relaxed mt-6">
        Buying a CRM or automation platform does not create a system. Tools only execute decisions that should already be made about how information moves, who is responsible at each stage, and what outcomes matter.
        </p>
        <p className="text-gray-400 leading-relaxed mt-6">
        When automation projects fail, it’s often because tools were layered on top of unclear workflows.
        </p>
      </section>

      {/* Mistake 3 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4">
          Mistake #3: Automating Individual Tasks Instead of End-to-End Workflows
        </h2>

        <p className="text-gray-400 leading-relaxed mb-4">
          Automating a single task can feel productive, but it rarely creates
          meaningful leverage.
        </p>

        <p className="text-gray-400 leading-relaxed mb-4">
        The best results come from automations that connect entire workflows:
        </p>

        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>Enquiry to qualification</li>
          <li>Booking to delivery</li>
          <li>Completion to follow-up</li>
        </ul>

        <p className="text-gray-400 leading-relaxed mb-4 mt-6">
        When automation focuses on isolated actions instead of complete processes, businesses still rely on manual oversight and constant intervention.
        </p>


      </section>

      {/* Mistake 4 */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-4">
          Mistake #4: Keeping the Owner as the Bottleneck
        </h2>

        <p className="text-gray-400 leading-relaxed">
        In many service businesses, the owner remains central to every decision, even after automation is introduced. 
If systems still require the owner to approve, chase, or manually correct work, automation hasn’t solved the problem. It has simply added another layer to manage. 
</p>

<p className="text-gray-400 leading-relaxed mt-6">
What’s the point in paying £1,500 for a “call handling” system that creates more work for you?
It’s complete BS, and it’s exactly where most automation agencies and freelancers leave their clients.
Effective AI automation systems reduce routine decision-making and remove the owner from day-to-day operational flow.
        </p>
      </section>

      {/* What works */}
      <section className="mb-20 border-l-2 border-teal-400 pl-6">
        <h2 className="text-3xl font-bold mb-4">
          Closing Note
        </h2>

        <p className="text-gray-400 leading-relaxed">
        Service business automation isn’t about adding more tools or complexity.
It’s about building systems that allow the business to operate consistently.
        </p>
        <p className="text-gray-400 leading-relaxed mt-6">
        That means you focus on the expertise you provide, while we handle the technical systems you probably don’t have the time (or patience) to build yourself.
        </p>
      </section>

      {/* Internal link CTA */}
      <section className="mb-20">
        <p className="text-gray-400 leading-relaxed mb-6">
          If you want to understand how properly designed automation systems
          work in practice, read our detailed breakdown on{" "}
          <Link
            href="/ai-automation-for-service-businesses"
            className="text-teal-400 hover:underline"
          >
            AI automation for service businesses
          </Link>.
        </p>

        <p className="text-gray-400 leading-relaxed mb-8">
          If follow-up is where your system breaks down — leads going cold, no consistent sequence after a first enquiry — read our guide on{" "}
          <Link
            href="/blog/automate-client-follow-up-uk-service-businesses"
            className="text-teal-400 hover:underline"
          >
            how to automate client follow-up without a CRM
          </Link>.
        </p>

        <Link
          href="/blog"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-teal-500 text-black font-semibold hover:bg-teal-400 transition"
        >
          View all articles
        </Link>
      </section>
    </main>
  )
}
