# Playwright E2E Test Template 🎭

Willkommen in deiner neuen E2E-Testumgebung! Dieses Repository ist deine Basis für die Automatisierung des **TestShops**. Es bietet eine industrietaugliche Architektur (Page Object Model), professionelles Reporting (Allure) und volle Flexibilität für verschiedene Testumgebungen.

---

## 🛠️ Phase 1: Vorbereitung (Voraussetzungen)

Bevor du mit dem Testen startest, musst du deinen Arbeitsplatz einrichten.

### 1. IDE (Dein Arbeitsplatz)
Wir empfehlen **Google Antigravity** oder **VS Code**. Hier wirst du deinen Test-Code schreiben und ausführen.

### 2. Node.js (Die "Maschine")
Playwright basiert auf Node.js.
*   Lade die **LTS Version** von [nodejs.org](https://nodejs.org/) herunter und installiere sie.
*   Prüfe die Installation im Terminal: `node -v` (sollte v18 oder höher sein).

### 3. Git (Versionskontrolle)
Du brauchst Git, um deinen Code zu speichern und hochzuladen.
*   Installation: [git-scm.com](https://git-scm.com/)

### 4. Docker (Optionale CI-Simulation)
Um Tests in einer isolierten Linux-Umgebung zu simulieren, installiere [Docker Desktop](https://www.docker.com/products/docker-desktop/).

---

## 🚀 Phase 2: Projekt-Setup

Öffne dieses Repository in deiner IDE und führe im Terminal folgende Schritte aus:

1.  **Abhängigkeiten installieren:**
    ```bash
    npm install
    ```
2.  **Browser-Engines installieren:**
    ```bash
    npx playwright install --with-deps
    ```

---

## 🏃 Phase 3: Tests ausführen

Dieses Template ist so vorkonfiguriert, dass es sofort gegen die Live-Instanz des Shops testet:
👉 [https://testshop-dusky.vercel.app](https://testshop-dusky.vercel.app)

### Ausführungs-Modi
*   **Standard (Headless):** `npm run test:e2e` (Schnell, ohne sichtbare Fenster).
*   **Mit Bild (Headed):** `HEADLESS=false npm run test:e2e` (Gut für Debugging).
*   **Full Cycle:** `npm run test:full-cycle` (Führt Tests aus, generiert Berichte und öffnet das Dashboard automatisch).

---

## 🌍 Phase 4: Flexibles Testen (Umgebungs-Variablen)

Du kannst die Ziel-URL bei jedem Befehl einfach mitgeben, um gegen andere Instanzen (z.B. deinen lokalen Shop) zu testen:

```bash
# Testen gegen lokalen Shop
BASE_URL=http://localhost:3000 npm run test:e2e

# Testen gegen eine QA-Umgebung
BASE_URL=https://qa.meine-app.de npm run test:e2e
```

**Config-Profile:** Nutze `npm run test:qa` oder `npm run test:prod`, um vordefinierte Einstellungen aus dem `config/`-Ordner zu laden.

---

## 📊 Phase 5: Reporting & Analyse

Nach den Tests stehen dir zwei Reports zur Verfügung:

1.  **Allure Dashboard:** `npm run report:open` (Wunderschöne Graphen und Historie).
2.  **Playwright HTML:** Öffne `reporting/playwright/index.html` (Videos, Screenshots und Traces bei Fehlern).

---

## 🏗️ Architektur (Der "Rote Faden")

Damit dein Code wartbar bleibt, halten wir uns an diese Regeln:
*   **Page Object Model (POM):** Jede Seite wird durch eine Klasse in `pages/` abgebildet. Ändert sich ein Button-Layout, musst du es nur an einer Stelle im POM korrigieren.
*   **Data-Driven:** Testdaten kommen aus dem `data/`-Ordner oder werden via `@faker-js/faker` generiert.
*   **Fixtures:** Seiten werden automatisch in die Tests injiziert (`fixtures/base-test.ts`), was den Code extrem sauber hält.

---

## 🌿 Dein Workflow als Consultant

1.  **Branch erstellen:** `git checkout -b feature/mein-name-tests`.
2.  **Tests schreiben:** Nutze existierende Tests in `e2e/` als Vorlage.
3.  **Lokal validieren:** Nutze `npm run test:full-cycle`.
4.  **Committen & Pushen:** Teile deine Ergebnisse mit dem Team!
