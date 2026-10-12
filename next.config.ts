import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/auth/sign-in",
        destination: "/sign-in",
        permanent: true,
      },
      {
        source: "/auth/sign-up",
        destination: "/sign-up",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
