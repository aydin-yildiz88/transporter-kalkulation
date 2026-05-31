import { useState, useMemo } from 'react';
import { useCalculationStore } from '../../store/calculationStore';
import { CalculationEngine } from '../../services/calculationEngine';
import { formatters } from '../../utils/formatters';
import { NumberInput } from '../inputs/NumberInput';
import { CurrencyInput } from '../inputs/CurrencyInput';
import { TextInput } from '../inputs/TextInput';

export const Sheet4Auftragskalkulation = () => {
  const summary = useCalculationStore((state) => state.summary);
  const addOrder = useCalculationStore((state) => state.addOrder);

  const [formData, setFormData] = useState({
    route: '',
    distance: 0,
    duration: 0,
    packages: 0,
    additionalCosts: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState<any[]>([]);

  const splitRate = summary?.splitRate;

  const orderCosts = useMemo(() => {
    if (!splitRate) return null;
    return CalculationEngine.calculateOrderCosts(
      formData.distance,
      formData.duration,
      splitRate.costPerKM,
      splitRate.costPerHour,
      formData.additionalCosts
    );
  }, [formData, splitRate]);

  const orderProfit = useMemo(() => {
    if (!orderCosts || !formData.revenue) return null;
    return CalculationEngine.calculateOrderProfit(
      formData.revenue,
      orderCosts.totalCosts
    );
  }, [orderCosts, formData.revenue]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddOrder = () => {
    if (!formData.route || !formData.distance || !formData.revenue) {
      alert('Bitte füllen Sie die Felder aus');
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      date: new Date(),
      route: formData.route,
      distance: formData.distance,
      duration: formData.duration,
      packages: formData.packages,
      additionalServices: formData.additionalCosts,
      directCosts: orderCosts?.totalCosts || 0,
      revenue: formData.revenue,
      ...orderProfit,
    };

    setOrders([...orders, newOrder]);
    addOrder(newOrder);

    // Reset form
    setFormData({
      route: '',
      distance: 0,
      duration: 0,
      packages: 0,
      additionalCosts: 0,
      revenue: 0,
    });
  };

  if (!summary || !splitRate) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">
          ⚠️ Bitte wähle ein Fahrzeug im Datenblatt aus und berechne die Splitsätze.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-2">Auftragskalkulation</h2>
        <p className="text-gray-600">
          Fahrzeug: <strong>{summary.vehicle.name}</strong>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Splitsatz: {formatters.currency(splitRate.costPerKM)}/km • {formatters.currency(splitRate.costPerHour)}/h
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Neuer Auftrag</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Route (Von/Nach)"
            value={formData.route}
            onChange={(v) => handleChange('route', v)}
            placeholder="z.B. Bregenz - Salzburg"
            required
          />

          <NumberInput
            label="Entfernung"
            value={formData.distance}
            onChange={(v) => handleChange('distance', v)}
            unit="km"
            decimals={1}
            min={0}
            required
          />

          <NumberInput
            label="Fahrtzeit"
            value={formData.duration}
            onChange={(v) => handleChange('duration', v)}
            unit="h"
            decimals={2}
            min={0}
          />

          <NumberInput
            label="Pakete / Paletten"
            value={formData.packages}
            onChange={(v) => handleChange('packages', v)}
            decimals={0}
            min={0}
          />

          <CurrencyInput
            label="Zusatzleistungen"
            value={formData.additionalCosts}
            onChange={(v) => handleChange('additionalCosts', v)}
          />

          <CurrencyInput
            label="Verrechnungspreis (Revenue)"
            value={formData.revenue}
            onChange={(v) => handleChange('revenue', v)}
            required
          />
        </div>

        <button
          onClick={handleAddOrder}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          ➕ Auftrag hinzufügen
        </button>
      </div>

      {/* Calculation Preview */}
      {orderCosts && orderProfit && formData.revenue > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Berechnung für diesen Auftrag</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Costs */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3">💰 Kosten</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kilometer ({formData.distance}km × {formatters.currency(splitRate.costPerKM)})</span>
                  <span className="font-semibold">{formatters.currency(orderCosts.kmCosts)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stunden ({formData.duration}h × {formatters.currency(splitRate.costPerHour)})</span>
                  <span className="font-semibold">{formatters.currency(orderCosts.hourCosts)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zusatzleistungen</span>
                  <span className="font-semibold">{formatters.currency(orderCosts.additionalCosts)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-gray-300 pt-2 mt-2">
                  <span className="font-bold">Gesamtkosten</span>
                  <span className="font-bold text-red-600">{formatters.currency(orderCosts.totalCosts)}</span>
                </div>
              </div>
            </div>

            {/* Profit Analysis */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3">📊 Rentabilität</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Verrechnungspreis</span>
                  <span className="font-semibold text-green-600">{formatters.currency(formData.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kosten</span>
                  <span className="font-semibold text-red-600">-{formatters.currency(orderCosts.totalCosts)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-gray-300 pt-2 mt-2">
                  <span className="font-bold">Deckungsbeitrag</span>
                  <span className={`font-bold text-lg ${orderProfit.contributionIII >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatters.currency(orderProfit.contributionIII)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gewinnmarge</span>
                  <span className={`font-bold ${orderProfit.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatters.percent(orderProfit.profitMargin, 2)}
                  </span>
                </div>
              </div>

              {/* Profitability Indicator */}
              <div className="mt-4 p-3 rounded text-center font-bold text-white" style={{
                backgroundColor: orderProfit.isProfitable ? '#10b981' : '#ef4444'
              }}>
                {orderProfit.isProfitable ? '✓ RENTABEL' : '✗ VERLUST'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      {orders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Aufträge ({orders.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left font-bold">Route</th>
                  <th className="px-6 py-3 text-right font-bold">km</th>
                  <th className="px-6 py-3 text-right font-bold">Kosten</th>
                  <th className="px-6 py-3 text-right font-bold">Erlös</th>
                  <th className="px-6 py-3 text-right font-bold">Gewinn</th>
                  <th className="px-6 py-3 text-right font-bold">Marge</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-3 font-semibold">{order.route}</td>
                    <td className="px-6 py-3 text-right">{formatters.number(order.distance)}</td>
                    <td className="px-6 py-3 text-right text-red-600">
                      {formatters.currency(order.directCosts)}
                    </td>
                    <td className="px-6 py-3 text-right text-green-600 font-semibold">
                      {formatters.currency(order.revenue)}
                    </td>
                    <td className="px-6 py-3 text-right font-bold" style={{
                      color: order.contributionIII >= 0 ? '#10b981' : '#ef4444'
                    }}>
                      {formatters.currency(order.contributionIII)}
                    </td>
                    <td className="px-6 py-3 text-right font-bold" style={{
                      color: order.profitMargin >= 0 ? '#10b981' : '#ef4444'
                    }}>
                      {formatters.percent(order.profitMargin, 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {orders.length > 0 && (
            <div className="bg-blue-50 p-6 border-t-2 border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Anzahl Aufträge</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gesamterlös</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatters.currency(orders.reduce((sum, o) => sum + o.revenue, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gesamtkosten</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatters.currency(orders.reduce((sum, o) => sum + o.directCosts, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gesamtgewinn</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatters.currency(orders.reduce((sum, o) => sum + o.contributionIII, 0))}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {orders.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">Keine Aufträge erfasst</p>
          <p className="text-gray-500 text-sm mt-2">Fügen Sie einen neuen Auftrag hinzu, um die Rentabilität zu berechnen</p>
        </div>
      )}
    </div>
  );
};
