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
