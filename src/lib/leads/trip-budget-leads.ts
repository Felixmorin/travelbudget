import { saveAnalyticsEvent } from "@/lib/analytics/server-events";
import { insertBackendRecord, isBackendStorageConfigured } from "@/lib/backend/storage";
import { getErrorMessage, logServerEvent } from "@/lib/monitoring/server-logger";
import type { TripBudgetSnapshot } from "./trip-budget-types";

export type TripBudgetLeadPayload = {
  email: string;
  budgetEmailConsent: boolean;
  marketingConsent: boolean;
  consentTimestamp: string;
  lead: TripBudgetSnapshot;
  referrer?: string;
  userAgent?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
};

export type StoredTripBudgetLead = TripBudgetLeadPayload & {
  id: string;
  createdAt: string;
  emailSentAt: string | null;
  emailStatus: "pending" | "sent" | "failed" | "skipped";
  emailProviderId: string | null;
  submissionFingerprint: string;
};

type DeliveryResult = {
  providerId: string | null;
  sentAt: string | null;
  status: "sent" | "failed" | "skipped";
};

const providerTimeoutMs = 8000;

export async function saveTripBudgetLead(payload: TripBudgetLeadPayload) {
  const createdAt = new Date().toISOString();
  const submissionFingerprint = await createSubmissionFingerprint(payload.email, payload.lead);
  const recentDuplicate = findRecentDuplicate(payload.email, submissionFingerprint);

  if (recentDuplicate) {
    return { lead: recentDuplicate, duplicate: true };
  }

  const pendingLead: StoredTripBudgetLead = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt,
    emailSentAt: null,
    emailStatus: "pending",
    emailProviderId: null,
    submissionFingerprint,
  };

  const delivery = await sendTripBudgetEmail(payload)
    .then((result) => result)
    .catch(async (error): Promise<DeliveryResult> => {
      await logServerEvent(
        "warn",
        "Trip budget email delivery failed.",
        {
          error: getErrorMessage(error),
          sourcePage: payload.lead.sourcePage,
        },
        "email_lead_error"
      );

      return { providerId: null, sentAt: null, status: "failed" };
    });

  const storedLead: StoredTripBudgetLead = {
    ...pendingLead,
    emailProviderId: delivery.providerId,
    emailSentAt: delivery.sentAt,
    emailStatus: delivery.status,
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("trip_budget_leads", {
      id: storedLead.id,
      email: storedLead.email,
      origin: storedLead.lead.origin,
      destination: storedLead.lead.destination,
      budget_amount: storedLead.lead.budgetAmount,
      budget_currency: storedLead.lead.budgetCurrency,
      trip_duration_days: storedLead.lead.tripDurationDays,
      travel_style: storedLead.lead.travelStyle,
      traveler_count: storedLead.lead.travelerCount,
      estimated_total: storedLead.lead.estimatedTotal,
      flight_estimate: storedLead.lead.flightEstimate,
      hotel_estimate: storedLead.lead.hotelEstimate,
      food_estimate: storedLead.lead.foodEstimate,
      transport_estimate: storedLead.lead.transportEstimate,
      activities_estimate: storedLead.lead.activitiesEstimate,
      buffer_estimate: storedLead.lead.bufferEstimate,
      result_payload: storedLead.lead,
      source_page: storedLead.lead.sourcePage,
      marketing_consent: storedLead.marketingConsent,
      budget_email_consent: storedLead.budgetEmailConsent,
      consent_timestamp: storedLead.consentTimestamp,
      utm_source: storedLead.utmSource,
      utm_medium: storedLead.utmMedium,
      utm_campaign: storedLead.utmCampaign,
      utm_content: storedLead.utmContent,
      referrer: storedLead.referrer,
      created_at: storedLead.createdAt,
      email_sent_at: storedLead.emailSentAt,
      email_status: storedLead.emailStatus,
      email_provider_id: storedLead.emailProviderId,
      submission_fingerprint: storedLead.submissionFingerprint,
    });
  } else {
    getDevelopmentStore().tripBudgetLeads.push(storedLead);
  }

  await saveAnalyticsEvent({
    eventName: "trip_budget_email_saved",
    properties: getSafeAnalyticsProperties(payload.lead),
    referrer: payload.referrer,
    userAgent: payload.userAgent,
  });
  await saveAnalyticsEvent({
    eventName: delivery.status === "sent" ? "trip_budget_email_sent" : "trip_budget_email_failed",
    properties: {
      ...getSafeAnalyticsProperties(payload.lead),
      emailStatus: delivery.status,
    },
    referrer: payload.referrer,
    userAgent: payload.userAgent,
  });

  return { lead: storedLead, duplicate: false };
}

export function listStoredTripBudgetLeads() {
  return [...getDevelopmentStore().tripBudgetLeads];
}

export function clearStoredTripBudgetLeads() {
  getDevelopmentStore().tripBudgetLeads.length = 0;
}

async function sendTripBudgetEmail(payload: TripBudgetLeadPayload): Promise<DeliveryResult> {
  if (process.env.TRIP_BUDGET_EMAIL_DELIVERY_MODE === "skip") {
    return { providerId: null, sentAt: null, status: "skipped" };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM_ADDRESS?.trim();

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY and EMAIL_FROM_ADDRESS are required.");
    }

    return { providerId: null, sentAt: null, status: "skipped" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), providerTimeoutMs);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: payload.email,
        subject: "Your GoByBudget trip estimate",
        html: renderTripBudgetEmail(payload.lead),
        text: renderTripBudgetTextEmail(payload.lead),
      }),
      signal: controller.signal,
    });

    const result = (await response.json().catch(() => ({}))) as { id?: string };

    if (!response.ok) {
      throw new Error(`Resend rejected email with status ${response.status}.`);
    }

    return {
      providerId: result.id ?? null,
      sentAt: new Date().toISOString(),
      status: "sent",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function renderTripBudgetEmail(lead: TripBudgetSnapshot) {
  const destinationRows = lead.destinations
    .map(
      (destination) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;">
            <strong>${escapeHtml(destination.title)}</strong>
            ${destination.country ? `<br><span style="color:#64748b;">${escapeHtml(destination.country)}</span>` : ""}
          </td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatMoney(destination.estimatedTotal, lead.budgetCurrency)}</td>
        </tr>`
    )
    .join("");
  const affiliateLinks = lead.destinations[0]?.affiliateLinks?.slice(0, 3) ?? [];
  const affiliateCtas = affiliateLinks
    .map(
      (link) => `
        <a href="${escapeAttribute(resolveEmailHref(link.href))}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 14px;border:1px solid #cbd5e1;border-radius:12px;color:#0B1D34;text-decoration:none;font-weight:700;">
          ${escapeHtml(link.label)}
        </a>`
    )
    .join("");

  return `
<!doctype html>
<html>
  <body style="margin:0;background:#f7f9fb;font-family:Arial,sans-serif;color:#191c1e;">
    <div style="max-width:680px;margin:0 auto;padding:24px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;padding:24px;">
        <p style="margin:0 0 8px;color:#0B1D34;font-weight:700;">GoByBudget</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Your trip budget estimate</h1>
        <p style="margin:0 0 20px;line-height:1.6;color:#475569;">Here is the travel budget you requested. Prices are planning estimates, not guaranteed live fares.</p>
        <table style="width:100%;border-collapse:collapse;margin:0 0 20px;">
          <tr><td style="padding:8px 0;color:#64748b;">From</td><td style="padding:8px 0;text-align:right;font-weight:700;">${escapeHtml(lead.origin)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Budget</td><td style="padding:8px 0;text-align:right;font-weight:700;">${formatMoney(lead.budgetAmount, lead.budgetCurrency)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Trip length</td><td style="padding:8px 0;text-align:right;font-weight:700;">${lead.tripDurationDays} days</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Travelers</td><td style="padding:8px 0;text-align:right;font-weight:700;">${lead.travelerCount}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Style</td><td style="padding:8px 0;text-align:right;font-weight:700;">${escapeHtml(lead.travelStyle)}</td></tr>
        </table>
        <h2 style="font-size:18px;margin:20px 0 10px;">Recommended destinations</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">${destinationRows}</table>
        <h2 style="font-size:18px;margin:24px 0 10px;">Cost breakdown</h2>
        ${renderBreakdownList(lead)}
        <p style="margin:24px 0 16px;">
          <a href="${escapeAttribute(lead.resultUrl ?? getSiteUrl())}" style="display:inline-block;background:#0B1D34;color:#ffffff;text-decoration:none;padding:13px 18px;border-radius:999px;font-weight:700;">Return to GoByBudget</a>
        </p>
        ${affiliateCtas ? `<div style="margin:20px 0;">${affiliateCtas}</div>` : ""}
        <p style="font-size:12px;line-height:1.6;color:#64748b;">You are receiving this email because you asked GoByBudget to send this trip budget to your inbox. Marketing emails are only sent if you separately opted in.</p>
        <p style="font-size:12px;color:#64748b;"><a href="${getSiteUrl()}/privacy">Privacy Policy</a> · <a href="${getSiteUrl()}/terms">Terms</a></p>
      </div>
    </div>
  </body>
</html>`;
}

function renderBreakdownList(lead: TripBudgetSnapshot) {
  const rows = [
    ["Flights", lead.flightEstimate],
    ["Hotels", lead.hotelEstimate],
    ["Food", lead.foodEstimate],
    ["Local transportation", lead.transportEstimate],
    ["Activities", lead.activitiesEstimate],
    ["Buffer", lead.bufferEstimate],
    ["Estimated total", lead.estimatedTotal],
  ];

  return rows
    .map(
      ([label, amount]) =>
        `<p style="margin:0;padding:9px 0;border-bottom:1px solid #e5e7eb;"><span style="color:#64748b;">${label}</span><strong style="float:right;">${formatMoney(Number(amount), lead.budgetCurrency)}</strong></p>`
    )
    .join("");
}

function renderTripBudgetTextEmail(lead: TripBudgetSnapshot) {
  return [
    "Your GoByBudget trip estimate",
    "",
    `From: ${lead.origin}`,
    `Destination: ${lead.destination ?? lead.destinations.map((destination) => destination.title).join(", ")}`,
    `Budget: ${formatMoney(lead.budgetAmount, lead.budgetCurrency)}`,
    `Duration: ${lead.tripDurationDays} days`,
    `Travelers: ${lead.travelerCount}`,
    `Style: ${lead.travelStyle}`,
    `Estimated total: ${formatMoney(lead.estimatedTotal, lead.budgetCurrency)}`,
    `Flights: ${formatMoney(lead.flightEstimate, lead.budgetCurrency)}`,
    `Hotels: ${formatMoney(lead.hotelEstimate, lead.budgetCurrency)}`,
    `Food: ${formatMoney(lead.foodEstimate, lead.budgetCurrency)}`,
    `Local transportation: ${formatMoney(lead.transportEstimate, lead.budgetCurrency)}`,
    `Activities: ${formatMoney(lead.activitiesEstimate, lead.budgetCurrency)}`,
    `Buffer: ${formatMoney(lead.bufferEstimate, lead.budgetCurrency)}`,
    "",
    "Prices are estimates, not guaranteed live fares.",
    `Return to GoByBudget: ${lead.resultUrl ?? getSiteUrl()}`,
    `Privacy: ${getSiteUrl()}/privacy`,
    `Terms: ${getSiteUrl()}/terms`,
    "",
    "You are receiving this email because you asked GoByBudget to send this trip budget.",
  ].join("\n");
}

function findRecentDuplicate(email: string, submissionFingerprint: string) {
  const tenMinutesAgo = Date.now() - 10 * 60_000;

  return getDevelopmentStore().tripBudgetLeads.find(
    (lead) =>
      lead.email === email &&
      lead.submissionFingerprint === submissionFingerprint &&
      new Date(lead.createdAt).getTime() >= tenMinutesAgo
  );
}

async function createSubmissionFingerprint(email: string, lead: TripBudgetSnapshot) {
  const payload = JSON.stringify({
    email,
    origin: lead.origin,
    destination: lead.destination,
    budgetAmount: lead.budgetAmount,
    budgetCurrency: lead.budgetCurrency,
    tripDurationDays: lead.tripDurationDays,
    travelStyle: lead.travelStyle,
    travelerCount: lead.travelerCount,
    estimatedTotal: lead.estimatedTotal,
  });
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getSafeAnalyticsProperties(lead: TripBudgetSnapshot) {
  return {
    page: lead.sourcePage,
    source: "trip_budget_email",
    origin: lead.origin,
    destination: lead.destination ?? lead.destinations[0]?.title ?? null,
    budget: lead.budgetAmount,
    budgetRange: lead.budgetRange ?? null,
    currency: lead.budgetCurrency,
    days: lead.tripDurationDays,
    tripLength: lead.tripDurationDays,
    travelers: lead.travelerCount,
    travelStyle: lead.travelStyle,
  };
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://gobybudget.com";
}

function resolveEmailHref(href: string) {
  if (/^https?:\/\//i.test(href)) {
    return href;
  }

  return `${getSiteUrl()}${href.startsWith("/") ? href : `/${href}`}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function getDevelopmentStore(): { tripBudgetLeads: StoredTripBudgetLead[] } {
  const globalStore = globalThis as typeof globalThis & {
    __travelBudgetTripBudgetLeadStore?: { tripBudgetLeads: StoredTripBudgetLead[] };
  };

  globalStore.__travelBudgetTripBudgetLeadStore ??= { tripBudgetLeads: [] };

  return globalStore.__travelBudgetTripBudgetLeadStore;
}
