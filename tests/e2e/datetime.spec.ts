import { test, expect } from '@playwright/test';

test.describe('Date Time Checker App Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display UI elements correctly', async ({ page }) => {
    // Check title
    await expect(page.locator('h1')).toHaveText('Date Time Checker');
    // Check labels & inputs
    await expect(page.locator('label[for="day"]')).toHaveText('Day');
    await expect(page.locator('label[for="month"]')).toHaveText('Month');
    await expect(page.locator('label[for="year"]')).toHaveText('Year');
    
    await expect(page.locator('[data-test="day-input"]')).toBeVisible();
    await expect(page.locator('[data-test="month-input"]')).toBeVisible();
    await expect(page.locator('[data-test="year-input"]')).toBeVisible();
    
    await expect(page.locator('[data-test="clear-button"]')).toBeVisible();
    await expect(page.locator('[data-test="check-button"]')).toBeVisible();
  });

  test('should clear inputs when Clear is clicked', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '25');
    await page.fill('[data-test="month-input"]', '05');
    await page.fill('[data-test="year-input"]', '2026');
    
    // Check click clears input and result message
    await page.click('[data-test="check-button"]');
    await expect(page.locator('[data-test="result-message"]')).toBeVisible();

    await page.click('[data-test="clear-button"]');
    
    await expect(page.locator('[data-test="day-input"]')).toHaveValue('');
    await expect(page.locator('[data-test="month-input"]')).toHaveValue('');
    await expect(page.locator('[data-test="year-input"]')).toHaveValue('');
    await expect(page.locator('[data-test="result-message"]')).not.toBeVisible();
  });

  test('should validate incorrect Day format', async ({ page }) => {
    await page.fill('[data-test="day-input"]', 'abc');
    await page.fill('[data-test="month-input"]', '12');
    await page.fill('[data-test="year-input"]', '2020');

    await page.click('[data-test="check-button"]');
    
    const messageLocator = page.locator('[data-test="result-message"]');
    await expect(messageLocator).toHaveText('Input data for Day is incorrect format!');
    await expect(messageLocator).toHaveClass(/error/);
  });

  test('should validate incorrect Month format', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '15');
    await page.fill('[data-test="month-input"]', 'xy');
    await page.fill('[data-test="year-input"]', '2020');

    await page.click('[data-test="check-button"]');
    
    const messageLocator = page.locator('[data-test="result-message"]');
    await expect(messageLocator).toHaveText('Input data for Month is incorrect format!');
    await expect(messageLocator).toHaveClass(/error/);
  });

  test('should validate incorrect Year format', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '15');
    await page.fill('[data-test="month-input"]', '08');
    await page.fill('[data-test="year-input"]', '12a');

    await page.click('[data-test="check-button"]');
    
    const messageLocator = page.locator('[data-test="result-message"]');
    await expect(messageLocator).toHaveText('Input data for Year is incorrect format!');
    await expect(messageLocator).toHaveClass(/error/);
  });

  test('should validate Day out of range', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '32');
    await page.fill('[data-test="month-input"]', '10');
    await page.fill('[data-test="year-input"]', '2020');

    await page.click('[data-test="check-button"]');
    
    const messageLocator = page.locator('[data-test="result-message"]');
    await expect(messageLocator).toHaveText('Input data for Day is out of range!');
    await expect(messageLocator).toHaveClass(/error/);
  });

  test('should validate Month out of range', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '15');
    await page.fill('[data-test="month-input"]', '13');
    await page.fill('[data-test="year-input"]', '2020');

    await page.click('[data-test="check-button"]');
    
    const messageLocator = page.locator('[data-test="result-message"]');
    await expect(messageLocator).toHaveText('Input data for Month is out of range!');
    await expect(messageLocator).toHaveClass(/error/);
  });

  test('should validate Year out of range', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '15');
    await page.fill('[data-test="month-input"]', '08');
    await page.fill('[data-test="year-input"]', '999');

    await page.click('[data-test="check-button"]');
    
    const messageLocator = page.locator('[data-test="result-message"]');
    await expect(messageLocator).toHaveText('Input data for Year is out of range!');
    await expect(messageLocator).toHaveClass(/error/);
  });

  test('should successfully check valid date (25/5/2026)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '25');
    await page.fill('[data-test="month-input"]', '5');
    await page.fill('[data-test="year-input"]', '2026');

    await page.click('[data-test="check-button"]');
    
    const messageLocator = page.locator('[data-test="result-message"]');
    await expect(messageLocator).toHaveText('25/5/2026 is correct date time!');
    await expect(messageLocator).toHaveClass(/success/);
  });

  test('should successfully check invalid date (31/11/2026)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '31');
    await page.fill('[data-test="month-input"]', '11');
    await page.fill('[data-test="year-input"]', '2026');

    await page.click('[data-test="check-button"]');
    
    const messageLocator = page.locator('[data-test="result-message"]');
    await expect(messageLocator).toHaveText('31/11/2026 is NOT correct date time!');
    await expect(messageLocator).toHaveClass(/error/);
  });

  test('should successfully check leap year valid date (29/2/2024)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '29');
    await page.fill('[data-test="month-input"]', '2');
    await page.fill('[data-test="year-input"]', '2024');

    await page.click('[data-test="check-button"]');
    
    const messageLocator = page.locator('[data-test="result-message"]');
    await expect(messageLocator).toHaveText('29/2/2024 is correct date time!');
    await expect(messageLocator).toHaveClass(/success/);
  });

  test('should successfully check non-leap year invalid date (29/2/2025)', async ({ page }) => {
    await page.fill('[data-test="day-input"]', '29');
    await page.fill('[data-test="month-input"]', '2');
    await page.fill('[data-test="year-input"]', '2025');

    await page.click('[data-test="check-button"]');
    
    const messageLocator = page.locator('[data-test="result-message"]');
    await expect(messageLocator).toHaveText('29/2/2025 is NOT correct date time!');
    await expect(messageLocator).toHaveClass(/error/);
  });

  test.describe('Close Window / Exit Tests', () => {

    test('should show Close button on title bar', async ({ page }) => {
      await expect(page.locator('[data-test="close-button"]')).toBeVisible();
      await expect(page.locator('.window-title')).toHaveText('Date Time Checker');
    });

    test('should open custom confirm modal when Close is clicked', async ({ page }) => {
      await page.click('[data-test="close-button"]');
      await expect(page.locator('[data-test="confirm-modal"]')).toBeVisible();
      await expect(page.locator('[data-test="confirm-modal"] .modal-body')).toContainText('Are you sure you want to exit?');
    });

    test('should hide modal when No is clicked and keep form active', async ({ page }) => {
      await page.click('[data-test="close-button"]');
      await page.click('[data-test="confirm-no"]');
      await expect(page.locator('[data-test="confirm-modal"]')).not.toBeVisible();
      
      const opacity = await page.locator('.form-container').evaluate(el => window.getComputedStyle(el).opacity);
      expect(opacity).toBe('1');
    });

    test('should exit application when Yes is clicked', async ({ page }) => {
      await page.click('[data-test="close-button"]');
      await page.click('[data-test="confirm-yes"]');
      
      await expect(page.locator('[data-test="confirm-modal"]')).not.toBeVisible();
      
      const opacity = await page.locator('.form-container').evaluate(el => window.getComputedStyle(el).opacity);
      expect(parseFloat(opacity)).toBeLessThan(0.2); // opacity is 0.15
      
      const pointerEvents = await page.locator('.form-container').evaluate(el => window.getComputedStyle(el).pointerEvents);
      expect(pointerEvents).toBe('none');
    });

  });

  test.describe('URD Specified Test Cases (Sheet DayInMonth & CheckDate)', () => {

    // Sheet CheckDate Normal
    test('CheckDate Normal: 15/6/2023 should be True', async ({ page }) => {
      await page.fill('[data-test="day-input"]', '15');
      await page.fill('[data-test="month-input"]', '6');
      await page.fill('[data-test="year-input"]', '2023');

      await page.click('[data-test="check-button"]');
      
      const messageLocator = page.locator('[data-test="result-message"]');
      await expect(messageLocator).toHaveText('15/6/2023 is correct date time!');
      await expect(messageLocator).toHaveClass(/success/);
    });

    test('CheckDate Normal: 31/1/2023 should be True', async ({ page }) => {
      await page.fill('[data-test="day-input"]', '31');
      await page.fill('[data-test="month-input"]', '1');
      await page.fill('[data-test="year-input"]', '2023');

      await page.click('[data-test="check-button"]');
      
      const messageLocator = page.locator('[data-test="result-message"]');
      await expect(messageLocator).toHaveText('31/1/2023 is correct date time!');
      await expect(messageLocator).toHaveClass(/success/);
    });

    test('CheckDate Normal: 28/2/2021 should be True', async ({ page }) => {
      await page.fill('[data-test="day-input"]', '28');
      await page.fill('[data-test="month-input"]', '2');
      await page.fill('[data-test="year-input"]', '2021');

      await page.click('[data-test="check-button"]');
      
      const messageLocator = page.locator('[data-test="result-message"]');
      await expect(messageLocator).toHaveText('28/2/2021 is correct date time!');
      await expect(messageLocator).toHaveClass(/success/);
    });

    // Sheet CheckDate Boundary
    test('CheckDate Boundary: 1/1/2023 should be True', async ({ page }) => {
      await page.fill('[data-test="day-input"]', '1');
      await page.fill('[data-test="month-input"]', '1');
      await page.fill('[data-test="year-input"]', '2023');

      await page.click('[data-test="check-button"]');
      
      const messageLocator = page.locator('[data-test="result-message"]');
      await expect(messageLocator).toHaveText('1/1/2023 is correct date time!');
      await expect(messageLocator).toHaveClass(/success/);
    });

    test('CheckDate Boundary: 31/12/2023 should be True', async ({ page }) => {
      await page.fill('[data-test="day-input"]', '31');
      await page.fill('[data-test="month-input"]', '12');
      await page.fill('[data-test="year-input"]', '2023');

      await page.click('[data-test="check-button"]');
      
      const messageLocator = page.locator('[data-test="result-message"]');
      await expect(messageLocator).toHaveText('31/12/2023 is correct date time!');
      await expect(messageLocator).toHaveClass(/success/);
    });

    test('CheckDate Boundary: 29/2/2000 should be True', async ({ page }) => {
      await page.fill('[data-test="day-input"]', '29');
      await page.fill('[data-test="month-input"]', '2');
      await page.fill('[data-test="year-input"]', '2000');

      await page.click('[data-test="check-button"]');
      
      const messageLocator = page.locator('[data-test="result-message"]');
      await expect(messageLocator).toHaveText('29/2/2000 is correct date time!');
      await expect(messageLocator).toHaveClass(/success/);
    });

    test('CheckDate Boundary: 29/2/2021 should be False', async ({ page }) => {
      await page.fill('[data-test="day-input"]', '29');
      await page.fill('[data-test="month-input"]', '2');
      await page.fill('[data-test="year-input"]', '2021');

      await page.click('[data-test="check-button"]');
      
      const messageLocator = page.locator('[data-test="result-message"]');
      await expect(messageLocator).toHaveText('29/2/2021 is NOT correct date time!');
      await expect(messageLocator).toHaveClass(/error/);
    });

    test('CheckDate Boundary: 30/4/2023 should be True', async ({ page }) => {
      await page.fill('[data-test="day-input"]', '30');
      await page.fill('[data-test="month-input"]', '4');
      await page.fill('[data-test="year-input"]', '2023');

      await page.click('[data-test="check-button"]');
      
      const messageLocator = page.locator('[data-test="result-message"]');
      await expect(messageLocator).toHaveText('30/4/2023 is correct date time!');
      await expect(messageLocator).toHaveClass(/success/);
    });

    test('CheckDate Boundary: 31/4/2023 should be False', async ({ page }) => {
      await page.fill('[data-test="day-input"]', '31');
      await page.fill('[data-test="month-input"]', '4');
      await page.fill('[data-test="year-input"]', '2023');

      await page.click('[data-test="check-button"]');
      
      const messageLocator = page.locator('[data-test="result-message"]');
      await expect(messageLocator).toHaveText('31/4/2023 is NOT correct date time!');
      await expect(messageLocator).toHaveClass(/error/);
    });

    // Sheet CheckDate Abnormal
    test('CheckDate Abnormal: 0/6/2023 should show out of range', async ({ page }) => {
      await page.fill('[data-test="day-input"]', '0');
      await page.fill('[data-test="month-input"]', '6');
      await page.fill('[data-test="year-input"]', '2023');

      await page.click('[data-test="check-button"]');
      
      const messageLocator = page.locator('[data-test="result-message"]');
      await expect(messageLocator).toHaveText('Input data for Day is out of range!');
      await expect(messageLocator).toHaveClass(/error/);
    });

    test('CheckDate Abnormal: 32/1/2023 should show out of range', async ({ page }) => {
      await page.fill('[data-test="day-input"]', '32');
      await page.fill('[data-test="month-input"]', '1');
      await page.fill('[data-test="year-input"]', '2023');

      await page.click('[data-test="check-button"]');
      
      const messageLocator = page.locator('[data-test="result-message"]');
      await expect(messageLocator).toHaveText('Input data for Day is out of range!');
      await expect(messageLocator).toHaveClass(/error/);
    });

  });

});
