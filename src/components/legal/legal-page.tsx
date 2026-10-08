import type { ReactNode } from "react";
import Link from "next/link";

import { AstorLogo } from "@/components/astor-logo";

export const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cgv", label: "Conditions d’abonnement" },
  { href: "/cookies", label: "Cookies" },
] as const;

export const CONTACT_EMAIL = "contact@agencybinari.com";

/** Champ à compléter par l'éditeur : volontairement très visible tant qu'il n'est pas rempli. */
export function ToFill({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-[#f5e27a]/70 px-1 py-0.5 text-[#1a1816]">
      [À compléter : {children}]
    </mark>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[#1a1816]/10 py-8">
      <h2 className="text-[1.15rem] font-medium tracking-[-0.02em]">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#4a453f] [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </section>
  );
}

/** Gabarit commun aux pages légales : sobre, lisible, aux couleurs de Ligne. */
export function LegalPage({ title, updated, intro, children }: { title: string; updated: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f0ed] text-[#1a1816]">
      <header className="sticky top-0 z-10 border-b border-[#1a1816]/[0.06] bg-[#f3f0ed]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link href="/" aria-label="Ligne — accueil">
            <AstorLogo size={30} wordmarkClassName="text-[#1a1816]" />
          </Link>
          <Link href="/" className="text-[13px] text-[#5c574f] hover:text-[#1a1816]">
            ← Retour au site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-14">
        <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#8a8175]">
          Informations légales · mise à jour le {updated}
        </p>
        <h1 className="mt-4 font-sans text-[clamp(2rem,4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.04em]">{title}</h1>
        {intro ? <div className="mt-5 text-[15px] leading-relaxed text-[#5c574f]">{intro}</div> : null}
        <div className="mt-10">{children}</div>
      </main>

      <footer className="border-t border-[#1a1816]/10">
        <nav className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-2 px-5 py-8 text-[13px] text-[#5c574f]">
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[#1a1816]">
              {l.label}
            </Link>
          ))}
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#1a1816] sm:ml-auto">
            {CONTACT_EMAIL}
          </a>
        </nav>
      </footer>
    </div>
  );
}
