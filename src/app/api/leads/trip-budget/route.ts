import { z } from "zod";

import { saveAnalyticsEvent } from "@/lib/analytics/server-events";
import { saveTripBudgetLead } from "@/lib/leads/trip-budget-leads";
import { handleGuardedJsonPost } from "@/lib/security/request-guards";

const maxBodyBytes = 32_768;
const maxRequestsPerHour = 8;
const minSubmissionAgeMs = 1200;
const perEmailBuckets = new Map<string, { count: number; resetAt: number }>();

const destinationSchema = z.object({
  slug: z.string().trim().max(120).optional(),
  title: z.string().trim().min(1).max(180),
  country: z.string().trim().max(120).optional(),
  estimatedTotal: z.coerce.number().finite().nonnegative(),
  flightEstimate: z.coerce.number().finite().nonnegative(),
  hotelEstimate: z.coerce.number().finite().nonnegative(),
  foodEstimate: z.coerce.number().finite().nonnegative(),
  transportEstimate: z.coerce.number().finite().nonnegative(),
  activitiesEstimate: z.coerce.number().finite().nonnegative(),
  bufferEstimate: z.coerce.number().finite().nonnegative(),
  affiliateLinks: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(80),
        href: z
          .string()
          .trim()
          .max(500)
          .refine((value) => value.startsWith("/") || /^https?:\/\//i.test(value), "Invalid affiliate link."),
        type: z.string().trim().max(80).optional(),
      })
    )
    .max(8)
    .optional(),
});

const requestSchema = z.object({
  email: z.email().trim().toLowerCase().max(254),
  budgetEmailConsent: z.literal(true),
  marketingConsent: z.boolean().default(false),
  consentTimestamp: z.string().datetime(),
  submittedAt: z.coerce.number().int().positive(),
  website: z.string().max(0).optional().default(""),
  lead: z.object({
    origin: z.string().trim().min(1).max(160),
    destination: z.string().trim().max(500).nullable().optional(),
    budgetAmount: z.coerce.number().finite().positive(),
    budgetCurrency: z.string().trim().min(3).max(3),
    tripDurationDays: z.coerce.number().int().min(1).max(60),
    travelStyle: z.string().trim().min(1).max(80),
    travelerCount: z.coerce.number().int().min(1).max(12),
    estimatedTotal: z.coerce.number().finite().nonnegative(),
    flightEstimate: z.coerce.number().finite().nonnegative(),
    hotelEstimate: z.coerce.number().finite().nonnegative(),
    foodEstimate: z.coerce.number().finite().nonnegative(),
    transportEstimate: z.coerce.number().finite().nonnegative(),
    activitiesEstimate: z.coerce.number().finite().nonnegative(),
    bufferEstimate: z.coerce.number().finite().nonnegative(),
    sourcePage: z.string().trim().min(1).max(200),
    destinations: z.array(destinationSchema).min(1).max(10),
    budgetRange: z.string().trim().max(80).optional(),
    month: z.string().trim().max(40).optional(),
    resultUrl: z.string().url().max(500).optional(),
  }),
  utmSource: z.string().trim().max(160).optional(),
  utmMedium: z.string().trim().max(160).optional(),
  utmCampaign: z.string().trim().max(160).optional(),
  utmContent: z.string().trim().max(160).optional(),
});

export async function POST(request: Request) {
  return handleGuardedJsonPost({
    request,
    scope: "trip-budget-leads",
    maxBodyBytes,
    rateLimit: {
      limit: maxRequestsPerHour,
      windowMs: 60 * 60_000,
    },
    failureLogMessage: "Trip budget lead request failed.",
    failureEventType: "email_lead_error",
    failureResponseError: "Unable to send trip budget.",
    handler: async (body) => {
      const parsed = requestSchema.safeParse(body);

      if (!parsed.success) {
        return Response.json({ ok: false, error: "Please check the email and consent fields." }, { status: 400 });
      }

      if (Date.now() - parsed.data.submittedAt < minSubmissionAgeMs) {
        return Response.json({ ok: false, error: "Please wait a moment before submitting." }, { status: 400 });
      }

      if (isEmailRateLimited(parsed.data.email)) {
        return Response.json({ ok: false, error: "This email has made too many recent requests." }, { status: 429 });
      }

      await saveAnalyticsEvent({
        eventName: "trip_budget_email_form_submitted",
        properties: getSafeAnalyticsProperties(parsed.data.lead),
        referrer: request.headers.get("referer") ?? undefined,
        userAgent: request.headers.get("user-agent") ?? undefined,
      });

      const result = await saveTripBudgetLead({
        email: parsed.data.email,
        budgetEmailConsent: parsed.data.budgetEmailConsent,
        marketingConsent: parsed.data.marketingConsent,
        consentTimestamp: parsed.data.consentTimestamp,
        lead: parsed.data.lead,
        referrer: request.headers.get("referer") ?? undefined,
        userAgent: request.headers.get("user-agent") ?? undefined,
        utmSource: parsed.data.utmSource,
        utmMedium: parsed.data.utmMedium,
        utmCampaign: parsed.data.utmCampaign,
        utmContent: parsed.data.utmContent,
      });

      const status = result.lead.emailStatus;

      if (status === "failed") {
        return Response.json(
          {
            ok: false,
            emailStatus: status,
            error: "We saved your request, but email delivery failed. Please try again later.",
          },
          { status: 502 }
        );
      }

      return Response.json({ ok: true, duplicate: result.duplicate, emailStatus: status });
    },
  });
}

export function resetTripBudgetLeadRouteState() {
  perEmailBuckets.clear();
}

function isEmailRateLimited(email: string) {
  const now = Date.now();
  const currentBucket = perEmailBuckets.get(email);
  const bucket =
    currentBucket && currentBucket.resetAt > now
      ? currentBucket
      : {
          count: 0,
          resetAt: now + 60 * 60_000,
        };

  bucket.count += 1;
  perEmailBuckets.set(email, bucket);

  return bucket.count > 3;
}

function getSafeAnalyticsProperties(lead: z.infer<typeof requestSchema>["lead"]) {
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
