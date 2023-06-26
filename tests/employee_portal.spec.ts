import test, { expect } from "@playwright/test";
const { chromium } = require("playwright");

test.skip("Testing on Employee Portal", async ({ page }) => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  await page.goto("https://devfn.vercel.app/login");
  await page.getByPlaceholder("Email").click();
  await page.getByPlaceholder("Email").fill("hemantanshu@gmail.com");
  await page.getByPlaceholder("Password").click();
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
      hasText: /^Employee PortalPlatform for expenses and reimbursements$/,
    })
    .nth(1)
    .click();

  await expect(page).toHaveURL("https://devfn.vercel.app/e/e");
  await page.getByText("EP").click();
  await page.getByRole("paragraph").filter({ hasText: "Logout" }).click();

  // ---------------------
  await context.close();
  await browser.close();
  await page.close();
});
