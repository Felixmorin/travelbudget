import type { Metadata } from "next";

import { DestinationsExplorer } from "@/components/destinations/destinations-explorer";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Destinations",
  description:
    "Explore travel destinations by budget, departure city, trip duration, season, and travel style with estimated trip costs.",
  path: "/destinations",
});

export default function DestinationsPage() {
  return <DestinationsExplorer />;
}
