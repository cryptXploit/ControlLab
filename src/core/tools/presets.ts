export interface Preset {
  id: string;
  labelKey: string;
  descKey?: string;
  params: Record<string, number>;
}

export const PID_PRESETS: Preset[] = [
  {
    id: 'cruiseControl',
    labelKey: 'presets.pid.cruiseControl',
    params: { Kp: 2.0, Ki: 0.5, Kd: 0.0, setpoint: 1.0 }
  },
  {
    id: 'quadcopter',
    labelKey: 'presets.pid.quadcopter',
    params: { Kp: 8.0, Ki: 0.0, Kd: 4.0, setpoint: 1.0 }
  }
];

export const MASS_SPRING_PRESETS: Preset[] = [
  {
    id: 'suspension',
    labelKey: 'presets.massSpring.suspension',
    params: { m: 8.0, b: 6.0, k: 30.0, F: 5.0 }
  },
  {
    id: 'doorCloser',
    labelKey: 'presets.massSpring.doorCloser',
    params: { m: 1.0, b: 15.0, k: 5.0, F: 5.0 }
  }
];
