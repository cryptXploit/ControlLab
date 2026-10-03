export interface SystemModel {
  type: string;
  parameters: Record<string, number>;
}

export interface SimulationResult {
  time: Float32Array;
  output: Float32Array;
  setpoint?: Float32Array;
  metrics: Record<string, number>;
}
