# Configuration ElevenLabs + Twilio

## 1) Verifier l'app

```
GET https://reception-ai-zeta.vercel.app/api/health
```

## 2) Outil webhook ElevenLabs

- Nom: `create_order`
- URL: `https://reception-ai-zeta.vercel.app/api/orders/from-call`
- Methode: POST
- Header: `x-webhook-secret` = valeur de `ORDERS_WEBHOOK_SECRET` (Vercel)

Parametres: `customerPhone`, `customerName`, `items[]`, `notes`, `transcript`, `callId`

## 3) Twilio Voice

Ne pas mettre `/api/orders/from-call` dans Twilio Voice.
Utiliser l'URL webhook fournie par ElevenLabs pour les appels entrants.

## 4) Test

```bash
npm run check:prod
WEBHOOK_BASE_URL=https://reception-ai-zeta.vercel.app npm run test:webhook
```

## 5) Sync variables Vercel

Le secret webhook doit etre present sur Vercel (`webhookSecret: true` dans `/api/health`).

```bash
vercel login
npm run sync:vercel
```

Sans CLI : token sur https://vercel.com/account/tokens puis `VERCEL_TOKEN=xxx npm run sync:vercel`
