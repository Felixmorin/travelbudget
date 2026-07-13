import type { AgentDefinition, AgentPermission, SensitiveAgentAction } from "@/lib/agents/types";

export class AgentPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AgentPermissionError";
  }
}

export function assertAgentPermission(agent: AgentDefinition, permission: AgentPermission) {
  if (!agent.permissions.includes(permission)) {
    throw new AgentPermissionError(`Agent ${agent.id} does not have permission ${permission}.`);
  }
}

export function requiresApproval(agent: AgentDefinition, action: SensitiveAgentAction) {
  return agent.requiresApprovalFor.includes(action);
}

export function assertSensitiveActionApproved({
  agent,
  action,
  approved,
}: {
  agent: AgentDefinition;
  action: SensitiveAgentAction;
  approved: boolean;
}) {
  if (requiresApproval(agent, action) && !approved) {
    throw new AgentPermissionError(`Sensitive action ${action} requires approval.`);
  }
}
