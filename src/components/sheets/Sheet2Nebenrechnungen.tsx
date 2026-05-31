import { useMemo } from 'react';
import { useVehicleStore } from '../../store/vehicleStore';
import { useCalculationStore } from '../../store/calculationStore';
import { CalculationEngine } from '../../services/calculationEngine';
import { formatters } from '../../utils/formatters';
import { NumberInput } from '../inputs/NumberInput';
import { useState } from 'react';

export const Sheet2Nebenrechnungen = () => {
  const activeVehicle = useVehicleStore((state) => state.getActiveVehicle());
  const setSummary = useCalculationStore((state) => state.setSummary);

  const [annualKM, setAnnualKM] = useState(72000);

  const supplementary = useMemo(() => {
    if (!activeVehicle) return null;
    return CalculationEngine.calculateSupplementary(activeVehicle, annualKM);
  }, [activeVehicle, annualKM]);

  // Trigger store update when supplementary changes
  const splitRate = useMemo(() => {
    if (!supplementary) return null;
    const rate = CalculationEngine.calculateSplitRate(supplementary);

    if (activeVehicle) {
      setSummary({
        vehicle: {
          id: activeVehicle.id,
          name: activeVehicle.name,
          registration: activeVehicle.registration,
        },
        supplementary,
        splitRate: rate,
        orders: [],
        stats: {
          totalOrders: 0,
          profitableOrders: 0,
          averageProfit: 0,
          averageProfitMargin: 0,
          totalRevenue: 0,
          totalCosts: 0,
          totalProfit: 0,
        },
      });
    }

    return rate;
  }, [supplementary, activeVehicle, setSummary]);

  if (!activeVehicle || !supplementary || !splitRate) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">
          ⚠️ Bitte wähle zuerst ein Fahrzeug im Datenblatt aus.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Eingaben</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput
            label="Geschätzte Jahres-Kilometer"
            value={annualKM}
            onChange={setAnnualKM}
            unit="km"
            decimals={0}
            min={5000}
            max={500000}
            hint="Basis für Berechnung aller km-abhängigen Kosten"
          />
        </div>
      </div>

      {/* Treibstoff */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">⛽ Treibstoffkosten</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro 100 km</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatters.currency(supplementary.fuelCostsPer100Km)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro km</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatters.currency(supplementary.fuelCostsPerKm)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro Jahr</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatters.currency(supplementary.annualFuelCosts)}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded border-2 border-blue-300">
            <p className="text-sm text-gray-600 mb-1">% der Gesamtkosten</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatters.percent((supplementary.annualFuelCosts / (supplementary.annualFuelCosts + supplementary.annualOilCosts + supplementary.annualTireCosts + supplementary.annualRepairCosts + supplementary.depreciationPerYear + supplementary.annualInsuranceCosts)) * 100, 1)}
            </p>
          </div>
        </div>
      </div>

      {/* Öl und Schmierstoff */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">🛢️ Öl & Schmierstoff</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro 100 km</p>
            <p className="text-2xl font-bold">{formatters.currency(supplementary.oilCostsPer100Km)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro km</p>
            <p className="text-2xl font-bold">{formatters.currency(supplementary.oilCostsPerKm)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro Jahr</p>
            <p className="text-2xl font-bold">{formatters.currency(supplementary.annualOilCosts)}</p>
          </div>
        </div>
      </div>

      {/* Reifen */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">🛞 Reifenkosten</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Vorderachse pro km</p>
            <p className="text-2xl font-bold">{formatters.currency(supplementary.frontTireCostPerKm)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Hinterachse pro km</p>
            <p className="text-2xl font-bold">{formatters.currency(supplementary.rearTireCostPerKm)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Gesamt pro km</p>
            <p className="text-2xl font-bold text-orange-600">{formatters.currency(supplementary.totalTireCostPerKm)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro Jahr</p>
            <p className="text-2xl font-bold">{formatters.currency(supplementary.annualTireCosts)}</p>
          </div>
        </div>
      </div>

      {/* Reparaturen */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">🔧 Reparaturen</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro km</p>
            <p className="text-2xl font-bold">{formatters.currency(supplementary.repairCostsPerKm)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro Jahr</p>
            <p className="text-2xl font-bold">{formatters.currency(supplementary.annualRepairCosts)}</p>
          </div>
        </div>
      </div>

      {/* Abschreibung */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">📉 Abschreibung</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro km</p>
            <p className="text-2xl font-bold">{formatters.currency(supplementary.depreciationPerKm)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro Jahr</p>
            <p className="text-2xl font-bold">{formatters.currency(supplementary.depreciationPerYear)}</p>
          </div>
        </div>
      </div>

      {/* Steuern & Versicherung */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">🛡️ Steuern & Versicherung</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">KFZ-Steuer</p>
            <p className="text-xl font-bold">{formatters.currency(supplementary.annualCarTax)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Straßenbenutzung</p>
            <p className="text-xl font-bold">{formatters.currency(supplementary.annualRoadTax)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro km</p>
            <p className="text-2xl font-bold">{formatters.currency(supplementary.insuranceCostPerKm)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">pro Jahr</p>
            <p className="text-2xl font-bold">{formatters.currency(supplementary.annualInsuranceCosts)}</p>
          </div>
        </div>
      </div>

      {/* Split-Satz Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-2 border-blue-300">
        <h3 className="text-xl font-bold mb-4">🔀 Split-Satz (Übersicht)</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Kosten pro km</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatters.currency(splitRate.costPerKM)}
            </p>
          </div>
          <div className="bg-white p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Kosten pro Stunde</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatters.currency(splitRate.costPerHour)}
            </p>
          </div>
          <div className="bg-white p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Gesamtkosten/Jahr</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatters.currency(splitRate.totalAnnualCosts)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
