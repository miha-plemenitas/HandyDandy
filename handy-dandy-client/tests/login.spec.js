import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

test("Login works using test-login endpoint", async ({ page, baseURL }) => {
  await login(page, baseURL);

  await page.goto("/");

  // Target ONLY navbar link
  await expect(page.getByRole("link", { name: "Profile" })).toBeVisible();
});
