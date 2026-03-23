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
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', 
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'pub-327436dd7f1b40baa6b026e5aa601b79.r2.dev', 
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', 
        pathname: '/**',
      },

    ],
  },
};

export default nextConfig;