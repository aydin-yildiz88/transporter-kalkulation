import { VehicleData } from '../types/vehicle';
import { SupplementaryCalculations, SplitRate, SplitRateBreakdown } from '../types/calculations';

/**
 * Zentrale Berechnung-Engine für alle Formeln
 * Phase 3-4: Nebenrechnungen & Splitsatz
 */

export class CalculationEngine {
  /**
   * SHEET 2: Nebenrechnungen
   * Berechnet alle automatisierten Kostenkomponenten basierend auf Fahrzeugdaten
   */

  static calculateSupplementary(vehicle: VehicleData, annualKM: number = 72000): SupplementaryCalculations {
    return {
      // Treibstoffkosten
      fuelCostsPer100Km: vehicle.fuelConsumption * vehicle.fuelPrice,
      fuelCostsPerKm: (vehicle.fuelConsumption * vehicle.fuelPrice) / 100,
      annualFuelCosts: (annualKM / 100) * vehicle.fuelConsumption * vehicle.fuelPrice,

      // Öl und Schmierstoff
      oilCostsPer100Km: vehicle.oilConsumption * vehicle.oilPrice,
      oilCostsPerKm: (vehicle.oilConsumption * vehicle.oilPrice) / 100,
      annualOilCosts: (annualKM / 100) * vehicle.oilConsumption * vehicle.oilPrice,

      // Reifen
      frontTireCostPerKm: vehicle.frontTireCost / vehicle.frontTireLife,
      rearTireCostPerKm: (vehicle.rearTireCost + vehicle.tireRenewalCost) / vehicle.rearTireLife,
      totalTireCostPerKm: vehicle.frontTireCost / vehicle.frontTireLife + (vehicle.rearTireCost + vehicle.tireRenewalCost) / vehicle.rearTireLife,
      annualTireCosts: (vehicle.frontTireCost / vehicle.frontTireLife + (vehicle.rearTireCost + vehicle.tireRenewalCost) / vehicle.rearTireLife) * annualKM,

      // Reparaturen
      repairCostsPerKm: vehicle.annualRepairCosts / annualKM,
      annualRepairCosts: vehicle.annualRepairCosts,

      // Abschreibung
      depreciationPerYear: vehicle.bookValue / vehicle.depreciationYears,
      depreciationPerKm: (vehicle.bookValue / vehicle.depreciationYears) / annualKM,

      // Steuern
      annualCarTax: vehicle.carTax,
      annualRoadTax: vehicle.roadTax,

      // Versicherung
      annualInsuranceCosts: vehicle.liabilityInsurance + vehicle.comprehensiveInsurance + vehicle.otherInsurance,
      insuranceCostPerKm: (vehicle.liabilityInsurance + vehicle.comprehensiveInsurance + vehicle.otherInsurance) / annualKM,
    };
  }

  /**
   * SHEET 3: Splitsatz
   * Teilt Gesamtkosten auf pro KM und pro Stunde
   */

  static calculateSplitRate(
    supplementary: SupplementaryCalculations,
    personalCostsAnnual: number = 124964,
    adminCostsAnnual: number = 11625,
    workingDaysPerYear: number = 220,
    workingHoursPerDay: number = 8,
    averageSpeedKmPerHour: number = 80
  ): SplitRate {
    // Gesamtkosten pro Jahr
    const totalAnnualCosts =
      supplementary.annualFuelCosts +
      supplementary.annualOilCosts +
      supplementary.annualTireCosts +
      supplementary.annualRepairCosts +
      supplementary.depreciationPerYear +
      supplementary.annualCarTax +
      supplementary.annualRoadTax +
      supplementary.annualInsuranceCosts +
      personalCostsAnnual +
      adminCostsAnnual;

    // Kosten pro Stunde
    const totalWorkingHours = workingDaysPerYear * workingHoursPerDay;
    const costPerHour = totalAnnualCosts / totalWorkingHours;

    // Kosten pro KM
    const totalAnnualKM = totalWorkingHours * averageSpeedKmPerHour;
    const costPerKM = totalAnnualCosts / totalAnnualKM;

    // Mit MwSt (19%)
    const vat = 0.19;
    const costPerKMWithVAT = costPerKM * (1 + vat);
    const costPerHourWithVAT = costPerHour * (1 + vat);
    const totalAnnualWithVAT = totalAnnualCosts * (1 + vat);

    // Breakdown
    const breakdown: SplitRateBreakdown[] = [
      {
        costsType: 'Treibstoff',
        annualCosts: supplementary.annualFuelCosts,
        percentage: (supplementary.annualFuelCosts / totalAnnualCosts) * 100,
        costPerKM: supplementary.fuelCostsPerKm,
        costPerHour: (supplementary.annualFuelCosts / totalWorkingHours),
      },
      {
        costsType: 'Öl & Schmierstoff',
        annualCosts: supplementary.annualOilCosts,
        percentage: (supplementary.annualOilCosts / totalAnnualCosts) * 100,
        costPerKM: supplementary.oilCostsPerKm,
        costPerHour: (supplementary.annualOilCosts / totalWorkingHours),
      },
      {
        costsType: 'Reifen',
        annualCosts: supplementary.annualTireCosts,
        percentage: (supplementary.annualTireCosts / totalAnnualCosts) * 100,
        costPerKM: supplementary.totalTireCostPerKm,
        costPerHour: (supplementary.annualTireCosts / totalWorkingHours),
      },
      {
        costsType: 'Reparaturen',
        annualCosts: supplementary.annualRepairCosts,
        percentage: (supplementary.annualRepairCosts / totalAnnualCosts) * 100,
        costPerKM: supplementary.repairCostsPerKm,
        costPerHour: (supplementary.annualRepairCosts / totalWorkingHours),
      },
      {
        costsType: 'Abschreibung',
        annualCosts: supplementary.depreciationPerYear,
        percentage: (supplementary.depreciationPerYear / totalAnnualCosts) * 100,
        costPerKM: supplementary.depreciationPerKm,
        costPerHour: (supplementary.depreciationPerYear / totalWorkingHours),
      },
      {
        costsType: 'Steuern & Versicherung',
        annualCosts: supplementary.annualCarTax + supplementary.annualRoadTax + supplementary.annualInsuranceCosts,
        percentage: ((supplementary.annualCarTax + supplementary.annualRoadTax + supplementary.annualInsuranceCosts) / totalAnnualCosts) * 100,
        costPerKM: (supplementary.annualCarTax + supplementary.annualRoadTax + supplementary.annualInsuranceCosts) / totalAnnualKM,
        costPerHour: (supplementary.annualCarTax + supplementary.annualRoadTax + supplementary.annualInsuranceCosts) / totalWorkingHours,
      },
      {
        costsType: 'Personal & Admin',
        annualCosts: personalCostsAnnual + adminCostsAnnual,
        percentage: ((personalCostsAnnual + adminCostsAnnual) / totalAnnualCosts) * 100,
        costPerKM: (personalCostsAnnual + adminCostsAnnual) / totalAnnualKM,
        costPerHour: (personalCostsAnnual + adminCostsAnnual) / totalWorkingHours,
      },
    ];

    return {
      costPerKM: Math.round(costPerKM * 10000) / 10000,
      costPerHour: Math.round(costPerHour * 10000) / 10000,
      costPerDay: Math.round(costPerHour * workingHoursPerDay * 10000) / 10000,
      totalAnnualCosts: Math.round(totalAnnualCosts * 100) / 100,
      costPerKMWithVAT: Math.round(costPerKMWithVAT * 10000) / 10000,
      costPerHourWithVAT: Math.round(costPerHourWithVAT * 10000) / 10000,
      totalAnnualWithVAT: Math.round(totalAnnualWithVAT * 100) / 100,
      breakdown,
    };
  }

  /**
   * SHEET 4: Auftragskalkulation
   * Berechnet Kosten und Gewinn für einzelne Aufträge
   */

  static calculateOrderCosts(
    distance: number,
    duration: number, // in Stunden
    costPerKM: number,
    costPerHour: number,
    additionalCosts: number = 0
  ) {
    const kmCosts = Math.round(distance * costPerKM * 100) / 100;
    const hourCosts = Math.round(duration * costPerHour * 100) / 100;
    const totalDirectCosts = Math.round((kmCosts + hourCosts) * 100) / 100;
    const totalCosts = Math.round((totalDirectCosts + additionalCosts) * 100) / 100;

    return {
      kmCosts,
      hourCosts,
      totalDirectCosts,
      additionalCosts,
      totalCosts,
    };
  }

  static calculateOrderProfit(
    revenue: number,
    directCosts: number,
    personalCostsForOrder: number = 0,
    adminCostsForOrder: number = 0
  ) {
    const contributionI = Math.round((revenue - directCosts) * 100) / 100;
    const contributionII = Math.round((contributionI - personalCostsForOrder) * 100) / 100;
    const contributionIII = Math.round((contributionII - adminCostsForOrder) * 100) / 100;

    const profitMargin = revenue > 0 ? Math.round((contributionIII / revenue) * 10000) / 100 : 0;
    const isProfitable = contributionIII >= 0;

    return {
      contributionI,
      contributionII,
      contributionIII,
      profitMargin,
      isProfitable,
    };
  }

  static calculateBreakEven(
    fixedCosts: number,
    costPerKM: number,
    revenuePerKM: number
  ) {
    const marginPerKM = revenuePerKM - costPerKM;
    const breakEvenKM = marginPerKM > 0 ? fixedCosts / marginPerKM : Infinity;

    return {
      breakEvenKM: Math.round(breakEvenKM),
      breakEvenRevenue: Math.round(breakEvenKM * revenuePerKM * 100) / 100,
      marginPerKM: Math.round(marginPerKM * 10000) / 10000,
    };
  }
}
