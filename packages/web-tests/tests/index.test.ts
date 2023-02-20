import { test, expect } from "@playwright/test";

const baseURL = "http://localhost:4173";

test.beforeEach((async ({ page }) => {
  await page.goto(`${baseURL}/#/admin`);
}))

test("Admin page has input and button to create quiz", async ({ page }) => {
  await page.goto(`${baseURL}/#/admin`);
  const input = page.locator("input.quiz-name-input");
  await expect(input).toBeVisible();
});

test("Quiz creation", async ({ page }) => {
  const input = page.locator("input.quiz-name-input");
  await input.fill("Quiz Test");
  await page.keyboard.press("Enter");
  await expect(input).not.toBeVisible();
})
