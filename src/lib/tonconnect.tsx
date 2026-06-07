'use client'

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
