# Excel-Struktur für Prüfung

## Blätter & Funktionalität

### 1. LKW-Transporter Datenblatt
**Eingabefelder:**
- NAME: Unternehmen
- Marke/Type: Fahrzeug
- Kennzeichen
- Höchstzulässiges Gewicht: 3.5t
- Baujahr/EURO
- Wiederbeschaffungswert: EUR 78000
- Nutzungsdauer: 5 Jahre
- Fahrzeugrestwert: EUR 7000
- Abschreibung: 50%
- Treibstoffverbrauch: 22 Liter/100km
- Treibstoffpreis: EUR 1.2/L
- Öl- und Schmierstoff: 0 L, EUR 0/L
- Reifen Vorderachse: EUR 200
- Reifen Hinterachse: EUR 400
- Runderneuerungskosten: EUR 0
- Reifenlaufleistung VA: 60000 km
- Reifenlaufleistung HA: 80000 km
- Reparaturkosten pro Jahr: EUR 8000
- KFZ-Steuer: EUR 0
- KFZ-Haftpflichtprämie: EUR 5400
- KFZ-Vollkaskoprämie: EUR 0
- Sonstige KFZ-Versicherung: EUR 600.71
- Lohnkosten (Personal)

### 2. Nebenrechnungen
**Berechnet automatisch:**
- Treibstoffkosten: (Verbrauch/100 * Preis) → pro 100km, pro km
- Schmierstoffkosten: (Verbrauch/100 * Preis)
- Bereifung Vorderachse: Preis / Laufleistung
- Bereifung Hinterachse: (Preis + Runderneuerung) / Laufleistung
- Gesamtreifen: VA + HA
- Reparaturen: auf Basis Jahreskosten

### 3. Splitsatz
**Aufteilung der Gesamtkosten:**
- Pro KM: Kosten pro KM
- Pro Stunde: Kosten pro Stunde
- Berechnet aus: Nebenrechnungen (Blatt 2)
- Spalten:
  - Kostenart
  - Kosten pro Jahr (MW, Hänger, Zug)
  - Splitting-Satz (pro KM, pro Stunde)

**Gesamtberechnung:**
- Gesamtkosten pro Jahr: EUR 186.126
- Kosten pro KM: EUR 0.4809
- Kosten pro Stunde: EUR 2.5852
- VK-Preis inkl. MwSt: EUR 223.362

### 4. Auftragskalkulation
**Eingabefelder:**
- von/nach (Route)
- Bruttoumsatz (Verrechnungssatz)
- Unterwegsspesen
- Gefahrene Kilometer: 300 km
- Einsatzzeit in Tagen: 7 Tage

**Berechnung:**
- Nettoumsatz = Bruttoumsatz - Unterwegsspesen
- DB I (Deckungsbeitrag I) = Nettoumsatz - km-abhängige Kosten
- DB II = DB I - Fahrerkosten
- DB III = DB II - zeitabhängige Fahrzeugkosten
- Gewinn/Verlust = DB III - Gemeinkosten
- Erlös je KM = Nettoumsatz / Kilometer

### 5. Kosten Personal
- Arbeitnehmer: Name, Monat, Brutto, Lohnkosten, Taggeld

### 6. Verwaltung
- Miete: EUR 4000
- Geschäftsführer: EUR 25000
- Versicherung: EUR 9600
- Werbung: EUR 1000
- Kredit: EUR 4000
- Div. Aufwand: EUR 3000
- Arbeiter: EUR 29000
- Leasing: EUR 4000
- Gewinn Unternehmen: EUR 5000

### 7. KFZ Kosten
- Versicherung pro Fahrzeug
- Leasing pro Fahrzeug
- Wartungsvertrag
- Dursch. KM/Tag

### 8. Stopp
- Tour, Monat, Stopps, Pakete, Pakete/Stopp

### 9. Kosten Transporter
- Kennzeichen, Monat, Versicherung, Leasing, Tank, Reparaturen, KM

## Prüfkriterien für Agent

1. **Eingabefelder**: Alle Felder aus Blatt 1 müssen editierbar sein
2. **Automatische Berechnungen**: Alle Formeln aus Blatt 2-4 müssen funktionieren
3. **Datenfluss**: 
   - Blatt 1 → Blatt 2 (Nebenrechnungen)
   - Blatt 2 → Blatt 3 (Splitsatz)
   - Blatt 3 + Blatt 1 Auftragsdaten → Blatt 4 (Auftragskalkulation)
4. **Ergebnisse**: Alle Kennzahlen müssen mit Excel identisch sein
5. **Export**: PDF/Excel-Export möglich?
6. **UI**: Responsive, benutzerfreundlich, Navigation zwischen Blättern

