import type { MetadataRoute } from "next";

import { SOLUTION_PAGES } from "@/components/seo/solutions-data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const legal = ["/mentions-legales", "/confidentialite", "/cgv", "/cookies"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.2,
  }));

  return [
    ...legal,
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/pour-les-restaurants`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/demo`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/demo-pizza`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...SOLUTION_PAGES.map((p) => ({
      url: `${SITE_URL}/solutions/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
