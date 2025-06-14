/** @type {import('next').NextConfig} */
const { composePlugins, withNx } = require('@nx/next');

const nextConfig = {
    transpilePackages: ['@educational-platform/shared-ui'],
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        styledComponents: false,
    },
    experimental: {
        optimizePackageImports: [],
    },
};

const plugins = [withNx];
module.exports = composePlugins(...plugins)(nextConfig);
