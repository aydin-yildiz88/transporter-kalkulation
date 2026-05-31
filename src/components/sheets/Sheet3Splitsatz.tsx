import { useCalculationStore } from '../../store/calculationStore';
import { formatters } from '../../utils/formatters';

export const Sheet3Splitsatz = () => {
  const summary = useCalculationStore((state) => state.summary);

  if (!summary) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">
          ⚠️ Bitte wähle ein Fahrzeug im Datenblatt aus.
        </p>
      </div>
    );
  }

  const { splitRate } = summary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-2">Splitsatz - Kostenaufteilung</h2>
        <p className="text-gray-600">
          Fahrzeug: <strong>{summary.vehicle.name}</strong> ({summary.vehicle.registration})
        </p>
      </div>

      {/* Main Split Rates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
          <p className="text-sm opacity-90 mb-2">Kosten pro KM</p>
          <p className="text-4xl font-bold mb-2">{formatters.currency(splitRate.costPerKM)}</p>
          <p className="text-xs opacity-75">inkl. MwSt: {formatters.currency(splitRate.costPerKMWithVAT)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <p className="text-sm opacity-90 mb-2">Kosten pro Stunde</p>
          <p className="text-4xl font-bold mb-2">{formatters.currency(splitRate.costPerHour)}</p>
          <p className="text-xs opacity-75">inkl. MwSt: {formatters.currency(splitRate.costPerHourWithVAT)}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-md p-6">
          <p className="text-sm opacity-90 mb-2">Kosten pro Tag</p>
          <p className="text-4xl font-bold mb-2">{formatters.currency(splitRate.costPerDay)}</p>
          <p className="text-xs opacity-75">(8h Arbeitstag)</p>
        </div>
      </div>

      {/* Annual Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Jährliche Gesamtkosten</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Netto</p>
            <p className="text-3xl font-bold text-gray-800">
              {formatters.currency(splitRate.totalAnnualCosts)}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded border-2 border-blue-300">
            <p className="text-sm text-gray-600 mb-1">Brutto (mit 19% MwSt)</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatters.currency(splitRate.totalAnnualWithVAT)}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Kostenaufschlüsselung pro Kostenart</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left font-bold">Kostenart</th>
                <th className="px-6 py-3 text-right font-bold">€/Jahr</th>
                <th className="px-6 py-3 text-right font-bold">%</th>
                <th className="px-6 py-3 text-right font-bold">€/km</th>
                <th className="px-6 py-3 text-right font-bold">€/h</th>
              </tr>
            </thead>
            <tbody>
              {splitRate.breakdown.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-3 font-semibold text-gray-800">{item.costsType}</td>
                  <td className="px-6 py-3 text-right text-gray-800">
                    {formatters.currency(item.annualCosts)}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-800">
                    {formatters.percent(item.percentage, 1)}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-800">
                    {formatters.currency(item.costPerKM)}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-800">
                    {formatters.currency(item.costPerHour)}
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-100 border-t-2 border-gray-300 font-bold">
                <td className="px-6 py-3">GESAMT</td>
                <td className="px-6 py-3 text-right">
                  {formatters.currency(splitRate.totalAnnualCosts)}
                </td>
                <td className="px-6 py-3 text-right">100,0%</td>
                <td className="px-6 py-3 text-right text-blue-600">
                  {formatters.currency(splitRate.costPerKM)}
                </td>
                <td className="px-6 py-3 text-right text-blue-600">
                  {formatters.currency(splitRate.costPerHour)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-blue-50 rounded-lg shadow-md p-6 border-2 border-blue-300">
        <h3 className="text-xl font-bold mb-4">📊 Beispielkalkulationen</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded">
            <p className="text-sm font-semibold text-gray-600 mb-2">Auftrag: 100 km</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatters.currency(100 * splitRate.costPerKM)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              (100 km × {formatters.currency(splitRate.costPerKM)}/km)
            </p>
          </div>

          <div className="bg-white p-4 rounded">
            <p className="text-sm font-semibold text-gray-600 mb-2">Auftrag: 1 Tag (8h)</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatters.currency(8 * splitRate.costPerHour)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              (8h × {formatters.currency(splitRate.costPerHour)}/h)
            </p>
          </div>

          <div className="bg-white p-4 rounded">
            <p className="text-sm font-semibold text-gray-600 mb-2">Auftrag: 500 km + 2 Tage</p>
            <p className="text-2xl font-bold text-orange-600">
              {formatters.currency(500 * splitRate.costPerKM + 16 * splitRate.costPerHour)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              (500km + 16h)
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-bold text-green-900 mb-2">💡 Hinweis zur Verwendung:</h4>
        <ul className="text-sm text-green-800 space-y-1 ml-4">
          <li>✓ Verwende die <strong>€/km</strong> Rate für Aufträge mit bekannter Entfernung</li>
          <li>✓ Verwende die <strong>€/h</strong> Rate für Aufträge mit bekannter Fahrtzeit</li>
          <li>✓ Kombiniere beide Raten für komplexe Aufträge</li>
          <li>✓ Die MwSt (19%) ist bereits im Splitsatz enthalten</li>
        </ul>
      </div>
    </div>
  );
};
