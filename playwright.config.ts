import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Read environment variables from file.
 * We use `dotenv` to load vars. The RULE is: "First one wins".
 *
 * Load Priority (Hierarchy):
 * 1. Shell/CLI (e.g. `TEST_ENV=qa npm run test`) -> Highest Priority
 * 2. .env.{TEST_ENV} (e.g. `.env.qa`) -> Environment specific
 * 3. .env.local -> Local developer overrides (ignored by git)
 * 4. .env -> Default values for everyone
 */
const configDir = path.resolve(__dirname, 'config');

if (process.env.TEST_ENV) {
    dotenv.config({ path: path.resolve(configDir, `.env.${process.env.TEST_ENV}`) });
}
dotenv.config({ path: path.resolve(configDir, '.env.local') });
dotenv.config({ path: path.resolve(configDir, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './e2e',
    outputDir: './reporting/test-results',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: [
        ['html', { outputFolder: 'reporting/playwright', title: 'TestShop E2E Test Results', open: 'never' }],
        ['allure-playwright', {
            detail: true,
            resultsDir: 'reporting/allure-results',
            suiteTitle: false
        }]
    ],
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'attempt-with-trace',
        video: 'on-first-retry',
        headless: process.env.HEADLESS === 'false' ? false : true,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        ...(process.env.SKIP_WEBKIT ? [] : [
            {
                name: 'webkit',
                use: { ...devices['Desktop Safari'] },
            },
        ]),
        /* 
         * BrowserStack Multi-Browser Grid
         */
        ...(process.env.BROWSERSTACK_USERNAME ? [
            { browser: 'chrome', os: 'Windows', os_version: '11', name: 'bs_windows_chrome' },
            { browser: 'edge', os: 'Windows', os_version: '11', name: 'bs_windows_edge' },
            { browser: 'safari', os: 'OS X', os_version: 'Sonoma', name: 'bs_mac_safari' },
        ].map(caps => ({
            name: caps.name,
            use: {
                connectOptions: {
                    wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
                        'browser': caps.browser,
                        'browser_version': 'latest',
                        'os': caps.os,
                        'os_version': caps.os_version,
                        'browserstack.user': process.env.BROWSERSTACK_USERNAME,
                        'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
                        'name': `TestShop - ${caps.name}`
                    }))}`
                },
            },
        })) : []),
    ],

    /* 
     * In the standalone template, we don't start a local server by default.
     * Consultants should test against the Docker container or the Vercel URL.
     */
});
