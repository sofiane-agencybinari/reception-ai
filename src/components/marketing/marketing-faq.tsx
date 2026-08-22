import { FAQ } from "@/components/marketing/marketing-data";
import { SectionHeader } from "@/components/ui/section-header";

export function MarketingFaq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <SectionHeader
        align="center"
        label="FAQ"
        title="Questions frequentes"
        description="Tout ce que vous devez savoir sur ASTOR et la prise de commande automatisee."
      />
      <div className="mt-12 space-y-3">
        {FAQ.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-white/6 bg-white/[0.02] open:border-astor-accent/20 open:bg-white/[0.04]"
          >
            <summary className="cursor-pointer list-none px-6 py-4 font-medium text-white [&::-webkit-details-marker]:hidden">
              {item.q}
            </summary>
            <p className="border-t border-white/5 px-6 py-4 text-sm leading-relaxed text-zinc-400">
              {item.a}
            </p>
          </details>
        ))}
      </div>
      <div className="mt-10 rounded-2xl border border-white/6 bg-astor-surface p-6 text-center">
        <p className="font-medium text-white">Une autre question ?</p>
        <p className="mt-1 text-sm text-zinc-500">Notre equipe vous repond sous 24h.</p>
        <a
          href="mailto:contact@agencybinari.com"
          className="mt-4 inline-block text-sm font-medium text-astor-accent-soft hover:text-astor-accent-bright"
        >
          contact@agencybinari.com
        </a>
      </div>
    </section>
  );
}
