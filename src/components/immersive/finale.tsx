"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { LEGAL_LINKS } from "@/components/legal/legal-page";
import { SOLUTION_PAGES } from "@/components/seo/solutions-data";

import { EASE } from "./reveal";

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
  ["mailto:contact@agencybinari.com", "Contact"],
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
          <nav className="grid grid-cols-2 gap-x-12 gap-y-2.5 text-[13px] sm:grid-cols-4">
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
        {/* Signature façon plan technique (oryzo) : le mot se dessine trait par trait */}
        <svg viewBox="0 0 1000 220" className="mt-16 w-full overflow-visible" aria-hidden>
          {[110, 890].map((cx, i) => (
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
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.2 + i * 0.2, ease: EASE }}
            />
          ))}
          <motion.line
            x1={0}
            x2={1000}
            y1={110}
            y2={110}
            stroke="#f2efe8"
            strokeOpacity={0.12}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: EASE }}
          />
          <motion.text
            x={500}
            y={168}
            textAnchor="middle"
            fontFamily="var(--font-dm-sans), system-ui, sans-serif"
            fontWeight={500}
            fontSize={210}
            letterSpacing={-8}
            fill="transparent"
            stroke="#f2efe8"
            strokeOpacity={0.55}
            strokeWidth={1}
            strokeDasharray={1400}
            initial={{ strokeDashoffset: 1400 }}
            whileInView={{ strokeDashoffset: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 3, delay: 0.3, ease: EASE }}
          >
            LIGNE
          </motion.text>
        </svg>

        <nav aria-label="Solutions" className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-white/45">
          {SOLUTION_PAGES.map((p) => (
            <Link key={p.slug} href={`/solutions/${p.slug}`} className="transition-colors hover:text-[#f2efe8]">
              {p.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex flex-wrap justify-between gap-3 text-[11px] text-white/40">
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} Ligne</span>
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-[#f2efe8]">
                {l.label}
              </Link>
            ))}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d9a3b0]" /> Paris <ParisClock /> · Ligne répond en ce moment
          </span>
        </div>
      </div>
    </footer>
  );
}
