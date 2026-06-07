import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow Telegram WebApp script
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Required for Telegram Mini Apps
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          { key: 'Content-Security-Policy', value: "frame-ancestors *" },
        ],
      },
    ]
  },
  images: {
    domains: ['t.me', 'telegram.org'],
  },
}

export default nextConfig
