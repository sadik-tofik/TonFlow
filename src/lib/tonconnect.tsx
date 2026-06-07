'use client'

import { TonConnectUIProvider } from '@tonconnect/ui-react'

const MANIFEST_URL =
  process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL ||
  'https://tonflow.vercel.app/tonconnect-manifest.json'

export function TonConnectProvider({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      {children}
    </TonConnectUIProvider>
  )
}
