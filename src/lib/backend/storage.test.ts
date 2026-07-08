import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBackendStorageStatus, isBackendStorageConfigured } from "@/lib/backend/storage";

describe("backend storage configuration", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_ANON_KEY;
  });

  it("uses development memory when Supabase is not configured", () => {
    expect(isBackendStorageConfigured()).toBe(false);
    expect(getBackendStorageStatus()).toMatchObject({
      configured: false,
      mode: "Development memory",
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
    });
  });

  it("requires a Supabase URL in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role");

    expect(() => isBackendStorageConfigured()).toThrow("Supabase URL is required in production.");
    expect(getBackendStorageStatus()).toMatchObject({
      configured: false,
      mode: "Misconfigured",
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
      urlHost: "example.supabase.co",
    });
  });
});
