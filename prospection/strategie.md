# Stratégie de prospection (mise à jour par l'Analyste chaque vendredi)

## ⚠️ RÈGLE N°1 POUR TOUTES LES ÉQUIPES — communiquer avec Sofiane (22/10)

Sofiane ne veut plus passer d'une conversation à l'autre. Toute équipe (AOS ①–⑤, Analyste, Prospecteur, Rapporteur, restaurants…) qui a :
- une **question** pour lui,
- une **autorisation** à lui demander,
- une **info importante** (réponse de prospect, erreur, blocage, quota Outlook),

l'écrit dans **prospection/boite-equipes.md** (format indiqué dans le fichier), puis commit + push sur claude/serene-albattani-75cm7k. Ne jamais rester bloqué à attendre une réponse : continuer le reste du travail. Les réponses de Sofiane sont écrites sous la ligne (« → réponse : … ») : relire ce fichier au début de chaque tâche.
Le Veilleur relaie tout dans la conversation principale de Sofiane toutes les 2 h.

**Coordination Outlook (espace Composio partagé « pipe ») :** plusieurs équipes travaillent dans le même espace. Ne jamais écraser les variables ou fichiers d'une autre équipe (préfixer les siens : aos_, resto_, veilleur_), ne jamais supprimer ou modifier un brouillon ou un envoi programmé qu'on n'a pas créé, et vérifier les envois programmés existants (propriété SystemTime 0x3FEF dans les brouillons) avant d'en programmer un nouveau, pour éviter les doublons. Maximum 15 envois par jour, toutes équipes confondues.

## ⚠️ RÈGLE N°2 — chacun son rôle (demande de Sofiane, 22/10)

- **① Cerveau** : COORDONNE. Il décide du plan du jour, répartit le travail, vérifie le compteur (15 mails/jour) et ce qui attend Sofiane. Il ne fait PAS lui-même les recherches sur un prospect (site, Booking, avis, coordonnées) : il les confie au Prospecteur ou au Diagnostiqueur.
- **② Prospecteur** : trouve les prospects, le décideur, son e-mail, et fait les recherches (site, Booking, Google, LinkedIn, Pappers, logiciels).
- **②bis Diagnostiqueur** : chiffre les pertes (méthode chiffrée) et rédige le mail.
- **③ Veille** : surveille les réponses. **④ Analyste** : mesure ce qui marche. **⑤ Compte rendu** : résume pour Sofiane.
- Avant toute recherche ou tout mail, vérifier dans suivi.csv que le prospect n'a pas déjà été traité. Exemple : **Hôtel Saint-Cyr Étoile a déjà reçu son mail le 21/10 à 12 h 27** (après la visite de Sofiane) : ne pas refaire l'étude ni renvoyer de mail, seulement une relance le 28/10 sans réponse.

## Objectif
Entretiens de découverte au nom d'AOS : comprendre les problèmes des hôteliers pour construire UN logiciel unique qui automatise tous leurs process et remplace la multitude de logiciels spécialisés. On ne vend rien : on pose des questions, on veut des réponses et des appels de 10 min. Contrepartie : synthèse anonymisée des entretiens.

## Questions clés
1. Combien de logiciels au quotidien (PMS, channel manager, caisse resto, planning, compta, standard…) et lesquels ne se parlent pas ?
2. Qu'est-ce qui est ressaisi / recoupé à la main, combien de temps par semaine ?
3. Quelles tâches répétitives supprimer (confirmations, factures, relances, appels, mails) ?
4. Qu'avez-vous déjà essayé, qu'est-ce qui a bloqué ?
5. Si un seul outil faisait tout, que devrait-il faire en premier ?
6. La tâche qui vous pèse le plus, à vous.

## Consignes actuelles (17/10, point de départ)
- 23 mails envoyés à des adresses génériques (contact@, info@) : 0 réponse. On privilégie e-mails directs des décideurs, puis LinkedIn (Sofiane envoie), puis appel.
- Signaux chauds en priorité : vues du profil LinkedIn, réseaux/prescripteurs (Cercle LC-2400 Hôtels).
- Test de la semaine : objet « Prénom, 10 minutes de votre avis sur <Établissement> ? » + possibilité de répondre à 1-2 questions par mail.
- Réponses reçues → prospection/entretiens.md (matière pour construire le logiciel).

## Réflexe obligatoire pour CHAQUE prospect (demande de Sofiane, 20/10)
Dès qu'un prospect est cité, sans attendre qu'on le demande :
1. Identifier le vrai décideur (propriétaire / directeur / groupe), via Pappers/societe.com et les mentions légales.
2. Trouver son LinkedIn et son e-mail direct (publié, sinon format du domaine, marqué « déduit »).
3. Lister les autres hôtels du même propriétaire ou groupe.
4. Lire les avis clients (Google, Booking, TripAdvisor) pour repérer les faiblesses récurrentes, et vérifier si la direction y répond.
5. Détecter les logiciels utilisés (moteur de réservation du site, offres d'emploi).
6. Écrire d'abord au décideur. Si son adresse est introuvable, écrire à l'accueil en demandant 10 minutes avec le directeur.

## Méthode chiffrée — OBLIGATOIRE à partir du 21/10 (hôtels ET restaurants, demande de Sofiane)

Fini les mails « 10 minutes de votre avis » sans chiffres. Chaque mail à un prospect doit :

1. **Viser la bonne personne** : celle qui décide de l'outil (DG, COO, directeur des opérations ou du développement). Ne plus demander à quelqu'un de « transmettre » à son patron.
2. **Citer 2-3 faiblesses réelles** relevées sur le prospect (avis clients, nombre de maisons, recrutements, ouvertures, écarts de notes entre établissements).
3. **Chiffrer chaque faiblesse en euros par an**, avec des hypothèses prudentes et visibles (chambres × prix moyen × occupation). Toujours ajouter : « Estimations à partir de données publiques et d'hypothèses prudentes, à confirmer pendant l'audit. »
4. **Donner un total** (« autour de X € par an à récupérer »).
5. **Proposer une solution chiffrée** : ce qu'AOS (ou Ligne) fait concrètement et ce que ça fait gagner.
6. **Dire qu'on connaît le secteur** : « un hôtel, c'est énormément de gestion et de soucis au quotidien, et beaucoup de choses finissent négligées faute de temps ».
7. **Offrir un audit approfondi, gratuit et sans engagement**, avec 2 créneaux en semaine entre 15 h et 17 h 30.
8. **Absents (réponse automatique)** : relancer le jour de leur retour, avec la même méthode.

### Repères de calcul hôtels
- Commissions des plateformes : 15 à 18 % ; chaque tranche de 5 % de nuits ramenées en réservation directe = CA chambres × 5 % × 17 %.
- Ressaisie entre outils : 1 à 2 h par jour et par hôtel × 25-30 € de coût horaire chargé × 365.
- Notes clients : étude Cornell (2012), +1 point sur 5 ≈ +11 % de prix possible sans perte d'occupation.
- Chambres hors service : nuits bloquées × prix moyen.

### Repères de calcul restaurants (Ligne)
- Appels manqués au rush : nombre d'appels manqués par service × panier moyen × jours d'ouverture (ex. 5 appels × 25 € × 26 soirs ≈ 3 250 € par mois).
- Temps au téléphone : minutes par commande × commandes par jour × coût horaire.
- Toujours comparer au prix de Ligne (49 / 99 / 199 € par mois + minutes) pour montrer le retour sur investissement.
