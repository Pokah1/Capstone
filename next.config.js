/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'utfs.io',
      'unsplash.com',
      'images.unsplash.com',
      'source.unsplash.com',
      'avatars.githubusercontent.com', // GitHub
      'lh3.googleusercontent.com',     // Google          // Facebook
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
