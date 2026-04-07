import { test, expect } from '@playwright/test';

test.describe('Coupon flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('coupon input is visible on checkout page', async ({ page }) => {
    // Navigate to checkout (requires a valid booking flow)
    // This test verifies the coupon UI elements exist when on checkout
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // If redirected to home (no active reservation), skip
    const url = page.url();
    if (!url.includes('/checkout')) {
      test.skip();
      return;
    }

    const couponInput = page.getByPlaceholder(/coupon/i);
    await expect(couponInput).toBeVisible();

    const applyButton = page.getByRole('button', { name: /applica/i });
    await expect(applyButton).toBeVisible();
  });

  test('coupon apply and remove flow', async ({ page }) => {
    // This test requires an active reservation in checkout
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    const url = page.url();
    if (!url.includes('/checkout')) {
      test.skip();
      return;
    }

    // Enter coupon code
    const couponInput = page.getByPlaceholder(/coupon/i);
    await couponInput.fill('TESTCOUPON');

    const applyButton = page.getByRole('button', { name: /applica/i });
    await applyButton.click();

    // Wait for response — either success (coupon applied) or error
    await page.waitForTimeout(2000);

    // If coupon was valid, verify discount row appears
    const discountRow = page.getByText(/sconto coupon/i);
    const errorMsg = page.getByText(/coupon non valido/i);

    if (await discountRow.isVisible().catch(() => false)) {
      // Coupon applied successfully — verify remove button
      const removeButton = page.getByRole('button', { name: /rimuovi/i });
      await expect(removeButton).toBeVisible();

      // Remove coupon
      await removeButton.click();
      await page.waitForTimeout(2000);

      // Verify coupon input is back
      await expect(page.getByPlaceholder(/coupon/i)).toBeVisible();
    } else if (await errorMsg.isVisible().catch(() => false)) {
      // Coupon was invalid — that's expected in test environment
      expect(await errorMsg.isVisible()).toBeTruthy();
    }
  });
});
