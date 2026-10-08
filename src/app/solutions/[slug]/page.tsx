import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AstorLogo } from "@/components/astor-logo";
import { CONTACT_EMAIL, LEGAL_LINKS } from "@/components/legal/legal-page";
import { getSolution, SOLUTION_PAGES } from "@/components/seo/solutions-data";
import { SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SOLUTION_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = getSolution((await params).slug);
  if (!page) return {};
  const path = `/solutions/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      siteName: "Ligne",
      url: `${SITE_URL}${path}`,
      title: `${page.metaTitle} | Ligne`,
      description: page.description,
    },
    twitter: { card: "summary_large_image", title: `${page.metaTitle} | Ligne`, description: page.description },
  };
}

export default async function SolutionPage({ params }: Params) {
  const page = getSolution((await params).slug);
  if (!page) notFound();
  const url = `${SITE_URL}/solutions/${page.slug}`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ligne", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: page.label, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  const related = SOLUTION_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <div className="min-h-screen bg-[#f3f0ed] text-[#1a1816]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="sticky top-0 z-10 border-b border-[#1a1816]/[0.06] bg-[#f3f0ed]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link href="/" aria-label="Ligne — accueil">
            <AstorLogo size={30} wordmarkClassName="text-[#1a1816]" />
          </Link>
          <Link
            href="/#essai"
            className="inline-flex h-9 items-center rounded-full bg-[#5c2a36] px-4 text-[13px] text-[#f3f0ed] hover:bg-[#4a2029]"
          >
            Tester Ligne
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-14">
        <nav aria-label="Fil d’Ariane" className="text-[12px] text-[#8a8175]">
          <Link href="/" className="hover:text-[#1a1816]">Ligne</Link> <span aria-hidden>/</span> {page.label}
        </nav>
        <p className="mt-8 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#5c2a36]">
          {page.eyebrow}
        </p>
        <h1 className="mt-4 font-sans text-[clamp(2rem,4.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em]">{page.h1}</h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[#4a453f]">{page.lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/#essai" className="inline-flex h-11 items-center rounded-full bg-[#1a1816] px-5 text-[14px] text-[#f3f0ed] hover:bg-black">
            Essayer la démo vocale
          </Link>
          <Link href="/#tarifs" className="inline-flex h-11 items-center rounded-full border border-[#1a1816]/20 px-5 text-[14px] hover:border-[#1a1816]/50">
            Voir les tarifs
          </Link>
        </div>

        <div className="mt-14">
          {page.sections.map((s) => (
            <section key={s.title} className="border-t border-[#1a1816]/10 py-8">
              <h2 className="text-[1.3rem] font-medium tracking-[-0.02em]">{s.title}</h2>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#4a453f]">
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.list ? (
                  <ul className="space-y-1.5">
                    {s.list.map((li) => (
                      <li key={li} className="ml-5 list-disc">{li}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <section className="border-t border-[#1a1816]/10 py-8">
          <h2 className="text-[1.3rem] font-medium tracking-[-0.02em]">Questions fréquentes</h2>
          <dl className="mt-4 space-y-5">
            {page.faq.map((f) => (
              <div key={f.q}>
                <dt className="text-[15px] font-medium">{f.q}</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-[#4a453f]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-6 rounded-3xl bg-[#1a1816] px-7 py-10 text-[#f3f0ed]">
          <h2 className="text-[1.5rem] font-medium tracking-[-0.03em]">Entendez-le avant de décider.</h2>
          <p className="mt-2 max-w-lg text-[15px] text-white/65">
            Appelez notre restaurant de démonstration depuis le site et commandez comme un client. Abonnement dès 49 € par mois, sans engagement.
          </p>
          <Link href="/#essai" className="mt-6 inline-flex h-11 items-center rounded-full bg-[#f3f0ed] px-5 text-[14px] text-[#1a1816] hover:bg-white">
            Lancer la démo
          </Link>
        </section>

        <nav aria-label="Autres solutions" className="mt-14">
          <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#8a8175]">À lire aussi</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={`/solutions/${p.slug}`} className="text-[14px] text-[#4a453f] underline underline-offset-4 hover:text-[#1a1816]">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>

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
