import { SupplementaryCalculations } from './costs';

// Sheet 3: Splitsatz - Kostenaufteilung pro KM und Stunde
export interface SplitRate {
  costPerKM: number;               // EUR
  costPerHour: number;             // EUR
  costPerDay: number;              // EUR
  totalAnnualCosts: number;        // EUR

  // Mit MwSt
  costPerKMWithVAT: number;        // EUR (+ 19% MwSt)
  costPerHourWithVAT: number;      // EUR
  totalAnnualWithVAT: number;      // EUR

  // Breakdown nach Kostenart
  breakdown: SplitRateBreakdown[];
}

export interface SplitRateBreakdown {
  costsType: string;               // z.B. "Treibstoff", "Abschreibung"
  annualCosts: number;             // EUR/Jahr
  percentage: number;              // %
  costPerKM: number;               // EUR
  costPerHour: number;             // EUR
}

// Sheet 4: Auftragskalkulation
export interface OrderCalculation {
  id: string;
  date: Date;

  // Eingaben
  route: string;                   // Von / Nach
  distance: number;                // km
  duration: number;                // Stunden (oder Tage)
  packages?: number;               // Pakete/Paletten
  additionalServices?: number;     // EUR (z.B. Spedition, Handling)

  // Berechnungen
  directCosts: {
    kmCosts: number;               // distance * costPerKM
    hourCosts: number;             // duration * costPerHour
    total: number;
  };

  revenue: number;                 // Verrechnungssatz (EUR)

  // Deckungsbeiträge
  contributionI: number;           // Revenue - Direct Costs
  contributionII: number;          // DB I - Fahrerkosten
  contributionIII: number;         // DB II - Zeitabh. Fahrzeugkosten
  profit: number;                  // DB III - Gemeinkosten

  // Analyse
  profitMargin: number;            // Profit / Revenue * 100 (%)
  breakEven: {
    minRevenue: number;            // Mindestpreis für Break-Even
    profitMargin: number;          // Bei Break-Even = 0%
  };

  // Status
  isProfitable: boolean;
  notes?: string;
}

// Zusammenfassung für Dashboard
export interface CalculationSummary {
  vehicle: {
    id: string;
    name: string;
    registration: string;
  };

  supplementary: SupplementaryCalculations;
  splitRate: SplitRate;

  orders: OrderCalculation[];

  // Statistiken
  stats: {
    totalOrders: number;
    profitableOrders: number;
    averageProfit: number;
    averageProfitMargin: number;
    totalRevenue: number;
    totalCosts: number;
    totalProfit: number;
  };
}

// Für Speicherung/Export
export interface CalculationSnapshot {
  id: string;
  name: string;
  date: Date;
  vehicleId: string;
  summary: CalculationSummary;
  exported?: boolean;
  exportedAt?: Date;
}
