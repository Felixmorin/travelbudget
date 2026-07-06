import { getDestination } from "@/lib/data/destinations";
import { isValidEmail } from "@/lib/leads/lead-capture";
import { insertBackendRecord, isBackendStorageConfigured, selectBackendRecords } from "@/lib/backend/storage";

export type SavedTripPayload = {
  email: string;
  destinationSlug: string;
  source?: string;
  pathname?: string;
};

export type StoredSavedTrip = SavedTripPayload & {
  id: string;
  createdAt: string;
};

export class SavedTripError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "SavedTripError";
    this.status = status;
  }
}

export function normalizeSavedTripPayload(input: unknown): SavedTripPayload {
  if (!input || typeof input !== "object") {
    throw new SavedTripError("Invalid saved trip payload.", 400);
  }

  const payload = input as Record<string, unknown>;
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const destinationSlug = typeof payload.destinationSlug === "string" ? payload.destinationSlug.trim() : "";

  if (!isValidEmail(email)) {
    throw new SavedTripError("Enter a valid email address.", 400);
  }

  if (!destinationSlug || !getDestination(destinationSlug)) {
    throw new SavedTripError("Choose a valid destination.", 400);
  }

  return {
    email,
    destinationSlug,
    source: normalizeOptionalString(payload.source),
    pathname: normalizeOptionalString(payload.pathname),
  };
}

export async function saveTrip(payload: SavedTripPayload): Promise<StoredSavedTrip> {
  const savedTrip = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if (isBackendStorageConfigured()) {
    await insertBackendRecord("saved_trips", {
      id: savedTrip.id,
      email: savedTrip.email,
      destination_slug: savedTrip.destinationSlug,
      source: savedTrip.source,
      pathname: savedTrip.pathname,
      created_at: savedTrip.createdAt,
    });
  } else {
    if (process.env.NODE_ENV === "production") {
      throw new SavedTripError("Saved trips storage is not configured.", 503);
    }

    const store = getDevelopmentStore();
    const existing = store.savedTrips.find(
      (trip) => trip.email === savedTrip.email && trip.destinationSlug === savedTrip.destinationSlug
    );

    if (existing) {
      return existing;
    }

    store.savedTrips.push(savedTrip);
  }

  return savedTrip;
}

export async function isTripSaved(email: string, destinationSlug: string) {
  if (!isValidEmail(email) || !destinationSlug) {
    return false;
  }

  if (isBackendStorageConfigured()) {
    const savedTrips = await selectBackendRecords("saved_trips", {
      email: `eq.${email.trim().toLowerCase()}`,
      destination_slug: `eq.${destinationSlug}`,
      limit: "1",
    });

    return savedTrips.length > 0;
  }

  return getDevelopmentStore().savedTrips.some(
    (trip) => trip.email === email.trim().toLowerCase() && trip.destinationSlug === destinationSlug
  );
}

export function listStoredSavedTrips() {
  return [...getDevelopmentStore().savedTrips];
}

export function clearStoredSavedTrips() {
  getDevelopmentStore().savedTrips.length = 0;
}

function normalizeOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getDevelopmentStore(): { savedTrips: StoredSavedTrip[] } {
  const globalStore = globalThis as typeof globalThis & {
    __travelBudgetSavedTripsStore?: { savedTrips: StoredSavedTrip[] };
  };

  globalStore.__travelBudgetSavedTripsStore ??= { savedTrips: [] };

  return globalStore.__travelBudgetSavedTripsStore;
}
