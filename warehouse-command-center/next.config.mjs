/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Server Actions are stable in Next 14; body size limit guards large photo payloads.
    serverActions: {
      bodySizeLimit: '8mb',
    },
  },
  async headers() {
    // Security headers applied to every response. CSP is intentionally strict;
    // adjust connect-src to your Supabase project URL at deploy time via env.
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(self)' },
    ];
    return [
      { source: '/:path*', headers: securityHeaders },
      // The service worker must be served from the root scope with no long cache.
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }] },
    ];
  },
};

export default nextConfig;
