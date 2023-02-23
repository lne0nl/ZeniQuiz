import { test, expect } from "@playwright/test";

const baseURL = "http://localhost:4173";

test("Create,start and delete quiz", async ({ context, page }) => {
  console.log("Create a quiz.");
  await page.goto(`${baseURL}/#/admin`);
  const input = page.getByPlaceholder("Name your quiz");
  await expect(input).toBeVisible();
  await input.fill("Quiz Test");
  await page.keyboard.press("Enter");
  await expect(input).not.toBeVisible();
  const quizID = page.url().substring(page.url().lastIndexOf("/") + 1);
  expect(quizID).not.toBeNull();

  console.log("Check for all buttons when quiz has been created.");
  await expect(page.getByText("Quiz Test screen")).toBeVisible();
  await expect(page.getByText(`${baseURL}/#/display/${quizID}`)).toBeVisible();
  const startButton = page.getByText("Start quiz");
  await expect(startButton).toBeVisible();
  const deleteButton = page.getByText("Delete quiz");
  await expect(deleteButton).toBeVisible();

  console.log("Open quiz in display screen");
  const displayPage = await context.newPage();
  await displayPage.goto(`${baseURL}/#/display/${quizID}`);
  await expect(displayPage.getByText("Quiz Test")).toBeVisible();
  await expect(displayPage.getByRole("img")).toBeVisible();
  await expect(displayPage.getByText(`${baseURL}/#/${quizID}`)).toBeVisible();

  console.log("Open quiz in user view and create a team.");
  const userPage = await context.newPage();
  await userPage.goto(`${baseURL}/#/${quizID}`);
  await userPage.getByPlaceholder("Chose a name").fill("Bruce Wayne");
  await userPage.keyboard.press("Enter");
  await expect(userPage.getByRole("button")).toBeVisible();

  console.log("Check if user appears in display view.")
  await expect(displayPage.getByText("Bruce Wayne")).toBeVisible();

  console.log("Start quiz.");
  await startButton.click();
  const buzzersOnButton = page.getByText("Buzzers ON");
  const buzzersOffButton = page.getByText("Buzzers OFF");
  const displayQRButton = page.getByText("Display QR code");
  const displayTeamsButton = page.getByText("Display teams");
  const razScoresButton = page.getByText("Raz scores");
  await expect(buzzersOnButton).toBeVisible();
  await expect(buzzersOffButton).toBeVisible();
  await expect(displayQRButton).toBeVisible();
  await expect(displayTeamsButton).toBeVisible();
  await expect(razScoresButton).toBeVisible();

  console.log("Buz.");
  await expect(userPage.getByRole("button")).toBeVisible();
  await userPage.getByRole("button").click();

  console.log("Check if user buzz has appeared in admin screen.");
  await expect(page.getByText("Bruce Wayne")).toBeVisible();
  const winButton = page.getByText(" ✔ ");
  await expect(winButton).toBeVisible();
  await winButton.click();

  console.log("Check if point has been given to team in display view.");
  await expect(displayPage.getByText("1")).toBeVisible();

  console.log("Check if point has been given to team in admin view.");
  await displayTeamsButton.click();
  await expect(page.getByText("1")).toBeVisible();
  await page.getByText("X").click();

  console.log("Check if user leave display screen when window is closed.");
  userPage.close();
  await expect(displayPage.getByText("Bruce Wayne")).not.toBeVisible();

  console.log("Delete quiz.");
  await deleteButton.click();
  await expect(deleteButton).not.toBeVisible();
});
