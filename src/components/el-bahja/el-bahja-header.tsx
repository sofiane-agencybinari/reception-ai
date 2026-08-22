"use client";

import { Phone } from "lucide-react";

import { EL_BAHJA } from "@/lib/el-bahja";

const NAV_LINKS = [
  { href: "#carte", label: "Carte" },
  { href: "#commander", label: "Commander" },
  { href: "#infos", label: "Infos" },
] as const;

export function ElBahjaHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-astor-accent-soft to-teal-800 text-sm font-bold text-white shadow-lg shadow-astor-accent/20">
            EB
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">{EL_BAHJA.name}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Montpellier</p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href={`tel:${EL_BAHJA.phone}`}
          className="inline-flex items-center gap-2 rounded-full bg-astor-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-astor-accent-soft"
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Appeler</span>
        </a>
      </div>
    </header>
  );
}
