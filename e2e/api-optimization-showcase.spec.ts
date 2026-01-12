import { test, expect } from '../fixtures/base-test';
import { PRODUCTS } from '../data/test-data';

test.describe('Advanced Optimization Showcase', () => {

    /**
     * DEMONSTRATION: API / State Injection
     * 
     * Dieser Test zeigt, wie man Setup-Schritte (Warenkorb füllen) massiv beschleunigt,
     * indem man die UI umgeht und den App-State direkt manipuliert.
     * 
     * Szenario: Wir wollen den Checkout testen.
     * Traditionell: Login -> Suche -> Klick auf Produkt -> Klick auf Add -> Klick auf Cart (Dauert ~5.9s)
     * Optimiert: Login -> State Injection -> Goto Cart (Dauert ~2.4s)
     * Gewinn: ~60% schneller! 🚀
     * 
     * Wann macht das Sinn?
     * - Wenn wir NUR den Checkout testen wollen (nicht den Warenkorb-Flow)
     * - Um Testdaten-Setup für komplexe Szenarien zu beschleunigen
     */
    test('Checkout Setup via State Injection (Technik-Demo)', async ({ page, loggedInPage }) => {

        // 1. "API Call" Simulation: Wir injizieren den Warenkorb-Status direkt in den LocalStorage
        // In einer echten App könnte dies auch ein API-Request an das Backend sein (z.B. POST /api/cart)
        await test.step('Setup: Inject Cart via State (No UI interaction)', async () => {
            await page.evaluate((productData) => {
                const cartState = [
                    {
                        ...productData,
                        quantity: 1
                    }
                ];
                localStorage.setItem('cart', JSON.stringify(cartState));
            }, PRODUCTS.headphones);
        });

        // 2. Direkt zum Warenkorb springen & Performance messen
        // Requirement: App muss State sofort erkennen (< 200ms Rendering-Zeit nach Load)
        await test.step('Action: Navigate & Measure Performance', async () => {
            const startTime = Date.now();

            await page.goto('/cart');
            await expect(page.getByTestId('cart-total')).toBeVisible();

            const duration = Date.now() - startTime;
            console.log(`Cart Render Time: ${duration}ms`);

            // Assertion: Sollte extrem schnell sein (unter 1000ms inkl. Netzwerk-Overhead im Test)
            // Reine Rendering-Zeit ist oft < 50ms
            expect(duration).toBeLessThan(1000);
        });

        // 3. Validierung: Produkt ist da
        await test.step('Verification: Product is in cart', async () => {
            // Wir prüfen, ob der Hack funktioniert hat
            await expect(page.getByTestId(`quantity-${PRODUCTS.headphones.id}`)).toBeVisible();
            await expect(page.getByTestId('cart-total')).toContainText(`${PRODUCTS.headphones.price}`);
        });

        // Hier könnte der Checkout-Test sofort starten, ohne vorher durch den Shop zu klicken!
    });
});
