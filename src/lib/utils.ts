import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, start = 4, end = 4): string {
  if (!address || address.length <= start + end + 3) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function formatUSD(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function generateMiraResponse(userMessage: string, portfolioContext?: string): string {
  const msg = userMessage.toLowerCase()

  if (msg.includes('swap') && (msg.includes('should') || msg.includes('good'))) {
    return `Based on your portfolio, TON is up 7% today and the current rate via Omniston is 1 TON = 5.84 USDT — better than the 24h average. Slippage is low right now. Timing looks decent, but your USDT allocation is already 40% of portfolio. Worth considering before adding more.`
  }
  if (msg.includes('best performing') || msg.includes('top token')) {
    return `TON is your best performer this week, up 7.02%. Notcoin (NOT) is close behind at +12.40% — smaller position but strong momentum. STON is the laggard at -2.1%.`
  }
  if (msg.includes('analyze') || msg.includes('portfolio')) {
    return `Your portfolio is $1,284.50 total. TON dominates at 53% ($684), which is healthy for a TON-native wallet. You're overweight USDT at 40% — that's very conservative. Consider putting some of that to work in the TON/USDT pool (42.8% APY) on STON.fi. NOT and STON together are only 7% — small but volatile.`
  }
  if (msg.includes('pool') || msg.includes('yield') || msg.includes('farm')) {
    return `Top pools on STON.fi right now:\n\n• TON/USDT — 42.8% APY, $2.4M TVL (safest pair)\n• STON/TON — 38.15% APY, $1.1M TVL\n• NOT/TON — 61.2% APY, $890K TVL (higher risk)\n\nFor your portfolio size, TON/USDT is the most sensible entry point.`
  }
  if (msg.includes('price alert') || msg.includes('alert')) {
    return `I can note a price alert for you here, but for automated on-chain alerts you'll want to set those in Tonkeeper directly. What price level are you watching? I'll remind you when you check in with me.`
  }
  if (msg.includes('route') || msg.includes('usdc') || msg.includes('base')) {
    return `For TON → USDC, the best route via Omniston goes: TON on TON network → bridge → USDC on Base. Current rate is approximately 1 TON = $5.82 USDC after fees. Cross-chain takes ~2-4 minutes. Slippage is set at 0.5% — reasonable for this pair.`
  }
  if (msg.includes('p&l') || msg.includes('profit') || msg.includes('loss')) {
    return `7-day P&L: +$84.20 (+7.02%). Your TON position drove most of this. You're up on every position except STON (-$1.38). Overall a strong week — TON's rally carried the portfolio.`
  }

  return `Got it. Based on your current TonFlow portfolio ($1,284.50 total, 4 tokens), here's my take: your TON position is performing well this week. Is there a specific token, trade, or action you'd like me to dig into?`
}
