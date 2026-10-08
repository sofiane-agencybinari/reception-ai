import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb, ContentSections, ContentShell, DemoCta, FaqBlock, faqSchema, LinkList } from "@/components/seo/content-shell";
import { SOLUTION_PAGES } from "@/components/seo/solutions-data";
import { formatDate, getGuide, getGuides } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  const path = `/guides/${guide.slug}`;
  return {
    title: guide.metaTitle,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      siteName: "Ligne",
      url: `${SITE_URL}${path}`,
      title: `${guide.metaTitle} | Ligne`,
      description: guide.description,
      publishedTime: guide.published,
      modifiedTime: guide.updated ?? guide.published,
    },
    twitter: { card: "summary_large_image", title: `${guide.metaTitle} | Ligne`, description: guide.description },
  };
}

export default async function GuidePage({ params }: Params) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const url = `${SITE_URL}/guides/${guide.slug}`;
  const faq = guide.faq ?? [];

  const schema: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      inLanguage: "fr-FR",
      datePublished: guide.published,
      dateModified: guide.updated ?? guide.published,
      mainEntityOfPage: url,
      image: `${SITE_URL}/opengraph-image.png`,
      author: { "@type": "Organization", name: "Ligne", url: SITE_URL },
      publisher: { "@type": "Organization", name: "Ligne", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/ligne-icon.png` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ligne", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
  ];
  if (faq.length) schema.push(faqSchema(faq));

  const solutions = SOLUTION_PAGES.filter((p) => guide.related?.includes(p.slug));
  const others = getGuides().filter((g) => g.slug !== guide.slug).slice(0, 6);

  return (
    <ContentShell schema={schema}>
      <Breadcrumb items={[{ href: "/", label: "Ligne" }, { href: "/guides", label: "Guides" }, { label: guide.title }]} />
      <p className="mt-8 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#5c2a36]">
        Guide · {formatDate(guide.updated ?? guide.published)}
      </p>
      <h1 className="mt-4 font-sans text-[clamp(2rem,4.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em]">{guide.title}</h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[#4a453f]">{guide.lead}</p>
      <ContentSections sections={guide.sections} />
      <FaqBlock faq={faq} />
      <DemoCta />
      <LinkList title="Solutions Ligne" links={solutions.map((p) => ({ href: `/solutions/${p.slug}`, label: p.label }))} />
      <LinkList title="Autres guides" links={others.map((g) => ({ href: `/guides/${g.slug}`, label: g.title }))} />
    </ContentShell>
  );
}
