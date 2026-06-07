import type { Token, PoolOpportunity, Transaction } from '@/types'

export const MOCK_TOKENS: Token[] = [
  {
    symbol: 'TON',
    name: 'Toncoin',
    balance: 124.50,
    usdValue: 684.75,
    change24h: 7.02,
    logo: '💎',
    chain: 'TON',
    color: '#0098EA',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    balance: 512.00,
    usdValue: 512.00,
    change24h: 0.01,
    logo: '💵',
    chain: 'TON',
    color: '#26A17B',
  },
  {
    symbol: 'STON',
    name: 'STON.fi',
    balance: 42.80,
    usdValue: 64.20,
    change24h: -2.10,
    logo: '💧',
    chain: 'TON',
    color: '#7C3AED',
  },
  {
    symbol: 'NOT',
    name: 'Notcoin',
    balance: 8420.00,
    usdValue: 23.55,
    change24h: 12.40,
    logo: '🪙',
    chain: 'TON',
    color: '#F59E0B',
  },
]

export const MOCK_POOLS: PoolOpportunity[] = [
  {
    pair: 'TON/USDT',
    apy: 42.80,
    tvl: '$2.4M',
    token0Logo: '💎',
    token1Logo: '💵',
  },
  {
    pair: 'STON/TON',
    apy: 38.15,
    tvl: '$1.1M',
    token0Logo: '💧',
    token1Logo: '💎',
  },
  {
    pair: 'NOT/TON',
    apy: 61.20,
    tvl: '$890K',
    token0Logo: '🪙',
    token1Logo: '💎',
  },
]

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'swap',
    title: 'Swapped TON → USDT',
    subtitle: 'Jun 5, 2026 · via Omniston',
    amount: '+584.20 USDT',
    amountUsd: '$584.20',
    status: 'confirmed',
    timestamp: new Date('2026-06-05T14:20:00'),
  },
  {
    id: '2',
    type: 'send',
    title: 'Sent TON to UQA...7×2k',
    subtitle: 'Jun 5, 2026 · Transfer',
    amount: '-50.00 TON',
    amountUsd: '-$275.00',
    status: 'confirmed',
    timestamp: new Date('2026-06-05T11:05:00'),
  },
  {
    id: '3',
    type: 'receive',
    title: 'Received USDT',
    subtitle: 'Jun 4, 2026 · from Exchange',
    amount: '+200.00 USDT',
    amountUsd: '$200.00',
    status: 'confirmed',
    timestamp: new Date('2026-06-04T18:30:00'),
  },
  {
    id: '4',
    type: 'swap',
    title: 'Swapped STON → TON',
    subtitle: 'Jun 4, 2026 · via STON.fi',
    amount: '+12.40 TON',
    amountUsd: '$68.20',
    status: 'confirmed',
    timestamp: new Date('2026-06-04T09:15:00'),
  },
  {
    id: '5',
    type: 'send',
    title: 'Sent NOT to UQA...a1b2',
    subtitle: 'Jun 3, 2026 · Transfer',
    amount: '-1,000 NOT',
    amountUsd: '-$2.80',
    status: 'pending',
    timestamp: new Date('2026-06-03T20:45:00'),
  },
  {
    id: '6',
    type: 'receive',
    title: 'Received TON',
    subtitle: 'Jun 3, 2026 · from Wallet',
    amount: '+25.00 TON',
    amountUsd: '$137.50',
    status: 'confirmed',
    timestamp: new Date('2026-06-03T14:00:00'),
  },
]

export const SUGGESTED_PROMPTS = [
  'Analyze my portfolio',
  'Best swap route for TON→USDC',
  'Explain this transaction',
  'Set price alert',
  'What are the best pools?',
  'Show my 7-day P&L',
]

export const TOTAL_PORTFOLIO_USD = 1284.50
export const PORTFOLIO_CHANGE_USD = 84.20
export const PORTFOLIO_CHANGE_PCT = 7.02
