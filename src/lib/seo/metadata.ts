import type { Metadata } from "next";

import type { Destination } from "@/lib/data/destinations";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";

export const siteConfig = {
  name: "GoByBudget",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gobybudget.com",
  instagramUrl: "https://www.instagram.com/gobybudget/",
  title: "Travel Budget Calculator & Destinations by Budget | GoByBudget",
  titleTemplate: "%s | GoByBudget",
  description:
    "Enter your budget, departure city, trip length, and travel style to find destinations with realistic total trip costs.",
  socialDescription:
    "Find destinations that fit your budget with estimates for flights, stays, food, transport, and activities.",
  ogImage: "/opengraph-image.png",
};

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  socialDescription?: string;
  robots?: Metadata["robots"];
  noIndex?: boolean;
};

const seenIndexableTitles = new Set<string>();

export function createCanonicalUrl(path = "/") {
  return new URL(path, normalizedSiteUrl()).toString();
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.ogImage,
  imageAlt = siteConfig.name,
  socialDescription = siteConfig.socialDescription,
  robots,
  noIndex = false,
}: CreateMetadataOptions = {}): Metadata {
  const resolvedTitle = normalizeSeoText(title ?? siteConfig.title, "title");
  const resolvedDescription = normalizeSeoText(description, "description");
  const canonicalUrl = createCanonicalUrl(path);
  const imageUrl = createCanonicalUrl(image);
  const socialTitle = createSocialTitle(resolvedTitle);
  validateMetadata({
    title: resolvedTitle,
    description: resolvedDescription,
    path,
    noIndex,
    robots,
  });

  return {
    metadataBase: new URL(normalizedSiteUrl()),
    title: title
      ? resolvedTitle
      : {
          default: siteConfig.title,
          template: siteConfig.titleTemplate,
        },
    description: resolvedDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: socialTitle,
      description: socialDescription || resolvedDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription || resolvedDescription,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        },
      ],
    },
    verification: {
      google: [
        "jVJI4xkMBorppRHJEYHJvFSzE7Eo_QAS-YJYiJVVR20",
        "P_0ixPeiLlHMDQNChAQGfZWFmbV0itnPSvZkye21dFw",
      ],
    },
    robots:
      robots ??
      (noIndex
        ? {
            index: false,
            follow: true,
          }
        : undefined),
  };
}

export function createDestinationMetadata(destination: Destination): Metadata {
  const destinationLabel = getCityCountryLabel(destination);

  return createMetadata({
    title: `${destinationLabel} Travel Budget: Daily & Total Trip Cost`,
    description: `Plan a ${destinationLabel} travel budget with estimated daily costs, total trip cost, flights, hotels, food, transport, activities, and best months to visit.`,
    path: `/destinations/${destination.slug}`,
    image: destination.image,
    imageAlt: `${destinationLabel} travel budget`,
    socialDescription: `See estimated daily and total trip costs for ${destinationLabel}, including flights, stays, food, transport, and activities.`,
  });
}

export function createResultsMetadata(): Metadata {
  return createMetadata({
    title: "Travel Budget Results",
    description: "Compare destinations based on your travel budget, trip length, travel style, and departure city.",
    path: "/results",
    robots: {
      index: false,
      follow: true,
    },
  });
}

export function createToolMetadata({
  title,
  description,
  path,
}: Required<Pick<CreateMetadataOptions, "title" | "description" | "path">>): Metadata {
  return createMetadata({
    title,
    description,
    path,
  });
}

function normalizedSiteUrl() {
  return siteConfig.url.endsWith("/") ? siteConfig.url : `${siteConfig.url}/`;
}

function normalizeSeoText(value: string, field: "title" | "description") {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (!normalized) {
    throw new Error(`SEO ${field} must not be empty.`);
  }

  return normalized;
}

function createSocialTitle(title: string) {
  return title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
}

function validateMetadata({
  title,
  description,
  path,
  noIndex,
  robots,
}: {
  title: string;
  description: string;
  path: string;
  noIndex: boolean;
  robots?: Metadata["robots"];
}) {
  const isIndexable = !noIndex && !hasNoIndexDirective(robots);

  if (title.length < 20 || title.length > 70) {
    warnSeo(`Title length is ${title.length} characters for ${path}: "${title}"`);
  }

  if (description.length < 70 || description.length > 165) {
    warnSeo(`Meta description length is ${description.length} characters for ${path}: "${description}"`);
  }

  if (!isIndexable) {
    return;
  }

  const duplicateKey = title.toLowerCase();

  if (seenIndexableTitles.has(duplicateKey)) {
    warnSeo(`Duplicate indexable title detected for ${path}: "${title}"`);
    return;
  }

  seenIndexableTitles.add(duplicateKey);
}

function hasNoIndexDirective(robots: Metadata["robots"] | undefined) {
  return Boolean(robots && typeof robots === "object" && "index" in robots && robots.index === false);
}

function warnSeo(message: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[seo] ${message}`);
  }
}
