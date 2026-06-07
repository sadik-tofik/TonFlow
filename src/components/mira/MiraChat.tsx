'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Star, Sparkles, Clock, Rocket } from 'lucide-react'
import type { WalletState } from '@/hooks/useWallet'

interface MiraChatProps {
  onBack: () => void
  prefillMessage?: string
  wallet: WalletState
}

export function MiraChat({ onBack }: MiraChatProps) {
  return (
    <div className="flex flex-col h-screen bg-[#080E1C] relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1565FF 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0098EA 0%, transparent 70%)' }} />

      {/* Header - same as original */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05] sticky top-0 bg-[#080E1C]/95 backdrop-blur-xl z-10">
        <button onClick={onBack} className="p-1.5 -ml-1.5 text-[#5A6B82] hover:text-white transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 relative" style={{ background: 'linear-gradient(135deg,#1565FF,#0098EA)' }}>
            <Star size={15} className="text-white fill-white" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#3A4B5C] rounded-full border-2 border-[#080E1C]" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Mira</p>
            <p className="text-[10px] text-[#5A6B82] leading-tight flex items-center gap-1"><Sparkles size={9} />AI DeFi Advisor</p>
          </div>
        </div>
      </div>

      {/* Coming soon content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 relative z-10">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
          style={{ background: 'linear-gradient(135deg,#1565FF,#0098EA)', boxShadow: '0 0 60px rgba(21,101,255,0.35)' }}>
          <Star size={36} className="text-white fill-white" />
        </div>

        <div className="text-center flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mx-auto"
            style={{ background: 'rgba(21,101,255,0.1)', border: '1px solid rgba(21,101,255,0.2)' }}>
            <Clock size={12} className="text-[#1565FF]" />
            <span className="text-xs font-semibold text-[#1565FF]">Coming Soon</span>
          </div>
          <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            Meet Mira
          </h2>
          <p className="text-[#5A6B82] text-sm leading-relaxed max-w-[260px] mx-auto">
            Your AI-powered DeFi advisor. Portfolio analysis, swap recommendations, and price alerts — all inside Telegram.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-[280px]">
          {['📊 Portfolio analysis & P&L', '⚡ Best swap route recommendations', '🎯 Price alerts & opportunities', '🤖 Natural language transactions'].map(text => (
            <div key={text} className="flex items-center gap-3 rounded-2xl px-4 py-2.5"
              style={{ background: '#0D1829', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-sm text-[#8A9BB5]">{text}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-2xl px-5 py-3"
          style={{ background: '#0D1829', border: '1px solid rgba(0,216,151,0.2)' }}>
          <Rocket size={14} className="text-[#00D897]" />
          <p className="text-xs text-[#5A6B82]">Powered by <span className="text-[#00D897] font-semibold">Mira AI</span> · Launching soon</p>
        </div>
      </div>
    </div>
  )
}
