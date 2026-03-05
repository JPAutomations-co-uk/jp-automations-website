import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/og"],
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/login",
          "/api/",
          "/onboarding",
          "/onboarding/",
          "/blueprint",
          "/prompt",
          "/prompt-guide",
        ],
      },
    ],
    sitemap: "https://www.jpautomations.co.uk/sitemap.xml",
  }
}
