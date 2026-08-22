import { Phone } from "lucide-react";

import { EL_BAHJA } from "@/lib/el-bahja";

export function ElBahjaCtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-astor-accent via-teal-700 to-slate-900 px-8 py-14 text-center sm:px-16 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="relative">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Prêt à commander ?</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-teal-100/80">
            Passez votre commande par téléphone — emporter ou sur place. Notre équipe vous
            accueille au {EL_BAHJA.address}, {EL_BAHJA.city}.
          </p>
          <a
            href={`tel:${EL_BAHJA.phone}`}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-teal-900 transition hover:bg-teal-50"
          >
            <Phone className="h-4 w-4" />
            {EL_BAHJA.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
