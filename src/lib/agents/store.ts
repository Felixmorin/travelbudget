import { assertAgentsEnabled } from "@/lib/agents/config";
import { resolveAgentLimits } from "@/lib/agents/limits";
import { getAgentDefinition } from "@/lib/agents/registry";
import type {
  AgentApproval,
  AgentDefinition,
  AgentExecution,
  AgentJsonObject,
  AgentLogEntry,
  AgentMission,
  AgentToolCall,
  AgentToolCallStatus,
  SensitiveAgentAction,
} from "@/lib/agents/types";
import { insertBackendRecord, isBackendStorageConfigured, selectBackendRecords } from "@/lib/backend/storage";

export async function registerAgentDefinition(agent: AgentDefinition) {
  const now = new Date().toISOString();

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("agent_definitions", {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      version: agent.version,
      status: agent.status,
      permissions: agent.permissions,
      default_cost_limit_cents: agent.defaultCostLimitCents,
      default_step_limit: agent.defaultStepLimit,
      requires_approval_for: agent.requiresApprovalFor,
      created_at: now,
      updated_at: now,
    });
  } else {
    const store = getDevelopmentStore();
    store.agentDefinitions = store.agentDefinitions.filter((definition) => definition.id !== agent.id);
    store.agentDefinitions.push(agent);
  }
}

export async function createAgentMission({
  agentId,
  objective,
  requestedBy,
  input = {},
  costLimitCents,
  stepLimit,
  status = "draft",
}: {
  agentId: AgentMission["agentId"];
  objective: string;
  requestedBy?: string;
  input?: AgentJsonObject;
  costLimitCents?: number;
  stepLimit?: number;
  status?: AgentMission["status"];
}) {
  assertAgentsEnabled();

  if (await isAgentRuntimeStopped()) {
    throw new AgentRuntimeStoppedError("Agent runtime is globally stopped.");
  }

  const agent = getAgentDefinition(agentId);
  const limits = resolveAgentLimits(agent, { costLimitCents, stepLimit });
  const now = new Date().toISOString();
  const mission: AgentMission = {
    id: crypto.randomUUID(),
    agentId,
    objective: objective.trim().slice(0, 1_000),
    status,
    requestedBy,
    input,
    costLimitCents: limits.costLimitCents,
    stepLimit: limits.stepLimit,
    createdAt: now,
    updatedAt: now,
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("agent_missions", {
      id: mission.id,
      agent_id: mission.agentId,
      objective: mission.objective,
      status: mission.status,
      requested_by: mission.requestedBy,
      input: mission.input,
      cost_limit_cents: mission.costLimitCents,
      step_limit: mission.stepLimit,
      created_at: mission.createdAt,
      updated_at: mission.updatedAt,
    });
  } else {
    getDevelopmentStore().missions.push(mission);
  }

  return mission;
}

export async function createAgentExecution({
  mission,
  triggerType,
  model,
}: {
  mission: AgentMission;
  triggerType: AgentExecution["triggerType"];
  model?: string;
}) {
  assertAgentsEnabled();

  const now = new Date().toISOString();
  const execution: AgentExecution = {
    id: crypto.randomUUID(),
    missionId: mission.id,
    agentId: mission.agentId,
    status: "queued",
    triggerType,
    model,
    stepCount: 0,
    estimatedCostCents: 0,
    startedAt: now,
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("agent_executions", {
      id: execution.id,
      mission_id: execution.missionId,
      agent_id: execution.agentId,
      status: execution.status,
      trigger_type: execution.triggerType,
      model: execution.model,
      step_count: execution.stepCount,
      estimated_cost_cents: execution.estimatedCostCents,
      started_at: execution.startedAt,
    });
  } else {
    getDevelopmentStore().executions.push(execution);
  }

  return execution;
}

export async function recordCompletedAgentExecution({
  mission,
  triggerType,
  model,
  stepCount,
  estimatedCostCents,
  output,
  error,
}: {
  mission: AgentMission;
  triggerType: AgentExecution["triggerType"];
  model?: string;
  stepCount: number;
  estimatedCostCents: number;
  output?: AgentJsonObject;
  error?: string;
}) {
  assertAgentsEnabled();

  const now = new Date().toISOString();
  const execution: AgentExecution = {
    id: crypto.randomUUID(),
    missionId: mission.id,
    agentId: mission.agentId,
    status: error ? "failed" : "completed",
    triggerType,
    model,
    stepCount,
    estimatedCostCents,
    output,
    error,
    startedAt: now,
    completedAt: now,
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("agent_executions", {
      id: execution.id,
      mission_id: execution.missionId,
      agent_id: execution.agentId,
      status: execution.status,
      trigger_type: execution.triggerType,
      model: execution.model,
      step_count: execution.stepCount,
      estimated_cost_cents: execution.estimatedCostCents,
      output: execution.output,
      error: execution.error,
      started_at: execution.startedAt,
      completed_at: execution.completedAt,
    });
  } else {
    getDevelopmentStore().executions.push(execution);
  }

  return execution;
}

export async function recordAgentToolCall({
  execution,
  toolName,
  permission,
  input = {},
  status = "running",
  requiresApproval = false,
  approvalId,
  estimatedCostCents = 0,
}: {
  execution: AgentExecution;
  toolName: string;
  permission: AgentToolCall["permission"];
  input?: AgentJsonObject;
  status?: AgentToolCallStatus;
  requiresApproval?: boolean;
  approvalId?: string;
  estimatedCostCents?: number;
}) {
  const now = new Date().toISOString();
  const toolCall: AgentToolCall = {
    id: crypto.randomUUID(),
    executionId: execution.id,
    toolName,
    permission,
    status,
    input,
    requiresApproval,
    approvalId,
    startedAt: now,
    estimatedCostCents,
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("agent_tool_calls", {
      id: toolCall.id,
      execution_id: toolCall.executionId,
      tool_name: toolCall.toolName,
      permission: toolCall.permission,
      status: toolCall.status,
      input: toolCall.input,
      requires_approval: toolCall.requiresApproval,
      approval_id: toolCall.approvalId,
      started_at: toolCall.startedAt,
      estimated_cost_cents: toolCall.estimatedCostCents,
    });
  } else {
    getDevelopmentStore().toolCalls.push(toolCall);
  }

  return toolCall;
}

export async function requestAgentApproval({
  actionType,
  missionId,
  executionId,
  toolCallId,
  requestedBy,
  reason,
  requestedPayload = {},
  expiresAt,
}: {
  actionType: SensitiveAgentAction;
  missionId?: string;
  executionId?: string;
  toolCallId?: string;
  requestedBy?: string;
  reason?: string;
  requestedPayload?: AgentJsonObject;
  expiresAt?: string;
}) {
  const approval: AgentApproval = {
    id: crypto.randomUUID(),
    missionId,
    executionId,
    toolCallId,
    actionType,
    status: "pending",
    requestedBy,
    reason,
    requestedPayload,
    createdAt: new Date().toISOString(),
    expiresAt,
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("agent_approvals", {
      id: approval.id,
      mission_id: approval.missionId,
      execution_id: approval.executionId,
      tool_call_id: approval.toolCallId,
      action_type: approval.actionType,
      status: approval.status,
      requested_by: approval.requestedBy,
      reason: approval.reason,
      requested_payload: approval.requestedPayload,
      created_at: approval.createdAt,
      expires_at: approval.expiresAt,
    });
  } else {
    getDevelopmentStore().approvals.push(approval);
  }

  return approval;
}

export async function appendAgentLog(entry: Omit<AgentLogEntry, "id" | "createdAt">) {
  const logEntry: AgentLogEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("agent_logs", {
      id: logEntry.id,
      mission_id: logEntry.missionId,
      execution_id: logEntry.executionId,
      level: logEntry.level,
      event_name: logEntry.eventName,
      message: logEntry.message,
      context: logEntry.context,
      created_at: logEntry.createdAt,
    });
  } else {
    getDevelopmentStore().logs.push(logEntry);
  }

  return logEntry;
}

export function listDevelopmentAgentRecords() {
  const store = getDevelopmentStore();

  return {
    agentDefinitions: [...store.agentDefinitions],
    missions: [...store.missions],
    executions: [...store.executions],
    toolCalls: [...store.toolCalls],
    approvals: [...store.approvals],
    logs: [...store.logs],
    runtimeControls: [...store.runtimeControls],
  };
}

export async function listAgentExecutions(agentId: AgentMission["agentId"], limit = 25) {
  if (isBackendStorageConfigured()) {
    const records = await selectBackendRecords("agent_executions", {
      agent_id: `eq.${agentId}`,
      limit: String(Math.max(1, Math.min(100, limit))),
    });

    return records.map((record) => ({
      id: String(record.id ?? ""),
      missionId: String(record.mission_id ?? ""),
      agentId,
      status: normalizeExecutionStatus(record.status),
      triggerType: normalizeTriggerType(record.trigger_type),
      model: typeof record.model === "string" ? record.model : undefined,
      stepCount: normalizeNumber(record.step_count),
      estimatedCostCents: normalizeNumber(record.estimated_cost_cents),
      output: parseJsonObject(record.output),
      error: typeof record.error === "string" ? record.error : undefined,
      startedAt: String(record.started_at ?? ""),
      completedAt: typeof record.completed_at === "string" ? record.completed_at : undefined,
    }));
  }

  return getDevelopmentStore()
    .executions.filter((execution) => execution.agentId === agentId)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, limit);
}

export async function listAgentMissions(limit = 100) {
  if (isBackendStorageConfigured()) {
    const records = await selectBackendRecords("agent_missions", {
      limit: String(Math.max(1, Math.min(500, limit))),
    });

    return records.map((record) => ({
      id: String(record.id ?? ""),
      agentId: normalizeAgentId(record.agent_id),
      objective: String(record.objective ?? ""),
      status: normalizeMissionStatus(record.status),
      requestedBy: typeof record.requested_by === "string" ? record.requested_by : undefined,
      input: parseJsonObject(record.input) ?? {},
      costLimitCents: normalizeNumber(record.cost_limit_cents),
      stepLimit: normalizeNumber(record.step_limit),
      createdAt: String(record.created_at ?? ""),
      updatedAt: String(record.updated_at ?? ""),
    }));
  }

  return getDevelopmentStore()
    .missions.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function listAgentApprovals(limit = 100) {
  if (isBackendStorageConfigured()) {
    const records = await selectBackendRecords("agent_approvals", {
      limit: String(Math.max(1, Math.min(500, limit))),
    });

    return records.map((record) => ({
      id: String(record.id ?? ""),
      missionId: typeof record.mission_id === "string" ? record.mission_id : undefined,
      executionId: typeof record.execution_id === "string" ? record.execution_id : undefined,
      toolCallId: typeof record.tool_call_id === "string" ? record.tool_call_id : undefined,
      actionType: normalizeSensitiveAction(record.action_type),
      status: normalizeApprovalStatus(record.status),
      requestedBy: typeof record.requested_by === "string" ? record.requested_by : undefined,
      reviewedBy: typeof record.reviewed_by === "string" ? record.reviewed_by : undefined,
      reason: typeof record.reason === "string" ? record.reason : undefined,
      requestedPayload: parseJsonObject(record.requested_payload) ?? {},
      createdAt: String(record.created_at ?? ""),
      reviewedAt: typeof record.reviewed_at === "string" ? record.reviewed_at : undefined,
      expiresAt: typeof record.expires_at === "string" ? record.expires_at : undefined,
    }));
  }

  return getDevelopmentStore()
    .approvals.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function listAgentToolCalls(limit = 100) {
  if (isBackendStorageConfigured()) {
    const records = await selectBackendRecords("agent_tool_calls", {
      limit: String(Math.max(1, Math.min(500, limit))),
    });

    return records.map((record) => ({
      id: String(record.id ?? ""),
      executionId: String(record.execution_id ?? ""),
      toolName: String(record.tool_name ?? ""),
      permission: normalizePermission(record.permission),
      status: normalizeToolCallStatus(record.status),
      input: parseJsonObject(record.input) ?? {},
      output: parseJsonObject(record.output),
      requiresApproval: record.requires_approval === true,
      approvalId: typeof record.approval_id === "string" ? record.approval_id : undefined,
      startedAt: String(record.started_at ?? ""),
      completedAt: typeof record.completed_at === "string" ? record.completed_at : undefined,
      estimatedCostCents: normalizeNumber(record.estimated_cost_cents),
      error: typeof record.error === "string" ? record.error : undefined,
    }));
  }

  return getDevelopmentStore()
    .toolCalls.sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, limit);
}

export async function listAllAgentExecutions(limit = 100) {
  if (isBackendStorageConfigured()) {
    const records = await selectBackendRecords("agent_executions", {
      limit: String(Math.max(1, Math.min(500, limit))),
    });

    return records.map((record) => ({
      id: String(record.id ?? ""),
      missionId: String(record.mission_id ?? ""),
      agentId: normalizeAgentId(record.agent_id),
      status: normalizeExecutionStatus(record.status),
      triggerType: normalizeTriggerType(record.trigger_type),
      model: typeof record.model === "string" ? record.model : undefined,
      stepCount: normalizeNumber(record.step_count),
      estimatedCostCents: normalizeNumber(record.estimated_cost_cents),
      output: parseJsonObject(record.output),
      error: typeof record.error === "string" ? record.error : undefined,
      startedAt: String(record.started_at ?? ""),
      completedAt: typeof record.completed_at === "string" ? record.completed_at : undefined,
    }));
  }

  return getDevelopmentStore()
    .executions.sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, limit);
}

export async function stopAgentRuntime({ requestedBy, reason }: { requestedBy?: string; reason?: string } = {}) {
  const control = {
    id: crypto.randomUUID(),
    controlKey: "global_agents_enabled",
    isEnabled: false,
    reason: reason?.trim().slice(0, 500),
    requestedBy,
    createdAt: new Date().toISOString(),
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("agent_runtime_controls", {
      id: control.id,
      control_key: control.controlKey,
      is_enabled: control.isEnabled,
      reason: control.reason,
      requested_by: control.requestedBy,
      created_at: control.createdAt,
    });
  } else {
    getDevelopmentStore().runtimeControls.push(control);
  }

  return control;
}

export async function getAgentRuntimeControl() {
  if (isBackendStorageConfigured()) {
    const records = await selectBackendRecords("agent_runtime_controls", {
      control_key: "eq.global_agents_enabled",
      limit: "1",
    });
    const record = records[0];

    return {
      stopped: record ? record.is_enabled === false : false,
      reason: typeof record?.reason === "string" ? record.reason : undefined,
      requestedBy: typeof record?.requested_by === "string" ? record.requested_by : undefined,
      createdAt: typeof record?.created_at === "string" ? record.created_at : undefined,
    };
  }

  const latest = [...getDevelopmentStore().runtimeControls].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  return {
    stopped: latest ? !latest.isEnabled : false,
    reason: latest?.reason,
    requestedBy: latest?.requestedBy,
    createdAt: latest?.createdAt,
  };
}

export async function isAgentRuntimeStopped() {
  return (await getAgentRuntimeControl()).stopped;
}

export function clearDevelopmentAgentRecords() {
  const store = getDevelopmentStore();

  store.agentDefinitions.length = 0;
  store.missions.length = 0;
  store.executions.length = 0;
  store.toolCalls.length = 0;
  store.approvals.length = 0;
  store.logs.length = 0;
  store.runtimeControls.length = 0;
}

function getDevelopmentStore(): {
  agentDefinitions: AgentDefinition[];
  missions: AgentMission[];
  executions: AgentExecution[];
  toolCalls: AgentToolCall[];
  approvals: AgentApproval[];
  logs: AgentLogEntry[];
  runtimeControls: AgentRuntimeControlRecord[];
} {
  const globalStore = globalThis as typeof globalThis & {
    __travelBudgetAgentStore?: {
      agentDefinitions: AgentDefinition[];
      missions: AgentMission[];
      executions: AgentExecution[];
      toolCalls: AgentToolCall[];
      approvals: AgentApproval[];
      logs: AgentLogEntry[];
      runtimeControls: AgentRuntimeControlRecord[];
    };
  };

  globalStore.__travelBudgetAgentStore ??= {
    agentDefinitions: [],
    missions: [],
    executions: [],
    toolCalls: [],
    approvals: [],
    logs: [],
    runtimeControls: [],
  };

  return globalStore.__travelBudgetAgentStore;
}

function parseJsonObject(value: unknown): AgentJsonObject | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as AgentJsonObject) : undefined;
    } catch {
      return undefined;
    }
  }

  return typeof value === "object" && !Array.isArray(value) ? (value as AgentJsonObject) : undefined;
}

function normalizeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeExecutionStatus(value: unknown): AgentExecution["status"] {
  return value === "running" ||
    value === "completed" ||
    value === "failed" ||
    value === "cancelled" ||
    value === "blocked"
    ? value
    : "queued";
}

function normalizeTriggerType(value: unknown): AgentExecution["triggerType"] {
  return value === "scheduled" || value === "test" ? value : "manual";
}

function normalizeAgentId(value: unknown): AgentMission["agentId"] {
  return value === "captain" ? "captain" : "product-analyst";
}

function normalizeMissionStatus(value: unknown): AgentMission["status"] {
  return value === "pending_approval" ||
    value === "approved" ||
    value === "running" ||
    value === "completed" ||
    value === "failed" ||
    value === "cancelled"
    ? value
    : "draft";
}

function normalizeApprovalStatus(value: unknown): AgentApproval["status"] {
  return value === "approved" || value === "rejected" || value === "expired" ? value : "pending";
}

function normalizeToolCallStatus(value: unknown): AgentToolCall["status"] {
  return value === "pending_approval" ||
    value === "completed" ||
    value === "failed" ||
    value === "blocked"
    ? value
    : "running";
}

function normalizeSensitiveAction(value: unknown): AgentApproval["actionType"] {
  return value === "lead:raw-read" ||
    value === "external:send" ||
    value === "report:publish" ||
    value === "agent:mission-create" ||
    value === "production:run"
    ? value
    : "database:write";
}

function normalizePermission(value: unknown): AgentToolCall["permission"] {
  return value === "affiliate:read:aggregate" ||
    value === "leads:read:aggregate" ||
    value === "destinations:read" ||
    value === "reports:write" ||
    value === "agents:read" ||
    value === "missions:write" ||
    value === "approvals:write" ||
    value === "notifications:send"
    ? value
    : "analytics:read:aggregate";
}

type AgentRuntimeControlRecord = {
  id: string;
  controlKey: string;
  isEnabled: boolean;
  reason?: string;
  requestedBy?: string;
  createdAt: string;
};

export class AgentRuntimeStoppedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AgentRuntimeStoppedError";
  }
}
