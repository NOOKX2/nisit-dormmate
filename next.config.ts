import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sa.ku.ac.th',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sg1-cdn.pgimgs.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.livinginsider.com', // 🟢 เพิ่มตัวนี้เข้าไปครับ
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.wonderfulpackage.com', // 🟢 เพิ่มตัวนี้เข้าไปครับ
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;