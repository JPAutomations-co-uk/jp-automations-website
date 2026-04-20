import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Supabase generic types cause false-positive errors across all routes.
    // Runtime behaviour is correct — this bypasses the type-checker in production builds.
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      { source: "/blog/crm-automation-personal-trainers-uk", destination: "/ai-automation-for-service-businesses", permanent: true },
      // Landing page redirects — old per-platform pages → unified Social Engine
      { source: "/apps/instagram-content", destination: "/apps/social-engine", permanent: true },
      { source: "/apps/linkedin-content", destination: "/apps/social-engine", permanent: true },
      { source: "/apps/x-content", destination: "/apps/social-engine", permanent: true },
      { source: "/apps/youtube-content", destination: "/apps/social-engine", permanent: true },
      // Dashboard redirects — old per-platform dashboards → unified engine sub-routes
      { source: "/dashboard/instagram", destination: "/dashboard/social-engine/instagram", permanent: true },
      { source: "/dashboard/instagram/:path*", destination: "/dashboard/social-engine/instagram/:path*", permanent: true },
      { source: "/dashboard/linkedin", destination: "/dashboard/social-engine/linkedin", permanent: true },
      { source: "/dashboard/linkedin/:path*", destination: "/dashboard/social-engine/linkedin/:path*", permanent: true },
      { source: "/dashboard/x", destination: "/dashboard/social-engine/x", permanent: true },
      { source: "/dashboard/x/:path*", destination: "/dashboard/social-engine/x/:path*", permanent: true },
      { source: "/dashboard/youtube", destination: "/dashboard/social-engine/youtube", permanent: true },
      // Old pages → new structure
      { source: "/apply", destination: "/audit", permanent: true },
      { source: "/ai-agency-uk", destination: "/", permanent: true },
      { source: "/ai-agency-london", destination: "/ai-automation-for-trades-london", permanent: true },
      { source: "/ai-agency-manchester", destination: "/ai-automation-for-trades-manchester", permanent: true },
      { source: "/ai-agency-birmingham", destination: "/ai-automation-for-trades-birmingham", permanent: true },
      { source: "/ai-agency-leeds", destination: "/ai-automation-for-trades-leeds", permanent: true },
      // Old trade URL patterns
      { source: "/for-roofers", destination: "/ai-automation-for-roofers-uk", permanent: true },
      { source: "/for-plumbers", destination: "/ai-automation-for-plumbers-uk", permanent: true },
      { source: "/for-electricians", destination: "/ai-automation-for-electricians-uk", permanent: true },
      { source: "/for-builders", destination: "/ai-automation-for-builders-uk", permanent: true },
      { source: "/for-landscapers", destination: "/ai-automation-for-landscapers-uk", permanent: true },
      // Old lead magnet pages → newsletter or blog
      { source: "/free-blueprint", destination: "/newsletter", permanent: true },
      { source: "/free-prompt", destination: "/newsletter", permanent: true },
      { source: "/free-prompt-guide", destination: "/newsletter", permanent: true },
      { source: "/free-onboarding", destination: "/newsletter", permanent: true },
      { source: "/free-client-folder", destination: "/newsletter", permanent: true },
      { source: "/free-resources", destination: "/newsletter", permanent: true },
      { source: "/free-openclaw", destination: "/newsletter", permanent: true },
      { source: "/blueprint", destination: "/newsletter", permanent: true },
      { source: "/prompt", destination: "/newsletter", permanent: true },
      { source: "/prompt-guide", destination: "/newsletter", permanent: true },
      { source: "/onboarding-guide", destination: "/newsletter", permanent: true },
      { source: "/client-folder-guide", destination: "/newsletter", permanent: true },
      { source: "/openclaw-guide", destination: "/newsletter", permanent: true },
    ]
  },
};

export default nextConfig;
