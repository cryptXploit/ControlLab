import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';
import { simulateSecondOrderStep } from '@/core/engine/solver';
import { calculateZieglerNicholsOpenLoop } from '@/core/engine/autotune';
import { useZieglerNicholsStore } from '@/store/useZieglerNicholsStore';
import { SaveDialog } from '@/components/ui/SaveDialog';
import { projectService } from '@/services/storage/projectService';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';
import { HapticService } from '@/services/haptics/HapticService';

export default function ZieglerNicholsLab() {
  const { t } = useTranslation();
  
  const [K, setK] = useState(1.0);
  const [zeta, setZeta] = useState(1.5);
  const [wn, setWn] = useState(2.0);

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const { isDirty, markDirty, markClean } = useZieglerNicholsStore();

  useEffect(() => {
    markDirty();
  }, [K, zeta, wn, markDirty]);

  const result = useMemo(() => {
    // Generate S-curve (Overdamped step response)
    const simResult = simulateSecondOrderStep(K, zeta, wn, 15, 0.01);
    
    // Autotune analysis
    const znResult = calculateZieglerNicholsOpenLoop(simResult.time, simResult.output, K);
    
    return {
      time: simResult.time,
      output: simResult.output,
      ...znResult
    };
  }, [K, zeta, wn]);

  const handleSave = async (name: string) => {
    await projectService.createProject(
      name,
      'ZIEGLER_NICHOLS',
      { K, zeta, wn },
      'Ziegler-Nichols Open-Loop Autotuner'
    );
    HapticService.triggerSuccess();
    useToastStore.getState().showToast((t as any)('messages.projectSaved') || 'Project saved successfully', 'success');
    markClean();
    setIsSaveOpen(false);
  };

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.zieglerNichols.title') || 'Ziegler-Nichols Autotuner'}
        actions={
          <div className="flex gap-2 relative z-10">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSaveOpen(true)}
              className="relative overflow-hidden"
            >
              <Save className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">{(t as any)('common.save') || 'Save'}</span>
              {isDirty && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-status-warning rounded-full border-2 border-accent-primary transform translate-x-1/3 -translate-y-1/3" />
              )}
            </Button>
          </div>
        }
        graph={
          <div className="flex flex-col h-full gap-4">
            <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Reaction Curve (Blue) vs Tangent (Amber)</h4>
            <div className="flex-1 min-h-[300px]">
              <Graph time={result.time} output={result.output} outputB={result.tangentArr} />
            </div>
            <div className="bg-background-base rounded-xl border border-border-subtle overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-secondary uppercase bg-background-surface border-b border-border-subtle">
                    <tr>
                      <th className="px-4 py-3 font-semibold">{(t as any)('labels.controller') || 'Controller'}</th>
                      <th className="px-4 py-3 font-semibold">Kp</th>
                      <th className="px-4 py-3 font-semibold">Ki</th>
                      <th className="px-4 py-3 font-semibold">Kd</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-text-primary">
                    <tr className="hover:bg-background-surface/50 transition-colors">
                      <td className="px-4 py-3 font-medium">P</td>
                      <td className="px-4 py-3 font-mono">{result.tuning.P.Kp.toFixed(3)}</td>
                      <td className="px-4 py-3 font-mono text-text-muted">-</td>
                      <td className="px-4 py-3 font-mono text-text-muted">-</td>
                    </tr>
                    <tr className="hover:bg-background-surface/50 transition-colors">
                      <td className="px-4 py-3 font-medium">PI</td>
                      <td className="px-4 py-3 font-mono">{result.tuning.PI.Kp.toFixed(3)}</td>
                      <td className="px-4 py-3 font-mono">{result.tuning.PI.Ki.toFixed(3)}</td>
                      <td className="px-4 py-3 font-mono text-text-muted">-</td>
                    </tr>
                    <tr className="hover:bg-background-surface/50 transition-colors">
                      <td className="px-4 py-3 font-medium">PID</td>
                      <td className="px-4 py-3 font-mono">{result.tuning.PID.Kp.toFixed(3)}</td>
                      <td className="px-4 py-3 font-mono">{result.tuning.PID.Ki.toFixed(3)}</td>
                      <td className="px-4 py-3 font-mono">{result.tuning.PID.Kd.toFixed(3)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
        controls={
          <div className="flex flex-col gap-4">
            <Card className="p-3 bg-background-base border-border-subtle">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-2">
                {(t as any)('labels.overdampedPlant') || 'Overdamped Plant'}
              </h5>
              <div className="flex flex-col gap-1">
                <SliderField label={(t as any)('params.gain') || 'Gain (K)'} max={10} min={0.1} step={0.1} value={K} onChange={setK} />
                <SliderField label={(t as any)('params.zeta') || 'Damping (zeta)'} max={5.0} min={1.0} step={0.1} value={zeta} onChange={setZeta} />
                <SliderField label={(t as any)('params.wn') || 'Natural Freq (wn)'} max={10.0} min={0.1} step={0.1} value={wn} onChange={setWn} />
              </div>
            </Card>
          </div>
        }
        metrics={
          <>
            <MetricCard 
              label={(t as any)('labels.deadTime') || 'Dead Time (L)'} 
              value={result.L.toFixed(3)} 
              unit="s" 
            />
            <MetricCard 
              label={(t as any)('labels.timeConstant') || 'Time Constant (T)'} 
              value={result.T.toFixed(3)} 
              unit="s" 
            />
          </>
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">
              {(t as any)('tools.zieglerNichols.desc') || 'Extract PID parameters via open-loop reaction curve analysis.'}
            </p>
          </Card>
        }
      />
      <SaveDialog
        isOpen={isSaveOpen}
        onCancel={() => setIsSaveOpen(false)}
        onSave={handleSave}
        defaultName="Ziegler-Nichols Tuning"
      />
    </div>
  );
}
