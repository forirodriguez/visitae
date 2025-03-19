// eslint-disable-next-line @typescript-eslint/no-require-imports
const withNextIntl = require("next-intl/plugin")("./src/lib/i18n/config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["via.placeholder.com", "images.unsplash.com"],
  },
};

module.exports = withNextIntl(nextConfig);
