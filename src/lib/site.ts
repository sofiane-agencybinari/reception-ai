/**
 * Adresse officielle du site (canonique, sitemap, partages, retours de paiement).
 * Un seul endroit à changer lors du passage au domaine définitif : la variable NEXT_PUBLIC_APP_URL.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://reception-ai-zeta.vercel.app").replace(/\/$/, "");
