import { CalendarDays, Package, ShoppingBag } from "lucide-react";

type Props = {
  itemCount: number;
};

const STATS = [
  {
    icon: Package,
    getValue: (count: number) => (count > 0 ? String(count) : "70+"),
    label: "produits au menu",
  },
  {
    icon: ShoppingBag,
    getValue: () => "Sur place",
    label: "& à emporter",
  },
  {
    icon: CalendarDays,
    getValue: () => "7j/7",
    label: "ouvert toute la semaine",
  },
] as const;

export function ElBahjaStats({ itemCount }: Props) {
  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-10 sm:py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
        {STATS.map(({ icon: Icon, getValue, label }) => (
          <div key={label} className="flex flex-col items-center text-center sm:flex-row sm:gap-4 sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-astor-accent/10 text-astor-accent-soft">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white sm:text-4xl">{getValue(itemCount)}</p>
              <p className="mt-0.5 text-xs uppercase tracking-wider text-zinc-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
