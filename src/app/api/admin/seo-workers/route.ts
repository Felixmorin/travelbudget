import { getErrorMessage, logServerEvent } from "@/lib/monitoring/server-logger";
import { getDefaultSeoDateRanges } from "@/lib/seo-agent/date-ranges";
import { parseSeoDateRange, runSeoAgent } from "@/lib/seo-agent/run-agent";
import { createWorkerRunReport } from "@/lib/seo-agent/workers";
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

    enforceRateLimit(request, "seo-workers", {
      limit: 6,
      windowMs: 60_000,
    });

    const seoReport = await runSeoAgent(await getRequestedRanges(request));

    return Response.json(
      {
        ok: true,
        workerRun: createWorkerRunReport(seoReport, "manual"),
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

    await logServerEvent("warn", "SEO workers request failed.", {
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
  const current = parseSeoDateRange((body as Record<string, unknown>).dateRange);
  const previous = parseSeoDateRange((body as Record<string, unknown>).previousDateRange);

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
