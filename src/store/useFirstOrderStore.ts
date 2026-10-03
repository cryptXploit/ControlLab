import { create } from 'zustand';
import type { SimulationResult } from '@/core/engine/types';
import { simulateFirstOrderStep } from '@/core/engine/solver';

interface FirstOrderState {
  K: number;
  tau: number;
  result: SimulationResult | null;
  isDirty: boolean;
  markClean: () => void;
  setParameters: (K: number, tau: number) => void;
}

export const useFirstOrderStore = create<FirstOrderState>((set) => {
  const initialK = 1.0;
  const initialTau = 1.0;
  const initialResult = simulateFirstOrderStep(initialK, initialTau, 15, 0.05);

  return {
    K: initialK,
    tau: initialTau,
    result: initialResult,
    isDirty: false,
    markClean: () => set({ isDirty: false }),
    setParameters: (K: number, tau: number) => {
      const result = simulateFirstOrderStep(K, tau, 15, 0.05);
      set({ K, tau, result, isDirty: true });
    }
  };
});
