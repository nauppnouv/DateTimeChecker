import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {

  test('should match initial landing page screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // We add a small delay to ensure any CSS transitions are fully completed
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('landing-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('should match successful validation page screenshot', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-test="day-input"]', '25');
    await page.fill('[data-test="month-input"]', '5');
    await page.fill('[data-test="year-input"]', '2026');
    await page.click('[data-test="check-button"]');
    
    // Wait for the success message to appear
    await expect(page.locator('[data-test="result-message"]')).toBeVisible();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('success-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('should match error validation page screenshot', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-test="day-input"]', '29');
    await page.fill('[data-test="month-input"]', '2');
    await page.fill('[data-test="year-input"]', '2025');
    await page.click('[data-test="check-button"]');
    
    // Wait for the error message to appear
    await expect(page.locator('[data-test="result-message"]')).toBeVisible();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('error-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('should match exit confirmation modal screenshot', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-test="close-button"]');
    
    // Wait for the exit modal to fade in
    await expect(page.locator('[data-test="confirm-modal"]')).toBeVisible();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('exit-modal-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

});
