import { useState } from 'react';
import { NumberInput } from '../inputs/NumberInput';
import { CurrencyInput } from '../inputs/CurrencyInput';
import { TextInput } from '../inputs/TextInput';
import { formatters } from '../../utils/formatters';

interface TransporterCost {
  id: string;
  registration: string;
  month: number;
  insurance: number;
  leasing: number;
  fuel: number;
  repairs: number;
  kilometers: number;
  daysInUse: number;
}

export const Sheet9KostenTransporter = () => {
  const [costs, setCosts] = useState<TransporterCost[]>([
    {
      id: '1',
      registration: 'DO 316 DI',
      month: 1,
      insurance: 100.00,
      leasing: 0.00,
      fuel: 450.00,
      repairs: 150.00,
      kilometers: 3200,
      daysInUse: 22,
    },
  ]);

  const [formData, setFormData] = useState({
    registration: '',
    month: 1,
    insurance: 0,
    leasing: 0,
    fuel: 0,
    repairs: 0,
    kilometers: 0,
    daysInUse: 0,
  });

  const handleAddCost = () => {
    if (!formData.registration || formData.kilometers <= 0 || formData.daysInUse <= 0) {
      alert('Bitte alle Pflichtfelder ausfüllen');
      return;
    }

    const newCost: TransporterCost = {
      id: Date.now().toString(),
      registration: formData.registration,
      month: formData.month,
      insurance: formData.insurance,
      leasing: formData.leasing,
      fuel: formData.fuel,
      repairs: formData.repairs,
      kilometers: formData.kilometers,
      daysInUse: formData.daysInUse,
    };

    setCosts([...costs, newCost]);
    setFormData({
      registration: '',
      month: 1,
      insurance: 0,
      leasing: 0,
      fuel: 0,
      repairs: 0,
      kilometers: 0,
      daysInUse: 0,
    });
  };

  const handleDelete = (id: string) => {
    setCosts(costs.filter((c) => c.id !== id));
  };

  const totalInsurance = costs.reduce((sum, c) => sum + c.insurance, 0);
  const totalLeasing = costs.reduce((sum, c) => sum + c.leasing, 0);
  const totalFuel = costs.reduce((sum, c) => sum + c.fuel, 0);
  const totalRepairs = costs.reduce((sum, c) => sum + c.repairs, 0);
  const totalKilometers = costs.reduce((sum, c) => sum + c.kilometers, 0);
  const totalDaysInUse = costs.reduce((sum, c) => sum + c.daysInUse, 0);
  const totalCosts = totalInsurance + totalLeasing + totalFuel + totalRepairs;

  const costPerKM = totalKilometers > 0 ? totalCosts / totalKilometers : 0;
  const costPerDay = totalDaysInUse > 0 ? totalCosts / totalDaysInUse : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Kosten Transporter (Detail)</h2>

        {/* Input Form */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Kosteneintrag hinzufügen</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              label="Kennzeichen"
              value={formData.registration}
              onChange={(v) => setFormData({ ...formData, registration: v })}
              placeholder="z.B. DO 316 DI"
            />

            <NumberInput
              label="Monat"
              value={formData.month}
              onChange={(v) => setFormData({ ...formData, month: v })}
              unit="Monat"
              decimals={0}
              min={1}
              max={12}
            />

            <CurrencyInput
              label="Versicherung"
              value={formData.insurance}
              onChange={(v) => setFormData({ ...formData, insurance: v })}
            />

            <CurrencyInput
              label="Leasing"
              value={formData.leasing}
              onChange={(v) => setFormData({ ...formData, leasing: v })}
            />

            <CurrencyInput
              label="Treibstoff"
              value={formData.fuel}
              onChange={(v) => setFormData({ ...formData, fuel: v })}
            />

            <CurrencyInput
              label="Reparaturen"
              value={formData.repairs}
              onChange={(v) => setFormData({ ...formData, repairs: v })}
            />

            <NumberInput
              label="Kilometer"
              value={formData.kilometers}
              onChange={(v) => setFormData({ ...formData, kilometers: v })}
              unit="km"
              decimals={0}
              min={0}
            />

            <NumberInput
              label="Tage im Einsatz"
              value={formData.daysInUse}
              onChange={(v) => setFormData({ ...formData, daysInUse: v })}
              unit="Tage"
              decimals={0}
              min={1}
            />
          </div>

          <button
            onClick={handleAddCost}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Kosteneintrag hinzufügen
          </button>
        </div>

        {/* Costs List */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Kennz.</th>
                <th className="px-4 py-3 text-right font-bold">Monat</th>
                <th className="px-4 py-3 text-right font-bold">Vers.</th>
                <th className="px-4 py-3 text-right font-bold">Leasing</th>
                <th className="px-4 py-3 text-right font-bold">Kraftstoff</th>
                <th className="px-4 py-3 text-right font-bold">Rep.</th>
                <th className="px-4 py-3 text-right font-bold">KM</th>
                <th className="px-4 py-3 text-right font-bold">Tage</th>
                <th className="px-4 py-3 text-right font-bold">Summe</th>
                <th className="px-4 py-3 text-center font-bold">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((cost, idx) => {
                const costSum = cost.insurance + cost.leasing + cost.fuel + cost.repairs;
                return (
                  <tr
                    key={cost.id}
                    className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="px-4 py-3 font-semibold">{cost.registration}</td>
                    <td className="px-4 py-3 text-right">{cost.month}</td>
                    <td className="px-4 py-3 text-right text-xs">
                      {formatters.currency(cost.insurance)}
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      {formatters.currency(cost.leasing)}
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      {formatters.currency(cost.fuel)}
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      {formatters.currency(cost.repairs)}
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      {formatters.number(cost.kilometers, 0)}
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      {cost.daysInUse}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600 text-xs">
                      {formatters.currency(costSum)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(cost.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cost Breakdown */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Kostenaufschlüsselung</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded border border-red-300">
              <p className="text-sm text-gray-600 mb-1">Versicherung Gesamt</p>
              <p className="text-2xl font-bold text-red-600">
                {formatters.currency(totalInsurance)}
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-300">
              <p className="text-sm text-gray-600 mb-1">Leasing Gesamt</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatters.currency(totalLeasing)}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded border border-blue-300">
              <p className="text-sm text-gray-600 mb-1">Treibstoff Gesamt</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatters.currency(totalFuel)}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded border border-orange-300">
              <p className="text-sm text-gray-600 mb-1">Reparaturen Gesamt</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatters.currency(totalRepairs)}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Einträge</p>
              <p className="text-3xl font-bold text-indigo-600">{costs.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Gesamtkosten</p>
              <p className="text-3xl font-bold text-indigo-600">
                {formatters.currency(totalCosts)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">€/KM · €/Tag</p>
              <p className="text-3xl font-bold text-indigo-600">
                {formatters.currency(costPerKM)} · {formatters.currency(costPerDay)}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded">
              <p className="text-xs text-gray-600">Gesamt Kilometer</p>
              <p className="text-xl font-bold text-indigo-600">
                {formatters.number(totalKilometers, 0)}
              </p>
            </div>

            <div className="bg-white p-3 rounded">
              <p className="text-xs text-gray-600">Gesamt Einsatztage</p>
              <p className="text-xl font-bold text-indigo-600">
                {totalDaysInUse}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
