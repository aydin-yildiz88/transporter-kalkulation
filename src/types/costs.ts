// Nebenrechnungen (Sheet 2) + Kosten aus Sheets 5-9

// Sheet 2: Nebenrechnungen - Automatisch berechnete Kosten
export interface SupplementaryCalculations {
  // Treibstoffkosten
  fuelCostsPer100Km: number;       // EUR
  fuelCostsPerKm: number;          // EUR
  annualFuelCosts: number;         // EUR

  // Öl und Schmierstoff
  oilCostsPer100Km: number;        // EUR
  oilCostsPerKm: number;           // EUR
  annualOilCosts: number;          // EUR

  // Reifen
  frontTireCostPerKm: number;      // EUR
  rearTireCostPerKm: number;       // EUR
  totalTireCostPerKm: number;      // EUR
  annualTireCosts: number;         // EUR

  // Reparaturen
  repairCostsPerKm: number;        // EUR
  annualRepairCosts: number;       // EUR

  // Abschreibung
  depreciationPerYear: number;     // EUR
  depreciationPerKm: number;       // EUR

  // Steuern
  annualCarTax: number;            // EUR
  annualRoadTax: number;           // EUR

  // Versicherung
  annualInsuranceCosts: number;    // EUR (Haftung + Vollkasko + Sonstige)
  insuranceCostPerKm: number;      // EUR
}

// Sheet 5: Kosten Personal
export interface PersonalCosts {
  employees: Employee[];
  totalMonthly: number;            // EUR
  totalAnnual: number;             // EUR
}

export interface Employee {
  id: string;
  name: string;
  month: number;
  grossSalary: number;             // EUR
  laborCosts: number;              // EUR (mit Sozialabgaben)
  dailyAllowance: number;          // EUR
}

// Sheet 6: Verwaltung
export interface AdministrationCosts {
  rent: number;                    // EUR/Jahr
  businessLeader: number;          // EUR/Jahr
  insurance: number;               // EUR/Jahr
  advertising: number;             // EUR/Jahr
  loan: number;                    // EUR/Jahr
  miscExpenses: number;            // EUR/Jahr
  workers: number;                 // EUR/Jahr
  leasing: number;                 // EUR/Jahr
  enterpriseProfit: number;        // EUR/Jahr
  total: number;                   // EUR/Jahr
}

// Sheet 7: KFZ Kosten (pro Fahrzeug)
export interface VehicleCosts {
  vehicleId: string;
  insurance: number;               // EUR/Monat
  leasing: number;                 // EUR/Monat
  maintenanceContract: number;     // EUR/Monat
  averageDailyKM: number;          // km/Tag
}

// Sheet 8: Stopp (Tourenverwaltung)
export interface StoppData {
  id: string;
  tour: string;                    // z.B. "07", "08"
  month: number;
  stops: number;
  packages: number;
  packagesPerStop: number;         // Berechnet: packages / stops
}

// Sheet 9: Kosten Transporter (detailliert)
export interface TransporterCosts {
  id: string;
  registration: string;            // Kennzeichen
  month: number;
  insurance: number;               // EUR
  leasing: number;                 // EUR
  fuel: number;                    // EUR
  repairs: number;                 // EUR
  km: number;                      // Kilometer gefahren
  daysInUse: number;              // Tage im Einsatz
}

// Aggregiert
export interface AllCosts {
  personal: PersonalCosts;
  administration: AdministrationCosts;
  vehicles: Map<string, VehicleCosts[]>;  // Pro Fahrzeug
  stopp: StoppData[];
  transporter: TransporterCosts[];

  // Summen
  totalPersonalAnnual: number;
  totalAdminAnnual: number;
  totalVehicleAnnual: number;
  totalAnnualCosts: number;        // Gesamtkosten/Jahr
}

// Kosten-Breakdown nach Kategorie (für Visualization)
export interface CostBreakdown {
  category: string;
  amount: number;
  percentage: number;
  costPerKM?: number;
  costPerHour?: number;
}
