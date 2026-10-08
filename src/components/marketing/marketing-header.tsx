"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { AstorLogo } from "@/components/astor-logo";
import { useSubscribe } from "@/components/immersive/subscribe-panel";

const NAV = [
  { href: "#produits", label: "Produit", id: "produits" },
  { href: "#capacites", label: "Capacités", id: "capacites" },
  { href: "#tarifs", label: "Tarifs", id: "tarifs" },
  { href: "#essai", label: "Démo", id: "essai" },
] as const;

type Props = {
  ready?: boolean;
};

export function MarketingHeader({ ready = true }: Props) {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const subscribe = useSubscribe();
  const [active, setActive] = useState<string>("produits");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
      // Sombre au-dessus des sections [data-tone="dark"] ou pendant l'immersion du récit.
      const probe = document.elementsFromPoint(window.innerWidth / 2, 72).find((el) => !el.closest("header"));
      const overDark = probe?.closest("[data-tone]")?.getAttribute("data-tone") === "dark";
      setDark(overDark || document.documentElement.dataset.storyTone === "dark");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("astor:tone", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("astor:tone", onScroll);
    };
  }, []);

  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.1, 0.4, 0.7] },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Texte clair sur le hero (photo) et sur les zones sombres.
  const light = !scrolled || dark;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8"
      initial={{ opacity: 0, y: -12 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
      transition={{
        delay: reduce ? 0 : ready ? 0.15 : 0,
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {/* Fond fondu pleine largeur : flou + teinte qui s'évanouissent vers le bas, sans bord. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[150%] backdrop-blur-xl transition-[opacity,background] duration-500"
        style={{
          opacity: scrolled ? 1 : 0,
          background: dark
            ? "linear-gradient(to bottom, rgba(18,10,12,0.78), rgba(18,10,12,0.35) 60%, transparent)"
            : "linear-gradient(to bottom, rgba(235,230,222,0.85), rgba(235,230,222,0.4) 60%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent)",
          maskImage: "linear-gradient(to bottom, #000 55%, transparent)",
        }}
      />
      <div className="mx-auto flex max-w-6xl items-center justify-between py-1.5">
        <Link href="/" className="marketing-btn">
          <AstorLogo
            size={34}
            wordmarkClassName={`font-serif text-[14px] tracking-[0.06em] transition-colors ${
              !light ? "text-[#1a1816]" : "text-[#f2efe8]/85"
            }`}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`font-serif text-[12px] tracking-[0.04em] transition-colors duration-200 ${
                  !light
                    ? isActive
                      ? "text-[#1a1816]"
                      : "text-[#8a8175] hover:text-[#1a1816]"
                    : isActive
                      ? "text-[#f2efe8]"
                      : "text-[#f2efe8]/45 hover:text-[#f2efe8]/85"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href="/login"
            className={`hidden font-serif text-[12px] transition sm:inline-flex ${
              !light
                ? "text-[#8a8175] hover:text-[#1a1816]"
                : "text-[#f2efe8]/45 hover:text-[#f2efe8]"
            }`}
          >
            Connexion
          </Link>
          <a
            href="#essai"
            className={`marketing-btn hidden font-serif text-[12px] tracking-[0.04em] transition sm:inline-flex ${
              !light
                ? "text-[#1a1816] underline decoration-[#1a1816]/30 underline-offset-[5px] hover:decoration-[#1a1816]"
                : "text-[#f2efe8]/80 underline decoration-[#f2efe8]/30 underline-offset-[5px] hover:decoration-[#f2efe8]"
            }`}
          >
            Tester Ligne
          </a>
          <button
            type="button"
            onClick={() => subscribe.open("pro")}
            className={`marketing-btn h-9 rounded-full px-4 text-[12px] font-medium transition-colors duration-300 ${
              !light ? "bg-[#1a1816] text-[#f2efe8] hover:bg-[#5c2a36]" : "bg-[#f2efe8] text-[#1a1816] hover:bg-white"
            }`}
          >
            S’abonner
          </button>
        </div>
      </div>
    </motion.header>
  );
}
