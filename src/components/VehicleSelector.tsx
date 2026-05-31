import { useVehicleStore } from '../store/vehicleStore';
import { useAppStore } from '../store/appStore';

export const VehicleSelector = () => {
  const vehicles = useVehicleStore((state) => state.getAllVehicles());
  const activeVehicleId = useAppStore((state) => state.activeVehicleId);
  const setActiveVehicleId = useAppStore((state) => state.setActiveVehicleId);

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId);

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-900">Aktives Fahrzeug</p>
          {activeVehicle ? (
            <p className="text-lg font-bold text-blue-600">
              {activeVehicle.name} ({activeVehicle.registration})
            </p>
          ) : (
            <p className="text-lg text-gray-500 italic">Kein Fahrzeug ausgewählt</p>
          )}
        </div>

        <select
          value={activeVehicleId || ''}
          onChange={(e) => setActiveVehicleId(e.target.value || null)}
          className="px-4 py-2 border border-blue-300 rounded bg-white text-blue-900 font-semibold cursor-pointer hover:bg-blue-50"
        >
          <option value="">-- Fahrzeug auswählen --</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name} ({vehicle.registration})
            </option>
          ))}
        </select>
      </div>

      {vehicles.length === 0 && (
        <div className="mt-2 text-sm text-blue-700">
          ℹ️ Gehen Sie zu "Datenblatt" um ein Fahrzeug hinzuzufügen
        </div>
      )}
    </div>
  );
};
