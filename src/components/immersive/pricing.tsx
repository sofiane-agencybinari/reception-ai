"use client";

import { useRef, type PointerEvent } from "react";

import { PRICING_PLANS } from "@/components/marketing/marketing-data";

import { gsap, prefersReducedMotion, useGSAP } from "./gsap";
import { SplitReveal } from "./split-reveal";
import { useSubscribe } from "./subscribe-panel";

const perMinute = (v: number) => v.toFixed(2).replace(".", ",");

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
    <section ref={root} id="tarifs" className="relative overflow-hidden bg-[var(--lx-stone)] px-5 py-28 text-[var(--lx-ink)] sm:px-10 sm:py-40">
      <div className="lx-grain" aria-hidden />
      <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <p className="lx-label">(04) — Tarifs</p>
          <SplitReveal className="mt-8 max-w-[14ch] font-sans text-[clamp(2.4rem,5.4vw,5.25rem)] font-medium leading-[1.02] tracking-[-0.045em]">
            Moins cher qu&apos;un <span className="text-[var(--lx-cherry)]">appel raté.</span>
          </SplitReveal>
        </div>
        <p className="max-w-sm font-serif text-[clamp(1.1rem,1.6vw,1.35rem)] leading-snug text-[#5c574f]">
          Abonnement mensuel + minutes consommées. <span className="italic">14 jours offerts,</span> sans engagement,
          résiliable à tout moment.
        </p>
      </div>

      <div data-plans className="relative mt-16 grid gap-4 [perspective:1400px] sm:mt-24 lg:grid-cols-3">
        {PRICING_PLANS.map((plan) => {
          const hot = plan.popular;
          return (
            <article
              key={plan.id}
              data-plan
              onPointerMove={onTilt}
              onPointerLeave={onTiltLeave}
              className={`lx-spot relative flex flex-col rounded-[26px] p-7 [transform-style:preserve-3d] sm:p-9 ${
                hot
                  ? "bg-[var(--lx-cherry)] text-[#f2efe8] shadow-[0_40px_80px_-30px_rgba(92,42,54,0.6)]"
                  : "border border-[var(--lx-line)] bg-[var(--lx-paper)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="lx-title lx-caps text-[1.9rem]">{plan.name}</h3>
                {hot ? (
                  <span className="rounded-full border border-[#f2efe8]/30 px-3 py-1 font-serif text-[13px] italic">
                    le plus choisi
                  </span>
                ) : null}
              </div>
              <p className={`mt-3 text-sm ${hot ? "text-[#f2efe8]/70" : "text-[var(--lx-muted)]"}`}>{plan.description}</p>

              <p className="mt-12 flex items-end gap-2">
                <span className="lx-title text-[clamp(4.8rem,7vw,6.5rem)] leading-[0.8] tabular-nums">{plan.price}</span>
                <span className="pb-1 font-serif text-lg italic">€ / mois</span>
              </p>
              <p className={`mt-3 font-[family-name:var(--font-geist-mono)] text-[11px] ${hot ? "text-[#f2efe8]/65" : "text-[var(--lx-muted)]"}`}>
                + {perMinute(plan.perMinute)} € / minute d&apos;appel
              </p>

              <ul className={`mt-10 flex-1 space-y-3 border-t pt-8 text-sm ${hot ? "border-[#f2efe8]/15" : "border-[var(--lx-line)]"}`}>
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className={hot ? "text-[#f2efe8]/60" : "text-[var(--lx-cherry)]"} aria-hidden>
                      ✦
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => subscribe.open(plan.id)}
                className={`marketing-btn mt-10 flex h-14 items-center justify-between rounded-full pl-6 pr-2 font-serif text-[16px] transition-colors ${
                  hot
                    ? "bg-[#f2efe8] text-[#1a1816] hover:bg-white"
                    : "border border-[var(--lx-ink)]/20 hover:border-[var(--lx-ink)]"
                }`}
              >
                <span>
                  <span className="italic">Choisir</span> {plan.name}
                </span>
                <span
                  className={`grid h-10 w-10 place-items-center rounded-full ${hot ? "bg-[var(--lx-cherry)] text-[#f2efe8]" : "bg-[var(--lx-ink)] text-[#f2efe8]"}`}
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
