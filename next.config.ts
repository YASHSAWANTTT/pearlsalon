import type { NextConfig } from "next";

const clerkOrigins = [
  "https://*.clerk.com",
  "https://*.clerk.accounts.dev",
  "https://clerk.trypearlbeauty.com",
  "https://accounts.trypearlbeauty.com",
  "https://challenges.cloudflare.com",
];

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${clerkOrigins.join(" ")} https://va.vercel-scripts.com`,
  `style-src 'self' 'unsafe-inline' ${clerkOrigins.join(" ")}`,
  `img-src 'self' data: blob: https://images.unsplash.com https://*.public.blob.vercel-storage.com https://img.clerk.com https://*.clerk.accounts.dev`,
  `font-src 'self' data: ${clerkOrigins.join(" ")}`,
  `connect-src 'self' ${clerkOrigins.join(" ")} https://*.public.blob.vercel-storage.com https://vitals.vercel-insights.com`,
  `frame-src 'self' ${clerkOrigins.join(" ")} https://www.google.com https://maps.google.com`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
