"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import { CharReveal } from "@/components/immersive/char-reveal";
import { IPhoneWebGLStage } from "@/components/marketing/iphone-webgl-stage";
import { DashboardImmersive } from "@/components/marketing/dashboard-immersive";
import { KitchenImmersive } from "@/components/marketing/kitchen-immersive";

/**
 * Orbite iPhone → plongée → immersion.
 * Copy éditoriale serif (Vero) + atmosphère pierre/grain — téléphone WebGL inchangé.
 */

const easeOut = [0.23, 1, 0.32, 1] as const;

type TitlePart = { t: string; italic?: boolean; caps?: boolean };

type Phase = {
  id: string;
  at: number;
  kicker: string;
  /** Lignes du titre — une entrée = une ligne visuelle */
  lines: TitlePart[][];
  body: string;
};

const PHASES: Phase[] = [
  {
    id: "rush",
    at: 0.03,
    kicker: "Le problème",
    lines: [
      [{ t: "Le rush.", italic: true }],
      [{ t: "La ligne sonne.", caps: true }],
      [{ t: "Personne ne peut décrocher.", italic: true }],
    ],
    body: "Midi. Un appel emporter. La tonalité occupée, c’est une commande perdue.",
  },
  {
    id: "answer",
    at: 0.1,
    kicker: "La réponse",
    lines: [
      [{ t: "LIGNE", caps: true }],
      [{ t: "décroche ", italic: true }, { t: "à votre place." }],
    ],
    body: "En moins de deux secondes. En français. Sur votre carte.",
  },
  {
    id: "orbit-order",
    at: 0.18,
    kicker: "Prise de commande",
    lines: [
      [{ t: "Quantités, options,", italic: true }],
      [{ t: "allergies,", caps: true }],
      [{ t: "emporter ou livraison." }],
    ],
    body: "Le client parle. LIGNE structure chaque article comme sur votre menu.",
  },
  {
    id: "orbit-menu",
    at: 0.26,
    kicker: "Votre carte",
    lines: [
      [{ t: "Vos prix.", italic: true }],
      [{ t: "Vos produits." }],
      [{ t: "Rien d’inventé.", caps: true }],
    ],
    body: "Le catalogue vocal vient de votre PDF ou Excel — à jour, sans surprise.",
  },
  {
    id: "orbit-upsell",
    at: 0.34,
    kicker: "Panier",
    lines: [
      [{ t: "Une suggestion", italic: true }],
      [{ t: "au bon moment —" }],
      [{ t: "jamais forcée.", caps: true }],
    ],
    body: "Boisson, dessert, accompagnement : proposés seulement quand ça a du sens.",
  },
  {
    id: "confirm",
    at: 0.42,
    kicker: "Validation",
    lines: [
      [{ t: "Récapitulatif.", italic: true }],
      [{ t: "Total." }],
      [{ t: "Confirmation.", caps: true }],
    ],
    body: "LIGNE reformule. Le client valide. La commande est fermée.",
  },
  {
    id: "dive",
    at: 0.462,
    kicker: "Transmission",
    lines: [
      [{ t: "Plus de post-it.", italic: true }],
      [{ t: "Plus de ressaisie.", caps: true }],
    ],
    body: "La commande part vers votre outil. La cuisine voit le bon.",
  },
  {
    id: "kitchen",
    at: 0.6,
    kicker: "Écran cuisine",
    lines: [[{ t: "La commande arrive en cuisine", italic: true }], [{ t: "à la seconde où le client raccroche." }]],
    body: "Nouvelles, en préparation, prêtes : l’équipe suit chaque ticket en temps réel, sans rien ressaisir.",
  },
  {
    id: "sms",
    at: 0.66,
    kicker: "Client prévenu",
    lines: [[{ t: "Un SMS part tout seul", italic: true }], [{ t: "quand la commande est prête." }]],
    body: "Moins d’attente au comptoir, moins d’appels pour demander « c’est prêt ? ».",
  },
  {
    id: "dash",
    at: 0.76,
    kicker: "Tableau de bord",
    lines: [[{ t: "Votre activité,", italic: true }], [{ t: "en un coup d’œil." }]],
    body: "Chiffre d’affaires du jour, produits phares, panier moyen — mis à jour à chaque appel.",
  },
  {
    id: "analytics",
    at: 0.85,
    kicker: "Comptabilité",
    lines: [[{ t: "Les exports", italic: true }], [{ t: "prêts pour votre comptable." }]],
    body: "Ventes par produit et par commande, en CSV, en un clic.",
  },
  {
    id: "scale",
    at: 0.93,
    kicker: "Au rush",
    lines: [[{ t: "Dix appels en même temps.", italic: true }], [{ t: "Aucun en attente." }]],
    body: "Midi, soir de match, dimanche : la ligne ne sature plus jamais.",
  },
];

export function MarketingScrollStory() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: rawProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // Valeur intermédiaire volontaire : elle coupe l'accélération native (ScrollTimeline)
  // de motion, qui se désynchronise sur cette piste de 1200vh (calques qui réapparaissent
  // en fin de récit, ex. le fond pierre qui revient en « brouillard » sur le dashboard).
  const scrollYProgress = useTransform(rawProgress, (v) => v);

  const phoneRotateY = useTransform(
    scrollYProgress,
    [0.06, 0.14, 0.22, 0.3, 0.38, 0.45, 0.5, 0.56],
    [25, -50, -140, -230, -310, -360, -360, -360],
  );
  const phoneRotateX = useTransform(
    scrollYProgress,
    [0.06, 0.2, 0.35, 0.45, 0.5, 0.56],
    [18, 8, 12, 3, 0, 0],
  );

  const phoneScale = useTransform(
    scrollYProgress,
    [0, 0.07, 0.095, 0.165, 0.2, 0.45, 0.5, 0.54, 0.58],
    [0.85, 0.95, 0.78, 0.78, 1, 1, 1.2, 2.1, 3.4],
  );
  const phoneBlur = useTransform(scrollYProgress, [0.5, 0.56], [0, 10]);
  const phoneOpacity = useTransform(scrollYProgress, [0.5, 0.54, 0.585], [1, 0.7, 0]);
  const phoneFilter = useMotionTemplate`blur(${phoneBlur}px)`;
  const phoneVisibility = useTransform(scrollYProgress, (p) =>
    p > 0.6 ? "hidden" : "visible",
  );

  const ringsRotateY = useTransform(scrollYProgress, [0.06, 0.46], [0, -360]);
  const ringsOpacity = useTransform(scrollYProgress, [0.45, 0.51], [0.55, 0]);

  const insetT = useTransform(scrollYProgress, [0.49, 0.53, 0.585], [26, 12, 0]);
  const insetR = useTransform(scrollYProgress, [0.49, 0.53, 0.585], [37, 18, 0]);
  const insetB = useTransform(scrollYProgress, [0.49, 0.53, 0.585], [20, 10, 0]);
  const insetL = useTransform(scrollYProgress, [0.49, 0.53, 0.585], [37, 18, 0]);
  const insetRad = useTransform(scrollYProgress, [0.49, 0.53, 0.585], [40, 22, 0]);
  const immersionClip = useMotionTemplate`inset(${insetT}% ${insetR}% ${insetB}% ${insetL}% round ${insetRad}px)`;
  const immersionOpacity = useTransform(scrollYProgress, [0.49, 0.515], [0, 1]);
  const immersionScale = useTransform(scrollYProgress, [0.49, 0.585], [0.94, 1]);
  const immersionTransform = useMotionTemplate`scale(${immersionScale})`;

  const kitchenOpacity = useTransform(scrollYProgress, [0.52, 0.56, 0.7, 0.75], [0, 1, 1, 0]);
  const dashOpacity = useTransform(scrollYProgress, [0.7, 0.75], [0, 1]);

  const stoneFade = useTransform(scrollYProgress, [0.49, 0.6], [1, 0]);
  const blackWash = useTransform(scrollYProgress, [0.5, 0.62], [0, 1]);

  const hudOrbit = useTransform(scrollYProgress, [0.485, 0.5, 0.512], [1, 0.5, 0]);
  const hudImmerse = useTransform(scrollYProgress, [0.56, 0.6, 0.92, 0.97], [0, 1, 1, 0]);
  // Fin du récit : fondu vers le papier de la section suivante (pas de coupure visible).
  const endWash = useTransform(scrollYProgress, [0.95, 0.995], [0, 1]);

  const ringOpacity = useTransform(scrollYProgress, [0, 0.015, 0.1, 0.13], [0, 1, 0.85, 0]);

  // « Propulsé par l'IA » : lueur sur les bords de l'écran quand Ligne décroche,
  // forte pendant la réponse puis discrète tant que Ligne est en communication.
  const aiGlow = useTransform(scrollYProgress, [0.075, 0.095, 0.165, 0.2, 0.44, 0.49], [0, 1, 1, 0.3, 0.3, 0]);
  const phoneDrop = useTransform(scrollYProgress, [0.07, 0.095, 0.165, 0.2], ["0%", "12%", "12%", "0%"]);
  const [aiTitle, setAiTitle] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (p) => setAiTitle(p > 0.088 && p < 0.172));
  const phoneShiftX = useTransform(
    scrollYProgress,
    [0, 0.07, 0.095, 0.165, 0.2, 0.45, 0.52],
    ["12%", "14%", "0%", "0%", "14%", "10%", "0%"],
  );

  const ringsTransform = useMotionTemplate`rotateX(72deg) rotateZ(${ringsRotateY}deg)`;

  // Le header passe en version sombre pendant l'immersion cuisine / tableau de bord.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const tone = p > 0.53 && p < 0.975 ? "dark" : "light";
    if (document.documentElement.dataset.storyTone !== tone) {
      document.documentElement.dataset.storyTone = tone;
      window.dispatchEvent(new Event("astor:tone"));
    }
  });

  if (reduce) return <ReducedStory />;

  return (
    <section
      id="produits"
      ref={trackRef}
      className="relative -mt-[25svh] bg-transparent"
      aria-label="Parcours produit LIGNE"
    >
      <div className="h-[1200vh]">
        <div
          className="sticky top-0 h-[100svh]"
          style={{ overflow: "clip", transformStyle: "preserve-3d" }}
        >
          {/* Atmosphère pierre — planche unifiée */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: stoneFade,
              // Bord haut fondu : le décor arrive sans ligne de jonction sous le voile pierre du hero.
              maskImage: "linear-gradient(to bottom, transparent 0%, #000 28%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 28%)",
            }}
            aria-hidden
          >
            <div className="absolute inset-0 bg-[#ebe6de]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#ebe6de_0%,#ebe6de_40%,#e2dbd1_100%)]" />

            {/* Bande resto floue — continuité hero */}
            <div className="absolute inset-x-0 bottom-0 h-[55%] overflow-hidden opacity-[0.22]">
              <Image
                src="/marketing/hero-bg.jpg"
                alt=""
                fill
                sizes="100vw"
                className="scale-110 object-cover object-[center_70%] blur-[28px]"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#ebe6de]/40 to-[#ebe6de]" />
            </div>

            {/* Aurore bordeaux — halos qui dérivent lentement derrière le téléphone */}
            <div className="lx-aurora absolute inset-0 overflow-hidden">
              <span
                className="lx-drift-a right-[-6%] top-[8%] h-[min(78vw,900px)] w-[min(78vw,900px)]"
                style={{ background: "radial-gradient(circle, rgba(92,42,54,0.30) 0%, rgba(92,42,54,0.12) 35%, transparent 68%)" }}
              />
              <span
                className="lx-drift-b right-[18%] top-[30%] h-[min(60vw,700px)] w-[min(60vw,700px)]"
                style={{ background: "radial-gradient(circle, rgba(201,138,152,0.32) 0%, rgba(201,138,152,0.1) 40%, transparent 70%)" }}
              />
              <span
                className="lx-drift-c bottom-[-20%] left-[-10%] h-[min(70vw,800px)] w-[min(70vw,800px)]"
                style={{ background: "radial-gradient(circle, rgba(214,170,120,0.22) 0%, transparent 65%)" }}
              />
            </div>

            {/* Halo Deep Cherry derrière le téléphone */}
            <div className="absolute right-[8%] top-[42%] h-[min(70vw,520px)] w-[min(70vw,520px)] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(92,42,54,0.14)_0%,transparent_68%)] blur-2xl" />
            <div className="absolute left-[12%] top-[30%] h-[240px] w-[240px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,transparent_70%)]" />

            {/* Grain papier */}
            <div
              className="absolute inset-0 opacity-[0.35] mix-blend-multiply"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: "180px 180px",
              }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(40,32,24,0.1)_100%)]" />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-[5] bg-[#0c0c0b]"
            style={{ opacity: blackWash }}
            aria-hidden
          />

          <div className="absolute inset-0 z-10">
            <motion.div
              className="pointer-events-none absolute inset-0 z-[18]"
              style={{ opacity: ringOpacity, x: phoneShiftX }}
              aria-hidden
            >
              <div className="absolute left-1/2 top-[52%] h-[min(70vw,560px)] w-[min(70vw,560px)] -translate-x-1/2 -translate-y-1/2">
                {[0, 1.2, 2.4].map((d) => (
                  <span key={d} className="lx-pulse-ring h-full w-full" style={{ animationDelay: `${d}s` }} />
                ))}
              </div>
              <RingWaves />
            </motion.div>

            {/* Cercles — adoucis, fondus dans le grain */}
            <motion.div
              className="pointer-events-none absolute left-1/2 top-[58%] z-[11] h-[min(92vw,760px)] w-[min(92vw,760px)] -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: ringsTransform,
                opacity: ringsOpacity,
                transformStyle: "preserve-3d",
              }}
              aria-hidden
            >
              <div className="absolute inset-0 rounded-full border border-[#c4bbb0]/18" />
              <div className="absolute inset-[14%] rounded-full border border-[#b5aea2]/16" />
              <div className="absolute inset-[30%] rounded-full border border-[#a39a8e]/14" />
              <div className="absolute inset-[48%] rounded-full border border-[#8a8175]/10" />
            </motion.div>

            <motion.div
              className="absolute inset-0 z-[12]"
              style={{ opacity: phoneOpacity, filter: phoneFilter, x: phoneShiftX, y: phoneDrop }}
            >
              <IPhoneWebGLStage
                rotateY={phoneRotateY}
                rotateX={phoneRotateX}
                scale={phoneScale}
                visible={phoneVisibility}
                progress={scrollYProgress}
              />
            </motion.div>

            <motion.div
              className="absolute inset-0 z-20 origin-center"
              style={{
                opacity: immersionOpacity,
                clipPath: immersionClip,
                WebkitClipPath: immersionClip,
                transform: immersionTransform,
              }}
            >
              <div className="absolute inset-0 bg-[#0c0c0b]" />
              <motion.div className="absolute inset-x-0 bottom-[150px] top-[68px] sm:bottom-[96px]" style={{ opacity: kitchenOpacity }}>
                <KitchenImmersive />
              </motion.div>
              <motion.div className="absolute inset-x-0 bottom-[150px] top-[68px] sm:bottom-[96px]" style={{ opacity: dashOpacity }}>
                <DashboardImmersive />
              </motion.div>
            </motion.div>
          </div>

          {/* Lueur IA + titre « Propulsé par l'IA » */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-[35]"
            style={{ opacity: aiGlow, transform: "translateZ(130px)" }}
            aria-hidden
          >
            <div className="lx-ai-glow">
              <span />
            </div>
          </motion.div>
          <div
            className="pointer-events-none absolute inset-x-0 top-[13vh] z-[36] flex flex-col items-center text-center"
            style={{ transform: "translateZ(135px)" }}
          >
            <p className="font-sans text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-none tracking-[-0.045em] text-[#1a1816]">
              <CharReveal text="Propulsé par l’IA" show={aiTitle} />
              <CharReveal text="*" show={aiTitle} className="align-super text-[0.45em] text-[#5c2a36]" />
            </p>
            <p className="mt-3 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.22em] text-[#5c2a36]">
              <CharReveal text="* Ligne décroche. Pour de vrai." show={aiTitle} stagger={0.018} />
            </p>
          </div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-30"
            // translateZ : la scène est en preserve-3d, le z-index seul ne suffit pas à passer devant l'iPhone.
            style={{ opacity: hudOrbit, transform: "translateZ(120px)" }}
          >
            <OrbitHud progress={scrollYProgress} hidden={aiTitle} />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-40"
            style={{ opacity: hudImmerse, transform: "translateZ(120px)" }}
          >
            <ImmerseHud progress={scrollYProgress} />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-[45] bg-[#f3f0ed]"
            style={{ opacity: endWash, transform: "translateZ(140px)" }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}

/** Index de la phase la plus proche de la progression, en état React. */
function usePhase(progress: MotionValue<number>) {
  const nearest = (p: number) => {
    let best = 0;
    let bestDist = Infinity;
    PHASES.forEach((phase, i) => {
      const d = Math.abs(p - phase.at);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  };
  const [index, setIndex] = useState(() => nearest(progress.get()));
  useMotionValueEvent(progress, "change", (p) => setIndex(nearest(p)));
  return index;
}

const IMMERSE_FROM = PHASES.findIndex((p) => p.id === "kitchen");

/** Titre de phase : chaque ligne glisse depuis un masque. */
function PhaseTitle({ phase, light, className }: { phase: Phase; light?: boolean; className: string }) {
  return (
    <h2 className={`lx-title font-normal leading-[1.12] ${light ? "text-[#f2efe8]" : "text-[#1a1816]"} ${className}`}>
      {phase.lines.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-105%", transition: { duration: 0.35, ease: easeOut } }}
            transition={{ delay: 0.05 + li * 0.08, duration: 0.7, ease: easeOut }}
          >
            {line.map((part, pi) => (
              <span key={pi} className={part.italic ? "italic" : ""}>
                {part.t}
              </span>
            ))}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/** Statut d'appel en direct : sonnerie, puis Ligne en communication avec la durée. */
function CallStatus({ progress }: { progress: MotionValue<number> }) {
  const [state, setState] = useState({ ringing: true, secs: 0 });
  useMotionValueEvent(progress, "change", (p) => {
    const ringing = p < 0.085;
    const secs = ringing ? 0 : Math.round(((p - 0.085) / (0.45 - 0.085)) * 94);
    setState((prev) => (prev.ringing === ringing && prev.secs === secs ? prev : { ringing, secs: Math.min(94, secs) }));
  });
  const mm = String(Math.floor(state.secs / 60)).padStart(2, "0");
  const ss = String(state.secs % 60).padStart(2, "0");
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[#1a1816]/10 bg-white/55 py-2 pl-3 pr-4 text-[13px] text-[#1a1816] backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className={`absolute inset-0 rounded-full bg-[#5c2a36] ${state.ringing ? "lx-ring" : ""}`} />
        <span className="relative h-2 w-2 rounded-full bg-[#5c2a36]" />
      </span>
      {state.ringing ? (
        "Appel entrant…"
      ) : (
        <>
          Ligne · en communication
          <span className="lx-wave flex h-3 items-center gap-[2px] text-[#5c2a36]" aria-hidden>
            {[0.5, 0.9, 0.6, 1, 0.45, 0.8].map((h, i) => (
              <span key={i} style={{ height: `${h * 100}%`, animationDelay: `${i * -0.14}s` }} />
            ))}
          </span>
          <span className="font-[family-name:var(--font-geist-mono)] text-[11px] tabular-nums text-[#8a8175]">
            {mm}:{ss}
          </span>
        </>
      )}
    </div>
  );
}

/** Colonne éditoriale à gauche du téléphone : chapitre en cours + sommaire des étapes. */
function OrbitHud({ progress, hidden }: { progress: MotionValue<number>; hidden: boolean }) {
  const index = usePhase(progress);
  const orbit = PHASES.slice(0, IMMERSE_FROM);
  const current = Math.min(index, IMMERSE_FROM - 1);
  const phase = orbit[current];

  return (
    <motion.div
      className="absolute inset-0"
      animate={{ opacity: hidden ? 0 : 1, filter: hidden ? "blur(8px)" : "blur(0px)" }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      <div className="absolute inset-x-3 bottom-3 rounded-[20px] border border-[#1a1816]/10 bg-[#ebe6de]/80 p-5 backdrop-blur-xl sm:inset-x-auto sm:bottom-auto sm:left-8 sm:top-[max(5.5rem,11vh)] sm:w-[min(40vw,34rem)] sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none lg:left-12 lg:top-1/2 lg:-translate-y-1/2">
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.22em] text-[#8a8175]">
          <span className="tabular-nums text-[#1a1816]">{String(current + 1).padStart(2, "0")}</span>
          <span className="mx-2 opacity-50">—</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={phase.id}
              className="inline-block"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: easeOut }}
            >
              {phase.kicker}
            </motion.span>
          </AnimatePresence>
        </p>

        <div className="relative mt-3 min-h-[8.5rem] sm:mt-5 sm:min-h-[9.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={phase.id} exit={{ opacity: 0, transition: { duration: 0.35 } }}>
              <PhaseTitle phase={phase} className="text-[clamp(1.45rem,2.9vw,2.75rem)]" />
              <motion.p
                className="mt-3 max-w-[26rem] text-[14px] leading-relaxed text-[#5c574f] sm:mt-4 sm:text-[16px]"
                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.25, duration: 0.6, ease: easeOut }}
              >
                {phase.body}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        <ol className="relative mt-10 hidden space-y-2.5 border-l border-[#1a1816]/10 pl-5 lg:block">
          {orbit.map((p, i) => {
            const state = i < current ? "done" : i === current ? "on" : "next";
            return (
              <li key={p.id} className="relative flex items-center gap-3 text-[13px]">
                <span
                  className={`absolute -left-[23.5px] h-2 w-2 rounded-full border transition-all duration-500 ${
                    state === "on"
                      ? "scale-125 border-[#5c2a36] bg-[#5c2a36]"
                      : state === "done"
                        ? "border-[#1a1816]/40 bg-[#1a1816]/40"
                        : "border-[#1a1816]/20 bg-[#ebe6de]"
                  }`}
                />
                <span className={`transition-colors duration-500 ${state === "on" ? "text-[#1a1816]" : "text-[#8a8175]/80"}`}>
                  {p.kicker}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 hidden sm:block">
          <CallStatus progress={progress} />
        </div>
      </div>
    </motion.div>
  );
}

/** Bande de légende sous l'écran cuisine / tableau de bord (ne recouvre jamais l'écran). */
function ImmerseHud({ progress }: { progress: MotionValue<number> }) {
  const index = usePhase(progress);
  const immerse = PHASES.slice(IMMERSE_FROM);
  const current = Math.max(0, index - IMMERSE_FROM);
  const phase = immerse[current];

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 h-[150px] border-t border-white/10 bg-[#0c0c0b] sm:h-[96px]">
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-3 px-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-8">
        <div className="relative min-w-0 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: easeOut }}
            >
              <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#d9a3b0]">
                {String(current + 1).padStart(2, "0")} — {phase.kicker}
              </p>
              <p className="mt-1.5 font-serif text-[17px] leading-snug text-[#f2efe8] sm:text-[19px]">
                {phase.lines.map((line, li) => (
                  <span key={li} className={li === 0 ? "italic" : ""}>
                    {line.map((part) => part.t).join("")}
                    {li < phase.lines.length - 1 ? " " : ""}
                  </span>
                ))}
                <span className="hidden text-[14px] text-white/50 lg:inline"> — {phase.body}</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex w-full shrink-0 gap-1.5 sm:w-48">
          {immerse.map((p, i) => (
            <span key={p.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full rounded-full bg-[#c98a98] transition-transform duration-700 ease-out"
                style={{ transform: `scaleX(${i <= current ? 1 : 0})`, transformOrigin: "left" }}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RingWaves() {
  const arcs = [
    { r: 10, w: 4, span: 40 },
    { r: 18, w: 3, span: 44 },
    { r: 26, w: 2, span: 48 },
    { r: 34, w: 1.2, span: 52 },
  ];

  const fromCenter = "calc(50% + min(24vw, 190px))";

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className="absolute top-[52%] h-[min(34vw,240px)] w-[min(10vw,72px)] -translate-y-1/2"
        style={{ right: fromCenter }}
      >
        <svg viewBox="0 0 70 140" className="h-full w-full overflow-visible" fill="#5c2a36">
          {arcs.map((a, i) => (
            <path
              key={`L${i}`}
              className="astor-sound-arc"
              d={taperedSoundArc(68, 70, a.r, a.span, a.w, "left")}
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </svg>
      </div>
      <div
        className="absolute top-[52%] h-[min(34vw,240px)] w-[min(10vw,72px)] -translate-y-1/2"
        style={{ left: fromCenter }}
      >
        <svg viewBox="0 0 70 140" className="h-full w-full overflow-visible" fill="#5c2a36">
          {arcs.map((a, i) => (
            <path
              key={`R${i}`}
              className="astor-sound-arc"
              d={taperedSoundArc(2, 70, a.r, a.span, a.w, "right")}
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

function taperedSoundArc(
  cx: number,
  cy: number,
  r: number,
  halfSpanDeg: number,
  thickness: number,
  side: "left" | "right",
) {
  const mid = side === "left" ? 180 : 0;
  const a0 = ((mid - halfSpanDeg) * Math.PI) / 180;
  const a1 = ((mid + halfSpanDeg) * Math.PI) / 180;
  const rOut = r + thickness / 2;
  const rIn = Math.max(1, r - thickness / 2);

  const pt = (ang: number, rad: number) => [cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)];

  const [x0, y0] = pt(a0, rOut);
  const [x1, y1] = pt(a1, rOut);
  const [x2, y2] = pt(a1, rIn);
  const [x3, y3] = pt(a0, rIn);

  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${rOut} ${rOut} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} A ${rIn} ${rIn} 0 0 0 ${x3.toFixed(2)} ${y3.toFixed(2)} Z`;
}

function ReducedStory() {
  return (
    <section id="produits" className="border-t border-[#ddd6cb] bg-transparent py-24">
      <div className="mx-auto max-w-2xl px-6">
        <ol className="space-y-10">
          {PHASES.map((phase) => (
            <li key={phase.id}>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#8a8175]">
                {phase.kicker}
              </p>
              <h2 className="font-serif mt-2 text-[clamp(1.35rem,2.6vw,1.95rem)] font-normal leading-[1.22] text-[#1a1816]">
                {phase.lines.map((line, li) => (
                  <span key={li} className="block">
                    {line.map((part, pi) => (
                      <span
                        key={pi}
                        className={[
                          part.italic ? "italic" : "",
                          part.caps ? "uppercase tracking-[0.04em]" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {part.t}
                      </span>
                    ))}
                  </span>
                ))}
              </h2>
              <p className="mt-2 font-serif text-[#5c574f]">{phase.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-14 h-[100svh] overflow-hidden border border-[#2a2a28]">
          <KitchenImmersive />
        </div>
        <div className="mt-8 h-[100svh] overflow-hidden border border-[#2a2a28]">
          <DashboardImmersive />
        </div>
      </div>
    </section>
  );
}
