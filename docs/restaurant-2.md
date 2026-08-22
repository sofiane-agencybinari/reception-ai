# El Bahja — agent ASTOR

## Identifiants

| Element | Valeur |
|---------|--------|
| Restaurant ID | `fe397713-e62b-40a5-a26f-e094c9034e44` |
| Nom | El Bahja |
| Adresse | 63 avenue de Palavas, 34070 Montpellier |
| Telephone | +33951183756 (09 51 18 37 56) |
| Agent ElevenLabs | `agent_6001m0jmjg8ye0rsrsqfwac6323e` |
| Voix | Emilie (FR) |
| Outil webhook | `tool_3701m0jmh19ee8ft711karppyfwy` |
| Menu | 71 produits en base |

## Flux commande

1. Emporter ou sur place
2. Sandwich (emporter only) ou Assiette
3. Details (viande, sauce, seul/formule, supplements…)
4. Accompagnements → boissons → desserts
5. Recap + confirmation + prenom + heure
6. Webhook commande

## Cockpit web

| Restaurant | Identifiant | Mot de passe |
|------------|-------------|--------------|
| Restaurant Pilote | `manager` | `1234` |
| **El Bahja** | `elbahja` | `bahja1234` |

Connexion : https://reception-ai-zeta.vercel.app/login

Chaque compte ouvre le cockpit filtre (cuisine, menu, clients, analytics, agent vocal).

## Manque encore

- Numero Twilio dedie a brancher sur cet agent

## Test

ElevenLabs → agent **El Bahja Reception** → Test conversation.
PDF menu : `/api/menu-items/pdf?restaurantId=fe397713-e62b-40a5-a26f-e094c9034e44`
