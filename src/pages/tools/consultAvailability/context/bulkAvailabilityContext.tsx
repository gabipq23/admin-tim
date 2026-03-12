import { create } from "zustand";

interface BulkAvailabilityStore {
  originalDados: Array<{ cep: string; numero?: string }>;
  setOriginalDados: (dados: Array<{ cep: string; numero?: string }>) => void;
  clearOriginalDados: () => void;
}

export const useBulkAvailabilityStore = create<BulkAvailabilityStore>(
  (set) => ({
    originalDados: [],
    setOriginalDados: (dados) => set({ originalDados: dados }),
    clearOriginalDados: () => set({ originalDados: [] }),
  })
);
