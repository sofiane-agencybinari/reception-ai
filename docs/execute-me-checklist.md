# Execution complete - checklist finale

Je peux executer 100% des actions techniques, sauf celles qui demandent acces a tes comptes externes.

## Deja execute automatiquement
- Projet Next.js + API + UI cuisine/dashboard/menu.
- Fichiers env prepares (`.env.example`, `.env.local`).
- Schema SQL cree (`supabase/schema.sql`).
- Seed SQL cree (`supabase/seed.sql`).
- Build et lint verifies avec succes.

## Action requise de ta part (acces comptes)
1. Supabase:
   - fournir `NEXT_PUBLIC_SUPABASE_URL`
   - fournir `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - fournir `SUPABASE_SERVICE_ROLE_KEY`
2. Vercel:
   - connexion compte pour deploiement
3. ElevenLabs:
   - configurer webhook vers `/api/orders/from-call`

## Commandes que je lancerai des que tu me donnes les acces
```bash
# 1) Initialisation DB
# (dans Supabase SQL Editor)
# - coller supabase/schema.sql
# - puis coller supabase/seed.sql

# 2) Test local
npm run dev

# 3) Deploiement Vercel
npx vercel --prod
```
