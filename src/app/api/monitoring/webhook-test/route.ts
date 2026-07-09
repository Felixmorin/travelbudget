import { getMonitoringStatus, sendMonitoringWebhook } from "@/lib/monitoring/server-logger";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const status = getMonitoringStatus();
  const expectedAuthorization = process.env.MONITORING_WEBHOOK_SECRET?.trim();

  if (!status.webhook.configured || !expectedAuthorization) {
    return Response.json(
      {
        ok: false,
        error: "Monitoring webhook is not configured with both MONITORING_WEBHOOK_URL and MONITORING_WEBHOOK_SECRET.",
        alerting: status,
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${expectedAuthorization}`) {
    return Response.json(
      {
        ok: false,
        error: "Unauthorized.",
      },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const delivery = await sendMonitoringWebhook({
    level: "warn",
    message: "Monitoring webhook verification event.",
    context: {
      source: "/api/monitoring/webhook-test",
    },
    timestamp: new Date().toISOString(),
  });

  return Response.json(
    {
      ok: delivery.delivered,
      delivery,
      alerting: status,
    },
    {
      status: delivery.delivered ? 200 : 502,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
