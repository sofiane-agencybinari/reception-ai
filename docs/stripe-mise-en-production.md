# Stripe : passer en paiement réel

Le site est prêt : page de paiement, abonnement mensuel, minutes facturées à l'usage, webhook (nouvel abonné, résiliation, paiement échoué). Il reste à activer le compte Stripe et à brancher la clé « live ».

Entreprise : **Sofiane Aokache, entrepreneur individuel (EI), nom commercial AOS**
SIREN 131 338 261, RCS Nanterre. 58 boulevard du Général Leclerc, 92200 Neuilly-sur-Seine. Micro-entreprise, TVA non applicable (art. 293 B du CGI).

---

## Étape 1 — Activer le compte Stripe (15 min, vous seul)

https://dashboard.stripe.com → **Activer les paiements**

| Question Stripe | Réponse |
|---|---|
| Pays | France |
| Type d'entreprise | Entreprise individuelle |
| Numéro SIREN | 131 338 261 |
| Nom légal | Sofiane Aokache |
| Nom commercial (« Doing business as ») | AOS |
| Adresse | 58 boulevard du Général Leclerc, 92200 Neuilly-sur-Seine |
| Secteur | Logiciels / SaaS |
| Site web | https://ligne-ai.com |
| Description du produit | Logiciel SaaS pour restaurants : agent vocal qui prend les commandes par téléphone. Abonnement mensuel sans engagement (49, 99 ou 199 €) et minutes d'appel facturées à l'usage. |
| Libellé sur le relevé bancaire du client | `LIGNE AOS` |
| Téléphone du support | 06 95 84 64 41 |
| E-mail du support | Ligne.AI@outlook.com |
| Compte bancaire | Votre IBAN (idéalement un compte dédié à l'activité) |
| Identité | Pièce d'identité du représentant (vous) |

## Étape 2 — Mention TVA sur les factures (2 min)

En micro-entreprise, chaque facture doit porter la mention d'exonération.

Stripe → **Paramètres → Facturation → Factures → Modèle par défaut → Pied de page** :

```
TVA non applicable, article 293 B du CGI.
Sofiane Aokache EI — AOS — SIREN 131 338 261 — 58 boulevard du Général Leclerc, 92200 Neuilly-sur-Seine.
```

Dans **Paramètres → E-mails clients**, activez : factures payées, paiements réussis, paiements échoués et cartes expirées.

## Étape 3 — Créer le catalogue et le webhook en mode réel (5 min, sur le Mac)

1. Stripe → **Développeurs → Clés API** (interrupteur « mode test » désactivé) → copiez la **clé secrète** `sk_live_…`.
   Ne la collez jamais dans un chat ni dans un e-mail.
2. Dans le Terminal, dans le dossier du projet (après `git pull`) :
   ```
   echo 'STRIPE_SECRET_KEY=sk_live_COLLEZ_ICI' >> .env.local
   node scripts/setup-stripe.mjs
   ```
   Le script crée les 3 formules, les prix à la minute, le compteur de minutes et le webhook vers `https://ligne-ai.com/api/stripe/webhook`.
   Il affiche une ligne `STRIPE_WEBHOOK_SECRET=whsec_…` : **copiez-la tout de suite**.
3. Ajoutez cette ligne à `.env.local`, puis envoyez les deux clés à Vercel :
   ```
   echo 'STRIPE_WEBHOOK_SECRET=whsec_COLLEZ_ICI' >> .env.local
   npm run sync:vercel
   ```
   Sans la commande `vercel` : Vercel → projet → **Settings → Environment Variables** → ajoutez `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` en **Production**.
4. Vercel → **Deployments** → dernier déploiement → **Redeploy**.

## Étape 4 — Tester avec un vrai paiement (5 min)

1. Sur https://ligne-ai.com/#tarifs → **Choisir Essentiel** → payez avec votre propre carte.
2. Vérifiez que :
   - vous arrivez sur la page « Merci » ;
   - vous recevez l'e-mail « [LIGNE] Nouvel abonné » ;
   - l'abonnement apparaît dans Stripe → **Abonnements** ;
   - la facture porte bien la mention TVA.
3. Remboursez-vous et annulez l'abonnement test : Stripe → le paiement → **Rembourser**, puis l'abonnement → **Annuler**.

## Étape 5 — Facturation automatique des minutes d'appel (10 min, une seule fois)

À la fin de chaque appel, ElevenLabs envoie la durée à Ligne, qui la déclare à Stripe sur le compte du restaurant. La minute entamée est due. Les minutes s'ajoutent à la facture mensuelle.

1. **Base de données** : Supabase → **SQL Editor** → collez le contenu de `supabase/billing.sql` → **Run**.
2. **Webhook ElevenLabs** : ElevenLabs → **Agents → Settings → Post-call webhook** → créez un webhook vers :
   ```
   https://ligne-ai.com/api/webhooks/elevenlabs/post-call
   ```
   Type « transcription ». ElevenLabs affiche un **secret** : copiez-le.
3. **Vercel** : ajoutez `ELEVENLABS_WEBHOOK_SECRET` (la valeur copiée) en Production, puis redéployez.
4. **Pour chaque nouveau client** : `npm run billing:link -- <restaurant_id> <agent_id> <e-mail du client>` (voir `docs/installation-premier-client.md`, étape 6).

Les appels de la démo du site et ceux d'un restaurant non relié ne sont jamais facturés.

## Si quelque chose bloque

- **« Le paiement en ligne n'est pas encore activé »** sur le site : la clé n'est pas en Production sur Vercel, ou le site n'a pas été redéployé.
- **Pas d'e-mail « Nouvel abonné »** : vérifiez `STRIPE_WEBHOOK_SECRET`, puis Stripe → Webhooks → l'endpoint → onglet des tentatives (code 400 = mauvais secret).
- **Un appel n'apparaît pas dans la facture** : vérifiez qu'il figure dans la table `billed_calls` (colonne `reported_at` remplie). S'il n'y est pas, le restaurant n'est pas relié (`npm run billing:link`) ou `ELEVENLABS_WEBHOOK_SECRET` est faux (ElevenLabs → Webhooks → historique des envois, code 401).
