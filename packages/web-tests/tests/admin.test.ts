import { test, expect } from "@playwright/test";

const baseURL = "http://localhost:4173";

test.describe("Quiz Admin", () => {
  test("Create and delete quiz", async ({ context, page }) => {
    // Create a quiz.
    await page.goto(`${baseURL}/#/admin`);
    const input = page.getByPlaceholder("Name your quiz");
    await expect(input).toBeVisible();
    await input.fill("Quiz Test");
    await page.keyboard.press("Enter");
    await expect(input).not.toBeVisible();
    const quizID = page.url().substring(page.url().lastIndexOf("/") + 1);
    expect(quizID).not.toBeNull();

    // Check for all buttons when quiz has been created.
    await expect(page.getByText("Quiz Test screen")).toBeVisible();
    await expect(
      page.getByText(`${baseURL}/#/display/${quizID}`)
    ).toBeVisible();
    await expect(page.getByText("Start quiz")).toBeVisible();
    await expect(page.getByText("Delete quiz")).toBeVisible();

    // await page.locator("a").click();

    // Delete a quiz.
    const adminPage = await context.newPage();
    await adminPage.goto(`${baseURL}/#/admin/${quizID}`);
    const deleteButton = page.getByText("Delete quiz");
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    await expect(deleteButton).not.toBeVisible();
  });
});
