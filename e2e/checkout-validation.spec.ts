import { test } from '../fixtures/base-test';
import { PRODUCTS } from '../data/test-data';
import { faker } from '@faker-js/faker';

// Definiere Testdaten als Objekt
const validationScenarios = [
    // Szenario 1: PLZ muss 5 Ziffern haben (HTML pattern="\\d{5}")
    {
        testName: 'Ungültige PLZ (Pattern)',
        data: {
            fullName: faker.person.fullName(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            zip: '123', // Zu kurz
            email: faker.internet.email()
        },
        fieldToValidate: 'checkout-zip'
    },
    // Szenario 2: E-Mail muss @ enthalten (HTML type="email")
    {
        testName: 'Ungültiges E-Mail-Format',
        data: {
            fullName: faker.person.fullName(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            zip: '12345',
            email: 'not-an-email' // Fehlendes @
        },
        fieldToValidate: 'checkout-email'
    }
];

test.describe('Checkout Form Validation (Frontend)', () => {

    // Schleife durch Testdaten-Objekt
    for (const scenario of validationScenarios) {

        test(`Browser blockiert: ${scenario.testName}`, async ({ shopPage, cartPage, loggedInPage }) => {

            // 1. Warenkorb vorbereiten
            await shopPage.filterByCategory(PRODUCTS.headphones.category);
            await shopPage.addProductDirectlyToCart(PRODUCTS.headphones.id);

            await cartPage.goto();
            await cartPage.proceedToCheckout();

            // 2. Formular mit spezifisch ungültigen Daten füllen
            await cartPage.fillShippingDetails(scenario.data);

            // 3. Absenden versuchen
            await cartPage.submitOrder();

            // 4. Validierung: Spezifisches Feld ist ungültig (HTML5-Validierung)
            await cartPage.expectFieldToBeInvalid(scenario.fieldToValidate);
        });
    }
});
