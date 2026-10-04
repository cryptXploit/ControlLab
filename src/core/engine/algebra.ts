export function calculateRouthArray(coeffs: number[]): { table: number[][], rhpPoles: number, isStable: boolean } {
  // coeffs is ordered from s^n down to s^0.
  const n = coeffs.length - 1;
  const table: number[][] = [];
  
  // Initialize row 0 and row 1
  const row0: number[] = [];
  const row1: number[] = [];
  for (let i = 0; i < coeffs.length; i++) {
    if (i % 2 === 0) row0.push(coeffs[i]);
    else row1.push(coeffs[i]);
  }
  table.push(row0);
  table.push(row1);
  
  const EPSILON = 1e-6;

  // Generate the rest of the array
  for (let i = 2; i <= n; i++) {
    const prev1 = table[i - 2];
    const prev2 = table[i - 1];
    const newRow: number[] = [];
    
    // Ensure pivot is not zero
    let pivot = prev2[0];
    if (Math.abs(pivot) < 1e-12) {
      pivot = EPSILON; // replace 0 with small epsilon
      prev2[0] = EPSILON; 
    }
    
    const len = Math.max(prev1.length, prev2.length) - 1;
    for (let j = 0; j < len; j++) {
      const val1 = prev1[j + 1] || 0;
      const val2 = prev2[j + 1] || 0;
      const val = (pivot * val1 - prev1[0] * val2) / pivot;
      newRow.push(val);
    }
    
    if (newRow.length === 0) newRow.push(0);
    table.push(newRow);
  }

  // Count sign changes in the first column
  let rhpPoles = 0;
  let currentSign = Math.sign(table[0][0]);
  if (currentSign === 0) currentSign = 1; // if leading term is exactly 0, assume positive epsilon
  
  for (let i = 1; i <= n; i++) {
    let val = table[i][0];
    if (Math.abs(val) < 1e-12) val = EPSILON;
    const sign = Math.sign(val);
    if (sign !== currentSign && sign !== 0) {
      rhpPoles++;
      currentSign = sign;
    }
  }

  return {
    table,
    rhpPoles,
    isStable: rhpPoles === 0
  };
}
