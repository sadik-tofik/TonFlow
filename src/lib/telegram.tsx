'use client'

import { useEffect, useState, createContext, useContext, ReactNode } from 'react'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

interface TelegramContext {
  isReady: boolean
  isTelegram: boolean
  user: TelegramUser | null
  themeParams: Record<string, string>
  expand: () => void
  close: () => void
  showAlert: (message: string) => void
  hapticFeedback: (type?: 'light' | 'medium' | 'heavy') => void
}

const TgContext = createContext<TelegramContext>({
  isReady: false,
  isTelegram: false,
  user: null,
  themeParams: {},
  expand: () => {},
  close: () => {},
  showAlert: () => {},
  hapticFeedback: () => {},
})

export function useTelegram() {
  return useContext(TgContext)
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [isTelegram, setIsTelegram] = useState(false)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [themeParams, setThemeParams] = useState<Record<string, string>>({})

  useEffect(() => {
    // Set ready after a tiny delay to allow the script to execute, 
    // but ALWAYS set it so the app doesn't hang.
    const timer = setTimeout(() => setIsReady(true), 100)

    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
      
      if (tg.isVersionAtLeast('6.2')) {
        tg.enableClosingConfirmation()
      }

      if (tg.isVersionAtLeast('6.1')) {
        tg.setHeaderColor('#080E1C')
        tg.setBackgroundColor('#080E1C')
      }

      if (tg.isVersionAtLeast('7.0')) {
        tg.setBottomBarColor('#080E1C')
      }

      setIsTelegram(true)
      setUser(tg.initDataUnsafe?.user || null)
      setThemeParams(tg.themeParams || {})
    }

    return () => clearTimeout(timer)
  }, [])

  const value: TelegramContext = {
    isReady,
    isTelegram,
    user,
    themeParams,
    expand: () => (window as any).Telegram?.WebApp?.expand(),
    close: () => (window as any).Telegram?.WebApp?.close(),
    showAlert: (msg) => (window as any).Telegram?.WebApp?.showAlert(msg),
    hapticFeedback: (type = 'medium') => {
      const tg = (window as any).Telegram?.WebApp
      if (tg?.isVersionAtLeast('6.1')) {
        tg.HapticFeedback?.impactOccurred(type)
      }
    },
  }

  return <TgContext.Provider value={value}>{children}</TgContext.Provider>
}
