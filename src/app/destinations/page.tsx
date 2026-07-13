import type { Metadata } from "next";

import {
  type DestinationSearchParams,
  DestinationsExplorer,
} from "@/components/destinations/destinations-explorer";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Destinations by Budget: Find Affordable Places to Travel",
  description:
    "Browse destinations by budget, departure city, trip duration, season, and travel style with estimated flights, daily costs, and total trip costs.",
  path: "/destinations",
});

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<DestinationSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  return <DestinationsExplorer key={JSON.stringify(resolvedSearchParams)} searchParams={resolvedSearchParams} />;
}
