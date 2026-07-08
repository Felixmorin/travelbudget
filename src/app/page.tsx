import { HomeContent } from "@/components/site/home-content";
import { createMetadata } from "@/lib/seo/metadata";
import { createOrganizationSchema, createWebSiteSchema, serializeJsonLd } from "@/lib/seo/schema";

export const metadata = createMetadata({
  title: "GoByBudget.com",
  description: "AI-powered destination discovery that fits your budget.",
  socialDescription: "Discover the best places to travel based on your budget.",
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
