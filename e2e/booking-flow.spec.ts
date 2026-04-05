import { test, expect } from '@playwright/test';

test.describe('Booking flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('search form is visible', async ({ page }) => {
    // The form card should be present in the DOM
    const formCard = page.locator('.home-page');
    await expect(formCard).toBeVisible();
  });

  test('route autocomplete is interactive', async ({ page }) => {
    const autocomplete = page.locator('#tratta-autocomplete-0');

    // Element should be present and enabled
    await expect(autocomplete).toBeVisible();
    await expect(autocomplete).toBeEnabled();

    // Should be clickable / focusable
    await autocomplete.click();
    const isFocused = await autocomplete.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBeTruthy();
  });

  test('search button is present', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: /cerca/i });
    await expect(searchButton).toBeVisible();
  });
});
