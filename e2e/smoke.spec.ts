import { test, expect } from '../fixtures/base-test';


test.describe('Smoke Tests', () => {

    test('User can log in and logout', async ({ loggedInPage, page }) => {

        // VALIDIERUNG: Nach Login auf Homepage
        await expect(page).toHaveURL(/\/$/);

        // VALIDIERUNG: Logout-Button ist sichtbar
        const logoutBtn = page.getByTestId('nav-logout');
        await expect(logoutBtn).toBeVisible();

        // VALIDIERUNG: Session-Token existiert im LocalStorage
        const token = await page.evaluate(() => localStorage.getItem('token'));
        expect(token).toBeTruthy();
        expect(token).toContain('mock-jwt-token');

        // VALIDIERUNG: Username wird angezeigt
        await expect(page.getByText('consultant')).toBeVisible();

        // LOGOUT DURCHFÜHREN
        await logoutBtn.click();

        // VALIDIERUNG: Zurück zur Startseite (App-Verhalten: redirect zu /, nicht /login)
        await expect(page).toHaveURL(/\/$/);

        // VALIDIERUNG: Login-Link ist wieder sichtbar (statt Logout)
        await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
    });
});
