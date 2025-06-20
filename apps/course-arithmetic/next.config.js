/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@educational-platform/shared-ui'],
  experimental: {
    esmExternals: false
  },
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  }
}

module.exports = nextConfig