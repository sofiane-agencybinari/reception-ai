import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit lit les fichiers .afm depuis son dossier data au runtime ;
  // sans externalisation, Next les omet du bundle serverless → 500 en prod.
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/api/menu-items/pdf": ["./node_modules/pdfkit/js/data/**/*"],
  },
};

export default nextConfig;
