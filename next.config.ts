import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "@mozilla/readability", "jsdom"],
};

export default nextConfig;
