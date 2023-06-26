import { test, expect } from "@playwright/test";
const { chromium } = require("playwright");

test.describe("Recko Login flow", () => {
  let context;
  let browser;
  let page;
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: false,
    });
    context = await browser.newContext();
    page = await context.newPage();
  });

  test("Login Validation Error", async () => {
    try {
      await page.goto("https://devfn.vercel.app/login");
      await page.getByPlaceholder("Email").fill("hemantanshu@gmail.com");
      await page.getByPlaceholder("Password").fill("1234567");
      await page.getByRole("button", { name: "Next →" }).click();
      await page.waitForSelector("span.py-1.label.label-text-alt.text-error");
      const receivedMessage = await page.textContent(
        "span.py-1.label.label-text-alt.text-error"
      );
      expect(receivedMessage).toBe("Invalid username or password..");
    } catch (errors) {
      console.log("Error on Recko Portal " + errors);
    } finally {
      await page.close();
    }
  });

  test("For Recko Login Success", async () => {
    await page.goto("https://devfn.vercel.app/login");
    await page.getByPlaceholder("Email").fill("hemantanshu@gmail.com");
    await page.getByPlaceholder("Password").fill("123456");
    await page.getByRole("button", { name: "Next →" }).click();

    await page.waitForSelector('div[role="dialog"][aria-modal="true"]');
    const dialogText = await page.textContent(
      'div[role="dialog"][aria-modal="true"] p.text-xl.font-medium.text-color-primary'
    );
    await expect(dialogText).toBe("Select Organization");

    await page
      .locator("div")
      .filter({ hasText: /^DZ Test$/ })
      .first()
      .click();

    await page.waitForSelector('div[role="dialog"][aria-modal="true"]');
    const dialogTitle = await page.textContent(
      'div[role="dialog"][aria-modal="true"] h2'
    );
    await expect(dialogTitle).toBe("Select Portal");
    await page
      .locator("div")
      .filter({
        hasText: /^Recko PortalPlatform for payment transaction matching$/,
      })
      .nth(1)
      .click();
    await expect(page).toHaveURL("https://devfn.vercel.app/r");

    await page.waitForSelector("div[class='gap-4 row-flex']");
    const orgTitle = await page.textContent(
      'div[class="w-full text-sm font-semibold whitespace-nowrap"]'
    );
    await expect(orgTitle).toBe("DZ Test…");

    await page.locator("div").filter({ hasText: /^RP$/ }).nth(1).click();
    await page
      .getByRole("navigation")
      .locator("div")
      .filter({ hasText: /^Logout$/ })
      .click();
    await expect(page).toHaveURL("https://devfn.vercel.app/login");
  });

  test.afterAll(async () => {
    await context.close();
    await browser.close();
    await page.close();
  });
});
