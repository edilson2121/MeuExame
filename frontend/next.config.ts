import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['172.27.64.1', 'localhost', '127.0.0.1'],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;