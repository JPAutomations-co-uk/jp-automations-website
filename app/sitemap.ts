import type { MetadataRoute } from "next"

/**
 * Blog posts with their publish dates.
 * When a new blog goes live, add it here — the sitemap auto-includes it
 * only after the publishDate has passed.
 */
const blogPosts = [
  { slug: "automate-google-reviews-uk-trades", date: "2026-03-16" },
  { slug: "ai-automation-roofing-companies-uk", date: "2026-03-19" },
  { slug: "whatsapp-automation-uk-service-businesses", date: "2026-03-23" },
  { slug: "lead-generation-automation-uk-service-businesses", date: "2026-03-26" },
  { slug: "ai-phone-answering-uk-tradespeople", date: "2026-03-30" },
  { slug: "automate-quoting-invoicing-uk-trades", date: "2026-04-02" },
  { slug: "ai-automation-cleaning-companies-uk", date: "2026-04-06" },
  { slug: "crm-automation-personal-trainers-uk", date: "2026-04-09" },
  { slug: "email-marketing-uk-service-businesses", date: "2026-03-09" },
  { slug: "how-to-use-ai-effectively", date: "2026-03-07" },
  { slug: "business-process-automation-uk-service-businesses", date: "2026-03-05" },
  { slug: "automate-client-follow-up-uk-service-businesses", date: "2026-03-02" },
  { slug: "invoice-case-study", date: "2026-01-24" },
  { slug: "biggest-automation-mistakes-service-businesses", date: "2026-01-24" },
  { slug: "essential-business-systems", date: "2026-01-24" },
  // SCHEDULED-BLOG-MARKER
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.jpautomations.co.uk"
  const now = new Date()
  const today = now.toISOString().slice(0, 10)

  // Only include published blog posts (publishDate <= today)
  const publishedBlogs: MetadataRoute.Sitemap = blogPosts
    .filter((post) => post.date <= today)
    .map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))

  return [
    // Core pages
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/more`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/book-call`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/apply`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // SEO pillar page
    {
      url: `${base}/ai-automation-for-service-businesses`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },

    // Service pages
    {
      url: `${base}/ai-agency-uk`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${base}/ai-agency-london`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/ai-agency-manchester`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/ai-agency-birmingham`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/ai-agency-leeds`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },

    // Blog index
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // Published blog posts (auto-generated)
    ...publishedBlogs,

    // Lead magnet landing pages
    {
      url: `${base}/free-blueprint`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/free-prompt-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/free-prompt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/free-onboarding`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/onboarding-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/free-client-folder`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/client-folder-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/free-resources`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/free-openclaw`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/openclaw-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },

    // Newsletter
    {
      url: `${base}/newsletter`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]
}
