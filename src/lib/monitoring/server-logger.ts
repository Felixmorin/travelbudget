type LogLevel = "info" | "warn" | "error";

export type ServerLogContext = Record<string, string | number | boolean | null | undefined>;

export async function logServerEvent(level: LogLevel, message: string, context: ServerLogContext = {}) {
  const payload = {
    level,
    message,
    context: redactContext(context),
    timestamp: new Date().toISOString(),
  };

  if (level === "error") {
    console.error("[travelbudget]", payload);
  } else if (level === "warn") {
    console.warn("[travelbudget]", payload);
  } else if (process.env.API_LOG_LEVEL === "info" || process.env.NODE_ENV !== "production") {
    console.info("[travelbudget]", payload);
  }

  await sendMonitoringWebhook(payload);
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

function redactContext(context: ServerLogContext): ServerLogContext {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => {
      const normalizedKey = key.toLowerCase();

      if (normalizedKey.includes("email")) {
        return [key, typeof value === "string" ? hashIdentifier(value) : "[redacted]"];
      }

      if (normalizedKey.includes("secret") || normalizedKey.includes("token") || normalizedKey.includes("key")) {
        return [key, "[redacted]"];
      }

      return [key, value];
    })
  );
}

async function sendMonitoringWebhook(payload: {
  level: LogLevel;
  message: string;
  context: ServerLogContext;
  timestamp: string;
}) {
  const webhookUrl = process.env.MONITORING_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    return;
  }

  let url: URL;

  try {
    url = new URL(webhookUrl);
  } catch {
    console.error("[travelbudget]", {
      level: "error",
      message: "MONITORING_WEBHOOK_URL is invalid.",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.MONITORING_WEBHOOK_SECRET
          ? { Authorization: `Bearer ${process.env.MONITORING_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch {
    console.warn("[travelbudget]", {
      level: "warn",
      message: "Monitoring webhook delivery failed.",
      timestamp: new Date().toISOString(),
    });
  } finally {
    clearTimeout(timeout);
  }
}

function hashIdentifier(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return `hash:${Math.abs(hash).toString(16)}`;
}
