# Playwright E2E Test Template 🎭

## Einleitung
Willkommen im offiziellen Playwright-Template für den **TestShop**. Dieses Projekt dient als professionelle Referenzarchitektur für automatisierte E2E-Tests.

---

## 1. Quick Start (Schnelleinstieg)

Dieses Template ist so vorkonfiguriert, dass es sofort gegen die Live-Vercel-Instanz des Shops testet.

1.  **Abhängigkeiten installieren:**
    ```bash
    npm install
    npx playwright install --with-deps
    ```
2.  **Tests ausführen (Standard gegen Vercel):**
    ```bash
    npm run test:e2e
    ```
3.  **Vollständiger Zyklus (inkl. Allure Report):**
    ```bash
    npm run test:full-cycle
    ```

---

## 2. Flexibles Testen (Umgebungen)

Eines der wichtigste Features für Consultants ist die Möglichkeit, **überall** zu testen, ohne den Code zu ändern. Wir nutzen dafür Umgebungsvariablen.

### 2.1 Direkt via Kommandozeile (Ad-hoc)
Du kannst die Ziel-URL bei jedem Befehl einfach mitgeben:
```bash
BASE_URL=http://localhost:3000 npm run test:e2e
BASE_URL=https://qa.meine-app.de npm run test:e2e
```

### 2.2 Über Konfigurations-Profile (`TEST_ENV`)
Wir haben vordefinierte Profile im Ordner `config/`. Nutze die Kurzform-Befehle:
*   **QA:** `npm run test:qa` (Nutzt `config/.env.qa`)
*   **Staging:** `npm run test:staging` (Nutzt `config/.env.staging`)
*   **Prod:** `npm run test:prod` (Nutzt `config/.env.prod`)

### 2.3 Lokale Overrides (`.env.local`)
Erstelle eine Datei `config/.env.local` (wird von Git ignoriert), um deine persönlichen Einstellungen zu speichern:
```bash
BASE_URL=http://localhost:3000
HEADLESS=false
```

---

## 3. Architektur & Best Practices

*   **Page Object Model (POM):** Logik und Selektoren sind in den Klassen unter `pages/` getrennt.
*   **Fixtures:** Automatisches Setup der Pages in `fixtures/base-test.ts`.
*   **Data-Driven:** Dynamische Testdaten via `@faker-js/faker` in `data/test-data.ts`.

---

## 4. Infrastruktur & Docker

Du kannst die gesamte Test-Suite in einem isolierten Linux-Container ausführen. Dies simuliert exakt die Bedingungen in der CI-Pipeline.

**Tests in Docker starten:**
```bash
docker compose up --build
```
*Der Container startet automatisch die App (via Vercel/Image) und führt die Tests in Chromium und Firefox aus.*

---

## 5. Reporting

Ergebnisse werden im Ordner `reporting/` gesammelt:
*   **Allure Report:** Profi-Dashboard mit Historie (`npm run report:open`).
*   **Playwright HTML:** Technisches Debugging inkl. Videos & Traces (`reporting/playwright/index.html`).
