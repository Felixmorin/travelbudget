import { beforeEach, describe, expect, it, vi } from "vitest";

import { runCaptainDailyReview } from "@/lib/agents/captain/runner";
import { getMissionControlSnapshot } from "@/lib/agents/mission-control/data";
import { runProductAnalystAnalysis } from "@/lib/agents/product-analyst/runner";
import { clearDevelopmentAgentRecords } from "@/lib/agents/store";

describe("Mission Control snapshot", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("AI_AGENTS_ENABLED", "true");
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    clearDevelopmentAgentRecords();
  });

  it("aggregates agent state, missions, recommendations, costs, approvals, and tool calls", async () => {
    await runProductAnalystAnalysis({
      source: "demo",
      requestedBy: "test",
      costLimitCents: 100,
    });
    await runCaptainDailyReview({
      requestedBy: "test",
      costLimitCents: 100,
      now: new Date("2026-07-13T12:00:00.000Z"),
    });

    const snapshot = await getMissionControlSnapshot(new Date());

    expect(snapshot.agents.map((agent) => agent.id)).toEqual(["captain", "product-analyst"]);
    expect(snapshot.missions.pending.length).toBeGreaterThanOrEqual(3);
    expect(snapshot.productAnalystRecommendations.length).toBeGreaterThan(0);
    expect(snapshot.captainMissions).toHaveLength(3);
    expect(snapshot.pendingApprovals).toHaveLength(3);
    expect(snapshot.modelCosts.dailyCents).toBeGreaterThan(0);
    expect(snapshot.modelCosts.monthlyCents).toBeGreaterThan(0);
    expect(snapshot.toolCalls.length).toBeGreaterThan(0);
  });
});
