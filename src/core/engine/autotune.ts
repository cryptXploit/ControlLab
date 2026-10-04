export interface ZieglerNicholsTuning {
  P: { Kp: number };
  PI: { Kp: number; Ki: number };
  PID: { Kp: number; Ki: number; Kd: number };
}

export interface ZieglerNicholsResult {
  tangentArr: Float32Array;
  L: number;
  T: number;
  tuning: ZieglerNicholsTuning;
}

export function calculateZieglerNicholsOpenLoop(
  timeArr: Float32Array,
  responseArr: Float32Array,
  dcGain: number
): ZieglerNicholsResult {
  const N = timeArr.length;
  let maxSlope = 0;
  let infIdx = 0;

  for (let i = 1; i < N; i++) {
    const dt = timeArr[i] - timeArr[i - 1];
    if (dt <= 0) continue;
    const slope = (responseArr[i] - responseArr[i - 1]) / dt;
    if (slope > maxSlope) {
      maxSlope = slope;
      infIdx = i;
    }
  }

  // Prevent division by zero
  if (maxSlope === 0) maxSlope = 1e-6;

  // L is the x-intercept of the tangent line at the inflection point
  // y - y_inf = m(t - t_inf)  -->  0 = m(L - t_inf) + y_inf  -->  L = t_inf - y_inf / m
  let L = timeArr[infIdx] - responseArr[infIdx] / maxSlope;
  if (L < 0.01) L = 0.01; // Clamp

  // Time constant T = dcGain / maxSlope
  const T = dcGain / maxSlope;

  // Generate tangent line array clamped between 0 and dcGain
  const tangentArr = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let y = maxSlope * (timeArr[i] - timeArr[infIdx]) + responseArr[infIdx];
    if (y < 0) y = 0;
    if (y > dcGain) y = dcGain;
    tangentArr[i] = y;
  }

  // Z-N Rules
  const tuning: ZieglerNicholsTuning = {
    P: { 
      Kp: T / (dcGain * L) 
    },
    PI: { 
      Kp: (0.9 * T) / (dcGain * L),
      Ki: ((0.9 * T) / (dcGain * L)) / (L / 0.3)
    },
    PID: { 
      Kp: (1.2 * T) / (dcGain * L),
      Ki: ((1.2 * T) / (dcGain * L)) / (2 * L),
      Kd: ((1.2 * T) / (dcGain * L)) * (0.5 * L)
    }
  };

  return {
    tangentArr,
    L,
    T,
    tuning
  };
}
