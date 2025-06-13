 /** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: [
    '@educational-platform/shared-ui',
    '@educational-platform/shared-types',
    '@educational-platform/shared-utils',
    '@educational-platform/auth-system',
    '@educational-platform/analytics-engine',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  env: {
    CUSTOM_KEY: 'educational-platform',
  },
}

module.exports = nextConfig