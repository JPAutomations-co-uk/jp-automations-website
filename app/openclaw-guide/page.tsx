export default function OpenClawGuidePage() {
  return (
    <main className="relative min-h-screen bg-[#0B0F14] overflow-hidden px-6 py-24">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.05),transparent_60%)]" />

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 w-full max-w-2xl mx-auto">

        {/* Eyebrow */}
        <p className="text-teal-400 text-xs tracking-[0.3em] uppercase mb-6 font-medium">
          Free Resource — JP Automations
        </p>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-6">
          The OpenClaw<br />
          <span className="text-teal-400">Security Guide</span>
        </h1>

        <p className="text-gray-400 text-[17px] leading-[1.7] mb-16 max-w-lg">
          How to stay protected if you&apos;re using OpenClaw — including the part nobody&apos;s being paid to say.
        </p>

        <div className="space-y-12">

          {/* Section 1 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4">
              1. What Cisco&apos;s Security Team Actually Found
            </h2>
            <p className="text-gray-400 leading-[1.8] mb-4">
              Cisco&apos;s security researchers discovered that a malicious OpenClaw skill can exfiltrate your data silently — without triggering any alert, warning, or visible action on screen. The attack vector is the skill system itself: because skills run with the same permissions as OpenClaw, a compromised or malicious skill inherits full access to everything OpenClaw can touch.
            </p>
            <p className="text-gray-400 leading-[1.8]">
              That means your inbox, your calendar, your local files — all of it can be read and sent externally without you knowing. The agent takes action quietly. That&apos;s the whole point of it, and also the risk.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4">
              2. What Data Is Actually Exposed
            </h2>
            <p className="text-gray-400 leading-[1.8] mb-4">
              If OpenClaw is connected to your Gmail, it can read every email in your inbox — including client conversations, quote requests, signed contracts, and invoices with bank details. If it&apos;s connected to your calendar, it knows your schedule, your client meetings, and the notes attached to them.
            </p>
            <p className="text-gray-400 leading-[1.8]">
              This isn&apos;t just your data. If a client sent you their job spec, their address, or their payment details over email — that&apos;s their data now sitting inside a system that can be compromised through a single bad skill install.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4">
              3. How to Audit Your Installed Skills Right Now
            </h2>
            <div className="space-y-4">
              {[
                { step: '1', text: 'Open OpenClaw and navigate to Settings → Skills (or the skills directory in your config folder).' },
                { step: '2', text: 'List every skill installed. For each one, ask: where did this come from? Is it from the official OpenClaw repo, or a third-party source?' },
                { step: '3', text: 'For any skill you didn\'t install yourself or can\'t verify the source of — remove it immediately.' },
                { step: '4', text: 'Review what permissions each remaining skill requests. A skill that handles calendar events should not need inbox access.' },
              ].map(({ step, text }) => (
                <div key={step} className="flex gap-4">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-teal-400/10 border border-teal-400/30 text-teal-400 text-xs font-bold flex items-center justify-center mt-0.5">
                    {step}
                  </span>
                  <p className="text-gray-400 leading-[1.8] text-[15px]">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4">
              4. Safe Configuration Checklist
            </h2>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-5 space-y-3">
              {[
                'Only install skills from the official OpenClaw repository or sources you can personally verify',
                'Never install a skill shared via DM, Reddit, or an unknown GitHub repo',
                'Connect OpenClaw to a dedicated Gmail account — not your primary client inbox',
                'Use a separate calendar for OpenClaw, not the one with client meetings',
                'Regularly review skill permissions and remove anything you\'re not actively using',
                'Keep OpenClaw updated — security patches ship frequently',
                'Do not store contracts, invoices, or sensitive files in folders OpenClaw has file access to',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-teal-400 mt-0.5 shrink-0">✓</span>
                  <span className="text-gray-300 text-sm leading-[1.7]">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4">
              5. How to Isolate OpenClaw from Sensitive Client Data
            </h2>
            <p className="text-gray-400 leading-[1.8] mb-4">
              The simplest protection is isolation. Give OpenClaw a sandboxed environment — a dedicated email address, a separate calendar, and a specific folder on your machine — and keep your actual client work outside of it.
            </p>
            <p className="text-gray-400 leading-[1.8] mb-4">
              Think of it like a work phone: useful for certain tasks, but you wouldn&apos;t put your clients&apos; bank details on it. Same principle here.
            </p>
            <p className="text-gray-400 leading-[1.8]">
              If you want the full benefit of AI automation without the security surface area, that&apos;s exactly what a properly built custom automation gives you — scoped access, no skill marketplace risk, deployed to infrastructure you control.
            </p>
          </section>

          {/* CTA */}
          <div className="border border-white/[0.08] rounded-2xl px-8 py-8 text-center bg-white/[0.02]">
            <p className="text-white font-semibold text-lg mb-2">Want automation without the risk?</p>
            <p className="text-gray-400 text-sm leading-[1.7] mb-6 max-w-sm mx-auto">
              I build custom automations for service businesses — scoped, secure, and built around your exact workflow.
            </p>
            <a
              href="/book-call"
              className="inline-block px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition text-sm"
            >
              Book a Free Call →
            </a>
          </div>

        </div>
      </div>
    </main>
  )
}
