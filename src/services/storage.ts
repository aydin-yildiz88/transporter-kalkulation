import { VehicleData } from '../types/vehicle';
import { CalculationSnapshot } from '../types/calculations';

/**
 * Speicherungs-Service für IndexedDB + localStorage
 */

const DB_NAME = 'TransporterKalkulationDB';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export const storageService = {
  // ============ Initialisierung ============

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;

        // Vehicles Store
        if (!database.objectStoreNames.contains('vehicles')) {
          database.createObjectStore('vehicles', { keyPath: 'id' });
        }

        // Calculations Store
        if (!database.objectStoreNames.contains('calculations')) {
          const store = database.createObjectStore('calculations', { keyPath: 'id' });
          store.createIndex('vehicleId', 'vehicleId', { unique: false });
          store.createIndex('date', 'date', { unique: false });
        }

        // Settings Store
        if (!database.objectStoreNames.contains('settings')) {
          database.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  },

  // ============ Fahrzeuge ============

  async saveVehicle(vehicle: VehicleData): Promise<string> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction('vehicles', 'readwrite');
      const store = transaction.objectStore('vehicles');
      const request = store.put({
        ...vehicle,
        updatedAt: new Date().toISOString(),
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as string);
    });
  },

  async getVehicle(id: string): Promise<VehicleData | undefined> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction('vehicles', 'readonly');
      const store = transaction.objectStore('vehicles');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },

  async getAllVehicles(): Promise<VehicleData[]> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction('vehicles', 'readonly');
      const store = transaction.objectStore('vehicles');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },

  async deleteVehicle(id: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction('vehicles', 'readwrite');
      const store = transaction.objectStore('vehicles');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  },

  // ============ Berechnungen ============

  async saveCalculation(calculation: CalculationSnapshot): Promise<string> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction('calculations', 'readwrite');
      const store = transaction.objectStore('calculations');
      const request = store.put({
        ...calculation,
        savedAt: new Date().toISOString(),
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as string);
    });
  },

  async getCalculation(id: string): Promise<CalculationSnapshot | undefined> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction('calculations', 'readonly');
      const store = transaction.objectStore('calculations');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },

  async getCalculationsByVehicle(vehicleId: string): Promise<CalculationSnapshot[]> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction('calculations', 'readonly');
      const store = transaction.objectStore('calculations');
      const index = store.index('vehicleId');
      const request = index.getAll(vehicleId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },

  async deleteCalculation(id: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction('calculations', 'readwrite');
      const store = transaction.objectStore('calculations');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  },

  // ============ localStorage (für schnelle UI-States) ============

  setActiveVehicleId(vehicleId: string): void {
    localStorage.setItem('activeVehicleId', vehicleId);
  },

  getActiveVehicleId(): string | null {
    return localStorage.getItem('activeVehicleId');
  },

  setCurrentSheet(sheet: string): void {
    localStorage.setItem('currentSheet', sheet);
  },

  getCurrentSheet(): string | null {
    return localStorage.getItem('currentSheet');
  },

  // ============ Utility ============

  async clearAll(): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction(['vehicles', 'calculations', 'settings'], 'readwrite');

      transaction.objectStore('vehicles').clear();
      transaction.objectStore('calculations').clear();
      transaction.objectStore('settings').clear();

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => {
        localStorage.clear();
        resolve();
      };
    });
  },
};
