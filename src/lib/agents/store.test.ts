import { beforeEach, describe, expect, it, vi } from "vitest";

import { logAgentEvent } from "@/lib/agents/logger";
import { getAgentDefinition } from "@/lib/agents/registry";
import {
  clearDevelopmentAgentRecords,
  createAgentExecution,
  createAgentMission,
  listDevelopmentAgentRecords,
  recordAgentToolCall,
  registerAgentDefinition,
  requestAgentApproval,
} from "@/lib/agents/store";

describe("agent store integration", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("AI_AGENTS_ENABLED", "true");
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    clearDevelopmentAgentRecords();
  });

  it("records the full foundation lifecycle in development storage", async () => {
    const agent = getAgentDefinition("product-analyst");
    await registerAgentDefinition(agent);

    const mission = await createAgentMission({
      agentId: "product-analyst",
      objective: "Summarize funnel health for the last 7 days",
      requestedBy: "admin@example.com",
      input: {
        dateRange: "last_7_days",
      },
      costLimitCents: 75,
      stepLimit: 5,
    });
    const execution = await createAgentExecution({
      mission,
      triggerType: "test",
      model: "foundation-test",
    });
    const approval = await requestAgentApproval({
      actionType: "report:publish",
      missionId: mission.id,
      executionId: execution.id,
      requestedBy: "admin@example.com",
      reason: "Publishing a report is sensitive.",
      requestedPayload: {
        reportType: "weekly_funnel",
      },
    });
    const toolCall = await recordAgentToolCall({
      execution,
      toolName: "getFunnelSummary",
      permission: "analytics:read:aggregate",
      input: {
        dateRange: "last_7_days",
      },
      status: "pending_approval",
      requiresApproval: true,
      approvalId: approval.id,
      estimatedCostCents: 3,
    });
    const log = await logAgentEvent({
      level: "info",
      eventName: "agent.foundation.lifecycle_recorded",
      message: "Agent foundation lifecycle recorded.",
      missionId: mission.id,
      executionId: execution.id,
      context: {
        toolCallId: toolCall.id,
        requesterEmail: "admin@example.com",
        apiKey: "secret",
      },
    });

    expect(listDevelopmentAgentRecords()).toMatchObject({
      agentDefinitions: [{ id: "product-analyst" }],
      missions: [
        {
          id: mission.id,
          agentId: "product-analyst",
          costLimitCents: 75,
          stepLimit: 5,
        },
      ],
      executions: [
        {
          id: execution.id,
          missionId: mission.id,
          triggerType: "test",
        },
      ],
      approvals: [
        {
          id: approval.id,
          actionType: "report:publish",
          status: "pending",
        },
      ],
      toolCalls: [
        {
          id: toolCall.id,
          approvalId: approval.id,
          requiresApproval: true,
        },
      ],
      logs: [
        {
          id: log.id,
          eventName: "agent.foundation.lifecycle_recorded",
          context: {
            toolCallId: toolCall.id,
            requesterEmail: "[redacted]",
            apiKey: "[redacted]",
          },
        },
      ],
    });
  });

  it("blocks mission creation while the global switch is off", async () => {
    vi.stubEnv("AI_AGENTS_ENABLED", "false");

    await expect(
      createAgentMission({
        agentId: "product-analyst",
        objective: "Should not run",
      })
    ).rejects.toThrow("Agents are disabled by AI_AGENTS_ENABLED.");
  });
});
