import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/store",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/store",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "profile.line-scdn.net",
      },
      {
        protocol: "https",
        hostname: "**.line-scdn.net",
      },
    ],
  },
};

export default nextConfig;
