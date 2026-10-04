import { useState, useMemo } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';

export default function NyquistLab() {
  const { t } = useTranslation();
  const [K, setK] = useState(1.0);
  const [zeta, setZeta] = useState(0.5);
  const [wn, setWn] = useState(10.0);

  const result = useMemo(() => {
    // Generate linear-spaced w values to capture the curve shape smoothly
    const numSteps = 200;
    const realAxis = new Float32Array(numSteps * 2);
    const imagAxis = new Float32Array(numSteps * 2);

    // We sweep w from a small number to a large number
    const wMax = wn * 5; 
    
    // Positive frequencies
    for (let i = 0; i < numSteps; i++) {
      const currentW = (i / (numSteps - 1)) * wMax + 0.01;

      // G(jw) = K * wn^2 / ( (wn^2 - w^2) + j(2*zeta*wn*w) )
      const realDenom = wn*wn - currentW*currentW;
      const imagDenom = 2 * zeta * wn * currentW;
      
      const denomMagSq = realDenom*realDenom + imagDenom*imagDenom;
      
      const real = (K * wn*wn * realDenom) / denomMagSq;
      const imag = (K * wn*wn * -imagDenom) / denomMagSq;
      
      // Store positive frequency curve
      realAxis[numSteps + i] = real;
      imagAxis[numSteps + i] = imag;

      // Store negative frequency curve (complex conjugate)
      realAxis[numSteps - 1 - i] = real;
      imagAxis[numSteps - 1 - i] = -imag;
    }
    
    // Find (-1, 0) point for stability context
    const criticalX = new Float32Array(1);
    const criticalY = new Float32Array(1);
    criticalX[0] = -1;
    criticalY[0] = 0;

    // Check stability (for this system, it's always stable for K > 0, zeta > 0)
    const isStable = true; 

    return { realAxis, imagAxis, criticalX, criticalY, isStable };
  }, [K, zeta, wn]);

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.nyquist.title') || 'Nyquist Plot'}
        actions={null}
        graph={
          <div className="flex flex-col h-full relative">
            {/* The Graph expects time (x) and output (y). We pass real (x) and imag (y). */}
            <Graph output={result.imagAxis} time={result.realAxis} />
            <div className="absolute top-2 left-2 bg-background-base/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-text-muted border border-border-subtle">
              Re vs Im
            </div>
          </div>
        }
        controls={
          <>
            <SliderField label="Gain (K)" max={5} min={0.1} step={0.1} value={K} onChange={setK} />
            <SliderField label="Damping (ζ)" max={2} min={0.05} step={0.05} value={zeta} onChange={setZeta} />
            <SliderField label="Natural Freq (ωn)" max={50} min={1} step={1} value={wn} onChange={setWn} />
          </>
        }
        metrics={
          <>
            <MetricCard label="Encirclements of -1" unit="N" value={0} />
            <div className="col-span-2">
              <MetricCard 
                label="Nyquist Stability Criterion" 
                unit="" 
                value={result.isStable ? "Stable (Z = N + P = 0)" : "Unstable"} 
              />
            </div>
          </>
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">
              The Nyquist plot maps the frequency response of the open-loop system <span className="font-mono text-accent-primary">G(jω)</span> in the complex plane. 
              It is used to evaluate closed-loop stability using the criterion <span className="font-mono">Z = N + P</span>.
            </p>
            <div className="text-xs text-text-secondary bg-background-base p-2 rounded inline-block">
              <strong className="text-text-primary">Observation:</strong> The curve does not encircle the critical point (-1, 0), confirming stability for all <span className="font-mono">K {'>'} 0</span> in this 2nd-order system.
            </div>
          </Card>
        }
      />
    </div>
  );
}
