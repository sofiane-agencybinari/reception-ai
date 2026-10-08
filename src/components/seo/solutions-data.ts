/**
 * Pages de référencement « solutions » : une intention de recherche par page.
 * Règle : n'affirmer que ce que Ligne fait réellement (voir PRICING_PLANS et FAQ).
 */

export type SolutionSection = { title: string; body: string[]; list?: string[] };
export type SolutionPage = {
  slug: string;
  /** Libellé court pour les liens internes. */
  label: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  lead: string;
  sections: SolutionSection[];
  faq: { q: string; a: string }[];
};

const STEPS_SECTION: SolutionSection = {
  title: "Mise en place en 24 heures",
  body: [
    "Vous nous transmettez votre carte (PDF, photo ou tableur). Nous configurons l’agent : produits, prix, options, allergènes, horaires et zones de livraison. Votre numéro actuel est renvoyé vers Ligne, ou un numéro dédié vous est attribué.",
    "Dès le lendemain, Ligne décroche. Vous ajustez la carte et les horaires à tout moment depuis le tableau de bord.",
  ],
};

export const SOLUTION_PAGES: SolutionPage[] = [
  {
    slug: "standard-telephonique-restaurant",
    label: "Standard téléphonique IA pour restaurant",
    metaTitle: "Standard téléphonique IA pour restaurant — décroche 24h/24",
    description:
      "Un standard téléphonique IA pour votre restaurant : chaque appel décroché en moins de deux secondes, commandes prises à la voix et envoyées en cuisine, SMS de confirmation au client.",
    keywords: [
      "standard téléphonique restaurant",
      "standard téléphonique IA",
      "standard automatique restaurant",
      "réceptionniste téléphonique restaurant",
      "accueil téléphonique restaurant",
    ],
    eyebrow: "Standard téléphonique IA",
    h1: "Le standard téléphonique de votre restaurant, tenu par une IA.",
    lead: "Ligne répond à chaque appel, 24h/24, avec la voix et les mots d’un employé formé à votre carte. Votre équipe reste en cuisine et au comptoir.",
    sections: [
      {
        title: "Pourquoi un standard téléphonique dédié",
        body: [
          "Dans un restaurant, le téléphone sonne aux mêmes moments que le service : midi, le soir, le week-end. Une ligne classique ne prend qu’un appel à la fois et quelqu’un doit lâcher ce qu’il fait pour décrocher. Les clients qui tombent sur une ligne occupée commandent ailleurs.",
          "Un standard téléphonique IA prend le relais : il décroche immédiatement, plusieurs appels en parallèle, sans mobiliser votre personnel.",
        ],
      },
      {
        title: "Ce que fait Ligne à chaque appel",
        body: ["L’agent mène la conversation de bout en bout, comme un employé :"],
        list: [
          "décroche en moins de deux secondes, de jour comme de nuit ;",
          "présente la carte, les prix et les options, répond sur les ingrédients et les allergènes ;",
          "prend la commande : quantités, suppléments, sauces, emporter ou livraison ;",
          "envoie la commande sur l’écran cuisine et confirme au client par SMS ;",
          "propose une suggestion pertinente, une seule fois, sans insister.",
        ],
      },
      {
        title: "Plusieurs appels en même temps",
        body: [
          "Selon la formule, Ligne gère de 2 à 10 appels simultanés. Les soirs d’affluence, plus personne ne tombe sur la tonalité occupée.",
        ],
      },
      STEPS_SECTION,
    ],
    faq: [
      {
        q: "Puis-je garder mon numéro de téléphone actuel ?",
        a: "Oui. Votre numéro est simplement renvoyé vers Ligne. Vos clients continuent d’appeler le même numéro.",
      },
      {
        q: "Que se passe-t-il si le client pose une question hors de la carte ?",
        a: "Ligne répond à partir des informations que vous avez fournies (horaires, adresse, livraison). Il n’invente jamais un produit ni un prix. Avec la formule Business, l’appel peut être transféré à un membre de l’équipe.",
      },
      {
        q: "Combien coûte un standard téléphonique IA ?",
        a: "Ligne démarre à 49 € par mois, plus les minutes d’appel utilisées. L’abonnement est sans engagement et résiliable chaque mois.",
      },
    ],
  },
  {
    slug: "prise-de-commande-telephone",
    label: "Prise de commande par téléphone automatisée",
    metaTitle: "Prise de commande par téléphone automatisée pour restaurants",
    description:
      "Automatisez la prise de commande par téléphone : l’IA Ligne prend la commande à la voix, l’envoie directement en cuisine et confirme au client par SMS. Plus de ressaisie ni d’erreurs.",
    keywords: [
      "prise de commande téléphone",
      "prise de commande téléphonique automatisée",
      "commande par téléphone restaurant",
      "logiciel prise de commande téléphone",
      "commande vocale IA",
    ],
    eyebrow: "Prise de commande",
    h1: "La commande par téléphone, prise et envoyée en cuisine sans ressaisie.",
    lead: "Fini les post-it illisibles et les numéros mal notés. Ligne prend la commande à la voix et la transmet, complète, à votre équipe.",
    sections: [
      {
        title: "Les limites de la prise de commande à la main",
        body: [
          "Noter une commande au téléphone pendant le service, c’est interrompre la préparation, recopier sur un bon, parfois se tromper de sauce ou de numéro. Chaque erreur coûte un plat refait ou un client mécontent.",
        ],
      },
      {
        title: "Comment Ligne prend la commande",
        body: ["L’agent connaît votre carte et guide le client jusqu’à une commande complète :"],
        list: [
          "produits, tailles, quantités et options, avec les prix de votre carte ;",
          "allergies et demandes particulières notées sur la commande ;",
          "choix emporter ou livraison, avec l’adresse si nécessaire ;",
          "récapitulatif à voix haute avant validation.",
        ],
      },
      {
        title: "Directement sur l’écran cuisine",
        body: [
          "Dès que le client raccroche, la commande apparaît sur l’écran cuisine en temps réel. Le client reçoit un SMS de confirmation. Vous retrouvez l’historique des commandes et des appels dans le tableau de bord, avec export pour la comptabilité.",
        ],
      },
      STEPS_SECTION,
    ],
    faq: [
      {
        q: "Ligne comprend-il les clients qui changent d’avis en cours d’appel ?",
        a: "Oui. Le client peut modifier un produit, une sauce ou une quantité ; l’agent met la commande à jour et la récapitule avant de la valider.",
      },
      {
        q: "Faut-il changer de caisse ou de logiciel ?",
        a: "Non. Les commandes arrivent sur un écran cuisine accessible depuis un navigateur (tablette, ordinateur ou écran existant).",
      },
      {
        q: "Puis-je tester la prise de commande avant de m’abonner ?",
        a: "Oui : une démo est en accès libre sur la page d’accueil. Vous commandez comme un client auprès d’un restaurant fictif.",
      },
    ],
  },
  {
    slug: "appels-manques-restaurant",
    label: "Ne plus manquer d’appels au restaurant",
    metaTitle: "Appels manqués au restaurant : la solution pour ne plus en perdre",
    description:
      "Au rush, chaque appel manqué est une commande perdue. Ligne décroche à votre place 24h/24, jusqu’à 10 appels en même temps, et transforme chaque appel en commande.",
    keywords: [
      "appels manqués restaurant",
      "ne plus rater d'appels restaurant",
      "ligne occupée restaurant",
      "répondeur restaurant",
      "répondeur intelligent restaurant",
    ],
    eyebrow: "Appels manqués",
    h1: "Chaque appel manqué est une commande qui part ailleurs.",
    lead: "Midi pile, la plaque pleine, trois clients au comptoir : le téléphone sonne dans le vide. Ligne décroche à votre place.",
    sections: [
      {
        title: "Pourquoi les restaurants ratent des appels",
        body: [
          "Les appels arrivent précisément quand l’équipe est la plus occupée. Une seule ligne, un seul appel à la fois : les suivants tombent sur la tonalité occupée ou sur un répondeur que personne n’écoute. Un client qui n’obtient pas de réponse rappelle rarement : il commande chez le voisin.",
        ],
      },
      {
        title: "Un répondeur ne suffit pas",
        body: [
          "Un répondeur enregistre un message ; il ne prend pas de commande. Ligne conduit une vraie conversation : il renseigne le client, prend sa commande et l’envoie en cuisine, sans que vous ayez à rappeler.",
        ],
      },
      {
        title: "Ce qui change avec Ligne",
        body: [],
        list: [
          "réponse en moins de deux secondes, 24h/24 ;",
          "jusqu’à 10 appels traités en même temps (formule Business) ;",
          "commandes envoyées en cuisine et confirmées par SMS ;",
          "suivi des appels et des ventes dans le tableau de bord.",
        ],
      },
      STEPS_SECTION,
    ],
    faq: [
      {
        q: "Ligne répond-il aussi en dehors des heures d’ouverture ?",
        a: "Oui. Ligne répond 24h/24. En dehors de vos horaires, il applique vos consignes : informer le client des heures d’ouverture ou prendre une commande à l’avance.",
      },
      {
        q: "Combien de commandes faut-il récupérer pour rentabiliser Ligne ?",
        a: "Avec un abonnement à partir de 49 € par mois, quelques commandes récupérées au rush suffisent généralement à couvrir le coût. L’abonnement est sans engagement.",
      },
    ],
  },
  {
    slug: "pizzeria",
    label: "Agent téléphonique IA pour pizzeria",
    metaTitle: "Prise de commande téléphonique IA pour pizzeria",
    description:
      "Ligne prend les commandes de votre pizzeria par téléphone : tailles, bases, suppléments, demi-demi, emporter ou livraison. Envoi en cuisine et SMS de confirmation, 24h/24.",
    keywords: [
      "commande téléphone pizzeria",
      "logiciel commande pizzeria",
      "IA pizzeria",
      "standard téléphonique pizzeria",
      "prise de commande pizzeria",
    ],
    eyebrow: "Pizzerias",
    h1: "Les commandes de votre pizzeria, prises au téléphone par une IA.",
    lead: "Le vendredi soir, le four tourne et le téléphone ne s’arrête pas. Ligne prend chaque commande pendant que vous enfournez.",
    sections: [
      {
        title: "Une carte de pizzeria, comprise dans le détail",
        body: ["Ligne est configuré sur votre carte exacte :"],
        list: [
          "tailles, bases tomate ou crème, suppléments et retraits d’ingrédients ;",
          "menus, formules et boissons ;",
          "allergènes et ingrédients de chaque pizza ;",
          "emporter avec heure de retrait, ou livraison selon vos zones.",
        ],
      },
      {
        title: "Les soirs de forte affluence",
        body: [
          "Match, week-end, jour de pluie : plusieurs clients appellent en même temps. Ligne prend les appels en parallèle et annonce un délai cohérent avec votre temps de préparation.",
        ],
      },
      {
        title: "Écran cuisine et confirmation client",
        body: [
          "Chaque commande arrive complète sur l’écran cuisine. Le client reçoit un SMS de confirmation : moins d’appels pour vérifier une commande, moins d’erreurs au retrait.",
        ],
      },
      STEPS_SECTION,
    ],
    faq: [
      {
        q: "Ligne gère-t-il les suppléments et les retraits d’ingrédients ?",
        a: "Oui. Le client peut ajouter ou retirer des ingrédients ; l’agent applique les prix des suppléments de votre carte.",
      },
      {
        q: "Peut-on tester sur une carte de pizzeria ?",
        a: "Oui, une démo vocale est accessible sur le site. Nous pouvons ensuite configurer votre propre carte en 24 heures.",
      },
    ],
  },
  {
    slug: "snack-kebab",
    label: "Agent téléphonique IA pour snack et kebab",
    metaTitle: "Commande téléphonique IA pour snack, kebab, tacos et burger",
    description:
      "Snack, kebab, tacos, burger : Ligne décroche au rush, prend la commande (viande, sauces, crudités, menu) et l’envoie en cuisine avec SMS de confirmation au client.",
    keywords: [
      "commande téléphone snack",
      "IA kebab",
      "logiciel commande snack",
      "prise de commande tacos",
      "standard téléphonique fast-food",
    ],
    eyebrow: "Snacks · kebabs · tacos · burgers",
    h1: "Au rush du snack, le téléphone est enfin pris.",
    lead: "Viande, sauces, crudités, menu ou pas : Ligne prend la commande comme votre meilleur employé, pendant que l’équipe sert.",
    sections: [
      {
        title: "Des commandes rapides, mais pleines de détails",
        body: [
          "Dans la restauration rapide, une commande tient en quelques secondes mais comporte beaucoup d’options. Ligne pose les bonnes questions, dans le bon ordre, sans oublier la sauce ni la boisson.",
        ],
        list: [
          "choix de viande, de sauces et de crudités ;",
          "menus avec frites et boisson ;",
          "suppléments facturés selon votre carte ;",
          "emporter ou livraison.",
        ],
      },
      {
        title: "Plus de commandes, sans personnel en plus",
        body: [
          "Ligne prend les appels en parallèle et ne fait jamais attendre le client. Il propose une boisson ou un dessert au bon moment, une seule fois. Vous suivez les ventes réalisées par téléphone dans le tableau de bord.",
        ],
      },
      STEPS_SECTION,
    ],
    faq: [
      {
        q: "Ligne comprend-il les formulations du quotidien ?",
        a: "Oui. Ligne comprend les accents et les façons de commander courantes (« un menu kebab sauce blanche harissa, sans oignons »).",
      },
      {
        q: "Est-ce adapté à un petit snack ?",
        a: "Oui. La formule Essentiel, à 49 € par mois plus les minutes utilisées, est conçue pour les établissements à volume modéré, sans engagement.",
      },
    ],
  },
];

export function getSolution(slug: string) {
  return SOLUTION_PAGES.find((p) => p.slug === slug);
}
