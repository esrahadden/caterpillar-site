import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/card",
        destination: "/card/index.html",
      },
      {
        source: "/card/",
        destination: "/card/index.html",
      },
      {
        source: "/shea",
        destination: "/shea/index.html",
      },
      {
        source: "/shea/",
        destination: "/shea/index.html",
      },
    ];
  },
};

export default nextConfig;
