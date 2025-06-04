import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Uncomment and customize if you need to add rewrites or headers
  // async rewrites() {
  //   return [
  //     {
  //       source: '/shop/:path*',
  //       destination: '/shop/:path*', // example passthrough
  //     },
  //   ];
  // },
};

export default nextConfig;
