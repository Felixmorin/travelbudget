import { saveEmailLead } from "@/lib/leads/email-leads";
import { handleGuardedJsonPost } from "@/lib/security/request-guards";

const maxLeadBodyBytes = 4_096;
const maxLeadRequestsPerHour = 10;
const maxTextLength = 200;

export async function POST(request: Request) {
  return handleGuardedJsonPost({
    request,
    scope: "email-leads",
    maxBodyBytes: maxLeadBodyBytes,
    rateLimit: {
      limit: maxLeadRequestsPerHour,
      windowMs: 60 * 60_000,
    },
    failureLogMessage: "Email lead request failed.",
    failureEventType: "email_lead_error",
    failureResponseError: "Unable to save lead.",
    handler: async (body) => {
      const lead = normalizeLeadPayload(body);

      if (!lead) {
        return Response.json({ ok: false, error: "Invalid lead payload." }, { status: 400 });
      }

      await saveEmailLead({
        ...lead,
        referrer: request.headers.get("referer") ?? undefined,
        userAgent: request.headers.get("user-agent") ?? undefined,
      });

      return Response.json({ ok: true });
    },
  });
}

function normalizeLeadPayload(body: unknown) {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;
  const email = normalizeEmail(payload.email);

  if (!email) {
    return null;
  }

  return {
    email,
    label: normalizeText(payload.label),
    page: normalizeText(payload.page),
    source: normalizeText(payload.source),
    ctaLocation: normalizeText(payload.ctaLocation),
    budget: normalizeNumber(payload.budget),
    currency: normalizeText(payload.currency),
  };
}

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const email = value.trim().toLowerCase();

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }

  return email;
}

function normalizeText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, maxTextLength) : undefined;
}

function normalizeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
