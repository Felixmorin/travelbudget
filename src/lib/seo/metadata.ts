import type { Metadata } from "next";

import type { Destination } from "@/lib/data/destinations";
import { getCityCountryLabel } from "@/lib/data/unified-destinations";

export const siteConfig = {
  name: "GoByBudget.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gobybudget.com",
  title: "GoByBudget.com",
  titleTemplate: "%s | GoByBudget.com",
  description: "AI-powered destination discovery that fits your budget.",
  socialDescription: "Discover the best places to travel based on your budget.",
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
  const canonicalUrl = createCanonicalUrl(path);
  const imageUrl = createCanonicalUrl(image);
  const socialTitle = title && title !== siteConfig.title ? `${title} | ${siteConfig.name}` : siteConfig.title;

  return {
    metadataBase: new URL(normalizedSiteUrl()),
    title: title
      ? title
      : {
          default: siteConfig.title,
          template: siteConfig.titleTemplate,
        },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
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
      description: socialDescription,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        },
      ],
    },
    verification: {
      google: "jVJI4xkMBorppRHJEYHJvFSzE7Eo_QAS-YJYiJVVR20",
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
    title: `${destinationLabel} Travel Budget Guide`,
    description: `See estimated travel costs for ${destinationLabel}, including flights, hotels, food, transport, activities, best months to visit, itinerary ideas, and booking options.`,
    path: `/destinations/${destination.slug}`,
    image: destination.image,
    imageAlt: `${destinationLabel} travel budget guide`,
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
