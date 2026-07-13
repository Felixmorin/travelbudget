import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBackendStorageStatus, insertBackendRecord, isBackendStorageConfigured } from "@/lib/backend/storage";

describe("backend storage configuration", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
  });

  it("uses development memory when Supabase is not configured", () => {
    expect(isBackendStorageConfigured()).toBe(false);
    expect(getBackendStorageStatus()).toMatchObject({
      configured: false,
      mode: "Development memory",
      error: null,
      missing: [],
    });
  });

  it("requires a service role key in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", "anon");

    expect(() => isBackendStorageConfigured()).toThrow("Supabase service role key is required in production.");
    expect(getBackendStorageStatus()).toMatchObject({
      configured: false,
      mode: "Misconfigured",
      error: "Supabase service role key is required in production.",
      missing: ["SUPABASE_SERVICE_ROLE_KEY"],
    });
  });

  it("requires a Supabase URL in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role");

    expect(() => isBackendStorageConfigured()).toThrow("Supabase URL is required in production.");
    expect(getBackendStorageStatus()).toMatchObject({
      configured: false,
      mode: "Misconfigured",
      error: "Supabase URL is required in production.",
      missing: ["SUPABASE_URL"],
    });
  });

  it("accepts production Supabase with a service role key", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role");

    expect(isBackendStorageConfigured()).toBe(true);
    expect(getBackendStorageStatus()).toMatchObject({
      configured: true,
      mode: "Supabase",
      error: null,
      missing: [],
      urlHost: "example.supabase.co",
    });
  });

  it("inserts records through configured production Supabase without configuration errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));

    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role");
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      insertBackendRecord("affiliate_clicks", {
        id: "click-1",
        href: "https://aviasales.tpx.lu/example",
      })
    ).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.supabase.co/rest/v1/affiliate_clicks",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          apikey: "service-role",
          Authorization: "Bearer service-role",
        }),
      })
    );
  });
});
