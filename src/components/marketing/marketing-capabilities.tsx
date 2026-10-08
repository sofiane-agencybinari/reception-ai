"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Capacités immersives — sticky scroll, typo seule, zéro photo.
 */

type Line = { text: string; italic?: boolean; caps?: boolean };

const CHAPTERS: {
  id: string;
  at: number;
  num: string;
  kicker: string;
  lines: Line[];
  body: string;
}[] = [
  {
    id: "call",
    at: 0.2,
    num: "01",
    kicker: "Décrocher",
    lines: [
      { text: "Jamais", italic: true },
      { text: "une tonalité", caps: true },
      { text: "occupée.", italic: true },
    ],
    body: "Jusqu’à dix appels en même temps. Accents, allergies, modifications — LIGNE structure la commande comme un réceptionniste formé sur votre carte.",
  },
  {
    id: "kitchen",
    at: 0.5,
    num: "02",
    kicker: "Transmettre",
    lines: [
      { text: "La cuisine", italic: true },
      { text: "voit le bon.", caps: true },
      { text: "Instantanément.", italic: true },
    ],
    body: "Ticket clair, SMS client, zéro ressaisie. Le service enchaîne pendant que la ligne reste ouverte.",
  },
  {
    id: "dash",
    at: 0.8,
    num: "03",
    kicker: "Piloter",
    lines: [
      { text: "Sous vos yeux,", italic: true },
      { text: "CA, produits,", caps: true },
      { text: "exports.", italic: true },
    ],
    body: "Ventes du jour, top produits, panier moyen, CSV pour la compta — le dashboard du quotidien.",
  },
];

function ChapterCopy({
  chapter,
  progress,
}: {
  chapter: (typeof CHAPTERS)[number];
  progress: MotionValue<number>;
}) {
  const c = chapter.at;
  const opacity = useTransform(progress, [c - 0.16, c - 0.05, c + 0.05, c + 0.16], [0, 1, 1, 0]);
  const y = useTransform(progress, [c - 0.14, c, c + 0.14], [32, 0, -32]);
  const l1y = useTransform(progress, [c - 0.1, c - 0.04], ["48%", "0%"]);
  const l2y = useTransform(progress, [c - 0.08, c - 0.02], ["48%", "0%"]);
  const l3y = useTransform(progress, [c - 0.06, c], ["48%", "0%"]);
  const lineYs = [l1y, l2y, l3y];
  const bodyOp = useTransform(progress, [c - 0.02, c + 0.02, c + 0.1], [0, 1, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      style={{ opacity, y }}
    >
      <p className="font-serif text-[12px] uppercase tracking-[0.4em] text-[#8a8175]">
        <span className="tabular-nums text-[#1a1816]/35">{chapter.num}</span>
        <span className="mx-3 text-[#ddd6cb]">—</span>
        {chapter.kicker}
      </p>

      <h3 className="font-serif mt-8 max-w-3xl text-[clamp(2.4rem,6.5vw,4.25rem)] font-normal leading-[1.08] tracking-[-0.03em] text-[#1a1816]">
        {chapter.lines.map((line, i) => (
          <span key={i} className="block overflow-hidden py-[0.03em]">
            <motion.span
              className={[
                "block",
                line.italic ? "italic" : "",
                line.caps ? "uppercase tracking-[0.035em]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ y: lineYs[i] }}
            >
              {line.text}
            </motion.span>
          </span>
        ))}
      </h3>

      <motion.p
        className="mt-9 max-w-md font-serif text-[16px] leading-relaxed text-[#5c574f] sm:text-[17px]"
        style={{ opacity: bodyOp }}
      >
        {chapter.body}
      </motion.p>
    </motion.div>
  );
}

function ReducedCapabilities() {
  return (
    <section id="capacites" className="bg-[#f3f0ed] py-24">
      <div className="mx-auto max-w-2xl space-y-16 px-6 text-center">
        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.34em] text-[#8a8175]">
            Capacités
          </p>
          <h2 className="font-serif mt-5 text-[clamp(2rem,4vw,2.75rem)] text-[#1a1816]">
            <span className="italic">Tout le fil :</span>{" "}
            <span className="uppercase tracking-[0.04em]">de l’appel à la compta.</span>
          </h2>
        </div>
        {CHAPTERS.map((c) => (
          <div key={c.id}>
            <p className="font-serif text-[12px] uppercase tracking-[0.3em] text-[#8a8175]">
              {c.num} — {c.kicker}
            </p>
            <h3 className="font-serif mt-4 text-2xl text-[#1a1816]">
              {c.lines.map((line, i) => (
                <span
                  key={i}
                  className={[
                    "block",
                    line.italic ? "italic" : "",
                    line.caps ? "uppercase" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {line.text}
                </span>
              ))}
            </h3>
            <p className="mt-4 font-serif text-[#5c574f]">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MarketingCapabilities() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const introOpacity = useTransform(scrollYProgress, [0, 0.05, 0.09], [1, 1, 0]);
  const barScale = useTransform(scrollYProgress, [0.08, 0.95], [0, 1]);
  const [numLabel, setNumLabel] = useState("01");

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p < 0.35) setNumLabel("01");
    else if (p < 0.65) setNumLabel("02");
    else setNumLabel("03");
  });

  useEffect(() => {
    const p = scrollYProgress.get();
    if (p < 0.35) setNumLabel("01");
    else if (p < 0.65) setNumLabel("02");
    else setNumLabel("03");
  }, [scrollYProgress]);

  if (reduce) return <ReducedCapabilities />;

  return (
    <section
      id="capacites"
      ref={trackRef}
      className="relative bg-[#f3f0ed]"
      aria-label="Capacités LIGNE"
    >
      <div className="h-[320vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 42%, rgba(255,255,255,0.75), transparent 72%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.25] mix-blend-multiply"
            aria-hidden
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundSize: "160px 160px",
            }}
          />

          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
            style={{ opacity: introOpacity }}
          >
            <p className="font-serif text-[11px] uppercase tracking-[0.34em] text-[#8a8175]">
              Capacités
            </p>
            <h2 className="font-serif mt-6 max-w-3xl text-[clamp(2.2rem,5.5vw,3.6rem)] font-normal leading-[1.1] tracking-[-0.03em] text-[#1a1816]">
              <span className="italic">Tout le fil :</span>
              <br />
              <span className="uppercase tracking-[0.04em]">de l’appel à la compta.</span>
            </h2>
            <motion.p
              className="mt-10 font-serif text-[12px] tracking-[0.2em] text-[#8a8175]"
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              Scroll
            </motion.p>
          </motion.div>

          <div className="relative z-10 flex-1">
            {CHAPTERS.map((chapter) => (
              <ChapterCopy key={chapter.id} chapter={chapter} progress={scrollYProgress} />
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-8 z-30 px-8 sm:px-12">
            <div className="mx-auto flex max-w-xs items-center gap-4">
              <span className="w-6 font-serif text-[12px] tabular-nums tracking-[0.12em] text-[#8a8175]">
                {numLabel}
              </span>
              <div className="h-px flex-1 overflow-hidden bg-[#ddd6cb]">
                <motion.div
                  className="h-full origin-left bg-[#1a1816]/70"
                  style={{ scaleX: barScale }}
                />
              </div>
              <span className="font-serif text-[12px] tabular-nums tracking-[0.12em] text-[#8a8175]/45">
                03
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
