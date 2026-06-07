'use client'

import { useState } from 'react'
import { Bell, Copy, TrendingUp, TrendingDown, ArrowLeftRight, ArrowUp, ArrowDown, Droplets, ChevronRight, Zap, RefreshCw, Wallet } from 'lucide-react'
import { Card, Badge, Skeleton } from '@/components/ui'
import { cn, formatUSD, formatChange } from '@/lib/utils'
import { MOCK_POOLS } from '@/lib/mockData'
import type { TabId, Token } from '@/types'
import type { WalletState } from '@/hooks/useWallet'

interface DashboardProps {
  onTabChange: (tab: TabId) => void
  wallet: WalletState
  telegramUser?: { first_name: string; username?: string } | null
}

function TokenRow({ token, onClick }: { token: Token; onClick: () => void }) {
  const isPos = token.change24h >= 0
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-[#0D1829] border border-white/[0.04] hover:border-[#1565FF]/30 hover:bg-[#111f35] transition-all active:scale-[0.98] text-left"
    >
      {/* Logo */}
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 relative"
        style={{ background: `${token.color}18`, border: `1.5px solid ${token.color}30` }}
      >
        {token.logo}
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0098EA] flex items-center justify-center text-[8px] border border-[#080E1C]">💎</span>
      </div>
      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-tight">{token.name}</p>
        <p className="text-xs text-[#5A6B82] mt-0.5">{token.symbol} · TON</p>
      </div>
      {/* Values */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-white tabular-nums">{token.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        <div className="flex items-center gap-1.5 justify-end mt-0.5">
          <span className="text-xs text-[#5A6B82]">{formatUSD(token.usdValue)}</span>
          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-md', isPos ? 'bg-[#00D897]/10 text-[#00D897]' : 'bg-[#FF4D6A]/10 text-[#FF4D6A]')}>
            {isPos ? '+' : ''}{token.change24h.toFixed(2)}%
          </span>
        </div>
      </div>
    </button>
  )
}

export function Dashboard({ onTabChange, wallet, telegramUser }: DashboardProps) {
  const [copied, setCopied] = useState(false)

  const greeting = telegramUser?.first_name ? `Hey ${telegramUser.first_name} 👋` : 'Welcome back 👋'
  const isPosChange = wallet.change24hPct >= 0

  function copyAddress() {
    if (!wallet.address) return
    navigator.clipboard?.writeText(wallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col pb-28 min-h-screen">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 sticky top-0 bg-[#080E1C]/95 backdrop-blur-xl z-20 border-b border-white/[0.03]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1565FF,#0098EA)' }}>
            <Zap size={17} className="text-white fill-white" />
          </div>
          <div>
            <p className="text-[11px] text-[#5A6B82] leading-none">TonFlow</p>
            <p className="text-sm font-semibold text-white leading-tight">{greeting}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {wallet.shortAddress && (
            <button
              onClick={copyAddress}
              className="flex items-center gap-1.5 bg-[#0D1829] border border-white/[0.06] rounded-xl px-3 py-1.5 hover:border-[#1565FF]/40 transition-all"
            >
              <span className="text-[11px] text-[#8A9BB5] font-mono">{wallet.shortAddress}</span>
              <Copy size={11} className={cn('transition-colors', copied ? 'text-[#00D897]' : 'text-[#4A5568]')} />
            </button>
          )}
          <button onClick={() => wallet.refresh()} disabled={wallet.refreshing} className="p-2 text-[#4A5568] hover:text-white transition-colors">
            <RefreshCw size={16} className={cn(wallet.refreshing && 'animate-spin')} />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-5">

        {/* ── Portfolio Hero ── */}
        <div className="relative rounded-3xl overflow-hidden p-5" style={{ background: 'linear-gradient(135deg, #0D1829 0%, #111d35 50%, #0a1422 100%)', border: '1px solid rgba(21,101,255,0.15)' }}>
          {/* Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(21,101,255,0.12) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,152,234,0.08) 0%, transparent 70%)' }} />

          <p className="text-xs text-[#5A6B82] mb-1 relative">Total Portfolio Value</p>

          {wallet.loading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          ) : (
            <>
              <p className="text-[42px] font-black text-white leading-none relative" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                {formatUSD(wallet.totalUsd)}
              </p>
              <div className="flex items-center gap-1.5 mt-2 relative">
                {isPosChange
                  ? <TrendingUp size={14} className="text-[#00D897]" />
                  : <TrendingDown size={14} className="text-[#FF4D6A]" />}
                <span className={cn('text-sm font-semibold', isPosChange ? 'text-[#00D897]' : 'text-[#FF4D6A]')}>
                  {isPosChange ? '+' : ''}{formatUSD(wallet.change24hUsd)} ({formatChange(wallet.change24hPct)}) today
                </span>
              </div>
            </>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/[0.06] relative">
            {[
              { label: 'Tokens', value: wallet.tokens.length || '—' },
              { label: 'Network', value: process.env.NEXT_PUBLIC_TON_NETWORK === 'testnet' ? 'Testnet' : 'Mainnet' },
              { label: 'Pending', value: wallet.transactions.filter(t => t.status === 'pending').length || '0' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-sm font-bold text-white">{value}</p>
                <p className="text-[10px] text-[#5A6B82] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { label: 'Swap', icon: ArrowLeftRight, color: '#1565FF', tab: 'swap' as TabId },
            { label: 'Send', icon: ArrowUp, color: '#8A9BB5', tab: 'history' as TabId },
            { label: 'Receive', icon: ArrowDown, color: '#00D897', tab: 'history' as TabId },
            { label: 'Pools', icon: Droplets, color: '#0098EA', tab: 'swap' as TabId },
          ].map(({ label, icon: Icon, color, tab }) => (
            <button
              key={label}
              onClick={() => onTabChange(tab)}
              className="flex flex-col items-center gap-2 bg-[#0D1829] rounded-2xl py-3.5 px-2 border border-white/[0.04] hover:border-white/10 hover:bg-[#111d35] transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={18} style={{ color }} strokeWidth={2} />
              </div>
              <span className="text-[11px] font-semibold text-[#8A9BB5]">{label}</span>
            </button>
          ))}
        </div>

        {/* ── Your Tokens ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Your Tokens</h2>
            <button className="text-xs text-[#1565FF] font-semibold flex items-center gap-1 hover:text-[#4d8aff] transition-colors">
              View All <ChevronRight size={13} />
            </button>
          </div>

          {wallet.loading ? (
            <div className="flex flex-col gap-2">
              {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : wallet.tokens.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-3 bg-[#0D1829] rounded-2xl border border-white/[0.04]">
              <Wallet size={32} className="text-[#4A5568]" />
              <p className="text-sm text-[#5A6B82]">No tokens found</p>
              <p className="text-xs text-[#3A4B5C]">Connect your Tonkeeper wallet to see balances</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {wallet.tokens.map(token => (
                <TokenRow key={token.symbol} token={token} onClick={() => onTabChange('swap')} />
              ))}
            </div>
          )}
        </div>

        {/* ── STON.fi Opportunities ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>STON.fi Pools</h2>
            <button className="text-xs text-[#1565FF] font-semibold flex items-center gap-1 hover:text-[#4d8aff] transition-colors">
              View All <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {MOCK_POOLS.map(pool => (
              <div
                key={pool.pair}
                className="flex-shrink-0 w-48 rounded-2xl p-4 flex flex-col gap-3"
                style={{ background: 'linear-gradient(135deg,#0D1829,#111d35)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <span className="text-xl">{pool.token0Logo}</span>
                    <span className="text-xl">{pool.token1Logo}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{pool.pair}</span>
                </div>
                <div>
                  <p className="text-3xl font-black text-[#00D897]" style={{ fontFamily: 'var(--font-display)' }}>{pool.apy}%</p>
                  <p className="text-[10px] text-[#5A6B82] mt-0.5">APY · TVL {pool.tvl}</p>
                </div>
                <a
                  href="https://app.ston.fi/pools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-[#1565FF] text-white text-xs font-bold hover:bg-[#1052CC] transition-colors active:scale-95 flex items-center justify-center gap-1"
                >
                  View on STON.fi ↗
                </a>
              </div>
            ))}
          </div>
        </div>

        {wallet.error && (
          <div className="bg-[#FF4D6A]/10 border border-[#FF4D6A]/20 rounded-2xl p-3 text-sm text-[#FF4D6A] text-center">
            {wallet.error} — <button onClick={() => wallet.refresh()} className="underline">retry</button>
          </div>
        )}
      </div>
    </div>
  )
}
