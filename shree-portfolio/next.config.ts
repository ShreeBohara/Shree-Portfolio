import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      // Still needed by the archive page's placeholder fallback; both go away
      // when /archive becomes the captioned /photos page.
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  async redirects() {
    return [
      // The QuinStreet entry became two stacked titles (full-time above
      // internship), so its old single id no longer resolves.
      { source: '/experience/exp-1', destination: '/experience/exp-quinstreet-ft', permanent: true },
      // Removed project: the public repo behind it is a two-day scaffold with
      // none of the claimed AI, so the entry was cut rather than demoted.
      { source: '/projects/ai-resume-builder', destination: '/browse?section=projects', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
