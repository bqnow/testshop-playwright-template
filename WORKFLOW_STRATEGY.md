# 🏗️ Architektur & CI/CD Workflow Strategie

## 1. Architektur-Konzept: "Separate Test Repository"
Dieses Projekt folgt streng dem **"Decoupled Architecture"** Ansatz (Entkoppelte Architektur). Der Applikationscode und der Test-Automatisierungscode liegen in zwei vollständig getrennten Repositories. Dies spiegelt ein professionelles Umfeld wider, in dem QA/SDET-Teams oft unabhängig von Feature-Entwicklern arbeiten.

*   **Zielsystem (Die App):** `bqnow-testapp`
*   **Testsystem (Die Tests):** `testshop-playwright-template`

### Die Kopplung: Docker
Das verbindende Glied zwischen diesen beiden Welten ist **Docker**.
*   Der einzige Output des App-Repos ist ein **Docker Image** (`ghcr.io/bqnow/testshop`).
*   Das Test-Repo sieht *niemals* den Quellcode der App. Es konsumiert lediglich dieses kompilierte Docker Image.

---

## 2. CI/CD Pipeline Ablauf (Der "Twin-Repo" Link)

Wir haben eine automatisierte Verbindung zwischen den beiden Repositories eingerichtet, um kontinuierliche Qualitätssicherung zu gewährleisten.

### Phase 1: Artefakt & Trigger (Shop Repo)
**Auslöser:** Push auf `main` in `bqnow-testapp` ODER Git Tag (z.B. `v1.0.0`).

1.  **Build:** GitHub Actions baut die Next.js App und verpackt sie in einen leichtgewichtigen Docker Container.
2.  **Publish (Versionierung):** Das Image wird in die GitHub Container Registry (GHCR) geladen mit:
    *   **`main` Branch Push** → Tag: `:latest` (Bleeding Edge, für Entwicklung)
    *   **Git Tag `v1.2.3`** → Tag: `:1.2.3` (Stabile Version für Schulungen/Produktion)
3.  **Dispatch:** Ein `repository_dispatch` Event (`app-update`) wird an das Test-Repo gesendet.
    *   Payload enthält den tatsächlichen Tag: `{"image_tag": "latest"}` oder `{"image_tag": "1.2.3"}`.

### Phase 2: Verifizierung (Test Repo)
**Auslöser:** Empfang von `repository_dispatch` ODER lokaler Push auf `main`.

1.  **Setup:** Der Workflow startet eine Docker Compose Umgebung.
2.  **Pull:** Er zieht exakt die Image-Version, die im Event gemeldet wurde (oder `latest`).
3.  **Test:** Playwright Tests laufen gegen diese kurzlebige Container-Instanz.
4.  **Report:** Ergebnisse werden generiert (Allure/HTML) und als Artefakt gespeichert.

---