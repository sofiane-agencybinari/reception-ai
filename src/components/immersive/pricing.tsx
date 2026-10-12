"use client";

import { useRef, type PointerEvent } from "react";

import { PRICING_PLANS } from "@/components/marketing/marketing-data";

import { gsap, prefersReducedMotion, useGSAP } from "./gsap";
import { SplitReveal } from "./split-reveal";
import { useSubscribe } from "./subscribe-panel";

const perMinute = (v: number) => v.toFixed(2).replace(".", ",");

/** Sur téléphone, chaque offre montre ses premiers avantages pour tenir sur un seul écran. */
const MOBILE_FEATURES = 4;

/** Inclinaison 3D + reflet qui suit le pointeur. */
function onTilt(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--mx", `${x * 100}%`);
  el.style.setProperty("--my", `${y * 100}%`);
  if (e.pointerType === "mouse") {
    gsap.to(el, { rotateY: (x - 0.5) * 9, rotateX: (0.5 - y) * 9, duration: 0.6, ease: "power3.out" });
  }
}
function onTiltLeave(e: PointerEvent<HTMLElement>) {
  gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
}

export function Pricing() {
  const root = useRef<HTMLElement>(null);
  const subscribe = useSubscribe();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-plan]", {
        y: 140,
        rotateX: -28,
        autoAlpha: 0,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-plans]", start: "top 82%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="tarifs" className="relative overflow-hidden bg-[var(--lx-stone)] px-5 pb-14 pt-24 text-[var(--lx-ink)] sm:px-10 sm:py-40">
      <div className="lx-grain" aria-hidden />
      <div className="relative flex flex-col justify-between gap-3 sm:gap-8 lg:flex-row lg:items-end">
        <div>
          <p className="lx-label">(04) — Tarifs</p>
          <SplitReveal className="mt-4 max-w-[14ch] font-sans text-[clamp(2rem,5.4vw,5.25rem)] font-medium leading-[1.02] tracking-[-0.045em] sm:mt-8">
            Moins cher qu&apos;un <span className="text-[var(--lx-cherry)]">appel raté.</span>
          </SplitReveal>
        </div>
        <p className="max-w-sm font-serif text-[15px] leading-snug text-[#5c574f] sm:text-[clamp(1.1rem,1.6vw,1.35rem)]">
          Abonnement mensuel + minutes consommées. <span className="italic">Installé en 24 h,</span> sans engagement,
          résiliable à tout moment.
        </p>
      </div>

      {/* Les trois offres côte à côte, sur téléphone comme sur ordinateur (version compacte en dessous de 640 px). */}
      <div data-plans className="relative -mx-2 mt-7 grid grid-cols-3 gap-1.5 [perspective:1400px] sm:mx-0 sm:mt-24 sm:gap-4">
        {PRICING_PLANS.map((plan) => {
          const hot = plan.popular;
          return (
            <article
              key={plan.id}
              data-plan
              onPointerMove={onTilt}
              onPointerLeave={onTiltLeave}
              className={`lx-spot relative flex flex-col rounded-[16px] px-2.5 pb-3 pt-4 [transform-style:preserve-3d] sm:rounded-[26px] sm:p-9 ${
                hot
                  ? "bg-[var(--lx-cherry)] text-[#f2efe8] shadow-[0_40px_80px_-30px_rgba(92,42,54,0.6)]"
                  : "border border-[var(--lx-line)] bg-[var(--lx-paper)]"
              }`}
            >
              {hot ? (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#f2efe8] px-2 py-0.5 font-serif text-[10px] italic text-[var(--lx-cherry)] sm:hidden">
                  le plus choisi
                </span>
              ) : null}
              <div className="flex items-center justify-between">
                <h3 className="lx-title lx-caps text-[1rem] sm:text-[1.9rem]">{plan.name}</h3>
                {hot ? (
                  <span className="hidden rounded-full border border-[#f2efe8]/30 px-3 py-1 font-serif text-[13px] italic sm:inline">
                    le plus choisi
                  </span>
                ) : null}
              </div>
              <p className={`mt-3 hidden text-sm sm:block ${hot ? "text-[#f2efe8]/70" : "text-[var(--lx-muted)]"}`}>{plan.description}</p>

              <p className="mt-3 flex flex-wrap items-end gap-x-1 sm:mt-12 sm:gap-2">
                <span className="lx-title text-[2.6rem] leading-[0.8] tabular-nums sm:text-[clamp(4.8rem,7vw,6.5rem)]">{plan.price}</span>
                <span className="pb-0.5 font-serif text-[11px] italic sm:pb-1 sm:text-lg">€ / mois</span>
              </p>
              <p className={`mt-2 font-[family-name:var(--font-geist-mono)] text-[9px] leading-tight sm:mt-3 sm:text-[11px] ${hot ? "text-[#f2efe8]/65" : "text-[var(--lx-muted)]"}`}>
                + {perMinute(plan.perMinute)} € / min
              </p>

              <ul className={`mt-3 flex-1 space-y-1.5 border-t pt-3 text-[10.5px] leading-snug sm:mt-10 sm:space-y-3 sm:pt-8 sm:text-sm ${hot ? "border-[#f2efe8]/15" : "border-[var(--lx-line)]"}`}>
                {plan.features.map((f, i) => (
                  <li key={f} className={`gap-1.5 sm:flex sm:gap-3 ${i < MOBILE_FEATURES ? "flex" : "hidden"}`}>
                    <span className={`text-[8px] leading-[1.6] sm:text-[length:inherit] sm:leading-[inherit] ${hot ? "text-[#f2efe8]/60" : "text-[var(--lx-cherry)]"}`} aria-hidden>
                      ✦
                    </span>
                    {f}
                  </li>
                ))}
                {plan.features.length > MOBILE_FEATURES ? (
                  <li className={`pl-3 text-[10px] italic sm:hidden ${hot ? "text-[#f2efe8]/60" : "text-[var(--lx-muted)]"}`}>
                    + {plan.features.length - MOBILE_FEATURES} autres
                  </li>
                ) : null}
              </ul>

              <button
                type="button"
                onClick={() => subscribe.open(plan.id)}
                aria-label={`Choisir ${plan.name}`}
                className={`marketing-btn mt-4 flex h-9 items-center justify-center rounded-full font-serif text-[12px] transition-colors sm:mt-10 sm:h-14 sm:justify-between sm:pl-6 sm:pr-2 sm:text-[16px] ${
                  hot
                    ? "bg-[#f2efe8] text-[#1a1816] hover:bg-white"
                    : "border border-[var(--lx-ink)]/20 hover:border-[var(--lx-ink)]"
                }`}
              >
                <span>
                  <span className="italic">Choisir</span>
                  <span className="hidden sm:inline"> {plan.name}</span>
                </span>
                <span
                  className={`hidden h-10 w-10 place-items-center rounded-full sm:grid ${hot ? "bg-[var(--lx-cherry)] text-[#f2efe8]" : "bg-[var(--lx-ink)] text-[#f2efe8]"}`}
                  aria-hidden
                >
                  ↗
                </span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
