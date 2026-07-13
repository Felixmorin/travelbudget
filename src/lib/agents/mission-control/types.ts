import type { AgentId, AgentMissionStatus } from "@/lib/agents/types";
import type { ProductAnalystFinding } from "@/lib/agents/product-analyst/types";

export type MissionControlSnapshot = {
  generatedAt: string;
  runtime: {
    envEnabled: boolean;
    stopped: boolean;
    stopReason?: string;
    stoppedAt?: string;
  };
  agents: Array<{
    id: AgentId;
    name: string;
    status: string;
    permissionCount: number;
  }>;
  missions: {
    pending: MissionControlMission[];
    active: MissionControlMission[];
    completed: MissionControlMission[];
    failed: MissionControlMission[];
  };
  productAnalystRecommendations: Array<ProductAnalystFinding & {
    executionId: string;
    generatedAt: string;
  }>;
  captainMissions: MissionControlMission[];
  pendingApprovals: Array<{
    id: string;
    actionType: string;
    missionId?: string;
    requestedBy?: string;
    reason?: string;
    createdAt: string;
  }>;
  modelCosts: {
    dailyCents: number;
    monthlyCents: number;
  };
  toolCalls: Array<{
    id: string;
    executionId: string;
    toolName: string;
    status: string;
    permission: string;
    estimatedCostCents: number;
    startedAt: string;
  }>;
};

export type MissionControlMission = {
  id: string;
  agentId: AgentId;
  objective: string;
  status: AgentMissionStatus;
  requestedBy?: string;
  createdAt: string;
  sourceProblem?: string;
  targetMetric?: string;
};
