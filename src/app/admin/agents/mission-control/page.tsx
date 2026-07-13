import type { Metadata } from "next";

import { MissionControlConsole } from "@/app/admin/agents/mission-control/mission-control-console";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mission Control | GoByBudget",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MissionControlPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fb] px-4 py-8 text-[#191c1e] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <header className="grid gap-2">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Agents</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Mission Control</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            Operational view for GoByBudget agents, missions, approvals, model costs, and tool calls. This first
            version is a static control surface with no animated visualizations.
          </p>
        </header>

        <MissionControlConsole />
      </div>
    </main>
  );
}
