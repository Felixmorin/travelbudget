import { describe, expect, it } from "vitest";

import { buildCaptainCandidates, planCaptainMissions } from "@/lib/agents/captain/analyze";
import type { ProductAnalystReport } from "@/lib/agents/product-analyst/types";

describe("Captain planning", () => {
  it("sorts recommendations by impact and effort", () => {
    const candidates = buildCaptainCandidates([
      {
        executionId: "report-1",
        report: createReport([
          {
            problemDetected: "Medium issue",
            importance: "medium",
            recommendedAction: "Audit a complex page.",
            targetMetric: "medium metric",
          },
          {
            problemDetected: "High issue",
            importance: "high",
            recommendedAction: "Add clearer fallback copy.",
            targetMetric: "high metric",
          },
        ]),
      },
    ]);

    expect(candidates.map((candidate) => candidate.targetMetric)).toEqual(["high metric", "medium metric"]);
    expect(candidates[0]).toMatchObject({
      impact: "high",
      effort: "low",
      assignedAgentId: "product-analyst",
    });
  });

  it("limits Captain to three missions per day and skips duplicates", () => {
    const candidates = buildCaptainCandidates([
      {
        executionId: "report-1",
        report: createReport(
          ["A", "B", "C", "D"].map((label) => ({
            problemDetected: `${label} issue`,
            importance: "high",
            recommendedAction: `Review ${label}`,
            targetMetric: `${label} metric`,
          }))
        ),
      },
    ]);
    const plan = planCaptainMissions({
      candidates,
      existingMissions: [
        {
          id: "existing",
          agentId: "product-analyst",
          objective: "Existing",
          status: "pending_approval",
          requestedBy: "agent:captain",
          input: {
            captain: {
              duplicateKey: candidates[0].duplicateKey,
            },
          },
          costLimitCents: 100,
          stepLimit: 8,
          createdAt: "2026-07-13T08:00:00.000Z",
          updatedAt: "2026-07-13T08:00:00.000Z",
        },
      ],
      now: new Date("2026-07-13T12:00:00.000Z"),
    });

    expect(plan.selected).toHaveLength(2);
    expect(plan.skipped).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ reason: "duplicate" }),
        expect.objectContaining({ reason: "daily_limit" }),
      ])
    );
  });
});

function createReport(
  findings: Array<{
    problemDetected: string;
    importance: "medium" | "high";
    recommendedAction: string;
    targetMetric: string;
  }>
): ProductAnalystReport {
  return {
    agentId: "product-analyst",
    generatedAt: "2026-07-13T00:00:00.000Z",
    source: "demo",
    costCents: 5,
    stepCount: 4,
    findings: findings.map((finding) => ({
      ...finding,
      dataUsed: ["demo"],
      likelyCause: "Demo cause",
      confidenceLevel: "high",
    })),
    dataSnapshot: {
      source: "demo",
      generatedAt: "2026-07-13T00:00:00.000Z",
      searches: { started: 1, completed: 1, withoutResults: 0 },
      selectedDestinations: { total: 0, top: [] },
      affiliateClicks: { total: 0, byType: [] },
      savedTrips: { total: 0, byCurrency: [] },
      appErrors: { total: 0, top: [] },
      performance: {
        mobile: { samples: 0, averageLcpMs: null, averageInpMs: null },
        desktop: { samples: 0, averageLcpMs: null, averageInpMs: null },
      },
    },
  };
}
