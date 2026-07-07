export type BackendTable = "affiliate_clicks" | "analytics_events";

export type BackendRecord = Record<string, string | number | boolean | null | undefined>;

type SupabaseConfig = {
  url: string;
  key: string;
};

const providerTimeoutMs = 5000;

export class BackendStorageError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "BackendStorageError";
    this.status = status;
  }
}

export function isBackendStorageConfigured() {
  return Boolean(getSupabaseConfig());
}

export function getBackendStorageStatus() {
  try {
    const config = getSupabaseConfig();

    return {
      configured: Boolean(config),
      mode: config ? "Supabase" : "Development memory",
      requiresServiceRoleKey: process.env.NODE_ENV === "production" && !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
      urlHost: config ? new URL(config.url).hostname : null,
    };
  } catch (error) {
    return {
      configured: false,
      mode: "Misconfigured",
      requiresServiceRoleKey: true,
      urlHost: null,
      error: error instanceof Error ? error.message : "Supabase storage is misconfigured.",
    };
  }
}

export async function insertBackendRecord<TRecord extends BackendRecord>(table: BackendTable, record: TRecord) {
  const config = getSupabaseConfig();

  if (!config) {
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), providerTimeoutMs);

  try {
    const response = await fetch(`${config.url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(record),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new BackendStorageError(`Supabase rejected ${table} insert.`, 502);
    }
  } catch (error) {
    if (error instanceof BackendStorageError) {
      throw error;
    }

    throw new BackendStorageError("Supabase storage is unavailable.", 502);
  } finally {
    clearTimeout(timeout);
  }
}

export async function selectBackendRecords<TRecord extends BackendRecord>(
  table: BackendTable,
  searchParams: Record<string, string> = {}
) {
  const config = getSupabaseConfig();

  if (!config) {
    return [];
  }

  const url = new URL(`${config.url}/rest/v1/${table}`);
  url.searchParams.set("select", "*");
  url.searchParams.set("order", "created_at.desc");
  url.searchParams.set("limit", "500");

  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), providerTimeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new BackendStorageError(`Supabase rejected ${table} select.`, 502);
    }

    return (await response.json()) as TRecord[];
  } catch (error) {
    if (error instanceof BackendStorageError) {
      throw error;
    }

    throw new BackendStorageError("Supabase storage is unavailable.", 502);
  } finally {
    clearTimeout(timeout);
  }
}

function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? process.env.SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    if (process.env.NODE_ENV === "production" && url && !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
      throw new BackendStorageError("Supabase service role key is required in production.", 500);
    }

    return null;
  }

  if (process.env.NODE_ENV === "production" && !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    throw new BackendStorageError("Supabase service role key is required in production.", 500);
  }

  try {
    return {
      url: new URL(url).origin,
      key,
    };
  } catch {
    throw new BackendStorageError("Supabase URL is misconfigured.", 500);
  }
}
