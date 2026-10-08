# Bella Napoli — analyse prospect (mystery shopper)

**Persona :** gérant de pizzeria qui teste ASTOR pour la première fois.  
**Funnel :** landing → `/demo-pizza` → `#essai`  
**Script source :** `scripts/bella-napoli-prompt.mjs`  
**Règle :** tests manuels (Sofiane) uniquement — pas d’appel API ElevenLabs depuis ce doc.

---

## 1. Parcours idéal sur le site

### Étape A — Landing (`/`)

Ce que le gérant doit ressentir en **moins de 8 secondes** :

1. **Marque claire** : ASTOR = téléphone qui prend les commandes pendant le rush.
2. **Preuve immédiate** : CTA « Essayer la démo » (pas un devis flou).
3. **Risque bas** : essai 14 jours visible à côté, sans engagement.

**Comportement cible :**
- Il scrolle peu ou pas.
- Il clique **Essayer la démo** (ou un lien ads direct vers `/demo-pizza`).
- S’il hésite sur le prix, il regarde `#tarifs` puis revient à la demo — pas l’inverse.

**Friction à éviter :**
- Trop de sections avant le micro.
- Demo kebab (El Bahja) présentée à un prospect pizzeria → perte d’identification. Pour ce persona, **`/demo-pizza` est la bonne porte**.

### Étape B — Demo pizzeria (`/demo-pizza`)

Parcours mental du gérant :

| Seconde | Attente |
| --- | --- |
| 0–3 | « C’est pour une pizzeria comme la mienne. » (Bella Napoli, carte pizza visible) |
| 3–10 | Phrases à dire prêtes (copier = zéro réflexion) |
| 10–15 | Micro clair, autorisation micro, first message en français |
| 15–90 | Conversation fluide → récap → confirmation |
| 90+ | Sticky CTA « Essai gratuit 14 jours » → `/#essai` |

**Ce qui doit être évident sans lire :**
- Badge type « Démo live · Bella Napoli »
- 3 prompts copiables (emporter / pizza / retrait)
- Widget au centre (pas en bas de page)
- Aperçu carte (Margherita, 4 Fromages, calzones, softs…)
- Lien essai après le micro

**Sortie de page réussie :**
- Il a entendu une vraie prise de commande.
- Il croit que *sa* carte peut être branchée de la même façon.
- Il clique **Demander mon essai** (sticky ou lien bas de page).

### Étape C — Essai (`/#essai`)

Formulaire court, ton terrain :

- Nom resto + ville + type cuisine (**pizza** pré-sélectionnable / évident)
- Contact joignable le jour même
- Promesse : config sous 24 h, 2 semaines sans engagement

**Conversion :** après la demo pizza, le formulaire ne doit plus « vendre » ASTOR — il doit seulement **capturer l’intention**. Le produit a déjà parlé.

---

## 2. Ce qui doit être parfait dans l’appel

Le gérant n’évalue pas « l’IA ». Il évalue : *est-ce que mon employé pourrait laisser ça gérer le 19 h ?*

### Latence

| Critère | Seuil « pro » | Seuil « kill deal » |
| --- | --- | --- |
| Décroche / first message | immédiat après clic micro | > 3 s de silence |
| Réponse après chaque phrase client | ~0,5–1,5 s perçu | silences > 2–3 s répétés |
| TTS | voix naturelle, pas robotique | débit haché / coupures |

Référence technique attendue (comme El Bahja) : voix Emilie FR + TTS flash basse latence.

### Une question à la fois

Le script impose déjà le rythme. Le prospect doit entendre :

1. Emporter ou livraison ?  
2. (Si livraison) Adresse courte ?  
3. Quelle pizza / calzone ?  
4. Quantité ?  
5. Une autre ?  
6. Boisson ?  
7. Dessert ?  
8. Récap → confirmation → prénom → heure → téléphone  

**Fail immédiat :** deux questions dans la même réplique (« Vous voulez quelle pizza et combien ? ») — le gérant pense « ça va se tromper au rush ».

### Récap

Avant « Je confirme votre commande ? », le prospect doit entendre :

- Articles + prix unitaires
- Total estimé
- Mode (emporter **ou** livraison + adresse)

Sans récap clair → zéro confiance cuisine.

### Zéro invention

Le script dit : hors carte → « Désolé, ce n’est pas à la carte » + alternative menu.

**Tests kill-deal à faire manuellement :**
- Demander une « Regina » / « Pepperoni » / « Large » → refus poli, pas d’invention
- Demander « sur place » → rappel modes (emporter / livraison seulement)
- Demander un prix inventé → coller au MENU (Margherita 10 €, etc.)

Si l’agent invente un produit une seule fois devant un gérant : **demo ratée**.

### Confirmation & clôture

- Attendre un **oui clair** avant prénom / heure / téléphone
- Ne jamais dire « commande enregistrée » si le webhook échoue (script §15)
- Phrase de fin : reconnaissance Bella Napoli + « À tout de suite »

---

## 3. Objections & comment le script / le funnel y répond

| Objection gérant | Ce qu’il pense vraiment | Réponse de la **demo** | Réponse du **site** (après) |
| --- | --- | --- | --- |
| « L’IA va se planter sur les pizzas » | Peur d’erreurs cuisine | Menu fermé + noms exacts + récap + confirmation | FAQ compréhension / allergies |
| « Mes clients parlent vite / mal » | Accents, digressions | Une question/tour, ramène à l’étape | FAQ accents & transfert humain |
| « Trop lent au rush » | Latence = file téléphonique | Réponses ≤ 2 phrases, flux court | Comparaison « < 2 s » / multi-appels |
| « Ça invente des produits » | Perte de contrôle carte | Règle anti hors-carte explicite | Import PDF/Excel = *votre* menu |
| « Et la livraison ? » | Cas réel pizzeria | Mode livraison + adresse dans le flux | Même logique sur *leur* script |
| « Faut changer de numéro ? » | Friction technique | (Hors voix) — | FAQ : numéro dédié ou renvoi 09 |
| « Combien ça coûte ? » | ROI rush | Demo ne parle pas prix (bien) | Tarifs 49 / 99 / 199 + essai 14 j |
| « Engagement ? » | Piège abonnement | — | Essai sans engagement, résiliable |
| « Combien de temps pour installer ? » | Weekend / rush | — | < 24 h, config sur *leur* carte |
| « C’est du gadget » | Pas convaincu | Preuve audio en 60–90 s | Sticky CTA essai après preuve |

**Point conversion :** la demo répond aux objections **produit** (qualité commande). Les objections **business** (prix, délai, numéro) se traitent sur `#essai` / `#faq` / `#tarifs` — pas pendant l’appel.

---

## 4. Checklist QA avant de montrer un prospect (10 items)

À cocher **manuellement** (micro + navigateur) juste avant un call prospect ou un envoi de lien :

1. **URL** `/demo-pizza` charge (pas 404), mobile + desktop.
2. **Agent branché** : `NEXT_PUBLIC_BELLA_NAPOLI_AGENT_ID` non vide ; widget démarre sans erreur console.
3. **First message** exact : *« Bonjour, bienvenue chez Bella Napoli. Souhaitez-vous commander à emporter ou en livraison ? »*
4. **Langue 100 % FR** du début à la fin (même si on mélange un mot EN).
5. **Une question / tour** vérifiée sur 5 échanges d’affilée.
6. **Hors carte** : « Regina » → refus + alternative menu (pas d’invention).
7. **Récap** : articles + prix + total + mode avant confirmation.
8. **Latence perçue** acceptable (pas de blancs gênants répétés).
9. **CTA essai** : sticky et/ou lien bas → `/#essai` fonctionnel ; formulaire pizza OK.
10. **Prompts affichés** cohérents avec le menu Bella Napoli (pas de phrases El Bahja / kebab).

Si un item 2–8 échoue → **ne pas envoyer le lien** au prospect.

---

## 5. 3 scripts oraux pour Sofiane (test manuel)

Dire ces phrases **à voix haute** dans le widget `/demo-pizza`. Une passe chacune. Noter : latence, questions multiples, inventions, qualité du récap.

### Script A — Happy path emporter (preuve « ça marche »)

1. « À emporter. »  
2. « Une Margherita. »  
3. « Une seule. »  
4. « Non, c’est tout pour les pizzas. »  
5. « Un Coca. »  
6. « Non, pas de dessert. »  
7. Après récap : « Oui, je confirme. »  
8. « Sofiane. »  
9. « Dans vingt minutes. »  
10. (Si demandé) un mobile FR fictif type `06 12 34 56 78`.

**Succès :** total cohérent (10 + 3 = 13 €), mode emporter, clôture Bella Napoli.

### Script B — Livraison + multi-articles (preuve complexité)

1. « En livraison. »  
2. « 12 rue de la République, Lyon. »  
3. « Une 4 Fromages et un Calzone Classique. »  
4. Clarifier quantités si l’agent demande (1 et 1).  
5. « Non, pas d’autre pizza. »  
6. « Une eau. »  
7. « Un tiramisu. »  
8. Confirmer le récap (14 + 14 + 3 + 6 = 37 €) + adresse.  
9. Prénom + « dès que possible ».

**Succès :** adresse dans le récap / notes ; pas de « sur place » ; noms exacts carte.

### Script C — Stress / anti-invention (preuve contrôle carte)

1. « À emporter. »  
2. « Une Regina large. » → doit **refuser** (hors carte / pas de taille).  
3. « OK, une Orientale alors. »  
4. « Deux. »  
5. « Non. » (pas d’autre)  
6. « Non » aux boissons et desserts.  
7. Pendant le flux, digresser une fois : « Vous êtes ouverts le dimanche ? » → doit **revenir** à l’étape commande.  
8. Confirmer récap (2 × 14 = 28 €) + prénom + heure.

**Succès :** zéro produit inventé, zéro taille inventée, une question à la fois malgré la digression.

---

## Notes ops (hors UI)

- Restaurant ID démo : `b4e11a01-9c2d-4f6a-8e3b-7d5a2c1f0e98`
- Prompt / first message : `scripts/bella-napoli-prompt.mjs`
- Voix cible : Emilie FR (`fBpCO0Kf0krKLYGOu65w`) — alignée El Bahja
- Agent ID : à renseigner après create/patch ElevenLabs (champ actuellement vide dans le script)

**Pour Sofiane :** une session manuelle des 3 scripts suffit avant le premier prospect pizzeria. Si Script C passe, le deal-killer « invente des trucs » est neutralisé.
