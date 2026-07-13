import type { Destination } from "@/lib/data/destinations";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";
import { createCanonicalUrl, siteConfig } from "@/lib/seo/metadata";

export type SchemaValue = string | number | boolean | null | SchemaObject | SchemaValue[];

export type SchemaObject = {
  [key: string]: SchemaValue;
};

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type DestinationSchemaInput = Pick<
  Destination,
  "name" | "slug" | "countryCode" | "image" | "shortDescription" | "travelStyles" | "bestMonths"
>;

export type ArticleSchemaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
};

export type ItemListElementInput = {
  name: string;
  url: string;
  description?: string;
};

export type CollectionPageSchemaInput = {
  name: string;
  description: string;
  path: string;
};

export function serializeJsonLd(schema: SchemaObject | SchemaObject[]) {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

export function createWebSiteSchema(): SchemaObject {
  return withContext({
    "@type": "WebSite",
    name: siteConfig.name,
    url: createCanonicalUrl("/"),
    description: siteConfig.description,
  });
}

export function createOrganizationSchema(): SchemaObject {
  return withContext({
    "@type": "Organization",
    name: siteConfig.name,
    url: createCanonicalUrl("/"),
  });
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]): SchemaObject {
  return withContext({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: createCanonicalUrl(item.url),
    })),
  });
}

export function createFAQSchema(faqs: FAQItem[]): SchemaObject {
  return withContext({
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });
}

export function createTravelToolSchema(): SchemaObject {
  return withContext({
    "@type": "WebApplication",
    name: "Travel Budget Calculator",
    url: createCanonicalUrl("/travel-budget-calculator"),
    applicationCategory: "TravelApplication",
    operatingSystem: "Any",
    description:
      "Calculate total trip costs and discover destinations that may fit your budget, departure city, trip length, timing, and travel style.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  });
}

export function createDestinationSchema(destination: DestinationSchemaInput): SchemaObject {
  const destinationLabel = getCityCountryLabel(destination);

  return withContext({
    "@type": "TouristDestination",
    name: destinationLabel,
    url: createCanonicalUrl(`/destinations/${destination.slug}`),
    image: destination.image,
    description: destination.shortDescription,
    identifier: destination.countryCode,
    touristType: destination.travelStyles,
    publicAccess: true,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Best months to visit",
        value: destination.bestMonths.join(", "),
      },
    ],
  });
}

export function createGuideArticleSchema(article: ArticleSchemaInput): SchemaObject {
  return withContext({
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: createCanonicalUrl(article.path),
    ...(article.image ? { image: createCanonicalUrl(article.image) } : {}),
    ...(article.datePublished ? { datePublished: article.datePublished } : {}),
    ...(article.dateModified ? { dateModified: article.dateModified } : {}),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  });
}

export function createCollectionPageSchema(collectionPage: CollectionPageSchemaInput): SchemaObject {
  return withContext({
    "@type": "CollectionPage",
    name: collectionPage.name,
    description: collectionPage.description,
    url: createCanonicalUrl(collectionPage.path),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: createCanonicalUrl("/"),
    },
  });
}

export function createItemListSchema(items: ItemListElementInput[]): SchemaObject {
  return withContext({
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: createCanonicalUrl(item.url),
      ...(item.description ? { description: item.description } : {}),
    })),
  });
}

function withContext(schema: Omit<SchemaObject, "@context">): SchemaObject {
  return {
    "@context": "https://schema.org",
    ...schema,
  };
}
