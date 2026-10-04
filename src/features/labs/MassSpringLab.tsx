import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';
import { simulateSecondOrderStep } from '@/core/engine/solver';
import { useMassSpringStore } from '@/store/useMassSpringStore';
import { SaveDialog } from '@/components/ui/SaveDialog';
import { projectService } from '@/services/storage/projectService';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function MassSpringLab() {
  const { t } = useTranslation();
  
  const [m, setM] = useState(1.0);
  const [b, setB] = useState(2.0);
  const [k, setK] = useState(10.0);
  const [F, setF] = useState(5.0);

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const { isDirty, markDirty, markClean } = useMassSpringStore();

  useEffect(() => {
    markDirty();
  }, [m, b, k, F, markDirty]);

  const result = useMemo(() => {
    const wn = Math.sqrt(k / m);
    const zeta = b / (2 * Math.sqrt(m * k));
    const dcGain = F / k;
    
    // We pass K=1 to the solver, then scale by dcGain manually as requested, or just pass dcGain. 
    // Passing dcGain is cleaner. But to explicitly follow "Map over the returned output array and multiply every value by dcGain", I will map.
    const simResult = simulateSecondOrderStep(1.0, zeta, wn, 15, 0.01);
    
    const scaledOutput = new Float32Array(simResult.output.length);
    for (let i = 0; i < simResult.output.length; i++) {
      scaledOutput[i] = simResult.output[i] * dcGain;
    }
    
    return {
      time: simResult.time,
      output: scaledOutput,
      zeta,
      wn,
      dcGain
    };
  }, [m, b, k, F]);

  const handleSave = async (name: string) => {
    await projectService.createProject(
      name,
      'MASS_SPRING',
      { m, b, k, F },
      'Mass-Spring-Damper Physical System'
    );
    markClean();
  };

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.massSpring.title') || 'Mass-Spring-Damper'}
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
          <div className="flex flex-col h-full min-h-[400px]">
            <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">{(t as any)('labels.position') || 'Position (m)'}</h4>
            <div className="flex-1 min-h-[300px]">
              <Graph time={result.time} output={result.output} />
            </div>
          </div>
        }
        controls={
          <div className="flex flex-col gap-4">
            <Card className="p-3 bg-background-base border-border-subtle">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-2">Physical Constants</h5>
              <div className="flex flex-col gap-1">
                <SliderField label={(t as any)('labels.mass') || 'Mass (kg)'} max={10} min={0.1} step={0.1} value={m} onChange={setM} />
                <SliderField label={(t as any)('labels.damping') || 'Damping (Ns/m)'} max={20} min={0} step={0.1} value={b} onChange={setB} />
                <SliderField label={(t as any)('labels.stiffness') || 'Stiffness (N/m)'} max={50} min={0.1} step={0.1} value={k} onChange={setK} />
                <SliderField label={(t as any)('labels.force') || 'Force (N)'} max={10} min={0.1} step={0.1} value={F} onChange={setF} />
              </div>
            </Card>
          </div>
        }
        metrics={
          <>
            <MetricCard label={(t as any)('labels.dampingRatio') || 'Damping Ratio (ζ)'} value={result.zeta.toFixed(4)} />
            <MetricCard label={(t as any)('labels.naturalFreq') || 'Natural Freq (ωn)'} value={result.wn.toFixed(2)} unit="rad/s" />
            <MetricCard label={(t as any)('labels.steadyStatePos') || 'Steady-State Position'} value={result.dcGain.toFixed(4)} unit="m" />
          </>
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">
              Adjusting physical parameters like mass or stiffness directly modifies the mathematical damping ratio and natural frequency, demonstrating the connection between physical systems and control theory.
            </p>
          </Card>
        }
      />
      <SaveDialog
        isOpen={isSaveOpen}
        onCancel={() => setIsSaveOpen(false)}
        onSave={handleSave}
        defaultName="Mass-Spring System"
      />
    </div>
  );
}
