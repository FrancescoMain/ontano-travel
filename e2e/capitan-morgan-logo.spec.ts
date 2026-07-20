import { test, expect } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots', 'capitan-morgan');

// Tratte Capitan Morgan attive sul backend dev.
// "Napoli Beverello -> Giro in barca" non è ancora configurata lato backend:
// il mapping del logo è per compagnia (CapitanMorgan), quindi varrà anche per lei.
const ROUTE_LABEL = 'Napoli Beverello -> Gita con bagno';
const DEPARTURE_DATE = '25/07/2026';
const DEPARTURE_DAY = '25';

// MUI DatePicker è responsive: su desktop è un campo digitabile, su mobile
// apre un dialog con il calendario. Il mese di default è quello corrente,
// coerente con DEPARTURE_DATE.
async function setDepartureDate(page: import('@playwright/test').Page) {
  const dateInput = page.getByPlaceholder('DD/MM/YYYY').first();
  await expect(dateInput).toBeVisible({ timeout: 15000 });
  await dateInput.click();

  // Mobile: l'input è readonly e apre un dialog con il calendario.
  const dialog = page.getByRole('dialog');
  if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
    await dialog
      .getByRole('gridcell', { name: DEPARTURE_DAY, exact: true })
      .click();
    const okButton = dialog.getByRole('button', { name: /^ok$/i });
    if (await okButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await okButton.click();
    }
    await expect(dialog).toBeHidden({ timeout: 10000 });
    return;
  }

  // Desktop: campo digitabile a sezioni.
  await page.keyboard.type(DEPARTURE_DATE.replace(/\//g, ''));
}

test.describe('Logo Capitan Morgan', () => {
  test('è visibile nei risultati di ricerca e nel riepilogo checkout', async ({ page }) => {
    test.setTimeout(180000);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 0. Chiudi il banner cookie (iubenda) se presente
    const cookieAccept = page.getByRole('button', { name: 'Accetta' });
    if (await cookieAccept.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cookieAccept.click();
      await cookieAccept.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }

    // 1. Seleziona la tratta dall'autocomplete
    const autocomplete = page.locator('#tratta-autocomplete-0');
    await expect(autocomplete).toBeVisible();
    await autocomplete.click();
    await autocomplete.fill('Gita con bagno');
    await page.getByRole('option', { name: ROUTE_LABEL }).click();

    // 2. Imposta la data di partenza
    await setDepartureDate(page);

    // La ricerca si abilita solo con tratta e data valorizzate
    await expect(page.getByRole('button', { name: /cerca/i })).toBeEnabled({
      timeout: 10000,
    });

    // 3. Avvia la ricerca
    await page.getByRole('button', { name: /cerca/i }).click();
    await page.waitForURL(/results/, { timeout: 30000 });
    await page.waitForResponse(
      (resp) => resp.url().includes('/api/booking/route/search') && resp.ok(),
      { timeout: 30000 }
    );

    // 4. Il logo è visibile nelle card dei risultati
    const resultLogos = page.locator('img[alt="Capitan Morgan"]');
    await expect(resultLogos.first()).toBeVisible({ timeout: 20000 });
    const logoCount = await resultLogos.count();
    expect(logoCount).toBeGreaterThan(0);

    // Il logo deve avere dimensioni reali (immagine caricata, non broken)
    const naturalWidth = await resultLogos
      .first()
      .evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `results-${test.info().project.name}.png`),
      fullPage: true,
    });

    // 5. Attendi il caricamento del prezzo della card, poi seleziona la corsa.
    // NB: cliccare prima che il prezzo sia caricato causa un TypeError
    // preesistente in ResultCard.onClick (priceData null).
    await page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/booking/price/searchresult') && resp.ok(),
      { timeout: 30000 }
    );
    const firstCard = page.locator('.card-container').first();
    await expect(firstCard).toContainText('€', { timeout: 30000 });
    await firstCard.click();
    // Il bottone "Avanti" ha aria-label "Procedi al checkout"
    const avantiButton = page.getByRole('button', {
      name: /procedi al checkout/i,
    });
    await expect(avantiButton).toBeVisible({ timeout: 45000 });
    await expect(avantiButton).toBeEnabled();

    // 6. Vai al checkout e verifica il logo nel riepilogo tratta
    await avantiButton.click();
    await page.waitForURL(/checkout/, { timeout: 45000 });
    await page.waitForLoadState('networkidle');

    const checkoutLogo = page.locator('img[alt="Capitan Morgan"]').first();
    await expect(checkoutLogo).toBeVisible({ timeout: 20000 });
    const checkoutNaturalWidth = await checkoutLogo.evaluate(
      (img: HTMLImageElement) => img.naturalWidth
    );
    expect(checkoutNaturalWidth).toBeGreaterThan(0);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `checkout-${test.info().project.name}.png`),
      fullPage: true,
    });
  });
});
