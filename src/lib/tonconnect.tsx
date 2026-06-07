'use client'

<<<<<<< HEAD
import { useState, useEffect } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

export function TonConnectProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [manifestUrl, setManifestUrl] = useState('')

  useEffect(() => {
    setMounted(true)
    // Prefer an explicit public manifest URL (useful when developing on a LAN or tunneling)
    const envManifest = (process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL || '').trim()
    if (envManifest) {
      setManifestUrl(envManifest)
    } else {
      setManifestUrl(`${window.location.origin}/api/tonconnect-manifest`)
    }

    // Silence TonConnect analytics noise (from TonCoach setup)
    const orig = console.error.bind(console)
    console.error = (...args: unknown[]) => {
      const s = String(args[0] ?? '')
      if (
        s.includes('TON_CONNECT') ||
        s.includes('TonConnectError') ||
        s.includes('analytics')
      ) return
      orig(...args)
    }
    return () => {
      "use client"

      import { ReactNode } from 'react'
      import { createAppKit } from '@reown/appkit/react'
      import { TonAdapter } from '@reown/appkit-adapter-ton'
      import { ton } from '@reown/appkit/networks'

      const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!

      if (!projectId) {
        throw new Error('Missing NEXT_PUBLIC_REOWN_PROJECT_ID in environment')
      }

      const tonAdapter = new TonAdapter({ projectId })

      createAppKit({
        adapters: [tonAdapter],
        projectId,
        networks: [ton],
        defaultNetwork: ton,
        metadata: {
          name: 'TonFlow',
          description: 'Cross-chain swaps · AI advisor · Live portfolio',
          url: process.env.NEXT_PUBLIC_APP_URL || 'https://ton-flow-silk.vercel.app',
          icons: ['https://ton.org/download/ton_symbol.png'],
        },
        features: {
          analytics: false,
          // Disable email/social logins — TON wallet only
          email: false,
          socials: [],
        },
        themeMode: 'dark',
      })

      // No provider wrapper needed — createAppKit() registers everything globally.
      // We still export a thin wrapper so layout.tsx doesn't need changes.
      export function TonConnectProvider({ children }: { children: ReactNode }) {
        return <>{children}</>
      }

// We still export a thin wrapper so layout.tsx doesn't need changes.
export function TonConnectProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
>>>>>>> 834913a (fix(page): remove invalid dynamic import of disconnect)
}
