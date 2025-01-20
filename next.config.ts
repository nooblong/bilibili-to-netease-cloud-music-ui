import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  async rewrites() {
    return [{
      source: '/api/:path*',
      destination: 'http://127.0.0.1:25565/:path*',
    },
    ]
  }
};

export default nextConfig;
