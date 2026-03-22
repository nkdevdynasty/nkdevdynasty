import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@hookform/resolvers"],
  serverExternalPackages: ["@prisma/client", "prisma"],
  // Allow dev HMR when accessing via Tailscale IP instead of localhost.
  allowedDevOrigins: ["100.64.11.64"],
  async rewrites() {
    return [
      {
        source: "/docs/_next/:path*",
        destination: "http://localhost:3001/docs/_next/:path*",
      },
      {
        source: "/docs",
        destination: "http://localhost:3001/docs/docs",
      },
      {
        source: "/docs/:path*",
        destination: "http://localhost:3001/docs/docs/:path*",
      },
    ];
  },
};

export default nextConfig;
