import Link from "next/link";

const COLUMNS = [
  {
    title: "Produit",
    links: [
      { href: "#comment", label: "Comment ça marche" },
      { href: "#fonctionnalites", label: "Fonctionnalités" },
      { href: "#tarifs", label: "Tarification" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Légal",
    links: [{ href: "mailto:contact@agencybinari.com?subject=Mentions%20legales", label: "Mentions légales" }],
  },
  {
    title: "Contact",
    links: [
      { href: "mailto:contact@agencybinari.com?subject=Support%20ASTOR", label: "Support technique" },
      { href: "mailto:contact@agencybinari.com?subject=Partenariat%20ASTOR", label: "Devenir partenaire" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/login", label: "Connexion", internal: true },
      { href: "/demo", label: "Guide de démarrage", internal: true },
    ],
  },
] as const;

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06]">
      {/* Giant watermark — Yallo-style */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-[42%] justify-center overflow-hidden select-none"
      >
        <span className="font-display text-[clamp(5.5rem,22vw,14rem)] font-bold leading-none tracking-[-0.06em] text-white/[0.045]">
          ASTOR
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-8 pt-16 sm:pt-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-white">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"internal" in link && link.internal ? (
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-500 transition hover:text-zinc-200"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-zinc-500 transition hover:text-zinc-200"
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

        <div className="mt-14 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/[0.06] pt-6 text-sm">
          <span className="font-display font-semibold text-astor-warm">ASTOR</span>
          <span className="text-zinc-600">
            © {year}. Tous droits réservés.
          </span>
        </div>
      </div>
    </footer>
  );
}
