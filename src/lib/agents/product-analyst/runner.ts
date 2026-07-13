import { assertWithinAgentLimits, resolveAgentLimits } from "@/lib/agents/limits";
import { logAgentEvent } from "@/lib/agents/logger";
import { analyzeProductData } from "@/lib/agents/product-analyst/analyze";
import { collectProductAnalystData } from "@/lib/agents/product-analyst/data";
import type { ProductAnalystReport, ProductAnalystSource } from "@/lib/agents/product-analyst/types";
import { assertAgentPermission } from "@/lib/agents/permissions";
import { getAgentDefinition } from "@/lib/agents/registry";
import {
  createAgentMission,
  listAgentExecutions,
  recordAgentToolCall,
  recordCompletedAgentExecution,
} from "@/lib/agents/store";
import type { AgentExecution, AgentJsonObject } from "@/lib/agents/types";
import { getErrorMessage } from "@/lib/monitoring/server-logger";

export type ProductAnalystHistoryItem = {
  id: string;
  status: AgentExecution["status"];
  startedAt: string;
  completedAt?: string;
  source?: ProductAnalystSource;
  findingCount: number;
  costCents: number;
  error?: string;
};

export async function runProductAnalystAnalysis({
  source,
  requestedBy,
  costLimitCents,
}: {
  source: ProductAnalystSource;
  requestedBy?: string;
  costLimitCents?: number;
}) {
  const agent = getAgentDefinition("product-analyst");
  const limits = resolveAgentLimits(agent, { costLimitCents });
  const mission = await createAgentMission({
    agentId: "product-analyst",
    objective: "Run manual Product Analyst analysis.",
    requestedBy,
    input: {
      source,
    },
    costLimitCents: limits.costLimitCents,
    stepLimit: limits.stepLimit,
  });

  try {
    assertAgentPermission(agent, "analytics:read:aggregate");
    assertAgentPermission(agent, "affiliate:read:aggregate");
    assertAgentPermission(agent, "leads:read:aggregate");
    assertAgentPermission(agent, "reports:write");

    const data = await collectProductAnalystData(source);
    const report = analyzeProductData(data);

    assertWithinAgentLimits({
      estimatedCostCents: report.costCents,
      nextStepCount: report.stepCount,
      costLimitCents: mission.costLimitCents,
      stepLimit: mission.stepLimit,
    });

    const execution = await recordCompletedAgentExecution({
      mission,
      triggerType: "manual",
      model: "deterministic-product-analyst-v1",
      stepCount: report.stepCount,
      estimatedCostCents: report.costCents,
      output: toAgentJsonObject(report),
    });

    await Promise.all([
      recordAgentToolCall({
        execution,
        toolName: "collectProductAnalystData",
        permission: "analytics:read:aggregate",
        input: {
          source,
        },
        status: "completed",
        estimatedCostCents: 1,
      }),
      recordAgentToolCall({
        execution,
        toolName: "analyzeProductData",
        permission: "reports:write",
        input: {
          findingCount: report.findings.length,
        },
        status: "completed",
        estimatedCostCents: Math.max(1, report.costCents - 1),
      }),
      logAgentEvent({
        level: "info",
        eventName: "agent.product_analyst.completed",
        message: "Product Analyst analysis completed.",
        missionId: mission.id,
        executionId: execution.id,
        context: {
          source,
          findingCount: report.findings.length,
          costCents: report.costCents,
        },
      }),
    ]);

    return {
      mission,
      execution,
      report,
    };
  } catch (error) {
    const message = getErrorMessage(error);
    const execution = await recordCompletedAgentExecution({
      mission,
      triggerType: "manual",
      model: "deterministic-product-analyst-v1",
      stepCount: 1,
      estimatedCostCents: 1,
      error: message,
    });

    await logAgentEvent({
      level: "error",
      eventName: "agent.product_analyst.failed",
      message: "Product Analyst analysis failed.",
      missionId: mission.id,
      executionId: execution.id,
      context: {
        source,
        error: message,
      },
    });

    throw error;
  }
}

export async function listProductAnalystHistory(limit = 10): Promise<ProductAnalystHistoryItem[]> {
  const executions = await listAgentExecutions("product-analyst", limit);

  return executions.map((execution) => {
    const report = parseReport(execution.output);

    return {
      id: execution.id,
      status: execution.status,
      startedAt: execution.startedAt,
      completedAt: execution.completedAt,
      source: report?.source,
      findingCount: report?.findings.length ?? 0,
      costCents: execution.estimatedCostCents,
      error: execution.error,
    };
  });
}

function parseReport(output: AgentJsonObject | undefined): ProductAnalystReport | null {
  if (!output || output.agentId !== "product-analyst" || !Array.isArray(output.findings)) {
    return null;
  }

  return output as unknown as ProductAnalystReport;
}

function toAgentJsonObject(value: ProductAnalystReport): AgentJsonObject {
  return JSON.parse(JSON.stringify(value)) as AgentJsonObject;
}
