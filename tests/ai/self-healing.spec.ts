import { test, expect, Page } from '@playwright/test';

// AI-Assisted Semantic Helpers (Simulating Self-Healing & Natural Language AI Testing)

/**
 * AI-assisted helper to fill an input field based on its associated label text, 
 * placeholder, name, ID, or ARIA attributes.
 * This simulates how AI engines (like ZeroStep or testRigor) locate elements semantically 
 * rather than relying on brittle CSS/XPath selectors.
 */
async function aiFill(page: Page, labelText: string, value: string) {
  console.log(`[AI Agent] Looking for an input field associated with: "${labelText}"...`);

  // 1. Try finding input by label text (Playwright's semantic locator)
  const byLabel = page.getByLabel(labelText, { exact: false });
  if (await byLabel.isVisible()) {
    console.log(`[AI Agent] [Self-Healed] Found input via associated label: "${labelText}"`);
    await byLabel.fill(value);
    return;
  }

  // 2. Try finding input by placeholder
  const byPlaceholder = page.getByPlaceholder(labelText, { exact: false });
  if (await byPlaceholder.isVisible()) {
    console.log(`[AI Agent] [Self-Healed] Found input via placeholder: "${labelText}"`);
    await byPlaceholder.fill(value);
    return;
  }

  // 3. Fallback: Search the entire DOM for labels, find matching text, and get the associated input
  const allLabels = page.locator('label');
  const labelCount = await allLabels.count();
  for (let i = 0; i < labelCount; i++) {
    const text = await allLabels.nth(i).innerText();
    if (text.toLowerCase().includes(labelText.toLowerCase())) {
      const forAttr = await allLabels.nth(i).getAttribute('for');
      if (forAttr) {
        const input = page.locator(`#${forAttr}`);
        if (await input.isVisible()) {
          console.log(`[AI Agent] [Self-Healed] Located input via label's "for" attribute: "${forAttr}"`);
          await input.fill(value);
          return;
        }
      }
    }
  }

  // 4. Last resort: Fuzzy match elements using native test id or attributes containing the label name
  const fuzzyInput = page.locator(`input[id*="${labelText.toLowerCase()}"], input[name*="${labelText.toLowerCase()}"], input[data-test*="${labelText.toLowerCase()}"]`);
  if (await fuzzyInput.count() > 0 && await fuzzyInput.first().isVisible()) {
    console.log(`[AI Agent] [Self-Healed] Fuzzy matched input by attribute: "${labelText}"`);
    await fuzzyInput.first().fill(value);
    return;
  }

  throw new Error(`[AI Agent] Failed to locate any input element matching: "${labelText}"`);
}

/**
 * AI-assisted helper to click a button based on its text content, ARIA label, or ID.
 */
async function aiClick(page: Page, buttonText: string) {
  console.log(`[AI Agent] Looking for a button or clickable element containing: "${buttonText}"...`);

  // 1. Try finding button by role and name (Playwright semantic search)
  const byRole = page.getByRole('button', { name: buttonText, exact: false });
  if (await byRole.isVisible()) {
    console.log(`[AI Agent] [Self-Healed] Found button via semantic role & name: "${buttonText}"`);
    await byRole.click();
    return;
  }

  // 2. Try finding element containing the text anywhere
  const byText = page.locator(`text=${buttonText}`);
  if (await byText.isVisible()) {
    console.log(`[AI Agent] [Self-Healed] Found clickable element via text match: "${buttonText}"`);
    await byText.click();
    return;
  }

  // 3. Fallback: Match any clickable button with classes/IDs/data-tests containing the text
  const fuzzyButton = page.locator(`button[id*="${buttonText.toLowerCase()}"], button[data-test*="${buttonText.toLowerCase()}"], button[class*="${buttonText.toLowerCase()}"]`);
  if (await fuzzyButton.count() > 0 && await fuzzyButton.first().isVisible()) {
    console.log(`[AI Agent] [Self-Healed] Fuzzy matched button by attributes: "${buttonText}"`);
    await fuzzyButton.first().click();
    return;
  }

  throw new Error(`[AI Agent] Failed to locate any clickable element matching: "${buttonText}"`);
}

/**
 * AI-assisted helper to assert that specific text or element is visible.
 */
async function aiAssertVisible(page: Page, text: string) {
  console.log(`[AI Agent] Verifying if text "${text}" is visible on screen...`);
  const element = page.locator(`text=${text}`).first();
  await expect(element).toBeVisible();
  console.log(`[AI Agent] Success: Verified text "${text}" is visible.`);
}


test.describe('AI-Assisted Self-Healing Tests (Fuzzy Selector Matcher)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should successfully validate a correct date (25/5/2026) using semantic selectors', async ({ page }) => {
    // Note: We DO NOT use exact CSS classes or unique element IDs (like #day or [data-test="day-input"])
    // If the developers change the DOM structure or classes, the AI helpers will self-heal
    await aiFill(page, 'Day', '25');
    await aiFill(page, 'Month', '5');
    await aiFill(page, 'Year', '2026');

    // Click the Check button
    await aiClick(page, 'Check');

    // Validate using semantic text matching
    await aiAssertVisible(page, '25/5/2026 is correct date time!');
  });

  test('should successfully validate an invalid date (29/2/2025) using semantic selectors', async ({ page }) => {
    await aiFill(page, 'Day', '29');
    await aiFill(page, 'Month', '2');
    await aiFill(page, 'Year', '2025');

    // Click the Check button
    await aiClick(page, 'Check');

    // Validate error notification
    await aiAssertVisible(page, '29/2/2025 is NOT correct date time!');
  });

  test('should open and interact with the exit modal using semantic selectors', async ({ page }) => {
    // Click close/exit button
    await aiClick(page, 'close'); // Looks for 'close' in class, id, or text

    // Check modal contents
    await aiAssertVisible(page, 'Are you sure you want to exit?');

    // Click "No" to return
    await aiClick(page, 'No');
  });

});
