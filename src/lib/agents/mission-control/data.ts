import { getAgentRuntimeConfig } from "@/lib/agents/config";
import { listAgents } from "@/lib/agents/registry";
import {
  getAgentRuntimeControl,
  listAgentApprovals,
  listAgentMissions,
  listAgentToolCalls,
  listAllAgentExecutions,
} from "@/lib/agents/store";
import type { AgentJsonObject, AgentMission } from "@/lib/agents/types";
import type { MissionControlMission, MissionControlSnapshot } from "@/lib/agents/mission-control/types";
import type { ProductAnalystReport } from "@/lib/agents/product-analyst/types";

export async function getMissionControlSnapshot(now = new Date()): Promise<MissionControlSnapshot> {
  const [runtimeControl, missions, executions, approvals, toolCalls] = await Promise.all([
    getAgentRuntimeControl(),
    listAgentMissions(200),
    listAllAgentExecutions(200),
    listAgentApprovals(100),
    listAgentToolCalls(100),
  ]);
  const dayKey = now.toISOString().slice(0, 10);
  const monthKey = now.toISOString().slice(0, 7);
  const missionViews = missions.map(toMissionControlMission);

  return {
    generatedAt: now.toISOString(),
    runtime: {
      envEnabled: getAgentRuntimeConfig().enabled,
      stopped: runtimeControl.stopped,
      stopReason: runtimeControl.reason,
      stoppedAt: runtimeControl.createdAt,
    },
    agents: listAgents().map((agent) => ({
      id: agent.id,
      name: agent.name,
      status: runtimeControl.stopped ? "stopped" : agent.status,
      permissionCount: agent.permissions.length,
    })),
    missions: {
      pending: missionViews.filter((mission) => mission.status === "draft" || mission.status === "pending_approval"),
      active: missionViews.filter((mission) => mission.status === "approved" || mission.status === "running"),
      completed: missionViews.filter((mission) => mission.status === "completed"),
      failed: missionViews.filter((mission) => mission.status === "failed" || mission.status === "cancelled"),
    },
    productAnalystRecommendations: executions
      .flatMap((execution) => {
        const report = parseProductAnalystReport(execution.output);

        return report
          ? report.findings.map((finding) => ({
              ...finding,
              executionId: execution.id,
              generatedAt: report.generatedAt,
            }))
          : [];
      })
      .slice(0, 12),
    captainMissions: missionViews.filter((mission) => mission.requestedBy === "agent:captain"),
    pendingApprovals: approvals
      .filter((approval) => approval.status === "pending")
      .map((approval) => ({
        id: approval.id,
        actionType: approval.actionType,
        missionId: approval.missionId,
        requestedBy: approval.requestedBy,
        reason: approval.reason,
        createdAt: approval.createdAt,
      })),
    modelCosts: {
      dailyCents: executions
        .filter((execution) => execution.startedAt.startsWith(dayKey))
        .reduce((total, execution) => total + execution.estimatedCostCents, 0),
      monthlyCents: executions
        .filter((execution) => execution.startedAt.startsWith(monthKey))
        .reduce((total, execution) => total + execution.estimatedCostCents, 0),
    },
    toolCalls: toolCalls.map((toolCall) => ({
      id: toolCall.id,
      executionId: toolCall.executionId,
      toolName: toolCall.toolName,
      status: toolCall.status,
      permission: toolCall.permission,
      estimatedCostCents: toolCall.estimatedCostCents,
      startedAt: toolCall.startedAt,
    })),
  };
}

function toMissionControlMission(mission: AgentMission): MissionControlMission {
  const captain = readCaptainContext(mission.input);

  return {
    id: mission.id,
    agentId: mission.agentId,
    objective: mission.objective,
    status: mission.status,
    requestedBy: mission.requestedBy,
    createdAt: mission.createdAt,
    sourceProblem: captain.sourceProblem,
    targetMetric: captain.targetMetric,
  };
}

function readCaptainContext(input: AgentJsonObject) {
  const captain = input.captain;

  if (!captain || typeof captain !== "object" || Array.isArray(captain)) {
    return {};
  }

  return {
    sourceProblem: typeof captain.sourceProblem === "string" ? captain.sourceProblem : undefined,
    targetMetric: typeof captain.targetMetric === "string" ? captain.targetMetric : undefined,
  };
}

function parseProductAnalystReport(output: AgentJsonObject | undefined): ProductAnalystReport | null {
  if (!output || output.agentId !== "product-analyst" || !Array.isArray(output.findings)) {
    return null;
  }

  return output as unknown as ProductAnalystReport;
}
