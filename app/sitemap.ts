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
  // New SEO blog posts — staggered publish dates
  { slug: "stop-losing-jobs-missed-calls-trades", date: "2026-03-28" },
  { slug: "automate-checkatrade-leads", date: "2026-03-31" },
  { slug: "whatsapp-automation-tradespeople-uk", date: "2026-04-03" },
  { slug: "ai-receptionist-electricians-uk", date: "2026-04-07" },
  { slug: "automate-quotes-roofers-uk", date: "2026-04-10" },
  { slug: "real-cost-missed-calls-plumbers", date: "2026-04-14" },
  { slug: "is-ai-replacing-tradesmen", date: "2026-04-17" },
  { slug: "automated-follow-up-trades-guide", date: "2026-04-21" },
  { slug: "get-paid-6-days-not-34-roofers", date: "2026-04-24" },
  { slug: "best-ai-automation-tools-tradesmen-uk", date: "2026-04-28" },
  { slug: "cis-job-costing-automation-builders-uk", date: "2026-04-30" },
  { slug: "email-marketing-uk-service-businesses", date: "2026-03-09" },
  // how-to-use-ai-effectively — noindexed (off-brand, dilutes topical authority)
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
    // SEO pillar page
    {
      url: `${base}/ai-automation-for-service-businesses`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },

    // Trade-specific landing pages
    { url: `${base}/ai-automation-for-roofers-uk`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.95 },
    { url: `${base}/ai-automation-for-plumbers-uk`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.95 },
    { url: `${base}/ai-automation-for-electricians-uk`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.95 },
    { url: `${base}/ai-automation-for-builders-uk`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.95 },
    { url: `${base}/ai-automation-for-landscapers-uk`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.95 },

    // Location pages — trades
    { url: `${base}/ai-automation-for-trades-birmingham`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${base}/ai-automation-for-trades-manchester`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${base}/ai-automation-for-trades-london`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${base}/ai-automation-for-trades-leeds`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${base}/ai-automation-for-trades-bristol`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${base}/ai-automation-for-trades-sheffield`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${base}/ai-automation-for-trades-liverpool`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${base}/ai-automation-for-trades-newcastle`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 },

    // ai-agency-* pages are redirected in next.config.ts — excluded from sitemap to avoid redirect chains

    // Conversion pages
    { url: `${base}/results`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/audit`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },

    // Blog index
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // Published blog posts (auto-generated)
    ...publishedBlogs,

    // Newsletter
    {
      url: `${base}/newsletter`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]
}
