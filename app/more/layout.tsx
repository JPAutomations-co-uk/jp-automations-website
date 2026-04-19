import type { Metadata } from "next"

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is this different from any other agency or freelancer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most agencies and freelancers focus on individual tasks delivered in isolation. We build connected systems across your entire business. The outcome isn't more activity. It's a business that runs smoothly, scales with control, and doesn't depend on you.",
      },
    },
    {
      "@type": "Question",
      name: "Will this work for my type of service business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Service businesses across sectors are ideal — strong demand, weak systems, owner as the bottleneck. If you're doing £15k+/month and growth is creating chaos instead of freedom, this is built for you.",
      },
    },
    {
      "@type": "Question",
      name: "How involved do I need to be once things are set up?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Very little. Once live, systems handle the work and you step in only where decisions genuinely matter.",
      },
    },
    {
      "@type": "Question",
      name: "Will I still have visibility and control over my business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you gain more control, not less. Visibility is built into the systems so you always know what's happening without micromanaging.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I want to change or adjust systems later?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nothing is locked in. Everything is custom-built, documented, and designed to evolve as your business grows.",
      },
    },
    {
      "@type": "Question",
      name: "How much of my time does setup take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Less than continuing to do everything yourself. We handle the build. You give us access and clarity on how things work. That's it.",
      },
    },
    {
      "@type": "Question",
      name: "Will this add more complexity to my business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, it completely removes it. Systems replace chaos and mental load with structure, clarity, and simplicity.",
      },
    },
    {
      "@type": "Question",
      name: "Who is this not a good fit for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Businesses happy staying small. Owners looking for shortcuts. People unwilling to modernise. Anyone shopping purely on price. Anyone unwilling to have their processes documented and examined.",
      },
    },
    {
      "@type": "Question",
      name: "How much does it cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every engagement is scoped after the audit because every business is different. We don't publish prices because a price without context is meaningless. Book a call and we'll be upfront about whether this makes sense for you.",
      },
    },
  ],
}

export const metadata: Metadata = {
  title: "Client Results & Case Studies",
  description:
    "Real results from UK service businesses. 25+ hours reclaimed per week, 5x sales increases, £10k+ recovered in month one. See how AI automation transforms operations.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/more",
  },
  openGraph: {
    title: "Client Results & Case Studies | JP Automations",
    description:
      "25+ hours reclaimed weekly. £10k+ recovered in month one. Under 24 hours to first paid deal. Real results from UK service businesses.",
    url: "https://www.jpautomations.co.uk/more",
    type: "website",
    images: [
      {
        url: "https://www.jpautomations.co.uk/api/og?title=Client+Results+%26+Case+Studies&subtitle=JP+Automations",
        width: 1200,
        height: 630,
        alt: "JP Automations Client Results & Case Studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Results & Case Studies",
    description:
      "25+ hours reclaimed weekly. £10k+ recovered in month one. Real results from UK service businesses.",
    images: ["https://www.jpautomations.co.uk/api/og?title=Client+Results+%26+Case+Studies&subtitle=JP+Automations"],
  },
}

export default function MoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
