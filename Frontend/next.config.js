// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.experiments = {
      ...(config.experiments || {}),
      layers: true, // ✅ enable layers
    };
    return config;
  },
};

module.exports = nextConfig;
