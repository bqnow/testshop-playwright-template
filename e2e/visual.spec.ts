import { test, expect } from '../fixtures/base-test';

/**
 * Visual Regression Tests (Screenshot-Vergleiche)
 * Diese Tests erfassen Screenshots und vergleichen sie, um unbeabsichtigte UI-Änderungen zu erkennen.
 * 
 * Ausführen: npm run test:visual
 * Baselines aktualisieren: npm run test:visual:update
 */

test.describe('Visual Regression - Kritische Seiten', () => {

    test('Login-Seite wird korrekt gerendert', async ({ page }) => {
        await page.goto('/login');
        await expect(page).toHaveScreenshot('login-page.png', {
            fullPage: true,
            animations: 'disabled'
        });
    });

    test('Shop-Homepage zeigt Produktraster', async ({ page }) => {
        await page.goto('/');

        // Warte bis Produkte geladen sind
        await page.waitForSelector('[data-testid^="product-card-"]');

        await expect(page).toHaveScreenshot('shop-homepage.png', {
            fullPage: true,
            animations: 'disabled'
        });
    });

    test('Warenkorb-Layout ist stabil', async ({ page, loggedInPage }) => {
        await page.goto('/cart');

        await expect(page).toHaveScreenshot('cart-empty.png', {
            fullPage: true,
            animations: 'disabled'
        });
    });

    test('Produktdetail-Seiten-Struktur', async ({ page, shopPage, loggedInPage }) => {
        await shopPage.openProductDetails('1'); // Öffne erstes Produkt

        // Verstecke dynamische Elemente (Preise können sich ändern, Timestamps, etc.)
        await page.addStyleTag({
            content: `
                .price { visibility: hidden !important; }
                .timestamp { visibility: hidden !important; }
            `
        });

        await expect(page).toHaveScreenshot('product-detail.png', {
            fullPage: true,
            animations: 'disabled'
        });
    });

});

test.describe('Visual Regression - Responsive Design', () => {

    test('Mobile: Login-Seite', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
        await page.goto('/login');

        await expect(page).toHaveScreenshot('login-mobile.png', {
            fullPage: true,
            animations: 'disabled'
        });
    });

    test('Tablet: Shop-Homepage', async ({ page, loggedInPage }) => {
        await page.setViewportSize({ width: 768, height: 1024 }); // iPad
        await page.goto('/');

        await page.waitForSelector('[data-testid^="product-card-"]');

        await expect(page).toHaveScreenshot('shop-tablet.png', {
            fullPage: true,
            animations: 'disabled'
        });
    });

});
