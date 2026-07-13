import { GuideHubExplorer } from "@/components/guides/guide-hub-explorer";
import { getGuideHubData } from "@/lib/data/guide-hub";
import { createCollectionPageSchema, createItemListSchema, serializeJsonLd } from "@/lib/seo/schema";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Travel Budget Guides by Destination, Cost and Origin",
  description:
    "Read travel budget guides by destination, departure city, trip duration, travel style, and budget level before choosing where to go.",
  path: "/guides",
});

export const revalidate = 300;

export default async function GuidesPage() {
  const guideHubData = await getGuideHubData();
  const jsonLd = [
    createCollectionPageSchema({
      name: "Travel Guides Hub",
      description:
        "A discovery hub for GoByBudget.com guides, organized by destination, travel style, trip duration, estimated budget, and popularity.",
      path: "/guides",
    }),
    createItemListSchema(
      guideHubData.popularGuides.map((guide) => ({
        name: guide.title,
        url: guide.href,
        description: guide.description,
      }))
    ),
  ];

  return (
    <main className="bg-[#f7f9fb] text-[#191c1e]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <GuideHubExplorer {...guideHubData} />
    </main>
  );
}
