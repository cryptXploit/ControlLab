import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';
import { evaluateSecondOrderFrequencyResponse, calculateMargins } from '@/core/engine/frequency';
import { useMarginStore } from '@/store/useMarginStore';
import { SaveDialog } from '@/components/ui/SaveDialog';
import { projectService } from '@/services/storage/projectService';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function MarginLab() {
  const { t } = useTranslation();
  const [K, setK] = useState(1.0);
  const [zeta, setZeta] = useState(0.5);
  const [wn, setWn] = useState(10.0);
  
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const { isDirty, markDirty, markClean } = useMarginStore();

  useEffect(() => {
    markDirty();
  }, [K, zeta, wn, markDirty]);

  const result = useMemo(() => {
    const numSteps = 150;
    const w = new Float32Array(numSteps);
    const mag = new Float32Array(numSteps);
    const phase = new Float32Array(numSteps);
    const wLinear = new Float32Array(numSteps);

    const logMin = -1; // 0.1 rad/s
    const logMax = 2; // 100 rad/s
    
    for (let i = 0; i < numSteps; i++) {
      const logW = logMin + (logMax - logMin) * (i / (numSteps - 1));
      const currentW = Math.pow(10, logW);
      w[i] = logW;
      wLinear[i] = currentW;

      const { magDb, phaseDeg } = evaluateSecondOrderFrequencyResponse(K, zeta, wn, currentW);
      mag[i] = magDb;
      phase[i] = phaseDeg;
    }

    const margins = calculateMargins(wLinear, mag, phase);

    return { time: w, mag, phase, margins };
  }, [K, zeta, wn]);

  const handleSave = async (name: string) => {
    await projectService.createProject(
      name,
      'MARGIN',
      { K, zeta, wn },
      'Stability Margin Analysis'
    );
    markClean();
  };

  const formatVal = (val: number) => {
    if (!isFinite(val)) return '∞';
    return val.toFixed(2);
  };

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.margin.title') || 'Stability Margins'}
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
          <div className="flex flex-col gap-4 h-full min-h-[400px]">
            <div className="flex-1 min-h-[200px]">
              <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Magnitude (dB) vs log(ω)</h4>
              <Graph 
                output={result.mag} 
                time={result.time}
              />
            </div>
            <div className="flex-1 min-h-[200px]">
              <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Phase (deg) vs log(ω)</h4>
              <Graph 
                output={result.phase} 
                time={result.time}
              />
            </div>
          </div>
        }
        controls={
          <>
            <SliderField label={(t as any)('params.gain') || 'Gain (K)'} max={10} min={0.1} step={0.1} value={K} onChange={setK} />
            <SliderField label={(t as any)('params.zeta') || 'Damping (ζ)'} max={2} min={0.05} step={0.05} value={zeta} onChange={setZeta} />
            <SliderField label={(t as any)('params.wn') || 'Natural Freq (ωn)'} max={50} min={1} step={1} value={wn} onChange={setWn} />
          </>
        }
        metrics={
          <>
            <MetricCard label="Gain Margin" unit="dB" value={formatVal(result.margins.GM)} />
            <MetricCard label="Phase Margin" unit="deg" value={formatVal(result.margins.PM)} />
            <MetricCard label="ω Phase Cross" unit="rad/s" value={formatVal(result.margins.w_pc)} />
            <MetricCard label="ω Gain Cross" unit="rad/s" value={formatVal(result.margins.w_gc)} />
          </>
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">
              Gain Margin (GM) indicates how much the gain can increase before instability. Phase Margin (PM) indicates how much phase lag can be added before instability.
            </p>
            <div className="text-xs text-text-secondary bg-background-base p-2 rounded inline-block">
              <strong className="text-text-primary">Status:</strong> {(!isFinite(result.margins.GM) || result.margins.GM > 0) && (!isFinite(result.margins.PM) || result.margins.PM > 0) ? 'System is Robustly Stable' : 'System is Marginally Stable / Unstable'}
            </div>
          </Card>
        }
      />
      <SaveDialog
        isOpen={isSaveOpen}
        onCancel={() => setIsSaveOpen(false)}
        onSave={handleSave}
        defaultName="Margin Analysis"
      />
    </div>
  );
}
