import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {
    root: path.resolve(__dirname),
  },

  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;