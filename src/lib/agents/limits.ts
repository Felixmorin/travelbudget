import { getAgentRuntimeConfig } from "@/lib/agents/config";
import type { AgentDefinition } from "@/lib/agents/types";

export class AgentLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AgentLimitError";
  }
}

export function resolveAgentLimits(
  agent: AgentDefinition,
  requested?: {
    costLimitCents?: number;
    stepLimit?: number;
  }
) {
  const config = getAgentRuntimeConfig();
  const costLimitCents = clampInteger(
    requested?.costLimitCents ?? agent.defaultCostLimitCents ?? config.defaultCostLimitCents,
    0,
    config.maxCostLimitCents
  );
  const stepLimit = clampInteger(
    requested?.stepLimit ?? agent.defaultStepLimit ?? config.defaultStepLimit,
    1,
    config.maxStepLimit
  );

  return {
    costLimitCents,
    stepLimit,
  };
}

export function assertWithinAgentLimits({
  estimatedCostCents,
  nextStepCount,
  costLimitCents,
  stepLimit,
}: {
  estimatedCostCents: number;
  nextStepCount: number;
  costLimitCents: number;
  stepLimit: number;
}) {
  if (estimatedCostCents > costLimitCents) {
    throw new AgentLimitError("Agent cost limit exceeded.");
  }

  if (nextStepCount > stepLimit) {
    throw new AgentLimitError("Agent step limit exceeded.");
  }
}

function clampInteger(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(Number.isFinite(value) ? value : min)));
}
