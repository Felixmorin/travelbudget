import type { AgentDefinition, AgentId } from "@/lib/agents/types";

export class AgentRegistryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AgentRegistryError";
  }
}

export const agentRegistry = {
  "product-analyst": {
    id: "product-analyst",
    name: "Product Analyst Agent",
    description: "Analyzes aggregate product, funnel, destination, affiliate, and lead metrics without raw PII access.",
    version: "0.1.0",
    status: "available",
    permissions: [
      "analytics:read:aggregate",
      "affiliate:read:aggregate",
      "leads:read:aggregate",
      "destinations:read",
      "reports:write",
    ],
    defaultCostLimitCents: 100,
    defaultStepLimit: 8,
    requiresApprovalFor: ["database:write", "lead:raw-read", "external:send", "report:publish", "production:run"],
  },
} as const satisfies Record<AgentId, AgentDefinition>;

export function listAgents() {
  return Object.values(agentRegistry);
}

export function getAgentDefinition(agentId: AgentId) {
  const agent = agentRegistry[agentId];

  if (!agent) {
    throw new AgentRegistryError(`Unknown agent ${agentId}.`);
  }

  return agent;
}
