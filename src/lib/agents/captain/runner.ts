import {
  buildCaptainCandidates,
  buildCaptainDailySummary,
  estimateCaptainCostCents,
  planCaptainMissions,
} from "@/lib/agents/captain/analyze";
import type { CaptainCreatedMission, CaptainReport } from "@/lib/agents/captain/types";
import { assertWithinAgentLimits, resolveAgentLimits } from "@/lib/agents/limits";
import { logAgentEvent } from "@/lib/agents/logger";
import { assertAgentPermission } from "@/lib/agents/permissions";
import { getAgentDefinition } from "@/lib/agents/registry";
import {
  createAgentMission,
  listAgentExecutions,
  listAgentMissions,
  recordCompletedAgentExecution,
  requestAgentApproval,
} from "@/lib/agents/store";
import type { AgentJsonObject } from "@/lib/agents/types";
import type { ProductAnalystReport } from "@/lib/agents/product-analyst/types";
import { getErrorMessage } from "@/lib/monitoring/server-logger";

export async function runCaptainDailyReview({
  requestedBy,
  costLimitCents,
  now = new Date(),
}: {
  requestedBy?: string;
  costLimitCents?: number;
  now?: Date;
} = {}) {
  const captain = getAgentDefinition("captain");
  const limits = resolveAgentLimits(captain, { costLimitCents });
  const captainMission = await createAgentMission({
    agentId: "captain",
    objective: "Review Product Analyst reports and propose approved follow-up missions.",
    requestedBy,
    input: {
      date: toDayKey(now),
    },
    costLimitCents: limits.costLimitCents,
    stepLimit: limits.stepLimit,
  });

  try {
    assertAgentPermission(captain, "agents:read");
    assertAgentPermission(captain, "missions:write");
    assertAgentPermission(captain, "approvals:write");
    assertAgentPermission(captain, "reports:write");

    const [productAnalystReports, existingMissions] = await Promise.all([
      listProductAnalystReports(),
      listAgentMissions(500),
    ]);
    const candidates = buildCaptainCandidates(productAnalystReports);
    const plan = planCaptainMissions({
      candidates,
      existingMissions,
      now,
    });
    const costCents = estimateCaptainCostCents(productAnalystReports.length, candidates.length);
    const stepCount = 5;

    assertWithinAgentLimits({
      estimatedCostCents: costCents,
      nextStepCount: stepCount,
      costLimitCents: captainMission.costLimitCents,
      stepLimit: captainMission.stepLimit,
    });

    const createdMissions: CaptainCreatedMission[] = [];

    for (const candidate of plan.selected) {
      const assignedAgent = getAgentDefinition(candidate.assignedAgentId);
      const mission = await createAgentMission({
        agentId: assignedAgent.id,
        objective: candidate.title,
        requestedBy: "agent:captain",
        status: "pending_approval",
        input: {
          captain: {
            duplicateKey: candidate.duplicateKey,
            sourceReportExecutionId: candidate.sourceReportExecutionId,
            sourceProblem: candidate.sourceProblem,
            impact: candidate.impact,
            effort: candidate.effort,
            targetMetric: candidate.targetMetric,
            recommendedAction: candidate.recommendedAction,
          },
        },
      });
      const approval = await requestAgentApproval({
        actionType: "agent:mission-create",
        missionId: mission.id,
        requestedBy: "agent:captain",
        reason: "Captain-created missions require approval before any assigned agent can act.",
        requestedPayload: {
          assignedAgentId: candidate.assignedAgentId,
          objective: candidate.title,
          duplicateKey: candidate.duplicateKey,
        },
      });

      createdMissions.push({
        ...candidate,
        missionId: mission.id,
        approvalId: approval.id,
      });
    }

    const dailySummary = buildCaptainDailySummary({
      date: toDayKey(now),
      reportsReviewed: productAnalystReports.length,
      candidatesFound: candidates.length,
      missionsCreated: createdMissions.length,
      duplicatesSkipped: plan.skipped.filter((item) => item.reason === "duplicate").length,
      dailyQuotaRemaining: plan.dailyQuotaRemaining,
    });
    const report: CaptainReport = {
      agentId: "captain",
      generatedAt: new Date().toISOString(),
      costCents,
      stepCount,
      dailySummary,
      createdMissions,
      skippedCandidates: plan.skipped,
    };
    const execution = await recordCompletedAgentExecution({
      mission: captainMission,
      triggerType: "manual",
      model: "deterministic-captain-v1",
      stepCount,
      estimatedCostCents: costCents,
      output: toAgentJsonObject(report),
    });

    await logAgentEvent({
      level: "info",
      eventName: "agent.captain.completed",
      message: "Captain daily review completed.",
      missionId: captainMission.id,
      executionId: execution.id,
      context: {
        reportsReviewed: productAnalystReports.length,
        missionsCreated: createdMissions.length,
      },
    });

    return {
      mission: captainMission,
      execution,
      report,
    };
  } catch (error) {
    const message = getErrorMessage(error);
    const execution = await recordCompletedAgentExecution({
      mission: captainMission,
      triggerType: "manual",
      model: "deterministic-captain-v1",
      stepCount: 1,
      estimatedCostCents: 1,
      error: message,
    });

    await logAgentEvent({
      level: "error",
      eventName: "agent.captain.failed",
      message: "Captain daily review failed.",
      missionId: captainMission.id,
      executionId: execution.id,
      context: {
        error: message,
      },
    });

    throw error;
  }
}

async function listProductAnalystReports() {
  const executions = await listAgentExecutions("product-analyst", 25);

  return executions
    .map((execution) => {
      const report = parseProductAnalystReport(execution.output);

      return report
        ? {
            executionId: execution.id,
            report,
          }
        : null;
    })
    .filter((value): value is { executionId: string; report: ProductAnalystReport } => Boolean(value));
}

function parseProductAnalystReport(output: AgentJsonObject | undefined): ProductAnalystReport | null {
  if (!output || output.agentId !== "product-analyst" || !Array.isArray(output.findings)) {
    return null;
  }

  return output as unknown as ProductAnalystReport;
}

function toAgentJsonObject(value: CaptainReport): AgentJsonObject {
  return JSON.parse(JSON.stringify(value)) as AgentJsonObject;
}

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
