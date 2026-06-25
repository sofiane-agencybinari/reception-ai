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

## 3) Twilio Voice — numero PN1d3ad87af5108c6376a9fea95daac442

**Ne pas** configurer manuellement la page Voice dans Twilio Console pour `/api/orders/from-call`.

### Integration native ElevenLabs (recommandee)

1. Ouvre [ElevenLabs → Phone numbers](https://elevenlabs.io/app/conversational-ai/phone-numbers)
2. **Import Twilio number**
3. Renseigne :
   - **Phone number** : ton numero Twilio (Active numbers)
   - **Twilio Account SID** + **Auth Token**
   - **Label** : `ASTOR Reception`
4. ElevenLabs configure **automatiquement** le Voice webhook sur Twilio ([doc](https://elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/native-integration))
5. Assigne l'agent `agent_1301khmc2x71e30anhrycs0cqhky` aux appels entrants

### Script local (friendly name + verif)

Une fois `TWILIO_ACCOUNT_SID` et `TWILIO_AUTH_TOKEN` dans `.env.local` :

```bash
npm run twilio:configure
```

Configure le nom du numero et met a jour `TWILIO_FROM_NUMBER` dans `.env.local`.

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
