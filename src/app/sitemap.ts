import type { MetadataRoute } from "next";

import { destinations } from "@/lib/data/destinations";
import { cityDestinations } from "@/lib/data/destination-hub";
import { longTailGuides } from "@/lib/data/guides";
import { comparisonPages, getComparisonPath } from "@/lib/programmatic/comparison-pages";
import { getProgrammaticBudgetPath, programmaticBudgetPages } from "@/lib/programmatic/budget-pages";
import { strongSeoPages } from "@/lib/programmatic/strong-seo-pages";
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
    url: createCanonicalUrl("/travel-budget"),
    changeFrequency: "monthly",
    priority: 0.92,
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
    url: createCanonicalUrl("/contact"),
    changeFrequency: "yearly",
    priority: 0.4,
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
    url: createCanonicalUrl("/travel-extras"),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: createCanonicalUrl("/methodology"),
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    url: createCanonicalUrl("/privacy"),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: createCanonicalUrl("/terms"),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: createCanonicalUrl("/affiliate-disclosure"),
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const destinationRoutes = destinations.map((destination) => ({
    url: createCanonicalUrl(`/destinations/${destination.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));
  const cityDestinationRoutes = cityDestinations.map((destination) => ({
    url: createCanonicalUrl(`/destinations/${destination.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.82,
  }));
  const comparisonRoutes = comparisonPages.map((page) => ({
    url: createCanonicalUrl(getComparisonPath(page)),
    changeFrequency: "monthly" as const,
    priority: 0.78,
  }));
  const guideRoutes = longTailGuides.map((guide) => ({
    url: createCanonicalUrl(`/guides/${guide.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.74,
  }));
  const strongSeoRoutes = strongSeoPages.map((page) => ({
    url: createCanonicalUrl(page.path),
    changeFrequency: "monthly" as const,
    priority: 0.82,
  }));
  const programmaticBudgetRoutes = programmaticBudgetPages.map((page) => ({
    url: createCanonicalUrl(getProgrammaticBudgetPath(page)),
    changeFrequency: "monthly" as const,
    priority: 0.76,
  }));

  return uniqueSitemapUrls([
    ...staticRoutes,
    ...destinationRoutes,
    ...cityDestinationRoutes,
    ...comparisonRoutes,
    ...guideRoutes,
    ...strongSeoRoutes,
    ...programmaticBudgetRoutes,
  ]);
}

function uniqueSitemapUrls(routes: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();

  return routes.filter((route) => {
    if (seen.has(route.url)) {
      return false;
    }

    seen.add(route.url);
    return true;
  });
}
