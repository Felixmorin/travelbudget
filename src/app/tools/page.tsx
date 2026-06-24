import { ToolCard } from "@/components/site/tool-card";
import { CTASection } from "@/components/site/cta-section";
import { tools } from "@/lib/data/tools";
import { createToolMetadata } from "@/lib/seo/metadata";

export const metadata = createToolMetadata({
  title: "Free Travel Budget Tools",
  description: "Use TravelBudget.ai tools to compare trip costs, estimate budgets, and choose realistic destinations before booking.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      <main className="bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Free travel tools</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
              Practical planning tools for budget-aware travelers
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-500">
              The first MVP ships these as polished entry points, ready to connect to APIs and saved trips later.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </section>
      </main>
      <CTASection />
    </>
  );
}
