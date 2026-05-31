import { create } from 'zustand';
import { VehicleData } from '../types/vehicle';

interface VehicleStore {
  vehicles: VehicleData[];
  activeVehicleId: string | null;

  // Actions
  addVehicle: (vehicle: VehicleData) => void;
  updateVehicle: (id: string, updates: Partial<VehicleData>) => void;
  deleteVehicle: (id: string) => void;
  setActiveVehicle: (id: string) => void;
  getActiveVehicle: () => VehicleData | undefined;
  getAllVehicles: () => VehicleData[];

  // Persistence
  loadVehicles: (vehicles: VehicleData[]) => void;
}

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],
  activeVehicleId: null,

  addVehicle: (vehicle) => {
    set((state) => ({
      vehicles: [...state.vehicles, { ...vehicle, id: vehicle.id || Date.now().toString() }],
    }));
  },

  updateVehicle: (id, updates) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, ...updates, updatedAt: new Date() } : v
      ),
    }));
  },

  deleteVehicle: (id) => {
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== id),
      activeVehicleId: state.activeVehicleId === id ? null : state.activeVehicleId,
    }));
  },

  setActiveVehicle: (id) => {
    set({ activeVehicleId: id });
  },

  getActiveVehicle: () => {
    const state = get();
    return state.vehicles.find((v) => v.id === state.activeVehicleId);
  },

  getAllVehicles: () => {
    return get().vehicles;
  },

  loadVehicles: (vehicles) => {
    set({ vehicles });
  },
}));
