# Graph Report - reception-ai  (2026-10-13)

## Corpus Check
- 195 files · ~148,685 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .glb 1, .css 1)

## Summary
- 1147 nodes · 2157 edges · 70 communities (62 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `40945b15`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- kitchen-board.tsx
- landing-page.tsx
- lucide-react
- next
- marketing-data.ts
- legal-page.tsx
- react
- package.json
- marketing-scroll-story.tsx
- configure-bella-napoli-agent.mjs
- 8. Démarchage LinkedIn
- load-env.mjs
- configure-elbahja-webhook.mjs
- scripts
- pricing.tsx
- getSupabaseAdminClient
- motion
- configure-site-demo-agent.mjs
- subscribe-panel.tsx
- Bella Napoli — analyse prospect (mystery shopper)
- compilerOptions
- feature-vignettes.tsx
- demo-limits.ts
- notifications.ts
- compare.tsx
- Configuration Twilio — SMS de confirmation ASTOR
- leads/route.ts
- orb-journey.tsx
- 10 posts prêts à poster
- test-sms.mjs
- marketing-product-showcase.tsx
- Configuration ElevenLabs + Twilio
- push-vercel-env.mjs
- contact/route.ts
- configure-twilio-number.mjs
- import-elevenlabs-phone.mjs
- configure-elevenlabs-webhook.mjs
- from-call/route.ts
- social/README.md
- ASTOR — Ads brief (7 jours)
- Bella Napoli — démo pizzeria ASTOR
- El Bahja — agent ASTOR
- Reception AI - MVP Fast Food
- diagnose-voice-call.mjs
- verify-twilio-number.mjs
- Procedure pilote (restaurant)
- ASTOR — Brand voice (court)
- ASTOR — Bios + 10 posts FR
- sms-status/route.ts
- hero-product-stage.tsx
- Prospects à appeler ou à visiter (sans e-mail public)
- Agent SEO Ligne — cahier des charges
- ASTOR — Pack social (Sofiane)
- fix-elevenlabs-phone.mjs
- marketing-google-reviews.tsx
- marketing-capabilities.tsx
- ASTOR / Reception AI
- Execution complete - checklist finale
- iphone-3d.tsx
- 3 variantes de copy ads
- Audience
- Budget test 7 jours
- CLAUDE.md
- .claude/CLAUDE.md
- mcp.json
- mobile-a-corriger.md
- journal.md
- postcss.config.mjs
- sync-vercel-env.sh
- config.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 52 edges
2. `react` - 52 edges
3. `getSupabaseAdminClient()` - 33 edges
4. `motion` - 32 edges
5. `lucide-react` - 29 edges
6. `scripts` - 21 edges
7. `loadProjectEnv()` - 17 edges
8. `LandingPage()` - 17 edges
9. `compilerOptions` - 16 edges
10. `AppShell()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getSupabaseAdminClient()`  [EXTRACTED]
  src/app/api/call-logs/route.ts → src/lib/supabase.ts
- `store()` --calls--> `getSupabaseAdminClient()`  [EXTRACTED]
  src/app/api/contact/route.ts → src/lib/supabase.ts
- `notifyBySms()` --calls--> `parseTwilioApiError()`  [EXTRACTED]
  src/app/api/contact/route.ts → src/lib/twilio.ts
- `GET()` --calls--> `getSupabaseAdminClient()`  [EXTRACTED]
  src/app/api/customers/route.ts → src/lib/supabase.ts
- `GET()` --calls--> `getSupabaseAdminClient()`  [EXTRACTED]
  src/app/api/dashboard/route.ts → src/lib/supabase.ts

## Import Cycles
- None detected.

## Communities (70 total, 8 thin omitted)

### Community 0 - "kitchen-board.tsx"
Cohesion: 0.05
Nodes (64): GET(), ClientsPage(), DashboardPage(), KitchenPage(), MODULES, PortalPage(), MenuSettingsPage(), AppShell() (+56 more)

### Community 1 - "landing-page.tsx"
Cohesion: 0.05
Nodes (50): DemoPage(), MENU_PREVIEW, metadata, TRY_PROMPTS, DemoPizzaPage(), MENU_PREVIEW, metadata, TRY_PROMPTS (+42 more)

### Community 2 - "lucide-react"
Cohesion: 0.07
Nodes (47): lucide-react, GET(), runtime, ElBahjaPage(), loadMenuItems(), metadata, revalidate, ElBahjaCtaBand() (+39 more)

### Community 3 - "next"
Cohesion: 0.09
Nodes (43): nextConfig, SITE_URL, next, ContactForm(), ContactPage(), metadata, GuidesIndex(), metadata (+35 more)

### Community 4 - "marketing-data.ts"
Cohesion: 0.06
Nodes (36): ease, MarketingCta(), COMPARISON, FAQ, FEATURE_GROUPS, FeatureGroup, FeatureItem, FEATURES (+28 more)

### Community 5 - "legal-page.tsx"
Cohesion: 0.08
Nodes (40): stripe, MerciPage(), metadata, PLAN_NAMES, STEPS, POST(), runtime, siteUrl() (+32 more)

### Community 6 - "react"
Cohesion: 0.09
Nodes (40): @elevenlabs/react, react, @react-three/drei, @react-three/fiber, three, useCanvasActive(), useMaxDpr(), Flow() (+32 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (42): eslintConfig, dependencies, @elevenlabs/react, gsap, @gsap/react, lenis, lucide-react, motion (+34 more)

### Community 8 - "marketing-scroll-story.tsx"
Cohesion: 0.09
Nodes (32): DashboardImmersive(), Props, Column(), DONE_ORDERS, KitchenImmersive(), Kpi(), NEW_ORDERS, PREP_ORDERS (+24 more)

### Community 9 - "configure-bella-napoli-agent.mjs"
Cohesion: 0.09
Nodes (22): BELLA_NAPOLI_AGENT_ID, BELLA_NAPOLI_BRANCH_ID, BELLA_NAPOLI_FIRST_MESSAGE, BELLA_NAPOLI_PROMPT, BELLA_NAPOLI_RESTAURANT_ID, BELLA_NAPOLI_TOOL_ID, BELLA_NAPOLI_VOICE_ID, api() (+14 more)

### Community 10 - "8. Démarchage LinkedIn"
Cohesion: 0.08
Nodes (24): 1. Identité, 2. Page LinkedIn (entreprise), 3. Autres réseaux — bios, 4. Dix premiers posts (LinkedIn d'abord, adaptables Instagram/Facebook), 5. Calendrier — 2 premières semaines, 6. Prospection — pour le premier client ce week-end, 7. À faire de ton côté (15-30 min), 8. Démarchage LinkedIn (+16 more)

### Community 11 - "load-env.mjs"
Cohesion: 0.11
Nodes (14): checks, secret, apiKey, headers, __dirname, loadEnvFile(), loadProjectEnv(), root (+6 more)

### Community 12 - "configure-elbahja-webhook.mjs"
Cohesion: 0.13
Nodes (16): apiKey, headers, api(), apiKey, ensureWebhookSecretId(), headers, requestHeaders, toolConfig (+8 more)

### Community 13 - "scripts"
Cohesion: 0.10
Nodes (21): scripts, build, check:prod, dev, diagnose:voice, elevenlabs:configure-agent, elevenlabs:configure-bella-napoli, elevenlabs:configure-bella-napoli-webhook (+13 more)

### Community 14 - "pricing.tsx"
Cohesion: 0.16
Nodes (11): gsap, @gsap/react, lenis, EASE_IN_OUT, EASE_OUT, prefersReducedMotion(), perMinute(), Pricing() (+3 more)

### Community 15 - "getSupabaseAdminClient"
Cohesion: 0.16
Nodes (13): @supabase/supabase-js, GET(), GET(), GET(), POST(), PATCH(), GET(), getSupabaseAdminClient() (+5 more)

### Community 16 - "motion"
Cohesion: 0.18
Nodes (15): motion, buildDay(), Call, CALLS, CURVE, DayTimeline(), euros(), hhmm() (+7 more)

### Community 17 - "configure-site-demo-agent.mjs"
Cohesion: 0.11
Nodes (15): BANNED, DIR, errors, files, slugs, SOLUTIONS, solutionSlugs, titles (+7 more)

### Community 18 - "subscribe-panel.tsx"
Cohesion: 0.13
Nodes (16): react-dom, getLenis(), Ctx, perMinute(), PlanId, SubscribeContext, SubscribeProvider(), CUISINE_OPTIONS (+8 more)

### Community 19 - "Bella Napoli — analyse prospect (mystery shopper)"
Cohesion: 0.11
Nodes (18): 1. Parcours idéal sur le site, 2. Ce qui doit être parfait dans l’appel, 3. Objections & comment le script / le funnel y répond, 4. Checklist QA avant de montrer un prospect (10 items), 5. 3 scripts oraux pour Sofiane (test manuel), Bella Napoli — analyse prospect (mystery shopper), Confirmation & clôture, Latence (+10 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "feature-vignettes.tsx"
Cohesion: 0.25
Nodes (17): appear(), Bubble(), Chip(), Customers(), France(), Handoff(), ManyLines(), MenuImport() (+9 more)

### Community 22 - "demo-limits.ts"
Cohesion: 0.24
Nodes (14): clientIp(), POST(), runtime, DEMO_DAILY_MAX, DEMO_PER_IP, DemoMode, getDemoUsage(), hashIp() (+6 more)

### Community 23 - "notifications.ts"
Cohesion: 0.24
Nodes (11): GET(), getAppUrl(), buildMessage(), canSendSms(), formatEta(), sendOrderSummarySms(), SmsOrderItem, SmsOrderSummaryInput (+3 more)

### Community 24 - "compare.tsx"
Cohesion: 0.21
Nodes (10): CharReveal(), clamp(), Compare(), FlowCanvas, MissedCounter(), Scene, SCENES, smooth() (+2 more)

### Community 25 - "Configuration Twilio — SMS de confirmation ASTOR"
Cohesion: 0.17
Nodes (11): Configuration Twilio — SMS de confirmation ASTOR, Cout indicatif (France), Depannage, Etape 1 — Creer un compte Twilio, Etape 2 — Acheter un numero SMS (France), Etape 3 — Remplir `.env.local`, Etape 4 — Compte Trial : verifier ton numero, Etape 5 — Tester en local (+3 more)

### Community 26 - "leads/route.ts"
Cohesion: 0.26
Nodes (11): getClientIp(), isRateLimited(), LeadPayload, logLead(), POST(), postWebhook(), RateEntry, rateLimitStore (+3 more)

### Community 27 - "orb-journey.tsx"
Cohesion: 0.26
Nodes (11): VIGNETTES, swipeStepByStep(), clamp(), MOBILE_CHAPTER_POSE, OrbCanvas, OrbJourney(), PATH, poseFor() (+3 more)

### Community 28 - "10 posts prêts à poster"
Cohesion: 0.18
Nodes (11): 10 posts prêts à poster, Post 10 — CTA essai (fin de semaine), Post 1 — Appels manqués (hook douleur), Post 2 — Demo 30s (preuve produit), Post 3 — Transparence prix, Post 4 — Écran cuisine, Post 5 — Multilingue, Post 6 — Rush midi (urgence locale) (+3 more)

### Community 29 - "test-sms.mjs"
Cohesion: 0.18
Nodes (7): accountSid, auth, authToken, __dirname, fromNumber, payload, root

### Community 30 - "marketing-product-showcase.tsx"
Cohesion: 0.27
Nodes (10): ease, MarketingProductShowcase(), ModelCuisine(), ModelPilotage(), ModelReception(), Product, ProductId, PRODUCTS (+2 more)

### Community 31 - "Configuration ElevenLabs + Twilio"
Cohesion: 0.20
Nodes (9): 1) Verifier l'app, 2) Outil webhook ElevenLabs, 3) Twilio Voice — numero PN1d3ad87af5108c6376a9fea95daac442, 4) Test, 5) Sync variables Vercel, 6) Probleme : « Sam » en anglais + message compte d'essai, Configuration ElevenLabs + Twilio, Integration native ElevenLabs (recommandee) (+1 more)

### Community 32 - "push-vercel-env.mjs"
Cohesion: 0.33
Nodes (8): api(), KEYS, loadProject(), loadToken(), main(), parseEnvFile(), TARGETS, upsertEnv()

### Community 33 - "contact/route.ts"
Cohesion: 0.27
Nodes (9): zod, Contact, contactSchema, limited(), notifyBySms(), POST(), rate, runtime (+1 more)

### Community 34 - "configure-twilio-number.mjs"
Cohesion: 0.20
Nodes (6): accountSid, auth, authToken, __dirname, updates, projectRoot

### Community 35 - "import-elevenlabs-phone.mjs"
Cohesion: 0.20
Nodes (7): apiKey, auth, found, normalized, phoneNumber, twilioSid, twilioToken

### Community 36 - "configure-elevenlabs-webhook.mjs"
Cohesion: 0.25
Nodes (7): api(), apiKey, ensureWebhookSecretId(), headers, requestHeaders, toolConfig, webhookSecret

### Community 37 - "from-call/route.ts"
Cohesion: 0.50
Nodes (7): normalizePickupTime(), parsePossiblyJsonObject(), parseRequestBody(), pickFirstString(), POST(), safeObject(), isWebhookAuthorized()

### Community 38 - "social/README.md"
Cohesion: 0.25
Nodes (3): Post 1 — Identification pizzeria (douleur rush), Post 2 — Preuve carte (anti-gadget), Posts — démo pizzeria Bella Napoli

### Community 39 - "ASTOR — Ads brief (7 jours)"
Cohesion: 0.25
Nodes (8): Assets créa (sans logo final), ASTOR — Ads brief (7 jours), Compliance, Décisions J3 / J7, KPIs (semaine 1), Produit (rappel), Schéma UTM, URLs funnel

### Community 40 - "Bella Napoli — démo pizzeria ASTOR"
Cohesion: 0.25
Nodes (7): Bella Napoli — démo pizzeria ASTOR, Flux voix (1 question / tour), Identifiants, Menu (limité — anti-hallucination), Scripts npm, Test UI, Token budget ElevenLabs

### Community 41 - "El Bahja — agent ASTOR"
Cohesion: 0.25
Nodes (7): Cockpit web, El Bahja — agent ASTOR, Flux commande, Identifiants, Manque encore, Reconfigurer (prompt + voix + webhook), Test

### Community 42 - "Reception AI - MVP Fast Food"
Cohesion: 0.25
Nodes (7): 1) Installation, 2) Base de donnees Supabase, 3) Lancer le projet en local, 4) Endpoint webhook ElevenLabs, 5) Deploiement Vercel, 6) Procedure pilote, Reception AI - MVP Fast Food

### Community 43 - "diagnose-voice-call.mjs"
Cohesion: 0.25
Nodes (6): apiKey, issues, ok, phoneNumber, twilioSid, twilioToken

### Community 44 - "verify-twilio-number.mjs"
Cohesion: 0.25
Nodes (4): accountSid, auth, authToken, phoneToVerify

### Community 45 - "Procedure pilote (restaurant)"
Cohesion: 0.29
Nodes (6): 1) Preparation avant ouverture, 2) Procedure pendant service, 3) Test de bout en bout quotidien, 4) Procedure incident, 5) KPIs de la semaine pilote, Procedure pilote (restaurant)

### Community 46 - "ASTOR — Brand voice (court)"
Cohesion: 0.29
Nodes (7): ASTOR — Brand voice (court), En une phrase, Formules type, Interdits, Signature CTA, Ton, Vocabulaire ASTOR

### Community 47 - "ASTOR — Bios + 10 posts FR"
Cohesion: 0.29
Nodes (7): ASTOR — Bios + 10 posts FR, Bios, Démo pizzeria (Bella Napoli), Instagram, LinkedIn (page / profil perso Sofiane), Premier commentaire type (IG / TikTok), TikTok

### Community 48 - "sms-status/route.ts"
Cohesion: 0.38
Nodes (5): twilio, FAILURE_STATUSES, POST(), TwilioApiError, validateTwilioWebhook()

### Community 49 - "hero-product-stage.tsx"
Cohesion: 0.43
Nodes (6): CallTimer(), ease, HeroProductStage(), MiniWave(), OrderCard(), TRANSCRIPT

### Community 50 - "Prospects à appeler ou à visiter (sans e-mail public)"
Cohesion: 0.33
Nodes (5): Prospects à appeler ou à visiter (sans e-mail public), Script d'appel (30 secondes), Suivi, À appeler en priorité (livraison + volume), À visiter (numéro non relevé)

### Community 51 - "Agent SEO Ligne — cahier des charges"
Cohesion: 0.33
Nodes (5): Agent SEO Ligne — cahier des charges, Format d'un guide, Plan éditorial (prendre dans l'ordre, cocher dans le journal), Procédure de chaque exécution, Règles éditoriales (non négociables)

### Community 52 - "ASTOR — Pack social (Sofiane)"
Cohesion: 0.33
Nodes (6): ASTOR — Pack social (Sofiane), Cadence suggérée (7 jours), Checklist avant publish, Fichiers, Règles de posting (logo en cours), URLs

### Community 53 - "fix-elevenlabs-phone.mjs"
Cohesion: 0.33
Nodes (5): apiKey, headers, normalized, phone, phoneNumber

### Community 54 - "marketing-google-reviews.tsx"
Cohesion: 0.53
Nodes (4): CLIENT_TESTIMONIALS, GoogleMark(), MarketingGoogleReviews(), StarRow()

### Community 55 - "marketing-capabilities.tsx"
Cohesion: 0.47
Nodes (5): ChapterCopy(), CHAPTERS, Line, MarketingCapabilities(), ReducedCapabilities()

### Community 56 - "ASTOR / Reception AI"
Cohesion: 0.40
Nodes (4): ASTOR / Reception AI, Deploy Vercel, Tests, This is NOT the Next.js you know

### Community 57 - "Execution complete - checklist finale"
Cohesion: 0.40
Nodes (4): Action requise de ta part (acces comptes), Commandes que je lancerai des que tu me donnes les acces, Deja execute automatiquement, Execution complete - checklist finale

### Community 58 - "iphone-3d.tsx"
Cohesion: 0.60
Nodes (4): Bubble(), IPhone3D(), PhoneGlyph(), Props

### Community 59 - "3 variantes de copy ads"
Cohesion: 0.50
Nodes (4): 3 variantes de copy ads, Variante A — Douleur (appels manqués), Variante B — Preuve (demo), Variante C — Prix + essai

### Community 60 - "Audience"
Cohesion: 0.50
Nodes (4): Angles créa (3), Audience, LinkedIn (si budget reste), Primaire (Meta / Google)

### Community 61 - "Budget test 7 jours"
Cohesion: 0.50
Nodes (4): Budget test 7 jours, Ciblage budget tips, Option lean (recommandée si 1ère fois), Option push

## Knowledge Gaps
- **7 isolated node(s):** `@tailwindcss/postcss`, `@types/node`, `@types/pdfkit`, `@types/react`, `@types/react-dom` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 553 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `kitchen-board.tsx`, `contact/route.ts`, `lucide-react`, `landing-page.tsx`, `marketing-data.ts`, `legal-page.tsx`, `from-call/route.ts`, `package.json`, `react`, `marketing-scroll-story.tsx`, `getSupabaseAdminClient`, `sms-status/route.ts`, `motion`, `demo-limits.ts`, `notifications.ts`, `compare.tsx`, `leads/route.ts`, `orb-journey.tsx`?**
  _High betweenness centrality (0.243) - this node is a cross-community bridge._
- **What connects `@tailwindcss/postcss`, `@types/node`, `@types/pdfkit` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `kitchen-board.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05434173669467787 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `kitchen-board.tsx`, `landing-page.tsx`, `lucide-react`, `next`, `marketing-data.ts`, `legal-page.tsx`, `package.json`, `marketing-scroll-story.tsx`, `pricing.tsx`, `motion`, `subscribe-panel.tsx`, `feature-vignettes.tsx`, `marketing-capabilities.tsx`, `compare.tsx`, `iphone-3d.tsx`, `orb-journey.tsx`, `marketing-product-showcase.tsx`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **Should `landing-page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.051643192488262914 - nodes in this community are weakly interconnected._
- **Why does `stripe` connect `legal-page.tsx` to `load-env.mjs`, `package.json`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.07403846153846154 - nodes in this community are weakly interconnected._