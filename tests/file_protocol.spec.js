const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Menu QR Code - File Protocol Tests', () => {
  test('Ouvrir index.html en file:// et verifier chargement des plats', async ({ page }) => {
    const filePath = `file:///${path.join(__dirname, '../index.html').replace(/\\/g, '/')}`;
    
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      consoleErrors.push(error.message);
    });

    await page.goto(filePath);
    
    // Attendre que le menu-container n'ait plus de squelletons et affiche un plat
    await expect(page.locator('.menu-item').first()).toBeVisible({ timeout: 5000 });
    
    // Vérifier qu'il y a au moins un plat
    const count = await page.locator('.menu-item').count();
    expect(count).toBeGreaterThan(0);
    
    // Vérifier qu'une image charge sans erreur
    const img = page.locator('.menu-item img').first();
    const isImageVisible = await img.isVisible();
    expect(isImageVisible).toBe(true);

    // Aucune erreur console ne doit être déclenchée (ex: erreur fetch CORS)
    expect(consoleErrors).toEqual([]);
  });
});
