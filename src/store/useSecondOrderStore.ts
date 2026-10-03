import { create } from 'zustand';
import type { SimulationResult } from '@/core/engine/types';
import { simulateSecondOrderStep } from '@/core/engine/solver';

interface SecondOrderState {
  K: number;
  zeta: number;
  wn: number;
  result: SimulationResult | null;
  isDirty: boolean;
  markClean: () => void;
  setParameters: (K: number, zeta: number, wn: number) => void;
}

export const useSecondOrderStore = create<SecondOrderState>((set) => {
  const initialK = 1.0;
  const initialZeta = 0.5;
  const initialWn = 2.0;
  const initialResult = simulateSecondOrderStep(initialK, initialZeta, initialWn, 15, 0.05);

  return {
    K: initialK,
    zeta: initialZeta,
    wn: initialWn,
    result: initialResult,
    isDirty: false,
    markClean: () => set({ isDirty: false }),
    setParameters: (K: number, zeta: number, wn: number) => {
      const result = simulateSecondOrderStep(K, zeta, wn, 15, 0.05);
      set({ K, zeta, wn, result, isDirty: true });
    }
  };
});
