import { useVehicleStore } from '../store/vehicleStore';
import { useCalculationStore } from '../store/calculationStore';
import { formatters } from '../utils/formatters';
import { ExportButtons } from './ExportButtons';
import { VehicleSelector } from './VehicleSelector';

export const Dashboard = () => {
  const vehicles = useVehicleStore((state) => state.getAllVehicles());
  const summary = useCalculationStore((state) => state.summary);

  return (
    <div className="space-y-6">
      {/* Vehicle Selector */}
      <VehicleSelector />

      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold mb-2">🚛 Willkommen zur LKW-Transporter Kalkulation</h1>
        <p className="text-lg opacity-90">
          Professionelle Kostenberechnung und Auftragskalkulationen für Transportfirmen
        </p>
      </div>

      {/* Quick Stats */}
      {vehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Fahrzeuge</p>
            <p className="text-4xl font-bold text-blue-600">{vehicles.length}</p>
          </div>

          {summary && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600 mb-2">Kosten/km</p>
                <p className="text-4xl font-bold text-orange-600">
                  {formatters.currency(summary.splitRate.costPerKM)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600 mb-2">Kosten/h</p>
                <p className="text-4xl font-bold text-purple-600">
                  {formatters.currency(summary.splitRate.costPerHour)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600 mb-2">Aufträge</p>
                <p className="text-4xl font-bold text-green-600">{summary.orders.length}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Current Vehicle Info */}
      {summary && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {summary.vehicle.name}
              </h2>
              <p className="text-gray-600">{summary.vehicle.registration}</p>
            </div>
            <ExportButtons />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600 mb-1">Treibstoff/Jahr</p>
              <p className="text-2xl font-bold">
                {formatters.currency(summary.supplementary.annualFuelCosts)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600 mb-1">Reifen/Jahr</p>
              <p className="text-2xl font-bold">
                {formatters.currency(summary.supplementary.annualTireCosts)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600 mb-1">Versicherung/Jahr</p>
              <p className="text-2xl font-bold">
                {formatters.currency(summary.supplementary.annualInsuranceCosts)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600 mb-1">Gesamtkosten/Jahr</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatters.currency(summary.splitRate.totalAnnualCosts)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orders Summary */}
      {summary && summary.orders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold mb-4">Aufträge Übersicht</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded border-2 border-green-300">
              <p className="text-sm text-gray-600 mb-1">Gesamterlös</p>
              <p className="text-3xl font-bold text-green-600">
                {formatters.currency(
                  summary.orders.reduce((sum, o) => sum + o.revenue, 0)
                )}
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded border-2 border-red-300">
              <p className="text-sm text-gray-600 mb-1">Gesamtkosten</p>
              <p className="text-3xl font-bold text-red-600">
                {formatters.currency(
                  summary.orders.reduce((sum, o) => sum + o.directCosts, 0)
                )}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded border-2 border-blue-300">
              <p className="text-sm text-gray-600 mb-1">Gesamtgewinn</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatters.currency(
                  summary.orders.reduce((sum, o) => sum + o.contributionIII, 0)
                )}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-4">Letzte Aufträge:</p>
            <div className="space-y-2">
              {summary.orders.slice(-5).map((order) => (
                <div key={order.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-semibold">{order.route}</p>
                    <p className="text-sm text-gray-600">{order.distance}km</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${order.contributionIII >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatters.currency(order.contributionIII)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatters.percent(order.profitMargin, 1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
        <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Schritt-für-Schritt Anleitung:</h3>
        <ol className="space-y-2 text-blue-900 ml-4">
          <li><strong>1. Datenblatt:</strong> Fügen Sie Ihre Fahrzeuge mit allen technischen Daten ein</li>
          <li><strong>2. Nebenrechnungen:</strong> Automatische Berechnung aller Betriebskosten</li>
          <li><strong>3. Splitsatz:</strong> Kostenaufteilung pro km und pro Stunde</li>
          <li><strong>4. Auftragskalkulation:</strong> Berechnen Sie die Rentabilität Ihrer Aufträge</li>
          <li><strong>5. Export:</strong> Drucken oder exportieren Sie die Kalkulationen</li>
        </ol>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-2xl mb-2">📋</p>
          <h4 className="font-bold mb-2">Fahrzeugverwaltung</h4>
          <p className="text-sm text-gray-600">
            Verwalten Sie mehrere Fahrzeuge mit individuellen Kostenparametern
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-2xl mb-2">🔢</p>
          <h4 className="font-bold mb-2">Automatische Berechnung</h4>
          <p className="text-sm text-gray-600">
            Alle Kosten werden automatisch basierend auf Ihren Eingaben berechnet
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-2xl mb-2">📊</p>
          <h4 className="font-bold mb-2">Auftragsverwaltung</h4>
          <p className="text-sm text-gray-600">
            Kalkulieren Sie Aufträge und analysieren Sie deren Rentabilität
          </p>
        </div>
      </div>
    </div>
  );
};
