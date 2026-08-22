import { Clock, MapPin, Phone } from "lucide-react";

import { EL_BAHJA } from "@/lib/el-bahja";

export function ElBahjaInfos() {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(`${EL_BAHJA.address}, ${EL_BAHJA.city}`)}`;

  return (
    <section id="infos" className="border-t border-white/5 bg-astor-surface py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
            Infos pratiques
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Nous trouver</h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <article className="glass-card rounded-2xl p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-astor-accent/10 text-astor-accent-soft">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-white">Adresse</h3>
            <p className="mt-2 text-sm text-zinc-400">{EL_BAHJA.address}</p>
            <p className="text-sm text-zinc-400">{EL_BAHJA.city}</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-medium text-astor-accent-soft hover:text-astor-accent-bright"
            >
              Voir sur Google Maps →
            </a>
          </article>

          <article className="glass-card rounded-2xl p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-astor-accent/10 text-astor-accent-soft">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-white">Horaires</h3>
            <ul className="mt-3 space-y-2">
              {EL_BAHJA.hours.map((slot) => (
                <li key={slot.days} className="flex justify-between gap-3 text-sm">
                  <span className="text-zinc-400">{slot.days}</span>
                  <span className="font-medium text-zinc-200">{slot.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-zinc-600">Horaires indicatifs</p>
          </article>

          <article className="glass-card rounded-2xl p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-astor-accent/10 text-astor-accent-soft">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-white">Téléphone</h3>
            <a
              href={`tel:${EL_BAHJA.phone}`}
              className="mt-2 block text-2xl font-bold text-astor-accent-soft hover:text-astor-accent-bright"
            >
              {EL_BAHJA.phoneDisplay}
            </a>
            <p className="mt-3 text-sm text-zinc-500">
              Appelez pour passer commande — sur place ou à emporter.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
