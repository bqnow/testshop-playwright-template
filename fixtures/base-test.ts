import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShopPage } from '../pages/ShopPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';

// Deklaration der Fixture-Typen.
type MyFixtures = {
    loginPage: LoginPage;
    shopPage: ShopPage;
    productDetailPage: ProductDetailPage;
    cartPage: CartPage;
    loggedInPage: void;
};

// Erweitere den Basis-Test
// Dieser neue "test" kann in mehreren Testdateien verwendet werden, und jeder erhält die Fixtures.
export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    shopPage: async ({ page }, use) => {
        await use(new ShopPage(page));
    },

    productDetailPage: async ({ page }, use) => {
        await use(new ProductDetailPage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },

    // Eine Fixture, die einen bereits eingeloggten Zustand bereitstellt
    loggedInPage: async ({ loginPage }, use) => {
        await loginPage.goto();
        await loginPage.login(
            process.env.TEST_USER_NAME!,
            process.env.TEST_USER_PASSWORD!
        );
        await use();
    },
});

export { expect } from '@playwright/test';
