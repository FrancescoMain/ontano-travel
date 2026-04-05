import { test } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

const viewports = [
  { name: 'homepage-375', width: 375, height: 812 },
  { name: 'homepage-390', width: 390, height: 844 },
  { name: 'homepage-480', width: 480, height: 854 },
  { name: 'homepage-1280', width: 1280, height: 800 },
];

for (const vp of viewports) {
  test(`screenshot at ${vp.width}px — ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${vp.name}.png`),
      fullPage: false,
    });
  });
}
