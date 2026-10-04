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

export function calculateTransferFunctionFrequencyResponse(
  numCoeffs: number[], 
  denCoeffs: number[], 
  wArr: Float32Array
) {
  const N = wArr.length;
  const magDbArr = new Float32Array(N);
  const phaseDegArr = new Float32Array(N);
  const realArr = new Float32Array(N);
  const imagArr = new Float32Array(N);
  
  const m = numCoeffs.length - 1;
  const n = denCoeffs.length - 1;

  const cNum = [...numCoeffs].reverse();
  const cDen = [...denCoeffs].reverse();

  for (let i = 0; i < N; i++) {
    const w = wArr[i];
    
    let numRe = 0, numIm = 0;
    for (let k = 0; k <= m; k++) {
      const val = cNum[k] * Math.pow(w, k);
      if (k % 4 === 0) numRe += val;
      else if (k % 4 === 1) numIm += val;
      else if (k % 4 === 2) numRe -= val;
      else if (k % 4 === 3) numIm -= val;
    }

    let denRe = 0, denIm = 0;
    for (let k = 0; k <= n; k++) {
      const val = cDen[k] * Math.pow(w, k);
      if (k % 4 === 0) denRe += val;
      else if (k % 4 === 1) denIm += val;
      else if (k % 4 === 2) denRe -= val;
      else if (k % 4 === 3) denIm -= val;
    }

    let magD2 = denRe * denRe + denIm * denIm;
    if (magD2 === 0) magD2 = 1e-10;

    const gRe = (numRe * denRe + numIm * denIm) / magD2;
    const gIm = (numIm * denRe - numRe * denIm) / magD2;
    
    realArr[i] = gRe;
    imagArr[i] = gIm;

    const mag = Math.sqrt(gRe * gRe + gIm * gIm) || 1e-10;
    magDbArr[i] = 20 * Math.log10(mag);
    phaseDegArr[i] = Math.atan2(gIm, gRe) * (180 / Math.PI);
  }

  // Basic phase unwrapping
  for (let i = 1; i < N; i++) {
    while (phaseDegArr[i] - phaseDegArr[i - 1] > 180) phaseDegArr[i] -= 360;
    while (phaseDegArr[i] - phaseDegArr[i - 1] < -180) phaseDegArr[i] += 360;
  }

  return { magDbArr, phaseDegArr, realArr, imagArr };
}
