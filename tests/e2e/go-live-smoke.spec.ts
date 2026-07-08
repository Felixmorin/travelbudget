import { expect, test } from "@playwright/test";

test("homepage and results flow render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /travel/i }).first()).toBeVisible();

  await page.goto("/results?budget=2500&currency=CAD&origin=YUL&days=10&travelers=1&style=balanced");
  await expect(page).toHaveURL(/\/results/);
  await expect(page.getByRole("main")).toContainText(/destination|results|budget/i);
});

test("destination detail page renders", async ({ page }) => {
  await page.goto("/destinations/japan");
  await expect(page.getByRole("heading", { name: /japan/i }).first()).toBeVisible();
  await expect(page.getByRole("main")).toContainText(/estimate|budget|cost/i);
});

test("health endpoint reports readiness shape", async ({ request }) => {
  const response = await request.get("/api/health");

  expect([200, 503]).toContain(response.status());
  await expect(response.json()).resolves.toMatchObject({
    service: "gobybudget",
  });
});

test("blocked affiliate redirects do not leave the site", async ({ request }) => {
  const target = Buffer.from("https://evil.example/phish", "utf8").toString("base64url");
  const response = await request.get(`/go/general/flights?url=${target}`);

  expect(response.status()).toBe(400);
  await expect(response.json()).resolves.toMatchObject({
    ok: false,
  });
});
