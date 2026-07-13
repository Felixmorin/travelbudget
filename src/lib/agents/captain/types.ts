import type { AgentId } from "@/lib/agents/types";
import type { ProductAnalystFinding } from "@/lib/agents/product-analyst/types";

export type CaptainImpact = "low" | "medium" | "high" | "critical";
export type CaptainEffort = "low" | "medium" | "high";

export type CaptainCandidateMission = {
  title: string;
  assignedAgentId: Exclude<AgentId, "captain">;
  sourceReportExecutionId: string;
  sourceProblem: string;
  targetMetric: string;
  recommendedAction: string;
  impact: CaptainImpact;
  effort: CaptainEffort;
  confidenceLevel: ProductAnalystFinding["confidenceLevel"];
  duplicateKey: string;
};

export type CaptainCreatedMission = CaptainCandidateMission & {
  missionId: string;
  approvalId: string;
};

export type CaptainDailySummary = {
  date: string;
  reportsReviewed: number;
  candidatesFound: number;
  missionsCreated: number;
  duplicatesSkipped: number;
  dailyQuotaRemaining: number;
  summary: string;
};

export type CaptainReport = {
  agentId: "captain";
  generatedAt: string;
  costCents: number;
  stepCount: number;
  dailySummary: CaptainDailySummary;
  createdMissions: CaptainCreatedMission[];
  skippedCandidates: Array<{
    duplicateKey: string;
    reason: "duplicate" | "daily_limit" | "unknown_agent";
  }>;
};
