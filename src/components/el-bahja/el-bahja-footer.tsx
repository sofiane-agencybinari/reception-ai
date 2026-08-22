import Link from "next/link";

import { EL_BAHJA } from "@/lib/el-bahja";

export function ElBahjaFooter() {
  return (
    <footer className="border-t border-white/5 bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-semibold text-white">{EL_BAHJA.name}</p>
          <p className="mt-1 text-sm text-zinc-500">
            {EL_BAHJA.address}, {EL_BAHJA.city}
          </p>
          <a
            href={`tel:${EL_BAHJA.phone}`}
            className="mt-1 inline-block text-sm text-astor-accent-soft hover:text-astor-accent-bright"
          >
            {EL_BAHJA.phoneDisplay}
          </a>
        </div>

        <div className="flex flex-col items-center gap-2 sm:items-end">
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-zinc-500">
            <a href="#carte" className="transition hover:text-white">
              Carte
            </a>
            <a href="#commander" className="transition hover:text-white">
              Commander
            </a>
            <a href="#infos" className="transition hover:text-white">
              Infos
            </a>
          </nav>
          <p className="text-xs text-zinc-600">
            Propulsé par{" "}
            <Link href="/" className="text-zinc-500 transition hover:text-astor-accent-soft">
              ASTOR
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
