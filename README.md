# TonFlow ⚡

> Your DeFi command center on TON — built at STON.fi Vibe Coding Hackathon Wave 2

## What it does

TonFlow is a Telegram Mini App / web app that brings together:
- **Cross-chain swaps** via STON.fi Omniston SDK (v1beta8) — swap TON tokens across TON, Base, Ethereum, BNB, Polygon
- **AI portfolio advisor** powered by Mira — ask anything about your holdings, get actionable DeFi insights
- **Live portfolio dashboard** — balances, P&L, token performance via TonAPI/Toncenter
- **Transaction history** — full swap, send, receive history with status tracking

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **pnpm** package manager
- **Tailwind CSS v4**
- **@ton/ton** + **@tonconnect/ui-react** — wallet connection
- **Recharts** — portfolio charts
- **Framer Motion** — animations
- **Vercel** — deployment

## Tracks

- ✅ **STON.fi Track** — Omniston crosschain SDK v1beta8 integration
- ✅ **Mira Track** — Mira used as AI pair programmer + in-app DeFi advisor workflow

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
vercel --prod
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_TON_NETWORK` | `testnet` or `mainnet` |
| `NEXT_PUBLIC_TONCONNECT_MANIFEST_URL` | Your deployed manifest URL |
| `NEXT_PUBLIC_TONCENTER_API_URL` | Toncenter API endpoint |
| `NEXT_PUBLIC_TONAPI_URL` | TonAPI endpoint |

## Hackathon

Built for STON.fi Vibe Coding Hackathon Wave 2 (June 4–8, 2026)

#VibeCodingWithSTONfi #TONBuilders #HackathonLife
