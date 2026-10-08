import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb, ContentSections, ContentShell, DemoCta, FaqBlock, faqSchema, LinkList } from "@/components/seo/content-shell";
import { getSolution, SOLUTION_PAGES } from "@/components/seo/solutions-data";
import { getGuides } from "@/lib/guides";
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
  const guides = getGuides().filter((g) => g.related?.includes(page.slug)).slice(0, 4);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ligne", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: page.label, item: url },
      ],
    },
    faqSchema(page.faq),
  ];

  return (
    <ContentShell schema={schema}>
      <Breadcrumb items={[{ href: "/", label: "Ligne" }, { label: page.label }]} />
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
      <ContentSections sections={page.sections} />
      <FaqBlock faq={page.faq} />
      <DemoCta />
      <LinkList title="Guides" links={guides.map((g) => ({ href: `/guides/${g.slug}`, label: g.title }))} />
      <LinkList
        title="À lire aussi"
        links={SOLUTION_PAGES.filter((p) => p.slug !== page.slug).map((p) => ({ href: `/solutions/${p.slug}`, label: p.label }))}
      />
    </ContentShell>
  );
}
