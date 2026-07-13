export class AgentAdminAuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = "AgentAdminAuthError";
    this.status = status;
  }
}

export function assertAgentAdminToken(value: string | null | undefined) {
  const expectedToken = process.env.AI_AGENT_ADMIN_TOKEN?.trim();
  const providedToken = value?.trim();

  if (!expectedToken) {
    throw new AgentAdminAuthError("AI_AGENT_ADMIN_TOKEN is not configured.", 503);
  }

  if (!providedToken || providedToken !== expectedToken) {
    throw new AgentAdminAuthError("Unauthorized agent request.", 401);
  }
}

export function getAgentAdminAuthResponse(error: unknown) {
  if (error instanceof AgentAdminAuthError) {
    return Response.json({ ok: false, error: error.message }, { status: error.status });
  }

  return null;
}
