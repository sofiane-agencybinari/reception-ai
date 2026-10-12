"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";

import { LEGAL_LINKS } from "@/components/legal/legal-page";
import { SOLUTION_PAGES } from "@/components/seo/solutions-data";

import { EASE } from "./reveal";

/** Libellés courts du pied de page (le titre complet reste en infobulle pour le référencement). */
const SOLUTION_CARDS: Record<string, { title: string; text: string }> = {
  "standard-telephonique-restaurant": { title: "Standard téléphonique", text: "Chaque appel décroché, 24 h/24." },
  "prise-de-commande-telephone": { title: "Commande par téléphone", text: "Prise à la voix, envoyée en cuisine." },
  "appels-manques-restaurant": { title: "Appels manqués", text: "Plus aucune commande perdue au rush." },
  pizzeria: { title: "Pizzerias", text: "Tailles, suppléments, livraison." },
  "snack-kebab": { title: "Snacks & kebabs", text: "Menus, sauces, rush de midi." },
};

/**
 * Signature « LIGNE » : invisible pendant la descente, elle apparaît d'un coup en bas de page —
 * les lettres se dévoilent de gauche à droite pendant que le contour se dessine, puis se remplissent.
 */
function Wordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const shown = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div ref={ref} className="mt-12 sm:mt-16">
      <motion.svg
        viewBox={mobile ? "150 30 700 175" : "0 0 1000 220"}
        className="w-full overflow-visible"
        aria-hidden
        initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
        animate={shown ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <defs>
          <clipPath id="ligne-reveal">
            <motion.rect
              x={0}
              y={0}
              height={220}
              initial={{ width: 0 }}
              animate={shown ? { width: 1000 } : undefined}
              transition={{ duration: 1.9, delay: 0.15, ease: [0.65, 0, 0.35, 1] }}
            />
          </clipPath>
        </defs>
        {mobile
          ? null
          : [110, 890].map((cx, i) => (
              <motion.circle
                key={cx}
                cx={cx}
                cy={110}
                r={96}
                fill="none"
                stroke="#d9a3b0"
                strokeOpacity={0.35}
                strokeWidth={1}
                initial={{ pathLength: 0 }}
                animate={shown ? { pathLength: 1 } : undefined}
                transition={{ duration: 2, delay: 0.4 + i * 0.25, ease: EASE }}
              />
            ))}
        <g clipPath="url(#ligne-reveal)">
          <motion.text
            x={500}
            y={168}
            textAnchor="middle"
            fontFamily="var(--font-dm-sans), system-ui, sans-serif"
            fontWeight={500}
            fontSize={210}
            letterSpacing={-8}
            stroke="#f2efe8"
            strokeOpacity={0.7}
            strokeWidth={mobile ? 1.6 : 1}
            strokeDasharray={4000}
            initial={{ strokeDashoffset: 4000, fill: "rgba(242,239,232,0)" }}
            animate={shown ? { strokeDashoffset: 0, fill: "rgba(242,239,232,0.08)" } : undefined}
            transition={{
              strokeDashoffset: { duration: 2.6, delay: 0.15, ease: EASE },
              fill: { duration: 1.4, delay: 1.9, ease: EASE },
            }}
          >
            LIGNE
          </motion.text>
        </g>
      </motion.svg>
    </div>
  );
}

function ParisClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

const LINKS = [
  ["#produits", "Parcours"],
  ["#capacites", "Capacités"],
  ["#tarifs", "Tarifs"],
  ["#faq", "FAQ"],
  ["/demo-pizza", "Démo vocale"],
  ["/pour-les-restaurants", "Pour les restaurants"],
  ["/login", "Connexion"],
  ["/contact", "Contact"],
] as const;

export function LuxeFooter() {
  return (
    <footer data-tone="dark" className="bg-[#0c0c0b] px-5 pb-10 pt-16 text-[#f2efe8] sm:px-10">
      <div className="mx-auto max-w-6xl border-t border-white/10 pt-10">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <p className="font-serif text-xl uppercase tracking-[0.3em]">Ligne</p>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-white/50">
              Réceptionniste téléphonique IA pour snacks, pizzerias et restaurants. Hébergé en France.
            </p>
          </div>
          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-x-8 gap-y-3 text-[14px] sm:grid-cols-4 sm:gap-x-12 sm:gap-y-2.5 sm:text-[13px]">
            {LINKS.map(([href, label]) =>
              href.startsWith("/") ? (
                <Link key={label} href={href} className="text-white/60 transition-colors hover:text-[#f2efe8]">
                  {label}
                </Link>
              ) : (
                <a key={label} href={href} className="text-white/60 transition-colors hover:text-[#f2efe8]">
                  {label}
                </a>
              ),
            )}
          </nav>
        </div>
        {/* Signature façon plan technique : le mot se dessine trait par trait en descendant */}
        <Wordmark />

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-white/40">Solutions</p>
            <Link href="/guides" className="text-[12px] text-white/50 transition-colors hover:text-[#f2efe8]">
              Guides pour restaurateurs →
            </Link>
          </div>
          <nav aria-label="Solutions" className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
            {SOLUTION_PAGES.map((p) => {
              const card = SOLUTION_CARDS[p.slug] ?? { title: p.label, text: "" };
              return (
                <Link
                  key={p.slug}
                  href={`/solutions/${p.slug}`}
                  title={p.label}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-white/25 hover:bg-white/[0.06] last:col-span-2 sm:last:col-span-1"
                >
                  <span className="flex items-center justify-between gap-2 text-[13.5px] font-medium text-[#f2efe8]">
                    {card.title}
                    <span className="text-white/30 transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
                  </span>
                  <span className="mt-1 block text-[12px] leading-snug text-white/45">{card.text}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] text-white/40 sm:mt-6 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-3 sm:border-0 sm:pt-0">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d9a3b0]" /> Paris <ParisClock /> · Ligne répond en ce moment
          </span>
          <span className="flex flex-wrap gap-x-4 gap-y-2 sm:order-first">
            <span>© {new Date().getFullYear()} Ligne</span>
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-[#f2efe8]">
                {l.label}
              </Link>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
