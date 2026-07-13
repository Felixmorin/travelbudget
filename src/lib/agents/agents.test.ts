import { beforeEach, describe, expect, it, vi } from "vitest";

import { assertAgentsEnabled } from "@/lib/agents/config";
import { assertWithinAgentLimits, resolveAgentLimits } from "@/lib/agents/limits";
import { assertAgentPermission, assertSensitiveActionApproved, requiresApproval } from "@/lib/agents/permissions";
import { getAgentDefinition, listAgents } from "@/lib/agents/registry";

describe("agent foundations", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("keeps agents globally disabled unless explicitly enabled", () => {
    expect(() => assertAgentsEnabled()).toThrow("Agents are disabled by AI_AGENTS_ENABLED.");

    vi.stubEnv("AI_AGENTS_ENABLED", "true");

    expect(() => assertAgentsEnabled()).not.toThrow();
  });

  it("registers the product analyst with least-privilege aggregate permissions", () => {
    const agent = getAgentDefinition("product-analyst");

    expect(listAgents()).toHaveLength(2);
    expect(agent.permissions).toContain("analytics:read:aggregate");
    expect(agent.permissions).toContain("leads:read:aggregate");
    expect(agent.permissions).not.toContain("notifications:send");
    expect(() => assertAgentPermission(agent, "destinations:read")).not.toThrow();
    expect(() => assertAgentPermission(agent, "notifications:send")).toThrow(
      "Agent product-analyst does not have permission notifications:send."
    );
  });

  it("requires approvals for sensitive actions", () => {
    const agent = getAgentDefinition("product-analyst");

    expect(requiresApproval(agent, "lead:raw-read")).toBe(true);
    expect(() =>
      assertSensitiveActionApproved({
        agent,
        action: "lead:raw-read",
        approved: false,
      })
    ).toThrow("Sensitive action lead:raw-read requires approval.");
    expect(() =>
      assertSensitiveActionApproved({
        agent,
        action: "lead:raw-read",
        approved: true,
      })
    ).not.toThrow();
  });

  it("clamps cost and step limits to server-side maximums", () => {
    vi.stubEnv("AI_AGENT_MAX_COST_CENTS", "250");
    vi.stubEnv("AI_AGENT_MAX_STEPS", "3");
    const limits = resolveAgentLimits(getAgentDefinition("product-analyst"), {
      costLimitCents: 999,
      stepLimit: 99,
    });

    expect(limits).toEqual({
      costLimitCents: 250,
      stepLimit: 3,
    });
    expect(() =>
      assertWithinAgentLimits({
        estimatedCostCents: 251,
        nextStepCount: 1,
        costLimitCents: limits.costLimitCents,
        stepLimit: limits.stepLimit,
      })
    ).toThrow("Agent cost limit exceeded.");
    expect(() =>
      assertWithinAgentLimits({
        estimatedCostCents: 100,
        nextStepCount: 4,
        costLimitCents: limits.costLimitCents,
        stepLimit: limits.stepLimit,
      })
    ).toThrow("Agent step limit exceeded.");
  });
});
