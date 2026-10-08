import Link from "next/link";

import { AstorLogo } from "@/components/astor-logo";

const COLUMNS = [
  {
    title: "Produit",
    links: [
      { href: "#produits", label: "Parcours" },
      { href: "#capacites", label: "Capacités" },
      { href: "#tarifs", label: "Tarifs" },
      { href: "/#tarifs", label: "S’abonner" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/demo-pizza", label: "Démo vocale", internal: true },
      { href: "/pour-les-restaurants", label: "Pour les restaurants", internal: true },
      { href: "/login", label: "Connexion", internal: true },
    ],
  },
  {
    title: "Contact",
    links: [
      { href: "mailto:contact@agencybinari.com?subject=Support%20Ligne", label: "Support" },
      { href: "mailto:contact@agencybinari.com?subject=Partenariat%20Ligne", label: "Partenariat" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "mailto:contact@agencybinari.com?subject=Mentions%20legales", label: "Mentions légales" },
    ],
  },
] as const;

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[#ddd6cb] bg-[#f3f0ed]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-[42%] justify-center overflow-hidden select-none"
      >
        <span className="font-serif text-[clamp(5rem,20vw,12rem)] font-normal italic leading-none tracking-[-0.04em] text-[#1a1816]/[0.035]">
          LIGNE
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-10 pt-20 sm:pt-24">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-serif text-[11px] uppercase tracking-[0.22em] text-[#1a1816]">
                {col.title}
              </p>
              <ul className="mt-5 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"internal" in link && link.internal ? (
                      <Link
                        href={link.href}
                        className="font-serif text-sm text-[#6f6a62] transition hover:text-[#1a1816]"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="font-serif text-sm text-[#6f6a62] transition hover:text-[#1a1816]"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#ddd6cb] pt-7 text-sm">
          <AstorLogo
            size={26}
            wordmarkClassName="font-serif text-sm tracking-tight text-[#1a1816]"
          />
          <span className="font-serif text-[#8a8175]">© {year}. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  );
}
