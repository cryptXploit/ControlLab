export function explainFirstOrder(K: number, tau: number): { why: string; nextAction: string } {
  let why = '';
  let nextAction = '';

  if (tau > 2.0) {
    why = 'A large time constant (τ) makes the system sluggish, taking significantly longer to reach steady state.';
    nextAction = 'Try reducing τ to see a faster response.';
  } else if (tau < 0.5) {
    why = 'A small time constant (τ) means the system responds rapidly to input changes.';
    nextAction = 'Try increasing τ to observe how inertia delays the response.';
  } else {
    why = 'The system has a balanced response rate, reaching steady state at a moderate pace.';
    nextAction = 'Adjust K to see how it scales the final output value.';
  }

  if (K !== 1) {
    why += ` Additionally, because K = ${K.toFixed(1)}, the system will not perfectly track a unit step input (1.0), resulting in a steady-state error.`;
  } else {
    why += ` Since K = 1.0, the system perfectly tracks the unit step input with zero steady-state error.`;
  }

  return { why, nextAction };
}

export function explainSecondOrder(K: number, zeta: number, wn: number): { why: string; nextAction: string } {
  let why = '';
  let nextAction = '';

  if (zeta < 1.0) {
    why = 'The system is underdamped. It responds quickly but oscillates before settling. Overshoot is expected.';
    nextAction = 'Try increasing ζ toward 1.0 to reduce oscillation and overshoot.';
  } else if (zeta === 1.0) {
    why = 'The system is critically damped. It reaches the steady state as fast as possible without oscillating.';
    nextAction = 'Try increasing ζ to see how an overdamped system becomes sluggish.';
  } else {
    why = 'The system is overdamped. It does not oscillate, but the response is sluggish compared to critical damping.';
    nextAction = 'Try reducing ζ below 1.0 to see oscillation emerge.';
  }

  if (K !== 1) {
    why += ` Additionally, because K = ${K.toFixed(1)}, there is a steady-state error as the output won't perfectly track a unit step (1.0).`;
  }
  
  why += ` The natural frequency (ωn = ${wn.toFixed(1)} rad/s) dictates the baseline speed of the response.`;

  return { why, nextAction };
}

export function explainPID(Kp: number, Ki: number, Kd: number, overshoot: number, steadyStateError: number): { why: string; nextAction: string } {
  let why = '';
  let nextAction = '';

  if (overshoot > 20) {
    why = `With Kp=${Kp.toFixed(1)} and Kd=${Kd.toFixed(1)}, the system is exhibiting high overshoot, making it overly aggressive.`;
    nextAction = 'Try increasing Derivative gain (Kd) to add damping, or reduce Proportional gain (Kp).';
  } else if (steadyStateError > 0.05 && Ki === 0) {
    why = `Notice the steady-state error; the system cannot reach the target exactly with Proportional gain (Kp=${Kp.toFixed(1)}) alone.`;
    nextAction = 'Add Integral gain (Ki) to eliminate this gap over time.';
  } else if (steadyStateError > 0.05) {
    why = `With Kp=${Kp.toFixed(1)} and Kd=${Kd.toFixed(1)}, there is still some steady-state error remaining.`;
    nextAction = 'Try slightly increasing Integral gain (Ki) to resolve the error faster.';
  } else {
    why = `The controller (Kp=${Kp.toFixed(1)}, Ki=${Ki.toFixed(1)}, Kd=${Kd.toFixed(1)}) is tracking the setpoint effectively.`;
    nextAction = 'Fine-tune Kd to further smooth the response, or save this configuration.';
  }

  return { why, nextAction };
}

export function explainDCMotor(Kp: number, Kd: number, overshoot: number): { why: string; nextAction: string } {
  let why = '';
  let nextAction = '';

  if (overshoot > 5) {
    why = 'The motor overshoots the target angle due to rotational inertia.';
    nextAction = 'Increase Derivative gain (Kd) to act as electronic braking and absorb the inertia.';
  } else if (Kd > Kp) {
    why = 'High damping is applied. The motor moves sluggishly to the target position.';
    nextAction = 'Reduce Kd or increase Kp to speed up the rotational response.';
  } else {
    why = 'The controller smoothly drives the motor shaft to the exact target angle.';
    nextAction = 'Try increasing the target angle to see the smooth transit in action.';
  }

  return { why, nextAction };
}
