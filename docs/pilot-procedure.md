# Procedure pilote (restaurant)

## 1) Preparation avant ouverture
- Verifier que l'interface cuisine charge sur la tablette.
- Passer un appel test vers l'agent ElevenLabs.
- Confirmer que la commande apparait sur `/kitchen`.

## 2) Procedure pendant service
- Statuts a respecter: `new` -> `accepted` -> `preparing` -> `ready` -> `picked_up`.
- Si commande invalide, passer en `cancelled` et noter la raison.
- Garder un responsable de supervision sur le dashboard.

## 3) Test de bout en bout quotidien
- 2 appels de test (midi + soir).
- Verifier creation commande, transition statuts, affichage historique.
- Noter les erreurs de transcription dans un fichier de suivi.

## 4) Procedure incident
- Si l'API est indisponible: basculer temporairement sur prise manuelle.
- Si l'agent vocal se trompe: confirmer oralement la commande avec le client.
- Rejouer les appels de test apres correction.

## 5) KPIs de la semaine pilote
- Nombre total de commandes vocales.
- Delai moyen `new` -> `ready`.
- Taux d'annulation.
- Panier moyen.
