import type { SimulationResult } from './types';

export function simulateDummySystem(
  gain: number,
  timeConstant: number,
  duration: number,
  stepSize: number
): SimulationResult {
  const numSteps = Math.ceil(duration / stepSize) + 1;
  const time = new Float32Array(numSteps);
  const output = new Float32Array(numSteps);

  for (let i = 0; i < numSteps; i++) {
    const t = i * stepSize;
    time[i] = t;
    output[i] = gain * (1 - Math.exp(-t / timeConstant));
  }

  return {
    time,
    output,
    metrics: {
      steadyState: gain,
      settlingTime: 4 * timeConstant
    }
  };
}

export function simulateFirstOrderStep(
  K: number,
  tau: number,
  duration: number,
  stepSize: number
): SimulationResult {
  const numSteps = Math.ceil(duration / stepSize) + 1;
  const time = new Float32Array(numSteps);
  const output = new Float32Array(numSteps);

  for (let i = 0; i < numSteps; i++) {
    const t = i * stepSize;
    time[i] = t;
    output[i] = K * (1 - Math.exp(-t / tau));
  }

  return {
    time,
    output,
    metrics: {
      riseTime: 2.2 * tau,
      settlingTime: 4.0 * tau,
      steadyStateError: Math.abs(1 - K),
      overshoot: 0,
      isStable: tau > 0 ? 1 : 0
    }
  };
}

export function simulateSecondOrderStep(
  K: number,
  zeta: number,
  wn: number,
  duration: number,
  stepSize: number
): SimulationResult {
  const numSteps = Math.ceil(duration / stepSize) + 1;
  const time = new Float32Array(numSteps);
  const output = new Float32Array(numSteps);

  for (let i = 0; i < numSteps; i++) {
    const t = i * stepSize;
    time[i] = t;
    
    if (zeta < 1.0) {
      // Underdamped
      const wd = wn * Math.sqrt(1 - zeta * zeta);
      output[i] = K * (1 - Math.exp(-zeta * wn * t) * (Math.cos(wd * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t)));
    } else if (zeta === 1.0) {
      // Critically damped
      output[i] = K * (1 - Math.exp(-wn * t) * (1 + wn * t));
    } else {
      // Overdamped
      const s1 = -zeta * wn + wn * Math.sqrt(zeta * zeta - 1);
      const s2 = -zeta * wn - wn * Math.sqrt(zeta * zeta - 1);
      output[i] = K * (1 + (1 / (s2 - s1)) * (s1 * Math.exp(s2 * t) - s2 * Math.exp(s1 * t)));
    }
  }

  const overshoot = zeta < 1.0 ? 100 * Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta * zeta)) : 0;
  const peakTime = zeta < 1.0 ? Math.PI / (wn * Math.sqrt(1 - zeta * zeta)) : 0;
  const settlingTime = 4 / (zeta * wn); // Approx 2% criterion

  return {
    time,
    output,
    metrics: {
      overshoot,
      peakTime,
      settlingTime,
      steadyStateError: Math.abs(1 - K)
    }
  };
}

export function simulatePIDStep(
  Kp: number,
  Ki: number,
  Kd: number,
  setpoint: number,
  duration: number,
  stepSize: number
): SimulationResult {
  const numSteps = Math.ceil(duration / stepSize) + 1;
  const time = new Float32Array(numSteps);
  const output = new Float32Array(numSteps);
  const setpointArr = new Float32Array(numSteps);

  let y = 0, y_vel = 0, integral = 0, prev_error = 0;
  let maxVal = 0;

  for (let i = 0; i < numSteps; i++) {
    const t = i * stepSize;
    time[i] = t;
    setpointArr[i] = setpoint;

    const error = setpoint - y;
    integral += error * stepSize;
    
    // Simple anti-windup
    if (integral > 100) integral = 100;
    if (integral < -100) integral = -100;

    const derivative = (error - prev_error) / stepSize;
    const u = (Kp * error) + (Ki * integral) + (Kd * derivative);
    
    // Plant dynamics: y'' + 2*y' + 1*y = u(t)
    const y_accel = u - (2.0 * y_vel) - (1.0 * y);
    y_vel += y_accel * stepSize;
    y += y_vel * stepSize;
    
    output[i] = y;
    prev_error = error;
    
    if (y > maxVal) {
      maxVal = y;
    }
  }

  const finalOutput = output[numSteps - 1];
  const steadyStateError = Math.abs(setpoint - finalOutput);
  
  let overshoot = 0;
  if (setpoint > 0 && maxVal > setpoint) {
    overshoot = ((maxVal - setpoint) / setpoint) * 100;
  }

  // Calculate settling time (2% criterion)
  let settlingTime = duration;
  const tolerance = 0.02 * Math.abs(setpoint);
  for (let i = numSteps - 1; i >= 0; i--) {
    if (Math.abs(output[i] - setpoint) > tolerance) {
      settlingTime = time[Math.min(i + 1, numSteps - 1)];
      break;
    }
  }

  return {
    time,
    output,
    setpoint: setpointArr,
    metrics: {
      overshoot,
      steadyStateError,
      settlingTime
    }
  };
}

export function simulateDCMotor(
  Kp: number,
  Kd: number,
  setpoint: number,
  duration: number,
  stepSize: number
): SimulationResult {
  const numSteps = Math.ceil(duration / stepSize) + 1;
  const time = new Float32Array(numSteps);
  const output = new Float32Array(numSteps);
  const setpointArr = new Float32Array(numSteps);

  const J = 0.01; // Inertia
  const b = 0.1;  // Friction

  let theta = 0;
  let theta_dot = 0;
  let prev_error = setpoint;
  
  let maxVal = 0;

  for (let i = 0; i < numSteps; i++) {
    const t = i * stepSize;
    time[i] = t;
    setpointArr[i] = setpoint;

    const error = setpoint - theta;
    const derivative = (error - prev_error) / stepSize;
    const u = (Kp * error) + (Kd * derivative); // PD Control
    
    // Newton's Second Law for Rotation: J * theta_ddot + b * theta_dot = u
    const theta_ddot = (u - (b * theta_dot)) / J;
    
    theta_dot += theta_ddot * stepSize;
    theta += theta_dot * stepSize;
    
    output[i] = theta;
    prev_error = error;
    
    if (theta > maxVal) {
      maxVal = theta;
    }
  }

  const finalOutput = output[numSteps - 1];
  const steadyStateError = Math.abs(setpoint - finalOutput);
  
  let overshoot = 0;
  if (setpoint > 0 && maxVal > setpoint) {
    overshoot = ((maxVal - setpoint) / setpoint) * 100;
  }

  let settlingTime = duration;
  const tolerance = 0.02 * Math.abs(setpoint);
  for (let i = numSteps - 1; i >= 0; i--) {
    if (Math.abs(output[i] - setpoint) > tolerance) {
      settlingTime = time[Math.min(i + 1, numSteps - 1)];
      break;
    }
  }

  return {
    time,
    output,
    setpoint: setpointArr,
    metrics: {
      overshoot,
      steadyStateError,
      settlingTime
    }
  };
}

export function simulateDisturbanceRejection(
  Kp: number,
  Ki: number,
  Kd: number,
  distMag: number,
  distTime: number,
  duration: number,
  stepSize: number
): SimulationResult & { disturbance: Float32Array } {
  const numSteps = Math.ceil(duration / stepSize) + 1;
  const time = new Float32Array(numSteps);
  const output = new Float32Array(numSteps);
  const disturbance = new Float32Array(numSteps);
  const setpointArr = new Float32Array(numSteps);

  const setpoint = 1.0;
  let y = 0, y_vel = 0, integral = 0, prev_error = setpoint;

  for (let i = 0; i < numSteps; i++) {
    const t = i * stepSize;
    time[i] = t;
    setpointArr[i] = setpoint;

    const error = setpoint - y;
    integral += error * stepSize;
    
    // Anti-windup
    if (integral > 100) integral = 100;
    if (integral < -100) integral = -100;

    const derivative = (error - prev_error) / stepSize;
    const u = (Kp * error) + (Ki * integral) + (Kd * derivative);
    
    const d = t >= distTime ? distMag : 0;
    disturbance[i] = d;

    const v = u + d;
    
    // Plant: 1 / (s^2 + 2s + 1)
    // y'' + 2y' + y = v
    const y_accel = v - (2.0 * y_vel) - y;
    y_vel += y_accel * stepSize;
    y += y_vel * stepSize;
    
    output[i] = y;
    prev_error = error;
  }

  const finalOutput = output[numSteps - 1];
  const steadyStateError = Math.abs(setpoint - finalOutput);

  return {
    time,
    output,
    disturbance,
    setpoint: setpointArr,
    metrics: {
      steadyStateError
    }
  };
}
