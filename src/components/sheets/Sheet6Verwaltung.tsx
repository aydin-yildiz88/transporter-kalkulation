import { useState } from 'react';
import { NumberInput } from '../inputs/NumberInput';
import { CurrencyInput } from '../inputs/CurrencyInput';
import { TextInput } from '../inputs/TextInput';
import { formatters } from '../../utils/formatters';

interface AdminCost {
  id: string;
  category: string;
  month: number;
  amount: number;
  description: string;
}

export const Sheet6Verwaltung = () => {
  const [costs, setCosts] = useState<AdminCost[]>([
    {
      id: '1',
      category: 'Miete',
      month: 1,
      amount: 2500.00,
      description: 'Büro- und Lagermiete',
    },
  ]);

  const [formData, setFormData] = useState({
    category: 'Miete',
    month: 1,
    amount: 0,
    description: '',
  });

  const categories = [
    'Miete',
    'Gehälter',
    'Versicherung',
    'Werbung',
    'Darlehen',
    'Sonstiges',
    'Arbeiter',
    'Leasing',
    'Gewinn',
  ];

  const handleAddCost = () => {
    if (!formData.category || formData.amount <= 0) {
      alert('Bitte alle Felder ausfüllen und einen gültigen Betrag eingeben');
      return;
    }

    const newCost: AdminCost = {
      id: Date.now().toString(),
      category: formData.category,
      month: formData.month,
      amount: formData.amount,
      description: formData.description,
    };

    setCosts([...costs, newCost]);
    setFormData({
      category: 'Miete',
      month: 1,
      amount: 0,
      description: '',
    });
  };

  const handleDelete = (id: string) => {
    setCosts(costs.filter((c) => c.id !== id));
  };

  const totalMonthlyCosts = costs.reduce((sum, c) => sum + c.amount, 0);
  const totalAnnualCosts = totalMonthlyCosts * 12;

  const costsByCategory = categories.map((cat) => ({
    category: cat,
    total: costs
      .filter((c) => c.category === cat)
      .reduce((sum, c) => sum + c.amount, 0),
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Verwaltungskosten</h2>

        {/* Input Form */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Kosteneintrag hinzufügen</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Kategorie</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

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
              label="Betrag"
              value={formData.amount}
              onChange={(v) => setFormData({ ...formData, amount: v })}
            />

            <TextInput
              label="Beschreibung"
              value={formData.description}
              onChange={(v) => setFormData({ ...formData, description: v })}
              placeholder="z.B. Dezembermiete"
            />
          </div>

          <button
            onClick={handleAddCost}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Kosteneintrag hinzufügen
          </button>
        </div>

        {/* Costs by Category Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Zusammenfassung nach Kategorie</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {costsByCategory.map((item) => (
              <div key={item.category} className="bg-gray-50 p-4 rounded border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">{item.category}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatters.currency(item.total)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cost List */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left font-bold">Kategorie</th>
                <th className="px-6 py-3 text-right font-bold">Monat</th>
                <th className="px-6 py-3 text-right font-bold">Betrag</th>
                <th className="px-6 py-3 text-left font-bold">Beschreibung</th>
                <th className="px-6 py-3 text-center font-bold">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((cost, idx) => (
                <tr
                  key={cost.id}
                  className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="px-6 py-3 font-semibold">{cost.category}</td>
                  <td className="px-6 py-3 text-right">{cost.month}</td>
                  <td className="px-6 py-3 text-right font-bold text-blue-600">
                    {formatters.currency(cost.amount)}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {cost.description}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleDelete(cost.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Einträge</p>
              <p className="text-3xl font-bold text-green-600">{costs.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Kosten/Monat</p>
              <p className="text-3xl font-bold text-green-600">
                {formatters.currency(totalMonthlyCosts)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Kosten/Jahr</p>
              <p className="text-3xl font-bold text-green-600">
                {formatters.currency(totalAnnualCosts)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
