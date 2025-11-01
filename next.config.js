/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === 'production' ? '/soil-test' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/soil-test/' : '',
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
