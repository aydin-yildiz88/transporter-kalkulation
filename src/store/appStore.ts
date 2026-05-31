import { create } from 'zustand';

export type SheetTab =
  | 'datenblatt'
  | 'nebenrechnungen'
  | 'splitsatz'
  | 'auftragskalkulation'
  | 'personal'
  | 'verwaltung'
  | 'kfzkosten'
  | 'stopp'
  | 'kostentransporter'
  | 'stundenzettel'
  | 'fahrtenbuch';

interface AppStore {
  // Navigation
  currentSheet: SheetTab;
  sidebarOpen: boolean;
  activeVehicleId: string | null;

  // UI State
  loading: boolean;
  error: string | null;
  successMessage: string | null;

  // Modal States
  modals: {
    vehicleForm: boolean;
    orderForm: boolean;
    exportDialog: boolean;
  };

  // Actions
  setCurrentSheet: (sheet: SheetTab) => void;
  toggleSidebar: () => void;
  setActiveVehicleId: (vehicleId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  openModal: (modal: keyof AppStore['modals']) => void;
  closeModal: (modal: keyof AppStore['modals']) => void;
  resetMessages: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentSheet: 'datenblatt',
  sidebarOpen: true,
  activeVehicleId: null,
  loading: false,
  error: null,
  successMessage: null,
  modals: {
    vehicleForm: false,
    orderForm: false,
    exportDialog: false,
  },

  setCurrentSheet: (sheet) => {
    set({ currentSheet: sheet });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setActiveVehicleId: (vehicleId) => {
    set({ activeVehicleId: vehicleId });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  setError: (error) => {
    set({ error });
  },

  setSuccessMessage: (message) => {
    set({ successMessage: message });
  },

  openModal: (modal) => {
    set((state) => ({
      modals: { ...state.modals, [modal]: true },
    }));
  },

  closeModal: (modal) => {
    set((state) => ({
      modals: { ...state.modals, [modal]: false },
    }));
  },

  resetMessages: () => {
    set({ error: null, successMessage: null });
  },
}));
