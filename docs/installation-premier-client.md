# Installer un nouveau client Ligne, de la signature au premier service

Tutoriel pas à pas. **Pour chaque étape technique, ouvrez une session Claude Code sur ce projet et dites : « On installe [nom du restaurant], on en est à l'étape N ».** Claude fait la configuration avec vous. Comptez environ une demi-journée de travail, réparties sur 24 heures.

---

## Sécurité des comptes restaurants (en place depuis le 13/10/2026)

La connexion à l'écran cuisine et au tableau de bord est vérifiée par le serveur : session dans un cookie signé et protégé. Chaque restaurant ne voit que ses propres commandes et clients. Les mots de passe ne sont plus visibles dans le code du site.

**Une fois, avant le premier client :** dans Vercel, ajoutez `SESSION_SECRET` (une longue suite de caractères au hasard) et `RESTAURANT_ACCOUNTS` (voir étape 5), puis redéployez. Les anciens comptes (`manager` / `1234`, `elbahja` / `bahja1234`) cessent alors de fonctionner.

## Étape 0 — Ce qu'il faut récupérer chez le restaurateur (pendant le rendez-vous)

| Élément | Pourquoi | Format |
|---|---|---|
| **La carte complète** avec les prix | L'agent ne propose que ce qui y figure | PDF, photo nette ou Excel |
| **Options et suppléments** (tailles, bases, sauces, viandes, prix des suppléments) | C'est là que se jouent les erreurs de commande | À noter avec lui, ligne par ligne |
| **Allergènes** des plats | L'agent répond aux questions des clients | Liste ou fiche allergènes |
| **Horaires d'ouverture** et jours de fermeture | L'agent informe les clients en dehors des heures d'ouverture | |
| **Zones et conditions de livraison** (villes, minimum de commande, frais) | | |
| **Temps de préparation moyen** au rush | Il est annoncé au client dans le SMS | En minutes |
| **Numéro de téléphone actuel** et **opérateur** (Orange, Free, SFR, Bouygues, standard Ovh…) | Pour le renvoi d'appel | |
| **La marque de sa caisse** (et de son logiciel de commande en ligne s'il en a un) | Pour savoir si on peut la relier (étape 7) | Nom exact + photo de l'écran |
| **Un écran pour la cuisine** | Les commandes s'y affichent | Tablette, ordinateur ou écran existant, avec un navigateur |
| **Le plan choisi** et son **e-mail** | Paiement et facturation | |

Phrase utile : *« Je configure tout de mon côté. Demain, vous aurez juste à activer le renvoi d'appel. »*

## Étape 1 — Paiement

Le client choisit sa formule sur **ligne-ai.com/#tarifs** et paie par carte. Vous recevez l'e-mail « [LIGNE] Nouvel abonné ».
Le paiement en ligne n'est pas activé ? Suivez d'abord `docs/stripe-mise-en-production.md`.

## Étape 2 — Créer le restaurant et importer la carte (Claude)

1. Claude crée la fiche du restaurant dans la base (nom, téléphone, adresse) et vous donne son **identifiant** (`restaurant_id`).
2. Importez la carte : **ligne-ai.com/settings/menu** (produits, prix, disponibilité). Claude peut convertir le PDF ou la photo de la carte en tableau pour aller plus vite.
3. Vérifiez la carte avec le PDF à télécharger depuis la même page (**Télécharger PDF**).

## Étape 3 — Créer l'agent vocal du restaurant (Claude)

Sur le modèle de Bella Napoli (`scripts/bella-napoli-prompt.mjs` et `scripts/configure-bella-napoli-agent.mjs`), Claude écrit :
- **le texte d'accueil** (« Bonjour, [restaurant], je vous écoute ! ») ;
- **les consignes de l'agent** : carte, options, suppléments, allergènes, horaires, livraison, une seule suggestion par appel, récapitulatif avant validation ;
- **l'outil de commande**, qui envoie chaque commande au restaurant sur l'écran cuisine.

Puis il crée l'agent chez ElevenLabs et vous donne son **identifiant** (`agent_…`).

## Étape 4 — Le numéro de téléphone

Les clients du restaurant continuent d'appeler **le même numéro**.
1. Claude attribue un numéro à l'agent (numéro Twilio importé dans ElevenLabs, `npm run elevenlabs:import-phone`).
2. Le restaurateur active **le renvoi d'appel** de sa ligne vers ce numéro. Deux options :
   - **renvoi permanent** : Ligne répond à tous les appels ;
   - **renvoi sur non-réponse ou sur occupation** (recommandé pour démarrer) : l'équipe décroche quand elle peut, Ligne prend le relais au rush.

   Le réglage se fait dans l'espace client de son opérateur ou depuis le téléphone. Les codes varient selon l'opérateur : cherchez ensemble « renvoi d'appel [opérateur] » sur le site de l'opérateur.

## Étape 5 — L'écran cuisine

1. Créez le compte de connexion du restaurant :
   - choisissez un mot de passe d'au moins 10 caractères, puis calculez son empreinte : `node scripts/hash-password.mjs "le-mot-de-passe"` ;
   - ajoutez le restaurant à la variable Vercel `RESTAURANT_ACCOUNTS` (une liste au format JSON) puis redéployez :
     ```
     [{"loginId":"nom-du-resto","password":"scrypt:…empreinte…","restaurantId":"…","name":"Nom du restaurant","agentId":"agent_…"}]
     ```
   - donnez l'identifiant et le mot de passe au restaurateur, jamais l'empreinte.
   Ensuite, sur la tablette ou l'ordinateur de la cuisine, ouvrez **ligne-ai.com/kitchen** et connectez-vous. La session reste ouverte 30 jours.
2. Ajoutez la page à l'écran d'accueil, avec la luminosité au maximum et la mise en veille désactivée.
3. Montrez le parcours d'une commande : **Nouvelle → Acceptée → En préparation → Prête → Récupérée**.

## Étape 6 — Relier la facturation des minutes (une commande)

Pour que les minutes d'appel soient facturées automatiquement chaque mois :
```
npm run billing:link -- <restaurant_id> <agent_id> <e-mail du client>
```
Le message `✅ … Ses minutes d'appel seront facturées.` confirme que c'est fait.

## Étape 7 — La caisse

Il y a deux cas.

**Cas A — sans connexion à la caisse (le plus simple, fonctionne tout de suite).**
Les commandes arrivent sur l'écran cuisine. L'équipe les prépare directement, puis les encaisse dans sa caisse au moment du retrait, comme une commande prise au comptoir. C'est le fonctionnement de la plupart des restaurants qui démarrent.

**Cas B — avec connexion à la caisse via HubRise (prêt, à tester avec le premier client).**
Ligne sait se brancher à HubRise, un service qui relie de nombreux logiciels de caisse (liste : hubrise.com/fr/apps).
- **Les commandes téléphoniques partent en caisse** : la caisse les reçoit comme les autres et imprime le ticket cuisine.
- **Le temps d'attente annoncé tient compte des autres commandes en cours** (comptoir, web…) que la caisse transmet à HubRise. Certaines caisses n'envoient à HubRise que les commandes en ligne : à vérifier sur la fiche de la caisse chez HubRise.
- Si HubRise ne répond pas, la commande est quand même prise et affichée sur l'écran cuisine.

Mise en place :
1. Vérifiez que **la caisse du restaurant figure sur hubrise.com/fr/apps**. Sinon, demandez à Claude d'étudier l'API de l'éditeur de la caisse, et démarrez en cas A.
2. Le restaurateur crée son compte HubRise (ou utilise le sien) et y connecte sa caisse en suivant la fiche de sa caisse chez HubRise. HubRise est payant pour le restaurateur selon son offre : vérifiez le tarif avec lui.
3. **Une seule fois pour Ligne** : dans votre back-office HubRise → **Developer** → **Create an OAuth 2.0 client**, puis mettez `HUBRISE_CLIENT_ID` et `HUBRISE_CLIENT_SECRET` dans `.env.local`. Exécutez aussi `supabase/hubrise.sql` dans Supabase.
4. Avec le restaurateur : `node scripts/connect-hubrise.mjs <restaurant_id>` → ouvrez le lien affiché, il se connecte à **son** compte HubRise et choisit son point de vente → HubRise affiche un code → `node scripts/connect-hubrise.mjs <restaurant_id> <code>`.
5. Test : passez une commande à l'agent. Elle doit apparaître dans la caisse et le ticket doit sortir en cuisine.

## Étape 7 bis — Imprimer les tickets en cuisine

⚠️ **Aujourd'hui, Ligne n'imprime pas** : les commandes s'affichent uniquement sur l'écran cuisine. Si le restaurateur veut un ticket papier à chaque commande, voici les 3 solutions, de la plus simple à la plus complète. Toutes demandent un développement de la part de Claude, de quelques heures à quelques jours.

| Solution | Comment ça marche | Matériel | Avantages / limites |
|---|---|---|---|
| **1. Impression depuis l'écran cuisine** | Chaque nouvelle commande s'imprime toute seule depuis la tablette ou le PC de la cuisine | Une imprimante ticket (80 mm) reliée à ce PC ou à cette tablette | Le plus rapide à mettre en place (quelques heures). L'écran cuisine doit rester ouvert. Sur tablette, l'impression automatique dépend du modèle d'imprimante : à tester avant de promettre. |
| **2. Imprimante ticket « cloud »** | L'imprimante va chercher elle-même les nouvelles commandes sur Internet, sans ordinateur | Imprimante compatible impression cloud (par exemple les gammes Star « CloudPRNT » ou Epson « Server Direct Print »), branchée en Wi-Fi ou Ethernet | Le plus fiable au quotidien : pas d'écran à laisser ouvert. Il faut acheter le bon modèle (environ 300 à 450 € selon le modèle ; vérifiez la compatibilité avant l'achat). |
| **3. Par la caisse** | Les commandes Ligne entrent dans la caisse, qui imprime les tickets comme pour une commande au comptoir | Celui que le restaurant a déjà | **Prêt via HubRise** (étape 7, cas B) si la caisse y est reliée : aucun développement en plus, la commande est aussi encaissée dans le bon outil. |

**Comment choisir avec le restaurateur :**
- Il a déjà une imprimante cuisine branchée à sa caisse : regardez d'abord la **solution 3**. Si sa caisse n'est pas compatible, la **solution 2**.
- Il n'a pas d'imprimante cuisine : la **solution 2** (achat d'une imprimante cloud), ou la **solution 1** s'il a déjà un PC en cuisine.
- Dans tous les cas, l'écran cuisine marche dès le premier jour pendant qu'on prépare l'impression.

**Ce qu'il faut noter au rendez-vous :** marque et modèle de l'imprimante cuisine existante (étiquette au dos ou en dessous), façon dont elle est branchée (câble USB, réseau, Wi-Fi), et marque de la caisse. Envoyez une photo de l'étiquette à Claude : il dira si elle convient à la solution 1 ou 2.

## Étape 8 — Tests avant la mise en service (30 minutes, avec le restaurateur)

- [ ] Appeler l'ancien numéro du restaurant → c'est l'agent qui répond.
- [ ] Passer **3 commandes** : une simple, une avec suppléments et modifications, une en livraison.
- [ ] Chaque commande apparaît sur l'écran cuisine, avec les bons produits et les bons prix.
- [ ] Le SMS de confirmation arrive sur le portable qui a appelé.
- [ ] Poser une question sur un allergène et sur les horaires → les réponses sont justes.
- [ ] Appeler en dehors des horaires → l'agent applique la consigne prévue.
- [ ] Dans les minutes qui suivent : la ligne de l'appel apparaît dans la table `billed_calls` (Claude vérifie).

## Étape 9 — Le premier service

- Soyez **joignable** pendant le premier service, midi ou soir, et passez si possible.
- Notez chaque erreur de l'agent : produit mal compris, option oubliée, prix. Claude corrige les consignes le soir même.
- Plan B si l'agent ne répond plus : le restaurateur désactive le renvoi d'appel et prend les appels comme avant.

## Étape 10 — Le suivi

- **J+2** : appel rapide (« Ça se passe comment au rush ? »).
- **J+7** : bilan avec le tableau de bord (**ligne-ai.com/dashboard**) : nombre de commandes, panier moyen. Si le client est content, demandez-lui un avis Google (le SMS type est dans `docs/visibilite/fiche-google-business.md`).
- **Fin du 1er mois** : vérifiez la facture Stripe (abonnement + minutes) avant son envoi.
