import { create } from 'zustand';
import type { SimulationResult } from '@/core/engine/types';
import { simulateDummySystem } from '@/core/engine/solver';

interface LabState {
  gain: number;
  timeConstant: number;
  result: SimulationResult | null;
  setParameters: (gain: number, timeConstant: number) => void;
}

export const useLabStore = create<LabState>((set) => {
  // Initial simulation
  const initialGain = 1.0;
  const initialTimeConstant = 1.0;
  const initialResult = simulateDummySystem(initialGain, initialTimeConstant, 10, 0.05);

  return {
    gain: initialGain,
    timeConstant: initialTimeConstant,
    result: initialResult,
    setParameters: (gain: number, timeConstant: number) => {
      const result = simulateDummySystem(gain, timeConstant, 10, 0.05);
      set({ gain, timeConstant, result });
    }
  };
});
