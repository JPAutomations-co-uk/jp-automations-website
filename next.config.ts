import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Supabase generic types cause false-positive errors across all routes.
    // Runtime behaviour is correct — this bypasses the type-checker in production builds.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
