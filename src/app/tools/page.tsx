import { ToolsContent } from "@/components/site/tools-content";
import { createToolMetadata } from "@/lib/seo/metadata";

export const metadata = createToolMetadata({
  title: "Free Travel Budget Tools",
  description: "Use GoByBudget.com tools to compare trip costs, estimate budgets, and choose realistic destinations before booking.",
  path: "/tools",
});

export default function ToolsPage() {
  return <ToolsContent />;
}
