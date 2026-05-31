import { useState, useEffect } from 'react';
import { VehicleData } from '../../types/vehicle';
import { CurrencyInput } from '../inputs/CurrencyInput';
import { NumberInput } from '../inputs/NumberInput';
import { TextInput } from '../inputs/TextInput';
import { SelectInput } from '../inputs/SelectInput';
import { useVehicleStore } from '../../store/vehicleStore';
import { storageService } from '../../services/storage';

interface VehicleDataFormProps {
  vehicleId?: string;
  onClose?: () => void;
  onSave?: () => void;
}

export const VehicleDataForm = ({
  vehicleId,
  onClose,
  onSave,
}: VehicleDataFormProps) => {
  const addVehicle = useVehicleStore((state) => state.addVehicle);
  const updateVehicle = useVehicleStore((state) => state.updateVehicle);
  const getVehicle = useVehicleStore((state) => state.getActiveVehicle());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<VehicleData>>({
    name: '',
    mark: '',
    registration: '',
    hzg: 3.5,
    yearOfConstruction: new Date().getFullYear(),
    validUntil: new Date().getFullYear() + 1,
    euroClass: 'EURO6',
    fuelConsumption: 8,
    fuelPrice: 1.5,
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
    bookValue: 70000,
    residualValue: 7000,
    depreciationYears: 5,
    depreciationA: 50,
    depreciationB: 50,
  });

  // Load existing vehicle if editing
  useEffect(() => {
    if (vehicleId) {
      const vehicle = getVehicle();
      if (vehicle) {
        setFormData(vehicle);
      }
    }
  }, [vehicleId, getVehicle]);

  const handleChange = (field: keyof VehicleData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.name) {
        throw new Error('Fahrzeugname ist erforderlich');
      }
      if (!formData.registration) {
        throw new Error('Kennzeichen ist erforderlich');
      }

      const vehicle: VehicleData = {
        id: vehicleId || Date.now().toString(),
        name: formData.name!,
        mark: formData.mark || '',
        registration: formData.registration!,
        hzg: formData.hzg || 3.5,
        yearOfConstruction: formData.yearOfConstruction || new Date().getFullYear(),
        validUntil: formData.validUntil || new Date().getFullYear() + 1,
        euroClass: formData.euroClass || 'EURO6',
        fuelConsumption: formData.fuelConsumption || 8,
        fuelPrice: formData.fuelPrice || 1.5,
        oilConsumption: formData.oilConsumption || 0,
        oilPrice: formData.oilPrice || 0,
        frontTireCost: formData.frontTireCost || 200,
        rearTireCost: formData.rearTireCost || 400,
        tireRenewalCost: formData.tireRenewalCost || 0,
        frontTireLife: formData.frontTireLife || 60000,
        rearTireLife: formData.rearTireLife || 80000,
        annualRepairCosts: formData.annualRepairCosts || 8000,
        carTax: formData.carTax || 0,
        roadTax: formData.roadTax || 0,
        liabilityInsurance: formData.liabilityInsurance || 5400,
        comprehensiveInsurance: formData.comprehensiveInsurance || 0,
        otherInsurance: formData.otherInsurance || 600,
        acquisitionCost: formData.acquisitionCost || 78000,
        bookValue: formData.bookValue || 70000,
        residualValue: formData.residualValue || 7000,
        depreciationYears: formData.depreciationYears || 5,
        depreciationA: formData.depreciationA || 50,
        depreciationB: formData.depreciationB || 50,
      };

      // Save to database
      await storageService.saveVehicle(vehicle);

      // Update store
      if (vehicleId) {
        updateVehicle(vehicleId, vehicle);
      } else {
        addVehicle(vehicle);
      }

      onSave?.();
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const euroClasses = [
    { value: 'EURO1', label: 'EURO 1' },
    { value: 'EURO2', label: 'EURO 2' },
    { value: 'EURO3', label: 'EURO 3' },
    { value: 'EURO4', label: 'EURO 4' },
    { value: 'EURO5', label: 'EURO 5' },
    { value: 'EURO6', label: 'EURO 6' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Fahrzeuginformationen */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Fahrzeuginformationen</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Fahrzeugname / Kennzeichen"
            value={formData.name || ''}
            onChange={(v) => handleChange('name', v)}
            placeholder="z.B. LKW-001, DO 316 DI"
            required
            hint="Eindeutige Bezeichnung für dieses Fahrzeug"
          />

          <TextInput
            label="Marke / Type"
            value={formData.mark || ''}
            onChange={(v) => handleChange('mark', v)}
            placeholder="z.B. Mercedes Sprinter"
          />

          <TextInput
            label="Kennzeichen"
            value={formData.registration || ''}
            onChange={(v) => handleChange('registration', v)}
            placeholder="z.B. DO 316 DI"
            pattern="^[A-Z]{1,3}-[A-Z]{1,2}-[0-9]{1,4}$"
            required
          />

          <NumberInput
            label="HZG (Höchstzulässiges Gesamtgewicht)"
            value={formData.hzg || 3.5}
            onChange={(v) => handleChange('hzg', v)}
            unit="t"
            min={1}
            max={40}
          />

          <NumberInput
            label="Baujahr"
            value={formData.yearOfConstruction || 2007}
            onChange={(v) => handleChange('yearOfConstruction', v)}
            unit="Jahr"
            decimals={0}
            min={1990}
            max={new Date().getFullYear()}
          />

          <NumberInput
            label="Gültig bis"
            value={formData.validUntil || 2025}
            onChange={(v) => handleChange('validUntil', v)}
            unit="Jahr"
            decimals={0}
            min={new Date().getFullYear()}
            max={2100}
          />

          <SelectInput
            label="EURO-Klasse"
            value={formData.euroClass || 'EURO6'}
            onChange={(v) => handleChange('euroClass', v)}
            options={euroClasses}
          />
        </div>
      </div>

      {/* Treibstoff */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Treibstoff</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput
            label="Verbrauch"
            value={formData.fuelConsumption || 8}
            onChange={(v) => handleChange('fuelConsumption', v)}
            unit="L/100km"
            decimals={1}
            min={3}
            max={25}
          />

          <CurrencyInput
            label="Treibstoffpreis"
            value={formData.fuelPrice || 1.5}
            onChange={(v) => handleChange('fuelPrice', v)}
            min={0.5}
            max={5}
          />
        </div>
      </div>

      {/* Öl und Schmierstoff */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Öl & Schmierstoff</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput
            label="Verbrauch"
            value={formData.oilConsumption || 0}
            onChange={(v) => handleChange('oilConsumption', v)}
            unit="L/100km"
            decimals={2}
          />

          <CurrencyInput
            label="Ölpreis"
            value={formData.oilPrice || 0}
            onChange={(v) => handleChange('oilPrice', v)}
          />
        </div>
      </div>

      {/* Bereifung */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Bereifung</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput
            label="Reifen Vorderachse"
            value={formData.frontTireCost || 200}
            onChange={(v) => handleChange('frontTireCost', v)}
          />

          <CurrencyInput
            label="Reifen Hinterachse"
            value={formData.rearTireCost || 400}
            onChange={(v) => handleChange('rearTireCost', v)}
          />

          <CurrencyInput
            label="Runderneuerungskosten"
            value={formData.tireRenewalCost || 0}
            onChange={(v) => handleChange('tireRenewalCost', v)}
          />

          <NumberInput
            label="Laufleistung VA"
            value={formData.frontTireLife || 60000}
            onChange={(v) => handleChange('frontTireLife', v)}
            unit="km"
            decimals={0}
          />

          <NumberInput
            label="Laufleistung HA"
            value={formData.rearTireLife || 80000}
            onChange={(v) => handleChange('rearTireLife', v)}
            unit="km"
            decimals={0}
          />
        </div>
      </div>

      {/* Reparatur */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Reparaturen</h3>

        <CurrencyInput
          label="Reparaturkosten pro Jahr"
          value={formData.annualRepairCosts || 8000}
          onChange={(v) => handleChange('annualRepairCosts', v)}
        />
      </div>

      {/* Steuern & Versicherung */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Steuern & Versicherung</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput
            label="KFZ-Steuer / Jahr"
            value={formData.carTax || 0}
            onChange={(v) => handleChange('carTax', v)}
          />

          <CurrencyInput
            label="Straßenbenützungsabgabe / Jahr"
            value={formData.roadTax || 0}
            onChange={(v) => handleChange('roadTax', v)}
          />

          <CurrencyInput
            label="Haftpflichtversicherung / Jahr"
            value={formData.liabilityInsurance || 5400}
            onChange={(v) => handleChange('liabilityInsurance', v)}
          />

          <CurrencyInput
            label="Vollkaskoversicherung / Jahr"
            value={formData.comprehensiveInsurance || 0}
            onChange={(v) => handleChange('comprehensiveInsurance', v)}
          />

          <CurrencyInput
            label="Sonstige Versicherung / Jahr"
            value={formData.otherInsurance || 600}
            onChange={(v) => handleChange('otherInsurance', v)}
          />
        </div>
      </div>

      {/* Abschreibung & Leasing */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Abschreibung & Leasing</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput
            label="Anschaffungskosten"
            value={formData.acquisitionCost || 78000}
            onChange={(v) => handleChange('acquisitionCost', v)}
          />

          <CurrencyInput
            label="Buchwert"
            value={formData.bookValue || 70000}
            onChange={(v) => handleChange('bookValue', v)}
          />

          <CurrencyInput
            label="Restwert"
            value={formData.residualValue || 7000}
            onChange={(v) => handleChange('residualValue', v)}
          />

          <NumberInput
            label="Nutzungsdauer"
            value={formData.depreciationYears || 5}
            onChange={(v) => handleChange('depreciationYears', v)}
            unit="Jahre"
            decimals={0}
            min={1}
            max={20}
          />

          <NumberInput
            label="Abschreibung A"
            value={formData.depreciationA || 50}
            onChange={(v) => handleChange('depreciationA', v)}
            unit="%"
            min={0}
            max={100}
          />

          <NumberInput
            label="Abschreibung B"
            value={formData.depreciationB || 50}
            onChange={(v) => handleChange('depreciationB', v)}
            unit="%"
            min={0}
            max={100}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Speichern...' : 'Speichern'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
};
