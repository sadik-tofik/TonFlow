export interface Token {
  symbol: string
  name: string
  balance: number
  usdValue: number
  change24h: number
  logo: string
  chain: string
  color: string
  address?: string
}

export interface PoolOpportunity {
  pair: string
  apy: number
  tvl: string
  token0Logo: string
  token1Logo: string
}

export interface Transaction {
  id: string
  type: 'swap' | 'send' | 'receive'
  title: string
  subtitle: string
  amount: string
  amountUsd?: string
  status: 'confirmed' | 'pending' | 'failed'
  timestamp: Date
}

export interface SwapRoute {
  from: string
  to: string
  via: string
  rate: number
  fee: string
  priceImpact: string
  minReceived: string
  sources: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  actionButton?: {
    label: string
    action: string
  }
  chart?: number[]
}

export type TabId = 'home' | 'swap' | 'mira' | 'history' | 'settings'
export type FilterType = 'all' | 'swaps' | 'sends' | 'receives' | 'pool'
