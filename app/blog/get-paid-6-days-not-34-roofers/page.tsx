import Link from "next/link"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Get Paid in 6 Days Instead of 34 as a Roofer",
  description: "The average roofer waits 34 days to get paid. One Birmingham crew got it down to 6 with automated invoicing. Here's exactly how.",
  author: { "@type": "Person", name: "JP", url: "https://www.jpautomations.co.uk", sameAs: "https://www.linkedin.com/in/james-harvey-0583b2370/" },
  publisher: { "@type": "Organization", name: "JP Automations", logo: { "@type": "ImageObject", url: "https://www.jpautomations.co.uk/logo.png" } },
  datePublished: "2026-04-24",
  dateModified: "2026-04-24",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.jpautomations.co.uk/blog/get-paid-6-days-not-34-roofers" },
  keywords: ["invoice automation roofers UK", "get paid faster roofer", "roofer late payments", "roofing cash flow", "automated invoicing trades"],
}

export default function Page() {
  return (
    <main className="bg-black text-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="relative max-w-4xl mx-auto px-6 py-24">
        <div className="mb-10">
          <Link href="/blog" className="text-sm text-gray-400 hover:text-teal-400 transition">&larr; Back to all articles</Link>
        </div>

        <header className="mb-12">
          <p className="text-sm text-gray-400 mb-4">Published 24 April 2026</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            How to Get Paid in <span className="text-teal-400">6 Days</span> Instead of 34 as a Roofer
          </h1>
        </header>

        <section className="mb-16">
          <p className="text-lg text-gray-400 leading-relaxed">
            You&apos;ve finished the job. The tiles are on, the flashing&apos;s sealed, the scaffolding&apos;s coming down tomorrow. The customer shakes your hand and says &quot;brilliant job, mate.&quot; You drive home, crack open a beer, and think about sending the invoice.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            Then you don&apos;t. Because you&apos;re knackered. You&apos;ll do it tomorrow. Tomorrow becomes Thursday. Thursday becomes next week. By the time the invoice goes out, the customer&apos;s forgotten the urgency. They sit on it. You wait. And wait. And eventually chase them up with an awkward text three weeks later.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mt-6">
            According to NFRC data and FSB small business reports, the average time for a roofing contractor to receive payment is 34 days from job completion. Some wait 60+. Meanwhile, your materials suppliers want paying in 30. Your lads need paying on Friday. The maths doesn&apos;t work.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Late Payment Problem in Roofing</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Roofing has a worse late payment problem than most trades, and it comes down to job size. A plumber doing a £180 callout can ask for payment on the spot. A roofer finishing a £4,000 re-roof? That invoice gets &quot;processed&quot; — which is code for sitting in someone&apos;s email for a fortnight.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">34 days</p>
              <p className="text-gray-400 text-xs mt-1">average payment time for roofers</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">45%</p>
              <p className="text-gray-400 text-xs mt-1">of roofing invoices paid late</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">£8,500</p>
              <p className="text-gray-400 text-xs mt-1">avg outstanding at any given time</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-teal-400">62%</p>
              <p className="text-gray-400 text-xs mt-1">of roofers report cash flow stress</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            The FSB reports that late payments cost UK small businesses £22,000 per year on average. For roofers, where individual jobs run into the thousands, the impact is amplified. One late payment can mean you can&apos;t afford materials for the next job. It&apos;s a domino effect that keeps your business permanently on the back foot.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Why It Happens</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Late payments in roofing aren&apos;t usually because the customer is dodgy. Most of the time, it&apos;s a process problem — and it starts with you.
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Invoice sent late</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The number one cause. If you finish the job on Wednesday and send the invoice the following Monday, you&apos;ve already added 5 days before the clock even starts. Most roofers admit they don&apos;t invoice on the day the job finishes. Some take a week or more.
              </p>
            </div>
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">No follow-up system</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Invoice goes out. No payment after a week. You think &quot;I should chase that.&quot; Another week passes. Eventually you send an awkward text. The customer says &quot;oh sorry, forgot — I&apos;ll do it now.&quot; Two weeks wasted because nobody nudged them.
              </p>
            </div>
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Friction in the payment process</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                If your invoice is a PDF attached to an email and the customer has to manually set up a bank transfer, you&apos;ve added friction. Every extra step between &quot;I should pay this&quot; and &quot;it&apos;s paid&quot; adds days.
              </p>
            </div>
            <div className="border-l-2 border-red-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">No clear payment terms</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                If your invoice doesn&apos;t say &quot;payment due within 7 days,&quot; the customer assumes they&apos;ve got 30. Or whenever they get round to it. Setting expectations upfront changes everything.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Manual Process vs the Automated Process</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Let&apos;s compare what most roofers do versus what the Birmingham crew did after automation:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-5">
              <p className="text-red-400 font-semibold text-sm uppercase tracking-wide mb-3">Manual Process</p>
              <div className="space-y-2">
                {[
                  "Finish job → promise to invoice 'tonight'",
                  "Get home, too tired, do it 'tomorrow'",
                  "Send invoice 3-5 days late",
                  "Customer doesn't pay immediately",
                  "Forget to follow up for a week",
                  "Send awkward chase text",
                  "Payment arrives 30-40 days later",
                  "Repeat, perpetually skint",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-red-400 text-xs">&#10005;</span>
                    <p className="text-gray-400 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-teal-400/5 border border-teal-400/10 rounded-xl p-5">
              <p className="text-teal-400 font-semibold text-sm uppercase tracking-wide mb-3">Automated Process</p>
              <div className="space-y-2">
                {[
                  "Finish job → mark as complete in CRM",
                  "Invoice generated and sent within minutes",
                  "Payment link included — one click to pay",
                  "48hrs unpaid → automatic SMS reminder",
                  "5 days unpaid → email follow-up",
                  "7 days → final polite nudge",
                  "Payment arrives in 4-7 days average",
                  "Cash flow sorted, no awkward conversations",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-teal-400 text-xs">&#10003;</span>
                    <p className="text-gray-400 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">How the Birmingham Crew Did It</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            A roofing crew based in South Birmingham came to us with a problem that&apos;ll sound familiar: they were doing £15-20k a month in work but their bank account didn&apos;t reflect it. At any given time, they had £8-10k outstanding. Materials were going on credit cards. The owner was losing sleep.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            The fix wasn&apos;t complicated. We didn&apos;t change their tools — they already used Xero. We just removed the human bottleneck from the invoicing process.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Here&apos;s the system, step by step:
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 1: Job marked complete</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                When the foreman marks a job as &quot;done&quot; in their CRM (they use a simple Google Sheet, nothing fancy), the system picks it up automatically. No manual trigger needed beyond updating a status field.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 2: Invoice generated in Xero</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The automation creates the invoice in Xero using the job details — customer name, job description, agreed price, payment terms (7 days). It includes a Stripe payment link so the customer can pay with one click.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 3: Invoice sent same day</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                The invoice goes out via email within minutes of job completion. Not tomorrow. Not &quot;when I get round to it.&quot; Same day, every time.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 4: Automated reminders</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                48 hours after sending: a friendly SMS — &quot;Hi [name], just a reminder your invoice for the roofing work is attached. You can pay online here: [link]. Cheers!&quot; After 5 days: an email follow-up. After 7 days: a final text. The messages are polite and professional. The roofer never has to send an awkward chase-up again.
              </p>
            </div>
            <div className="border-l-2 border-teal-400 pl-5">
              <p className="text-white text-sm font-semibold mb-1">Step 5: Payment received</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                With same-day invoicing and automated reminders, most customers pay within 4-7 days. The average across their first 3 months was 6 days — down from 34.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">The Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { value: "34 → 6", label: "Days to payment" },
              { value: "£0", label: "Overdue invoices" },
              { value: "15hrs", label: "Admin saved monthly" },
              { value: "Zero", label: "Awkward chase texts" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
                <p className="text-2xl md:text-3xl font-bold text-teal-400">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 leading-relaxed mb-4">
            Within the first month, their outstanding balance dropped from £8,500 to under £1,000. By month three, they were consistently at near-zero outstanding. The owner stopped putting materials on credit cards. Started sleeping better. Started thinking about growth instead of survival.
          </p>
          <p className="text-gray-400 leading-relaxed">
            We wrote up the full story in our{" "}
            <Link href="/blog/invoice-case-study" className="text-teal-400 hover:underline">invoice automation case study</Link> if you want the detailed before/after breakdown with screenshots.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Why This Works So Well for Roofers Specifically</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Roofing has a few characteristics that make invoice automation particularly effective:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">Higher job values.</strong> A £4,000 re-roof paid 28 days faster frees up serious cash flow. The impact per invoice is much bigger than smaller trades.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">Material costs are front-loaded.</strong> You buy tiles, felt, and timber before you start. Getting paid faster means less reliance on credit.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">End-of-day fatigue.</strong> After 8 hours on a roof, you&apos;re not sitting down to do admin. The automation means you don&apos;t have to.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">&rarr;</span>
              <p className="text-gray-400"><strong className="text-white">Seasonal pressure.</strong> Autumn and winter are peak season. You need cash flow running smoothly when you&apos;re doing 2-3 jobs a week.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">How to Set This Up for Your Roofing Business</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            You don&apos;t need to change your accounting software. You don&apos;t need a new CRM. You need three things:
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-teal-400">1</span>
              <p className="text-gray-400"><strong className="text-white">A way to mark jobs as complete</strong> — could be a CRM, a Google Sheet, or even a WhatsApp message to a trigger number. It just needs to be a digital signal that says &quot;this job is done.&quot;</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">2</span>
              <p className="text-gray-400"><strong className="text-white">An accounting tool with an API</strong> — Xero, QuickBooks, or FreeAgent. These all support automated invoice creation.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-teal-400">3</span>
              <p className="text-gray-400"><strong className="text-white">An automation layer</strong> — something that connects the &quot;job complete&quot; signal to the invoice creation and follow-up. This is what we build at{" "}
              <Link href="/ai-automation-for-roofers-uk" className="text-teal-400 hover:underline">JP Automations for roofers</Link>.</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">
            The whole thing can be set up in a week. From that point forward, every invoice goes out on time, every reminder sends automatically, and you never have to chase a payment again.
          </p>
        </section>

        <section className="mb-20 border-l-2 border-teal-400 pl-6">
          <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            You&apos;re not in the roofing business to chase invoices. But bad cash flow kills more roofing businesses than bad weather does. Getting paid in 6 days instead of 34 isn&apos;t magic — it&apos;s just removing the human delay from a process that should have been automated years ago.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Same work. Same prices. Same customers. Better system. That&apos;s the difference.
          </p>
        </section>

        <section className="mb-20 bg-gradient-to-br from-teal-400/10 via-teal-400/5 to-transparent border border-teal-400/20 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Stop waiting 34 days to get paid
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Book a free audit and I&apos;ll show you exactly how to automate your invoicing — from job completion to payment in your account.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-black font-medium rounded-xl hover:bg-teal-300 transition"
          >
            Get Your Free Audit &rarr;
          </Link>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">&larr; Back to Blog</Link>
          <Link href="/ai-automation-for-roofers-uk" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">AI Automation for Roofers &rarr;</Link>
          <Link href="/blog/invoice-case-study" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-xl hover:border-teal-400 hover:text-teal-400 transition text-sm">Read: Invoice Automation Case Study &rarr;</Link>
        </div>
      </article>
    </main>
  )
}
