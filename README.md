# Reception AI - MVP Fast Food

Application web pour receptionniste telephonique IA:
- webhook de commande depuis l'agent vocal (ElevenLabs),
- ecran cuisine en temps reel,
- dashboard manager avec historique et indicateurs de base,
- gestion simple du menu.

## 1) Installation

```bash
npm install
cp .env.example .env.local
```

Renseigner les variables dans `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_DEFAULT_RESTAURANT_ID=
```

## 2) Base de donnees Supabase

1. Ouvrir Supabase SQL Editor.
2. Executer le script: `supabase/schema.sql`.
3. Executer ensuite: `supabase/seed.sql`.
4. Le seed cree deja le restaurant `11111111-1111-1111-1111-111111111111`.
5. Tu peux garder `NEXT_PUBLIC_DEFAULT_RESTAURANT_ID` tel quel pour commencer.

## 3) Lancer le projet en local

```bash
npm run dev
```

Pages principales:
- `http://localhost:3000/kitchen`
- `http://localhost:3000/dashboard`
- `http://localhost:3000/settings/menu`

## 4) Endpoint webhook ElevenLabs

Route backend:
- `POST /api/orders/from-call`

Payload exemple:

```json
{
  "callId": "call_123",
  "restaurantId": "11111111-1111-1111-1111-111111111111",
  "customerPhone": "+33600000000",
  "customerName": "Client Test",
  "pickupTime": "2026-04-30T18:45:00Z",
  "notes": "Sans oignons",
  "transcript": "Je prends un burger et des frites",
  "items": [
    { "name": "Burger", "quantity": 1, "unitPrice": 8.9 },
    { "name": "Frites", "quantity": 1, "unitPrice": 3.5 }
  ]
}
```

## 5) Deploiement Vercel

1. Push le repo sur GitHub.
2. Importer le projet sur Vercel.
3. Copier les variables `.env.local` dans les Environment Variables Vercel.
4. Deployer.
5. Configurer l'URL publique du webhook dans ElevenLabs:
   - `https://votre-domaine/api/orders/from-call`

## 6) Procedure pilote

La procedure operationnelle est dans:
- `docs/pilot-procedure.md`
