import type { NextConfig } from "next";

/** Ancienne adresse Vercel : redirigée en 301 dès que NEXT_PUBLIC_APP_URL pointe vers le domaine définitif. */
const LEGACY_HOST = "reception-ai-zeta.vercel.app";
const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL?.trim() || `https://${LEGACY_HOST}`).replace(/\/$/, "");

const nextConfig: NextConfig = {
  // pdfkit lit les fichiers .afm depuis son dossier data au runtime ;
  // sans externalisation, Next les omet du bundle serverless → 500 en prod.
  serverExternalPackages: ["pdfkit"],
  transpilePackages: ["three"],
  outputFileTracingIncludes: {
    "/api/menu-items/pdf": ["./node_modules/pdfkit/js/data/**/*"],
  },
  async redirects() {
    const host = new URL(SITE_URL).host;
    if (host === LEGACY_HOST) return [];
    // Ancienne adresse Vercel et variante www → domaine officiel (301).
    return [LEGACY_HOST, `www.${host}`].map((value) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value }],
      destination: `${SITE_URL}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
