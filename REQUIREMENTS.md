# TestShop - Functional Requirements
## E-Commerce Training Platform

**Version:** 2.0  
**Datum:** 2026-01-12  
**Zweck:** Fokussiertes Trainings-Projekt für Test-Automatisierung  

---

**Was die App KANN:**
- Benutzer-Login
- Produkte durchsuchen und kaufen
- Warenkorb-Verwaltung
- Checkout-Prozess
- Fehlerbehandlung (Buggy Product)

---

# FUNCTIONAL REQUIREMENTS

Die folgenden Requirements beschreiben **WAS** die Applikation tut - die Business-Funktionen und User-Workflows.

---

## REQ-001: User Authentication 🔐

**Type:** Functional

**User Story:**
```
Als Testnutzer
möchte ich mich mit vordefinierten Zugangsdaten anmelden
damit ich auf den geschützten Shop zugreifen kann
```

**Akzeptanzkriterien:**
- Login-Formular ist auf `/login` erreichbar
- Test-Credentials: `consultant` / `pwd`
- Nach erfolgreichem Login: Redirect zu `/`
- Session bleibt erhalten (LocalStorage-Token)
- Logout-Button ist sichtbar und funktioniert

**Testabdeckung:**
```
✅ smoke.spec.ts
   → Login-Flow komplett
   → Session-Validierung
   → Redirect-Prüfung
```

**Laufzeit:** ~4 Sekunden

---

## REQ-002: Complete Checkout Flow (Happy Path) 🛒

**Type:** End-to-End

**User Story:**
```
Szenario 1: Happy Path (Standard-Bestellung)

Als Kunde
möchte ich ein Produkt suchen, in den Warenkorb legen und bestellen
damit ich den Artikel erhalten kann
```

**Akzeptanzkriterien:**

**Schritt 1: Login**
- Erfolgreiche Anmeldung mit User `consultant` und Passwort `pwd`
- Weiterleitung zur Startseite nach Login

**Schritt 2: Produktsuche & Filterung**
- Suche nach einem Produkt funktioniert
- Filterung nach Kategorien funktioniert (z.B. "Electronics")
- Produktdetails können aufgerufen werden

**Schritt 3: Warenkorb**
- Produkt kann zum Warenkorb hinzugefügt werden
- Warenkorb zeigt Produkte und Gesamtpreis korrekt

**Schritt 4: Validierung**
- Anzahl kann auf 2 erhöht werden (+ Button)
- Gesamtpreis aktualisiert sich korrekt (Einzelpreis × 2)

**Schritt 5: Checkout**
- "Proceed to Checkout"-Button führt zu Formular
- Versanddaten können eingegeben werden (Name, Adresse, Stadt, PLZ, E-Mail)
- "Place Order"-Button schließt Bestellung ab
- Erfolgsseite zeigt Order-ID im Format `ORDER-{timestamp}`

**Testabdeckung:**
```
✅ happy-path.spec.ts
   → Kompletter User Journey in EINEM Test
   → Login (Fixture) → Filter → Produkt → Warenkorb → Menge erhöhen → Checkout
   → Dynamische Testdaten (Faker)
   → Order-ID Validierung
```

**Laufzeit:** ~8 Sekunden

---

## REQ-003: Form Validation ✅

**Type:** Input Validation

**User Story:**
```
Als System
möchte ich ungültige Eingaben verhindern
damit nur korrekte Daten gespeichert werden
```

**Akzeptanzkriterien:**
- **PLZ:** Genau 5 Ziffern (HTML Pattern: `\d{5}`)
- **E-Mail:** Muss `@` enthalten (HTML type: `email`)
- Browser zeigt native Fehlermeldung bei ungültigen Daten
- Submit ist nicht möglich bei ungültigen Daten

**Test-Szenarien** (Data-Driven):
1. PLZ zu kurz: "123" → Fehler
2. PLZ mit Buchstaben: "ABCDE" → Fehler
3. E-Mail ohne @: "test.com" → Fehler

**Testabdeckung:**
```
✅ checkout-validation.spec.ts
   → Data-Driven Test mit Array von Invalid-Cases
   → Browser-native Validierung prüfen
```

**Laufzeit:** ~5 Sekunden

**Test-Technik:** Data-Driven mit `forEach()` Loop  
**Lern-Wert:** Zeigt, wie man viele ähnliche Fälle elegant testet

---

## REQ-004: Error Handling (Buggy Product) ⚠️

**Type:** Edge Case / Resilience

**Business-Anforderung:**
```
Das System muss robust sein gegen fehlerhafte Produktdaten.
Ein Bug darf die gesamte App nicht unbrauchbar machen.
```

**User Story:**
```
Als System
möchte ich mit fehlerhaften Produkten korrekt umgehen
damit keine korrupten Bestellungen entstehen
```

**Akzeptanzkriterien:**
- Produkt ID 999 ("Glitchy Gadget") führt zu Fehler beim Checkout
- Error-Meldung wird angezeigt: "Internal Server Error"
- Bestellung wird NICHT gespeichert
- **App bleibt benutzbar nach dem Fehler!**

**Testabdeckung:**
```
✅ edge-cases.spec.ts
   → Buggy Product in Warenkorb legen
   → Checkout versuchen
   → Fehler erwarten
   → App-Stabilität validieren (zurück zur Homepage möglich)
```

**Laufzeit:** ~5 Sekunden

**Test-Technik:** Negative Testing + Resilience Check  
**Lern-Wert:** Zeigt, wie man Error-Szenarien testet

---


# NON-FUNCTIONAL REQUIREMENTS

Die folgenden Requirements beschreiben **WIE** die Applikation funktioniert - Qualitätsmerkmale wie Aussehen, Performance, Usability.

---

## REQ-005: Visual Regression Testing 📸

**Priority:** High  
**Type:** Non-Functional (UI Quality)

**User Story:**
```
Als Marketing-Team
möchten wir, dass die Seite nach jedem Deployment gleich aussieht
damit unser Brand Image konsistent bleibt
```

**Akzeptanzkriterien:**
- Layout-Stabilität auf kritischen Seiten
- Responsive Design funktioniert (Mobile, Tablet, Desktop)
- CSS-Änderungen werden sofort erkannt

**Test-Szenarien:**
1. Login-Seite (Desktop)
2. Shop Homepage (Desktop)
3. Warenkorb (Desktop)
4. Login (Mobile - iPhone SE, 375px)
5. Shop (Tablet - iPad, 768px)

**Testabdeckung:**
```
✅ visual.spec.ts
   → Screenshot-Vergleiche
   → Dynamische Inhalte maskiert (Preise, Zeitstempel)
   → Baseline-Verwaltung (--update-snapshots)
```

**Laufzeit:** ~15 Sekunden

**Test-Technik:** Playwright's `toHaveScreenshot()`  
**Lern-Wert:** Zeigt moderne Visual Regression Testing

**Workflow:**
```bash
# Baselines erstellen (beim ersten Mal)
npm run test:visual:update

# Tests laufen lassen
npm run test:visual

# Bei Fehlschlag: Diff-Bilder prüfen
# → Bewusste Änderung? Baseline updaten
# → Bug? Ticket erstellen
```


---

## REQ-006: State Persistence & Performance ⚡️

**Priority:** Medium  
**Type:** Non-Functional (Performance / Testability)

**User Story:**
```
Als User (und Tester)
möchte ich, dass mein Warenkorb lokal gespeichert wird
damit ich beim Neuladen der Seite sofort weiter machen kann (und Tests abkürzen kann)
```

**Akzeptanzkriterien:**
- Warenkorb-Daten werden im LocalStorage persistiert
- App erkennt Änderungen im LocalStorage beim Laden sofort (< 200ms)
- Ermöglicht "State Injection" für performante Test-Setups

**Testabdeckung:**
```
✅ api-optimization-showcase.spec.ts
   → Injiziert Warenkorb direkt via JavaScript
   → Validiert sofortiges Rendering ohne Ladezeit
   → Beweis für Testbarkeits-Architektur
```

---

## 📊 Test-Strategie Übersicht

### Requirements → Tests Mapping

| REQ | Requirement | Test-Datei | Test-Typ | Laufzeit |
|-----|-------------|-----------|----------|----------|
| 001 | Login | `smoke.spec.ts` | Smoke | 4s |
| 002 | Checkout Flow | `happy-path.spec.ts` | E2E | 8s |
| 003 | Form Validation | `checkout-validation.spec.ts` | Data-Driven | 5s |
| 004 | Error Handling | `edge-cases.spec.ts` | Edge Case | 5s |
| 005 | Visual Regression | `visual.spec.ts` | Visual | 15s |
| 006 | State Persistence | `api-optimization...` | Performance | 3s |

**Gesamt: ~40 Sekunden**


---

**Version:** 2.0 (Simplified)
**Status:** ✅ Final Verified
**Last Update:** 2026-01-12
