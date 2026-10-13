/**
 * Pour que l'agent sonne comme un vrai employé au téléphone :
 * 1) SPOKEN_STYLE_PROMPT : consignes d'oral à ajouter au prompt de chaque agent ;
 * 2) un dictionnaire de prononciation ElevenLabs, appliqué par la voix elle-même :
 *    même si l'agent écrit « BBQ », la voix dit « barbecue ».
 * Ajouter ici tout mot de carte mal prononcé (abréviations, anglicismes) : les règles valent pour tous les agents.
 */

/** Écrit tel quel → prononcé. Uniquement des mots entiers sans ambiguïté (jamais « M », « cl »…). */
export const PRONUNCIATION_RULES = [
  ["BBQ", "barbecue"],
  ["Bbq", "barbecue"],
  ["bbq", "barbecue"],
  ["XXL", "ixe ixe elle"],
  ["XL", "ixe elle"],
  ["Ice Tea", "aïce ti"],
  ["Milkshake", "milk-chèque"],
  ["milkshake", "milk-chèque"],
  ["Potatoes", "potatesse"],
  ["potatoes", "potatesse"],
  ["Tenders", "tèndeurse"],
  ["tenders", "tèndeurse"],
  ["Chicken", "tchikène"],
  ["Crispy", "crispi"],
  ["Veggie", "védji"],
  ["Cookie", "couki"],
  ["cookie", "couki"],
  ["Brownie", "brauni"],
  ["brownie", "brauni"],
  ["Nuggets", "neuguétse"],
  ["nuggets", "neuguétse"],
  ["Cheeseburger", "tchizeburgueur"],
  ["cheeseburger", "tchizeburgueur"],
  ["Biggy", "bigui"],
  ["Coca-Cola zéro", "coca zéro"],
  ["Coca-Cola", "coca"],
];

export const SPOKEN_STYLE_PROMPT = `
# Parler comme un vrai employé au téléphone
Le client doit avoir l’impression de parler à une personne de l’équipe. Tout ce que tu écris est lu à voix haute.
- Abréviations et sigles de la carte : dis toujours le mot complet. BBQ se dit « barbecue », 33 cl se dit « trente-trois centilitres », 150 g se dit « cent cinquante grammes », 4 km se dit « quatre kilomètres ». Ne dis jamais une abréviation lettre par lettre.
- Prix : en toutes lettres, comme à l’oral : « onze euros quatre-vingt-dix », « deux euros », « treize euros cinquante ». Jamais de symbole €, jamais « virgule ».
- Heures : « dix-neuf heures quarante-cinq » ou « vingt heures moins le quart », « midi et quart », « dans vingt minutes environ ». Jamais « 19 h 45 » écrit.
- Noms de plats : dis-les naturellement, sans lire la description entière ; ne détaille les ingrédients que si le client le demande.
- Varie tes acquiescements : « parfait », « très bien », « c’est noté », « d’accord », « ça marche ». Ne répète pas toute la phrase du client à chaque fois : le récapitulatif complet se fait une seule fois, à la fin.
- Phrases courtes, une idée par phrase, une seule question à la fois. Jamais de liste numérotée, jamais « premièrement », jamais de puces ni de symboles.
- Utilise le prénom du client une ou deux fois au maximum, pas à chaque phrase.
- Si le client te coupe la parole, arrête-toi et réponds à ce qu’il vient de dire.
- Si tu n’as pas compris, dis-le simplement : « Pardon, je n’ai pas bien entendu, vous pouvez répéter ? »
- Ne dis jamais « en tant qu’assistant », ni que tu « traites une demande ». Parle comme quelqu’un derrière un comptoir.
`.trim();

/**
 * Crée ou met à jour le dictionnaire de prononciation partagé et renvoie le « locator » à mettre dans
 * conversation_config.tts.pronunciation_dictionary_locators.
 */
export async function ensurePronunciationDictionary(apiKey) {
  const NAME = "Ligne — prononciation restauration (FR)";
  const headers = { "xi-api-key": apiKey, "Content-Type": "application/json" };
  const rules = PRONUNCIATION_RULES.map(([string_to_replace, alias]) => ({ type: "alias", string_to_replace, alias }));
  const call = async (method, path, body) => {
    const res = await fetch(`https://api.elevenlabs.io/v1${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(data).slice(0, 400)}`);
    return data;
  };

  const listed = await call("GET", "/pronunciation-dictionaries?page_size=100");
  const existing = (listed.pronunciation_dictionaries ?? []).find((d) => d.name === NAME);
  const dict = existing
    ? await call("POST", `/pronunciation-dictionaries/${existing.id}/set-rules`, { rules })
    : await call("POST", "/pronunciation-dictionaries/add-from-rules", { name: NAME, rules });
  console.log(`🗣️  Dictionnaire de prononciation ${existing ? "mis à jour" : "créé"} : ${dict.version_rules_num ?? rules.length} règles`);
  return { pronunciation_dictionary_id: dict.id, version_id: dict.version_id };
}
