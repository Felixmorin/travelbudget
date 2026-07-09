type LogLevel = "info" | "warn" | "error";

export type ServerLogContext = Record<string, string | number | boolean | null | undefined>;

export type MonitoringWebhookDelivery = {
  configured: boolean;
  delivered: boolean;
  status: number | null;
  error: string | null;
};

export async function logServerEvent(level: LogLevel, message: string, context: ServerLogContext = {}) {
  const payload = {
    level,
    message,
    context: redactContext(context),
    timestamp: new Date().toISOString(),
  };

  if (level === "error") {
    console.error("[gobybudget]", payload);
  } else if (level === "warn") {
    console.warn("[gobybudget]", payload);
  } else if (process.env.API_LOG_LEVEL === "info" || process.env.NODE_ENV !== "production") {
    console.info("[gobybudget]", payload);
  }

  return sendMonitoringWebhook(payload);
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export function getMonitoringStatus() {
  const webhookUrl = process.env.MONITORING_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.MONITORING_WEBHOOK_SECRET?.trim();
  const incidentProvider = process.env.INCIDENT_ALERTING_PROVIDER?.trim();
  const incidentEscalationTarget = process.env.INCIDENT_ALERTING_ESCALATION_TARGET?.trim();
  const incidentRunbookUrl = process.env.INCIDENT_ALERTING_RUNBOOK_URL?.trim();
  let webhookUrlHost: string | null = null;
  let webhookUrlError: string | null = null;

  if (webhookUrl) {
    try {
      webhookUrlHost = new URL(webhookUrl).hostname;
    } catch {
      webhookUrlError = "MONITORING_WEBHOOK_URL is invalid.";
    }
  }

  const webhookConfigured = Boolean(webhookUrl && webhookSecret && !webhookUrlError);
  const alternativeConfigured = Boolean(incidentProvider && incidentEscalationTarget);

  return {
    configured: webhookConfigured || alternativeConfigured,
    webhook: {
      configured: webhookConfigured,
      urlConfigured: Boolean(webhookUrl),
      secretConfigured: Boolean(webhookSecret),
      urlHost: webhookUrlHost,
      error: webhookUrlError,
    },
    alternative: {
      configured: alternativeConfigured,
      provider: incidentProvider || null,
      escalationTargetConfigured: Boolean(incidentEscalationTarget),
      runbookUrlConfigured: Boolean(incidentRunbookUrl),
    },
  };
}

export async function sendMonitoringWebhook(payload: {
  level: LogLevel;
  message: string;
  context: ServerLogContext;
  timestamp: string;
}): Promise<MonitoringWebhookDelivery> {
  const notDelivered = (error: string | null): MonitoringWebhookDelivery => ({
    configured: false,
    delivered: false,
    status: null,
    error,
  });
  const webhookUrl = process.env.MONITORING_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.MONITORING_WEBHOOK_SECRET?.trim();

  if (!webhookUrl) {
    return notDelivered(null);
  }

  if (!webhookSecret) {
    const error = "MONITORING_WEBHOOK_SECRET is required when MONITORING_WEBHOOK_URL is configured.";

    console.error("[gobybudget]", {
      level: "error",
      message: error,
      timestamp: new Date().toISOString(),
    });

    return notDelivered(error);
  }

  let url: URL;

  try {
    url = new URL(webhookUrl);
  } catch {
    const error = "MONITORING_WEBHOOK_URL is invalid.";

    console.error("[gobybudget]", {
      level: "error",
      message: error,
      timestamp: new Date().toISOString(),
    });

    return notDelivered(error);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${webhookSecret}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = "Monitoring webhook delivery failed.";

      console.warn("[gobybudget]", {
        level: "warn",
        message: error,
        status: response.status,
        timestamp: new Date().toISOString(),
      });

      return {
        configured: true,
        delivered: false,
        status: response.status,
        error,
      };
    }

    return {
      configured: true,
      delivered: true,
      status: response.status,
      error: null,
    };
  } catch {
    const error = "Monitoring webhook delivery failed.";

    console.warn("[gobybudget]", {
      level: "warn",
      message: error,
      timestamp: new Date().toISOString(),
    });

    return {
      configured: true,
      delivered: false,
      status: null,
      error,
    };
  } finally {
    clearTimeout(timeout);
  }
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

function hashIdentifier(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return `hash:${Math.abs(hash).toString(16)}`;
}
