import { create } from 'zustand';
import type { SimulationResult } from '@/core/engine/types';
import { simulatePIDStep } from '@/core/engine/solver';

interface PidState {
  Kp: number;
  Ki: number;
  Kd: number;
  setpoint: number;
  result: SimulationResult | null;
  setParameters: (Kp: number, Ki: number, Kd: number, setpoint: number) => void;
}

export const usePidStore = create<PidState>((set) => {
  const initialKp = 1.0;
  const initialKi = 0.0;
  const initialKd = 0.0;
  const initialSetpoint = 1.0;
  const initialResult = simulatePIDStep(initialKp, initialKi, initialKd, initialSetpoint, 15, 0.05);

  return {
    Kp: initialKp,
    Ki: initialKi,
    Kd: initialKd,
    setpoint: initialSetpoint,
    result: initialResult,
    setParameters: (Kp: number, Ki: number, Kd: number, setpoint: number) => {
      const result = simulatePIDStep(Kp, Ki, Kd, setpoint, 15, 0.05);
      set({ Kp, Ki, Kd, setpoint, result });
    }
  };
});
