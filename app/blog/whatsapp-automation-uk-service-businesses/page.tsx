import Image from "next/image"
import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "WhatsApp Automation for UK Service Businesses",
  description:
    "How UK service businesses use WhatsApp Business API automation for quotes, bookings, follow-ups, and payment reminders — without being glued to their phone.",
  author: { "@type": "Organization", name: "JP Automations", url: "https://www.jpautomations.co.uk" },
  publisher: { "@type": "Organization", name: "JP Automations", logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" } },
  datePublished: "2026-03-23",
  dateModified: "2026-03-23",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.jpautomations.co.uk/blog/whatsapp-automation-uk-service-businesses" },
  keywords: ["WhatsApp automation UK", "WhatsApp Business API UK", "automated WhatsApp follow-up", "WhatsApp for tradesmen", "WhatsApp CRM integration UK"],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is WhatsApp Business API different from the WhatsApp Business app?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The free WhatsApp Business app is designed for manual use — you reply to messages yourself. The WhatsApp Business API allows programmatic sending, automated replies, and integration with CRMs and automation tools. The API requires a Business Solution Provider (like Twilio, 360dialog, or WABA360) and costs £0.03-0.08 per conversation." },
    },
    {
      "@type": "Question",
      name: "Can I send promotional messages on WhatsApp?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, but only to contacts who have opted in. WhatsApp requires explicit consent before sending marketing messages. For service businesses, this typically means the client messaged you first or opted in via your website. Transactional messages (booking confirmations, payment reminders) have more relaxed rules." },
    },
    {
      "@type": "Question",
      name: "How much does WhatsApp automation cost?",
      acceptedAnswer: { "@type": "Answer", text: "The WhatsApp Business API itself costs £0.03-0.08 per conversation (24-hour window). A Business Solution Provider adds £30-100/month. The automation platform (Make, n8n) adds £15-50/month. Total for a service business doing 200 client conversations/month: £80-200/month." },
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
            <Image src="/blog/whatsapp-automation-uk-service-businesses.jpg" alt="WhatsApp automation for UK service businesses" width={1200} height={750} priority className="w-full aspect-[16/10] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>

        <header className="mb-12">
          <p className="text-sm text-gray-400 mb-4">Published 23 March 2026</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-teal-400">WhatsApp Automation</span> for UK Service Businesses
          </h1>
        </header>

        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            Your clients don&apos;t check email. They barely answer calls from unknown numbers. But they read every WhatsApp message within minutes.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            28 million people in the UK use WhatsApp daily. For service businesses, it&apos;s already the default communication channel — clients send enquiries, ask for updates, and confirm bookings through WhatsApp. The problem is that it&apos;s entirely manual. You&apos;re typing every reply, chasing every follow-up, and losing messages in group chats.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            WhatsApp automation changes that. The same channel your clients already use becomes a system that acknowledges enquiries, confirms bookings, sends reminders, and chases payments — all without you touching your phone.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">WhatsApp Business App vs WhatsApp Business API</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Most service businesses use the free WhatsApp Business app. It gives you a business profile, quick replies, and labels. But it&apos;s designed for one person manually replying to messages. You can&apos;t automate anything.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            The WhatsApp Business API is different. It allows programmatic messaging — meaning other software can send and receive WhatsApp messages on your behalf. This is what powers the automated booking confirmations, payment reminders, and follow-up sequences.
          </p>
          <p className="text-gray-400 leading-relaxed">
            You access the API through a Business Solution Provider (Twilio, 360dialog, or WABA360 are the most common in the UK). Cost is typically £0.03-0.08 per conversation plus the provider&apos;s monthly fee.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">5 WhatsApp Automations Every Service Business Should Run</h2>
          <div className="space-y-6">
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">1. Instant enquiry acknowledgement</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                When a new enquiry comes in (from any channel — website, phone, or WhatsApp itself), the system sends a WhatsApp message within 2 minutes. Personalised with their name, confirming what they asked about, and telling them when they&apos;ll hear back. This alone puts you ahead of 90% of competitors.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">2. Booking confirmations and reminders</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                When a job is booked, the client gets a WhatsApp confirmation with date, time, and what to expect. 24 hours before the job, an automated reminder goes out. No-shows and &quot;I forgot&quot; cancellations drop dramatically.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">3. Job completion and review request</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                After the job, a WhatsApp message confirms completion, shares any relevant photos or documents, and includes a direct link to leave a Google review. WhatsApp review requests get 2-3x the response rate of email.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">4. Payment reminders</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Gentle payment reminders via WhatsApp at 3, 7, and 14 days after invoice. Include a direct payment link. WhatsApp reminders consistently outperform email for collection rates because the message actually gets read.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6">
              <p className="text-white font-semibold mb-2">5. Seasonal reactivation</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                For recurring service businesses (cleaning, gardening, HVAC), automated WhatsApp messages to past clients at the right time of year: &quot;Hi [name], it&apos;s been 6 months since your last service. Want us to book you in?&quot; Reactivation from existing clients is the cheapest revenue you can get.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">How to Set It Up</h2>
          <p className="text-gray-400 leading-relaxed mb-6">The technical stack for WhatsApp automation:</p>
          <div className="space-y-4">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 1: Get WhatsApp Business API access</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sign up with a Business Solution Provider (Twilio is the most developer-friendly, 360dialog is cheapest). You&apos;ll need a verified Facebook Business account and a dedicated phone number.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 2: Create message templates</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                WhatsApp requires pre-approved templates for outbound messages. Submit your booking confirmation, payment reminder, and review request templates for approval. This typically takes 24-48 hours.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 3: Connect to your automation platform</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Wire the API to Make or n8n. Set up triggers from your booking system, invoicing tool, or CRM. When an event happens (job booked, invoice sent, job completed), the right WhatsApp message goes out automatically.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 4: Test with real conversations</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Send test messages to yourself and your team. Check timing, personalisation, and links. Then go live with a small batch of clients before rolling out to everyone.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">What About GDPR?</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            WhatsApp automation is GDPR-compliant when you follow the basics: get consent before sending marketing messages, process data lawfully, and allow opt-out. Transactional messages (booking confirmations, payment reminders for existing clients) are covered under &quot;legitimate interest&quot; or &quot;contract performance&quot; — you don&apos;t need separate consent for these.
          </p>
          <p className="text-gray-400 leading-relaxed">
            For marketing messages (seasonal offers, reactivation campaigns), you need explicit opt-in. The easiest way: add a WhatsApp opt-in checkbox to your booking form. Most clients tick it because they prefer WhatsApp to email anyway.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Is WhatsApp Business API different from the free app?</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yes. The free app is for manual use. The API allows automated sending, CRM integration, and programmatic replies. Costs £0.03-0.08 per conversation plus provider fees.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">Can I send promotional messages?</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yes, but only to opted-in contacts. Transactional messages (confirmations, reminders) have more relaxed consent requirements under GDPR.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white font-semibold mb-2">How much does it cost?</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                £80-200/month total for a service business doing 200 client conversations per month. Includes API costs, provider fee, and automation platform.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            WhatsApp is already the channel your clients prefer. The only question is whether you run it manually — replying to every message yourself — or build a system that handles the repetitive parts automatically while you focus on the work.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Booking confirmations, payment reminders, review requests, and reactivation messages. All on the channel with a 95% open rate. All running without you.
          </p>
        </section>

        <section className="mb-20 bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8 text-center">
          <p className="text-white font-semibold text-lg mb-2">Want WhatsApp automation built for your business?</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            We build WhatsApp automation systems for UK service businesses — enquiry handling, bookings, payments, and reviews on the channel your clients already use.
          </p>
          <Link href="/book-call" className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-semibold rounded-xl hover:bg-teal-300 transition">
            Book a Free Call &rarr;
          </Link>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">&larr; Back to Blog</Link>
          <Link href="/blog/automate-client-follow-up-uk-service-businesses" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: Automate Client Follow-Up &rarr;</Link>
          <Link href="/blog/automate-google-reviews-uk-trades" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: Automate Google Reviews &rarr;</Link>
        </div>
      </article>
    </main>
  )
}
