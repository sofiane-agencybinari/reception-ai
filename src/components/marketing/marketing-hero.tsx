"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

/**
 * Hero luxe — marque seule, fond resto interactif (parallax fort).
 */

const ease = [0.23, 1, 0.32, 1] as const;
/** Déplacement max en px — suivi large, bien lisible */
const RANGE_X = 160;
const RANGE_Y = 110;

type Props = {
  ready?: boolean;
};

export function MarketingHero({ ready = true }: Props) {
  const reduce = useReducedMotion();
  const go = ready && !reduce;
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Sortie du hero : la photo reste en place, s'approfondit puis se dissout dans la pierre du récit.
  const { scrollYProgress: rawOut } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const out = useTransform(rawOut, (v) => v); // pas d'accélération native (désynchronisation connue)
  const photoScale = useTransform(out, [0, 1], [1, 1.12]);
  const photoBlur = useTransform(out, [0.35, 1], [0, 6]);
  const photoFilter = useMotionTemplate`blur(${photoBlur}px)`;
  const stoneVeil = useTransform(out, [0.15, 0.95], [0, 1]);
  const titleY = useTransform(out, [0, 0.6], [0, -70]);
  const titleOpacity = useTransform(out, [0, 0.45], [1, 0]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 16, mass: 0.35 });
  const sy = useSpring(py, { stiffness: 160, damping: 16, mass: 0.35 });
  /** Rotation 3D — relief plus marqué */
  const rotateY = useTransform(sx, [-RANGE_X, RANGE_X], [4.5, -4.5]);
  const rotateX = useTransform(sy, [-RANGE_Y, RANGE_Y], [-3.2, 3.2]);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || !ready) return;
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    px.set(nx * -RANGE_X * 2);
    py.set(ny * -RANGE_Y * 2);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div ref={wrapRef} className="relative h-[150svh]">
      <section
        ref={sectionRef}
        className="sticky top-0 isolate flex h-[100svh] cursor-default flex-col overflow-hidden"
        style={{ perspective: "1200px" }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={
            reduce ? undefined : { scale: photoScale, filter: photoFilter }
          }
          aria-hidden
        >
          <motion.div
            className="pointer-events-none absolute inset-[-26%] will-change-transform"
            aria-hidden
            style={
              reduce
                ? undefined
                : {
                    x: sx,
                    y: sy,
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                  }
            }
            initial={reduce ? false : { scale: 1.08, opacity: 0.8 }}
            animate={
              ready
                ? { scale: 1.28, opacity: 1 }
                : { scale: 1.08, opacity: 0.8 }
            }
            transition={{ duration: 1.4, ease }}
          >
            <Image
              src="/marketing/hero-bg.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              draggable={false}
            />
          </motion.div>
        </motion.div>

        {/* Voile — fond plus clair en bas pour rejoindre le story pierre */}
        <div
          className="pointer-events-none absolute inset-0 bg-[#1a1412]/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a1412]/35 via-transparent to-[#ebe6de]/55"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-b from-transparent to-[#ebe6de]"
          aria-hidden
        />

        <motion.div
          className="relative z-10 flex h-[100svh] flex-col items-center justify-center px-6 text-center"
          style={reduce ? undefined : { y: titleY, opacity: titleOpacity }}
        >
          <motion.h1
            className="font-serif text-[clamp(2.4rem,7vw,4rem)] font-normal uppercase leading-none tracking-[0.14em] text-[#f2efe8]"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ delay: go ? 0.06 : 0, duration: 0.75, ease }}
          >
            LIGNE
          </motion.h1>

          <motion.p
            className="mt-6 font-serif text-[clamp(0.95rem,2vw,1.05rem)] italic tracking-[-0.01em] text-[#f2efe8]/55"
            initial={reduce ? false : { opacity: 0 }}
            animate={ready ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: go ? 0.28 : 0, duration: 0.6, ease }}
          >
            Réception vocale.
          </motion.p>
        </motion.div>

        <motion.a
          href="#produits"
          className="marketing-btn absolute inset-x-0 bottom-8 z-10 mx-auto flex w-fit flex-col items-center gap-2 text-[#1a1816]/35"
          initial={reduce ? false : { opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: go ? 0.5 : 0, duration: 0.45, ease }}
          aria-label="Défiler"
        >
          <span className="hero-scroll-cue block h-7 w-px bg-gradient-to-b from-[#1a1816]/45 to-transparent" />
        </motion.a>

        {/* Voile pierre : rejoint exactement le fond du récit iPhone */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 bg-[#ebe6de]"
          style={{ opacity: reduce ? 0 : stoneVeil }}
          aria-hidden
        />
      </section>
    </div>
  );
}
