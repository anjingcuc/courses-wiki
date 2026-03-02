/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/courses-wiki',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
