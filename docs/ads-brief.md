# ASTOR — Ads brief (7 jours)

Objectif : **leads qualifiés** (demo clicks → demandes d’essai) pendant que le logo est peaufiné. Visuels OK sans logo final (ambiance resto / mock produit).

## Produit (rappel)

- **ASTOR** : IA vocale qui décroche, prend les commandes téléphoniques, envoie le bon en cuisine.
- Cible métier : fast-food, snack, kebab, pizzeria, burger.
- Essai : 2 semaines · setup < 24h.
- Tarifs publics : 49 / 99 / 199 €/mois (+ /min).

## URLs funnel

| Étape | URL | Rôle |
| --- | --- | --- |
| 1. Landing ads | https://reception-ai-zeta.vercel.app/demo | Preuve voix (conversion primaire) |
| 2. Essai | https://reception-ai-zeta.vercel.app/#essai | Intention brief |
| 2bis. Essai **actuel** | https://reception-ai-zeta.vercel.app/#contact | Section “Demander mon installation” (utiliser tant que `#essai` n’existe pas) |
| 3. Tarifs | https://reception-ai-zeta.vercel.app/#tarifs | Retargeting / objection prix |

**Parcours recommandé :** Ad → `/demo?utm_…` → CTA “Demandez votre essai” / mail → lead.

---

## Audience

### Primaire (Meta / Google)

- **Géo :** France · focus **Île-de-France** (Paris + proche banlieue) puis élargir Lyon / Marseille si CPL ok
- **Intérêts / comportements :** restauration rapide, propriétaires de restaurant, food service, Uber Eats / Deliveroo (intérêts), franchise snack / pizza
- **Âge :** 25–55
- **Langue :** français
- **Exclusions :** étudiants purs, jobs “employé polyvalent” si trop de noise ; soft exclude IT / SaaS job titles sur LinkedIn

### LinkedIn (si budget reste)

- Titres : Gérant, Directeur de restaurant, Franchisee, Responsable d’exploitation
- Secteur : Restaurants, Food & Beverage
- Geo : IDF puis France

### Angles créa (3)

1. **Appels manqués au rush** (douleur)
2. **Demo 30s** (preuve)
3. **Prix transparent + essai** (objection)

---

## 3 variantes de copy ads

### Variante A — Douleur (appels manqués)

**Primary text :**
```
Midi. Le téléphone sonne. Personne ne décroche.
Le client commande ailleurs.

ASTOR répond à ta place, prend la commande et l’envoie en cuisine — pendant que tu restes en prep.

Teste la voix en 30 secondes.
```

**Headline :** Plus d’appels manqués au rush  
**Description :** IA vocale pour fast-food & pizzeria  
**CTA bouton :** En savoir plus / Essayer  
**Landing :** `/demo` + UTM `utm_content=missed_calls`

---

### Variante B — Preuve (demo)

**Primary text :**
```
Écoute ASTOR prendre une commande en 30 secondes.

Pas de commercial. Juste la voix qui décroche pour ton resto — 24/7, écran cuisine inclus.

Clique. Teste. Décide.
```

**Headline :** Demo voix ASTOR — 30s  
**Description :** Commandes téléphoniques automatisées  
**CTA bouton :** Essayer maintenant  
**Landing :** `/demo` + UTM `utm_content=demo_30s`

---

### Variante C — Prix + essai

**Primary text :**
```
À partir de 49 €/mois. Prix affichés. Essai 2 semaines.

ASTOR décroche, prend les commandes, les envoie en cuisine.
Pour kebab, pizza, burger — sans bloquer ton équipe au téléphone.

Voir la demo → puis demander l’essai.
```

**Headline :** Dès 49 €/mois · essai 2 semaines  
**Description :** Tarifs clairs · setup < 24h  
**CTA bouton :** Demander un essai  
**Landing :** `/demo` (puis push vers `#contact` / essai) + UTM `utm_content=pricing_trial`

---

## Schéma UTM

Base :

```
https://reception-ai-zeta.vercel.app/demo?utm_source={SOURCE}&utm_medium={MEDIUM}&utm_campaign={CAMPAIGN}&utm_content={VARIANT}
```

| Param | Valeurs |
| --- | --- |
| `utm_source` | `meta` · `google` · `linkedin` · `tiktok` · `ig_organic` |
| `utm_medium` | `paid_social` · `cpc` · `organic_social` · `story` |
| `utm_campaign` | `astor_leads_w1` (semaine 1) |
| `utm_content` | `missed_calls` · `demo_30s` · `pricing_trial` |
| `utm_term` | (Google only) mot-clé |

**Exemples prêts :**

```
https://reception-ai-zeta.vercel.app/demo?utm_source=meta&utm_medium=paid_social&utm_campaign=astor_leads_w1&utm_content=missed_calls

https://reception-ai-zeta.vercel.app/demo?utm_source=meta&utm_medium=paid_social&utm_campaign=astor_leads_w1&utm_content=demo_30s

https://reception-ai-zeta.vercel.app/demo?utm_source=google&utm_medium=cpc&utm_campaign=astor_leads_w1&utm_content=pricing_trial
```

Suivi : Vercel Analytics / events demo + spreadsheet leads mail (`contact@agencybinari.com`) avec date + UTM noté manuellement si pas encore de CRM.

---

## Budget test 7 jours

### Option lean (recommandée si 1ère fois)

| Poste | Budget |
| --- | --- |
| Meta (IG + FB) — 70% | **140 €** |
| Google Search / Demand Gen — 30% | **60 €** |
| **Total** | **200 € / 7j** (~28 €/j) |

Répartition créa Meta : 40% A · 40% B · 20% C · kill loser J3.

### Option push

| Poste | Budget |
| --- | --- |
| Meta | 280 € |
| Google | 120 € |
| LinkedIn (test léger) | 100 € |
| **Total** | **500 € / 7j** (~70 €/j) |

### Ciblage budget tips

- Commencer **IDF only** J1–J4 ; élargir FR si CPC/CPL stables.
- Objectif campagnes : **Traffic → /demo** (pas conversion pixel tant que form non trackée). Lead = mail / `#contact`.
- Fréquence max ~2.5 ; refresh créa si fatigue.

---

## KPIs (semaine 1)

| KPI | Définition | Cible lean (200 €) | Cible push (500 €) |
| --- | --- | --- | --- |
| **Demo clicks** | Clics uniques vers `/demo` (ads) | ≥ 80 | ≥ 200 |
| **Demo → engagement** | Sessions demo > 20s / play voix | ≥ 35% des clicks | ≥ 35% |
| **Form / mail leads** | Mails “essai” ou demandes install | **5–10** | **12–25** |
| CPL (lead mail) | Budget ÷ leads | ≤ 40 € | ≤ 35 € |
| CTR ads | Clics / impressions | ≥ 1,2% Meta | ≥ 1,2% |
| CPC | Coût / clic demo | ≤ 2,50 € | ≤ 2,50 € |

### Décisions J3 / J7

- **J3 :** Couper variante CTR < 0,8% ou CPC > 3,5 €. Doubler le gagnant.
- **J7 :** Si ≥ 5 leads → prolonger 7j avec créa gagnante + lookalike / retarget `/demo` visitors → `#contact`.
- Si < 3 leads mais CTR ok → problème offre/landing : renforcer CTA essai sur demo, pas augmenter budget.

---

## Assets créa (sans logo final)

1. Vidéo 15–30s : voiceover + overlay “ASTOR décroche” (écran demo)
2. Static : téléphone qui sonne / cuisine rush + texte hook
3. Carrousel prix 49 / 99 / 199
4. Capture “écran cuisine” produit

Couleurs : fond sombre, accent ASTOR existant du site — wordmark texte “ASTOR” suffit.

## Compliance

- Pas de claims médicaux / “garanti double CA”
- Prix = ceux du site
- Mention essai 2 semaines si promis dans l’ad
