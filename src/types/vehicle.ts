// LKW-Transporter Datenblatt (Sheet 1)
export interface VehicleData {
  id: string;
  name: string;                    // NAME: z.B. "DO 316 DI"
  mark: string;                    // Marke/Type
  registration: string;            // Kennzeichen
  hzg: number;                     // höchstzulässiges Gesamtgewicht (Tonnen)
  yearOfConstruction: number;      // Baujahr
  validUntil: number;              // Gültig bis (Jahr)
  euroClass: string;               // EURO 1-6

  // Treibstoff
  fuelConsumption: number;         // Verbrauch je 100 km (Liter)
  fuelPrice: number;               // Preis je Liter (EUR)

  // Öl und Schmierstoff
  oilConsumption: number;          // Verbrauch je 100 km (Liter)
  oilPrice: number;                // Preis je Liter (EUR)

  // Bereifung
  frontTireCost: number;           // Kaufpreis Reifen Vorderachse (EUR)
  rearTireCost: number;            // Kaufpreis Reifen Hinterachse (EUR)
  tireRenewalCost: number;         // Runderneuerungskosten (EUR)
  frontTireLife: number;           // Reifenlaufleistung VA (km)
  rearTireLife: number;            // Reifenlaufleistung HA (km)

  // Reparatur & Wartung
  annualRepairCosts: number;       // Reparaturkosten pro Jahr (EUR)

  // Steuern & Versicherung
  carTax: number;                  // KFZ-Steuer (EUR/Jahr)
  roadTax: number;                 // Straßenbenützungsabgabe (EUR/Jahr)
  liabilityInsurance: number;      // Haftpflichtprämie (EUR/Jahr)
  comprehensiveInsurance: number;  // Vollkaskoprämie (EUR/Jahr)
  otherInsurance: number;          // Sonstige Versicherung (EUR/Jahr)

  // Abschreibung & Leasing
  acquisitionCost: number;         // Wiederbeschaffungswert (EUR)
  bookValue: number;               // Buchwert (EUR)
  residualValue: number;           // Fahrzeugrestwert (EUR)
  depreciationYears: number;       // Nutzungsdauer (Jahre)
  depreciationA: number;           // Abschreibung A (%)
  depreciationB: number;           // Abschreibung B (%)
  leasingCosts?: number;           // Leasingkosten (EUR, optional)
  leasingDuration?: number;        // Dauer Leasingvertrag (Jahre)

  // Berechnet/Abgeleitet
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

export interface VehicleFormData extends Partial<VehicleData> {}
