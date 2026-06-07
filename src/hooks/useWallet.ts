'use client'

import { useState, useEffect, useCallback } from 'react'
import { TonConnectUI } from '@tonconnect/ui-react'
import type { Token, Transaction } from '@/types'

const TOKEN_META: Record<string, { symbol: string; name: string; logo: string; color: string; decimals: number }> = {
  native: { symbol: 'TON', name: 'Toncoin', logo: '💎', color: '#0098EA', decimals: 9 },
  'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs': { symbol: 'USDT', name: 'Tether USD', logo: '💵', color: '#26A17B', decimals: 6 },
  'EQD-cvR0Nz6XAyRBvdAKoZnkIjYCM5kKJ7wOhHBDdDmMdQi9': { symbol: 'STON', name: 'STON.fi', logo: '💧', color: '#7C3AED', decimals: 9 },
  'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT': { symbol: 'NOT', name: 'Notcoin', logo: '🪙', color: '#F59E0B', decimals: 9 },
}

const TONAPI_BASE = process.env.NEXT_PUBLIC_TONAPI_URL || 'https://tonapi.io/v2'
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

let priceCache: Record<string, number> = {}
let priceCacheTime = 0

async function fetchTONPrice(): Promise<number> {
  const now = Date.now()
  if (priceCache['ton'] && now - priceCacheTime < 60000) return priceCache['ton']
  try {
    const res = await fetch(`${COINGECKO_BASE}/simple/price?ids=the-open-network&vs_currencies=usd`)
    const data = await res.json()
    priceCache['ton'] = data['the-open-network']?.usd || 5.5
    priceCacheTime = now
    return priceCache['ton']
  } catch {
    return priceCache['ton'] || 5.5
  }
}

async function fetchBalances(address: string): Promise<{ tokens: Token[]; totalUsd: number }> {
  try {
    const [accountRes, jettonsRes, tonPrice] = await Promise.all([
      fetch(`${TONAPI_BASE}/accounts/${address}`),
      fetch(`${TONAPI_BASE}/accounts/${address}/jettons?currencies=usd`),
      fetchTONPrice(),
    ])

    const accountData = await accountRes.json()
    const jettonsData = await jettonsRes.json()

    const tonBalance = Number(accountData.balance || 0) / 1e9
    const tonUsd = tonBalance * tonPrice

    const tokens: Token[] = [{
      symbol: 'TON',
      name: 'Toncoin',
      balance: Math.round(tonBalance * 100) / 100,
      usdValue: Math.round(tonUsd * 100) / 100,
      change24h: 0,
      logo: '💎',
      chain: 'TON',
      color: '#0098EA',
      address: 'native',
    }]

    if (jettonsData.balances) {
      for (const j of jettonsData.balances) {
        const addr = j.jetton?.address || ''
        const meta = TOKEN_META[addr]
        const decimals = j.jetton?.decimals || meta?.decimals || 9
        const balance = Number(j.balance || 0) / Math.pow(10, decimals)
        if (balance < 0.001) continue

        const usdPrice = j.price?.prices?.USD || 0
        const usdValue = balance * usdPrice

        tokens.push({
          symbol: j.jetton?.symbol || meta?.symbol || addr.slice(0, 6),
          name: j.jetton?.name || meta?.name || 'Unknown',
          balance: Math.round(balance * 100) / 100,
          usdValue: Math.round(usdValue * 100) / 100,
          change24h: j.price?.diff_24h?.USD ? parseFloat(j.price.diff_24h.USD) : 0,
          logo: meta?.logo || '🪙',
          chain: 'TON',
          color: meta?.color || '#8A9BB5',
          address: addr,
        })
      }
    }

    const totalUsd = tokens.reduce((s, t) => s + t.usdValue, 0)
    return { tokens, totalUsd }
  } catch (e) {
    console.error('fetchBalances error:', e)
    return { tokens: [], totalUsd: 0 }
  }
}

async function fetchTransactions(address: string): Promise<Transaction[]> {
  try {
    const res = await fetch(`${TONAPI_BASE}/accounts/${address}/events?limit=20`)
    const data = await res.json()
    if (!data.events) return []

    return data.events.slice(0, 10).map((ev: any, i: number) => {
      const action = ev.actions?.[0]
      const type = action?.type || 'Unknown'
      let txType: Transaction['type'] = 'receive'
      let title = 'Transaction'
      let amount = ''

      if (type === 'JettonSwap' || type === 'SmartContractExec') {
        txType = 'swap'
        const jin = action.JettonSwap?.jetton_master_in
        const jout = action.JettonSwap?.jetton_master_out
        const symIn = jin?.symbol || 'TON'
        const symOut = jout?.symbol || 'TON'
        title = `Swapped ${symOut} → ${symIn}`
        amount = `+${(Number(action.JettonSwap?.amount_in || 0) / 1e9).toFixed(2)} ${symIn}`
      } else if (type === 'TonTransfer') {
        const isOut = action.TonTransfer?.sender?.address === address
        txType = isOut ? 'send' : 'receive'
        const amt = (Number(action.TonTransfer?.amount || 0) / 1e9).toFixed(2)
        title = isOut ? `Sent TON` : `Received TON`
        amount = isOut ? `-${amt} TON` : `+${amt} TON`
      } else if (type === 'JettonTransfer') {
        const isOut = action.JettonTransfer?.sender?.address === address
        txType = isOut ? 'send' : 'receive'
        const sym = action.JettonTransfer?.jetton?.symbol || 'Token'
        const decimals = action.JettonTransfer?.jetton?.decimals || 9
        const amt = (Number(action.JettonTransfer?.amount || 0) / Math.pow(10, decimals)).toFixed(2)
        title = isOut ? `Sent ${sym}` : `Received ${sym}`
        amount = isOut ? `-${amt} ${sym}` : `+${amt} ${sym}`
      }

      return {
        id: ev.event_id || String(i),
        type: txType,
        title,
        subtitle: new Date(ev.timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount,
        status: ev.in_progress ? 'pending' : 'confirmed',
        timestamp: new Date(ev.timestamp * 1000),
      } as Transaction
    })
  } catch (e) {
    console.error('fetchTransactions error:', e)
    return []
  }
}

export interface WalletState {
  connected: boolean
  address: string | null
  shortAddress: string | null
  tokens: Token[]
  transactions: Transaction[]
  totalUsd: number
  change24hUsd: number
  change24hPct: number
  loading: boolean
  refreshing: boolean
  error: string | null
  refresh: () => Promise<void>
  tonConnectUI: TonConnectUI | null
}

export function useWallet(tonConnectUI: TonConnectUI | null): WalletState {
  const [address, setAddress] = useState<string | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalUsd, setTotalUsd] = useState(0)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async (addr: string, isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const [balData, txData] = await Promise.all([
        fetchBalances(addr),
        fetchTransactions(addr),
      ])
      setTokens(balData.tokens)
      setTotalUsd(balData.totalUsd)
      setTransactions(txData)
    } catch {
      setError('Failed to load wallet data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (!tonConnectUI) return
    const unsub = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        const raw = wallet.account.address
        setAddress(raw)
        loadData(raw)
      } else {
        setAddress(null)
        setTokens([])
        setTransactions([])
        setTotalUsd(0)
      }
    })
    if (tonConnectUI.account) {
      const raw = tonConnectUI.account.address
      setAddress(raw)
      loadData(raw)
    }
    return unsub
  }, [tonConnectUI, loadData])

  const shortAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : null

  const change24hUsd = tokens.reduce((s, t) => s + (t.usdValue * (t.change24h / 100)), 0)
  const change24hPct = totalUsd > 0 ? (change24hUsd / totalUsd) * 100 : 0

  return {
    connected: !!address,
    address,
    shortAddress,
    tokens,
    transactions,
    totalUsd,
    change24hUsd,
    change24hPct,
    loading,
    refreshing,
    error,
    refresh: () => address ? loadData(address, true) : Promise.resolve(),
    tonConnectUI,
  }
}