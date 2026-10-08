import type { ReactNode } from "react";
import Link from "next/link";

import { AstorLogo } from "@/components/astor-logo";
import { CONTACT_EMAIL, LEGAL_LINKS } from "@/components/legal/legal-page";

type Section = { title: string; body: string[]; list?: string[] };

/** Gabarit des pages de contenu (solutions, guides) : sobre, lisible, aux couleurs de Ligne. */
export function ContentShell({ schema, children }: { schema?: object[]; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f0ed] text-[#1a1816]">
      {schema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /> : null}
      <header className="sticky top-0 z-10 border-b border-[#1a1816]/[0.06] bg-[#f3f0ed]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link href="/" aria-label="Ligne — accueil">
            <AstorLogo size={30} wordmarkClassName="text-[#1a1816]" />
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/guides" className="text-[13px] text-[#5c574f] hover:text-[#1a1816]">
              Guides
            </Link>
            <Link
              href="/#essai"
              className="inline-flex h-9 items-center rounded-full bg-[#5c2a36] px-4 text-[13px] text-[#f3f0ed] hover:bg-[#4a2029]"
            >
              Tester Ligne
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-14">{children}</main>

      <footer className="border-t border-[#1a1816]/10">
        <nav className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-2 px-5 py-8 text-[13px] text-[#5c574f]">
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[#1a1816]">
              {l.label}
            </Link>
          ))}
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#1a1816] sm:ml-auto">
            {CONTACT_EMAIL}
          </a>
        </nav>
      </footer>
    </div>
  );
}

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Fil d’Ariane" className="text-[12px] text-[#8a8175]">
      {items.map((it, i) => (
        <span key={it.label}>
          {i > 0 ? <span aria-hidden> / </span> : null}
          {it.href ? (
            <Link href={it.href} className="hover:text-[#1a1816]">
              {it.label}
            </Link>
          ) : (
            it.label
          )}
        </span>
      ))}
    </nav>
  );
}

export function ContentSections({ sections }: { sections: Section[] }) {
  return (
    <div className="mt-14">
      {sections.map((s) => (
        <section key={s.title} className="border-t border-[#1a1816]/10 py-8">
          <h2 className="text-[1.3rem] font-medium tracking-[-0.02em]">{s.title}</h2>
          <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#4a453f]">
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {s.list ? (
              <ul className="space-y-1.5">
                {s.list.map((li) => (
                  <li key={li} className="ml-5 list-disc">
                    {li}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}

export function FaqBlock({ faq }: { faq: { q: string; a: string }[] }) {
  if (!faq.length) return null;
  return (
    <section className="border-t border-[#1a1816]/10 py-8">
      <h2 className="text-[1.3rem] font-medium tracking-[-0.02em]">Questions fréquentes</h2>
      <dl className="mt-4 space-y-5">
        {faq.map((f) => (
          <div key={f.q}>
            <dt className="text-[15px] font-medium">{f.q}</dt>
            <dd className="mt-1.5 text-[15px] leading-relaxed text-[#4a453f]">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function DemoCta() {
  return (
    <section className="mt-6 rounded-3xl bg-[#1a1816] px-7 py-10 text-[#f3f0ed]">
      <h2 className="text-[1.5rem] font-medium tracking-[-0.03em]">Entendez-le avant de décider.</h2>
      <p className="mt-2 max-w-lg text-[15px] text-white/65">
        Appelez notre restaurant de démonstration depuis le site et commandez comme un client. Abonnement dès 49 € par mois, sans engagement.
      </p>
      <Link href="/#essai" className="mt-6 inline-flex h-11 items-center rounded-full bg-[#f3f0ed] px-5 text-[14px] text-[#1a1816] hover:bg-white">
        Lancer la démo
      </Link>
    </section>
  );
}

export function LinkList({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  if (!links.length) return null;
  return (
    <nav aria-label={title} className="mt-14">
      <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#8a8175]">{title}</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[14px] text-[#4a453f] underline underline-offset-4 hover:text-[#1a1816]">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
