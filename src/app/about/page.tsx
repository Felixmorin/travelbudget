import { AboutContent } from "@/components/site/about-content";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "About",
  description:
    "Learn how TravelBudget.ai helps travelers compare destinations, understand trip costs, and plan realistic travel budgets before booking.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutContent />;
}
