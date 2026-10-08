import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb, ContentShell } from "@/components/seo/content-shell";
import { formatDate, getGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides pour restaurateurs : téléphone, commandes et IA",
  description:
    "Conseils concrets pour les snacks, pizzerias et restaurants : ne plus manquer d’appels, organiser la prise de commande par téléphone, utiliser l’IA au quotidien.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndex() {
  const guides = getGuides();
  return (
    <ContentShell>
      <Breadcrumb items={[{ href: "/", label: "Ligne" }, { label: "Guides" }]} />
      <h1 className="mt-8 font-sans text-[clamp(2rem,4.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em]">
        Guides pour restaurateurs.
      </h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[#4a453f]">
        Téléphone, commandes, organisation du service : des conseils concrets pour les snacks, pizzerias et restaurants.
      </p>
      <ul className="mt-12">
        {guides.map((g) => (
          <li key={g.slug} className="border-t border-[#1a1816]/10 py-6">
            <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-[#8a8175]">
              {formatDate(g.updated ?? g.published)}
            </p>
            <Link href={`/guides/${g.slug}`} className="mt-2 block text-[1.2rem] font-medium tracking-[-0.02em] hover:text-[#5c2a36]">
              {g.title}
            </Link>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[#5c574f]">{g.description}</p>
          </li>
        ))}
      </ul>
    </ContentShell>
  );
}
