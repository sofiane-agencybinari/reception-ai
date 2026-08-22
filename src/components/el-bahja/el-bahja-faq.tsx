import { EL_BAHJA } from "@/lib/el-bahja";

const FAQ_ITEMS = [
  {
    q: "Comment passer commande ?",
    a: `Appelez le ${EL_BAHJA.phoneDisplay} et indiquez vos choix. Notre équipe confirme votre commande et l'heure de retrait.`,
  },
  {
    q: "Proposez-vous la livraison ?",
    a: "Non, nous proposons uniquement le retrait sur place et les commandes à emporter au restaurant.",
  },
  {
    q: "Puis-je consulter le menu en ligne ?",
    a: "Oui, la carte complète est disponible sur cette page. Vous pouvez aussi télécharger le menu en PDF.",
  },
  {
    q: "Quels sont vos horaires ?",
    a: "Du lundi au vendredi de 11h à 22h, et le week-end de 11h à 23h. Horaires indicatifs.",
  },
] as const;

export function ElBahjaFaq() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-20">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
          Questions fréquentes
        </p>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">FAQ</h2>
      </div>

      <div className="mt-10 space-y-3">
        {FAQ_ITEMS.map(({ q, a }) => (
          <details
            key={q}
            className="group glass-card rounded-xl [&[open]]:border-astor-accent/20"
          >
            <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {q}
                <span className="shrink-0 text-astor-accent-soft transition group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <div className="border-t border-white/5 px-5 pb-4 pt-3 text-sm leading-relaxed text-zinc-400">
              {a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
