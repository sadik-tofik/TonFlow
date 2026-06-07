import type { Metadata, Viewport } from 'next'
import { TonConnectProvider } from '@/lib/tonconnect'
import { TelegramProvider } from '@/lib/telegram'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'TonFlow — DeFi on TON',
  description: 'Cross-chain swaps via Omniston + AI portfolio insights. Built on TON.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#080E1C',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-Analytics Interceptor: Blocks red network errors in console */}
        <Script
          id="analytics-blocker"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const b = (u) => typeof u === 'string' && u.includes('analytics.ton.org');
                const f = window.fetch;
                window.fetch = function() {
                  if (b(arguments[0])) return Promise.resolve(new Response(null, { status: 200 }));
                  return f.apply(this, arguments);
                };
                const s = window.navigator.sendBeacon;
                window.navigator.sendBeacon = function() {
                  if (b(arguments[0])) return true;
                  return s.apply(this, arguments);
                };
              })();
            `,
          }}
        />
        <script src="https://telegram.org/js/telegram-web-app.js" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#080E1C] text-white antialiased">
        <TonConnectProvider>
          <TelegramProvider>
            {children}
          </TelegramProvider>
        </TonConnectProvider>
      </body>
    </html>
  )
}
