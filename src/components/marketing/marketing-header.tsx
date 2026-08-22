import Link from "next/link";

const NAV = [
  { href: "#fonctionnalites", label: "Fonctionnalites" },
  { href: "#comment", label: "Comment ca marche" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
] as const;

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-astor-accent-soft to-teal-900 text-sm font-bold text-white shadow-lg shadow-astor-accent/15">
            A
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">ASTOR</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Voice Orders</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-zinc-400 lg:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/demo"
            className="hidden rounded-full px-4 py-2 text-sm text-zinc-300 transition hover:text-white md:inline"
          >
            Demo live
          </Link>
          <Link
            href="/login"
            className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:border-astor-accent/40 hover:text-white sm:inline"
          >
            Connexion
          </Link>
          <a
            href="#contact"
            className="rounded-full bg-astor-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-astor-accent-soft"
          >
            Essai gratuit
          </a>
        </div>
      </div>
    </header>
  );
}
