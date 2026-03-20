import { create } from "zustand";
import { IBulkAvailabilityResponse } from "@/interfaces/availability";

interface BulkAvailabilityStore {
  originalDados: Array<{ cep: string; numero?: string }>;
  bulkResponse: IBulkAvailabilityResponse | null;
  setOriginalDados: (dados: Array<{ cep: string; numero?: string }>) => void;
  setBulkResponse: (response: IBulkAvailabilityResponse | null) => void;
  clearOriginalDados: () => void;
  clearBulkResponse: () => void;
}

export const useBulkAvailabilityStore = create<BulkAvailabilityStore>(
  (set) => ({
    originalDados: [],
    bulkResponse: null,
    setOriginalDados: (dados) => set({ originalDados: dados }),
    setBulkResponse: (response) => set({ bulkResponse: response }),
    clearOriginalDados: () => set({ originalDados: [] }),
    clearBulkResponse: () => set({ bulkResponse: null }),
  })
);
