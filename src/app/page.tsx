import { HomeContent } from "@/components/site/home-content";
import { createMetadata } from "@/lib/seo/metadata";
import { createOrganizationSchema, createWebSiteSchema, serializeJsonLd } from "@/lib/seo/schema";

export const metadata = createMetadata({
  title: "Travel Budget Calculator & Destinations by Budget | GoByBudget",
  description:
    "Enter your budget, departure city, trip length, and travel style to find affordable destinations with realistic total trip costs.",
  socialDescription:
    "Find where you can travel with your budget using trip estimates for flights, stays, food, transport, and activities.",
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
