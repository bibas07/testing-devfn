import test, { expect } from "@playwright/test";
const { chromium } = require("playwright");

test.skip("Testing on Vendor Portal", async ({ page }) => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  await page.goto("https://devfn.vercel.app/login");
  await page.getByPlaceholder("Email").click();
  await page.getByPlaceholder("Email").fill("hemantanshu@gmail.com");
  await page.getByPlaceholder("Email").press("Tab");
  await page.getByPlaceholder("Password").fill("123456");
  await page.getByRole("button", { name: "Next →" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^DZ Test$/ })
    .first()
    .click();
  await page
    .locator("div")
    .filter({
      hasText: /^Vendor PortalPlatform for raising invoice for your clients$/,
    })
    .nth(1)
    .click();

  await expect(page).toHaveURL("https://devfn.vercel.app/e/v");
  await page.getByText("VP").click();
  await page.getByRole("paragraph").filter({ hasText: "Logout" }).click();

  // ---------------------
  await context.close();
  await browser.close();
  await page.close;
});
