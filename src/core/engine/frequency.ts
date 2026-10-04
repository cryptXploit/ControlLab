/**
 * Standard utility to evaluate the frequency response of a 2nd-order system:
 * G(jw) = K * wn^2 / ( (wn^2 - w^2) + j(2*zeta*wn*w) )
 */
export function evaluateSecondOrderFrequencyResponse(K: number, zeta: number, wn: number, w: number) {
  const realDenom = wn * wn - w * w;
  const imagDenom = 2 * zeta * wn * w;
  
  const denomMagSq = realDenom * realDenom + imagDenom * imagDenom;
  
  const real = (K * wn * wn * realDenom) / denomMagSq;
  const imag = (K * wn * wn * -imagDenom) / denomMagSq;
  
  const denomMag = Math.sqrt(denomMagSq);
  const magVal = (K * wn * wn) / denomMag;
  const magDb = 20 * Math.log10(magVal);
  
  let phaseRad = -Math.atan2(imagDenom, realDenom); // Angle of 1/denom
  if (phaseRad > 0) phaseRad -= 2 * Math.PI; // Keep it continuous
  const phaseDeg = (phaseRad * 180) / Math.PI;

  return { real, imag, magDb, phaseDeg };
}

export function calculateMargins(wArr: Float32Array, magDbArr: Float32Array, phaseDegArr: Float32Array) {
  let w_gc = Infinity; // Gain Crossover Frequency (where Mag = 0dB)
  let w_pc = Infinity; // Phase Crossover Frequency (where Phase = -180deg)
  
  let PM = Infinity;
  let GM = Infinity;

  // Find crossovers via linear interpolation
  for (let i = 0; i < wArr.length - 1; i++) {
    const w1 = wArr[i];
    const w2 = wArr[i+1];
    
    const m1 = magDbArr[i];
    const m2 = magDbArr[i+1];
    
    const p1 = phaseDegArr[i];
    const p2 = phaseDegArr[i+1];

    // Gain crossover: crosses 0 dB
    if ((m1 > 0 && m2 <= 0) || (m1 < 0 && m2 >= 0)) {
      const ratio = m1 / (m1 - m2);
      w_gc = w1 + ratio * (w2 - w1);
      // Phase at w_gc
      const phaseAtGc = p1 + ratio * (p2 - p1);
      PM = 180 + phaseAtGc;
    }

    // Phase crossover: crosses -180 deg
    // Since phase might jump or wrap, we check if it crosses -180
    if ((p1 > -180 && p2 <= -180) || (p1 < -180 && p2 >= -180)) {
      // If it's a huge jump (wrapping), ignore
      if (Math.abs(p1 - p2) < 180) {
        const ratio = (p1 - (-180)) / (p1 - p2);
        w_pc = w1 + ratio * (w2 - w1);
        // Mag at w_pc
        const magAtPc = m1 + ratio * (m2 - m1);
        GM = -magAtPc;
      }
    }
  }

  return { w_gc, w_pc, GM, PM };
}
