import type { Metadata } from "next";

import {
  type DestinationSearchParams,
  DestinationsExplorer,
} from "@/components/destinations/destinations-explorer";
import { cityDestinations } from "@/lib/data/destination-hub";
import { createMetadata } from "@/lib/seo/metadata";
import {
  createBreadcrumbSchema,
  createCollectionPageSchema,
  createFAQSchema,
  createItemListSchema,
  serializeJsonLd,
  type FAQItem,
} from "@/lib/seo/schema";

export const metadata: Metadata = createMetadata({
  title: "Travel Destinations Explorer: Compare Trip Costs",
  description:
    "Explore travel destinations by departure city, season, duration, travel style, and estimated trip cost. Compare flights, stays, food, activities, and daily budgets.",
  path: "/destinations",
  socialDescription:
    "Compare travel destinations by estimated trip cost, season, duration, departure city, and travel style.",
});

const destinationsFaqItems: FAQItem[] = [
  {
    question: "What can I compare on the destinations page?",
    answer:
      "You can compare destinations by estimated total trip cost, daily budget, departure city, trip duration, best travel months, continent, and travel style.",
  },
  {
    question: "Are the destination prices live booking prices?",
    answer:
      "No. GoByBudget uses planning estimates to help you shortlist destinations before checking live flight, hotel, and package prices.",
  },
  {
    question: "Why does departure city affect the results?",
    answer:
      "Flights can be one of the largest trip costs, so changing the departure city can significantly change the estimated total budget for the same destination.",
  },
  {
    question: "How should I use the maximum budget filter?",
    answer:
      "Set the maximum budget to the total amount you want to spend on flights, stays, food, local transport, and activities for the selected trip length.",
  },
  {
    question: "Can I find destinations for a fixed budget?",
    answer:
      "Yes. Use the destinations by budget page when you want examples grouped around a specific total budget range.",
  },
  {
    question: "Can I calculate a custom trip cost?",
    answer:
      "Yes. Use the travel budget calculator to estimate a trip with your own budget, departure city, duration, timing, and travel style.",
  },
];

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<DestinationSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const pageDescription =
    "Explore travel destinations by departure city, season, duration, travel style, and estimated trip cost. Compare flights, stays, food, activities, and daily budgets.";
  const jsonLd = [
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Destinations", url: "/destinations" },
    ]),
    createCollectionPageSchema({
      name: "Travel Destinations Explorer",
      description: pageDescription,
      path: "/destinations",
    }),
    createItemListSchema(
      cityDestinations.slice(0, 24).map((destination) => ({
        name: `${destination.city}, ${destination.country}`,
        url: `/destinations/${destination.slug}`,
        description: destination.description,
      }))
    ),
    createFAQSchema(destinationsFaqItems),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <DestinationsExplorer
        key={JSON.stringify(resolvedSearchParams)}
        searchParams={resolvedSearchParams}
        faqItems={destinationsFaqItems}
      />
    </>
  );
}
