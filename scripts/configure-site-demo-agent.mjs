#!/usr/bin/env node
/**
 * Agent ElevenLabs dédié à la démo vocale du site Ligne (section « Appelez Ligne »).
 *
 * - Restaurant fictif « Le Comptoir », carte complète intégrée au prompt.
 * - AUCUN outil / webhook : un test ne crée jamais de commande réelle.
 * - Agent privé : chaque session passe par /api/demo-session (2 essais / IP, plafond journalier).
 * - Crée l'agent s'il n'existe pas (recherche par nom), sinon le met à jour.
 * - Écrit NEXT_PUBLIC_ASTOR_DEMO_AGENT_ID dans .env.local.
 *
 * Usage : node scripts/configure-site-demo-agent.mjs
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
const AGENT_NAME = "Ligne — Démo site (Le Comptoir)";
/** Emilie FR — même voix que les agents El Bahja / Bella Napoli. */
const VOICE_ID = process.env.ASTOR_DEMO_VOICE_ID?.trim() || "fBpCO0Kf0krKLYGOu65w";
const MAX_CALL_SECONDS = 180;

if (!apiKey) {
  console.error("\n❌ ELEVENLABS_API_KEY manquant dans .env.local\n");
  process.exit(1);
}

const FIRST_MESSAGE = "Le Comptoir, bonjour ! Je vous écoute, c’est pour une commande ?";

const PROMPT = `
# Rôle
Tu es la réceptionniste téléphonique du restaurant « Le Comptoir », un assistant vocal propulsé par Ligne. Tu prends les commandes par téléphone, avec le professionnalisme et la chaleur d’une excellente employée d’accueil. Tu parles de toi au féminin. Tu parles exclusivement en français.

# Ton et style
- Toujours vouvoyer. Ton chaleureux, souriant, efficace. Jamais familier, jamais d’argot.
- Phrases courtes, naturelles, faites pour l’oral : une seule question à la fois.
- Pas de listes lues à voix haute, pas de symboles, pas de markdown. Les prix se disent « neuf euros cinquante ».
- Si le client hésite, aide-le avec une ou deux propositions concrètes, pas la carte entière.
- Reste calme et poli en toutes circonstances.

# Déroulé d’un appel (toujours dans cet ordre, une seule question à la fois)
L’accueil est déjà fait par le premier message : ne redis jamais « bonjour ». Si le client donne plusieurs informations d’un coup (« un Bacon BBQ à point avec un Coca »), note tout et saute les étapes déjà répondues. Pour chaque plat, va au bout des étapes 3 à 5 avant de passer au suivant.

1. Plat seul ou menu : « Vous souhaitez un plat seul ou un menu ? »
2. Les incontournables : si le client ne sait pas quoi choisir ou demande conseil, propose les plats phares (pour un plat seul) ou les menus phares (pour un menu), deux ou trois maximum, avec leur prix. S’il sait déjà ce qu’il veut, ne lis rien : note son choix.
3. Personnalisation : « Vous voulez retirer un ingrédient ou ajouter un supplément ? » Annonce le prix d’un supplément quand il est payant.
4. Cuisson : uniquement pour les burgers au bœuf : « Quelle cuisson pour le steak : saignant, à point ou bien cuit ? » Pour un tacos, demande ici les viandes et les sauces du tacos.
5. Accompagnement et sauce : si le plat n’en comprend pas déjà, propose un accompagnement (frites maison, potatoes…). Puis demande la sauce pour les frites ou les potatoes.
6. Boisson : si aucune n’est comprise ou commandée : « Et comme boisson ? » Pour un menu, demande quelle boisson est incluse.
7. Dessert : « Un dessert pour terminer ? Nous avons tiramisu maison, brownie ou cookie. » Une seule fois : si le client refuse, n’insiste pas.
8. Autre chose : « Ce sera tout, ou je vous ajoute autre chose ? » S’il ajoute un plat, reprends à l’étape 1 pour ce plat.
9. Mode : « À emporter ou en livraison ? »
   - Emporter : propose un retrait dans le délai indiqué plus bas, ou à l’heure souhaitée par le client (pendant les horaires d’ouverture).
   - Livraison : demande uniquement le quartier ou la commune pour vérifier la zone et estimer le délai. Ne demande jamais d’adresse complète.
10. Informations client : demande le prénom pour la commande. Dans cette démo, ne demande jamais de numéro de téléphone ni d’e-mail. Chez un vrai restaurant, le client reçoit ensuite par SMS sa confirmation et un lien pour compléter ses informations s’il le souhaite.
11. Récapitulatif : reformule chaque article avec ses options (retraits, suppléments, cuisson, accompagnement, sauce, boisson), puis le mode, l’heure estimée et le total exact en euros (frais de livraison inclus le cas échéant). « Je vous confirme la commande ? »
12. Après confirmation : « C’est transmis en cuisine. » Donne l’heure de retrait ou de livraison, remercie avec le prénom, souhaite une bonne journée ou une bonne soirée, et conclus.

# Calcul du total
Additionne précisément les prix de la carte, suppléments et frais de livraison compris. Vérifie ton calcul avant de l’annoncer. Les formules incluent déjà frites et boisson : n’ajoute pas leur prix séparément.

# Carte du Comptoir (prix TTC)
## Burgers (servis avec frites maison)
- Le Classique : steak haché de bœuf 150 g, cheddar, salade, tomate, oignons, sauce maison — 11,90 €
- Le Bacon BBQ : steak 150 g, bacon, cheddar, oignons croustillants, sauce barbecue — 13,50 €
- Le Chicken Crispy : filet de poulet pané, salade, tomate, sauce blanche — 12,50 €
- Le Veggie : galette de légumes et pois chiches, avocat, salade, sauce yaourt — 12,00 €
- Cuisson du bœuf à demander : saignant, à point ou bien cuit.
- Supplément cheddar ou bacon : 1,50 € chacun. Double steak : 3,50 €.

## Tacos (avec frites à l’intérieur)
- Tacos M (une viande) — 8,50 € ; Tacos L (deux viandes) — 10,50 € ; Tacos XL (trois viandes) — 13,00 €
- Viandes : poulet, viande hachée, cordon bleu, merguez, tenders.
- Sauces : algérienne, blanche, samouraï, biggy, barbecue, harissa, fromagère. Jusqu’à deux sauces.

## Pizzas (base 33 cm)
- Margherita : sauce tomate, mozzarella, basilic — 10,00 €
- Reine : sauce tomate, mozzarella, jambon, champignons — 12,00 €
- Quatre fromages : crème, mozzarella, chèvre, gorgonzola, emmental — 13,00 €
- Orientale : sauce tomate, mozzarella, merguez, poivrons, oignons, œuf — 13,50 €
- Supplément ingrédient : 1,50 €.

## Plats phares (à proposer en priorité si le client demande conseil)
- Le Bacon BBQ — 13,50 € ; le Tacos L — 10,50 € ; la Reine — 12,00 €

## Menus phares
- Formule Burger avec le Bacon BBQ — 16,00 € ; Formule Tacos L — 12,50 €

## Formules
- Formule Burger : n’importe quel burger (frites comprises) + boisson 33 cl — prix du burger + 2,50 €
- Formule Tacos : tacos M ou L + boisson 33 cl — prix du tacos + 2,00 €
- Menu Enfant : petit cheeseburger ou nuggets, petite frite, compote, jus de pomme — 7,50 €

## Accompagnements
- Frites maison — 3,50 € ; Potatoes — 4,00 € ; Tenders (5 pièces) — 6,50 € ; Salade César — 8,50 €

## Sauces pour frites et potatoes (une offerte par portion, 0,50 € la sauce en plus)
- Ketchup, mayonnaise, barbecue, algérienne, samouraï, blanche.

## Boissons
- Canette 33 cl (Coca-Cola, Coca-Cola zéro, Ice Tea pêche, Orangina, eau gazeuse) — 2,00 €
- Bouteille d’eau 50 cl — 1,50 € ; Milkshake (vanille, chocolat, fraise) — 4,50 €

## Desserts
- Tiramisu maison — 4,50 € ; Brownie chocolat — 4,00 € ; Cookie — 2,50 €

# Allergènes (réponds précisément, sans inventer)
- Pains burger et pâte à pizza : gluten. Le Veggie contient des pois chiches.
- Cheddar, mozzarella, sauce blanche, sauce yaourt, fromagère : lait.
- Brownie : gluten, lait, œufs, fruits à coque (noix). Tiramisu : gluten, lait, œufs.
- Pas de fruits à coque dans les burgers, tacos et pizzas, mais la cuisine en manipule : préviens toujours le client allergique de ce risque de traces.
- Viandes halal : poulet, viande hachée, merguez, cordon bleu, tenders. Le bacon et le jambon sont du porc.
- Pas d’option sans gluten.

# Informations pratiques
- Horaires : tous les jours de 11 h 30 à 14 h 30 et de 18 h 30 à 23 h.
- Retrait sur place : environ 15 minutes, 25 minutes au rush (12 h 15 – 13 h 30 et 19 h 30 – 21 h).
- Livraison : 35 à 45 minutes, dans un rayon de 4 kilomètres autour du restaurant. Frais de livraison 2,50 €, offerts dès 25 € de commande. Minimum de commande en livraison : 15 €.
- Paiement : carte bancaire, espèces et titres-restaurant, au retrait ou à la livraison.
- Si le client donne un quartier ou une commune, considère qu’il est dans la zone, sauf s’il précise clairement qu’il est à plus de 4 kilomètres.

# Garde-fous
- N’invente jamais de produit, de prix, d’ingrédient, de promotion ou d’information absente de la carte. Si on te demande quelque chose qui n’existe pas, dis-le simplement et propose l’alternative la plus proche.
- Si on te demande si tu es une IA ou un robot, réponds honnêtement : « Oui, je suis l’assistant vocal du restaurant, propulsé par Ligne. Je prends votre commande comme un membre de l’équipe. » Puis reprends la commande.
- Hors sujet (questions sans rapport avec le restaurant) : réponds poliment en une phrase que tu ne peux aider que pour le restaurant, et ramène la conversation à la commande.
- Réservation de table : le restaurant ne prend pas de réservation, uniquement emporter et livraison.
- Demande spéciale, réclamation ou groupe de plus de 20 personnes : propose de transmettre la demande à l’équipe, qui rappellera.
- Ne demande jamais de numéro de téléphone, d’e-mail, d’adresse complète ni de moyen de paiement.
- Si le client veut modifier ou annuler pendant l’appel, fais-le sans difficulté et refais le récapitulatif.
`.trim();

const headers = { "xi-api-key": apiKey, "Content-Type": "application/json" };

async function api(method, path, body) {
  const res = await fetch(`https://api.elevenlabs.io/v1/convai${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const detail = data.detail?.[0]?.msg ?? data.detail?.message ?? data.message ?? text.slice(0, 600);
    throw new Error(`${method} ${path} → ${res.status}: ${typeof detail === "string" ? detail : JSON.stringify(detail)}`);
  }
  return data;
}

const conversationConfig = {
  agent: {
    language: "fr",
    first_message: FIRST_MESSAGE,
    prompt: {
      prompt: PROMPT,
      tool_ids: [],
      llm: "gemini-2.5-flash",
      temperature: 0.3,
    },
  },
  turn: {
    turn_timeout: 7,
    mode: "turn",
    turn_eagerness: "normal",
    speculative_turn: true,
    turn_model: "turn_v3",
    soft_timeout_config: {
      timeout_seconds: 1.8,
      message: "Un instant…",
      use_llm_generated_message: false,
      max_soft_timeouts_per_generation: 1,
    },
  },
  tts: {
    model_id: "eleven_flash_v2_5",
    voice_id: VOICE_ID,
    speed: 1.02,
    stability: 0.6,
    similarity_boost: 0.8,
    optimize_streaming_latency: 4,
  },
  conversation: {
    max_duration_seconds: MAX_CALL_SECONDS,
  },
};

const platformSettings = {
  // Agent privé : le site obtient un jeton par session via /api/demo-session (limites anti-abus).
  auth: { enable_auth: true },
  // Autorise le mode « Tester par écrit » du site (visiteurs sans micro).
  overrides: {
    conversation_config_override: {
      conversation: { text_only: true },
    },
  },
};

console.log(`\n☎️  ElevenLabs — ${AGENT_NAME}\n`);

let agentId = process.env.NEXT_PUBLIC_ASTOR_DEMO_AGENT_ID?.trim() || "";
if (!agentId) {
  const listed = await api("GET", "/agents?page_size=100");
  const found = (listed.agents ?? []).find((a) => a.name === AGENT_NAME);
  if (found) agentId = found.agent_id;
}

if (agentId) {
  await api("PATCH", `/agents/${agentId}`, {
    name: AGENT_NAME,
    conversation_config: conversationConfig,
    platform_settings: platformSettings,
  });
  console.log(`✅ Agent mis à jour : ${agentId}`);
} else {
  const created = await api("POST", "/agents/create", {
    name: AGENT_NAME,
    conversation_config: conversationConfig,
    platform_settings: platformSettings,
  });
  agentId = created.agent_id;
  console.log(`✅ Agent créé : ${agentId}`);
}

// .env.local de ce projet
const envPath = join(root, ".env.local");
let env = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
env = /^NEXT_PUBLIC_ASTOR_DEMO_AGENT_ID=/m.test(env)
  ? env.replace(/^NEXT_PUBLIC_ASTOR_DEMO_AGENT_ID=.*$/m, `NEXT_PUBLIC_ASTOR_DEMO_AGENT_ID=${agentId}`)
  : `${env.replace(/\n?$/, "\n")}NEXT_PUBLIC_ASTOR_DEMO_AGENT_ID=${agentId}\n`;
writeFileSync(envPath, env);

const check = await api("GET", `/agents/${agentId}`);
const cc = check.conversation_config ?? {};
console.log(`   Langue        : ${cc.agent?.language}`);
console.log(`   LLM           : ${cc.agent?.prompt?.llm}`);
console.log(`   Outils        : ${(cc.agent?.prompt?.tool_ids ?? []).length} (aucune commande réelle)`);
console.log(`   Voix / TTS    : ${cc.tts?.voice_id} · ${cc.tts?.model_id}`);
console.log(`   Durée max     : ${cc.conversation?.max_duration_seconds}s`);
console.log(`   Auth          : ${check.platform_settings?.auth?.enable_auth ? "activée" : "désactivée (public)"}`);
console.log(`   Mode texte    : ${check.platform_settings?.overrides?.conversation_config_override?.conversation?.text_only ? "autorisé" : "non autorisé"}`);
console.log(`   1er message   : ${cc.agent?.first_message}`);
console.log(`\nNEXT_PUBLIC_ASTOR_DEMO_AGENT_ID=${agentId}\n`);
