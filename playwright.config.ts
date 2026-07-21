import { defineConfig, devices } from "@playwright/test";

const port = process.env.PORT ?? "3000";
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- --port ${port}`,
    env: {
      ...process.env,
      NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-TEST123",
      NEXT_PUBLIC_CLARITY_PROJECT_ID: "clarity-test",
      NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "gobybudget.test",
      NEXT_PUBLIC_POSTHOG_KEY: "ph_test",
      NEXT_PUBLIC_TRAVELPAYOUTS_DRIVE_SCRIPT_SRC: "https://emrldco.com/test.js",
      NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID: "ca-pub-0000000000000000",
      SUPABASE_URL: "",
      SUPABASE_SERVICE_ROLE_KEY: "",
      SUPABASE_STORAGE_MODE: "memory",
      TRIP_BUDGET_EMAIL_DELIVERY_MODE: "skip",
      INCIDENT_ALERTING_PROVIDER: "playwright",
      INCIDENT_ALERTING_ESCALATION_TARGET: "test-on-call",
    },
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
