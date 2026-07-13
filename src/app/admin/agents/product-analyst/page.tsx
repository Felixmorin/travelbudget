import type { Metadata } from "next";

import { ProductAnalystConsole } from "@/app/admin/agents/product-analyst/product-analyst-console";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product Analyst Agent | GoByBudget",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProductAnalystAgentPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fb] px-4 py-10 text-[#191c1e] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <header className="grid gap-2">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Agents</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Product Analyst</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            Manual, read-only analysis of GoByBudget product signals. The agent can inspect aggregate funnel,
            affiliate, saved-trip, error, and performance data, then save a structured analysis history.
          </p>
        </header>

        <ProductAnalystConsole initialHistory={[]} />
      </div>
    </main>
  );
}
