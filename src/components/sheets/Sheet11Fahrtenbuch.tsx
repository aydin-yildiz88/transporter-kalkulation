import { useState } from 'react';
import { formatters } from '../../utils/formatters';
import { TextInput } from '../inputs/TextInput';
import { NumberInput } from '../inputs/NumberInput';

interface MileageEntry {
  id: string;
  date: string;
  locationFrom: string;
  locationTo: string;
  activity: string;
  kmStart: number;
  kmEnd: number;
  timeStart: string;
  timeEnd: string;
}

export const Sheet11Fahrtenbuch = () => {
  const [entries, setEntries] = useState<MileageEntry[]>([
    {
      id: '1',
      date: '2025-01-15',
      locationFrom: 'Büro',
      locationTo: 'Kunde Berlin',
      activity: 'Warenndelivery',
      kmStart: 10000,
      kmEnd: 10150,
      timeStart: '08:00',
      timeEnd: '10:30',
    },
  ]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    locationFrom: '',
    locationTo: '',
    activity: '',
    kmStart: 0,
    kmEnd: 0,
    timeStart: '',
    timeEnd: '',
  });

  const handleAddEntry = () => {
    if (
      !formData.date ||
      !formData.locationFrom ||
      !formData.activity ||
      formData.kmStart === 0 ||
      formData.kmEnd === 0
    ) {
      alert('Bitte alle Pflichtfelder ausfüllen');
      return;
    }

    if (formData.kmEnd <= formData.kmStart) {
      alert('Kilometerstand Ende muss größer als Beginn sein');
      return;
    }

    const newEntry: MileageEntry = {
      id: Date.now().toString(),
      date: formData.date,
      locationFrom: formData.locationFrom,
      locationTo: formData.locationTo || formData.locationFrom,
      activity: formData.activity,
      kmStart: formData.kmStart,
      kmEnd: formData.kmEnd,
      timeStart: formData.timeStart,
      timeEnd: formData.timeEnd,
    };

    setEntries([...entries, newEntry]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      locationFrom: '',
      locationTo: '',
      activity: '',
      kmStart: 0,
      kmEnd: 0,
      timeStart: '',
      timeEnd: '',
    });
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;
    return Math.max(0, (endMins - startMins) / 60);
  };

  const totalKilometers = entries.reduce((sum, e) => sum + (e.kmEnd - e.kmStart), 0);
  const totalDrivingHours = entries.reduce((sum, e) => sum + calculateDuration(e.timeStart, e.timeEnd), 0);
  const avgSpeed = totalDrivingHours > 0 ? totalKilometers / totalDrivingHours : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Fahrtenbuch</h2>

        {/* Input Form */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Fahrteneintrag hinzufügen</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tag *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <TextInput
              label="Ort von *"
              value={formData.locationFrom}
              onChange={(v) => setFormData({ ...formData, locationFrom: v })}
              placeholder="z.B. Büro"
            />

            <TextInput
              label="Ort bis"
              value={formData.locationTo}
              onChange={(v) => setFormData({ ...formData, locationTo: v })}
              placeholder="z.B. Kunde Berlin"
            />

            <TextInput
              label="Tätigkeit *"
              value={formData.activity}
              onChange={(v) => setFormData({ ...formData, activity: v })}
              placeholder="z.B. Warenlieferung"
            />

            <NumberInput
              label="Kilometer Beginn *"
              value={formData.kmStart}
              onChange={(v) => setFormData({ ...formData, kmStart: v })}
              unit="km"
              decimals={0}
              min={0}
            />

            <NumberInput
              label="Kilometer Ende *"
              value={formData.kmEnd}
              onChange={(v) => setFormData({ ...formData, kmEnd: v })}
              unit="km"
              decimals={0}
              min={0}
            />

            <div>
              <label className="block text-sm font-semibold mb-2">Fahrtbeginn</label>
              <input
                type="time"
                value={formData.timeStart}
                onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Fahrtende</label>
              <input
                type="time"
                value={formData.timeEnd}
                onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <button
            onClick={handleAddEntry}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Fahrteneintrag hinzufügen
          </button>
        </div>

        {/* Mileage Entries List */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Tag</th>
                <th className="px-4 py-3 text-left font-bold">Route</th>
                <th className="px-4 py-3 text-left font-bold">Tätigkeit</th>
                <th className="px-4 py-3 text-right font-bold">KM Beginn</th>
                <th className="px-4 py-3 text-right font-bold">KM Ende</th>
                <th className="px-4 py-3 text-right font-bold">Differenz</th>
                <th className="px-4 py-3 text-right font-bold">Beginn</th>
                <th className="px-4 py-3 text-right font-bold">Ende</th>
                <th className="px-4 py-3 text-right font-bold">Dauer</th>
                <th className="px-4 py-3 text-center font-bold">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => {
                const kmDiff = entry.kmEnd - entry.kmStart;
                const duration = calculateDuration(entry.timeStart, entry.timeEnd);
                return (
                  <tr key={entry.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3">{entry.date}</td>
                    <td className="px-4 py-3 text-sm">
                      {entry.locationFrom} → {entry.locationTo}
                    </td>
                    <td className="px-4 py-3 text-sm">{entry.activity}</td>
                    <td className="px-4 py-3 text-right">
                      {formatters.number(entry.kmStart, 0)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatters.number(entry.kmEnd, 0)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      {formatters.number(kmDiff, 0)} km
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      {entry.timeStart || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      {entry.timeEnd || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      {duration > 0 ? `${formatters.number(duration, 1)}h` : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(entry.id)}
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

        {/* Summary */}
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Fahrteinträge</p>
              <p className="text-3xl font-bold text-orange-600">{entries.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Gesamtkilometer</p>
              <p className="text-3xl font-bold text-orange-600">
                {formatters.number(totalKilometers, 0)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Fahrtdauer</p>
              <p className="text-3xl font-bold text-orange-600">
                {formatters.number(totalDrivingHours, 2)}h
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Ø Geschwindigkeit</p>
              <p className="text-3xl font-bold text-orange-600">
                {formatters.number(avgSpeed, 1)} km/h
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
