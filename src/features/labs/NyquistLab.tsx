import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';
import { evaluateSecondOrderFrequencyResponse } from '@/core/engine/frequency';
import { useNyquistStore } from '@/store/useNyquistStore';
import { SaveDialog } from '@/components/ui/SaveDialog';
import { projectService } from '@/services/storage/projectService';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function NyquistLab() {
  const { t } = useTranslation();
  const [K, setK] = useState(1.0);
  const [zeta, setZeta] = useState(0.5);
  const [wn, setWn] = useState(10.0);
  
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const { isDirty, markDirty, markClean } = useNyquistStore();

  // Mark dirty on change
  useEffect(() => {
    markDirty();
  }, [K, zeta, wn, markDirty]);

  const result = useMemo(() => {
    const numSteps = 200;
    const realAxis = new Float32Array(numSteps * 2);
    const imagAxis = new Float32Array(numSteps * 2);

    const wMax = wn * 5; 
    
    for (let i = 0; i < numSteps; i++) {
      const currentW = (i / (numSteps - 1)) * wMax + 0.01;

      const { real, imag } = evaluateSecondOrderFrequencyResponse(K, zeta, wn, currentW);
      
      // Positive frequency curve
      realAxis[numSteps + i] = real;
      imagAxis[numSteps + i] = imag;

      // Negative frequency curve (complex conjugate)
      realAxis[numSteps - 1 - i] = real;
      imagAxis[numSteps - 1 - i] = -imag;
    }
    
    // Stable for typical K>0, zeta>0 second order systems
    const isStable = true; 

    return { realAxis, imagAxis, isStable };
  }, [K, zeta, wn]);

  const handleSave = async (name: string) => {
    await projectService.createProject(
      name,
      'NYQUIST',
      { K, zeta, wn },
      'Nyquist Stability Analysis'
    );
    markClean();
  };

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.nyquist.title') || 'Nyquist Plot'}
        actions={
          <div className="flex gap-2 relative z-10">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSaveOpen(true)}
              className="relative overflow-hidden"
            >
              <Save className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">{(t as any)('actions.save')}</span>
              {isDirty && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-status-warning rounded-full border-2 border-accent-primary transform translate-x-1/3 -translate-y-1/3" />
              )}
            </Button>
          </div>
        }
        graph={
          <div className="flex flex-col h-full relative min-h-[400px]">
            <Graph 
              time={result.realAxis} 
              output={result.imagAxis} 
              mode={2}
              criticalPoint={{ x: -1, y: 0 }}
            />
            <div className="absolute top-2 left-2 bg-background-base/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-text-muted border border-border-subtle">
              Re vs Im
            </div>
          </div>
        }
        controls={
          <>
            <SliderField label={(t as any)('params.gain') || 'Gain (K)'} max={5} min={0.1} step={0.1} value={K} onChange={setK} />
            <SliderField label={(t as any)('params.zeta') || 'Damping (ζ)'} max={2} min={0.05} step={0.05} value={zeta} onChange={setZeta} />
            <SliderField label={(t as any)('params.wn') || 'Natural Freq (ωn)'} max={50} min={1} step={1} value={wn} onChange={setWn} />
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
              <strong className="text-text-primary">Observation:</strong> The curve does not encircle the critical point (-1, 0), confirming stability.
            </div>
          </Card>
        }
      />
      <SaveDialog
        isOpen={isSaveOpen}
        onCancel={() => setIsSaveOpen(false)}
        onSave={handleSave}
        defaultName="Nyquist Analysis"
      />
    </div>
  );
}
