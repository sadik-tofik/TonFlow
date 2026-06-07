'use client'

import { useState, useEffect } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

export function TonConnectProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [manifestUrl, setManifestUrl] = useState('')

  useEffect(() => {
    setMounted(true)
    const envManifest = (process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL || '').trim()
    if (envManifest) {
      setManifestUrl(envManifest)
    } else {
      setManifestUrl(`${window.location.origin}/api/tonconnect-manifest`)
    }

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
    return () => { console.error = orig }
  }, [])

  if (!mounted || !manifestUrl) {
    return (
      <div className="min-h-screen bg-[#080E1C] flex items-center justify-center">
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1565FF] animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-[#1565FF] animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-[#1565FF] animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    )
  }

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  )
}