import { beforeEach, describe, expect, it, vi } from "vitest";

import { clearDevelopmentAgentRecords, listDevelopmentAgentRecords } from "@/lib/agents/store";
import { listProductAnalystHistory, runProductAnalystAnalysis } from "@/lib/agents/product-analyst/runner";

describe("Product Analyst runner", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("AI_AGENTS_ENABLED", "true");
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    clearDevelopmentAgentRecords();
  });

  it("stores a completed manual analysis and read-only tool calls", async () => {
    const result = await runProductAnalystAnalysis({
      source: "demo",
      requestedBy: "test",
      costLimitCents: 100,
    });
    const records = listDevelopmentAgentRecords();

    expect(result.report.findings.length).toBeGreaterThan(0);
    expect(records.missions).toHaveLength(1);
    expect(records.executions).toMatchObject([
      {
        status: "completed",
        estimatedCostCents: result.report.costCents,
      },
    ]);
    expect(records.toolCalls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          toolName: "collectProductAnalystData",
          permission: "analytics:read:aggregate",
          status: "completed",
          requiresApproval: false,
        }),
      ])
    );
    await expect(listProductAnalystHistory()).resolves.toMatchObject([
      {
        status: "completed",
        source: "demo",
        findingCount: result.report.findings.length,
      },
    ]);
  });

  it("records a failed execution when the cost limit is exceeded", async () => {
    await expect(
      runProductAnalystAnalysis({
        source: "demo",
        requestedBy: "test",
        costLimitCents: 1,
      })
    ).rejects.toThrow("Agent cost limit exceeded.");

    expect(listDevelopmentAgentRecords().executions).toMatchObject([
      {
        status: "failed",
        error: "Agent cost limit exceeded.",
      },
    ]);
  });
});
