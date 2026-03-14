import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "prisma"],
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
