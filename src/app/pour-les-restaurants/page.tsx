import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Headphones, PhoneMissed, Sparkles, Utensils } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { JsonLd } from "@/components/seo/json-ld";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://reception-ai-zeta.vercel.app";

export const metadata: Metadata = {
  title: "Réceptionniste téléphonique IA pour restaurants",
  description:
    "Appels manqués, file d’attente, commandes perdues : LIGNE est le réceptionniste téléphonique IA qui décroche 24h/24 pour votre restaurant. Découvrez comment ça marche.",
  keywords: [
    "réceptionniste téléphonique restaurant",
    "réceptionniste téléphonique IA",
    "appels manqués restaurant",
    "agent vocal restauration",
    "prise de commande téléphone IA",
    "standard automatique restaurant",
  ],
  alternates: {
    canonical: "/pour-les-restaurants",
  },
  openGraph: {
    title: "Réceptionniste téléphonique IA pour restaurants | LIGNE",
    description:
      "Ne ratez plus les appels de commande. LIGNE décroche, prend la commande et l’envoie en cuisine — 24h/24.",
    url: `${SITE_URL}/pour-les-restaurants`,
    type: "article",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Réceptionniste téléphonique IA pour restaurants | LIGNE",
    description:
      "L’IA qui répond au téléphone de votre restaurant et transforme chaque appel en commande.",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Réceptionniste téléphonique IA pour restaurants — LIGNE",
  description:
    "Comment un agent vocal IA remplace les appels manqués et automatise la prise de commande au téléphone.",
  inLanguage: "fr-FR",
  mainEntityOfPage: `${SITE_URL}/pour-les-restaurants`,
  author: {
    "@type": "Organization",
    name: "LIGNE",
    url: SITE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "LIGNE",
    url: SITE_URL,
  },
};

export default function PourLesRestaurantsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd extra={articleSchema} />
      <div className="marketing-grid pointer-events-none fixed inset-0 opacity-30" />
      <MarketingHeader />

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-28 sm:pt-32">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
          Pour les restaurants
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Réceptionniste téléphonique IA : ne ratez plus aucun appel
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-zinc-400">
          Chaque coup de fil manqué, c’est une commande qui part chez le concurrent. LIGNE
          est le réceptionniste téléphonique intelligent conçu pour la restauration
          française : il décroche, comprend le menu, prend la commande et la transmet en
          cuisine — jour et nuit.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full bg-astor-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-astor-accent-soft"
          >
            <Headphones className="h-4 w-4" />
            Essayer la démo vocale
          </Link>
          <Link
            href="/#tarifs"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-astor-accent/40 hover:text-white"
          >
            Voir les tarifs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <section className="mt-16 space-y-5">
          <div className="flex items-center gap-3 text-astor-warm">
            <PhoneMissed className="h-5 w-5" />
            <h2 className="font-display text-2xl font-semibold text-white">
              Le problème : les appels que personne ne décroche
            </h2>
          </div>
          <p className="leading-relaxed text-zinc-400">
            Aux heures de pointe, l’équipe est en salle ou en cuisine. Le téléphone sonne —
            une, deux, trois fois — puis le client raccroche. Selon les retours terrain,
            beaucoup de snacks, kebabs, pizzerias et fast-foods perdent une part réelle de
            leur chiffre d’affaires téléphonique simplement faute de bras pour répondre.
            Embaucher un réceptionniste à temps plein coûte cher ; laisser les appels
            sonner dans le vide coûte encore plus cher.
          </p>
          <p className="leading-relaxed text-zinc-400">
            Les réservations mal notées, les commandes à emporter confondues, les sauces
            oubliées : le téléphone reste un canal fragile. Pourtant, pour une majorité de
            clients, appeler reste le réflexe le plus rapide — surtout le soir, le week-end,
            et quand ils sont déjà en voiture.
          </p>
        </section>

        <section className="mt-14 space-y-5">
          <div className="flex items-center gap-3 text-astor-accent-soft">
            <Sparkles className="h-5 w-5" />
            <h2 className="font-display text-2xl font-semibold text-white">
              La solution : LIGNE, votre agent vocal restaurant
            </h2>
          </div>
          <p className="leading-relaxed text-zinc-400">
            LIGNE est un réceptionniste téléphonique IA dédié aux restaurants. Dès qu’un
            client appelle votre numéro, l’agent vocal répond avec une voix naturelle,
            présente le service (à emporter, sur place, livraison selon votre config) et
            guide la commande produit par produit : sandwichs, assiettes, formules, extras,
            sauces, boissons.
          </p>
          <p className="leading-relaxed text-zinc-400">
            Contrairement à un simple répondeur ou à un standard générique, LIGNE connaît
            votre carte, vos prix et vos règles métier. Il ne se contente pas d’enregistrer
            un message : il structure la commande, confirme le total et l’heure de
            préparation, puis pousse l’ordre vers votre écran cuisine et votre tableau de
            bord. Vous gardez le contrôle ; l’IA absorbe le volume.
          </p>
          <ul className="space-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-sm text-zinc-300">
            <li>
              <strong className="text-white">Disponibilité 24h/24</strong> — même hors
              service de salle, l’appel n’est jamais perdu.
            </li>
            <li>
              <strong className="text-white">Prise de commande structurée</strong> — plus
              de tickets illisibles dictés à la va-vite.
            </li>
            <li>
              <strong className="text-white">Suivi des ventes</strong> — chaque appel utile
              apparaît dans le cockpit LIGNE.
            </li>
            <li>
              <strong className="text-white">Déploiement rapide</strong> — branché sur
              votre ligne, calibré sur votre menu.
            </li>
          </ul>
        </section>

        <section className="mt-14 space-y-5">
          <div className="flex items-center gap-3 text-astor-sand">
            <Utensils className="h-5 w-5" />
            <h2 className="font-display text-2xl font-semibold text-white">
              Comment ça marche en pratique
            </h2>
          </div>
          <ol className="space-y-6">
            <li className="leading-relaxed text-zinc-400">
              <span className="font-display text-lg font-semibold text-white">
                1. Le client appelle votre restaurant
              </span>
              <br />
              Le numéro public reste le vôtre. LIGNE décroche à votre place, salue dans le
              ton de votre enseigne et oriente vers une commande claire.
            </li>
            <li className="leading-relaxed text-zinc-400">
              <span className="font-display text-lg font-semibold text-white">
                2. L’IA construit la commande
              </span>
              <br />
              Mode (emporter / sur place), articles, options, nom du client, délai
              souhaité : le dialogue suit le même parcours qu’un bon réceptionniste humain,
              sans fatigue ni erreur de retranscription.
            </li>
            <li className="leading-relaxed text-zinc-400">
              <span className="font-display text-lg font-semibold text-white">
                3. La cuisine reçoit le ticket
              </span>
              <br />
              La commande arrive sur l’écran cuisine et dans le dashboard. L’équipe prépare ;
              le client n’a pas attendu dix sonneries pour être servi — même mentalement.
            </li>
            <li className="leading-relaxed text-zinc-400">
              <span className="font-display text-lg font-semibold text-white">
                4. Vous pilotez depuis le cockpit
              </span>
              <br />
              Historique d’appels, commandes, clients : vous mesurez ce que le téléphone
              rapporte vraiment, au lieu de subir les « on a raté plein d’appels ce soir ».
            </li>
          </ol>
        </section>

        <section className="mt-14 space-y-5">
          <h2 className="font-display text-2xl font-semibold text-white">
            Pour qui est fait LIGNE ?
          </h2>
          <p className="leading-relaxed text-zinc-400">
            LIGNE cible les établissements où le téléphone est un levier de ventes
            immédiat : kebabs, snacks, grillades, pizzerias, burgers, dark kitchens et
            restaurants à emporter. Si vous recevez des pics d’appels le midi et le soir,
            si votre équipe ne peut pas décrocher sans ralentir le service, un
            réceptionniste téléphonique IA devient un avantage concurrentiel, pas un gadget.
          </p>
          <p className="leading-relaxed text-zinc-400">
            Vous n’avez pas besoin de remplacer votre équipe : vous lui retirez la charge
            d’interrompre un plat pour répondre « Allo ? ». L’humain reste sur l’accueil
            physique et la qualité ; l’IA couvre le canal téléphonique.
          </p>
        </section>

        <section className="mt-14 space-y-5">
          <h2 className="font-display text-2xl font-semibold text-white">
            Pourquoi Google (et vos clients) cherchent ce type d’outil
          </h2>
          <p className="leading-relaxed text-zinc-400">
            Les recherches autour du réceptionniste téléphonique IA, de l’agent vocal
            restaurant ou du standard automatique pour la restauration explosent : les
            gérants veulent un système qui répond vraiment, pas une boîte vocale. LIGNE
            répond à cette intention avec un produit pensé pour la France — langue,
            parcours de commande, et intégration cuisine.
          </p>
          <p className="leading-relaxed text-zinc-400">
            Un bon référencement local ne sert à rien si, une fois le numéro trouvé, personne
            ne décroche. LIGNE ferme cette boucle : la visibilité Google amène l’appel ; le
            réceptionniste IA convertit l’appel en ticket cuisine. C’est exactement le
            scénario que recherchent les restaurateurs qui tapent « IA téléphone restaurant »
            ou « prise de commande téléphone automatisée ».
          </p>
          <p className="leading-relaxed text-zinc-400">
            En quelques minutes, vous pouvez{" "}
            <Link href="/demo" className="font-medium text-astor-accent-soft hover:text-astor-accent-bright">
              tester la démo vocale
            </Link>{" "}
            (exemple El Bahja) et entendre comment un client passe commande. Quand vous êtes
            prêt,{" "}
            <Link href="/#tarifs" className="font-medium text-astor-accent-soft hover:text-astor-accent-bright">
              abonnez-vous en ligne
            </Link>{" "}
            : on branche LIGNE sur votre carte et votre ligne.
          </p>
        </section>

        <section className="mt-14 space-y-5">
          <h2 className="font-display text-2xl font-semibold text-white">
            Ce que change un réceptionniste téléphonique IA au quotidien
          </h2>
          <p className="leading-relaxed text-zinc-400">
            Avant LIGNE, le téléphone est une interruption permanente : le cuisinier lâche
            la plancha, le serveur coupe une conversation en salle, le gérant note sur un
            bout de papier. Après, le flux d’appels devient un canal de vente prévisible.
            Les pics du vendredi soir ne saturent plus la ligne ; les commandes hors horaires
            de pointe (ou juste après la fermeture du service) peuvent être captées selon
            vos règles.
          </p>
          <p className="leading-relaxed text-zinc-400">
            Vous réduisez aussi les litiges clients : moins d’oublis de sauce, moins de
            confusion entre « seule » et « formule », moins de « on vous avait dit vingt
            minutes » mal transmis. L’IA confirme à voix haute ; le ticket écrit suit. Pour
            un snack ou une pizzeria, c’est la différence entre un avis Google frustré et un
            client qui revient.
          </p>
          <p className="leading-relaxed text-zinc-400">
            Enfin, le cockpit vous donne une vision claire : combien d’appels, combien de
            commandes, quels créneaux convertissent. Vous ne pilotez plus au feeling (« on
            a l’impression d’avoir raté des appels ») mais avec des données. C’est le même
            niveau d’exigence que pour un POS ou une marketplace — appliqué au téléphone,
            le canal le plus sous-estimé de la restauration indépendante.
          </p>
        </section>

        <section className="mt-14 space-y-5">
          <h2 className="font-display text-2xl font-semibold text-white">
            Mise en route sans chantier technique
          </h2>
          <p className="leading-relaxed text-zinc-400">
            Pas besoin de refondre votre site ni de changer de caisse pour démarrer. On
            configure le menu, le ton de voix, les horaires et le transfert éventuel vers un
            humain si un cas sort du script. La{" "}
            <Link href="/demo" className="font-medium text-astor-accent-soft hover:text-astor-accent-bright">
              démo publique
            </Link>{" "}
            montre déjà le cœur du produit ; l’essai sur votre numéro valide le reste en
            conditions réelles. Si vous voulez voir un restaurant live, la page{" "}
            <Link href="/el-bahja" className="font-medium text-astor-accent-soft hover:text-astor-accent-bright">
              El Bahja
            </Link>{" "}
            illustre une carte grillades reliée au même type d’agent.
          </p>
          <p className="leading-relaxed text-zinc-400">
            LIGNE s’adresse aux gérants qui veulent un réceptionniste téléphonique fiable
            sans recruter une personne dédiée uniquement au téléphone. L’objectif est simple :
            chaque appel utile devient une commande préparée — pas un bip dans le vide.
          </p>
        </section>

        <section className="mt-16 rounded-[2rem] border border-astor-accent/20 bg-gradient-to-br from-astor-accent/15 via-transparent to-astor-warm/10 px-8 py-12 text-center">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Prêt à récupérer vos appels manqués ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Écoutez LIGNE en action, puis lancez un essai sur votre établissement. Moins
            d’appels perdus, plus de commandes préparées.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-full bg-astor-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-astor-accent-soft"
            >
              <Headphones className="h-4 w-4" />
              Lancer la démo
            </Link>
            <Link
              href="/#tarifs"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-astor-accent/40"
            >
              S’abonner
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
