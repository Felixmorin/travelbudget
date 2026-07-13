import type { MetadataRoute } from "next";

import { destinations } from "@/lib/data/destinations";
import { cityDestinations } from "@/lib/data/destination-hub";
import { longTailGuides } from "@/lib/data/guides";
import { strongSeoPages } from "@/lib/programmatic/strong-seo-pages";
import { getIndexableDepartureCityPages } from "@/lib/programmatic/departure-pages";
import { getIndexableSeoPages } from "@/lib/programmatic/seo-registry";
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
    url: createCanonicalUrl("/travel-budget-calculator"),
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
  const programmaticSeoRoutes = getIndexableSeoPages().map((page) => ({
    url: createCanonicalUrl(page.path),
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
  const departureCityRoutes = getIndexableDepartureCityPages().map((page) => ({
    url: createCanonicalUrl(page.path),
    lastModified: page.origin.lastUpdated,
    changeFrequency: "monthly" as const,
    priority: page.origin.seoPriority,
  }));

  return uniqueSitemapUrls([
    ...staticRoutes,
    ...destinationRoutes,
    ...cityDestinationRoutes,
    ...guideRoutes,
    ...strongSeoRoutes,
    ...programmaticSeoRoutes,
    ...departureCityRoutes,
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
