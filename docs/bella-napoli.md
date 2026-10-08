# Bella Napoli — démo pizzeria ASTOR

Agent vocal ElevenLabs ConvAI pour le vertical **pizzeria** (prospects /demo-pizza).

## Identifiants

| Clé | Valeur |
| --- | --- |
| Agent ID | Voir `NEXT_PUBLIC_BELLA_NAPOLI_AGENT_ID` dans `.env.local` (aussi dans `scripts/bella-napoli-prompt.mjs`) |
| Restaurant ID | `b4e11a01-9c2d-4f6a-8e3b-7d5a2c1f0e98` |
| Voix | Emilie FR `fBpCO0Kf0krKLYGOu65w` |
| TTS | `eleven_flash_v2_5` |
| LLM | `gemini-2.5-flash` |
| Webhook | `POST /api/orders/from-call` via outil `create_order_webhook` |

## Menu (limité — anti-hallucination)

**Base tomate :** Margherita 10€ · Napolitaine 13€ · 4 Fromages 14€ · Orientale 14€ · Jambon Blanc 13€ · Parme 15€ · Végétarienne 13€

**Base crème :** Chèvre Miel 12€ · Savoyarde 13€ · Saumon 15€

**Calzones :** Classique 14€ · Végé 13€

**Desserts :** Tiramisu 6€ · Panna Cotta 6€

**Softs :** Coca / Coca Zero / Eau 3€

Une seule taille (standard). Modes : **emporter** ou **livraison** (pas sur place).

## Flux voix (1 question / tour)

1. Accueil + emporter ou livraison  
2. Si livraison → adresse courte  
3. Pizza / calzone (nom carte)  
4. Quantité  
5. Autre pizza ?  
6. Boisson ?  
7. Dessert ?  
8. Récap + total  
9. Confirmer oui  
10. Prénom  
11. Heure  
12. Téléphone si manquant  
13. `create_order_webhook` **une fois**  
14. Closing  

## Scripts npm

```bash
npm run elevenlabs:configure-bella-napoli          # create/reuse + PATCH + publish
npm run elevenlabs:configure-bella-napoli-webhook  # outil webhook dédié (optionnel)
```

Écrit `NEXT_PUBLIC_BELLA_NAPOLI_AGENT_ID` dans `.env.local`.

## Test UI

1. `npm run dev`
2. Ouvrir [http://localhost:3000/demo-pizza](http://localhost:3000/demo-pizza)
3. Micro → phrases suggérées (emporter + Margherita + Coca)

Lien croisé depuis `/demo` (grillades El Bahja).

## Token budget ElevenLabs

- Config API seulement (create/patch/deploy) — **pas** de tests conversation API, **pas** de TTS en boucle.
- Réutilise Emilie + flash comme El Bahja.
- Un outil webhook dédié avec `restaurantId` constant Bella Napoli.
