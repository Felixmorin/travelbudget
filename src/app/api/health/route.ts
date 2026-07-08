import { getBackendStorageStatus } from "@/lib/backend/storage";

export const dynamic = "force-dynamic";

export function GET() {
  const backend = getBackendStorageStatus();
  const ready = process.env.NODE_ENV !== "production" || backend.configured;

  return Response.json(
    {
      ok: ready,
      service: "gobybudget",
      timestamp: new Date().toISOString(),
      backend: {
        configured: backend.configured,
        mode: backend.mode,
        requiresServiceRoleKey: backend.requiresServiceRoleKey,
        urlHost: backend.urlHost,
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
