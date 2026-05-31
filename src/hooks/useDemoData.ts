import { useEffect } from 'react';
import { useVehicleStore } from '../store/vehicleStore';
import { storageService } from '../services/storage';
import { VehicleData } from '../types/vehicle';

/**
 * Hook zum Laden von Demo-Daten beim ersten Start
 * Kann deaktiviert werden, indem man die Funktion einfach nicht aufruft
 */

const DEMO_VEHICLES: VehicleData[] = [
  {
    id: 'demo-1',
    name: 'DO 316 DI',
    mark: 'Mercedes Sprinter',
    registration: 'DO-316-DI',
    hzg: 3.5,
    yearOfConstruction: 2015,
    validUntil: 2026,
    euroClass: 'EURO5',
    fuelConsumption: 8,
    fuelPrice: 1.8,
    oilConsumption: 0,
    oilPrice: 0,
    frontTireCost: 200,
    rearTireCost: 400,
    tireRenewalCost: 0,
    frontTireLife: 60000,
    rearTireLife: 80000,
    annualRepairCosts: 8000,
    carTax: 0,
    roadTax: 0,
    liabilityInsurance: 5400,
    comprehensiveInsurance: 0,
    otherInsurance: 600,
    acquisitionCost: 78000,
    bookValue: 45000,
    residualValue: 7000,
    depreciationYears: 5,
    depreciationA: 50,
    depreciationB: 50,
    createdAt: new Date(),
  },
  {
    id: 'demo-2',
    name: 'DO 895 DP',
    mark: 'MAN TGX',
    registration: 'DO-895-DP',
    hzg: 18,
    yearOfConstruction: 2018,
    validUntil: 2026,
    euroClass: 'EURO6',
    fuelConsumption: 22,
    fuelPrice: 1.8,
    oilConsumption: 0.1,
    oilPrice: 5,
    frontTireCost: 500,
    rearTireCost: 1200,
    tireRenewalCost: 200,
    frontTireLife: 100000,
    rearTireLife: 150000,
    annualRepairCosts: 12000,
    carTax: 0,
    roadTax: 0,
    liabilityInsurance: 8500,
    comprehensiveInsurance: 2000,
    otherInsurance: 1200,
    acquisitionCost: 250000,
    bookValue: 180000,
    residualValue: 25000,
    depreciationYears: 8,
    depreciationA: 40,
    depreciationB: 60,
    createdAt: new Date(),
  },
];

export const useDemoData = (enabled: boolean = false) => {
  useEffect(() => {
    if (!enabled) return;

    const initializeDemoData = async () => {
      try {
        const existingVehicles = await storageService.getAllVehicles();

        // Nur Demo-Daten laden, wenn noch keine Fahrzeuge vorhanden sind
        if (existingVehicles.length === 0) {
          console.log('Laden von Demo-Daten...');

          for (const vehicle of DEMO_VEHICLES) {
            await storageService.saveVehicle(vehicle);
          }

          const vehicles = await storageService.getAllVehicles();
          useVehicleStore.setState({
            vehicles,
            activeVehicleId: vehicles[0]?.id || null,
          });

          if (vehicles.length > 0) {
            storageService.setActiveVehicleId(vehicles[0].id);
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden der Demo-Daten:', error);
      }
    };

    initializeDemoData();
  }, [enabled]);
};
