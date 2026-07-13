export type AgentRuntimeConfig = {
  enabled: boolean;
  maxCostLimitCents: number;
  maxStepLimit: number;
  defaultCostLimitCents: number;
  defaultStepLimit: number;
  productionRunsRequireApproval: boolean;
};

const defaultCostLimitCents = 100;
const defaultStepLimit = 8;
const absoluteMaxCostLimitCents = 2_000;
const absoluteMaxStepLimit = 40;

export function getAgentRuntimeConfig(): AgentRuntimeConfig {
  return {
    enabled: process.env.AI_AGENTS_ENABLED === "true",
    maxCostLimitCents: readBoundedInteger(
      process.env.AI_AGENT_MAX_COST_CENTS,
      defaultCostLimitCents,
      0,
      absoluteMaxCostLimitCents
    ),
    maxStepLimit: readBoundedInteger(process.env.AI_AGENT_MAX_STEPS, defaultStepLimit, 1, absoluteMaxStepLimit),
    defaultCostLimitCents: readBoundedInteger(
      process.env.AI_AGENT_DEFAULT_COST_CENTS,
      defaultCostLimitCents,
      0,
      absoluteMaxCostLimitCents
    ),
    defaultStepLimit: readBoundedInteger(process.env.AI_AGENT_DEFAULT_STEPS, defaultStepLimit, 1, absoluteMaxStepLimit),
    productionRunsRequireApproval: process.env.AI_AGENT_ALLOW_UNAPPROVED_PRODUCTION_RUNS !== "true",
  };
}

export function assertAgentsEnabled() {
  if (!getAgentRuntimeConfig().enabled) {
    throw new AgentRuntimeConfigError("Agents are disabled by AI_AGENTS_ENABLED.");
  }
}

export class AgentRuntimeConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AgentRuntimeConfigError";
  }
}

function readBoundedInteger(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = value ? Number(value) : fallback;
  const normalized = Number.isFinite(parsed) ? Math.round(parsed) : fallback;

  return Math.min(max, Math.max(min, normalized));
}
