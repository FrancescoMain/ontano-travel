import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads correctly and shows search form', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // The homepage should render the search card (MUI Joy Card)
    // Check for the search button or the route autocomplete
    const searchButton = page.getByRole('button', { name: /cerca/i });
    const routeAutocomplete = page.locator('#tratta-autocomplete-0');

    // At least one of the main form elements should be visible
    const hasSearchButton = await searchButton.isVisible().catch(() => false);
    const hasAutocomplete = await routeAutocomplete.isVisible().catch(() => false);

    expect(hasSearchButton || hasAutocomplete).toBeTruthy();
  });

  test('no horizontal scroll at current viewport', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);

    expect(bodyScrollWidth).toBeLessThanOrEqual(windowWidth + 5); // 5px tolerance
  });
});
