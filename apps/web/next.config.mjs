import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import process from "node:process";
import { assertDeployEnv } from "./config/deploy-env.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

assertDeployEnv();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function apiOrigin() {
  try {
    return new URL(API_URL).origin;
  } catch {
    return null;
  }
}

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

// The API origin is listed explicitly instead of allowing every host, so a
// compromised third-party script cannot exfiltrate the session token.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${apiOrigin() ? ` ${apiOrigin()}` : ""}`,
  "worker-src 'self' blob:",
].join("; ");

// The service worker script itself must never be cached, or a new release
// would keep serving the old worker until the browser's own heuristics expire.
// The icons are not content-hashed, so they get a short, revalidating window.
const STATIC_ASSET_CACHE = [
  { source: "/sw.js", value: "public, max-age=0, must-revalidate" },
  { source: "/site.webmanifest", value: "public, max-age=3600" },
  { source: "/icon-192.png", value: "public, max-age=3600, stale-while-revalidate=86400" },
  { source: "/icon-512.png", value: "public, max-age=3600, stale-while-revalidate=86400" },
  { source: "/apple-touch-icon.png", value: "public, max-age=3600, stale-while-revalidate=86400" },
  { source: "/apple-touch-icon-152.png", value: "public, max-age=3600, stale-while-revalidate=86400" },
  { source: "/apple-touch-icon-167.png", value: "public, max-age=3600, stale-while-revalidate=86400" },
  { source: "/favicon.svg", value: "public, max-age=3600, stale-while-revalidate=86400" },
  { source: "/logo.svg", value: "public, max-age=3600, stale-while-revalidate=86400" },
  { source: "/logo-white.svg", value: "public, max-age=3600, stale-while-revalidate=86400" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  // `standalone` is a self-hosting (Docker) output. Vercel builds its own
  // runtime output, and the extra copy only adds build time.
  output: process.env.NEXT_BUILD_DIR || process.env.VERCEL ? undefined : "standalone",
  // The workspace root is the tracing root: the Docker image expects the
  // standalone server at `apps/web/server.js`.
  outputFileTracingRoot: resolve(__dirname, "..", ".."),
  experimental: {
    // A/B-tested 2026-09-26: inlining the 120KB Tailwind sheet duplicates it in
    // the RSC payload (HTML 4.4KB -> 74KB gz) and pushed FCP 1234 -> 1371ms.
    // External stylesheet stays: one small, cacheable request.
    inlineCss: false,
  },
  turbopack: {
    root: resolve(__dirname, "..", ".."),
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...SECURITY_HEADERS,
          // The dev server needs `unsafe-eval` for its fast-refresh runtime, so
          // the policy only ships with production builds.
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY }]
            : []),
        ],
      },
      ...STATIC_ASSET_CACHE.map(({ source, value }) => ({
        source,
        headers: [{ key: "Cache-Control", value }],
      })),
    ];
  },
};

export default nextConfig;
