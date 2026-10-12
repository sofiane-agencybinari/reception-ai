/**
 * Adresse officielle du site (canonique, sitemap, partages, retours de paiement).
 * Un seul endroit à changer lors du passage au domaine définitif : la variable NEXT_PUBLIC_APP_URL.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://ligne-ai.com").replace(/\/$/, "");

/**
 * Images de partage (src/app/opengraph-image.jpg et twitter-image.jpg). À reprendre dans chaque page qui définit
 * son propre `openGraph` / `twitter` : sans elles, Next.js n'hérite pas de l'image et le partage s'affiche sans visuel.
 */
export const OG_IMAGE = { url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "Ligne — le standard téléphonique IA des restaurants" };
export const TWITTER_IMAGE = { url: "/twitter-image.jpg", width: 1200, height: 630, alt: OG_IMAGE.alt };
