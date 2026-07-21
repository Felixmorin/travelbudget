import { expect, test } from "@playwright/test";

test("realistic primary search flow from homepage to results, detail, compare, email, and affiliate guardrails", async ({ page, request }) => {
  await page.goto("/");

  const declineAnalytics = page.getByRole("button", { name: "Decline analytics" });
  if (await declineAnalytics.isVisible()) {
    await declineAnalytics.click();
  }

  await expect(page.getByRole("heading", { name: /travel/i }).first()).toBeVisible();

  const inputs = page.locator("input");
  await inputs.nth(0).fill("3000");
  await inputs.nth(1).fill("YUL");

  await page.goto("/results?budget=3000&currency=CAD&origin=YUL&days=14&month=october&travelers=2&style=budget");

  await expect(page.getByRole("heading", { name: /best destinations for your budget/i })).toBeVisible();
  await expect(page.getByText(/static planning estimate/i).first()).toBeVisible();
  await expect(page.getByText(/not live quotes/i).first()).toBeVisible();
  await expect(page.getByText(/does not guarantee price/i).first()).toBeVisible();

  const detailLink = page.getByRole("link", { name: /view full budget/i }).first();
  await expect(detailLink).toBeVisible();
  await detailLink.click();
  await expect(page).toHaveURL(/\/travel-budget\/|\/destinations\//);
  await expect(page.getByText(/planning estimate|not a live quote|not a guarantee/i).first()).toBeVisible();

  await page.goBack();
  await page.waitForURL(/\/results\?/);

  const compareToggles = page.getByRole("button", { name: /Add .* to compare/ });
  await compareToggles.nth(0).click();
  await compareToggles.nth(0).click();
  await page.getByRole("link", { name: "Compare selected" }).click();
  await page.waitForURL(/\/compare\?/);
  await expect(page.getByRole("heading", { name: /compare/i }).first()).toBeVisible();

  await page.goBack();
  await page.waitForURL(/\/results\?/);

  await page.getByRole("button", { name: /send me this trip budget/i }).first().click();
  const dialog = page.getByRole("dialog", { name: /send me this trip budget/i });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel(/email address/i).fill("traveler@example.com");
  await dialog.getByLabel(/receive this trip budget/i).check();
  await page.waitForTimeout(1300);
  await dialog.getByRole("button", { name: /send me this trip budget/i }).click();
  await expect(dialog.getByText(/check your inbox/i)).toBeVisible();

  const allowedTarget = Buffer.from("https://www.skyscanner.ca/transport/flights/", "utf8").toString("base64url");
  const allowedResponse = await request.get(`/go/general/flights?url=${allowedTarget}`, { maxRedirects: 0 });
  expect([307, 308]).toContain(allowedResponse.status());
  expect(allowedResponse.headers().location).toContain("skyscanner.ca");

  const blockedTarget = Buffer.from("https://evil.example/phish", "utf8").toString("base64url");
  const blockedResponse = await request.get(`/go/general/flights?url=${blockedTarget}`);
  expect(blockedResponse.status()).toBe(400);
  await expect(blockedResponse.json()).resolves.toMatchObject({ ok: false });
});

test("mobile homepage and results have a usable minimal layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /travel/i }).first()).toBeVisible();
  await expect(page.locator("form").first()).toBeVisible();

  await page.goto("/results?budget=2500&currency=CAD&origin=YUL&days=10&travelers=1&style=balanced");
  await expect(page.getByRole("heading", { name: /best destinations for your budget/i })).toBeVisible();
  await expect(page.getByText(/static planning estimate/i).first()).toBeVisible();
  await page.getByRole("button", { name: /send me this trip budget/i }).first().click();
  await expect(page.getByRole("dialog", { name: /send me this trip budget/i })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: /send me this trip budget/i })).toBeHidden();
});
