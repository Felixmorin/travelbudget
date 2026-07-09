import { expect, test } from "@playwright/test";

test("results compare CTA uses the visitor's selected destinations", async ({ page }) => {
  await page.goto("/results?budget=3000&currency=CAD&origin=YUL&days=10&travelers=1&style=balanced");

  const declineAnalytics = page.getByRole("button", { name: "Decline analytics" });
  if (await declineAnalytics.isVisible()) {
    await declineAnalytics.click();
  }

  await expect(page.getByRole("link", { name: "Compare selected" })).toHaveCount(0);

  const compareToggles = page.getByRole("button", { name: /Add .* to compare/ });
  await expect(compareToggles.first()).toBeVisible();
  expect(await compareToggles.count()).toBeGreaterThan(1);

  await compareToggles.nth(0).click();
  await expect(page.getByRole("button", { name: "Compare selected" })).toBeDisabled();

  await compareToggles.nth(1).click();

  const compareLink = page.getByRole("link", { name: "Compare selected" });
  await expect(compareLink).toBeVisible();

  const href = await compareLink.getAttribute("href");
  expect(href).not.toBeNull();

  const compareUrl = new URL(href ?? "", "http://127.0.0.1:3000");
  expect(compareUrl.pathname).toBe("/compare");
  expect(compareUrl.searchParams.getAll("destination")).toHaveLength(2);

  await compareLink.click();
  await page.waitForURL("**/compare?**");

  const navigatedUrl = new URL(page.url());
  expect(navigatedUrl.pathname).toBe("/compare");
  expect(navigatedUrl.searchParams.getAll("destination")).toHaveLength(2);
});
