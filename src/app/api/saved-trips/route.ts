import { normalizeSavedTripPayload, saveTrip, SavedTripError, isTripSaved } from "@/lib/saved-trips/saved-trips";
import { getErrorMessage, logServerEvent } from "@/lib/monitoring/server-logger";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") ?? "";
  const destinationSlug = url.searchParams.get("destinationSlug") ?? "";

  try {
    return Response.json({
      ok: true,
      saved: await isTripSaved(email, destinationSlug),
    });
  } catch {
    return Response.json({ ok: true, saved: false });
  }
}

export async function POST(request: Request) {
  try {
    const payload = normalizeSavedTripPayload(await parseJsonBody(request));
    const savedTrip = await saveTrip(payload);
    await logServerEvent("info", "Saved trip persisted.", {
      destinationSlug: payload.destinationSlug,
      email: payload.email,
      source: payload.source,
    });

    return Response.json({
      ok: true,
      saved: true,
      savedTripId: savedTrip.id,
      timestamp: savedTrip.createdAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save this trip.";
    const status = error instanceof SavedTripError ? error.status : 500;
    await logServerEvent(status >= 500 ? "error" : "warn", "Saved trip request failed.", {
      error: getErrorMessage(error),
      status,
    });

    return Response.json(
      {
        ok: false,
        error: message,
      },
      { status }
    );
  }
}

async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new SavedTripError("Invalid saved trip payload.", 400);
  }
}
