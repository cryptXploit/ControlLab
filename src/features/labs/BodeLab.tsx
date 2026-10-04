import { useState, useMemo } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';

import { evaluateSecondOrderFrequencyResponse } from '@/core/engine/frequency';

export default function BodeLab() {
  const { t } = useTranslation();
  const [K, setK] = useState(1.0);
  const [zeta, setZeta] = useState(0.5);
  const [wn, setWn] = useState(10.0);

  const result = useMemo(() => {
    // Generate log-spaced w values
    const numSteps = 100;
    const w = new Float32Array(numSteps);
    const mag = new Float32Array(numSteps);
    const phase = new Float32Array(numSteps);

    const logMin = -1; // 0.1
    const logMax = 2; // 100
    
    for (let i = 0; i < numSteps; i++) {
      const logW = logMin + (logMax - logMin) * (i / (numSteps - 1));
      const currentW = Math.pow(10, logW);
      w[i] = logW; // Use logW for linear plotting in uPlot

      const { magDb, phaseDeg } = evaluateSecondOrderFrequencyResponse(K, zeta, wn, currentW);
      mag[i] = magDb;
      phase[i] = phaseDeg;
    }

    return { time: w, output: mag, setpoint: phase };
  }, [K, zeta, wn]);

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.bode.title') || 'Bode Plot'}
        actions={null}
        graph={
          <div className="flex flex-col gap-4 h-full min-h-[400px]">
            <div className="flex-1 min-h-[200px]">
              <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Magnitude (dB) vs log(ω)</h4>
              <Graph output={result.output} time={result.time} />
            </div>
            <div className="flex-1 min-h-[200px]">
              <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Phase (deg) vs log(ω)</h4>
              <Graph output={result.setpoint} time={result.time} />
            </div>
          </div>
        }
        controls={
          <>
            <SliderField label={(t as any)('params.gain') || 'Gain (K)'} max={10} min={0.1} step={0.1} value={K} onChange={setK} />
            <SliderField label={(t as any)('params.zeta') || 'Damping (ζ)'} max={2} min={0.05} step={0.05} value={zeta} onChange={setZeta} />
            <SliderField label={(t as any)('params.wn') || 'Natural Freq (ωn)'} max={50} min={1} step={1} unit="rad/s" value={wn} onChange={setWn} />
          </>
        }
        metrics={null}
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary leading-relaxed">
              The Bode plot shows the frequency response of a 2nd-order system. Notice the resonant peak in the magnitude plot near ωn when ζ &lt; 0.707.
            </p>
          </Card>
        }
      />
    </div>
  );
}
