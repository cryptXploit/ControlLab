export function explainFirstOrder(K: number, tau: number): { whyKey: string; actionKey: string } {
  let whyKey = '';
  let actionKey = '';

  if (tau > 2.0) {
    whyKey = 'explain.firstOrder.sluggish.why';
    actionKey = 'explain.firstOrder.sluggish.action';
  } else if (tau < 0.5) {
    whyKey = 'explain.firstOrder.fast.why';
    actionKey = 'explain.firstOrder.fast.action';
  } else {
    whyKey = 'explain.firstOrder.balanced.why';
    actionKey = 'explain.firstOrder.balanced.action';
  }

  // To keep the signature simple and static, we'll map the steady state error separately if needed,
  // or we can just bake the K logic into the keys. Let's bake it into the keys.
  if (K !== 1) {
    whyKey += '.error';
  } else {
    whyKey += '.perfect';
  }

  return { whyKey, actionKey };
}

export function explainSecondOrder(K: number, zeta: number, _wn: number): { whyKey: string; actionKey: string } {
  let whyKey = '';
  let actionKey = '';

  if (zeta < 1.0) {
    whyKey = 'explain.secondOrder.underdamped.why';
    actionKey = 'explain.secondOrder.underdamped.action';
  } else if (zeta === 1.0) {
    whyKey = 'explain.secondOrder.critical.why';
    actionKey = 'explain.secondOrder.critical.action';
  } else {
    whyKey = 'explain.secondOrder.overdamped.why';
    actionKey = 'explain.secondOrder.overdamped.action';
  }

  if (K !== 1) {
    whyKey += '.error';
  } else {
    whyKey += '.perfect';
  }

  return { whyKey, actionKey };
}

export function explainPID(_Kp: number, Ki: number, _Kd: number, overshoot: number, steadyStateError: number): { whyKey: string; actionKey: string } {
  if (overshoot > 20) {
    return {
      whyKey: 'explain.pid.highOvershoot.why',
      actionKey: 'explain.pid.highOvershoot.action'
    };
  } else if (steadyStateError > 0.05 && Ki === 0) {
    return {
      whyKey: 'explain.pid.steadyStateErrorNoKi.why',
      actionKey: 'explain.pid.steadyStateErrorNoKi.action'
    };
  } else if (steadyStateError > 0.05) {
    return {
      whyKey: 'explain.pid.steadyStateErrorWithKi.why',
      actionKey: 'explain.pid.steadyStateErrorWithKi.action'
    };
  } else {
    return {
      whyKey: 'explain.pid.trackingEffective.why',
      actionKey: 'explain.pid.trackingEffective.action'
    };
  }
}

export function explainDCMotor(Kp: number, Kd: number, overshoot: number): { whyKey: string; actionKey: string } {
  if (overshoot > 5) {
    return {
      whyKey: 'explain.dcMotor.overshoot.why',
      actionKey: 'explain.dcMotor.overshoot.action'
    };
  } else if (Kd > Kp) {
    return {
      whyKey: 'explain.dcMotor.sluggish.why',
      actionKey: 'explain.dcMotor.sluggish.action'
    };
  } else {
    return {
      whyKey: 'explain.dcMotor.smooth.why',
      actionKey: 'explain.dcMotor.smooth.action'
    };
  }
}
