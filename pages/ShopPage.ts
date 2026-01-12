import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShopPage extends BasePage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByTestId('search-input');
        this.searchButton = page.getByTestId('search-submit');
    }

    async goto() {
        await super.goto('/');
    }

    async searchProduct(term: string) {
        await this.searchInput.fill(term);
        await this.searchButton.click();
        // Warten, bis URL aktualisiert oder Ergebnisse geladen sind (optional)
        await this.page.waitForURL(/query=/);
    }

    async filterByCategory(category: string) {
        await this.page.getByTestId(`category-${category.toLowerCase()}`).click();
    }

    /**
     * Klickt auf eine Produktkarte, um zur Detailseite zu navigieren.
     */
    async openProductDetails(productId: string) {
        const card = this.page.getByTestId(`product-card-${productId}`);
        await card.getByRole('link', { name: 'View' }).click();
    }

    /**
     * Fügt ein Produkt direkt aus der Listenansicht hinzu (falls unterstützt)
     * ODER nimmt an, dass auf die Karte geklickt wird.
     * Basierend auf der Komponente gibt es einen direkten 'add-to-cart-{id}' Button.
     */
    async addProductDirectlyToCart(productId: string) {
        await this.page.getByTestId(`add-to-cart-${productId}`).click();
    }
}
