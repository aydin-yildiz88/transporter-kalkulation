import { useState } from 'react';
import { NumberInput } from '../inputs/NumberInput';
import { TextInput } from '../inputs/TextInput';
import { formatters } from '../../utils/formatters';

interface Tour {
  id: string;
  tourName: string;
  month: number;
  stops: number;
  packages: number;
}

export const Sheet8Stopp = () => {
  const [tours, setTours] = useState<Tour[]>([
    {
      id: '1',
      tourName: 'Route Berlin',
      month: 1,
      stops: 15,
      packages: 45,
    },
  ]);

  const [formData, setFormData] = useState({
    tourName: '',
    month: 1,
    stops: 0,
    packages: 0,
  });

  const handleAddTour = () => {
    if (!formData.tourName || formData.stops <= 0 || formData.packages <= 0) {
      alert('Bitte alle Felder mit gültigen Werten ausfüllen');
      return;
    }

    const newTour: Tour = {
      id: Date.now().toString(),
      tourName: formData.tourName,
      month: formData.month,
      stops: formData.stops,
      packages: formData.packages,
    };

    setTours([...tours, newTour]);
    setFormData({
      tourName: '',
      month: 1,
      stops: 0,
      packages: 0,
    });
  };

  const handleDelete = (id: string) => {
    setTours(tours.filter((t) => t.id !== id));
  };

  const totalStops = tours.reduce((sum, t) => sum + t.stops, 0);
  const totalPackages = tours.reduce((sum, t) => sum + t.packages, 0);
  const avgPackagesPerStop =
    totalStops > 0 ? totalPackages / totalStops : 0;

  const toursByMonth = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    count: tours.filter((t) => t.month === i + 1).length,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Tourenmanagement</h2>

        {/* Input Form */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Tour hinzufügen</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              label="Tourname"
              value={formData.tourName}
              onChange={(v) => setFormData({ ...formData, tourName: v })}
              placeholder="z.B. Route Berlin"
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

            <NumberInput
              label="Haltestellen"
              value={formData.stops}
              onChange={(v) => setFormData({ ...formData, stops: v })}
              unit="Stück"
              decimals={0}
              min={1}
            />

            <NumberInput
              label="Pakete"
              value={formData.packages}
              onChange={(v) => setFormData({ ...formData, packages: v })}
              unit="Stück"
              decimals={0}
              min={1}
            />
          </div>

          <button
            onClick={handleAddTour}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Tour hinzufügen
          </button>
        </div>

        {/* Tours List */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left font-bold">Tourname</th>
                <th className="px-6 py-3 text-right font-bold">Monat</th>
                <th className="px-6 py-3 text-right font-bold">Haltestellen</th>
                <th className="px-6 py-3 text-right font-bold">Pakete</th>
                <th className="px-6 py-3 text-right font-bold">Pakete/Halt.</th>
                <th className="px-6 py-3 text-center font-bold">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour, idx) => {
                const packagesPerStop =
                  tour.stops > 0 ? tour.packages / tour.stops : 0;
                return (
                  <tr
                    key={tour.id}
                    className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="px-6 py-3 font-semibold">{tour.tourName}</td>
                    <td className="px-6 py-3 text-right">{tour.month}</td>
                    <td className="px-6 py-3 text-right">{tour.stops}</td>
                    <td className="px-6 py-3 text-right font-bold text-blue-600">
                      {tour.packages}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {formatters.number(packagesPerStop, 1)}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDelete(tour.id)}
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

        {/* Tours by Month */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Touren pro Monat</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {toursByMonth.map((item) => (
              <div
                key={item.month}
                className={`p-3 rounded text-center ${
                  item.count > 0
                    ? 'bg-blue-50 border border-blue-300'
                    : 'bg-gray-50 border border-gray-300'
                }`}
              >
                <p className="text-xs text-gray-600">Monat {item.month}</p>
                <p
                  className={`text-2xl font-bold ${
                    item.count > 0 ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {item.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Touren</p>
              <p className="text-3xl font-bold text-orange-600">
                {tours.length}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Gesamthaltestellen</p>
              <p className="text-3xl font-bold text-orange-600">
                {totalStops}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Gesamtpakete / Ø pro Halt.</p>
              <p className="text-3xl font-bold text-orange-600">
                {totalPackages} / {formatters.number(avgPackagesPerStop, 1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
