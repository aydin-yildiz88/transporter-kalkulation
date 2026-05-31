import { useEffect, useState } from 'react';
import { useVehicleStore } from '../../store/vehicleStore';
import { useAppStore } from '../../store/appStore';
import { Modal } from '../Modal';
import { VehicleDataForm } from './VehicleDataForm';
import { storageService } from '../../services/storage';
import { formatters } from '../../utils/formatters';

export const Sheet1Datenblatt = () => {
  const vehicles = useVehicleStore((state) => state.getAllVehicles());
  const activeVehicle = useVehicleStore((state) => state.getActiveVehicle());
  const setActiveVehicle = useVehicleStore((state) => state.setActiveVehicle);
  const deleteVehicle = useVehicleStore((state) => state.deleteVehicle);
  const loadVehicles = useVehicleStore((state) => state.loadVehicles);

  const { modals, openModal, closeModal } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  // Load vehicles from database on mount
  useEffect(() => {
    const loadFromDatabase = async () => {
      try {
        const savedVehicles = await storageService.getAllVehicles();
        loadVehicles(savedVehicles);

        // Set first vehicle as active if none selected
        if (savedVehicles.length > 0) {
          const activeId = storageService.getActiveVehicleId();
          if (activeId && savedVehicles.find(v => v.id === activeId)) {
            setActiveVehicle(activeId);
          } else {
            setActiveVehicle(savedVehicles[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to load vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFromDatabase();
  }, [loadVehicles, setActiveVehicle]);

  const handleDeleteVehicle = async (id: string) => {
    if (confirm('Fahrzeug wirklich löschen?')) {
      try {
        await storageService.deleteVehicle(id);
        deleteVehicle(id);
      } catch (error) {
        console.error('Failed to delete vehicle:', error);
      }
    }
  };

  const handleEditVehicle = (vehicleId: string) => {
    setEditingVehicleId(vehicleId);
    openModal('vehicleForm');
  };

  const handleCloseForm = () => {
    closeModal('vehicleForm');
    setEditingVehicleId(null);
  };

  const handleSaveForm = () => {
    // Data is already saved via storageService in VehicleDataForm
    storageService.setActiveVehicleId(editingVehicleId || '');
    handleCloseForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Modal */}
      <Modal
        isOpen={modals.vehicleForm}
        title={editingVehicleId ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug'}
        onClose={handleCloseForm}
        size="large"
      >
        <VehicleDataForm
          vehicleId={editingVehicleId || undefined}
          onClose={handleCloseForm}
          onSave={handleSaveForm}
        />
      </Modal>

      {/* Header with Add Button */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">LKW-Transporter Datenblatt</h2>
          <button
            onClick={() => {
              setEditingVehicleId(null);
              openModal('vehicleForm');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            ➕ Neues Fahrzeug
          </button>
        </div>

        {/* Vehicle List */}
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  activeVehicle?.id === vehicle.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <div onClick={() => setActiveVehicle(vehicle.id)}>
                  <h3 className="font-bold text-lg">{vehicle.name}</h3>
                  <p className="text-sm text-gray-600">{vehicle.registration}</p>
                  <div className="text-xs text-gray-500 mt-2 space-y-1">
                    <p>📦 HZG: {vehicle.hzg}t</p>
                    <p>⛽ Verbrauch: {vehicle.fuelConsumption}L/100km</p>
                    <p>💰 Buchwert: {formatters.currency(vehicle.bookValue)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditVehicle(vehicle.id)}
                    className="flex-1 bg-blue-500 text-white text-xs py-1 rounded hover:bg-blue-600"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="flex-1 bg-red-500 text-white text-xs py-1 rounded hover:bg-red-600"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-4">Noch keine Fahrzeuge vorhanden.</p>
            <button
              onClick={() => openModal('vehicleForm')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Erstes Fahrzeug hinzufügen
            </button>
          </div>
        )}
      </div>

      {/* Vehicle Details */}
      {activeVehicle && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Details: {activeVehicle.name}</h3>
            <button
              onClick={() => handleEditVehicle(activeVehicle.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ✏️ Bearbeiten
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Fahrzeuginfo */}
            <div>
              <h4 className="font-bold text-sm text-gray-600 mb-3">Fahrzeug</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Marke:</strong> {activeVehicle.mark || '-'}</p>
                <p><strong>Kennzeichen:</strong> {activeVehicle.registration}</p>
                <p><strong>HZG:</strong> {activeVehicle.hzg}t</p>
                <p><strong>Baujahr:</strong> {activeVehicle.yearOfConstruction}</p>
              </div>
            </div>

            {/* Treibstoff */}
            <div>
              <h4 className="font-bold text-sm text-gray-600 mb-3">⛽ Treibstoff</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Verbrauch:</strong> {activeVehicle.fuelConsumption}L/100km</p>
                <p><strong>Preis:</strong> {formatters.currency(activeVehicle.fuelPrice)}/L</p>
              </div>
            </div>

            {/* Versicherung */}
            <div>
              <h4 className="font-bold text-sm text-gray-600 mb-3">🛡️ Versicherung</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Haftung:</strong> {formatters.currency(activeVehicle.liabilityInsurance)}/Jahr</p>
                <p><strong>Vollkasko:</strong> {formatters.currency(activeVehicle.comprehensiveInsurance)}/Jahr</p>
              </div>
            </div>

            {/* Kosten */}
            <div>
              <h4 className="font-bold text-sm text-gray-600 mb-3">💰 Kosten</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Anschaffung:</strong> {formatters.currency(activeVehicle.acquisitionCost)}</p>
                <p><strong>Buchwert:</strong> {formatters.currency(activeVehicle.bookValue)}</p>
                <p><strong>Restwert:</strong> {formatters.currency(activeVehicle.residualValue)}</p>
              </div>
            </div>

            {/* Reparatur */}
            <div>
              <h4 className="font-bold text-sm text-gray-600 mb-3">🔧 Reparatur</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Jahreskosten:</strong> {formatters.currency(activeVehicle.annualRepairCosts)}</p>
              </div>
            </div>

            {/* Reifen */}
            <div>
              <h4 className="font-bold text-sm text-gray-600 mb-3">🛞 Reifen</h4>
              <div className="space-y-2 text-sm">
                <p><strong>VA:</strong> {formatters.currency(activeVehicle.frontTireCost)}</p>
                <p><strong>HA:</strong> {formatters.currency(activeVehicle.rearTireCost)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
