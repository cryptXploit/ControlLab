import { useState, useMemo } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';

export default function RootLocusLab() {
  const { t } = useTranslation();
  const [zeta, setZeta] = useState(0.5);
  const [wn, setWn] = useState(10.0);

  const result = useMemo(() => {
    // We plot the roots of s^2 + 2*zeta*wn*s + K*wn^2 = 0 
    // as K goes from 0 to 5.
    // The roots are s = -zeta*wn +/- sqrt( (zeta*wn)^2 - K*wn^2 )
    // Let's generate a trace of roots for various K.
    
    const numSteps = 100;
    const realAxis = new Float32Array(numSteps * 2);
    const imagAxis = new Float32Array(numSteps * 2);

    for (let i = 0; i < numSteps; i++) {
      const K = (i / (numSteps - 1)) * 5.0; // sweep K from 0 to 5
      
      const discriminant = (zeta * wn) * (zeta * wn) - K * wn * wn;
      
      if (discriminant >= 0) {
        // Real roots
        const root1 = -zeta * wn + Math.sqrt(discriminant);
        const root2 = -zeta * wn - Math.sqrt(discriminant);
        realAxis[i * 2] = root1;
        imagAxis[i * 2] = 0;
        realAxis[i * 2 + 1] = root2;
        imagAxis[i * 2 + 1] = 0;
      } else {
        // Complex conjugate roots
        const real = -zeta * wn;
        const imag = Math.sqrt(-discriminant);
        realAxis[i * 2] = real;
        imagAxis[i * 2] = imag;
        realAxis[i * 2 + 1] = real;
        imagAxis[i * 2 + 1] = -imag;
      }
    }

    return { realAxis, imagAxis };
  }, [zeta, wn]);

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.rootLocus.title') || 'Root Locus'}
        actions={null}
        graph={
          <div className="flex flex-col h-full relative">
            <Graph output={result.imagAxis} time={result.realAxis} />
            <div className="absolute top-2 left-2 bg-background-base/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-text-muted border border-border-subtle">
              Re vs Im (K sweep)
            </div>
          </div>
        }
        controls={
          <>
            <SliderField label="Damping (ζ)" max={2} min={0.05} step={0.05} value={zeta} onChange={setZeta} />
            <SliderField label="Natural Freq (ωn)" max={50} min={1} step={1} value={wn} onChange={setWn} />
          </>
        }
        metrics={
          <>
            <MetricCard label="Open-loop Poles" unit="" value="2" />
            <div className="col-span-2">
              <MetricCard 
                label="Asymptotes" 
                unit="" 
                value="2 at ±90°" 
              />
            </div>
          </>
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">
              The Root Locus shows the trajectories of the closed-loop poles as the proportional gain <span className="font-mono text-accent-primary">K</span> varies from 0 to ∞.
            </p>
            <div className="text-xs text-text-secondary bg-background-base p-2 rounded inline-block">
              <strong className="text-text-primary">Observation:</strong> The branches start at the open-loop poles and travel vertically into the complex plane as <span className="font-mono">K</span> increases, indicating decreasing damping ratio.
            </div>
          </Card>
        }
      />
    </div>
  );
}
