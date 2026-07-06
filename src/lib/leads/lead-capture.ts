import { insertBackendRecord, isBackendStorageConfigured } from "@/lib/backend/storage";

export type LeadCaptureIntent = "trip_budget" | "price_alert";

export type LeadCapturePayload = {
  email: string;
  intent: LeadCaptureIntent;
  destination?: string;
  origin?: string;
  budget?: number;
  duration?: number;
  source?: string;
  pathname?: string;
};

export type StoredLeadCapture = LeadCapturePayload & {
  id: string;
  timestamp: string;
};

type LeadCaptureStore = {
  leads: StoredLeadCapture[];
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const providerTimeoutMs = 5000;

export class LeadCaptureError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "LeadCaptureError";
    this.status = status;
  }
}

export function isValidEmail(email: string) {
  return emailPattern.test(email.trim());
}

export function normalizeLeadCapturePayload(input: unknown): LeadCapturePayload {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid lead capture payload.");
  }

  const payload = input as Record<string, unknown>;
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const intent = payload.intent;
  const honeypot = normalizeOptionalString(payload.website) ?? normalizeOptionalString(payload.company);

  if (honeypot) {
    throw new LeadCaptureError("Unable to save this email request.", 400);
  }

  if (!isValidEmail(email)) {
    throw new LeadCaptureError("Enter a valid email address.", 400);
  }

  if (intent !== "trip_budget" && intent !== "price_alert") {
    throw new LeadCaptureError("Choose a valid email capture intent.", 400);
  }

  return {
    email,
    intent,
    destination: normalizeOptionalString(payload.destination),
    origin: normalizeOptionalString(payload.origin),
    budget: normalizeOptionalNumber(payload.budget),
    duration: normalizeOptionalNumber(payload.duration),
    source: normalizeOptionalString(payload.source),
    pathname: normalizeOptionalString(payload.pathname),
  };
}

export async function saveLeadCapture(payload: LeadCapturePayload): Promise<StoredLeadCapture> {
  const lead = {
    ...payload,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("leads", {
      id: lead.id,
      email: lead.email,
      intent: lead.intent,
      destination: lead.destination,
      origin: lead.origin,
      budget: lead.budget,
      duration: lead.duration,
      source: lead.source,
      pathname: lead.pathname,
      created_at: lead.timestamp,
    });
  }

  if (process.env.LEAD_CAPTURE_WEBHOOK_URL) {
    await sendLeadCaptureToProvider(lead);
    return lead;
  }

  if (process.env.NODE_ENV === "production" && !isBackendStorageConfigured()) {
    throw new LeadCaptureError("Email capture is not configured.", 503);
  }

  if (process.env.LEAD_CAPTURE_LOG_TO_CONSOLE === "true") {
    console.info("[lead-capture]", lead);
  }

  getDevelopmentStore().leads.push(lead);

  return lead;
}

export function listStoredLeadCaptures() {
  return [...getDevelopmentStore().leads];
}

export function clearStoredLeadCaptures() {
  getDevelopmentStore().leads.length = 0;
}

async function sendLeadCaptureToProvider(lead: StoredLeadCapture) {
  const webhookUrl = process.env.LEAD_CAPTURE_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new LeadCaptureError("Email capture is not configured.", 503);
  }

  let url: URL;

  try {
    url = new URL(webhookUrl);
  } catch {
    throw new LeadCaptureError("Email capture provider is misconfigured.", 500);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), providerTimeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: buildProviderHeaders(),
      body: JSON.stringify({
        event: "lead_capture.created",
        lead,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new LeadCaptureError("Email capture provider rejected the request.", 502);
    }
  } catch (error) {
    if (error instanceof LeadCaptureError) {
      throw error;
    }

    throw new LeadCaptureError("Email capture provider is unavailable.", 502);
  } finally {
    clearTimeout(timeout);
  }
}

function buildProviderHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const secret = process.env.LEAD_CAPTURE_WEBHOOK_SECRET;

  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }

  return headers;
}

function normalizeOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeOptionalNumber(value: unknown) {
  const numberValue = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;

  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function getDevelopmentStore(): LeadCaptureStore {
  const globalStore = globalThis as typeof globalThis & {
    __travelBudgetLeadCaptureStore?: LeadCaptureStore;
  };

  globalStore.__travelBudgetLeadCaptureStore ??= { leads: [] };

  return globalStore.__travelBudgetLeadCaptureStore;
}
