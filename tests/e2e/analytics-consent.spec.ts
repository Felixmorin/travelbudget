import { expect, test } from "@playwright/test";

const thirdPartyScriptSelectors = [
  'script[src*="googletagmanager.com/gtag/js"]',
  'script[src*="clarity.ms/tag"]',
  'script[src*="plausible.io/js/script.js"]',
  'script[src*="posthog.com"]',
  'script[src*="posthog.com/static/array.js"]',
  'script[src*="emrldco.com/test.js"]',
  'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
  "script#google-analytics",
  "script#microsoft-clarity",
  "script#posthog",
  "script#travelpayouts-drive",
];

test("configured analytics and marketing scripts wait for explicit consent", async ({ page }) => {
  await page.route(/googletagmanager|clarity|plausible|posthog|emrldco|googlesyndication/, (route) =>
    route.fulfill({ status: 204, body: "" })
  );

  await page.goto("/");

  for (const selector of thirdPartyScriptSelectors) {
    await expect(page.locator(selector)).toHaveCount(0);
  }

  await page.getByRole("button", { name: "Accept analytics" }).click();

  await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1);
  await expect(page.locator("script#google-analytics")).toHaveCount(1);
  await expect(page.locator("script#microsoft-clarity")).toHaveCount(1);
  await expect(page.locator('script[src*="plausible.io/js/script.js"]')).toHaveCount(1);
  await expect(page.locator("script#posthog")).toHaveCount(1);
  await expect(page.locator("script#travelpayouts-drive")).toHaveCount(1);
  await expect(page.locator('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')).toHaveCount(1);
});
