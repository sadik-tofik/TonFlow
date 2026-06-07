'use client'

import { useState } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { Zap, ArrowRight, Loader2 } from 'lucide-react'

interface TelegramUser { id: number; first_name: string; username?: string }
interface OnboardingProps {
  onConnected: () => void
  telegramUser?: TelegramUser | null
}

export function Onboarding({ onConnected, telegramUser }: OnboardingProps) {
  const { open } = useAppKit()
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConnect() {
    if (connecting) return
    setError(null)
    setConnecting(true)
    try {
      await open({ view: 'Connect' })
      // onConnected fires via wallet.connected flip in page.tsx
    } catch (e: any) {
      await open({ view: 'Connect' })
      // onConnected fires via wallet.connected flip in page.tsx
    } catch (e: any) {
>>>>>>> 834913a (fix(page): remove invalid dynamic import of disconnect)
      const msg = String(e?.message ?? e ?? '')
      if (
        !msg.includes('Modal closed') &&
        !msg.includes('User rejects') &&
        !msg.includes('user rejected')
      ) {
        setError('Could not open wallet modal. Please try again.')
      }
      }
    } finally {
      setConnecting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080E1C] relative overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(21,101,255,0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-20%] w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(0,152,234,0.1) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div
              className="w-24 h-24 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #1565FF 0%, #0098EA 100%)',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                boxShadow: '0 0 60px rgba(21,101,255,0.5), 0 0 120px rgba(21,101,255,0.2)',
              }}
            >
              <Zap size={36} className="text-white fill-white" />
            </div>
            <div
              className="absolute inset-0 -m-2 opacity-30 animate-pulse"
              style={{
                background: 'linear-gradient(135deg, #1565FF, #0098EA)',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                filter: 'blur(8px)',
              }}
            />
          </div>

          <div className="text-center">
            {telegramUser && (
              <p className="text-sm text-[#5A6B82] mb-2">Hey {telegramUser.first_name} 👋</p>
            )}
            <h1 className="text-5xl font-black text-white leading-none" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              TonFlow
            </h1>
            <p className="text-[#5A6B82] text-base mt-3 leading-relaxed">
              Cross-chain swaps · AI advisor · Live portfolio<br />
              <span className="text-[#1565FF]">all inside Telegram</span>
            </p>
          </div>
        </div>

        {/* Feature list */}
        <div className="w-full flex flex-col gap-2.5">
          {[
            { icon: '⚡', title: 'Cross-chain Swaps', desc: 'Best rates via Omniston across 5 chains' },
            { icon: '🤖', title: 'Mira AI Advisor', desc: 'Ask anything about your portfolio' },
            { icon: '📊', title: 'Live Portfolio', desc: 'Real-time balances from your wallet' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3.5 bg-[#0D1829] rounded-2xl p-4 border border-white/[0.05]">
              <span className="text-2xl flex-shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-[#5A6B82] mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-12 pt-4 relative z-10 flex flex-col gap-3">
        {error && (
          <p className="text-center text-xs text-red-400 bg-red-500/10 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleConnect}
          disabled={connecting}
          className="w-full h-14 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 relative overflow-hidden group transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #1565FF, #0098EA)', boxShadow: '0 8px 32px rgba(21,101,255,0.4)' }}
        >
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          {connecting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Opening wallet…
            </>
          ) : (
            <>
              <span className="text-xl">💎</span>
              Connect Tonkeeper Wallet
              <ArrowRight size={18} className="ml-1" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#3A4B5C]">
          Powered by <span className="text-[#8A9BB5]">STON.fi Omniston</span> · <span className="text-[#8A9BB5]">TON</span>
        </p>
      </div>
    </div>
  )
}
