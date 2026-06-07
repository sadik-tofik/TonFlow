'use client'

import { useState } from 'react'
import { Percent, Globe, DollarSign, Bell, AlertCircle, Wallet, Star, Download, ChevronRight, Copy, ExternalLink, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WalletState } from '@/hooks/useWallet'

interface TelegramUser { id: number; first_name: string; last_name?: string; username?: string }
interface SettingsProps { onDisconnect?: () => void; wallet: WalletState; telegramUser?: TelegramUser | null }

export function SettingsScreen({ onDisconnect, wallet, telegramUser }: SettingsProps) {
  const [notifications, setNotifications] = useState(true)
  const [copied, setCopied] = useState(false)
  const network = process.env.NEXT_PUBLIC_TON_NETWORK === 'testnet' ? 'TON Testnet' : 'TON Mainnet'
  const displayName = telegramUser ? `${telegramUser.first_name}${telegramUser.last_name ? ' '+telegramUser.last_name:''}` : wallet.shortAddress || '—'

  function copyAddress() {
    if (!wallet.address) return
    navigator.clipboard?.writeText(wallet.address)
    setCopied(true)
    setTimeout(()=>setCopied(false), 1500)
  }

  const sections = [
    {
      title: 'PREFERENCES',
      rows: [
        { icon: Percent, label: 'Default Slippage', value: '0.5%' },
        { icon: Globe, label: 'Preferred Network', value: network },
        { icon: DollarSign, label: 'Currency Display', value: 'USD' },
      ]
    },
    {
      title: 'ALERTS & PRIVACY',
      rows: [
        { icon: Bell, label: 'Notifications', toggle: true },
        { icon: AlertCircle, label: 'Price Alerts', value: '' },
      ]
    },
    {
      title: 'CONNECTIONS',
      rows: [
        { icon: Wallet, label: 'Connected Wallets', value: wallet.connected ? '1 wallet' : 'None' },
        { icon: Star, label: 'Mira AI Settings', value: 'Pro Active', dot: true },
      ]
    },
    {
      title: 'DATA',
      rows: [{ icon: Download, label: 'Export Data', value: '' }]
    }
  ]

  return (
    <div className="flex flex-col pb-28 min-h-screen">
      <div className="px-4 py-4 sticky top-0 bg-[#080E1C]/95 backdrop-blur-xl z-10 border-b border-white/[0.03]">
        <h1 className="font-black text-xl text-white" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Profile */}
        <div className="rounded-3xl p-5 border border-white/[0.06]" style={{ background: 'linear-gradient(135deg,#0D1829,#111d35)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#1565FF,#0098EA)' }}>
              {telegramUser ? telegramUser.first_name[0].toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-bold text-white">{displayName}</p>
              {telegramUser?.username && <p className="text-xs text-[#1565FF] mt-0.5">@{telegramUser.username}</p>}
              <p className="text-xs text-[#5A6B82] mt-0.5">{wallet.shortAddress || 'No wallet connected'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={copyAddress} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.06] text-xs text-[#8A9BB5] hover:text-white hover:border-white/15 transition-all">
              <Copy size={13}/>{copied ? 'Copied!' : 'Copy Address'}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.06] text-xs text-[#8A9BB5] hover:text-white hover:border-white/15 transition-all">
              <ExternalLink size={13}/>View on TONScan
            </button>
          </div>
        </div>

        {/* Sections */}
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-[10px] font-bold text-[#3A4B5C] uppercase tracking-widest mb-2 px-1">{section.title}</p>
            <div className="bg-[#0D1829] rounded-2xl border border-white/[0.04] overflow-hidden divide-y divide-white/[0.03]">
              {section.rows.map(({ icon: Icon, label, value, toggle, dot }: any) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-[#1565FF]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-[#1565FF]" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-white">{label}</span>
                  {toggle ? (
                    <button
                      onClick={()=>setNotifications(!notifications)}
                      className={cn('w-11 h-6 rounded-full transition-colors relative', notifications ? 'bg-[#1565FF]' : 'bg-[#162035]')}
                    >
                      <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm', notifications ? 'translate-x-5' : 'translate-x-0.5')}/>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {dot && <span className="w-1.5 h-1.5 bg-[#00D897] rounded-full"/>}
                      {value && <span className="text-xs text-[#5A6B82]">{value}</span>}
                      <ChevronRight size={14} className="text-[#3A4B5C]"/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Disconnect */}
        <button
          onClick={onDisconnect}
          className="w-full h-13 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-[#FF4D6A] bg-[#FF4D6A]/8 border border-[#FF4D6A]/20 hover:bg-[#FF4D6A]/15 transition-all active:scale-[0.98]"
          style={{height:'52px'}}
        >
          <LogOut size={16}/> Disconnect Wallet
        </button>

        <p className="text-center text-xs text-[#3A4B5C] pb-2">TonFlow v0.1.0 · STON.fi Hackathon Wave 2</p>
      </div>
    </div>
  )
}
