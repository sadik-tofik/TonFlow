'use client'

import { useState, useEffect } from 'react'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { TabBar } from '@/components/layout/TabBar'
import { Onboarding } from '@/components/dashboard/Onboarding'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { Swap } from '@/components/swap/Swap'
import { MiraChat } from '@/components/mira/MiraChat'
import { History } from '@/components/history/History'
import { SettingsScreen } from '@/components/settings/Settings'
import { useTelegram } from '@/lib/telegram'
import { useWallet } from '@/hooks/useWallet'
import { Zap } from 'lucide-react'
import type { TabId } from '@/types'

export default function App() {
  const { isReady, isTelegram, user: telegramUser, hapticFeedback } = useTelegram()
  const { open } = useAppKit()
  const { isConnected } = useAppKitAccount()
  // useWallet no longer needs tonConnectUI passed in
  const wallet = useWallet()
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [miraPrefill, setMiraPrefill] = useState<string | undefined>()

  function handleTabChange(tab: TabId) {
    hapticFeedback('light')
    setActiveTab(tab)
  }

  function handleOpenMira(prefill?: string) {
    setMiraPrefill(prefill)
    hapticFeedback('light')
    setActiveTab('mira')
  }

  async function handleDisconnect() {
    // AppKit exposes disconnect via the modal — easiest is to open the account view
    // which has a native disconnect button, or call the adapter directly.
    // For simplicity we just reset local state; AppKit clears its own session.
    open({ view: 'Account' })
    setActiveTab('home')
  }

  // Loading splash
  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#080E1C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1565FF,#0098EA)', clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)', boxShadow: '0 0 40px rgba(21,101,255,0.4)' }}>
            <Zap size={28} className="text-white fill-white" />
          </div>
          <div className="w-5 h-5 border-2 border-[#1565FF]/30 border-t-[#1565FF] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // Not connected → Onboarding
  if (!isConnected) {
    return <Onboarding onConnected={() => setActiveTab('home')} telegramUser={telegramUser} />
  }

  return (
    <div className="min-h-screen bg-[#080E1C] max-w-[430px] mx-auto relative">
      <div className="min-h-screen">
        {activeTab === 'home' && (
          <Dashboard onTabChange={handleTabChange} wallet={wallet} telegramUser={telegramUser} />
        )}
        {activeTab === 'swap' && (
          <Swap onBack={() => handleTabChange('home')} onOpenMira={handleOpenMira} onTabChange={handleTabChange} wallet={wallet} />
        )}
        {activeTab === 'mira' && (
          <MiraChat onBack={() => handleTabChange('home')} prefillMessage={miraPrefill} wallet={wallet} />
        )}
        {activeTab === 'history' && (
          <History wallet={wallet} />
        )}
        {activeTab === 'settings' && (
          <SettingsScreen onDisconnect={handleDisconnect} wallet={wallet} telegramUser={telegramUser} />
        )}
      </div>
      {activeTab !== 'mira' && (
        <TabBar active={activeTab} onChange={handleTabChange} />
      )}
    </div>
  )
}
