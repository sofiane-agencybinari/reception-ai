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
  { value: "98%", label: "Précision commandes" },
  { value: "<2s", label: "Temps de réponse" },
  { value: "24/7", label: "Disponibilité" },
  { value: "0", label: "Appel manqué" },
] as const;

export const STEPS = [
  {
    num: "01",
    title: "Fini la tonalité occupée",
    subtitle: "Plusieurs appels à la fois",
    text: "Un ou dix clients appellent en même temps : LIGNE répond à chacun. Plus de client qui raccroche parce que la ligne est saturée.",
    tags: ["Appels simultanés", "Réponse immédiate", "Zéro attente"],
    visual: "calls" as const,
  },
  {
    num: "02",
    title: "La commande se prend à la voix",
    subtitle: "Comme un vrai réceptionniste",
    text: "LIGNE comprend les accents, les formules et les modifications. Il propose une boisson ou un dessert au bon moment, et note les allergies.",
    tags: ["Voix naturelle", "Suggestion panier", "Multilingue"],
    visual: "chat" as const,
  },
  {
    num: "03",
    title: "Le bon arrive en cuisine",
    subtitle: "Écran + confirmation client",
    text: "Dès que le client raccroche, la commande s'affiche sur l'écran cuisine. Un SMS de confirmation part au client — sans ressaisie.",
    tags: ["Zéro ressaisie", "SMS client", "Suivi des ventes"],
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
    label: "Téléphone",
    title: "Décrocher, comprendre, encaisser",
    features: [
      {
        icon: Headphones,
        title: "Comprend vos clients",
        text: "Accents, formulations du quotidien, demandes précises — adapté à votre carte.",
      },
      {
        icon: PhoneCall,
        title: "Plusieurs lignes",
        text: "Jusqu'à 10 appels en parallèle. Plus de tonalité occupée au rush.",
      },
      {
        icon: TrendingUp,
        title: "Suggestions panier",
        text: "Boissons et accompagnements proposés au bon moment, sans forcer.",
      },
      {
        icon: UserCheck,
        title: "Relais humain",
        text: "Transfert vers votre équipe pour les cas hors standard.",
      },
    ],
  },
  {
    label: "Opérations",
    title: "Menu, cuisine et caisse",
    features: [
      {
        icon: FileUp,
        title: "Import de carte",
        text: "PDF ou Excel : votre menu vocal est prêt automatiquement.",
      },
      {
        icon: RefreshCw,
        title: "Lien caisse",
        text: "HubRise, Zelty et connecteurs sur demande pour sync menu et stocks.",
      },
      {
        icon: MessageSquare,
        title: "SMS confirmation",
        text: "Numéro de commande, montant et heure de retrait envoyés au client.",
      },
      {
        icon: Zap,
        title: "Installé en 24 h",
        text: "Agent, menu et écran cuisine prêts. Formation équipe incluse.",
      },
    ],
  },
  {
    label: "Pilotage",
    title: "Visibilité et croissance",
    features: [
      {
        icon: BarChart3,
        title: "Ventes & compta",
        text: "CA, top produits, panier moyen — exports CSV pour votre comptable.",
      },
      {
        icon: Users,
        title: "Base clients",
        text: "Historique, préférences et listes pour vos campagnes.",
      },
      {
        icon: Globe,
        title: "Multi-sites",
        text: "Plusieurs restaurants, un tableau de bord : agent et menu par adresse.",
      },
      {
        icon: Shield,
        title: "Hébergé en France",
        text: "Données en UE, RGPD et support en français.",
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
    description: "Pour tester sans risque avec un volume modéré",
    price: 49,
    perMinute: 0.19,
    popular: false,
    features: [
      "1 numéro dédié",
      "2 appels simultanés max",
      "Réception vocale 24h/24",
      "Écran cuisine temps réel",
      "Menu illimité",
      "SMS confirmation client",
      "Support email",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "La solution complète pour établissements actifs",
    price: 99,
    perMinute: 0.17,
    popular: true,
    features: [
      "Tout Essentiel +",
      "4 appels simultanés max",
      "Suivi des ventes & historique",
      "Base clients & export CSV",
      "Suggestions panier",
      "Rapports hebdomadaires",
      "Support prioritaire (4h ouvrées)",
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "Multi-sites, fort volume et personnalisation avancée",
    price: 199,
    perMinute: 0.15,
    popular: false,
    features: [
      "Tout Pro +",
      "1 numéro par restaurant",
      "10 appels simultanés max",
      "Multi-sites & tableau de bord central",
      "Relais humain & transfert",
      "Personnalisation (ton, promos)",
      "Support dédié (<1h ouvrées)",
    ],
  },
] as const;

export const FAQ = [
  {
    q: "Comment fonctionne LIGNE concrètement ?",
    a: "On branche un numéro dédié (ou on renvoie votre ligne actuelle). Quand un client appelle, LIGNE décroche, présente votre menu, prend la commande et l'envoie en cuisine + SMS de confirmation. Vous suivez tout depuis le tableau de bord.",
  },
  {
    q: "Est-ce que ça comprend bien les clients au téléphone ?",
    a: "Oui. LIGNE est réglé sur le vocabulaire de la restauration rapide : accents, modifications, formules, suppléments. En cas de blocage, l'appel peut être transféré à un humain.",
  },
  {
    q: "Combien de temps prend la mise en place ?",
    a: "Moins de 24 h en moyenne : import menu, configuration, branchement téléphonique et formation équipe inclus.",
  },
  {
    q: "Puis-je transférer un appel à un employé ?",
    a: "Oui, dès l'offre Business. LIGNE bascule vers votre équipe pour les demandes hors standard, sans couper l'appel.",
  },
  {
    q: "LIGNE gère-t-il les allergies et demandes spéciales ?",
    a: "Oui : allergies et modifications sont notées dans la commande. Vous pouvez définir des règles (sans gluten, halal, etc.) dans le script vocal.",
  },
  {
    q: "Comment importer ma carte ?",
    a: "PDF, Excel ou saisie directe. Le catalogue vocal est généré automatiquement et mis à jour en temps réel.",
  },
  {
    q: "Faut-il changer de numéro de téléphone ?",
    a: "Non obligatoire. Numéro dédié ou renvoi depuis votre 09/04 existant — les deux fonctionnent.",
  },
  {
    q: "Y a-t-il un engagement ?",
    a: "Aucun. L’abonnement est mensuel et résiliable à tout moment, d’un simple e-mail. Vous pouvez aussi tester l’agent gratuitement sur le site avant de vous abonner.",
  },
  {
    q: "Quels types de restaurants ?",
    a: "Kebab, pizzeria, burger, tacos, snack, traiteur — tout établissement avec commandes à emporter ou sur place par téléphone.",
  },
] as const;

export const COMPARISON = [
  { label: "Appels simultanés", before: "1 seul", after: "Jusqu'à 10" },
  { label: "Temps de réponse", before: "Sonnerie + attente", after: "< 2 secondes" },
  { label: "Saisie cuisine", before: "Manuelle / post-it", after: "Automatique" },
  { label: "SMS confirmation", before: "Rarement", after: "Systématique" },
  { label: "Suivi des ventes", before: "Estimation", after: "Tableau de bord" },
  { label: "Disponibilité", before: "Heures d'ouverture", after: "24h/24" },
] as const;

export const INTEGRATIONS = [
  "HubRise",
  "Twilio",
  "ElevenLabs",
  "Supabase",
  "Zelty",
  "Export CSV",
] as const;
