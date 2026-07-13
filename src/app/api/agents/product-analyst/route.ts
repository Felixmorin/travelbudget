import { getAgentAdminAuthResponse, assertAgentAdminToken } from "@/lib/agents/admin-auth";
import { listProductAnalystHistory, runProductAnalystAnalysis } from "@/lib/agents/product-analyst/runner";
import type { ProductAnalystSource } from "@/lib/agents/product-analyst/types";
import { AgentRuntimeConfigError } from "@/lib/agents/config";
import { AgentLimitError } from "@/lib/agents/limits";
import { getErrorMessage, logServerEvent } from "@/lib/monitoring/server-logger";
import { enforceRateLimit, getRequestGuardResponse, readJsonBody } from "@/lib/security/request-guards";

const maxAgentBodyBytes = 2_048;
const maxAgentRunsPerHour = 12;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    assertAgentAdminToken(readAuthorizationToken(request));

    return Response.json({
      ok: true,
      history: await listProductAnalystHistory(),
    });
  } catch (error) {
    const authResponse = getAgentAdminAuthResponse(error);

    if (authResponse) {
      return authResponse;
    }

    await logServerEvent("warn", "Product Analyst history request failed.", {
      error: getErrorMessage(error),
    });

    return Response.json({ ok: false, error: "Unable to load Product Analyst history." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    enforceRateLimit(request, "product-analyst-agent", {
      limit: maxAgentRunsPerHour,
      windowMs: 60 * 60_000,
    });

    const body = await readJsonBody(request, maxAgentBodyBytes);
    assertAgentAdminToken(readAuthorizationToken(request) ?? readBodyToken(body));

    const result = await runProductAnalystAnalysis({
      source: readSource(body),
      requestedBy: readText(body, "requestedBy"),
      costLimitCents: readNumber(body, "costLimitCents"),
    });

    return Response.json({
      ok: true,
      report: result.report,
      execution: {
        id: result.execution.id,
        status: result.execution.status,
        costCents: result.execution.estimatedCostCents,
      },
      history: await listProductAnalystHistory(),
    });
  } catch (error) {
    const guardResponse = getRequestGuardResponse(error);
    const authResponse = getAgentAdminAuthResponse(error);

    if (guardResponse) {
      return guardResponse;
    }

    if (authResponse) {
      return authResponse;
    }

    if (error instanceof AgentRuntimeConfigError || error instanceof AgentLimitError) {
      return Response.json({ ok: false, error: error.message }, { status: 400 });
    }

    await logServerEvent("error", "Product Analyst run failed.", {
      error: getErrorMessage(error),
    });

    return Response.json({ ok: false, error: "Unable to run Product Analyst analysis." }, { status: 500 });
  }
}

function readAuthorizationToken(request: Request) {
  const authorization = request.headers.get("authorization");

  return authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : null;
}

function readBodyToken(body: unknown) {
  return body && typeof body === "object" && typeof (body as Record<string, unknown>).adminToken === "string"
    ? String((body as Record<string, unknown>).adminToken)
    : null;
}

function readSource(body: unknown): ProductAnalystSource {
  if (!body || typeof body !== "object") {
    return "stored";
  }

  return (body as Record<string, unknown>).source === "demo" ? "demo" : "stored";
}

function readText(body: unknown, key: string) {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  const value = (body as Record<string, unknown>)[key];

  return typeof value === "string" && value.trim() ? value.trim().slice(0, 200) : undefined;
}

function readNumber(body: unknown, key: string) {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  const value = (body as Record<string, unknown>)[key];

  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
