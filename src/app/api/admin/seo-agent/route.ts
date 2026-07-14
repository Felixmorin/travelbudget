import { createSeoAgentReport } from "@/lib/seo-agent/analyzer";
import { getDefaultSeoDateRanges } from "@/lib/seo-agent/date-ranges";
import { fetchAnalyticsLandingPageRows, fetchSearchConsoleRows } from "@/lib/seo-agent/google-clients";
import type { DateRange } from "@/lib/seo-agent/types";
import { getErrorMessage, logServerEvent } from "@/lib/monitoring/server-logger";
import { enforceRateLimit, getRequestGuardResponse, readJsonBody } from "@/lib/security/request-guards";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const maxBodyBytes = 2_048;

export async function POST(request: Request) {
  try {
    const unauthorizedResponse = enforceAdminToken(request);

    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    enforceRateLimit(request, "seo-agent", {
      limit: 6,
      windowMs: 60_000,
    });

    const ranges = await getRequestedRanges(request);
    const [searchRows, previousSearchRows, analyticsRows] = await Promise.all([
      fetchSearchConsoleRows(ranges.current),
      fetchSearchConsoleRows(ranges.previous),
      fetchAnalyticsLandingPageRows(ranges.current),
    ]);

    return Response.json(
      {
        ok: true,
        report: createSeoAgentReport({
          dateRange: ranges.current,
          previousDateRange: ranges.previous,
          searchRows,
          previousSearchRows,
          analyticsRows,
        }),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    const guardResponse = getRequestGuardResponse(error);

    if (guardResponse) {
      return guardResponse;
    }

    await logServerEvent("warn", "SEO agent request failed.", {
      error: getErrorMessage(error),
    }, "system");

    return Response.json(
      {
        ok: false,
        error: getErrorMessage(error),
      },
      {
        status: getErrorMessage(error).includes("required") ? 503 : 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

async function getRequestedRanges(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (!contentLength) {
    return getDefaultSeoDateRanges();
  }

  const body = await readJsonBody(request, maxBodyBytes);
  const current = getDateRange((body as Record<string, unknown>).dateRange);
  const previous = getDateRange((body as Record<string, unknown>).previousDateRange);

  if (current && previous) {
    return { current, previous };
  }

  return getDefaultSeoDateRanges();
}

function enforceAdminToken(request: Request) {
  const configuredToken = process.env.SEO_AGENT_ADMIN_TOKEN?.trim();

  if (!configuredToken) {
    throw new Error("SEO_AGENT_ADMIN_TOKEN is required.");
  }

  const authorization = request.headers.get("authorization");
  const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : null;
  const headerToken = request.headers.get("x-admin-agent-token")?.trim();

  if (bearerToken !== configuredToken && headerToken !== configuredToken) {
    return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  return null;
}

function getDateRange(value: unknown): DateRange | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const startDate = (value as Record<string, unknown>).startDate;
  const endDate = (value as Record<string, unknown>).endDate;

  if (typeof startDate !== "string" || typeof endDate !== "string") {
    return null;
  }

  if (!isDateOnly(startDate) || !isDateOnly(endDate)) {
    return null;
  }

  return { startDate, endDate };
}

function isDateOnly(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
