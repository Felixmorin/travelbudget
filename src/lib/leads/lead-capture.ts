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

  if (!isValidEmail(email)) {
    throw new Error("Enter a valid email address.");
  }

  if (intent !== "trip_budget" && intent !== "price_alert") {
    throw new Error("Choose a valid email capture intent.");
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
