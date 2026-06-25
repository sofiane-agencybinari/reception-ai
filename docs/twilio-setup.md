# Configuration Twilio — SMS de confirmation ASTOR

Quand un client passe commande par telephone, ASTOR envoie automatiquement un SMS de recu via Twilio.

## Message envoye au client

Exemple :

> Bonjour Marie, votre commande SB-A1B2C3D4 est confirmee chez Restaurant Pilote. Pret vers 14:45. Detail: 1x Burger, 1x Frites. Merci !

Declenchement : a chaque `POST /api/orders/from-call` (appel ElevenLabs ou test webhook).

---

## Etape 1 — Creer un compte Twilio

1. Va sur [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Cree un compte (email + verification telephone)
3. Sur le **Console Dashboard**, note :
   - **Account SID** → `ACxxxxxxxx…`
   - **Auth Token** → clique « Show » pour le voir

---

## Etape 2 — Acheter un numero SMS (France)

1. Menu **Phone Numbers** → **Manage** → **Buy a number**
2. Pays : **France** (+33)
3. Coche la capacite **SMS**
4. Achete un numero (environ 1 €/mois)

Le numero achete ressemble a : `+33XXXXXXXXX`  
→ C'est ta variable `TWILIO_FROM_NUMBER`.

> **Compte Trial (gratuit)** : tu peux tester sans acheter de numero francais tout de suite, mais les SMS ne partent **que vers des numeros verifies** dans Twilio (voir etape 4).

---

## Etape 3 — Remplir `.env.local`

Dans `reception-ai/.env.local` :

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_FROM_NUMBER=+33XXXXXXXXX

RESTAURANT_NAME=Nom de ton restaurant
ORDER_PREP_MINUTES=20
```

- `RESTAURANT_NAME` : nom affiche dans le SMS
- `ORDER_PREP_MINUTES` : delai estime avant « Pret vers HH:MM »

---

## Etape 4 — Compte Trial : verifier ton numero

Si tu es en mode **Trial** :

1. Twilio Console → **Phone Numbers** → **Verified Caller IDs**
2. Ajoute **ton propre mobile** (+33…)
3. Twilio t'envoie un code de validation
4. Tu ne pourras envoyer des SMS de test **qu'a ce numero** tant que le compte n'est pas upgrade

Pour envoyer a n'importe quel client : passe le compte en **payant** (carte bancaire sur Twilio).

---

## Etape 5 — Tester en local

```bash
cd reception-ai
node scripts/test-sms.mjs +33612345678
```

Remplace par **ton** numero (format `+33`, sans espaces).

Reponse attendue :

```text
✅ SMS envoye avec succes
  SID : SMxxxxxxxx
  Statut : queued
```

---

## Etape 6 — Tester via le webhook (bout en bout)

```bash
npm run test:webhook
```

Ou manuellement :

```bash
curl -X POST "http://localhost:3000/api/orders/from-call" \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: TON_SECRET" \
  -d '{
    "callId": "sms_test_001",
    "restaurantId": "11111111-1111-1111-1111-111111111111",
    "customerPhone": "+33612345678",
    "customerName": "Test SMS",
    "items": [{"name": "Burger", "quantity": 1, "unitPrice": 8.9}]
  }'
```

Dans la reponse JSON, verifie :

```json
"sms": { "attempted": true, "sent": true }
```

Si `"reason": "missing_twilio_env"` → variables absentes ou non chargees.  
Si `"reason": "invalid_customer_phone"` → numero invalide ou numero test `000000`.

---

## Etape 7 — Deployer sur Vercel

```bash
./scripts/sync-vercel-env.sh .env.local
vercel --prod
```

Ou ajoute manuellement dans Vercel → Project → Settings → Environment Variables :

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `RESTAURANT_NAME`
- `ORDER_PREP_MINUTES`

Puis **Redeploy**.

Verification prod :

```bash
curl https://reception-ai-zeta.vercel.app/api/health
```

`"twilio": true` = configure.

Le suivi de livraison SMS est actif : Twilio appelle `GET /api/health` → champ `smsStatusWebhookUrl`. En cas d'echec (`failed` / `undelivered`), un log est cree dans `call_logs`.

---

## Depannage

| Erreur | Solution |
|--------|----------|
| `21608` — Unverified number | Verifie le numero dans Twilio (Trial) ou upgrade le compte |
| `21211` — Invalid To number | Format `+336…` obligatoire |
| `21606` — From not SMS capable | Le numero `FROM` doit avoir la capacite SMS |
| `missing_twilio_env` | Remplis les 3 variables Twilio |
| SMS non recu mais `sent: true` | Delai reseau 30s–2min ; verifie spam |

---

## Cout indicatif (France)

- Numero francais : ~1 €/mois
- SMS sortant France : ~0,07–0,10 € / SMS
- Compte Trial : credit offert pour quelques dizaines de tests
