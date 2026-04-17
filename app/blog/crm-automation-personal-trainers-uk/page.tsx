import Image from "next/image"
import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The PT's Guide to Running a Fully Automated Fitness Business",
  description: "CRM, scheduling, and client management automation for personal trainers. How to run a fitness business that doesn't depend on you remembering everything.",
  author: { "@type": "Person", name: "JP", url: "https://www.jpautomations.co.uk", sameAs: "https://www.linkedin.com/in/james-harvey-0583b2370/" },
  publisher: { "@type": "Organization", name: "JP Automations", logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" } },
  datePublished: "2026-04-09",
  dateModified: "2026-04-09",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.jpautomations.co.uk/blog/crm-automation-personal-trainers-uk" },
  keywords: ["CRM automation personal trainers UK", "PT business automation", "personal trainer client management", "automate fitness business", "booking automation PT"],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What's the best CRM for a personal trainer in the UK?",
      acceptedAnswer: { "@type": "Answer", text: "For solo PTs, a simple setup (Google Sheets + Calendly + email automation) outperforms most CRMs. For PTs with 30+ clients or a small team, TrueCoach, Exercise.com, or PT Distinction handle programming and client management. The key isn't the tool — it's the automation around it. The best CRM is one that connects to your booking, payments, and follow-up system." },
    },
    {
      "@type": "Question",
      name: "Can I automate client onboarding as a personal trainer?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, completely. When a new client signs up: automated welcome email with what to expect, health questionnaire form, PAR-Q sent for completion, payment setup via direct debit, first session booking link, and pre-session preparation guide. The whole onboarding runs in 24 hours without you sending a single message." },
    },
    {
      "@type": "Question",
      name: "How much time can a PT save with automation?",
      acceptedAnswer: { "@type": "Answer", text: "A PT with 20-40 active clients typically saves 8-15 hours per week in admin — scheduling, reminders, check-ins, invoicing, and lead follow-up. That's 2-3 extra client sessions per day, or an entire day back for programme design and content creation." },
    },
  ],
}

export default function Page() {
  return (
    <main className="bg-black text-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="relative max-w-4xl mx-auto px-6 py-24">
        <div className="mb-10">
          <Link href="/blog" className="text-sm text-gray-400 hover:text-teal-400 transition">&larr; Back to all articles</Link>
        </div>

        <div className="mb-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <Image src="/blog/crm-automation-personal-trainers-uk.jpg" alt="Automation for personal trainers in the UK" width={1200} height={750} priority className="w-full aspect-[16/10] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>

        <header className="mb-12">
          <p className="text-sm text-gray-400 mb-4">Published 9 April 2026</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            The PT&apos;s Guide to Running a{" "}
            <span className="text-teal-400">Fully Automated</span> Fitness Business
          </h1>
        </header>

        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            You got into personal training to help people get fitter. Instead, you spend half your day sending booking confirmations, chasing invoices, replying to DMs, writing check-in messages, and updating spreadsheets.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            A PT with 30 active clients has 30 people to schedule, message, invoice, track, and follow up with — every single week. That&apos;s not personal training. That&apos;s admin with biceps.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            The PTs who scale past £10k/month without burning out all do the same thing: they automate the repetitive client management so they can focus on training, programming, and growing.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Admin That Kills PT Businesses</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            The admin load for a busy PT typically breaks down like this:
          </p>
          <div className="space-y-4">
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">Booking and rescheduling</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                &quot;Can we move Thursday to Friday?&quot; &quot;I can&apos;t make it this week.&quot; &quot;What times do you have on Monday?&quot; Back-and-forth scheduling messages eat 30-60 minutes per day for a PT with 20+ clients.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">Invoicing and payment chasing</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Monthly invoices, one-off session payments, package purchases, missed payments. Some clients pay on time. Some need chasing. Some &quot;forget&quot; for weeks. The awkwardness of chasing a client you train three times a week is unique to this industry.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">Client check-ins and accountability</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Weekly progress messages, responding to food diary photos, adjusting macros, answering questions between sessions. Essential for results — but impossible to do consistently for 30+ clients manually.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">Lead follow-up</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Someone DMs asking about prices. You reply four hours later. They&apos;ve already messaged two other PTs. The ones who respond fastest get the client. You lose leads not because of price — but because of speed.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">Onboarding new clients</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Welcome message, health questionnaire, PAR-Q, payment setup, first session booking, explaining how sessions work. Each new client onboarding takes 30-60 minutes of back-and-forth. It should take zero.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The 6 Automations Every PT Needs</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">1. Self-service booking</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Clients book, reschedule, and cancel sessions themselves through a booking link. Automated confirmations 24 hours before. Automated reminders 2 hours before. No-show follow-up if they miss. You never send another &quot;what time works for you?&quot; message.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">2. Automated onboarding</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                New client signs up → welcome email (what to expect) → health questionnaire form → PAR-Q → payment setup link → first session booking link. All within 24 hours. Zero messages from you. The client feels handled. You feel nothing because it happened automatically.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">3. Payment automation</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Monthly recurring payments via GoCardless or Stripe. Automatic invoices. Automated reminders for failed payments. No more awkward &quot;hey, your payment bounced&quot; conversations — the system handles it professionally.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">4. Automated check-ins</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Weekly check-in form sent every Sunday evening: weight, measurements, progress photos, how they&apos;re feeling. Responses collected in one place for you to review in batch — instead of 30 separate WhatsApp threads. You review and respond in 30 minutes instead of 3 hours.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">5. Lead follow-up</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                DM or enquiry comes in → instant acknowledgement within 2 minutes → automated{" "}
                <Link href="/blog/automate-client-follow-up-uk-service-businesses" className="text-teal-400 hover:underline">follow-up sequence</Link>{" "}
                over 5 days (social proof, transformation story, booking link). The lead gets nurtured whether you&apos;re mid-session or asleep.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">6. Reactivation campaigns</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                When a client hasn&apos;t booked in 2 weeks, automated message: &quot;Hey [name], noticed you haven&apos;t booked recently. Everything okay? Here&apos;s a link to book your next session.&quot; This alone recovers 20-30% of clients who would otherwise quietly churn.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Tool Stack</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            You don&apos;t need expensive PT software to automate. Here&apos;s the minimum viable stack:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li><strong>Booking:</strong> Calendly, Cal.com, or Acuity (free-£15/month)</li>
            <li><strong>Payments:</strong> GoCardless for recurring, Stripe for one-off (transaction fees only)</li>
            <li><strong>Email/SMS:</strong> Resend or Brevo for automated sequences (free tier)</li>
            <li><strong>Forms:</strong> Tally or Typeform for questionnaires and check-ins (free tier)</li>
            <li><strong>Automation glue:</strong> Make or n8n to connect everything (£15-30/month)</li>
            <li><strong>Programming:</strong> TrueCoach, Exercise.com, or Google Sheets if you&apos;re starting out</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            Total: £30-60/month. Less than the cost of one PT session. And it saves you 8-15 hours per week — that&apos;s 2-3 extra sessions per day you could be delivering (or taking off).
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Scaling Beyond 1:1</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The ceiling for a solo PT doing only 1:1 sessions is around £8-12k/month (depending on session pricing and hours). Automation doesn&apos;t just save time — it creates the capacity to add revenue streams:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
            <li><strong>Online coaching</strong> — automated programme delivery, check-ins, and progress tracking</li>
            <li><strong>Group training</strong> — automated bookings and waitlists for group sessions</li>
            <li><strong>Hybrid model</strong> — mix of in-person and online clients, all managed through the same system</li>
          </ul>
          <p className="text-gray-400 leading-relaxed">
            With{" "}
            <Link href="/ai-automation-for-service-businesses" className="text-teal-400 hover:underline">the right automation system</Link>, you can manage 50+ clients (mix of 1:1 and online) with the same admin load you currently have for 15. That&apos;s how PTs break through the income ceiling without working more hours.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">What&apos;s the best CRM for a personal trainer?</p>
              <p className="text-gray-400 text-sm leading-relaxed">For solo PTs, Google Sheets + Calendly + email automation outperforms most CRMs. For 30+ clients, TrueCoach or PT Distinction. The key isn&apos;t the tool — it&apos;s the automation connecting everything.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Can I automate client onboarding?</p>
              <p className="text-gray-400 text-sm leading-relaxed">Completely. Welcome email, health questionnaire, PAR-Q, payment setup, first session booking — all automated within 24 hours of sign-up. Zero messages from you.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">How much time can a PT save?</p>
              <p className="text-gray-400 text-sm leading-relaxed">8-15 hours per week with 20-40 active clients. That&apos;s 2-3 extra sessions per day, or an entire day for programming and content.</p>
            </div>
          </div>
        </section>

        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            The admin around personal training is predictable and repetitive. Booking, onboarding, check-ins, payments, follow-up. It follows the same pattern for every client, every week.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Automate it. Get your time back. Use that time to train more clients, create content, or build the online arm of your business. The PTs who scale don&apos;t work harder — they build systems.
          </p>
        </section>

        <section className="mb-20 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8 text-center">
          <p className="text-white font-semibold text-lg mb-2">Want your PT business fully automated?</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            We build automation systems for personal trainers — booking, onboarding, payments, check-ins, and lead follow-up. All connected. All running without you.
          </p>
          <Link href="/book-call" className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition">Book a Free Call &rarr;</Link>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">&larr; Back to Blog</Link>
          <Link href="/blog/lead-generation-automation-uk-service-businesses" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: Automated Lead Generation &rarr;</Link>
          <Link href="/blog/essential-business-systems" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: 3 Systems Every Business Needs &rarr;</Link>
        </div>
      </article>
    </main>
  )
}
