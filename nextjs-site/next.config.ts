import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '.next',
  generateBuildId: async () => {
    // Use a fixed build ID or generate based on timestamp
    return 'production-build'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      }
    ],
  }
};

export default nextConfig;
