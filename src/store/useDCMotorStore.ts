import { create } from 'zustand';
import type { SimulationResult } from '@/core/engine/types';
import { simulateDCMotor } from '@/core/engine/solver';

interface DCMotorState {
  Kp: number;
  Kd: number;
  setpoint: number;
  result: SimulationResult | null;
  isDirty: boolean;
  markClean: () => void;
  setParameters: (Kp: number, Kd: number, setpoint: number) => void;
}

export const useDCMotorStore = create<DCMotorState>((set) => {
  const initialKp = 1.0;
  const initialKd = 0.1;
  const initialSetpoint = 90; // degrees
  const initialResult = simulateDCMotor(initialKp, initialKd, initialSetpoint, 5, 0.01);

  return {
    Kp: initialKp,
    Kd: initialKd,
    setpoint: initialSetpoint,
    result: initialResult,
    isDirty: false,
    markClean: () => set({ isDirty: false }),
    setParameters: (Kp: number, Kd: number, setpoint: number) => {
      const result = simulateDCMotor(Kp, Kd, setpoint, 5, 0.01);
      set({ Kp, Kd, setpoint, result, isDirty: true });
    }
  };
});
