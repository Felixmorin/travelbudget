import type { MetadataRoute } from "next";

import { destinations } from "@/lib/data/destinations";
import { getProgrammaticBudgetPath, programmaticBudgetPages } from "@/lib/programmatic/budget-pages";
import {
  destinationBudgetSeoSlugs,
  durationSeoPages,
  getTravelBudgetPath,
  getTravelCostDurationPath,
} from "@/lib/programmatic/seo-pages";
import { createCanonicalUrl } from "@/lib/seo/metadata";

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: createCanonicalUrl("/"),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: createCanonicalUrl("/tools"),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: createCanonicalUrl("/tools/travel-budget-calculator"),
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: createCanonicalUrl("/destinations"),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: createCanonicalUrl("/about"),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: createCanonicalUrl("/compare"),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: createCanonicalUrl("/guides"),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: createCanonicalUrl("/methodology"),
    changeFrequency: "monthly",
    priority: 0.75,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const destinationRoutes = destinations.map((destination) => ({
    url: createCanonicalUrl(`/destinations/${destination.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));
  const programmaticBudgetRoutes = programmaticBudgetPages.map((page) => ({
    url: createCanonicalUrl(getProgrammaticBudgetPath(page)),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  const destinationBudgetRoutes = destinationBudgetSeoSlugs.map((slug) => ({
    url: createCanonicalUrl(getTravelBudgetPath(slug)),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));
  const durationCostRoutes = durationSeoPages.map((page) => ({
    url: createCanonicalUrl(getTravelCostDurationPath(page.destinationSlug, page.durationDays)),
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  return [
    ...staticRoutes,
    ...destinationRoutes,
    ...programmaticBudgetRoutes,
    ...destinationBudgetRoutes,
    ...durationCostRoutes,
  ];
}
