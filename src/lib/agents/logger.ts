import { appendAgentLog } from "@/lib/agents/store";
import type { AgentJsonObject, AgentLogLevel } from "@/lib/agents/types";
import { logServerEvent } from "@/lib/monitoring/server-logger";

export async function logAgentEvent({
  level,
  eventName,
  message,
  missionId,
  executionId,
  context = {},
}: {
  level: AgentLogLevel;
  eventName: string;
  message: string;
  missionId?: string;
  executionId?: string;
  context?: AgentJsonObject;
}) {
  const redactedContext = redactAgentContext(context);

  const [logEntry] = await Promise.all([
    appendAgentLog({
      level,
      eventName,
      message,
      missionId,
      executionId,
      context: redactedContext,
    }),
    logServerEvent(level, message, {
      source: "agents",
      eventName,
      missionId,
      executionId,
    }),
  ]);

  return logEntry;
}

function redactAgentContext(context: AgentJsonObject): AgentJsonObject {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => {
      const normalizedKey = key.toLowerCase();

      if (normalizedKey.includes("email")) {
        return [key, "[redacted]"];
      }

      if (
        normalizedKey.includes("secret") ||
        normalizedKey.includes("token") ||
        normalizedKey.includes("key") ||
        normalizedKey.includes("password")
      ) {
        return [key, "[redacted]"];
      }

      return [key, value];
    })
  );
}
