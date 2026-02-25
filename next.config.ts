import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sa.ku.ac.th',
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;