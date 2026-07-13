export type AgentId = "product-analyst";

export type AgentStatus = "available" | "disabled";
export type AgentMissionStatus = "draft" | "pending_approval" | "approved" | "running" | "completed" | "failed" | "cancelled";
export type AgentExecutionStatus = "queued" | "running" | "completed" | "failed" | "cancelled" | "blocked";
export type AgentToolCallStatus = "pending_approval" | "running" | "completed" | "failed" | "blocked";
export type AgentApprovalStatus = "pending" | "approved" | "rejected" | "expired";
export type AgentLogLevel = "info" | "warn" | "error";

export type AgentPermission =
  | "analytics:read:aggregate"
  | "affiliate:read:aggregate"
  | "leads:read:aggregate"
  | "destinations:read"
  | "reports:write"
  | "notifications:send";

export type SensitiveAgentAction =
  | "database:write"
  | "lead:raw-read"
  | "external:send"
  | "report:publish"
  | "production:run";

export type AgentJsonPrimitive = string | number | boolean | null;
export type AgentJsonValue = AgentJsonPrimitive | AgentJsonValue[] | { [key: string]: AgentJsonValue };
export type AgentJsonObject = { [key: string]: AgentJsonValue };

export type AgentDefinition = {
  id: AgentId;
  name: string;
  description: string;
  version: string;
  status: AgentStatus;
  permissions: AgentPermission[];
  defaultCostLimitCents: number;
  defaultStepLimit: number;
  requiresApprovalFor: SensitiveAgentAction[];
};

export type AgentMission = {
  id: string;
  agentId: AgentId;
  objective: string;
  status: AgentMissionStatus;
  requestedBy?: string;
  input: AgentJsonObject;
  costLimitCents: number;
  stepLimit: number;
  createdAt: string;
  updatedAt: string;
};

export type AgentExecution = {
  id: string;
  missionId: string;
  agentId: AgentId;
  status: AgentExecutionStatus;
  triggerType: "manual" | "scheduled" | "test";
  model?: string;
  stepCount: number;
  estimatedCostCents: number;
  output?: AgentJsonObject;
  error?: string;
  startedAt: string;
  completedAt?: string;
};

export type AgentToolCall = {
  id: string;
  executionId: string;
  toolName: string;
  permission: AgentPermission;
  status: AgentToolCallStatus;
  input: AgentJsonObject;
  output?: AgentJsonObject;
  requiresApproval: boolean;
  approvalId?: string;
  startedAt: string;
  completedAt?: string;
  estimatedCostCents: number;
  error?: string;
};

export type AgentApproval = {
  id: string;
  missionId?: string;
  executionId?: string;
  toolCallId?: string;
  actionType: SensitiveAgentAction;
  status: AgentApprovalStatus;
  requestedBy?: string;
  reviewedBy?: string;
  reason?: string;
  requestedPayload: AgentJsonObject;
  createdAt: string;
  reviewedAt?: string;
  expiresAt?: string;
};

export type AgentLogEntry = {
  id: string;
  missionId?: string;
  executionId?: string;
  level: AgentLogLevel;
  eventName: string;
  message: string;
  context: AgentJsonObject;
  createdAt: string;
};
