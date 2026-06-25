<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## ASTOR / Reception AI

- **Prod:** https://reception-ai-zeta.vercel.app
- **Health:** `/api/health`
- **Webhook:** `POST /api/orders/from-call` (header `x-webhook-secret`)
- **Agent ElevenLabs:** `agent_1301khmc2x71e30anhrycs0cqhky`

### Deploy Vercel
```bash
./scripts/sync-vercel-env.sh .env.local
vercel --prod
# ou push sur main → auto-deploy GitHub
```

### Tests
```bash
npm run check:prod
npm run test:health
WEBHOOK_BASE_URL=https://reception-ai-zeta.vercel.app npm run test:webhook
```

Config ElevenLabs: `docs/elevenlabs-setup.md`
Config Twilio SMS: `docs/twilio-setup.md` — test: `npm run test:sms -- +33XXXXXXXXX` — verify: `npm run twilio:verified` — configure: `npm run twilio:configure`

Menu PDF: `/settings/menu` → Telecharger PDF — API: `GET /api/menu-items/pdf?restaurantId=...`

Sync env Vercel (si CLI connecte): `npm run sync:vercel` puis redeploy. Sans `vercel login`, pousser les vars manuellement dans Vercel Dashboard.
