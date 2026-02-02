// tests/search/searchGuide.spec.js
import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";

test("User can search for guides by title", async ({ page, baseURL }) => {
  // 1. Login
  await login(page, baseURL);

  // 2. Open Guides page
  await page.goto("/guides");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(300); // small hydration wait

  // Ensure page loaded (use level=1 to avoid strict-mode conflicts)
  await expect(
    page.getByRole("heading", { level: 1, name: "Guides" })
  ).toBeVisible();

  // Locate search input
  const searchInput = page.getByPlaceholder("Search by title or category");

  // ------------------------------
  // Search by title "Test"
  // ------------------------------
  await searchInput.fill("Test");
  await page.waitForTimeout(400); // Allow React to filter

  // Expected guide appears
  const testGuide = page.getByRole("heading", { level: 3, name: /^Test$/i });
  await expect(testGuide).toBeVisible();

  // Unrelated guide should disappear
  const unrelated = page.getByRole("heading", { level: 3, name: /cut grass/i });
  await expect(unrelated).not.toBeVisible({ timeout: 1000 });

  // ------------------------------
  // Reset search
  // ------------------------------
  await searchInput.fill("");
  await page.waitForTimeout(400);

  // Both guides should reappear
  await expect(testGuide).toBeVisible({ timeout: 3000 });
  await expect(unrelated).toBeVisible({ timeout: 3000 });
});
