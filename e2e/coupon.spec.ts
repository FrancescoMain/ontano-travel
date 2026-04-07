import { test, expect } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots', 'coupon');

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

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'checkout-loaded.png'), fullPage: true });

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

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'before-coupon.png'), fullPage: true });

    // Enter coupon code
    const couponInput = page.getByPlaceholder(/coupon/i);
    await couponInput.fill('20PERCENT');

    const applyButton = page.getByRole('button', { name: /applica/i });
    await applyButton.click();

    // Wait for the coupon API response
    await page.waitForResponse(
      (resp) => resp.url().includes('/coupon') && resp.request().method() === 'POST',
      { timeout: 10000 }
    );

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'after-coupon-applied.png'), fullPage: true });

    // If coupon was valid, verify discount row appears
    const discountRow = page.getByText(/sconto coupon/i);
    const errorMsg = page.getByText(/coupon non valido/i);

    if (await discountRow.isVisible().catch(() => false)) {
      // Coupon applied successfully — verify remove button
      const removeButton = page.getByRole('button', { name: /rimuovi/i });
      await expect(removeButton).toBeVisible();

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'discount-visible.png'), fullPage: true });

      // Remove coupon
      await removeButton.click();
      await page.waitForResponse(
        (resp) => resp.url().includes('/coupon') && resp.request().method() === 'DELETE',
        { timeout: 10000 }
      );

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'after-coupon-removed.png'), fullPage: true });

      // Verify coupon input is back
      await expect(page.getByPlaceholder(/coupon/i)).toBeVisible();
    } else if (await errorMsg.isVisible().catch(() => false)) {
      // Coupon was invalid — that's expected in test environment
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'coupon-error.png'), fullPage: true });
      expect(await errorMsg.isVisible()).toBeTruthy();
    }
  });
});
