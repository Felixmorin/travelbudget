import { assertAgentAdminToken, getAgentAdminAuthResponse } from "@/lib/agents/admin-auth";
import { getMissionControlSnapshot } from "@/lib/agents/mission-control/data";
import { stopAgentRuntime } from "@/lib/agents/store";
import { getErrorMessage, logServerEvent } from "@/lib/monitoring/server-logger";
import { enforceRateLimit, getRequestGuardResponse, readJsonBody } from "@/lib/security/request-guards";

const maxMissionControlBodyBytes = 2_048;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    assertAgentAdminToken(readAuthorizationToken(request));

    return Response.json({
      ok: true,
      snapshot: await getMissionControlSnapshot(),
    });
  } catch (error) {
    const authResponse = getAgentAdminAuthResponse(error);

    if (authResponse) {
      return authResponse;
    }

    await logServerEvent("warn", "Mission Control snapshot request failed.", {
      error: getErrorMessage(error),
    });

    return Response.json({ ok: false, error: "Unable to load Mission Control." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    enforceRateLimit(request, "mission-control", {
      limit: 12,
      windowMs: 60 * 60_000,
    });

    const body = await readJsonBody(request, maxMissionControlBodyBytes);
    assertAgentAdminToken(readAuthorizationToken(request) ?? readBodyToken(body));

    if (readAction(body) !== "stop") {
      return Response.json({ ok: false, error: "Unsupported Mission Control action." }, { status: 400 });
    }

    await stopAgentRuntime({
      requestedBy: readText(body, "requestedBy") ?? "mission-control",
      reason: readText(body, "reason") ?? "Manual global stop from Mission Control.",
    });

    return Response.json({
      ok: true,
      snapshot: await getMissionControlSnapshot(),
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

    await logServerEvent("error", "Mission Control action failed.", {
      error: getErrorMessage(error),
    });

    return Response.json({ ok: false, error: "Unable to update Mission Control." }, { status: 500 });
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

function readAction(body: unknown) {
  return body && typeof body === "object" && typeof (body as Record<string, unknown>).action === "string"
    ? String((body as Record<string, unknown>).action)
    : null;
}

function readText(body: unknown, key: string) {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  const value = (body as Record<string, unknown>)[key];

  return typeof value === "string" && value.trim() ? value.trim().slice(0, 300) : undefined;
}
