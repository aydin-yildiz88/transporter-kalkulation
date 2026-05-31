import { useState } from 'react';
import { NumberInput } from '../inputs/NumberInput';
import { CurrencyInput } from '../inputs/CurrencyInput';
import { TextInput } from '../inputs/TextInput';
import { formatters } from '../../utils/formatters';

interface VehicleCost {
  id: string;
  vehicleRegistration: string;
  insurance: number;
  leasing: number;
  maintenanceContract: number;
  avgKMPerDay: number;
}

export const Sheet7KFZKosten = () => {
  const [vehicleCosts, setVehicleCosts] = useState<VehicleCost[]>([
    {
      id: '1',
      vehicleRegistration: 'DO 316 DI',
      insurance: 1200.00,
      leasing: 0.00,
      maintenanceContract: 500.00,
      avgKMPerDay: 100,
    },
  ]);

  const [formData, setFormData] = useState({
    vehicleRegistration: '',
    insurance: 0,
    leasing: 0,
    maintenanceContract: 0,
    avgKMPerDay: 0,
  });

  const handleAddVehicleCost = () => {
    if (!formData.vehicleRegistration) {
      alert('Bitte Kennzeichen eingeben');
      return;
    }

    if (vehicleCosts.some((v) => v.vehicleRegistration === formData.vehicleRegistration)) {
      alert('Dieses Kennzeichen existiert bereits');
      return;
    }

    const newVehicleCost: VehicleCost = {
      id: Date.now().toString(),
      vehicleRegistration: formData.vehicleRegistration,
      insurance: formData.insurance,
      leasing: formData.leasing,
      maintenanceContract: formData.maintenanceContract,
      avgKMPerDay: formData.avgKMPerDay,
    };

    setVehicleCosts([...vehicleCosts, newVehicleCost]);
    setFormData({
      vehicleRegistration: '',
      insurance: 0,
      leasing: 0,
      maintenanceContract: 0,
      avgKMPerDay: 0,
    });
  };

  const handleDelete = (id: string) => {
    setVehicleCosts(vehicleCosts.filter((v) => v.id !== id));
  };

  const totalInsurance = vehicleCosts.reduce((sum, v) => sum + v.insurance, 0);
  const totalLeasing = vehicleCosts.reduce((sum, v) => sum + v.leasing, 0);
  const totalMaintenanceContract = vehicleCosts.reduce((sum, v) => sum + v.maintenanceContract, 0);
  const totalFixedCosts = totalInsurance + totalLeasing + totalMaintenanceContract;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">KFZ-Kosten</h2>

        {/* Input Form */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Fahrzeugkosten hinzufügen</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              label="Kennzeichen"
              value={formData.vehicleRegistration}
              onChange={(v) => setFormData({ ...formData, vehicleRegistration: v })}
              placeholder="z.B. DO 316 DI"
            />

            <CurrencyInput
              label="Versicherung/Jahr"
              value={formData.insurance}
              onChange={(v) => setFormData({ ...formData, insurance: v })}
            />

            <CurrencyInput
              label="Leasing/Jahr"
              value={formData.leasing}
              onChange={(v) => setFormData({ ...formData, leasing: v })}
            />

            <CurrencyInput
              label="Wartungsvertrag/Jahr"
              value={formData.maintenanceContract}
              onChange={(v) => setFormData({ ...formData, maintenanceContract: v })}
            />

            <NumberInput
              label="Ø KM pro Tag"
              value={formData.avgKMPerDay}
              onChange={(v) => setFormData({ ...formData, avgKMPerDay: v })}
              unit="km"
              decimals={1}
              min={0}
            />
          </div>

          <button
            onClick={handleAddVehicleCost}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Fahrzeug hinzufügen
          </button>
        </div>

        {/* Vehicle Costs List */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left font-bold">Kennzeichen</th>
                <th className="px-6 py-3 text-right font-bold">Versicherung</th>
                <th className="px-6 py-3 text-right font-bold">Leasing</th>
                <th className="px-6 py-3 text-right font-bold">Wartung</th>
                <th className="px-6 py-3 text-right font-bold">Ø KM/Tag</th>
                <th className="px-6 py-3 text-right font-bold">Gesamt/Jahr</th>
                <th className="px-6 py-3 text-center font-bold">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {vehicleCosts.map((vc, idx) => {
                const total = vc.insurance + vc.leasing + vc.maintenanceContract;
                return (
                  <tr
                    key={vc.id}
                    className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="px-6 py-3 font-semibold">{vc.vehicleRegistration}</td>
                    <td className="px-6 py-3 text-right">
                      {formatters.currency(vc.insurance)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {formatters.currency(vc.leasing)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {formatters.currency(vc.maintenanceContract)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {formatters.number(vc.avgKMPerDay, 1)}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-blue-600">
                      {formatters.currency(total)}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDelete(vc.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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

        {/* Summary */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Fahrzeuge</p>
              <p className="text-3xl font-bold text-purple-600">
                {vehicleCosts.length}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Versicherung/Jahr</p>
              <p className="text-3xl font-bold text-purple-600">
                {formatters.currency(totalInsurance)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Leasing/Jahr</p>
              <p className="text-3xl font-bold text-purple-600">
                {formatters.currency(totalLeasing)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Gesamt Fixkosten/Jahr</p>
              <p className="text-3xl font-bold text-purple-600">
                {formatters.currency(totalFixedCosts)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
