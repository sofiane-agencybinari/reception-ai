import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  FileUp,
  Globe,
  Headphones,
  MessageSquare,
  PhoneCall,
  RefreshCw,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";

export const RESTAURANT_TYPES = [
  "Kebab",
  "Pizzeria",
  "Burger",
  "Tacos",
  "Sandwich",
  "Asiatique",
  "Sushi",
  "Fast-food",
  "Grill",
  "Traiteur",
  "Naan",
  "Wings",
  "Poke",
  "Wrap",
  "Döner",
] as const;

export const HERO_STATS = [
  { value: "98%", label: "Precision commandes" },
  { value: "<2s", label: "Temps de reponse" },
  { value: "24/7", label: "Disponibilite" },
  { value: "0", label: "Appel manque" },
] as const;

export const STEPS = [
  {
    num: "01",
    title: "Fini la tonalite occupee",
    subtitle: "Multi-ligne intelligente",
    text: "Un ou dix clients appellent en meme temps : ASTOR gere chaque appel en parallele. Plus jamais de client raccroche par impatience.",
    tags: ["Appels simultanes", "Reponse immediate", "Zero attente"],
    visual: "calls" as const,
  },
  {
    num: "02",
    title: "L'IA prend la commande",
    subtitle: "Conversation naturelle",
    text: "Comprehension des accents, du slang resto et des demandes complexes. Upsell boisson/dessert, gestion des allergies et modifications.",
    tags: ["Voix naturelle", "Upsell intelligent", "Multilingue"],
    visual: "chat" as const,
  },
  {
    num: "03",
    title: "Transmission instantanee",
    subtitle: "Cuisine + pilotage",
    text: "Des que le client raccroche, le bon arrive sur l'ecran cuisine. SMS de confirmation, dashboard analytics et export compta inclus.",
    tags: ["Zero ressaisie", "SMS client", "Analytics"],
    visual: "order" as const,
  },
] as const;

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export type FeatureGroup = {
  label: string;
  title: string;
  features: FeatureItem[];
};

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    label: "Telephone & voix",
    title: "Decrocher, comprendre, convertir",
    features: [
      {
        icon: Headphones,
        title: "Comprehension vocale avancee",
        text: "Accents, slang resto et demandes complexes — l'IA s'adapte a votre carte.",
      },
      {
        icon: PhoneCall,
        title: "Multi-ligne",
        text: "Jusqu'a 10 appels en parallele. Zero tonalite occupee pendant le rush.",
      },
      {
        icon: TrendingUp,
        title: "Upsell intelligent",
        text: "Boissons et accompagnements suggeres au bon moment, sans forcer.",
      },
      {
        icon: UserCheck,
        title: "Relais humain",
        text: "Transfert vers votre equipe pour les cas hors standard.",
      },
    ],
  },
  {
    label: "Operations",
    title: "Menu, cuisine et caisse",
    features: [
      {
        icon: FileUp,
        title: "Import de carte",
        text: "PDF ou Excel : votre catalogue vocal est genere automatiquement.",
      },
      {
        icon: RefreshCw,
        title: "Integration caisse",
        text: "HubRise, Zelty et connecteurs sur demande pour sync menu et stocks.",
      },
      {
        icon: MessageSquare,
        title: "SMS confirmation",
        text: "Numero de commande, montant et heure de retrait envoyes au client.",
      },
      {
        icon: Zap,
        title: "Installation 24h",
        text: "Agent, menu et ecran cuisine prets. Formation equipe incluse.",
      },
    ],
  },
  {
    label: "Pilotage",
    title: "Visibilite et croissance",
    features: [
      {
        icon: BarChart3,
        title: "Analytics & compta",
        text: "CA, top produits, panier moyen — exports CSV pour votre comptable.",
      },
      {
        icon: Users,
        title: "Base clients",
        text: "Historique, preferences et segmentation pour vos campagnes.",
      },
      {
        icon: Globe,
        title: "Multi-sites",
        text: "Plusieurs restaurants, un dashboard : agent et menu par etablissement.",
      },
      {
        icon: Shield,
        title: "Heberge en France",
        text: "Donnees en UE, RGPD et support en francais.",
      },
    ],
  },
];

/** @deprecated Use FEATURE_GROUPS — kept for backwards compatibility */
export const FEATURES: FeatureItem[] = FEATURE_GROUPS.flatMap((g) => g.features);

export const PRICING_PLANS = [
  {
    id: "essentiel",
    name: "Essentiel",
    description: "Pour tester sans risque avec un volume modere",
    price: 49,
    perMinute: 0.19,
    popular: false,
    features: [
      "1 numero dedie",
      "2 appels simultanes max",
      "IA vocale 24h/24",
      "Ecran cuisine temps reel",
      "Menu illimite",
      "SMS confirmation client",
      "Support email",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "La solution complete pour etablissements actifs",
    price: 99,
    perMinute: 0.17,
    popular: true,
    features: [
      "Tout Essentiel +",
      "4 appels simultanes max",
      "Analytics & historique appels",
      "Base clients & export CSV",
      "Upsell intelligent",
      "Rapports hebdomadaires",
      "Support prioritaire (4h ouvrées)",
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "Multi-sites, fort volume et personnalisation avancee",
    price: 199,
    perMinute: 0.15,
    popular: false,
    features: [
      "Tout Pro +",
      "1 numero par restaurant",
      "10 appels simultanes max",
      "Multi-sites & dashboard central",
      "Relais humain & transfert",
      "Personnalisation IA (ton, promos)",
      "Support dedie (<1h ouvrées)",
    ],
  },
] as const;

export const FAQ = [
  {
    q: "Comment fonctionne ASTOR concretement ?",
    a: "On branche un numero dedie (ou votre ligne existante via renvoi). Quand un client appelle, l'IA decroche, presente votre menu, prend la commande et l'envoie en cuisine + SMS de confirmation. Vous pilotez tout depuis le dashboard.",
  },
  {
    q: "L'IA comprend-elle bien les clients au telephone ?",
    a: "Oui. ASTOR est entraine sur le vocabulaire restauration rapide : accents, modifications, formules, supplements. En cas de blocage, l'appel peut etre transfere a un humain.",
  },
  {
    q: "Combien de temps prend la mise en place ?",
    a: "Moins de 24h en moyenne : import menu, configuration agent, branchement telephonique et formation equipe incluse.",
  },
  {
    q: "Puis-je transferer un appel a un employe ?",
    a: "Oui, des l'offre Business. L'IA bascule vers votre equipe pour les demandes hors standard sans couper l'appel.",
  },
  {
    q: "ASTOR gere-t-il les allergies et demandes speciales ?",
    a: "L'agent note les allergies et modifications dans la commande. Vous pouvez definir des regles (sans gluten, halal, etc.) dans le script vocal.",
  },
  {
    q: "Comment importer ma carte ?",
    a: "PDF, Excel ou saisie directe dans le cockpit. L'IA genere automatiquement le catalogue vocal et le met a jour en temps reel.",
  },
  {
    q: "Faut-il changer de numero de telephone ?",
    a: "Non obligatoire. Numero dedie Twilio ou renvoi depuis votre 09/04 existant — les deux fonctionnent.",
  },
  {
    q: "Y a-t-il un engagement ?",
    a: "Essai gratuit 2 semaines sans engagement. Ensuite abonnement mensuel, resiliatable a tout moment.",
  },
  {
    q: "Quels types de restaurants ?",
    a: "Kebab, pizzeria, burger, tacos, snack, traiteur — tout etablissement avec commandes a emporter ou sur place par telephone.",
  },
] as const;

export const COMPARISON = [
  { label: "Appels simultanes", before: "1 seul", after: "Jusqu'a 10" },
  { label: "Temps de reponse", before: "Sonnerie + attente", after: "< 2 secondes" },
  { label: "Saisie cuisine", before: "Manuelle / post-it", after: "Automatique" },
  { label: "SMS confirmation", before: "Rarement", after: "Systematique" },
  { label: "Suivi des ventes", before: "Estimation", after: "Dashboard precis" },
  { label: "Disponibilite", before: "Heures d'ouverture", after: "24h/24" },
] as const;

export const INTEGRATIONS = [
  "HubRise",
  "Twilio",
  "ElevenLabs",
  "Supabase",
  "Zelty",
  "Export CSV",
] as const;
