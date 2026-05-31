import { useState } from 'react';
import { NumberInput } from '../inputs/NumberInput';
import { CurrencyInput } from '../inputs/CurrencyInput';
import { TextInput } from '../inputs/TextInput';
import { formatters } from '../../utils/formatters';

interface Employee {
  id: string;
  name: string;
  month: number;
  grossSalary: number;
  laborCosts: number;
  dailyAllowance: number;
}

export const Sheet5PersonalKosten = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Manuela',
      month: 1,
      grossSalary: 1221.38,
      laborCosts: 1603.51,
      dailyAllowance: 402.60,
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    month: 1,
    grossSalary: 0,
    laborCosts: 0,
    dailyAllowance: 0,
  });

  const handleAddEmployee = () => {
    if (!formData.name) {
      alert('Bitte Namen eingeben');
      return;
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: formData.name,
      month: formData.month,
      grossSalary: formData.grossSalary,
      laborCosts: formData.laborCosts,
      dailyAllowance: formData.dailyAllowance,
    };

    setEmployees([...employees, newEmployee]);
    setFormData({
      name: '',
      month: 1,
      grossSalary: 0,
      laborCosts: 0,
      dailyAllowance: 0,
    });
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  const totalMonthlyCosts = employees.reduce((sum, e) => sum + e.laborCosts, 0);
  const totalAnnualCosts = totalMonthlyCosts * 12;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Kosten Personal</h2>

        {/* Input Form */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Mitarbeiter hinzufügen</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              label="Name"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
              placeholder="z.B. Manuela"
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
              label="Bruttolohn"
              value={formData.grossSalary}
              onChange={(v) => setFormData({ ...formData, grossSalary: v })}
            />

            <CurrencyInput
              label="Lohnkosten (inkl. Sozialabgaben)"
              value={formData.laborCosts}
              onChange={(v) => setFormData({ ...formData, laborCosts: v })}
            />

            <CurrencyInput
              label="Taggeld"
              value={formData.dailyAllowance}
              onChange={(v) => setFormData({ ...formData, dailyAllowance: v })}
            />
          </div>

          <button
            onClick={handleAddEmployee}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Mitarbeiter hinzufügen
          </button>
        </div>

        {/* Employee List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left font-bold">Name</th>
                <th className="px-6 py-3 text-right font-bold">Monat</th>
                <th className="px-6 py-3 text-right font-bold">Brutto</th>
                <th className="px-6 py-3 text-right font-bold">Lohnkosten</th>
                <th className="px-6 py-3 text-right font-bold">Taggeld</th>
                <th className="px-6 py-3 text-center font-bold">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={emp.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-3 font-semibold">{emp.name}</td>
                  <td className="px-6 py-3 text-right">{emp.month}</td>
                  <td className="px-6 py-3 text-right">{formatters.currency(emp.grossSalary)}</td>
                  <td className="px-6 py-3 text-right font-bold text-blue-600">
                    {formatters.currency(emp.laborCosts)}
                  </td>
                  <td className="px-6 py-3 text-right">{formatters.currency(emp.dailyAllowance)}</td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleDelete(emp.id)}
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
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Anzahl Mitarbeiter</p>
              <p className="text-3xl font-bold text-blue-600">{employees.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Lohnkosten/Monat</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatters.currency(totalMonthlyCosts)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Lohnkosten/Jahr</p>
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
