import { useEffect } from 'react';
import { useVehicleStore } from '../store/vehicleStore';
import { useCalculationStore } from '../store/calculationStore';

/**
 * Hook für automatische Berechnungen
 * Wird in Phase 3 vollständig implementiert
 */

export const useCalculations = () => {
  const activeVehicle = useVehicleStore((state) => state.getActiveVehicle());
  const { summary, setSummary, recalculate } = useCalculationStore();

  useEffect(() => {
    if (!activeVehicle) return;

    // TODO: Implement calculation engine (Phase 3)
    // - Sheet 2: Nebenrechnungen berechnen
    // - Sheet 3: Splitsatz berechnen
    // - Sheet 4: Auftragskalkulation vorbereiten

    console.log('Calculations needed for vehicle:', activeVehicle.name);
  }, [activeVehicle]);

  return {
    summary,
    activeVehicle,
    recalculate,
  };
};

/**
 * Hook für Dependency Tracking
 * Wann sollen Berechnungen neu ausgeführt werden?
 */
export const useDependencyTracking = () => {
  const vehicles = useVehicleStore((state) => state.vehicles);
  const costs = useCalculationStore((state) => state.costs);
  const { recalculate } = useCalculationStore();

  // Wenn Fahrzeugdaten ändern -> Sheet 2 neu berechnen
  useEffect(() => {
    recalculate();
  }, [vehicles, recalculate]);

  // Wenn Kosten ändern -> Sheet 3 neu berechnen
  useEffect(() => {
    recalculate();
  }, [costs, recalculate]);
};
