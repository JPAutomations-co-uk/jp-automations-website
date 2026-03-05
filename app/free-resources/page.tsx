import Link from 'next/link'

const resources = [
  {
    title: 'The Automation Blueprint',
    description: 'The exact framework to find, build, and scale the right automation for any service business — without touching a tool until the problem is understood.',
    tag: 'Strategy',
    href: '/free-blueprint',
    cta: 'Get the Blueprint',
  },
  {
    title: 'The AI Client Folder',
    description: 'One brief per client. AI generates your proposal, invoice, contract, and CRM entry — all formatted, all ready to send — in under 5 minutes.',
    tag: 'Client Management',
    href: '/free-client-folder',
    cta: 'Get the Folder',
  },
  {
    title: 'The 10-Minute Onboarding System',
    description: 'Onboard every new client in under 10 minutes — no back-and-forth emails, no chasing documents, no manual follow-up.',
    tag: 'Automation',
    href: '/free-onboarding',
    cta: 'Get the System',
  },
  {
    title: 'The Prompt Engineering Guide',
    description: 'The complete guide to writing prompts that AI fully understands — role, context, constraints, chain of thought, and copy-paste templates.',
    tag: 'AI Skills',
    href: '/free-prompt-guide',
    cta: 'Get the Guide',
  },
  {
    title: 'The Whiteboard Image Prompt',
    description: 'The exact prompt to generate photorealistic professor whiteboard images for X and LinkedIn. Works with Grok, Nano Banana, and any image model.',
    tag: 'Content',
    href: '/free-prompt',
    cta: 'Get the Prompt',
  },
  {
    title: 'The OpenClaw Security Guide',
    description: 'OpenClaw sits inside your inbox and client files. Here\'s how to use it without putting your data — or your clients\' data — at risk.',
    tag: 'Security',
    href: '/free-openclaw',
    cta: 'Get the Guide',
  },
]

const tagColours: Record<string, string> = {
  Strategy: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  'Client Management': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Automation: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'AI Skills': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Content: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  Security: 'text-red-400 bg-red-400/10 border-red-400/20',
}

export default function FreeResourcesPage() {
  return (
    <main className="relative min-h-screen bg-[#0B0F14] overflow-hidden px-6 py-24">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.05),transparent_60%)]" />

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 w-full max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-teal-400 text-xs tracking-[0.3em] uppercase mb-5 font-medium">
            JP Automations
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-5">
            Free Resources
          </h1>
          <p className="text-gray-400 text-[17px] leading-[1.7] max-w-lg mx-auto">
            Guides, templates, and tools to help you automate your service business — all free, no fluff.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex flex-col bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:border-teal-400/30 hover:bg-white/[0.05] transition-all duration-200"
            >
              {/* Tag */}
              <span className={`self-start text-[11px] font-semibold px-2.5 py-1 rounded-full border mb-4 ${tagColours[r.tag]}`}>
                {r.tag}
              </span>

              {/* Title */}
              <h2 className="text-white font-bold text-lg leading-snug mb-3 group-hover:text-teal-400 transition-colors">
                {r.title}
              </h2>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-[1.7] flex-1 mb-6">
                {r.description}
              </p>

              {/* CTA */}
              <span className="text-teal-400 text-sm font-semibold group-hover:gap-2 flex items-center gap-1.5 transition-all">
                {r.cta}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-12 border-t border-white/[0.06]">
          <p className="text-gray-400 text-sm mb-5">
            Want a system built for your business specifically?
          </p>
          <Link
            href="/book-call"
            className="inline-block px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition text-sm"
          >
            Book a Free Call →
          </Link>
        </div>

      </div>
    </main>
  )
}
