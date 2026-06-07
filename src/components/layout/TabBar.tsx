'use client'

import { Home, ArrowLeftRight, Star, Clock, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TabId } from '@/types'

const TABS = [
  { id: 'home' as TabId, label: 'Home', icon: Home },
  { id: 'swap' as TabId, label: 'Swap', icon: ArrowLeftRight },
  { id: 'mira' as TabId, label: 'Mira', icon: Star },
  { id: 'history' as TabId, label: 'History', icon: Clock },
  { id: 'settings' as TabId, label: 'Settings', icon: Settings },
]

interface TabBarProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto">
      <div className="bg-[#0F1A2E] border-t border-[rgba(255,255,255,0.06)] px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 relative',
                  isActive ? 'text-[#1565FF]' : 'text-[#4A5568] hover:text-[#8A9BB5]'
                )}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#1565FF] rounded-b-full" />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={cn('text-[10px] font-medium', isActive ? 'text-[#1565FF]' : 'text-[#4A5568]')}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
