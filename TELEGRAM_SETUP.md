# How to Register TonFlow as a Telegram Mini App

## Step 1 — Create a Telegram Bot (2 min)

1. Open Telegram → search `@BotFather`
2. Send `/newbot`
3. Name: `TonFlow`
4. Username: `tonflow_bot` (or similar, must be unique)
5. BotFather gives you a **Bot Token** — save it

## Step 2 — Deploy to Vercel (3 min)

```bash
cd tonflow
vercel --prod
```

Copy your live URL e.g. `https://tonflow-abc123.vercel.app`

## Step 3 — Register as Mini App (2 min)

In BotFather:
1. `/newapp` or `/mybots` → select your bot → `Bot Settings` → `Menu Button`
2. Send `/newapp`
3. Select your bot
4. App name: `TonFlow`
5. Description: `Cross-chain TON swaps + AI portfolio insights powered by Mira`
6. Upload an icon (512×512 PNG)
7. Web App URL: your Vercel URL
8. Short name: `tonflow`

## Step 4 — Set Menu Button

In BotFather:
1. `/mybots` → your bot → `Bot Settings` → `Menu Button`
2. Set URL: your Vercel URL
3. Set Text: `Open TonFlow`

## Step 5 — Test it

1. Open your bot in Telegram
2. Tap the Menu button (bottom left)
3. TonFlow opens as a Mini App 🎉

## Share Link Format

Once live, users can open it via:
```
https://t.me/tonflow_bot/tonflow
```

Or directly share the bot link — tapping it opens TonFlow inside Telegram.

## Environment Variables on Vercel

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_TON_NETWORK` | `testnet` |
| `NEXT_PUBLIC_TONCONNECT_MANIFEST_URL` | `https://your-url.vercel.app/tonconnect-manifest.json` |
| `NEXT_PUBLIC_TONCENTER_API_URL` | `https://testnet.toncenter.com/api/v2` |
| `NEXT_PUBLIC_TONAPI_URL` | `https://testnet.tonapi.io/v2` |

## Hackathon Submission Checklist

- [ ] GitHub repo public
- [ ] Vercel live URL working
- [ ] Telegram Mini App link working: `t.me/yourbot/tonflow`
- [ ] Loom demo recorded (show: connect → dashboard → swap → mira chat)
- [ ] Submission form filled: https://identityhub.app/contests/stonfi-vibecoding-hackathon-cohort-2
