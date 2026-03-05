import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.jpautomations.co.uk"
  const now = new Date()

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
      url: `${base}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
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

    // Blog
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/blog/business-process-automation-uk-service-businesses`,
      lastModified: new Date("2026-03-05"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/blog/automate-client-follow-up-uk-service-businesses`,
      lastModified: new Date("2026-03-02"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/blog/invoice-case-study`,
      lastModified: new Date("2026-01-24"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/biggest-automation-mistakes-service-businesses`,
      lastModified: new Date("2026-01-24"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/essential-business-systems`,
      lastModified: new Date("2026-01-24"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/setup-your-ide-properly`,
      lastModified: new Date("2026-03-04"),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // Lead magnet landing pages (publicly discoverable)
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

    // Apps (public-facing pages)
    {
      url: `${base}/apps/ai-news-filter`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/apps/instagram-content`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/apps/linkedin-content`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/apps/seo-blog`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/apps/x-content`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/apps/youtube-content`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]
}
