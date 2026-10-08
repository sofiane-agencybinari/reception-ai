import fs from "node:fs";
import path from "node:path";

/**
 * Guides SEO : un fichier JSON par article dans src/content/guides/<slug>.json.
 * Ajoutés régulièrement par l'agent de référencement (voir docs/seo/agent-seo.md).
 */
export type GuideSection = { title: string; body: string[]; list?: string[] };
export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  published: string; // AAAA-MM-JJ
  updated?: string;
  lead: string;
  sections: GuideSection[];
  faq?: { q: string; a: string }[];
  /** Slugs de pages /solutions/* à mettre en avant en fin d'article. */
  related?: string[];
};

const DIR = path.join(process.cwd(), "src/content/guides");

export function getGuides(): Guide[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as Guide)
    .sort((a, b) => b.published.localeCompare(a.published));
}

export function getGuide(slug: string) {
  return getGuides().find((g) => g.slug === slug);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}
