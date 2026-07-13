import { getBackendStorageStatus } from "@/lib/backend/storage";
import { getMonitoringStatus } from "@/lib/monitoring/server-logger";

export const dynamic = "force-dynamic";

export function GET() {
  const backend = getBackendStorageStatus();
  const alerting = getMonitoringStatus();
  const ready = process.env.NODE_ENV !== "production" || (backend.configured && alerting.configured);

  return Response.json(
    {
      ok: ready,
      service: "gobybudget",
      timestamp: new Date().toISOString(),
      alerting,
      backend: {
        configured: backend.configured,
        mode: backend.mode,
        requiresServiceRoleKey: backend.requiresServiceRoleKey,
        urlHost: backend.urlHost,
        missing: backend.missing,
        error: backend.error,
      },
    },
    {
      status: ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
