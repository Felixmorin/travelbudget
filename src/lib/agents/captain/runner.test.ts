import { beforeEach, describe, expect, it, vi } from "vitest";

import { runCaptainDailyReview } from "@/lib/agents/captain/runner";
import { runProductAnalystAnalysis } from "@/lib/agents/product-analyst/runner";
import { clearDevelopmentAgentRecords, listDevelopmentAgentRecords } from "@/lib/agents/store";

describe("Captain runner", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("AI_AGENTS_ENABLED", "true");
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    clearDevelopmentAgentRecords();
  });

  it("creates at most three approved follow-up missions from Product Analyst reports", async () => {
    await runProductAnalystAnalysis({
      source: "demo",
      requestedBy: "test",
      costLimitCents: 100,
    });

    const firstRun = await runCaptainDailyReview({
      requestedBy: "test",
      costLimitCents: 100,
      now: new Date("2026-07-13T12:00:00.000Z"),
    });
    const recordsAfterFirstRun = listDevelopmentAgentRecords();
    const captainMissions = recordsAfterFirstRun.missions.filter((mission) => mission.requestedBy === "agent:captain");

    expect(firstRun.report.dailySummary.missionsCreated).toBeLessThanOrEqual(3);
    expect(firstRun.report.createdMissions).toHaveLength(3);
    expect(captainMissions).toHaveLength(3);
    expect(captainMissions.every((mission) => mission.agentId === "product-analyst")).toBe(true);
    expect(captainMissions.every((mission) => mission.status === "pending_approval")).toBe(true);
    expect(recordsAfterFirstRun.approvals).toHaveLength(3);
    expect(recordsAfterFirstRun.approvals.every((approval) => approval.actionType === "agent:mission-create")).toBe(true);

    const secondRun = await runCaptainDailyReview({
      requestedBy: "test",
      costLimitCents: 100,
      now: new Date("2026-07-13T16:00:00.000Z"),
    });
    const recordsAfterSecondRun = listDevelopmentAgentRecords();

    expect(secondRun.report.dailySummary.missionsCreated).toBe(0);
    expect(recordsAfterSecondRun.missions.filter((mission) => mission.requestedBy === "agent:captain")).toHaveLength(3);
  });

  it("records a failed Captain execution when limits are exceeded", async () => {
    await runProductAnalystAnalysis({
      source: "demo",
      requestedBy: "test",
      costLimitCents: 100,
    });

    await expect(
      runCaptainDailyReview({
        requestedBy: "test",
        costLimitCents: 1,
        now: new Date("2026-07-13T12:00:00.000Z"),
      })
    ).rejects.toThrow("Agent cost limit exceeded.");

    expect(listDevelopmentAgentRecords().executions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          agentId: "captain",
          status: "failed",
          error: "Agent cost limit exceeded.",
        }),
      ])
    );
  });
});
