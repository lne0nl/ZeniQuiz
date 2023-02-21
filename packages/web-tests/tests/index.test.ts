import { test, expect } from "@playwright/test";

const baseURL = "http://localhost:4173";

let quizID = "";

test("Create and delete quiz", async ({ context, page }) => {
  await page.goto(`${baseURL}/#/admin`);
  await page.goto(`${baseURL}/#/admin`);
  const input = page.locator("input.quiz-name-input");
  await expect(input).toBeVisible();
  await input.fill("Quiz Test");
  await page.keyboard.press("Enter");
  await expect(input).not.toBeVisible();
  quizID = page.url().substring(page.url().lastIndexOf("/") + 1);
  expect(quizID).not.toBeNull();

  const adminPage = await context.newPage();
  await adminPage.goto(`${baseURL}/#/admin/${quizID}`);
  const deleteButton = adminPage.locator("#delete");
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
  await expect(deleteButton).not.toBeVisible();
});
