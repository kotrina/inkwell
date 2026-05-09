import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "@mozilla/readability", "jsdom"],
  outputFileTracingIncludes: {
    "/api/manual": ["./docs/**/*"],
  },
};

export default nextConfig;
