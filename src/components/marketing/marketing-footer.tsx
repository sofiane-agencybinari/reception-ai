import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#050608]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-sm font-bold text-black">A</div>
            <p className="text-lg font-bold text-white">ASTOR</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
            L&apos;IA qui prend vos commandes par telephone, les envoie en cuisine et vous donne la visibilite sur vos ventes.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Produit</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-500">
            <li><a href="#fonctionnalites" className="hover:text-white">Fonctionnalites</a></li>
            <li><Link href="/demo" className="hover:text-white">Demo vocale</Link></li>
            <li><a href="#tarifs" className="hover:text-white">Tarifs</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Compte</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-500">
            <li><Link href="/login" className="hover:text-white">Espace restaurant</Link></li>
            <li><a href="mailto:contact@agencybinari.com" className="hover:text-white">Contact commercial</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} ASTOR
      </div>
    </footer>
  );
}
