"use client";

/** Dashboard client immersif — calque AppShell + Analytics, plein viewport. */
export function DashboardImmersive() {
  const bars = [38, 52, 44, 68, 55, 82, 70, 48, 76, 61, 58, 90, 72, 65, 78, 54, 69, 84, 60, 73, 88, 66, 71, 79, 57, 85, 74, 63, 81, 70];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#0c0c0b] text-[#f2efe8]">
      {/* AppShell header — fidèle produit */}
      <header className="shrink-0 border-b border-white/5 bg-[#0c0c0b]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-bold tracking-tight text-white">LIGNE</span>
            <span className="hidden text-[10px] text-zinc-500 sm:inline">Le Palmier</span>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-zinc-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              En ligne
            </span>
          </div>
          <nav className="hidden gap-1 sm:flex">
            {["Hub", "Cuisine", "Analytics", "Clients", "Menu"].map((item, i) => (
              <span
                key={item}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  i === 2 ? "bg-white/10 text-white" : "text-zinc-500"
                }`}
              >
                {item}
              </span>
            ))}
          </nav>
          <span className="rounded-lg border border-white/10 px-3 py-1.5 text-[10px] text-zinc-500">
            Déconnexion
          </span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden px-5 py-5 sm:px-8 sm:py-7">
        <div className="mb-5 shrink-0 sm:mb-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            Le Palmier
          </p>
          <h1 className="mt-1 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Analytics & compta
          </h1>
          <p className="mt-1 text-sm text-zinc-500">CA, volumes, exports — vue temps réel</p>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-4 sm:space-y-5">
          {/* Rapport du jour */}
          <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Rapport du jour
                </p>
                <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  1 247,00 €
                </p>
                <p className="mt-1.5 text-sm text-zinc-500">18 commandes · 42 produits vendus</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                  CA période (30 jours)
                </p>
                <p className="mt-2 text-2xl font-semibold text-zinc-200">14 820,00 €</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#0c0c0b]">
                Export compta produits (CSV)
              </span>
              <span className="rounded-full border border-white/12 px-4 py-2 text-xs font-medium text-zinc-300">
                Export commandes (CSV)
              </span>
            </div>
          </section>

          {/* Metrics */}
          <section className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
            {[
              ["Total", "186"],
              ["Actives", "7"],
              ["Récupérées", "168"],
              ["Annulées", "11"],
              ["Panier moy.", "14,20 €"],
              ["CA période", "14,8k"],
            ].map(([label, value], i) => (
              <div
                key={label}
                className={`rounded-xl border px-2.5 py-3 sm:px-3 ${
                  i === 0
                    ? "border-white/20 bg-white/[0.06]"
                    : "border-white/8 bg-white/[0.02]"
                }`}
              >
                <p className="text-[9px] uppercase tracking-wide text-zinc-500 sm:text-[10px]">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-white sm:text-base">{value}</p>
              </div>
            ))}
          </section>

          {/* Chart + top */}
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
            <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Volume / jour
                </p>
                <div className="flex gap-0.5 rounded-lg border border-white/10 p-0.5">
                  <span className="rounded-md px-2.5 py-1 text-[10px] text-zinc-500">Semaine</span>
                  <span className="rounded-md bg-white/12 px-2.5 py-1 text-[10px] text-white">
                    Mois
                  </span>
                  <span className="rounded-md px-2.5 py-1 text-[10px] text-zinc-500">Année</span>
                </div>
              </div>
              <div className="flex h-36 items-end gap-[3px] sm:h-44 sm:gap-1">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-white/25 to-white/70"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="mt-3 text-[11px] text-zinc-500">
                1 042 unités sur 30 jours · pic vendredi
              </p>
            </section>

            <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Top produits
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  ["Margherita", "64 u", "640 €"],
                  ["Coca 33cl", "51 u", "204 €"],
                  ["Reine", "38 u", "456 €"],
                  ["Tiramisu", "29 u", "174 €"],
                  ["Salade César", "22 u", "198 €"],
                ].map(([name, qty, rev], i) => (
                  <li key={name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-[10px] text-zinc-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate text-sm font-medium text-zinc-200">{name}</span>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold text-white">{rev}</p>
                      <p className="text-[10px] text-zinc-500">{qty}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
