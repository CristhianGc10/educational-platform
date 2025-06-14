/* apps/main-platform/next.config.js */
const { composePlugins, withNx } = require('@nx/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Next 14 + Nx
    reactStrictMode: true,
    output: 'standalone',

    // Transpilación de workspaces internos
    transpilePackages: [
        '@educational-platform/shared-ui',
        '@educational-platform/shared-types',
        '@educational-platform/shared-utils',
        '@educational-platform/auth-system',
        '@educational-platform/analytics-engine',
    ],

    // Variables de entorno
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        CUSTOM_KEY: 'educational-platform',
    },

    // Carga de imágenes remotas
    images: {
        remotePatterns: [{ protocol: 'https', hostname: '**' }],
    },

    // Webpack
    webpack: (config, { isServer }) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        if (isServer) config.externals.push('_http_common'); // prisma fix opcional
        return config;
    },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
