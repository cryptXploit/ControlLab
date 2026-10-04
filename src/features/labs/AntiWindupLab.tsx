import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/store/useLocaleStore';
import { SimulatorWorkspace } from '@/components/workspace/SimulatorWorkspace';
import { SliderField } from '@/components/ui/SliderField';
import { MetricCard } from '@/components/ui/MetricCard';
import { Card } from '@/components/ui/Card';
import Graph from '@/components/Graph';
import { simulateWindupComparison } from '@/core/engine/solver';
import { useAntiWindupStore } from '@/store/useAntiWindupStore';
import { SaveDialog } from '@/components/ui/SaveDialog';
import { projectService } from '@/services/storage/projectService';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function AntiWindupLab() {
  const { t } = useTranslation();
  
  const [Kp, setKp] = useState(2.0);
  const [Ki, setKi] = useState(5.0);
  const [Kd, setKd] = useState(1.0);
  const [satLimit, setSatLimit] = useState(2.0);

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const { isDirty, markDirty, markClean } = useAntiWindupStore();

  useEffect(() => {
    markDirty();
  }, [Kp, Ki, Kd, satLimit, markDirty]);

  const result = useMemo(() => {
    return simulateWindupComparison(Kp, Ki, Kd, satLimit, 15, 0.01);
  }, [Kp, Ki, Kd, satLimit]);

  const handleSave = async (name: string) => {
    await projectService.createProject(
      name,
      'ANTI_WINDUP',
      { Kp, Ki, Kd, satLimit },
      'Anti-Windup Analysis'
    );
    markClean();
  };

  return (
    <div className="w-full flex flex-col flex-1">
      <SimulatorWorkspace 
        title={(t as any)('tools.antiWindup.title') || 'Anti-Windup Inspector'}
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
            <div className="flex-1 min-h-[300px]">
              <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">
                With Anti-Windup (Blue) vs Without Anti-Windup (Amber)
              </h4>
              <Graph 
                time={result.time}
                output={result.responseAntiWindup} 
                outputB={result.responseWindup}
                setpoint={result.setpoint}
              />
            </div>
          </div>
        }
        controls={
          <div className="flex flex-col gap-4">
            <Card className="p-3 bg-background-base border-border-subtle">
              <h5 className="text-[10px] font-bold text-graph-primary uppercase mb-2">
                {(t as any)('controls.pidGains') || 'Controller Gains'}
              </h5>
              <div className="flex flex-col gap-1">
                <SliderField label="Kp" max={20} min={0} step={0.1} value={Kp} onChange={setKp} />
                <SliderField label="Ki" max={20} min={0} step={0.1} value={Ki} onChange={setKi} />
                <SliderField label="Kd" max={20} min={0} step={0.1} value={Kd} onChange={setKd} />
              </div>
            </Card>

            <Card className="p-3 bg-background-base border-border-subtle">
              <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-2">
                Actuator Constraints
              </h5>
              <div className="flex flex-col gap-1">
                <SliderField 
                  label={(t as any)('labels.saturationLimit') || 'Saturation Limit'} 
                  max={10} min={0.5} step={0.1} 
                  value={satLimit} 
                  onChange={setSatLimit} 
                />
              </div>
            </Card>
          </div>
        }
        metrics={
          <>
            <MetricCard label="SSE (Clamped)" value={result.metrics.antiWindupSSE.toFixed(4)} />
            <MetricCard label="SSE (Windup)" value={result.metrics.windupSSE.toFixed(4)} />
          </>
        }
        explanation={
          <Card className="p-4 bg-background-surface border border-accent-primary/20">
            <p className="text-sm text-text-primary mb-2 leading-relaxed">
              When an actuator saturates, the standard PID integrator continues accumulating error (Windup), causing massive overshoot upon recovery (Amber). The Anti-Windup algorithm (Blue) halts integration during saturation, resulting in a clean, controlled recovery.
            </p>
          </Card>
        }
      />
      <SaveDialog
        isOpen={isSaveOpen}
        onCancel={() => setIsSaveOpen(false)}
        onSave={handleSave}
        defaultName="Anti-Windup Analysis"
      />
    </div>
  );
}
