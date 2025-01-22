import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  async rewrites() {
    return [{
      source: '/api/:path*',
      // destination: 'http://106.75.218.120:25565/:path*',
      destination: 'http://127.0.0.1:25565/:path*',
    },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
