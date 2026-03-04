import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog — AI Automation Guides & Case Studies",
  description:
    "Free guides and case studies for UK trade and service businesses. Learn how AI automation saves time, recovers revenue, and builds scalable systems that run without you.",
  alternates: {
    canonical: "https://www.jpautomations.co.uk/blog",
  },
  openGraph: {
    title: "Blog — AI Automation for UK Service Businesses | JP Automations",
    description:
      "Case studies, frameworks, and practical guides for UK trade businesses ready to use AI automation to grow.",
    url: "https://www.jpautomations.co.uk/blog",
    images: [
      {
        url: "https://www.jpautomations.co.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "JP Automations Blog",
      },
    ],
  },
}

export default function BlogIndexPage() {
  const posts = [
    {
      title: "Setting Up Your IDE Properly, From Scratch",
      excerpt:
        "Most developers open VS Code, install a dark theme, and think they're done. This is the complete setup — secrets protection, git signing, linting, TypeScript strict mode, pre-commit hooks, and AI configuration.",
      slug: "/setup-your-ide-properly",
      image: "/blog/IDE.jpg",
      date: "4 March 2026",
    },
    {
      title: "How to Automate Client Follow-Up for UK Service Businesses (Without a CRM)",
      excerpt:
        "Most service businesses lose leads not because of bad pricing — but because follow-up is slow or inconsistent. Here's how to fix it automatically.",
      slug: "/automate-client-follow-up-uk-service-businesses",
      image: "/blog/follow-up.jpg",
      date: "2 March 2026",
    },
    {
      title: "Case Study: 25 Hours Reclaimed, Four Figures Recovered",
      excerpt:
        "How a simple invoicing automation eliminated admin and stabilised cash flow for a roofing contractor.",
      slug: "/invoice-case-study",
      image: "/blog/case-study-invoice.jpg",
      date: "January 2026",
    },
    {
      title: "The Biggest Automation Mistakes Service Businesses Make",
      excerpt:
        "Why most automation projects fail — and how service businesses should actually approach AI automation.",
      slug: "/biggest-automation-mistakes-service-businesses",
      image: "/blog/automation-mistakes-service-businesses.jpg",
      date: "24 January 2026",
    },
    {
      title: "The 3 Systems Every Scalable Business Needs",
      excerpt:
        "If your business feels stuck, these are the systems likely holding you back.",
      slug: "/essential-business-systems",
      image: "/blog/business-systems.jpg",
      date: "January 2026",
    },
  ]


  return (
    <main className="bg-black min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 mb-12 text-sm font-medium text-gray-400 hover:text-teal-400 transition-colors"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Back to home
        </a>

        <h1 className="text-9xl font-bold text-white text-center">
          The <span className="text-teal-400">Blog</span>
        </h1>
        <p className="mt-6 text-lg text-gray-300 text-center max-w-3xl mx-auto">
          Free resources, insights, and practical tips designed to help trade businesses grow to their full potential using smart digital systems.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          {posts.map((post) => (
            <a
              key={post.slug}
              href={`/blog${post.slug}`}
              className="group rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-teal-400 transition"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-8">
                <p className="text-xs text-gray-500 mb-2">{post.date}</p>
                <h2 className="text-2xl font-semibold text-white group-hover:text-teal-400">
                  {post.title}
                </h2>
                <p className="mt-4 text-gray-400">
                  {post.excerpt}
                </p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </main>
  )
}