// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  webpack(config) {
    config.experiments = {
      ...(config.experiments || {}),
      layers: true, // ✅ enable layers
    };
    return config;
  },
};

module.exports = nextConfig;
