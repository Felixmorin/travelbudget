import { AboutContent } from "@/components/site/about-content";
import { createMetadata } from "@/lib/seo/metadata";
import { createBreadcrumbSchema, createOrganizationSchema, serializeJsonLd } from "@/lib/seo/schema";

export const metadata = createMetadata({
  title: "About GoByBudget.com - Realistic Travel Budget Planning",
  description:
    "Learn how GoByBudget.com helps travelers compare destinations by budget with realistic trip cost estimates, transparent assumptions, and practical planning tools.",
  path: "/about",
});

export default function AboutPage() {
  const jsonLd = [
    createOrganizationSchema(),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "About GoByBudget.com", url: "/about" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <AboutContent />
    </>
  );
}
