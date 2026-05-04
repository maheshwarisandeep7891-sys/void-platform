import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during build (we run it separately)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build for faster deploys
  typescript: {
    ignoreBuildErrors: false,
  },

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
    ],
  },

  // External packages for server components
  serverExternalPackages: ["@prisma/client", "prisma"],

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/feed",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
