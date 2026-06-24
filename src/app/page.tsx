import { HomeContent } from "@/components/site/home-content";
import { createMetadata } from "@/lib/seo/metadata";
import { createOrganizationSchema, createWebSiteSchema, serializeJsonLd } from "@/lib/seo/schema";

export const metadata = createMetadata({
  title: "Find the Best Travel Destinations for Your Budget",
  description:
    "Discover where you can travel based on your budget, trip length, departure city, and travel style. TravelBudget.ai helps you compare destinations with realistic cost breakdowns and smart recommendations.",
  path: "/",
  robots: {
    index: true,
    follow: true,
  },
});

export default function Home() {
  const jsonLd = [createWebSiteSchema(), createOrganizationSchema()];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <HomeContent />
    </>
  );
}
