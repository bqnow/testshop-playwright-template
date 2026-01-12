import { test } from '../fixtures/base-test';
import { PRODUCTS } from '../data/test-data';
import { faker } from '@faker-js/faker';

test.describe('E2E Checkout Flow', () => {

    // Beachte 'loggedInPage' Fixture -> führt Login-Logik VOR dem Test-Body aus!
    test('Standard Customer Journey (Happy Path)', async ({
        shopPage,
        productDetailPage,
        cartPage,
        loggedInPage
    }) => {

        // 1. Suchen und Produkt finden
        await test.step('Search and select product', async () => {
            await shopPage.filterByCategory(PRODUCTS.headphones.category);
            await shopPage.openProductDetails(PRODUCTS.headphones.id);
        });

        // 2. Zum Warenkorb hinzufügen
        await test.step('Add product to cart', async () => {
            await productDetailPage.addToCart();
        });

        // 3. Checkout mit dynamischen Daten
        await test.step('Checkout with dynamic user data', async () => {
            await cartPage.goto();
            await cartPage.increaseQuantity(PRODUCTS.headphones.id);
            await cartPage.checkTotal(PRODUCTS.headphones.id, PRODUCTS.headphones.price.toString());


            await cartPage.proceedToCheckout();

            // Generiere gültige Fake-Daten für jeden Testlauf!
            const fakeUser = {
                fullName: faker.person.fullName(),
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                zip: faker.location.zipCode('#####'),
                email: faker.internet.email()
            };

            await cartPage.fillShippingDetails(fakeUser);
            await cartPage.submitOrder();
            await cartPage.verifyOrderSuccess();
        });
    });
});
