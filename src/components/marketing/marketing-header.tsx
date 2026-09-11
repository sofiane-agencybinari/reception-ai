"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { AstorLogo } from "@/components/astor-logo";

const NAV = [
  { href: "/#fonctionnalites", label: "Produit" },
  { href: "/#comment", label: "Parcours" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/#faq", label: "FAQ" },
] as const; // ids: fonctionnalites | comment | tarifs | faq

type Props = {
  ready?: boolean;
};

export function MarketingHeader({ ready = true }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
      initial={{ opacity: 0, y: -20 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{
        delay: reduce ? 0 : ready ? 0.35 : 0,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/[0.07] bg-[#050607]/75 px-4 py-2.5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:px-5">
        <Link href="/" className="transition hover:opacity-90">
          <AstorLogo size={36} priority />
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-3 py-2 text-xs font-medium text-zinc-400 transition hover:text-white sm:inline-flex"
          >
            Connexion
          </Link>
          <a
            href="#contact"
            className="rounded-full bg-astor-accent px-4 py-2 text-xs font-semibold text-white transition hover:bg-astor-accent-soft"
          >
            Essai gratuit
          </a>
        </div>
      </div>
    </motion.header>
  );
}
