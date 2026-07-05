# Configuration ElevenLabs + Twilio

## 1) Verifier l'app

```
GET https://reception-ai-zeta.vercel.app/api/health
```

## 2) Outil webhook ElevenLabs

- Nom: `create_order_webhook`
- URL: `https://reception-ai-zeta.vercel.app/api/orders/from-call`
- Methode: POST
- Header: `x-webhook-secret` = valeur de `ORDERS_WEBHOOK_SECRET` (Vercel)

Parametres: `customerPhone` (auto `system__caller_id`), `customerName`, `items[]` (`name`, `quantity`, `unitPrice`), `notes`, `callId` (auto `system__call_sid`)

**Option A — automatique (recommandee)**

```bash
npm run elevenlabs:configure-webhook
```

Configure l'outil `create_order_webhook`, le secret `x-webhook-secret` dans ElevenLabs, et teste le webhook prod.

**Langue francaise (appels telephoniques)**

Si l'agent parle anglais au telephone, la version live n'etait probablement pas deployee :

```bash
npm run elevenlabs:configure-agent
```

Force le francais, publie 100% du trafic sur la branche Main, et corrige le message d'accueil.

**Option B — manuelle (dashboard)**

ElevenLabs → Agent → Tools → Webhook → editer `create_order_webhook` avec les memes parametres.

## 3) Twilio Voice — numero PN1d3ad87af5108c6376a9fea95daac442

**Ne pas** configurer manuellement la page Voice dans Twilio Console pour `/api/orders/from-call`.

### Integration native ElevenLabs (recommandee)

**Option A — automatique (1 commande)**

1. Ajoute ta cle API dans `.env.local` :
   ```
   ELEVENLABS_API_KEY=sk_...
   ```
   Cle : [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys)

2. Lance :
   ```bash
   npm run elevenlabs:import-phone
   ```

**Option B — manuelle (dashboard)**

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

## 6) Probleme : « Sam » en anglais + message compte d'essai

Ce n'est **pas** ton agent Shake Beef. Diagnostic :

```bash
npm run diagnose:voice
```

Causes frequentes :

| Cause | Symptome | Solution |
|-------|----------|----------|
| **Twilio Trial** | Message « trial account » en anglais au debut | [Upgrade Twilio](https://console.twilio.com/us1/billing/manage-billing/upgrade) |
| **ElevenLabs Free** | Agent demo / quotas epuises, aucun appel entrant dans l'historique | [Starter 6 $/mois](https://elevenlabs.io/app/subscription) |
| **Branche non publiee** | Widget OK mais pas le telephone | `npm run elevenlabs:fix-phone` |

Apres upgrade :

```bash
npm run elevenlabs:configure-agent
npm run elevenlabs:fix-phone
npm run diagnose:voice
```

Puis rappelle **+19716266228** — tu dois entendre : « Bonjour, bienvenue chez Shake Beef… »
