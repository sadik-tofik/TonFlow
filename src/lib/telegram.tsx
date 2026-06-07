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
    const tg = (window as any).Telegram?.WebApp

    if (tg) {
      tg.ready()
      tg.expand()
      tg.enableClosingConfirmation()

      // Set color scheme to match our dark theme
      tg.setHeaderColor('#080E1C')
      tg.setBackgroundColor('#080E1C')

      setIsTelegram(true)
      setUser(tg.initDataUnsafe?.user || null)
      setThemeParams(tg.themeParams || {})
    }

    setIsReady(true)
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
      (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred(type)
    },
  }

  return <TgContext.Provider value={value}>{children}</TgContext.Provider>
}
