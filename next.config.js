const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "marissacollections.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "ourahealth.imgix.net" },
      { protocol: "https", hostname: "media.augustinusbader.com" },
      { protocol: "https", hostname: "www.cosrx.com" },
      { protocol: "https", hostname: "cdn-yotpo-images-production.yotpo.com" },
      { protocol: "https", hostname: "**.spermidinelife.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
