'use client'

import { useState } from 'react'
import { SlidersHorizontal, ArrowLeftRight, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_TRANSACTIONS } from '@/lib/mockData'
import type { FilterType, Transaction } from '@/types'
import type { WalletState } from '@/hooks/useWallet'
import { Skeleton } from '@/components/ui'

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'swaps', label: 'Swaps' },
  { id: 'sends', label: 'Sends' },
  { id: 'receives', label: 'Receives' },
]

interface HistoryProps { wallet: WalletState }

function TxIcon({ type }: { type: Transaction['type'] }) {
  const cfg = {
    swap: { icon: ArrowLeftRight, bg: 'rgba(21,101,255,0.12)', color: '#1565FF' },
    send: { icon: ArrowUp, bg: 'rgba(255,77,106,0.12)', color: '#FF4D6A' },
    receive: { icon: ArrowDown, bg: 'rgba(0,216,151,0.12)', color: '#00D897' },
  }[type]
  return (
    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
      <cfg.icon size={17} style={{ color: cfg.color }} strokeWidth={2.5} />
    </div>
  )
}

export function History({ wallet }: HistoryProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const txs = wallet.transactions.length > 0 ? wallet.transactions : MOCK_TRANSACTIONS

  const filtered = txs.filter(tx => {
    if (filter === 'all') return true
    if (filter === 'swaps') return tx.type === 'swap'
    if (filter === 'sends') return tx.type === 'send'
    if (filter === 'receives') return tx.type === 'receive'
    return false
  })

  return (
    <div className="flex flex-col pb-28 min-h-screen">
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-[#080E1C]/95 backdrop-blur-xl z-10 border-b border-white/[0.03]">
        <h1 className="font-black text-xl text-white" style={{ fontFamily: 'var(--font-display)' }}>History</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => wallet.refresh()} disabled={wallet.refreshing} className="p-2 text-[#4A5568] hover:text-white transition-colors">
            <RefreshCw size={16} className={cn(wallet.refreshing && 'animate-spin')} />
          </button>
          <button className="p-2 text-[#4A5568] hover:text-white transition-colors">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all',
              filter === f.id ? 'bg-[#1565FF] text-white' : 'bg-[#0D1829] text-[#5A6B82] border border-white/[0.04] hover:text-white'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-2">
        {wallet.loading ? (
          [1,2,3,4].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <span className="text-5xl">🔍</span>
            <p className="text-[#5A6B82] text-sm">No transactions found</p>
          </div>
        ) : filtered.map(tx => {
          const isPos = tx.type === 'receive' || (tx.type === 'swap' && tx.amount.startsWith('+'))
          const isNeg = tx.type === 'send' || (tx.type === 'swap' && tx.amount.startsWith('-'))
          return (
            <div key={tx.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0D1829] border border-white/[0.04] hover:border-white/[0.08] transition-all">
              <TxIcon type={tx.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{tx.title}</p>
                <p className="text-xs text-[#5A6B82] mt-0.5">{tx.subtitle}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={cn('text-sm font-bold tabular-nums', isPos && 'text-[#00D897]', isNeg && 'text-[#FF4D6A]', !isPos && !isNeg && 'text-white')}>
                  {tx.amount}
                </p>
                <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-0.5 inline-block',
                  tx.status === 'confirmed' ? 'bg-[#00D897]/10 text-[#00D897]' :
                  tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-[#FF4D6A]/10 text-[#FF4D6A]'
                )}>
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
