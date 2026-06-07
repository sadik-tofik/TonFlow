'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Paperclip, Mic, ArrowUp, Star, Info, Sparkles } from 'lucide-react'
import { cn, generateMiraResponse, sleep } from '@/lib/utils'
import { SUGGESTED_PROMPTS } from '@/lib/mockData'
import type { ChatMessage } from '@/types'
import type { WalletState } from '@/hooks/useWallet'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

interface MiraChatProps {
  onBack: () => void
  prefillMessage?: string
  wallet: WalletState
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 'sys-1', role: 'system', content: 'Mira has context of your TonFlow portfolio', timestamp: new Date() },
  { id: 'usr-1', role: 'user', content: 'Should I swap my 100 TON to USDT right now?', timestamp: new Date(Date.now() - 8*60000) },
  {
    id: 'ai-1', role: 'assistant',
    content: "Based on your portfolio, TON is up 7% today and the current rate via Omniston is 1 TON = 5.84 USDT — better than 24h average. Slippage is low right now. I'd say timing is decent, but your USDT allocation is already 40% of portfolio. Worth considering.",
    timestamp: new Date(Date.now() - 7*60000),
    actionButton: { label: 'Execute this Swap →', action: 'swap' },
  },
  { id: 'usr-2', role: 'user', content: "What's my best performing token this week?", timestamp: new Date(Date.now() - 5*60000) },
  { id: 'ai-2', role: 'assistant', content: 'TON is your best performer this week, up 7.02%. STON is down 2.1%.', timestamp: new Date(Date.now() - 4*60000), chart: [42,45,43,47,50,48,53,55,52,58,62,61,67] },
]

export function MiraChat({ onBack, prefillMessage, wallet }: MiraChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState(prefillMessage || '')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (prefillMessage) { setInput(prefillMessage); inputRef.current?.focus() } }, [prefillMessage])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  async function sendMessage(text?: string) {
    const content = text || input.trim()
    if (!content) return
    setInput('')
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)
    await sleep(700 + Math.random() * 900)
    const responseText = generateMiraResponse(content)
    const aiMsg: ChatMessage = {
      id: `a-${Date.now()}`, role: 'assistant', content: responseText, timestamp: new Date(),
      actionButton: content.toLowerCase().includes('swap') ? { label: 'Execute this Swap →', action: 'swap' } : undefined,
    }
    setIsTyping(false)
    setMessages(prev => [...prev, aiMsg])
  }

  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex flex-col h-screen bg-[#080E1C]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05] sticky top-0 bg-[#080E1C]/95 backdrop-blur-xl z-10">
        <button onClick={onBack} className="p-1.5 -ml-1.5 text-[#5A6B82] hover:text-white transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 relative" style={{ background: 'linear-gradient(135deg,#1565FF,#0098EA)' }}>
            <Star size={15} className="text-white fill-white" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00D897] rounded-full border-2 border-[#080E1C]" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Mira</p>
            <p className="text-[10px] text-[#00D897] leading-tight flex items-center gap-1"><Sparkles size={9} />AI DeFi Advisor · Online</p>
          </div>
        </div>
        <button className="p-1.5 text-[#5A6B82] hover:text-white transition-colors"><Info size={18} /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map(msg => {
          if (msg.role === 'system') return (
            <div key={msg.id} className="flex justify-center">
              <span className="text-xs text-[#5A6B82] bg-[#0D1829] px-3 py-1.5 rounded-full border border-white/[0.05]">{msg.content}</span>
            </div>
          )
          if (msg.role === 'user') return (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[80%]">
                <div className="px-4 py-3 rounded-2xl rounded-br-sm text-sm text-white leading-relaxed" style={{ background: 'linear-gradient(135deg,#1565FF,#1052CC)' }}>
                  {msg.content}
                </div>
                <p className="text-[10px] text-[#3A4B5C] text-right mt-1">{fmt(msg.timestamp)}</p>
              </div>
            </div>
          )
          return (
            <div key={msg.id} className="flex gap-2.5 items-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'linear-gradient(135deg,#1565FF,#0098EA)' }}>
                <Star size={13} className="text-white fill-white" />
              </div>
              <div className="max-w-[80%] flex flex-col gap-1.5">
                <div className="bg-[#0D1829] rounded-2xl rounded-bl-sm px-4 py-3 border border-white/[0.05]">
                  {msg.chart && (
                    <div className="mb-3 h-14 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={msg.chart.map((v,i)=>({v,i}))}>
                          <defs>
                            <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00D897" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#00D897" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="v" stroke="#00D897" strokeWidth={2} fill="url(#cg)" dot={false}/>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  <p className="text-sm text-white leading-relaxed whitespace-pre-line">{msg.content}</p>
                  {msg.actionButton && (
                    <button className="mt-3 flex items-center gap-1 text-sm text-[#1565FF] font-semibold hover:text-[#4d8aff] transition-colors">
                      {msg.actionButton.label} <ArrowUp size={13} className="rotate-45" />
                    </button>
                  )}
                  <p className="text-[9px] text-[#3A4B5C] mt-2">Not financial advice</p>
                </div>
                <p className="text-[10px] text-[#3A4B5C] ml-1">{fmt(msg.timestamp)}</p>
              </div>
            </div>
          )
        })}

        {isTyping && (
          <div className="flex gap-2.5 items-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#1565FF,#0098EA)' }}>
              <Star size={13} className="text-white fill-white" />
            </div>
            <div className="bg-[#0D1829] rounded-2xl rounded-bl-sm px-4 py-3 border border-white/[0.05]">
              <div className="flex gap-1.5 items-center h-5">
                {[0,1,2].map(i=>(
                  <span key={i} className="w-1.5 h-1.5 bg-[#1565FF] rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {SUGGESTED_PROMPTS.map(p=>(
          <button key={p} onClick={()=>sendMessage(p)}
            className="flex-shrink-0 text-xs text-[#5A6B82] bg-[#0D1829] px-3 py-2 rounded-xl border border-white/[0.04] hover:text-white hover:border-[#1565FF]/30 transition-all whitespace-nowrap">
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-8 pt-2 bg-[#080E1C] border-t border-white/[0.04]">
        <div className="flex items-center gap-2 bg-[#0D1829] rounded-2xl border border-white/[0.06] px-3 py-2 focus-within:border-[#1565FF]/40 transition-colors">
          <button className="text-[#3A4B5C] hover:text-[#5A6B82] transition-colors p-1"><Paperclip size={18}/></button>
          <input
            ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&sendMessage()}
            placeholder="Ask Mira anything..."
            className="flex-1 bg-transparent text-sm text-white placeholder-[#3A4B5C] outline-none py-1"
          />
          <button className="text-[#3A4B5C] hover:text-[#5A6B82] transition-colors p-1"><Mic size={18}/></button>
          <button
            onClick={()=>sendMessage()} disabled={!input.trim()}
            className="w-8 h-8 rounded-xl bg-[#1565FF] flex items-center justify-center hover:bg-[#1052CC] transition-colors active:scale-95 disabled:opacity-30 flex-shrink-0"
          >
            <ArrowUp size={15} className="text-white"/>
          </button>
        </div>
      </div>
    </div>
  )
}
