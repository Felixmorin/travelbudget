import { getErrorMessage, logServerEvent } from "@/lib/monitoring/server-logger";
import { runSeoAgent } from "@/lib/seo-agent/run-agent";
import { createWorkerRunReport } from "@/lib/seo-agent/workers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const unauthorizedResponse = enforceCronSecret(request);

    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const seoReport = await runSeoAgent();
    const workerRun = createWorkerRunReport(seoReport, "scheduled");

    await logServerEvent("info", "Scheduled SEO workers completed.", {
      tasks: workerRun.summary.tasks,
      highPriority: workerRun.summary.highPriority,
      workers: workerRun.summary.workers,
    }, "system");

    return Response.json(
      {
        ok: true,
        workerRun,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    await logServerEvent("warn", "Scheduled SEO workers failed.", {
      error: getErrorMessage(error),
    }, "system");

    return Response.json(
      {
        ok: false,
        error: getErrorMessage(error),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

function enforceCronSecret(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    throw new Error("CRON_SECRET is required.");
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  return null;
}
