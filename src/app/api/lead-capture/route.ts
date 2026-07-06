import { LeadCaptureError, normalizeLeadCapturePayload, saveLeadCapture } from "@/lib/leads/lead-capture";
import { getErrorMessage, logServerEvent } from "@/lib/monitoring/server-logger";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request);
    const payload = normalizeLeadCapturePayload(body);
    const rateLimit = checkLeadCaptureRateLimit(request, payload.email);

    if (!rateLimit.allowed) {
      return Response.json(
        {
          ok: false,
          error: "Too many email requests. Try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const lead = await saveLeadCapture(payload);
    await logServerEvent("info", "Lead capture saved.", {
      email: payload.email,
      intent: payload.intent,
      source: payload.source,
    });

    return Response.json({
      ok: true,
      leadId: lead.id,
      timestamp: lead.timestamp,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save this email request.";
    const status = error instanceof LeadCaptureError ? error.status : 500;
    await logServerEvent(status >= 500 ? "error" : "warn", "Lead capture request failed.", {
      error: getErrorMessage(error),
      status,
    });

    return Response.json(
      {
        ok: false,
        error: message,
      },
      { status }
    );
  }
}

async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new LeadCaptureError("Invalid lead capture payload.", 400);
  }
}

export function clearLeadCaptureRateLimits() {
  getRateLimitStore().clear();
}

function checkLeadCaptureRateLimit(request: Request, email: string) {
  const now = Date.now();
  const identifier = getClientIdentifier(request);
  const keys = [`ip:${identifier}`, `email:${email}`];
  const store = getRateLimitStore();

  for (const key of keys) {
    const record = store.get(key);

    if (record && record.resetAt > now && record.count >= maxRequestsPerWindow) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
      };
    }
  }

  for (const key of keys) {
    const record = store.get(key);

    if (!record || record.resetAt <= now) {
      store.set(key, {
        count: 1,
        resetAt: now + rateLimitWindowMs,
      });
    } else {
      record.count += 1;
    }
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return (
    forwardedFor ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

function getRateLimitStore() {
  const globalStore = globalThis as typeof globalThis & {
    __travelBudgetLeadCaptureRateLimits?: Map<string, RateLimitRecord>;
  };

  globalStore.__travelBudgetLeadCaptureRateLimits ??= new Map<string, RateLimitRecord>();

  return globalStore.__travelBudgetLeadCaptureRateLimits;
}
