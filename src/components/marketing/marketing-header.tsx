import Link from "next/link";

const NAV = [
  { href: "/#fonctionnalites", label: "Produit" },
  { href: "/#comment", label: "Parcours" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/#faq", label: "FAQ" },
] as const;

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/[0.07] bg-[#050607]/75 px-4 py-2.5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:px-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <span className="absolute inset-0 rounded-xl bg-astor-accent/30 blur-md" />
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-astor-accent-soft to-[#1a4a44] font-display text-sm font-bold text-white">
              A
            </span>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">ASTOR</span>
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
            className="hidden rounded-full px-3 py-2 text-xs font-medium text-zinc-400 transition hover:text-white sm:inline"
          >
            Connexion
          </Link>
          <a
            href="#contact"
            className="rounded-full bg-astor-accent px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-astor-accent/20 transition hover:bg-astor-accent-soft"
          >
            Essai gratuit
          </a>
        </div>
      </div>
    </header>
  );
}
