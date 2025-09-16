/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/user',
  devIndicators: {
    buildActivity: false,
  },

  reactStrictMode: false,

  images: {
    unoptimized: true,
  },

  output: 'export',

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
