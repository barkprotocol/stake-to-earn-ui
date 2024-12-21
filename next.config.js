// next.config.js
const path = require('path');

module.exports = {
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },

  // Add ucarecdn.com to the list of allowed image domains
  images: {
    domains: [
      'ucarecdn.com',  // Add this domain for image optimization
      'example.com',   // Add any other domains you are using
      'another-domain.com',
    ],
  },

  // Other configuration options
  reactStrictMode: true,
};
