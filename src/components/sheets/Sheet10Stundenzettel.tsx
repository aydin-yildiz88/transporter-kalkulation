import { useState } from 'react';
import { formatters } from '../../utils/formatters';
import { TextInput } from '../inputs/TextInput';
import { CurrencyInput } from '../inputs/CurrencyInput';

interface TimeEntry {
  id: string;
  date: string;
  locationFrom: string;
  locationTo: string;
  activity: string;
  timeStart: string;
  timeEnd: string;
  hourlyRate: number;
}

export const Sheet10Stundenzettel = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      date: '2025-01-15',
      locationFrom: 'Büro',
      locationTo: 'Baustelle A',
      activity: 'Fahrzeugvorbereitung',
      timeStart: '08:00',
      timeEnd: '09:30',
      hourlyRate: 25.00,
    },
  ]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    locationFrom: '',
    locationTo: '',
    activity: '',
    timeStart: '',
    timeEnd: '',
    hourlyRate: 0,
  });

  const handleAddEntry = () => {
    if (!formData.date || !formData.locationFrom || !formData.activity || !formData.timeStart || !formData.timeEnd) {
      alert('Bitte alle Pflichtfelder ausfüllen');
      return;
    }

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      date: formData.date,
      locationFrom: formData.locationFrom,
      locationTo: formData.locationTo || formData.locationFrom,
      activity: formData.activity,
      timeStart: formData.timeStart,
      timeEnd: formData.timeEnd,
      hourlyRate: formData.hourlyRate,
    };

    setEntries([...entries, newEntry]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      locationFrom: '',
      locationTo: '',
      activity: '',
      timeStart: '',
      timeEnd: '',
      hourlyRate: 0,
    });
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const calculateHours = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;
    return Math.max(0, (endMins - startMins) / 60);
  };

  const totalHours = entries.reduce((sum, e) => sum + calculateHours(e.timeStart, e.timeEnd), 0);
  const totalCosts = entries.reduce((sum, e) => sum + (calculateHours(e.timeStart, e.timeEnd) * e.hourlyRate), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Stundenzettel</h2>

        {/* Input Form */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Zeiteintrag hinzufügen</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Datum *</label>
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
              placeholder="z.B. Baustelle"
            />

            <TextInput
              label="Tätigkeit *"
              value={formData.activity}
              onChange={(v) => setFormData({ ...formData, activity: v })}
              placeholder="z.B. Fahrzeugvorbereitung"
            />

            <div>
              <label className="block text-sm font-semibold mb-2">Arbeitszeit Beginn *</label>
              <input
                type="time"
                value={formData.timeStart}
                onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Arbeitszeit Ende *</label>
              <input
                type="time"
                value={formData.timeEnd}
                onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <CurrencyInput
              label="Stundensatz"
              value={formData.hourlyRate}
              onChange={(v) => setFormData({ ...formData, hourlyRate: v })}
            />
          </div>

          <button
            onClick={handleAddEntry}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Zeiteintrag hinzufügen
          </button>
        </div>

        {/* Time Entries List */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Datum</th>
                <th className="px-4 py-3 text-left font-bold">Ort</th>
                <th className="px-4 py-3 text-left font-bold">Tätigkeit</th>
                <th className="px-4 py-3 text-right font-bold">Beginn</th>
                <th className="px-4 py-3 text-right font-bold">Ende</th>
                <th className="px-4 py-3 text-right font-bold">Stunden</th>
                <th className="px-4 py-3 text-right font-bold">Satz</th>
                <th className="px-4 py-3 text-right font-bold">Betrag</th>
                <th className="px-4 py-3 text-center font-bold">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => {
                const hours = calculateHours(entry.timeStart, entry.timeEnd);
                const amount = hours * entry.hourlyRate;
                return (
                  <tr key={entry.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3">{entry.date}</td>
                    <td className="px-4 py-3">
                      {entry.locationFrom} → {entry.locationTo}
                    </td>
                    <td className="px-4 py-3">{entry.activity}</td>
                    <td className="px-4 py-3 text-right">{entry.timeStart}</td>
                    <td className="px-4 py-3 text-right">{entry.timeEnd}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatters.number(hours, 2)} h
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatters.currency(entry.hourlyRate)}/h
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">
                      {formatters.currency(amount)}
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
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Einträge</p>
              <p className="text-3xl font-bold text-green-600">{entries.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Gesamtstunden</p>
              <p className="text-3xl font-bold text-green-600">
                {formatters.number(totalHours, 2)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Gesamtvergütung</p>
              <p className="text-3xl font-bold text-green-600">
                {formatters.currency(totalCosts)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
