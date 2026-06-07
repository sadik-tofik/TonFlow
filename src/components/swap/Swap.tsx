'use client'

import { useState } from 'react'
import { ArrowLeft, Settings, ArrowUpDown, ChevronDown, Zap, Star, Info, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Token, TabId } from '@/types'
import type { WalletState } from '@/hooks/useWallet'
import { MOCK_TOKENS } from '@/lib/mockData'

interface SwapProps {
  onBack: () => void
  onOpenMira: (prefill?: string) => void
  onTabChange: (tab: TabId) => void
  wallet: WalletState
}

const CHAIN_TOKENS = [
  { symbol: 'TON', name: 'Toncoin', logo: '💎', color: '#0098EA', chain: 'TON' },
  { symbol: 'USDT', name: 'Tether USD', logo: '💵', color: '#26A17B', chain: 'TON' },
  { symbol: 'USDC', name: 'USD Coin', logo: '🔵', color: '#2775CA', chain: 'Base' },
  { symbol: 'pUSD', name: 'pUSD', logo: '🟣', color: '#8B5CF6', chain: 'Polygon' },
  { symbol: 'STON', name: 'STON.fi', logo: '💧', color: '#7C3AED', chain: 'TON' },
]

export function Swap({ onBack, onOpenMira, onTabChange, wallet }: SwapProps) {
  const tokens = wallet.tokens.length > 0 ? wallet.tokens : MOCK_TOKENS
  const [fromToken, setFromToken] = useState<Token>(tokens[0])
  const [toToken, setToToken] = useState<Token>(tokens[1] || MOCK_TOKENS[1])
  const [fromAmount, setFromAmount] = useState('')
  const [showFromPicker, setShowFromPicker] = useState(false)
  const [showToPicker, setShowToPicker] = useState(false)
  const [slippageOpen, setSlippageOpen] = useState(false)

  const rate = fromToken.symbol === 'TON' ? 5.84 : fromToken.symbol === 'USDT' ? 0.171 : 1
  const toAmount = fromAmount ? (parseFloat(fromAmount) * rate).toFixed(4) : ''
  const usdValue = fromAmount ? (parseFloat(fromAmount) * (fromToken.usdValue / fromToken.balance || 1)).toFixed(2) : ''

  function flipTokens() {
    const tmp = fromToken
    setFromToken(toToken)
    setToToken(tmp)
    setFromAmount(toAmount)
  }

  function handleSwap() {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return
    const url = `https://app.ston.fi/swap?chartVisible=false&ft=${fromToken.symbol}&tt=${toToken.symbol}`
    window.open(url, '_blank')
  }



  function TokenPicker({ current, onSelect, onClose }: { current: Token; onSelect: (t: Token) => void; onClose: () => void }) {
    return (
      <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
        <div className="w-full bg-[#0D1829] rounded-t-3xl border-t border-white/10 p-5 flex flex-col gap-3" onClick={e => e.stopPropagation()}>
          <div className="w-10 h-1 bg-[#2A3A50] rounded-full mx-auto mb-1" />
          <p className="text-sm font-bold text-white">Select Token</p>
          {tokens.map(t => (
            <button
              key={t.symbol}
              onClick={() => { onSelect(t); onClose() }}
              className={cn('flex items-center gap-3 p-3 rounded-2xl border transition-all', t.symbol === current.symbol ? 'border-[#1565FF]/50 bg-[#1565FF]/10' : 'border-white/[0.04] hover:border-white/10')}
            >
              <span className="text-2xl">{t.logo}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-white">{t.symbol}</p>
                <p className="text-xs text-[#5A6B82]">{t.name}</p>
              </div>
              <p className="text-sm text-[#8A9BB5]">{t.balance.toLocaleString(undefined,{maximumFractionDigits:2})}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-28 min-h-screen">
      {showFromPicker && <TokenPicker current={fromToken} onSelect={setFromToken} onClose={() => setShowFromPicker(false)} />}
      {showToPicker && <TokenPicker current={toToken} onSelect={setToToken} onClose={() => setShowToPicker(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-[#080E1C]/95 backdrop-blur-xl z-10 border-b border-white/[0.03]">
        <button onClick={onBack} className="p-2 -ml-2 text-[#5A6B82] hover:text-white transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-black text-lg text-white" style={{ fontFamily: 'var(--font-display)' }}>Swap</h1>
        <button className="p-2 -mr-2 text-[#5A6B82] hover:text-white transition-colors">
          <Settings size={20} />
        </button>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {/* Main swap card */}
        <div className="rounded-3xl overflow-hidden border border-white/[0.06]" style={{ background: 'linear-gradient(180deg,#0D1829,#0a1422)' }}>
          {/* FROM */}
          <div className="p-5">
            <p className="text-xs text-[#5A6B82] mb-3 font-medium">You Pay</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFromPicker(true)}
                className="flex items-center gap-2 bg-[#080E1C] rounded-2xl px-3.5 py-2.5 border border-white/[0.08] hover:border-[#1565FF]/40 transition-all flex-shrink-0"
              >
                <span className="text-xl">{fromToken.logo}</span>
                <span className="text-sm font-bold text-white">{fromToken.symbol}</span>
                <ChevronDown size={13} className="text-[#4A5568]" />
              </button>
              <input
                type="number"
                value={fromAmount}
                onChange={e => setFromAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent text-right text-4xl font-black text-white outline-none placeholder-[#2A3A50] min-w-0"
                style={{ fontFamily: 'var(--font-display)' }}
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-[#5A6B82]">
                Balance: <span className="text-[#8A9BB5]">{fromToken.balance.toLocaleString(undefined, {maximumFractionDigits:4})} {fromToken.symbol}</span>
              </span>
              <div className="flex gap-1.5">
                {['25%','50%','MAX'].map(pct => (
                  <button
                    key={pct}
                    onClick={() => {
                      const mult = pct === 'MAX' ? 1 : pct === '50%' ? 0.5 : 0.25
                      setFromAmount(String(Math.floor(fromToken.balance * mult * 100)/100))
                    }}
                    className="text-[10px] font-bold text-[#1565FF] bg-[#1565FF]/10 px-2 py-1 rounded-lg hover:bg-[#1565FF]/20 transition-colors"
                  >
                    {pct}
                  </button>
                ))}
              </div>
            </div>
            {usdValue && <p className="text-xs text-[#3A4B5C] mt-1">≈ ${usdValue}</p>}
          </div>

          {/* Divider + flip */}
          <div className="relative border-t border-white/[0.04]">
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
              <button
                onClick={flipTokens}
                className="w-10 h-10 rounded-full bg-[#0D1829] border-2 border-[#1565FF] flex items-center justify-center hover:bg-[#111d35] transition-all active:rotate-180 duration-300"
              >
                <ArrowUpDown size={15} className="text-[#1565FF]" />
              </button>
            </div>
          </div>

          {/* TO */}
          <div className="p-5">
            <p className="text-xs text-[#5A6B82] mb-3 font-medium">You Receive</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowToPicker(true)}
                className="flex items-center gap-2 bg-[#080E1C] rounded-2xl px-3.5 py-2.5 border border-white/[0.08] hover:border-[#1565FF]/40 transition-all flex-shrink-0"
              >
                <span className="text-xl">{toToken.logo}</span>
                <span className="text-sm font-bold text-white">{toToken.symbol}</span>
                <ChevronDown size={13} className="text-[#4A5568]" />
              </button>
              <p className={cn('flex-1 text-right text-4xl font-black', toAmount ? 'text-[#00D897]' : 'text-[#2A3A50]')} style={{ fontFamily: 'var(--font-display)' }}>
                {toAmount || '0'}
              </p>
            </div>
            <p className="text-xs text-[#5A6B82] mt-3">
              Balance: <span className="text-[#8A9BB5]">{toToken.balance.toLocaleString(undefined, {maximumFractionDigits:4})} {toToken.symbol}</span>
            </p>
          </div>

          {/* CTA */}
          <div className="px-5 pb-5">
            <button
              onClick={handleSwap}
              disabled={!fromAmount || parseFloat(fromAmount) <= 0}
              className="w-full h-14 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 relative overflow-hidden transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#1565FF,#0098EA)', boxShadow: '0 8px 24px rgba(21,101,255,0.35)' }}
            >
              <>
                <Zap size={18} className="fill-white" />
                Swap on STON.fi ↗
              </>
            </button>
            <p className="text-center text-[11px] text-[#3A4B5C] mt-2">Powered by <span className="text-[#5A6B82]">STON.fi Omniston</span></p>
          </div>
        </div>

        {/* Route */}
        <div className="bg-[#0D1829] rounded-2xl p-4 border border-white/[0.04]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#5A6B82] font-medium">Route</span>
            <div className="flex items-center gap-1 text-xs font-semibold">
              <span className="text-white">{fromToken.symbol}</span>
              <span className="text-[#1565FF]">→</span>
              <span className="text-[#1565FF]">Omniston</span>
              <span className="text-[#1565FF]">→</span>
              <span className="text-white">{toToken.symbol}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Check size={11} className="text-[#00D897]" />
            <span className="text-xs text-[#5A6B82]">Best rate across 5 liquidity sources</span>
          </div>
        </div>

        {/* Slippage */}
        <div className="bg-[#0D1829] rounded-2xl border border-white/[0.04] overflow-hidden">
          <button className="w-full flex items-center justify-between p-4" onClick={() => setSlippageOpen(!slippageOpen)}>
            <span className="text-xs text-[#5A6B82]">Slippage 0.5%</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5A6B82]">~$0.12 fee</span>
              <ChevronDown size={14} className={cn('text-[#4A5568] transition-transform', slippageOpen && 'rotate-180')} />
            </div>
          </button>
          {slippageOpen && (
            <div className="px-4 pb-4 border-t border-white/[0.04] flex flex-col gap-2">
              {[
                ['Price Impact', '< 0.1%'],
                ['Min Received', `${toAmount ? (parseFloat(toAmount)*0.995).toFixed(4) : '0'} ${toToken.symbol}`],
                ['Sources', '5 pools'],
                ['Network', process.env.NEXT_PUBLIC_TON_NETWORK === 'testnet' ? 'TON Testnet' : 'TON Mainnet'],
              ].map(([l,v]) => (
                <div key={l} className="flex justify-between text-xs pt-2">
                  <span className="text-[#5A6B82]">{l}</span>
                  <span className="text-white">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ask Mira */}
        <button
          onClick={() => onOpenMira(`Should I swap my ${fromAmount || '100'} ${fromToken.symbol} to ${toToken.symbol} right now? Current rate is 1 ${fromToken.symbol} = ${rate} ${toToken.symbol}`)}
          className="flex items-center gap-3 bg-gradient-to-r from-[#0D1829] to-[#111d35] rounded-2xl p-4 border border-[#1565FF]/20 hover:border-[#1565FF]/40 transition-all group text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-[#1565FF]/15 flex items-center justify-center flex-shrink-0">
            <Star size={16} className="text-[#1565FF]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Ask Mira about this swap</p>
            <p className="text-xs text-[#5A6B82]">Get AI analysis before you execute</p>
          </div>
          <ChevronDown size={16} className="text-[#4A5568] -rotate-90 group-hover:text-[#1565FF] transition-colors" />
        </button>
      </div>
    </div>
  )
}
