import { test, expect } from "@playwright/test";

const baseURL = "http://localhost:4173";

let quizID = "";

test("Admin page has input and button to create quiz", async ({ page }) => {
  await page.goto(`${baseURL}/#/admin`);
  await page.goto(`${baseURL}/#/admin`);
  const input = page.locator("input.quiz-name-input");
  await expect(input).toBeVisible();
});

test("Quiz creation", async ({ page }) => {
  await page.goto(`${baseURL}/#/admin`);
  const input = page.locator("input.quiz-name-input");
  await input.fill("Quiz Test");
  await page.keyboard.press("Enter");
  await expect(input).not.toBeVisible();
  quizID = page.url().substring(page.url().lastIndexOf("/") + 1);
  expect(quizID).not.toBeNull();
});

test("Quiz suppresion", async ({ page }) => {
  await page.goto(`${baseURL}/#/admin/${quizID}`);
  const deleteButton = page.locator("#delete");

  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
  await expect(deleteButton).not.toBeVisible();
});
