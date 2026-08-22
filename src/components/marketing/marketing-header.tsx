import Link from "next/link";

const NAV = [
  { href: "/#fonctionnalites", label: "Fonctionnalites" },
  { href: "/#comment", label: "Comment ca marche" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/#faq", label: "FAQ" },
] as const;

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/8 bg-background/70 px-5 py-3 shadow-lg shadow-black/20 backdrop-blur-2xl">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-astor-accent-soft to-teal-900 text-sm font-bold text-white">
            <span className="absolute inset-0 rounded-xl bg-astor-accent/20 blur-md" />
            <span className="relative">A</span>
          </div>
          <div>
            <p className="text-base font-bold tracking-tight text-white">ASTOR</p>
            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-500">Voice AI</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/6 bg-white/[0.03] p-1 lg:flex">
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
            href="/demo"
            className="hidden rounded-full px-3 py-2 text-xs font-medium text-zinc-400 transition hover:text-white md:inline"
          >
            Demo
          </Link>
          <Link
            href="/login"
            className="hidden rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-300 transition hover:text-white sm:inline"
          >
            Connexion
          </Link>
          <a
            href="#contact"
            className="rounded-full bg-astor-accent px-4 py-2 text-xs font-semibold text-white shadow-md shadow-astor-accent/25 transition hover:bg-astor-accent-soft"
          >
            Essai gratuit
          </a>
        </div>
      </div>
    </header>
  );
}
