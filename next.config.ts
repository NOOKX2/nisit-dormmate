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
        hostname: 'www.livinginsider.com', 
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.wonderfulpackage.com', 
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;