/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          { key: 'Content-Security-Policy', value: "frame-ancestors *" },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },
      { protocol: 'https', hostname: 'telegram.org' },
    ],
  },
  devIndicators: {
    buildActivity: false,
  },
  // Using the exact key and format requested by the Next.js dev server log
  allowedDevOrigins: ['10.141.110.33', '10.141.110.33:3000'],
}

module.exports = nextConfig
