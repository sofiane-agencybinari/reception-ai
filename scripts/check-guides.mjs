#!/usr/bin/env node
/**
 * Contrôle des guides SEO (src/content/guides/*.json) avant publication.
 * Usage : node scripts/check-guides.mjs   → code de sortie 1 si un guide est invalide.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "src/content/guides");
const SOLUTIONS = fs.readFileSync(path.join(process.cwd(), "src/components/seo/solutions-data.ts"), "utf8");
const solutionSlugs = [...SOLUTIONS.matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]);
const BANNED = [/essai gratuit/i, /gratuit pendant/i, /\bwesh\b/i, /\bAstor\b/i, /n[°o] ?1/i, /\d+ ?(clients|restaurants) (nous font|satisfaits)/i];

const errors = [];
const slugs = new Set();
const titles = new Set();
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const where = `${file} :`;
  let g;
  try {
    g = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8"));
  } catch (e) {
    errors.push(`${where} JSON invalide (${e.message})`);
    continue;
  }
  const words = [g.lead, ...(g.sections ?? []).flatMap((s) => [...(s.body ?? []), ...(s.list ?? [])]), ...(g.faq ?? []).map((f) => f.a)]
    .join(" ")
    .split(/\s+/).length;

  if (file !== `${g.slug}.json`) errors.push(`${where} le nom de fichier doit être <slug>.json`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(g.slug ?? "")) errors.push(`${where} slug invalide`);
  if (slugs.has(g.slug)) errors.push(`${where} slug en double`);
  if (titles.has(g.title)) errors.push(`${where} titre en double`);
  slugs.add(g.slug);
  titles.add(g.title);
  for (const k of ["title", "metaTitle", "description", "lead", "published"]) if (!g[k]) errors.push(`${where} champ « ${k} » manquant`);
  if (g.metaTitle && g.metaTitle.length > 65) errors.push(`${where} metaTitle trop long (${g.metaTitle.length} > 65)`);
  if (g.description && (g.description.length < 110 || g.description.length > 165)) errors.push(`${where} description hors 110-165 caractères (${g.description.length})`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(g.published ?? "")) errors.push(`${where} published au format AAAA-MM-JJ`);
  if (!Array.isArray(g.keywords) || g.keywords.length < 3) errors.push(`${where} au moins 3 mots-clés`);
  if (!Array.isArray(g.sections) || g.sections.length < 4) errors.push(`${where} au moins 4 sections`);
  if (words < 600) errors.push(`${where} contenu trop court (${words} mots, minimum 600)`);
  for (const r of g.related ?? []) if (!solutionSlugs.includes(r)) errors.push(`${where} related « ${r} » n'est pas une page /solutions`);
  const text = JSON.stringify(g);
  for (const re of BANNED) if (re.test(text)) errors.push(`${where} formulation interdite : ${re}`);
}

if (errors.length) {
  console.error(`❌ ${errors.length} problème(s) :\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`✅ ${files.length} guide(s) valides.`);
