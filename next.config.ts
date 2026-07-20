import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

// Keep inline scripts/styles allowed for static rendering and Next-managed third-party scripts.
// A stricter CSP should move to Next nonce support or experimental SRI after validating the rendering impact.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://plausible.io https://*.posthog.com https://*.i.posthog.com https://emrldco.com https://pagead2.googlesyndication.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://www.google-analytics.com https://*.clarity.ms https://*.posthog.com https://*.i.posthog.com https://c.bing.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://*.clarity.ms https://plausible.io https://*.posthog.com https://*.i.posthog.com https://emrldco.com https://sentry.avs.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/tools/travel-budget-calculator",
        destination: "/travel-budget-calculator",
        permanent: true,
      },
      {
        source: "/guides/travel-budget-calculator",
        destination: "/travel-budget-calculator",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
