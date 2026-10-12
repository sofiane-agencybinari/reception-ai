import type { Metadata } from "next";

import { Breadcrumb, ContentShell } from "@/components/seo/content-shell";

import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Nous contacter — Ligne, la prise de commande par téléphone",
  description:
    "Une question sur Ligne ? Laissez vos coordonnées et nous vous rappelons rapidement, ou contactez-nous directement par téléphone ou par e-mail.",
  alternates: { canonical: "/contact" },
};

const PHONE = "06 95 84 64 41";
const PHONE_LINK = "+33695846441";
const EMAIL = "Ligne.AI@outlook.com";

export default function ContactPage() {
  return (
    <ContentShell>
      <Breadcrumb items={[{ href: "/", label: "Ligne" }, { label: "Nous contacter" }]} />
      <h1 className="mt-8 font-sans text-[clamp(2rem,4.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em]">
        Parlons de votre restaurant.
      </h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[#4a453f]">
        Une question, un devis pour plusieurs établissements, ou simplement envie d’en savoir plus ? Laissez vos
        coordonnées : nous vous rappelons rapidement.
      </p>

      <div className="mt-10">
        <ContactForm />
      </div>

      <section className="mt-12 border-t border-[#1a1816]/10 pt-10">
        <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#8a8175]">
          Nous joindre directement
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href={`tel:${PHONE_LINK}`}
            className="rounded-2xl border border-[#1a1816]/10 bg-white/60 px-5 py-4 transition hover:border-[#5c2a36]/40"
          >
            <span className="block text-[12px] text-[#8a8175]">Téléphone</span>
            <span className="mt-1 block text-[18px] font-medium tracking-[-0.01em] text-[#1a1816]">{PHONE}</span>
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-2xl border border-[#1a1816]/10 bg-white/60 px-5 py-4 transition hover:border-[#5c2a36]/40"
          >
            <span className="block text-[12px] text-[#8a8175]">E-mail</span>
            <span className="mt-1 block break-all text-[18px] font-medium tracking-[-0.01em] text-[#1a1816]">{EMAIL}</span>
          </a>
        </div>
        <p className="mt-5 text-[14px] text-[#5c574f]">
          Sofiane Aokache, fondateur · AOS — Neuilly-sur-Seine, Paris et Île-de-France.
        </p>
      </section>
    </ContentShell>
  );
}
