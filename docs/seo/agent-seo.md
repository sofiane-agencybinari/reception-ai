# Agent SEO Ligne — cahier des charges

Cet agent publie un guide (article) tous les lundis et jeudis, et vérifie la santé SEO du site.
Le site cible les restaurateurs français (snacks, kebabs, pizzerias, burgers, tacos, restaurants avec vente à emporter/livraison par téléphone).

## Règles éditoriales (non négociables)

- Français professionnel, vouvoiement, phrases claires. Aucun argot, aucun tutoiement, aucun émoji.
- N'affirmer que ce que Ligne fait réellement :
  - décroche en moins de 2 s, 24h/24 ;
  - 2/4/10 appels simultanés selon la formule (Essentiel/Pro/Business) ;
  - prise de commande à la voix ;
  - écran cuisine en temps réel ;
  - SMS de confirmation ;
  - tableau de bord avec export ;
  - installation en 24 h ;
  - sans engagement ;
  - 49/99/199 € par mois + minutes (0,19/0,17/0,15 €) ;
  - transfert humain en Business ;
  - démo vocale en libre accès sur le site (/#essai).
- Interdits :
  - les chiffres inventés présentés comme des faits (statistiques, nombre de clients, avis, témoignages) ; un exemple de calcul doit être présenté comme un exemple ;
  - l'« essai gratuit » ;
  - le nom « Astor » ;
  - les superlatifs non prouvables (« n°1 »).
- Contenu réellement utile au restaurateur d'abord, Ligne ensuite. Dans l'article, Ligne n'apparaît en solution que dans la ou les dernières sections.
- Une seule intention de recherche par article. Ne jamais reprendre un sujet déjà publié : vérifier `src/content/guides/` et le journal.

## Format d'un guide

Créer un fichier `src/content/guides/<slug>.json`, sur le modèle de `combien-coute-un-appel-manque-restaurant.json`.

- `slug` : en minuscules avec des tirets, sans accents ; identique au nom du fichier.
- `title` : le titre H1, naturel et formulé comme une question ou une promesse concrète.
- `metaTitle` : 65 caractères maximum, avec le mot-clé principal au début.
- `description` : entre 110 et 165 caractères, avec le mot-clé et un bénéfice.
- `keywords` : de 3 à 6 mots-clés.
- `published` : la date du jour (AAAA-MM-JJ).
- `lead`, puis au moins 4 `sections` (`title` = H2 contenant des variantes du mot-clé ; `body` = paragraphes ; `list` = optionnelle).
- `faq` : 2 à 4 questions réellement posées par les restaurateurs.
- `related` : 1 ou 2 slugs parmi les pages /solutions :
  - `standard-telephonique-restaurant`
  - `prise-de-commande-telephone`
  - `appels-manques-restaurant`
  - `pizzeria`
  - `snack-kebab`
- Longueur : entre 800 et 1 300 mots. Le script refuse tout guide sous 600 mots.

## Procédure de chaque exécution

1. `cd "/Users/aokache/Desktop/agent receptionniste /reception-ai-immersive"`, puis `git checkout immersive` et `git pull --ff-only origin immersive`.
2. Lire ce fichier, `docs/seo/journal.md` et la liste des guides existants.
3. Choisir le prochain sujet non traité dans le **plan éditorial** ci-dessous. Si une recherche web est disponible, vérifier rapidement les questions et les résultats Google sur ce sujet pour couvrir ce que les concurrents oublient.
4. Rédiger le guide (JSON).
5. Le lundi uniquement, faire le maillage :
   - ajouter, si c'est pertinent, une question à la FAQ de la page /solutions la plus liée (`src/components/seo/solutions-data.ts`) ;
   - ou améliorer un guide ancien, en ajoutant une section et en mettant `updated` à la date du jour.
6. Contrôles, qui doivent tous passer :
   - `node scripts/check-guides.mjs`
   - `npx tsc --noEmit`
   - `npx next build`
7. Publier :
   - `git add -A`
   - `git commit -m "SEO : guide <titre>"`, avec la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
   - `git push origin immersive`
   - `git push origin immersive:main`
8. Après environ 3 minutes, vérifier en production que `<SITE>/guides/<slug>` répond 200 et figure dans `<SITE>/sitemap.xml`. `<SITE>` correspond à `NEXT_PUBLIC_APP_URL`, ou par défaut https://reception-ai-zeta.vercel.app.
9. Ajouter une ligne à `docs/seo/journal.md` (date, slug, mot-clé, statut), puis commit et push de la même façon.
10. En cas d'échec d'un contrôle :
    - ne rien publier ;
    - annuler les changements locaux ;
    - consigner l'erreur dans le journal ;
    - s'arrêter.

Ne jamais modifier autre chose que les guides, la FAQ des solutions et le journal. Ne jamais toucher aux fichiers `.env*`, aux paiements ni aux API.

## Plan éditorial (prendre dans l'ordre, cocher dans le journal)

1. Comment ne plus rater d'appels pendant le rush de midi
2. Répondeur, standard ou agent vocal IA : que choisir pour un restaurant ?
3. Prise de commande par téléphone : les 7 erreurs qui coûtent cher
4. Comment organiser la vente à emporter par téléphone dans une pizzeria
5. Snack et kebab : accélérer les commandes téléphoniques au rush
6. Livraison en direct ou plateformes : reprendre la main sur ses commandes
7. Commissions des plateformes de livraison : combien elles coûtent vraiment (méthode de calcul)
8. Allergènes : quelles obligations d'information pour les commandes par téléphone ?
9. Agent vocal IA pour restaurant : comment ça marche, concrètement
10. Comment rédiger une carte claire, compréhensible au téléphone
11. Écran cuisine (KDS) : pourquoi en finir avec les bons papier
12. SMS de confirmation de commande : bonnes pratiques pour un restaurant
13. Renvoi d'appel : comment garder son numéro et automatiser la réponse
14. Recruter pour le téléphone ou automatiser ? Comparatif des coûts
15. Soirs de match : préparer son restaurant à l'afflux d'appels
16. Augmenter le panier moyen par téléphone sans paraître insistant
17. Fidéliser les clients qui commandent par téléphone
18. RGPD : données clients et commandes téléphoniques au restaurant
19. Tacos et burgers : gérer les options et suppléments sans erreur
20. Ouvrir une dark kitchen : le téléphone reste-t-il utile ?
21. IA dans la restauration rapide : usages concrets en 2026
22. Comment mesurer le taux de décroché de son restaurant
23. Horaires, fermetures exceptionnelles : informer les clients qui appellent
24. Restaurant multi-sites : centraliser les appels et les commandes
25. Que dit un bon accueil téléphonique au restaurant ? (script type)
26. Commande à l'avance : programmer les retraits pour lisser le rush
27. Pizzeria : réduire les erreurs de commande (tailles, bases, suppléments)
28. Petits restaurants : automatiser sans perdre le contact humain
29. Checklist : préparer son restaurant à un agent téléphonique IA
30. Ligne ou standard classique : comparatif détaillé pour restaurateurs

Une fois le plan épuisé, proposer 10 nouveaux sujets dans le journal (longue traîne, villes : « standard téléphonique restaurant Paris/Lyon/Marseille… » seulement si le contenu est réellement adapté à la ville) et continuer.
