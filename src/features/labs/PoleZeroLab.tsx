import { useState, useMemo } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';

export default function PoleZeroLab() {
  const { t } = useTranslation();
  const [zeta, setZeta] = useState(0.5);
  const [wn, setWn] = useState(10.0);

  const result = useMemo(() => {
    // Generate complex plane points (Re, Im)
    // For standard second order system: poles at -zeta*wn +/- j*wn*sqrt(1-zeta^2)
    const time = new Float32Array(3); // Real axis (x)
    const output = new Float32Array(3); // Imag axis (y)

    // Center point (origin)
    time[0] = 0; output[0] = 0;

    if (zeta < 1.0) {
      const realPart = -zeta * wn;
      const imagPart = wn * Math.sqrt(1 - zeta * zeta);
      
      time[1] = realPart; output[1] = imagPart;
      time[2] = realPart; output[2] = -imagPart;
    } else {
      const p1 = -zeta * wn + wn * Math.sqrt(zeta * zeta - 1);
      const p2 = -zeta * wn - wn * Math.sqrt(zeta * zeta - 1);
      
      time[1] = p1; output[1] = 0;
      time[2] = p2; output[2] = 0;
    }

    return { time, output };
  }, [zeta, wn]);

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.poleZero.title') || 'Pole-Zero Map'}
        actions={null}
        graph={
          <div className="flex-1 min-h-[300px] flex flex-col">
            <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Complex S-Plane (Re vs Im)</h4>
            <Graph output={result.output} time={result.time} />
            <p className="text-xs text-text-muted mt-2 text-center">Graph connects poles for visualization. X-axis = Real, Y-axis = Imaginary.</p>
          </div>
        }
        controls={
          <>
            <SliderField label={(t as any)('params.zeta') || 'Damping (ζ)'} max={2} min={0.0} step={0.05} value={zeta} onChange={setZeta} />
            <SliderField label={(t as any)('params.wn') || 'Natural Freq (ωn)'} max={50} min={1} step={1} unit="rad/s" value={wn} onChange={setWn} />
          </>
        }
        metrics={null}
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary leading-relaxed">
              Observe how the poles move on the complex plane. As Damping (ζ) increases, poles move toward the real axis. When ζ &gt; 1, poles split along the real axis.
            </p>
          </Card>
        }
      />
    </div>
  );
}
