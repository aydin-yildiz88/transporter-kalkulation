import { create } from 'zustand';
import { CalculationSummary, OrderCalculation } from '../types/calculations';
import { AllCosts } from '../types/costs';

interface CalculationStore {
  // State
  vehicleId: string | null;
  summary: CalculationSummary | null;
  costs: AllCosts | null;
  selectedOrder: OrderCalculation | null;

  // Actions
  setVehicleId: (id: string) => void;
  setSummary: (summary: CalculationSummary) => void;
  setCosts: (costs: AllCosts) => void;
  addOrder: (order: OrderCalculation) => void;
  updateOrder: (id: string, updates: Partial<OrderCalculation>) => void;
  deleteOrder: (id: string) => void;
  setSelectedOrder: (id: string | null) => void;

  // Helpers
  recalculate: () => void;
  reset: () => void;
}

export const useCalculationStore = create<CalculationStore>((set, get) => ({
  vehicleId: null,
  summary: null,
  costs: null,
  selectedOrder: null,

  setVehicleId: (id) => {
    set({ vehicleId: id });
  },

  setSummary: (summary) => {
    set({ summary });
  },

  setCosts: (costs) => {
    set({ costs });
  },

  addOrder: (order) => {
    set((state) => {
      if (!state.summary) return state;
      return {
        summary: {
          ...state.summary,
          orders: [...state.summary.orders, order],
        },
      };
    });
  },

  updateOrder: (id, updates) => {
    set((state) => {
      if (!state.summary) return state;
      return {
        summary: {
          ...state.summary,
          orders: state.summary.orders.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
        },
      };
    });
  },

  deleteOrder: (id) => {
    set((state) => {
      if (!state.summary) return state;
      return {
        summary: {
          ...state.summary,
          orders: state.summary.orders.filter((o) => o.id !== id),
        },
      };
    });
  },

  setSelectedOrder: (id) => {
    const state = get();
    if (!state.summary) return;

    const order = state.summary.orders.find((o) => o.id === id);
    set({ selectedOrder: order || null });
  },

  recalculate: () => {
    // TODO: Trigger recalculation based on vehicle/costs changes
    // Will be implemented in Phase 3
  },

  reset: () => {
    set({
      vehicleId: null,
      summary: null,
      costs: null,
      selectedOrder: null,
    });
  },
}));
